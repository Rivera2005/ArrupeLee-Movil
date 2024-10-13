import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../Components/Header";
import NavigationBar from "../Components/NavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

  useEffect(() => {
    const getUserNombre = async () => {
      try {
        const nombre = await AsyncStorage.getItem("userNombre");
        if (nombre) {
          setUserNombre(nombre);
        }
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
      }
    };

    getUserNombre();
  }, []);

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
          <TouchableOpacity onPress={() => handleButtonPress("LITERAL")}>
            <Image
              source={require("../../assets/nivelLiteral.png")}
              style={styles.planet}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonPress("INFERENCIAL")}>
            <Image
              source={require("../../assets/nivelInferencial.png")}
              style={styles.planet}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonPress("CRITICO")}>
            <Image
              source={require("../../assets/nivelCritico.png")}
              style={styles.planet}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.adventureSection}>
          <Text style={styles.adventureTitle}>Mi aventura lectora</Text>
        </View>

        <BitacoraDeVuelo />
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
    textAlign: "center"
  },
});