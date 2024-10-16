import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ResultadoComponente from "../Components/ResultadoComponente";
import Header from "../Components/Header";
import NavigationBar from "../Components/NavigationBar";

const ResultadoIntentoScreen: React.FC = () => {
  const [resultado, setResultado] = useState<any>(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { intentoId } = route.params;

  useEffect(() => {
    const fetchResultado = async () => {
      try {
        const response = await fetch(
          "http://192.242.6.152:8085/arrupe/sv/arrupe/resultadosPrueba"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const intentoFiltrado = data.find(
          (intento: any) => intento[0] === intentoId
        );

        if (intentoFiltrado) {
          const resultadoData = {
            id: intentoFiltrado[0],
            pruebaId: intentoFiltrado[1],
            userId: intentoFiltrado[3],
            puntuacion: intentoFiltrado[4],
            fecha: intentoFiltrado[5],
          };

          setResultado(resultadoData);
        } else {
          console.warn(`No se encontró un intento con ID ${intentoId}`);
        }
      } catch (error) {
        console.error("Error al obtener los datos del intento:", error);
      }
    };

    fetchResultado();
  }, [intentoId]);

  const handleRegresarListaIntentos = () => {
    navigation.goBack();
  };

  if (!resultado) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Cargando resultado...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header />
      <NavigationBar />
      <View style={styles.containerResultado}>
        <ResultadoComponente
          titulo="Resultado del Intento"
          nombreUsuario="Juan Pérez"
          idUsuario={resultado.userId}
          fechaInicio={new Date(resultado.fecha).toLocaleString()}
          duracion="00:30:00"
          respuestasGuardadas={10}
          puntuacion={resultado.puntuacion}
          puntuacionMaxima={100}
          onRegresarListaIntentos={handleRegresarListaIntentos}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#673AB7",
  },
  containerResultado: {
    flex: 1,
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ResultadoIntentoScreen;