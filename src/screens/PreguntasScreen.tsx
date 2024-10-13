import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import PreguntasListComponente from "../Components/PreguntasListComponente";
import Header from "../Components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Preguntas: { leccionId: string; pruebaId: string };
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
  const [pruebaId, setPruebaId] = useState<string | null>(null);

  useEffect(() => {
    const getLeccionId = async () => {
      try {
        if (route.params?.leccionId) {
          setLeccionId(route.params.leccionId);
        } else {
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

    const getPruebaId = async () => {
      if (route.params?.pruebaId) {
        setPruebaId(route.params.pruebaId);
        console.log(
          "Prueba ID recibido en PreguntasScreen: ",
          route.params.pruebaId
        );
      } else {
        console.warn("No se recibió pruebaId desde los parámetros.");
      }
    };

    getLeccionId();
    getPruebaId();
  }, [route.params?.leccionId, route.params?.pruebaId]);

  if (!pruebaId) {
    return (
      <Text style={styles.errorText}>No se ha seleccionado una prueba.</Text>
    );
  }

  const handleTerminarEjercicio = () => {
    console.log("Ejercicio terminado");
    // Implementa aquí la lógica para terminar el ejercicio
    // navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />
        <PreguntasListComponente 
          pruebaId={pruebaId}
          renderFooter={() => (
            <TouchableOpacity
              style={styles.terminarButton}
              onPress={handleTerminarEjercicio}
            >
              <Text style={styles.terminarButtonText}>Terminar ejercicio</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#673AB7",
  },
  container: {
    flex: 1,
  },
  terminarButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: windowWidth * 0.8,
    maxWidth: 300,
    alignSelf: "center",
    marginVertical: 20,
  },
  terminarButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default PreguntasScreen;