import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  View,
} from "react-native";
import LeccionDetail from "../Components/LeccionDetail";
import Header from "../Components/Header";
import NavigationBar from "../Components/NavigationBar";
import PruebaComponent from "../Components/PruebaComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native"; // Importar useFocusEffect

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

  const handleObtenerPruebaId = (id: number) => {
    setPruebaId(id);
    console.log("PruebaId obtenido:", id);
  };

  const fetchIntentos = async (userId: string) => {
    try {
      const response = await fetch(
        "http://192.242.6.93:8085/arrupe/sv/arrupe/resultadosPrueba"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Json recibido de los intentos:", data);

      const intentosFiltrados = data
        .filter(
          (intento: any[]) =>
            intento[1] === pruebaId && intento[2] === parseInt(userId, 10)
        )
        .sort((a, b) => new Date(a[5]).getTime() - new Date(b[5]).getTime()) // Ordena antes para obtener el índice correcto
        .map((intento: any[], index: number) => ({
          id: intento[0], // Usa el ID real
          fecha: intento[5],
          fechaFormateada: formatearFecha(intento[5]),
          puntuacion: `${intento[4]}% (${(intento[4] / 10).toFixed(2)} / 10)`,
          indiceConsecutivo: index + 1, // Genera el índice consecutivo para mostrar
        }));

      setIntentos(intentosFiltrados);
    } catch (error) {
      console.error("Error al obtener los intentos:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserId = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem("userId");
          if (storedUserId) {
            setUserId(storedUserId);
            // Llamar a fetchIntentos después de establecer userId
            if (pruebaId) {
              await fetchIntentos(storedUserId);
            }
          } else {
            console.error("No se encontró el userId en AsyncStorage.");
          }
        } catch (error) {
          console.error("Error al obtener userId:", error);
        }
      };

      fetchUserId();

      // Limpiar la función
      return () => {
        setUserId(null);
        setIntentos([]);
      };
    }, [pruebaId]) // Dependiendo de pruebaId
  );

  useEffect(() => {
    if (pruebaId && userId) {
      fetchIntentos(userId);
    }
  }, [pruebaId, userId]);

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "detail") {
      return (
        <View style={styles.sectionContainer}>
          <LeccionDetail lessonId={lessonId} />
        </View>
      );
    } else if (item.type === "prueba") {
      return (
        <View style={styles.sectionContainer}>
          <PruebaComponent
            intentos={item.data}
            onObtenerPruebaId={handleObtenerPruebaId}
            onIniciarPrueba={() => console.log("Iniciar prueba")}
            onMostrarDetalles={(id) =>
              console.log("Mostrar detalles del intento", id)
            }
            formatearFecha={formatearFecha}
          />
        </View>
      );
    }
    return null;
  };

  const data = [{ type: "detail" }, { type: "prueba", data: intentos }];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#512DA8" barStyle="light-content" />
      <Header />
      <NavigationBar />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#673AB7",
  },
  sectionContainer: {
    padding: 10,
  },
});

export default DetalleLeccionScreen;
