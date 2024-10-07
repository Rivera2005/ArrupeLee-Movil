import React from "react";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import LeccionDetail from "../Components/LeccionDetail";
import Header from "../Components/Header";
import NavigationBar from "../Components/NavigationBar";


const DetalleLeccionScreen = ({ route }) => {
  const { lessonId } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#512DA8" barStyle="light-content" />
      <View style={styles.container}>
        <Header />
        <NavigationBar />
        <LeccionDetail lessonId={lessonId} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#512DA8",
  },
  container: {
    flex: 1,
    backgroundColor: "#673AB7",
  },
});

export default DetalleLeccionScreen;