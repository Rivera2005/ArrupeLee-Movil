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
  const { intentoId } = route.params; // Obtén el ID del intento desde los parámetros de navegación

  // Mensaje de depuración para verificar si el intentoId se pasa correctamente
  console.log("Intento ID recibido:", intentoId);

  useEffect(() => {
    const fetchResultado = async () => {
      try {
        console.log(
          "Iniciando la solicitud para obtener el resultado del intento..."
        );

        const response = await fetch(
          "http://192.168.0.15:8085/arrupe/sv/arrupe/resultadosPrueba"
        );

        // Depuración: verificar el estado de la respuesta
        console.log("Estado de la respuesta:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Depuración: verificar los datos recibidos
        console.log("Datos recibidos del servidor:", data);

        // Filtrar los datos para obtener solo el intento con el id especificado
        const intentoFiltrado = data.find(
          (intento: any) => intento[0] === intentoId
        );

        // Depuración: verificar si el intento con el ID especificado se encuentra en los datos
        console.log("Intento filtrado:", intentoFiltrado);

        if (intentoFiltrado) {
          const resultadoData = {
            id: intentoFiltrado[0],
            pruebaId: intentoFiltrado[1],
            userId: intentoFiltrado[3],
            puntuacion: intentoFiltrado[4],
            fecha: intentoFiltrado[5],
          };

          // Depuración: mostrar el resultado procesado
          console.log("Resultado procesado:", resultadoData);

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
    // Depuración: mostrar que el resultado aún no se ha cargado
    console.log("Resultado aún no disponible, mostrando mensaje de carga...");
    return (
      <View style={styles.loaderContainer}>
        <Text>Cargando resultado...</Text>
      </View>
    );
  }

  // Depuración: mostrar que el resultado ha sido cargado correctamente
  console.log("Resultado cargado, mostrando la interfaz...");

  return (
    <ScrollView style={styles.container}>
      <Header />
      <NavigationBar />
      <View style={styles.containerResultado}>
        <ResultadoComponente
          titulo="Resultado del Intento"
          nombreUsuario="Juan Pérez" // Cambia esto si tienes el nombre del usuario disponible
          idUsuario={resultado.userId}
          fechaInicio={new Date(resultado.fecha).toLocaleString()}
          duracion="00:30:00" // Si tienes esta información en la API, úsala
          respuestasGuardadas={10} // Cambia este valor si tienes la cantidad correcta
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
