import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LessonList from '../Components/LessonList';
import Header from '../Components/Header';
import LevelProgress from '../Components/LevelProgress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationBar from "../Components/NavigationBar";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Lecciones: undefined;
};

type LeccionesScreenRouteProp = RouteProp<RootStackParamList, 'Lecciones'>;

type LeccionesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Lecciones'>;
};

const LeccionesScreen: React.FC<LeccionesScreenProps> = () => {
  const route = useRoute<LeccionesScreenRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>([]);
  const [userNivelEducativo, setUserNivelEducativo] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const nivelEducativo = await AsyncStorage.getItem("userNivelEducativo");
        const nivelLiterario = await AsyncStorage.getItem("userNivelLiterario");

        if (nivelEducativo) {
          setUserNivelEducativo(nivelEducativo);
        }
        if (nivelLiterario) {
          setCurrentLevel(nivelLiterario);
          const nivelesDesbloqueados = ['LITERAL', 'INFERENCIAL'];
          setUnlockedLevels(nivelesDesbloqueados);
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };
    getUserData();
  }, []);

  const handleLevelPress = async (level: string) => {
    try {
      await AsyncStorage.setItem("userNivelLiterario", level);
      setCurrentLevel(level);
      navigation.navigate("Lecciones");
    } catch (error) {
      console.error("Error al guardar el nivel literario:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <NavigationBar />
      <LevelProgress 
        currentLevel={currentLevel || ''} 
        onLevelPress={handleLevelPress} 
        unlockedLevels={unlockedLevels} 
      />
      <LessonList 
        userNivelEducativo={userNivelEducativo} 
        userNivelLiterario={currentLevel}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    paddingTop: 6,
    flex: 1,
    backgroundColor: '#673AB7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default LeccionesScreen;