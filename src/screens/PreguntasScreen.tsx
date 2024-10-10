import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import PreguntasListComponente from "../Components/PreguntasListComponente";
import Header from "../Components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Preguntas: { leccionId: string };
};

type PreguntasScreenRouteProp = RouteProp<RootStackParamList, "Preguntas">;

type PreguntasScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Preguntas">;
};

const PreguntasScreen: React.FC<PreguntasScreenProps> = () => {
  const route = useRoute<PreguntasScreenRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [leccionId, setLeccionId] = useState<string | null>(null);

  useEffect(() => {
    const getLeccionId = async () => {
      try {
        if (route.params?.leccionId) {
          setLeccionId(route.params.leccionId);
        } else {
          // Si no se proporciona en los parámetros, intenta obtenerlo del almacenamiento
          const storedLeccionId = await AsyncStorage.getItem(
            "currentLeccionId"
          );
          if (storedLeccionId) {
            setLeccionId(storedLeccionId);
          }
        }
      } catch (error) {
        console.error("Error al obtener el ID de la lección:", error);
      }
    };
    getLeccionId();
  }, [route.params?.leccionId]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#673AB7" }}
      >
        <Header />
        <PreguntasListComponente leccionId={leccionId} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 6,
    flex: 1,
    backgroundColor: "#673AB7", // Tu color morado
  },
});

export default PreguntasScreen;
