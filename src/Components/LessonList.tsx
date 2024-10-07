import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import LessonItem from "./LessonItem";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Lecciones: undefined;
  DetalleLecciones: { id: string };
};

type LessonList = NativeStackNavigationProp<RootStackParamList, "Lecciones">;

const LessonList = ({ userNivelEducativo, userNivelLiterario }) => {
  const [lessons, setLessons] = useState([]);
  const navigation = useNavigation();

  // Cargar y filtrar lecciones
  useEffect(() => {
    const loadLessons = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId"); // Obtener el userId de AsyncStorage
        if (!userId) {
          console.warn("No se encontró el userId en AsyncStorage.");
          return; // Si no hay userId, no continuamos
        }

        const response = await fetch(
          `http://192.168.0.14:8085/arrupe/sv/arrupe/lecciones`
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${errorText}`
          );
        }

        const textResponse = await response.text(); // Obtener la respuesta como texto

        const fetchedLessons = JSON.parse(textResponse); // Aquí se obtiene el JSON directamente

        // Filtrar lecciones basadas en el nivel educativo, literario y habilitación
        const filteredLessons = fetchedLessons.filter((lesson) => {
          return (
            lesson[4] === userNivelEducativo && // Comparar con nivel educativo
            lesson[3] === userNivelLiterario && // Comparar con nivel literario
            lesson[6] === "HABILITADO" // Solo las lecciones habilitadas
          );
        });

        if (filteredLessons.length === 0) {
          console.warn(
            "No se encontraron lecciones que coincidan con los criterios."
          );
        }

        // Obtener el progreso de cada lección
        const updatedLessons = await Promise.all(
          filteredLessons.map(async (lesson) => {
            try {
              const progressResponse = await fetch(
                `http://192.168.0.14:8085/arrupe/sv/arrupe/progresoEstudiante/usuario/${userId}/leccion/${lesson[0]}`
              );

              if (!progressResponse.ok) {
                const errorText = await progressResponse.text();
                console.error(
                  `Error al obtener progreso: ${progressResponse.status}, ${errorText}`
                );
                throw new Error(
                  `Error al obtener progreso para la lección ${lesson[0]}`
                );
              }

              const progressData = await progressResponse.json();

              return {
                ...lesson,
                progress: progressData.porcentajeCompletado || 0, // Asigna el porcentaje completado
              };
            } catch (error) {
              console.error(error.message);
              return {
                ...lesson,
                progress: 0, // Valor predeterminado en caso de error
              };
            }
          })
        );

        setLessons(updatedLessons);
      } catch (error) {
        console.error("Error en loadLessons:", error.message);
      }
    };

    if (userNivelEducativo && userNivelLiterario) {
      loadLessons();
    }
  }, [userNivelEducativo, userNivelLiterario]);

  const navigateToLesson = (id) => {
    navigation.navigate("DetalleLecciones", { lessonId: id });
  };

  const renderItem = ({ item }) => (
    <LessonItem
      title={item[1]} // El nombre de la lección está en la posición 1 del array
      progress={item.progress || 0} // Usa el progreso actualizado
      onPress={() => navigateToLesson(item[0])} // El ID está en la posición 0 del array
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={lessons}
        renderItem={renderItem}
        keyExtractor={(item) => item[0].toString()} // Usamos el ID (posición 0) como key
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay lecciones disponibles para este nivel.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#673AB7",
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    marginLeft: 16,
    marginBottom: 10,
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});

export default LessonList;
