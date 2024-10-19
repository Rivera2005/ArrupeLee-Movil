import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  View,
  ImageBackground
} from "react-native";
import LeccionDetail from "../Components/LeccionDetail";
import Header from "../Components/Header";
import NavigationBar from "../Components/NavigationBar";
import PruebaComponent from "../Components/PruebaComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const formatearFecha = (fechaISO: string) => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const DetalleLeccionScreen = ({ route }) => {
  const { lessonId } = route.params;
  const [intentos, setIntentos] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [pruebaId, setPruebaId] = useState<number | null>(null);
  const [forceRender, setForceRender] = useState(false);
  const [lastImageReached, setLastImageReached] = useState(false); // Nuevo estado para controlar si se alcanzó la última imagen


  const fetchIntentos = async (pruebaId: number) => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      const response = await fetch(
        "http://192.168.0.10:8085/arrupe/sv/arrupe/resultadosPrueba"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      const intentosFiltrados = data
        .filter(
          (intento: any[]) =>
            intento[1] === pruebaId && intento[2] == storedUserId
        )
        .sort((a, b) => new Date(a[5]).getTime() - new Date(b[5]).getTime())
        .map((intento: any[], index: number) => ({
          id: intento[0],
          fecha: intento[5],
          fechaFormateada: formatearFecha(intento[5]),
          puntuacion: `${intento[4]}% (${(intento[4] / 10).toFixed(2)} / 10)`,
          indiceConsecutivo: index + 1,
        }));
        console.log('Intentos Filtrados:', intentosFiltrados);


      setIntentos(intentosFiltrados);
    } catch (error) {
      console.error("Error al obtener los intentos:", error);
    }
  };

  const fetchPruebaId = async (lessonId: number) => {
    try {
      const response = await fetch(
        `http://192.168.0.10:8085/arrupe/sv/arrupe/leccionesPruebas`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const matchingLesson = data.find((lesson) => {
        return lesson[1] == lessonId;
      });

      if (matchingLesson) {
        const id_leccion_prueba = matchingLesson[0];
        const pruebaResponse = await fetch(
          `http://192.168.0.10:8085/arrupe/sv/arrupe/leccionesPruebas/${id_leccion_prueba}`
        );
        if (!pruebaResponse.ok) {
          throw new Error(`HTTP error! Status: ${pruebaResponse.status}`);
        }
        const pruebaData = await pruebaResponse.json();
        return pruebaData[0][3];
      } else {
        console.log("No se encontró una prueba asociada con la lección.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el pruebaId:", error);
      return null;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserAndPruebaId = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem("userId");
          if (storedUserId) {
            setUserId(storedUserId);

            const pruebaId = await fetchPruebaId(lessonId);
            if (pruebaId) {
              setPruebaId(pruebaId);
              await fetchIntentos(pruebaId);
            }
          } else {
            console.error("No se encontró el userId en AsyncStorage.");
          }
        } catch (error) {
          console.error("Error al obtener userId y pruebaId:", error);
        }
      };

      fetchUserAndPruebaId();

      return () => {
        setUserId(null);
        setPruebaId(null);
        setIntentos([]);
      };
    }, [lessonId])
  );

  const handleLastImageReached = () => {
    setLastImageReached(true); // Actualizamos el estado cuando se alcance la última imagen
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "detail") {
      return (
        <View style={styles.sectionContainer}>
          <LeccionDetail
            lessonId={lessonId}
            hasPrueba={pruebaId !== null}
            onLastImageReached={handleLastImageReached} // Pasamos la nueva prop
          />
        </View>
      );
    } else if (item.type === "prueba" && pruebaId !== null && lastImageReached) { // Agregamos la condición de lastImageReached
      return (
        <View style={styles.sectionContainer}>
          <PruebaComponent
            intentos={item.data}
            pruebaId={pruebaId}
            lessonId={lessonId}
            formatearFecha={formatearFecha}
          />
        </View>
      );
    }
    return null;
  };

  const data = [{ type: "detail" }, { type: "prueba", data: intentos }];

  return (
    <ImageBackground
      source={require("../../assets/bg.png")} // Reemplaza con la URL de tu imagen o una ruta local
      style={styles.container}
    >
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#512DA8" barStyle="light-content" />
      <Header />
      <NavigationBar />
      <FlatList
        data={data}
        extraData={forceRender} // Añadimos extraData para que re-renderice al cambiar el estado
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
  },
  sectionContainer: {
    padding: 10,
  },
});

export default DetalleLeccionScreen;