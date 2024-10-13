import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ResultadoComponente from '../Components/ResultadoComponente';
import Header from "../Components/Header";
import NavigationBar from "../Components/NavigationBar";

type RootStackParamList = {
  Home: undefined;
  Lecciones: undefined;
};

type ResultadosScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

export default function ResultadosScreen({ navigation }: ResultadosScreenProps) {
  const handleRealizarOtroIntento = () => {
    // Implementa la lógica para realizar otro intento
  };

  const handleRegresarListaIntentos = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <NavigationBar />
      <ScrollView style={styles.content}>
        <ResultadoComponente
          titulo="NL_El ratón de ciudad y de campo : Resultado"
          nombreUsuario="Rivera Melendez, Luis Adolfo"
          idUsuario="RM100068"
          fechaInicio="12 de Octubre 2024 a las 04:16 PM"
          duracion="02:00:18"
          ip="190.53.30.184"
          respuestasGuardadas={4}
          totalRespuestas={4}
          puntuacion={10}
          puntuacionMaxima={10}
          onRealizarOtroIntento={handleRealizarOtroIntento}
          onRegresarListaIntentos={handleRegresarListaIntentos}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#673AB7',
  },
  content: {
    flex: 1,
    padding: 20,
  },
});