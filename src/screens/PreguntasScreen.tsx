import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import PreguntasListComponente from "../Components/PreguntasListComponente";
import Header from "../Components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Resultados: { pruebaId: number };
  Preguntas: { leccionId: number; pruebaId: number };
};

type PreguntasScreenRouteProp = RouteProp<RootStackParamList, "Preguntas">;

type PreguntasScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Preguntas">;
};

const PreguntasScreen: React.FC<PreguntasScreenProps> = () => {
  const route = useRoute<PreguntasScreenRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [leccionId, setLeccionId] = useState<number | null>(null);
  const [pruebaId, setPruebaId] = useState<number | null>(null);

  useEffect(() => {
    const getLeccionId = async () => {
      try {
        if (route.params?.leccionId) {
          setLeccionId(route.params.leccionId);
        } else {
          const storedLeccionId = await AsyncStorage.getItem("currentLeccionId");
          if (storedLeccionId) {
            setLeccionId(parseInt(storedLeccionId, 10)); // Convierte a entero
          }
        }
      } catch (error) {
        console.error("Error al obtener el ID de la lección:", error);
      }
    };
  
    const getPruebaId = async () => {
      if (route.params?.pruebaId) {
        setPruebaId(route.params.pruebaId);
      } else {
        console.warn("No se recibió pruebaId desde los parámetros.");
      }
    };
  
    getLeccionId();
    getPruebaId();
  }, [route.params?.leccionId, route.params?.pruebaId]);
  
  if (!pruebaId) {
    return (
      <Text style={styles.errorText}>No se ha seleccionado una prueba.</Text>
    );
  }

  const obtenerRespuestasYCalcularPuntaje = async (
    datosUsuariosRespuestas: any
  ) => {
    try {
      let puntajeTotal = 0;
      const totalPreguntas = datosUsuariosRespuestas.length;

      for (const respuestaUsuario of datosUsuariosRespuestas) {
        const idRespuesta = respuestaUsuario.respuestas;

        if (!idRespuesta) {
          console.error(
            "ID de respuesta no válido para el usuario:",
            respuestaUsuario
          );
          continue;
        }

        const response = await fetch(
          `http://192.242.6.152:8085/arrupe/sv/arrupe/respuestas`
        );

        if (!response.ok) {
          console.error("Error al obtener las respuestas del servidor.");
          continue;
        }

        const respuestas = await response.json();

        const respuesta = respuestas.find((r: any) => r[0] === idRespuesta);

        if (respuesta && respuesta[4] === true) {
          puntajeTotal += 1;
        }
      }

      const porcentajeAciertos = (puntajeTotal / totalPreguntas) * 100;

      return porcentajeAciertos;
    } catch (error) {
      console.error("Error al calcular el puntaje:", error);
      return 0;
    }
  };

  const handleTerminarEjercicio = async (datosUsuariosRespuestas: any) => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");

      if (!storedUserId) {
        console.error("No se encontró el ID del usuario.");
        return;
      }

      const userId = parseInt(storedUserId, 10); // Convertir a número

      // Guarda las respuestas del usuario
      for (const respuesta of datosUsuariosRespuestas) {

        const response = await fetch(
          "http://192.242.6.152:8085/arrupe/sv/arrupe/usuariosRespuestas/agregar",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(respuesta), // Asegúrate de que el objeto 'respuesta' tenga el formato correcto
          }
        );

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error(
            `Error al guardar la respuesta ${respuesta.preguntas}:`,
            response.status,
            errorResponse
          );
        }
      }

      const puntajeTotal = await obtenerRespuestasYCalcularPuntaje(
        datosUsuariosRespuestas
      );

      // Si el puntaje es suficiente, completa el 20% faltante
      if (puntajeTotal >= 60) {
        if (leccionId !== null) {
          await registrarProgresoLeccion(userId, leccionId, 100);
        } else {
          console.error("No hay una lección seleccionada");
        }
      }

      const datosResultadosPrueba = {
        prueba: pruebaId,
        usuario: userId,
        puntaje: puntajeTotal,
      };

      const responseGuardarResultados = await fetch(
        "http://192.242.6.152:8085/arrupe/sv/arrupe/resultadosPrueba/agregar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosResultadosPrueba),
        }
      );

      if (!responseGuardarResultados.ok) {
        console.error("Error al guardar los resultados de la prueba.");
      } else {
        navigation.navigate("Resultados", { pruebaId: pruebaId });
      }
    } catch (error) {
      console.error("Error al guardar las respuestas:", error);
    }
  };

  const registrarProgresoLeccion = async (
    userId: number,
    leccionId: number,
    porcentajeCompletado: number
  ) => {
    const fechaActual = new Date().toISOString().slice(0, 19).replace("T", " ");
    const datosProgreso = {
      usuario: userId,
      leccion: leccionId,
      porcentajeCompletado: porcentajeCompletado,
      fecha: fechaActual,
    };

    try {
      const response = await fetch(
        "http://192.242.6.152:8085/arrupe/sv/arrupe/progresoEstudiante/agregar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosProgreso),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error al enviar progreso:", errorResponse);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud de progreso:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />
        <PreguntasListComponente
          pruebaId={pruebaId}
          onTerminarEjercicio={handleTerminarEjercicio}
          renderFooter={(datosUsuariosRespuestas: any) => (
            <TouchableOpacity
              style={styles.terminarButton}
              onPress={() => handleTerminarEjercicio(datosUsuariosRespuestas)}
            >
              <Text style={styles.terminarButtonText}>Terminar ejercicio</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#673AB7",
  },
  container: {
    flex: 1,
  },
  terminarButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: windowWidth * 0.8,
    maxWidth: 300,
    alignSelf: "center",
    marginVertical: 20,
  },
  terminarButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default PreguntasScreen;
