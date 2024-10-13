import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ResultadoComponente from "../Components/ResultadoComponente";
import Header from "../Components/Header";
import NavigationBar from "../Components/NavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  Home: undefined;
  Resultados: { pruebaId: number }; // Recibir pruebaId
  DetalleLecciones: { id: string }
};

type ResultadosScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Resultados">;
  route: {
    params: {
      pruebaId: number; // Asegúrate de que esto esté correctamente definido
    };
  };
};

export default function ResultadosScreen({
  navigation,
  route,
}: ResultadosScreenProps) {
  const [resultados, setResultados] = useState<any[]>([]);
  const [titulo, setTitulo] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [userNombre, setUserNombre] = useState(""); // Estado para el nombre
  const [userApellido, setUserApellido] = useState(""); // Estado para el apellido

  // Obtener pruebaId de los parámetros
  const pruebaId = route.params.pruebaId;

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        // Obtener el ID del usuario de AsyncStorage
        const storedUserId = await AsyncStorage.getItem("userId");
        const storedUserNombre = await AsyncStorage.getItem("userNombre"); // Obtener el nombre
        const storedUserApellido = await AsyncStorage.getItem("userApellido"); // Obtener el apellido

        console.log("Stored User ID:", storedUserId);
        console.log("Stored User Nombre:", storedUserNombre);
        console.log("Stored User Apellido:", storedUserApellido);

        if (storedUserId) {
          setUserId(storedUserId);
        }
        if (storedUserNombre) {
          setUserNombre(storedUserNombre);
        }
        if (storedUserApellido) {
          setUserApellido(storedUserApellido);
        }

        // Obtener los resultados de la prueba filtrando por userId y pruebaId
        const responseResultados = await fetch(
          "http://192.168.0.15:8085/arrupe/sv/arrupe/resultadosPrueba"
        );
        const resultadosData = await responseResultados.json();

        // Log de resultados recibidos
        console.log("Resultados Data:", resultadosData); // Agregar este log

        const filteredResultados = resultadosData.filter((resultado: any) => {
          const resultadoUserId = resultado[2]; // userId
          const resultadoPruebaId = resultado[1]; // pruebaId

          // Asegúrate de que ambos valores sean del mismo tipo para la comparación
          console.log(
            "Comparando userId:",
            resultadoUserId,
            "con storedUserId:",
            storedUserId
          );
          console.log(
            "Comparando pruebaId:",
            resultadoPruebaId,
            "con pruebaId:",
            pruebaId
          );

          return (
            resultadoUserId.toString() === storedUserId &&
            resultadoPruebaId.toString() === pruebaId.toString()
          );
        });

        // Log para verificar resultados filtrados
        console.log("Filtered Resultados:", filteredResultados);
        if (filteredResultados.length === 0) {
          console.log("No se encontraron resultados filtrados.");
        }

        console.log("Filtered Resultados:", filteredResultados); // Mostrar resultados filtrados

        // Si hay resultados filtrados, obtener el más reciente
        if (filteredResultados.length > 0) {
          const latestResult = filteredResultados.reduce((latest, current) => {
            return new Date(current[5]) > new Date(latest[5])
              ? current
              : latest; // Comparar por fecha
          });

          setResultados([latestResult]); // Solo guardar el resultado más reciente

          console.log("Latest Result:", latestResult); // Mostrar el resultado más reciente

          // Obtener información de la prueba
          const pruebaId = latestResult[1]; // Obtener el pruebaId
          const responsePrueba = await fetch(
            `http://192.168.0.15:8085/arrupe/sv/arrupe/prueba`
          );
          const pruebaData = await responsePrueba.json();

          console.log("Prueba Data:", pruebaData); // Mostrar datos de la prueba

          const pruebaInfo = pruebaData.find((p: any) => p[0] === pruebaId);
          if (pruebaInfo) {
            setTitulo(pruebaInfo[1]); // Título de la prueba
            console.log("Prueba Titulo:", pruebaInfo[1]); // Mostrar el título de la prueba
          }
        } else {
          console.log("No se encontraron resultados filtrados."); // No hay resultados
        }
      } catch (error) {
        console.error("Error al obtener los resultados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
  }, [navigation, pruebaId]); // Agregar pruebaId como dependencia

  const handleRealizarOtroIntento = () => {
    // Implementa la lógica para realizar otro intento
  };

  const handleRegresarListaIntentos = () => {
    navigation.navigate("DetalleLecciones", { lessonId: id });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <NavigationBar />
      <ScrollView style={styles.content}>
        {resultados.length === 0 ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          resultados.map((resultado, index) => {
            const puntuacionObtenida = resultado[4]; // Puntaje obtenido
            const mensajeAdicional =
              puntuacionObtenida < 6
                ? "No ha alcanzado el puntaje mínimo."
                : undefined; // No mostrar mensaje adicional si la puntuación es suficiente

            return (
              <ResultadoComponente
                key={index}
                titulo={`${titulo} : Resultado`}
                nombreUsuario={`${userNombre} ${userApellido}`} // Ahora se obtienen correctamente
                idUsuario={resultado[3]} // ID de usuario desde el resultado
                fechaInicio={new Date(resultado[5]).toLocaleString()} // Formatea la fecha
                respuestasGuardadas={resultado[4]} // Puntaje
                puntuacion={resultado[4]} // Puntaje obtenido
                puntuacionMaxima={100} // Cambia esto si tienes datos sobre la puntuación máxima
                onRegresarListaIntentos={handleRegresarListaIntentos}
                mensajeAdicional={mensajeAdicional} // Pasar el mensaje
              />
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#673AB7",
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
