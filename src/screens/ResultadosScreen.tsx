import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ResultadoComponente from "../Components/ResultadoComponente";
import Header from "../Components/Header";
import NavigationBar from "../Components/NavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  Home: undefined;
  Resultados: { pruebaId: number };
  DetalleLecciones: { lessonId: number };
};

type ResultadosScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Resultados">;
  route: {
    params: {
      pruebaId: number;
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
  const [userNombre, setUserNombre] = useState("");
  const [userApellido, setUserApellido] = useState("");
  const [lessonId, setLessonId] = useState<number | null>(null);

  const pruebaId = route.params.pruebaId;

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const storedUserNombre = await AsyncStorage.getItem("userNombre");
        const storedUserApellido = await AsyncStorage.getItem("userApellido");
        const storedLessonId = await AsyncStorage.getItem("lessonId");

        if (storedUserId) {
          setUserId(storedUserId);
        }
        if (storedUserNombre) {
          setUserNombre(storedUserNombre);
        }
        if (storedUserApellido) {
          setUserApellido(storedUserApellido);
        }
        if (storedLessonId) {
          setLessonId(Number(storedLessonId));
        }

        const responseResultados = await fetch(
          "http://192.168.0.15:8085/arrupe/sv/arrupe/resultadosPrueba"
        );
        const resultadosData = await responseResultados.json();

        const filteredResultados = resultadosData.filter((resultado: any) => {
          const resultadoUserId = resultado[2];
          const resultadoPruebaId = resultado[1];

          return (
            resultadoUserId.toString() === storedUserId &&
            resultadoPruebaId.toString() === pruebaId.toString()
          );
        });

        if (filteredResultados.length > 0) {
          const latestResult = filteredResultados.reduce((latest, current) => {
            return new Date(current[5]) > new Date(latest[5])
              ? current
              : latest;
          });

          setResultados([latestResult]);

          const pruebaId = latestResult[1];
          const responsePrueba = await fetch(
            `http://192.168.0.15:8085/arrupe/sv/arrupe/prueba`
          );
          const pruebaData = await responsePrueba.json();

          const pruebaInfo = pruebaData.find((p: any) => p[0] === pruebaId);
          if (pruebaInfo) {
            setTitulo(pruebaInfo[1]);
          }
        }
      } catch (error) {
        console.error("Error al obtener los resultados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
  }, [navigation, pruebaId]);

  const handleRegresarListaIntentos = () => {
    if (lessonId) {
      navigation.navigate("DetalleLecciones", { lessonId: lessonId });
    } else {
      console.warn("No se encontró el lessonId para navegar.");
    }
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
            return (
              <ResultadoComponente
                key={index}
                titulo={`${titulo} : Resultado`}
                nombreUsuario={`${userNombre} ${userApellido}`}
                idUsuario={resultado[3]} // ID de usuario desde el resultado
                fechaInicio={new Date(resultado[5]).toLocaleString()}
                respuestasGuardadas={resultado[4]}
                puntuacion={resultado[4]}
                puntuacionMaxima={100}
                onRegresarListaIntentos={handleRegresarListaIntentos}
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