import React, { useRef, useState, useEffect } from "react";
import { View, Image, StyleSheet, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Text, ImageBackground} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Video, ResizeMode } from "expo-av";
import Header from "../Components/Header";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Niveles: undefined;
};

type NivelesLecturasScreen = NativeStackNavigationProp<
  RootStackParamList,
  "Niveles"
>;

type Props = {
  navigation: NivelesLecturasScreen;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const CAROUSEL_ITEM_WIDTH = SCREEN_WIDTH * 0.9;

const carouselItems = [
  {
    image: require("../../assets/baner-literal.png"),
    title: "Nivel Literal",
  },
  {
    image: require("../../assets/baner-inferencial.png"),
    title: "Nivel Inferencial",
  },
  {
    image: require("../../assets/baner-critico.png"),
    title: "Nivel Crítico",
  },
];

export default function NivelesLecturasScreen({ navigation }: Props) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * SCREEN_WIDTH,
        animated: true,
      });
    }
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % carouselItems.length;
      scrollToIndex(nextIndex);
    }, 12000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <ImageBackground
    source={require("../../assets/bg.png")} // Reemplaza con la URL de tu imagen o una ruta local
    style={styles.container}
  >
    <SafeAreaView style={styles.containerview}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Niveles de Lectura</Text>

        <View style={styles.videoContainer}>
          <Video
            source={require("../../assets/video-intro.mp4")}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping
          />
        </View>

        <Text style={styles.sectionTitle}>Explora los Niveles</Text>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / SCREEN_WIDTH
            );
            setCurrentIndex(newIndex);
          }}
        >
          {carouselItems.map((item, index) => (
            <View key={index} style={styles.carouselItem}>
              <Image source={item.image} style={styles.carouselImage} />
              <Text style={styles.carouselItemTitle}>{item.title}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.pagination}>
          {carouselItems.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive,
              ]}
              onPress={() => scrollToIndex(index)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  containerview: {
    flex: 1,
  },
  content: {
    paddingVertical: 20,
    alignItems: "center",
  },
  videoContainer: {
    width: SCREEN_WIDTH * 0.9,
    aspectRatio: 16 / 9,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 15,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  carouselContainer: {
    justifyContent: "center",
    paddingLeft: SCREEN_WIDTH * 0.01,
  },
  carouselItem: {
    width: CAROUSEL_ITEM_WIDTH + 4,
    height: 240,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "flex-end",
    marginHorizontal: 15,
  },
  carouselImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  carouselItemTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "white",
    width: 12,
    height: 12,
  },
  loginButton: {
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 7,
  },
  loginButtonText: {
    color: "#673AB7",
    fontSize: 18,
    fontWeight: "bold",
  },
});