import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import LessonItem from "../Components/LessonItem";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from '../Components/Header';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Lecciones: undefined;
  DetalleLecciones: { id: string };
};

const CompletedLessonsScreen = () => {
  const navigation = useNavigation();
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCompletedLessons = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        console.warn("No se encontró el userId en AsyncStorage.");
        return;
      }

      const response = await fetch(
        `http://192.242.6.152:8085/arrupe/sv/arrupe/progresoEstudiante`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorText}`
        );
      }

      const progressData = await response.json();
      const completedLessons = [];

      for (const lesson of progressData) {
        if (lesson[1] == userId && lesson[4] === 100) {
          const lessonResponse = await fetch(
            `http://192.242.6.152:8085/arrupe/sv/arrupe/lecciones/${lesson[3]}`
          );

          if (!lessonResponse.ok) {
            throw new Error(`Error al obtener la lección: ${lesson[2]}`);
          }

          const lessonDetail = await lessonResponse.json();

          if (lessonDetail.length > 0) {
            completedLessons.push({
              ...lessonDetail[0],
              progress: lesson[4],
            });
          } else {
            console.warn(`Lección no encontrada para ID: ${lesson[2]}`);
          }
        }
      }

      setCompletedLessons(completedLessons);
    } catch (error) {
      console.error("Error en loadCompletedLessons:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompletedLessons();
  }, []);

  const renderItem = ({ item }) => (
    <LessonItem
      title={item[1] || "Lección sin título"}
      progress={item.progress}
      onPress={() => {
          navigation.navigate("DetalleLecciones", { lessonId: item[0] });
      }}
    />
  );

  return (
    <View style={styles.container}>
      <Header />
      {loading ? (
        <Text style={styles.loadingText}>Cargando lecciones completadas...</Text>
      ) : (
        <FlatList
          data={completedLessons}
          renderItem={renderItem}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay lecciones completadas.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#673AB7',
    paddingTop: 6,
  },
  loadingText: {
    fontSize: 18,
    color: '#FFD700',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: '#FFD700',
  },
});

export default CompletedLessonsScreen;