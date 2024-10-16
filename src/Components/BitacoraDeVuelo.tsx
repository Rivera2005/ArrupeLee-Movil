import React, { useState, useCallback } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/StackNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type BitacoraNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  keyof RootStackParamList
>;

const BitacoraDeVuelo: React.FC = () => {
  const navigation = useNavigation<BitacoraNavigationProp>();
  const route =
    useRoute<RouteProp<RootStackParamList, keyof RootStackParamList>>();
  const [progressLiteral, setProgressLiteral] = useState(0);
  const [progressInferencial, setProgressInferencial] = useState(0);
  const [progressCritico, setProgressCritico] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchProgressData = async () => {
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

          const calculateProgress = async (lessons: any[]) => {
            const progressArray = await Promise.all(
              lessons.map(async (lesson: any[]) => {
                const progressResponse = await fetch(
                  `http://192.168.0.15:8085/arrupe/sv/arrupe/progresoEstudiante/usuario/${userId}/leccion/${lesson[0]}`
                );
                if (progressResponse.ok) {
                  const progressData = await progressResponse.json();
                  return progressData.porcentajeCompletado || 0;
                }
                return 0;
              })
            );

            return (
              progressArray.reduce((a, b) => a + b, 0) / progressArray.length ||
              0
            );
          };

          const literalProgress = await calculateProgress(leccionesLiteral);
          const inferencialProgress = await calculateProgress(
            leccionesInferencial
          );
          const criticoProgress = await calculateProgress(leccionesCritico);

          setProgressLiteral(literalProgress);
          setProgressInferencial(inferencialProgress);
          setProgressCritico(criticoProgress);

          // Después de calcular el progreso en cada nivel:
          await AsyncStorage.setItem(
            "progressLiteral",
            literalProgress.toString()
          );
          await AsyncStorage.setItem(
            "progressInferencial",
            inferencialProgress.toString()
          );
          await AsyncStorage.setItem(
            "progressCritico",
            criticoProgress.toString()
          );
        } catch (error) {
          if (error instanceof Error) {
            console.error(
              "Error al obtener los datos de progreso:",
              error.message
            );
          } else {
            console.error("Error desconocido:", error);
          }
        }
      };

      fetchProgressData();
    }, [])
  );

  return (
    <TouchableOpacity onPress={() => navigation.navigate("BitacoraVuelo")}>
      <View style={styles.flightLogWrapper}>
        <View style={styles.flightLogSection}>
          <View style={styles.flightLogContent}>
            <Image
              source={require("../../assets/imgBitacora.png")}
              style={styles.spaceshipIcon}
            />
          </View>
          <Text style={styles.flightLogTitle}>Mi bitácora de vuelo</Text>
          <Text style={styles.flightLogSubtitle}>
            ¡Muchos éxitos, tú puedes!
          </Text>

          <View style={styles.progressBarSection}>
            {[
              {
                label: "Nivel Literal",
                progress: progressLiteral,
                color: "#FFB347",
              },
              {
                label: "Nivel Inferencial",
                progress: progressInferencial,
                color: "#77DD77",
              },
              {
                label: "Nivel Crítico",
                progress: progressCritico,
                color: "#FF6961",
              },
            ].map((level, index) => (
              <View key={index} style={styles.progressItem}>
                <Text style={styles.progressLabel}>{level.label}</Text>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${level.progress}%`,
                        backgroundColor: level.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(level.progress)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  flightLogWrapper: {
    marginTop: 5,
    marginBottom: 35,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  flightLogSection: {
    backgroundColor: "#7E57C2",
    padding: 20,
  },
  flightLogContent: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  spaceshipIcon: {
    width: 100,
    height: 60,
  },
  flightLogTitle: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textAlign: "center",
    marginTop: 10,
  },
  flightLogSubtitle: {
    color: "white",
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 20,
    textAlign: "center",
  },
  progressBarSection: {
    marginTop: 10,
  },
  progressItem: {
    marginBottom: 15,
  },
  progressLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 6,
  },
  progressText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 5,
  },
});

export default BitacoraDeVuelo;
