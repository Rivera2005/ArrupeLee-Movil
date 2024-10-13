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
  Preguntas: { leccionId: string; pruebaId: string };
};

type PreguntasScreenRouteProp = RouteProp<RootStackParamList, "Preguntas">;

type PreguntasScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Preguntas">;
};

const PreguntasScreen: React.FC<PreguntasScreenProps> = () => {
  const route = useRoute<PreguntasScreenRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [leccionId, setLeccionId] = useState<string | null>(null);
  const [pruebaId, setPruebaId] = useState<string | null>(null);

  useEffect(() => {    
    const getLeccionId = async () => {
      try {
        if (route.params?.leccionId) {
          setLeccionId(route.params.leccionId);
        } else {
          const storedLeccionId = await AsyncStorage.getItem(
            "currentLeccionId"
          );
          if (storedLeccionId) {
            setLeccionId(storedLeccionId);
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
      const totalPreguntas = datosUsuariosRespuestas.length; // Total de preguntas
      console.log(
        "datos usuario respuestas:" + JSON.stringify(datosUsuariosRespuestas)
      );

      for (const respuestaUsuario of datosUsuariosRespuestas) {
        // Usar "respuestas" como el ID de la respuesta
        const idRespuesta = respuestaUsuario.respuestas;
        console.log("ID RESPUESTA: " + idRespuesta);

        if (!idRespuesta) {
          console.error(
            "ID de respuesta no válido para el usuario:",
            respuestaUsuario
          );
          continue; // Saltar esta iteración si el ID es inválido
        }

        // Fetch para obtener si la respuesta es correcta
        const response = await fetch(
          `http://192.168.0.15:8085/arrupe/sv/arrupe/respuestas`
        );

        if (!response.ok) {
          console.error("Error al obtener las respuestas del servidor.");
          continue;
        }

        const respuestas = await response.json();
        console.log("Respuestas obtenidas del servidor:", respuestas);

        // Buscar la respuesta en la base de datos
        const respuesta = respuestas.find((r: any) => r[0] === idRespuesta);
        console.log(`Respuesta encontrada para id ${idRespuesta}:`, respuesta);

        if (respuesta && respuesta[4] === true) {
          puntajeTotal += 1; // Si es correcta, suma un punto
        }
      }

      // Calcular el porcentaje de aciertos
      const porcentajeAciertos = (puntajeTotal / totalPreguntas) * 100;

      console.log("Puntaje calculado (en porcentaje):", porcentajeAciertos);
      return porcentajeAciertos;
    } catch (error) {
      console.error("Error al calcular el puntaje:", error);
      return 0;
    }
  };

  const handleTerminarEjercicio = async (datosUsuariosRespuestas: any) => {
    console.log("Ejercicio terminado");
    console.log("Datos de respuestas del usuario:", datosUsuariosRespuestas);

    try {
      // Obtener el ID del usuario desde AsyncStorage
      const storedUserId = await AsyncStorage.getItem("userId");

      

      if (!storedUserId) {
        console.error("No se encontró el ID del usuario.");
        return;
      }

      // Convertir pruebaId a entero
      const pruebaId = parseInt(route.params?.pruebaId, 10);

      if (isNaN(pruebaId)) {
        console.error("El ID de la prueba no es válido.");
        return;
      }

      const userId = parseInt(storedUserId, 10); // Convertir a número

      // Enviar cada respuesta
      for (const respuesta of datosUsuariosRespuestas) {
        console.log("Enviando respuesta:", JSON.stringify(respuesta));

        const response = await fetch(
          "http://192.168.0.15:8085/arrupe/sv/arrupe/usuariosRespuestas/agregar",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(respuesta),
          }
        );

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error(
            `Error al guardar la respuesta ${respuesta.preguntas}:`,
            response.status,
            errorResponse
          );
        } else {
          const data = await response.json();
          console.log(
            `Respuesta ${respuesta.preguntas} guardada con éxito`,
            data
          );
        }
      }

      // Calcular puntaje total
      const puntajeTotal = await obtenerRespuestasYCalcularPuntaje(
        datosUsuariosRespuestas
      );
      console.log("El puntaje total que logo el usuario: " + puntajeTotal);

      // Enviar puntaje y otros detalles al backend
      const datosResultadosPrueba = {
        prueba: pruebaId, // El ID de la prueba como entero // El ID de la prueba recibido desde la navegación
        usuario: userId, // El ID del usuario desde AsyncStorage
        puntaje: puntajeTotal,
      };
      console.log(
        "El json que le estoy enviando a resultados Prueba: " +
          JSON.stringify(datosResultadosPrueba)
      );

      const responseGuardarResultados = await fetch(
        "http://192.168.0.15:8085/arrupe/sv/arrupe/resultadosPrueba/agregar",
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
        console.log("Navegando a Resultados con pruebaId:", pruebaId);
        console.log("Resultados de la prueba guardados con éxito.");
        navigation.navigate("Resultados", { pruebaId: pruebaId }); // Asegúrate de pasar el pruebaId aquí
      }
    } catch (error) {
      console.error("Error al guardar las respuestas:", error);
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
