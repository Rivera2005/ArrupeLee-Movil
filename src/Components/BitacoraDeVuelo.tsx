import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/StackNavigator";

// Definir el tipo de navegación para Bitacora
type BitacoraNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  keyof RootStackParamList
>;

type Props = {
  progressLiteral: number;
  progressInferencial: number;
  progressCritico: number;
};

const BitacoraDeVuelo: React.FC<Props> = ({
  progressLiteral,
  progressInferencial,
  progressCritico,
}) => {
  const navigation = useNavigation<BitacoraNavigationProp>();

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