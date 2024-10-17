import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LessonList from "../Components/LessonList";
import Header from "../Components/Header";
import LevelProgress from "../Components/LevelProgress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigationBar from "../Components/NavigationBar";
import { useFocusEffect } from "@react-navigation/native"; // Importar useFocusEffect


type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Lecciones: undefined;
};

type LeccionesScreenRouteProp = RouteProp<RootStackParamList, "Lecciones">;

type LeccionesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Lecciones">;
};

const LeccionesScreen: React.FC<LeccionesScreenProps> = () => {
  const route = useRoute<LeccionesScreenRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [currentLevel, setCurrentLevel] = useState<string>("LITERAL"); // "LITERAL" como nivel inicial
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>(["LITERAL"]); // "LITERAL" desbloqueado por defecto
  const [userNivelEducativo, setUserNivelEducativo] = useState<string | null>(
    null
  );

  useFocusEffect(
    React.useCallback(() => {
      const getUserData = async () => {
        try {
          const nivelEducativo = await AsyncStorage.getItem("userNivelEducativo");
          const nivelLiterario = await AsyncStorage.getItem("userNivelLiterario");
          const progressLiteral = await AsyncStorage.getItem("progressLiteral");
          const progressInferencial = await AsyncStorage.getItem("progressInferencial");
          const progressCritico = await AsyncStorage.getItem("progressCritico");
    
          const unlockedLevelsArray = ['LITERAL']; // Desbloqueamos "LITERAL" por defecto
          
          // Verificar el progreso de cada nivel y desbloquear
          if (progressLiteral && Number(progressLiteral) === 100) {
            unlockedLevelsArray.push("INFERENCIAL");
          }
          if (progressInferencial && Number(progressInferencial) === 100) {
            unlockedLevelsArray.push("CRITICO");
          }
    
          setUnlockedLevels(unlockedLevelsArray);

          if (nivelEducativo) {
            setUserNivelEducativo(nivelEducativo);
          }
          if (nivelLiterario) {
            setCurrentLevel(nivelLiterario);
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      };
      getUserData();
    }, []) // El efecto se ejecuta cada vez que se enfoca la pantalla
  );

  const handleLevelPress = async (level: string) => {
    try {
      await AsyncStorage.setItem("userNivelLiterario", level);
      setCurrentLevel(level); // Actualizamos el nivel seleccionado
      navigation.navigate("Lecciones"); // Navegamos a la pantalla de lecciones
    } catch (error) {
      console.error("Error al guardar el nivel literario:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Header />
      <NavigationBar />
      <LevelProgress
        currentLevel={currentLevel} // Pasamos el nivel actual
        onLevelPress={handleLevelPress} // Manejo de selección de nivel
        unlockedLevels={unlockedLevels} // Pasamos los niveles desbloqueados
      />
      <LessonList
        userNivelEducativo={userNivelEducativo}
        userNivelLiterario={currentLevel} // Nivel actual para cargar las lecciones correctas
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 6,
    flex: 1,
    backgroundColor: "#673AB7",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default LeccionesScreen;
