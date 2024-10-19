import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import PreguntasListComponente from "../Components/PreguntasListComponente";
import Header from "../Components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAlert from "../Components/CustomAlert"; // Importa tu CustomAlert

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
  const [showAlert, setShowAlert] = useState(false); // Estado para controlar la alerta

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
          `http://192.168.0.10:8085/arrupe/sv/arrupe/respuestas`
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
          "http://192.168.0.10:8085/arrupe/sv/arrupe/usuariosRespuestas/agregar",
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
      if (puntajeTotal >= 90) {
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
        "http://192.168.0.10:8085/arrupe/sv/arrupe/resultadosPrueba/agregar",
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
        // Muestra la alerta al finalizar exitosamente
        setShowAlert(true);
        // Espera 4 segundos antes de navegar a "Resultados"
        setTimeout(() => {
          navigation.navigate("Resultados", { pruebaId: pruebaId });
        }, 3500);
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
        "http://192.168.0.10:8085/arrupe/sv/arrupe/progresoEstudiante/agregar",
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
    <ImageBackground
      source={require("../../assets/bg.png")} // Reemplaza con la URL de tu imagen o una ruta local
      style={styles.container}
    >
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.containerview}>
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

        {showAlert && (
          <CustomAlert
            message="Guardado exitosamente"
            onDismiss={() => setShowAlert(false)} // Oculta la alerta después de 4 segundos
          />
        )}
      </View>
    </SafeAreaView>
    </ImageBackground>
  );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
  },
  containerview: {
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
