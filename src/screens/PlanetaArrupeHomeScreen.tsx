import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../Components/Header";
import NavigationBar from "../Components/NavigationBar";
import BitacoraDeVuelo from "../Components/BitacoraDeVuelo";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Lecciones: undefined;
};

type PlanetArrupeHomeScreen = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

type Props = {
  navigation: PlanetArrupeHomeScreen;
};

export default function PlanetArrupeHomeScreen({ navigation }: Props) {
  const [userNombre, setUserNombre] = useState<string | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>(["LITERAL"]); // Literal desbloqueado por defecto
  const [progressLiteral, setProgressLiteral] = useState(0);
  const [progressInferencial, setProgressInferencial] = useState(0);
  const [progressCritico, setProgressCritico] = useState(0);

  const nav = useNavigation();

  const fetchProgressData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        console.warn("No se encontró el userId en AsyncStorage.");
        return;
      }

      const response = await fetch(
        `http://192.1.2.92:8085/arrupe/sv/arrupe/lecciones`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorText}`
        );
      }

      const fetchedLessons = await response.json();

      const leccionesLiteral = fetchedLessons.filter(
        (lesson: any[]) => lesson[3] === "LITERAL"
      );
      const leccionesInferencial = fetchedLessons.filter(
        (lesson: any[]) => lesson[3] === "INFERENCIAL"
      );
      const leccionesCritico = fetchedLessons.filter(
        (lesson: any[]) => lesson[3] === "CRITICO"
      );

      // REVISARRRRRRRRRRR
      const calculateProgress = async (lessons: any[]) => {
        const progressArray = await Promise.all(
          lessons.map(async (lesson: any[]) => {
            const progressResponse = await fetch(
              `http://192.1.2.92:8085/arrupe/sv/arrupe/progresoEstudiante/usuario/${userId}/leccion/${lesson[0]}`
            );
            if (progressResponse.ok) {
              const progressData = await progressResponse.json();
              return progressData.porcentajeCompletado || 0;
            }
            return 0;
          })
        );

        return (
          progressArray.reduce((a, b) => a + b, 0) / progressArray.length || 0
        );
      };

      const literalProgress = await calculateProgress(leccionesLiteral);
      const inferencialProgress = await calculateProgress(leccionesInferencial);
      const criticoProgress = await calculateProgress(leccionesCritico);

      setProgressLiteral(literalProgress);
      setProgressInferencial(inferencialProgress);
      setProgressCritico(criticoProgress);

      await AsyncStorage.setItem("progressLiteral", literalProgress.toString());
      await AsyncStorage.setItem(
        "progressInferencial",
        inferencialProgress.toString()
      );
      await AsyncStorage.setItem("progressCritico", criticoProgress.toString());

      // Procesar los niveles desbloqueados basado en el progreso
      const newUnlockedLevels = ["LITERAL"];

      if (literalProgress >= 100) {
        newUnlockedLevels.push("INFERENCIAL");
      }
      if (inferencialProgress >= 100) {
        newUnlockedLevels.push("CRITICO");
      }

      setUnlockedLevels(newUnlockedLevels);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error al obtener los datos de progreso:", error.message);
      } else {
        console.error("Error desconocido:", error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProgressData();
    }, [])
  );

  const handleButtonPress = async (level: string) => {
    try {
      await AsyncStorage.setItem("userNivelLiterario", level);
      navigation.navigate("Lecciones");
    } catch (error) {
      console.error("Error al guardar el nivel literario:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <NavigationBar />
      <ScrollView style={styles.content}>
        {userNombre && (
          <Text style={styles.welcomeMessage}>
            <Text style={styles.userName}>Bienvenido, {userNombre}</Text>{" "}
            <Text style={styles.adventure}>¡Comienza tu aventura lectora!</Text>
          </Text>
        )}

        <View style={styles.planetsSection}>
          <TouchableOpacity
            onPress={() =>
              unlockedLevels.includes("LITERAL") && handleButtonPress("LITERAL")
            }
            disabled={!unlockedLevels.includes("LITERAL")}
          >
            <Image
              source={require("../../assets/nivelLiteral.png")}
              style={[
                styles.planet,
                !unlockedLevels.includes("LITERAL") && styles.lockedPlanet,
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              unlockedLevels.includes("INFERENCIAL") &&
              handleButtonPress("INFERENCIAL")
            }
            disabled={!unlockedLevels.includes("INFERENCIAL")}
          >
            <Image
              source={require("../../assets/nivelInferencial.png")}
              style={[
                styles.planet,
                !unlockedLevels.includes("INFERENCIAL") && styles.lockedPlanet,
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              unlockedLevels.includes("CRITICO") && handleButtonPress("CRITICO")
            }
            disabled={!unlockedLevels.includes("CRITICO")}
          >
            <Image
              source={require("../../assets/nivelCritico.png")}
              style={[
                styles.planet,
                !unlockedLevels.includes("CRITICO") && styles.lockedPlanet,
              ]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.adventureSection}>
          <Text style={styles.adventureTitle}>Mi aventura lectora</Text>
        </View>

        {/* Pasar los datos de progreso a BitacoraDeVuelo */}
        <BitacoraDeVuelo
          progressLiteral={progressLiteral}
          progressInferencial={progressInferencial}
          progressCritico={progressCritico}
        />
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
  planetsSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeMessage: {
    textAlign: "center",
    marginBottom: 20,
  },
  userName: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  adventure: {
    color: "white",
    fontSize: 16,
    fontStyle: "italic",
  },
  planet: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  adventureSection: {
    backgroundColor: "#7E57C2",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  adventureTitle: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  lockedPlanet: {
    opacity: 0.3,
  },
});
