import React, { useState, useCallback } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import LessonItem from "./LessonItem";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Lecciones: undefined;
  DetalleLecciones: { lessonId: string };
};

type LessonList = NativeStackNavigationProp<RootStackParamList, "Lecciones">;

interface Lesson {
  id: string;
  title: string;
  progress: number;
}

interface LessonListProps {
  userNivelEducativo: string;
  userNivelLiterario: string;
}

const LessonList: React.FC<LessonListProps> = ({
  userNivelEducativo,
  userNivelLiterario,
}) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const navigation = useNavigation<LessonList>();

  const loadLessons = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        console.warn("No se encontró el userId en AsyncStorage.");
        return;
      }

      const response = await fetch(
        `http://192.168.0.15:8085/arrupe/sv/arrupe/lecciones`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorText}`
        );
      }

      const textResponse = await response.text();
      const fetchedLessons: any[] = JSON.parse(textResponse);

      const filteredLessons: Lesson[] = fetchedLessons.filter((lesson: any) => {
        return (
          lesson[4] === userNivelEducativo &&
          lesson[3] === userNivelLiterario &&
          lesson[6] === "HABILITADO"
        );
      });

      if (filteredLessons.length === 0) {
        console.warn(
          "No se encontraron lecciones que coincidan con los criterios."
        );
      }

      const updatedLessons: Lesson[] = await Promise.all(
        filteredLessons.map(async (lesson: any) => {
          let progress = 0;
          try {
            const progressResponse = await fetch(
              `http://192.168.0.15:8085/arrupe/sv/arrupe/progresoEstudiante/usuario/${userId}/leccion/${lesson[0]}`
            );

            if (progressResponse.ok) {
              const progressData = await progressResponse.json();
              progress = progressData.porcentajeCompletado || 0;
            } else {
              console.log(
                `No se pudo obtener el progreso para la lección ${lesson[0]}. Estableciendo progreso en 0.`
              );
            }
          } catch (error: unknown) {
            if (error instanceof Error) {
              console.error(
                `Error al obtener progreso para la lección ${lesson[0]}: ${error.message}`
              );
            } else {
              console.error(
                `Error desconocido al obtener progreso para la lección ${lesson[0]}`
              );
            }
          }

          return {
            id: lesson[0],
            title: lesson[1],
            progress,
          } as Lesson;
        })
      );

      setLessons(updatedLessons);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error en loadLessons:", error.message);
      } else {
        console.error("Error desconocido:", error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userNivelEducativo && userNivelLiterario) {
        loadLessons();
      }
    }, [userNivelEducativo, userNivelLiterario])
  );

  const navigateToLesson = (id: string) => {
    console.log("LessonID enviado: " + id)
    navigation.navigate("DetalleLecciones", { lessonId: id });
  };

  const renderItem = ({ item }: { item: Lesson }) => (
    <LessonItem
      title={item.title}
      progress={item.progress || 0}
      onPress={() => navigateToLesson(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={lessons}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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