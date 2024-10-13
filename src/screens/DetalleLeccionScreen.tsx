import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, FlatList, View } from "react-native";
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

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'detail') {
      return (
        <View style={styles.sectionContainer}>
          <LeccionDetail lessonId={lessonId} />
        </View>
      );
    } else if (item.type === 'prueba') {
      return (
        <View style={styles.sectionContainer}>
          <PruebaComponent
            intentos={item.data}
            onIniciarPrueba={() => console.log("Iniciar prueba")}
            onMostrarDetalles={(id) => console.log("Mostrar detalles del intento", id)}
          />
        </View>
      );
    }
    return null;
  };

  const data = [
    { type: 'detail' }, // LeccionDetail item
    { type: 'prueba', data: intentos }, // PruebaComponent item with the intentos data
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#512DA8" barStyle="light-content" />
      <Header />
      <NavigationBar />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#673AB7",
  },
  sectionContainer: {
    padding: 10,
  },
});

export default DetalleLeccionScreen;