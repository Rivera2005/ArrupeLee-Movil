import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const BitacoraDeVuelo: React.FC = () => {
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
            `http://192.242.6.101:8085/arrupe/sv/arrupe/lecciones`
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `HTTP error! Status: ${response.status}, Message: ${errorText}`
            );
          }

          const fetchedLessons = await response.json();

          const leccionesLiteral = fetchedLessons.filter(
            (lesson) => lesson[3] === "LITERAL"
          );
          const leccionesInferencial = fetchedLessons.filter(
            (lesson) => lesson[3] === "INFERENCIAL"
          );
          const leccionesCritico = fetchedLessons.filter(
            (lesson) => lesson[3] === "CRITICO"
          );

          const calculateProgress = async (lessons) => {
            const progressArray = await Promise.all(
              lessons.map(async (lesson) => {
                const progressResponse = await fetch(
                  `http://192.242.6.101:8085/arrupe/sv/arrupe/progresoEstudiante/usuario/${userId}/leccion/${lesson[0]}`
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
        } catch (error) {
          console.error(
            "Error al obtener los datos de progreso:",
            error.message
          );
        }
      };

      fetchProgressData();
    }, [])
  );

  return (
    <View style={styles.flightLogWrapper}>
      <View style={styles.flightLogSection}>
        <View style={styles.flightLogContent}>
          <Image
            source={require("../../assets/imgBitacora.png")}
            style={styles.spaceshipIcon}
          />
        </View>
        <Text style={styles.flightLogTitle}>Mi bitácora de vuelo</Text>
        <Text style={styles.flightLogSubtitle}>¡Muchos éxitos, tú puedes!</Text>

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
