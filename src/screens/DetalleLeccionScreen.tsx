import React from "react";
import { ScrollView, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import LeccionDetail from "../Components/LeccionDetail";
import Header from "../Components/Header";
import NavigationBar from "../Components/NavigationBar";
import PruebaComponent from "../Components/PruebaComponent";

const intentos = [
  {
    id: 1,
    fecha: "22 de Octubre 2022 a las 03:23 PM",
    ip: "190.87.160.110",
    puntuacion: "25% (2.50 / 10)",
  },
  {
    id: 2,
    fecha: "22 de Octubre 2022 a las 03:25 PM",
    ip: "190.87.160.110",
    puntuacion: "75% (7.50 / 10)",
  },
];

const DetalleLeccionScreen = ({ route }) => {
  const { lessonId } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#512DA8" barStyle="light-content" />
      <Header />
      <NavigationBar />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <LeccionDetail lessonId={lessonId} />
        <PruebaComponent
          intentos={intentos}
          onIniciarPrueba={() => console.log("Iniciar prueba")}
          onMostrarDetalles={(id) =>
            console.log("Mostrar detalles del intento", id)
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#512DA8",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#673AB7",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default DetalleLeccionScreen;