import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../src/screens/LoginScreen";
import PlanetaArrupeHomeScreen from "../src/screens/PlanetaArrupeHomeScreen";
import NivelesLecturasScreen from "../src/screens/NivelesLecturasScreen";
import NavigationBar from "../src/Components/NavigationBar";
import LeccionesScreen from "../src/screens/LeccionesScreen";
import DetalleLeccionScreen from "../src/screens/DetalleLeccionScreen";
import CompletedLessonsScreen from "../src/screens/CompletedLessonsScreen";
import PreguntasScreen from "../src/screens/PreguntasScreen";
import ResultadosScreen from "../src/screens/ResultadosScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Niveles: undefined;
  Navbar: undefined;
  Lecciones: { level: string };
  DetalleLecciones: { id: string };
  BitacoraVuelo: undefined;
  Preguntas: { pruebaId: string };
  Resultados: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Niveles">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={PlanetaArrupeHomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Navbar"
          component={NavigationBar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Niveles"
          component={NivelesLecturasScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Lecciones"
          component={LeccionesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetalleLecciones"
          component={DetalleLeccionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BitacoraVuelo"
          component={CompletedLessonsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Preguntas"
          component={PreguntasScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Resultados"
          component={ResultadosScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;