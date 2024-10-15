import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, ActivityIndicator, TouchableOpacity, SafeAreaView, Modal, TouchableWithoutFeedback } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

type LeccionDetailProps = {
  lessonId: number;
};

const LeccionDetail: React.FC<LeccionDetailProps> = ({ lessonId }) => {
  const [lessonDetail, setLessonDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [lastReportedIndex, setLastReportedIndex] = useState<number | null>(
    null
  );
  const [maxPorcentajeCompletado, setMaxPorcentajeCompletado] =
    useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessonDetail = async () => {
      try {
        const response = await fetch(
          `http://192.242.6.93:8085/arrupe/sv/arrupe/lecciones/${lessonId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setLessonDetail(data[0]);

        const imagesArray = data[0][5].split(",");
        setImages(imagesArray);

        const storedUserId = await AsyncStorage.getItem("userId");
        setUserId(storedUserId);
        await AsyncStorage.setItem("lessonId", lessonId.toString());

        if (storedUserId) {
          const progresoResponse = await fetch(
            `http://192.242.6.93:8085/arrupe/sv/arrupe/progresoEstudiante/usuario/${storedUserId}/leccion/${lessonId}`
          );
          if (progresoResponse.ok) {
            const progresoData = await progresoResponse.json();
            setMaxPorcentajeCompletado(progresoData.porcentajeCompletado);

            const totalImages = imagesArray.length;
            const savedIndex = Math.floor(
              (progresoData.porcentajeCompletado / 100) * totalImages
            );

            setTimeout(() => {
              scrollViewRef.current?.scrollTo({
                x: savedIndex * screenWidth,
                animated: false,
              });
              setCurrentImageIndex(savedIndex);
              setLastReportedIndex(savedIndex);
            }, 100);
          }
        }
      } catch (error: any) {
        console.error("Error en fetchLessonDetail:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLessonDetail();
  }, [lessonId]);

  const registrarProgreso = async (index: number) => {
    if (images.length === 0) return;

    const totalImages = images.length;
    let porcentajeCompletado = ((index + 1) / totalImages) * 100;

    if (porcentajeCompletado > maxPorcentajeCompletado) {
      setMaxPorcentajeCompletado(porcentajeCompletado);

      const fechaActual = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      try {
        if (!userId) {
          console.error("Error: userId no está disponible");
          return;
        }

        const response = await fetch(
          "http://192.242.6.93:8085/arrupe/sv/arrupe/progresoEstudiante/agregar",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              usuario: parseInt(userId),
              leccion: lessonId,
              porcentajeCompletado: porcentajeCompletado,
              fecha: fechaActual,
            }),
          }
        );

        if (!response.ok) {
          console.error(`Error ${response.status}: ${response.statusText}`);
        } else {
          console.log(`Progreso del usuario ${userId} registrado con éxito.`);
        }
      } catch (error: any) {
        console.error("Error al actualizar el progreso:", error.message);
      }
    }
  };

  const handleScroll = async (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);

    if (index !== lastReportedIndex || lastReportedIndex === null) {
      setCurrentImageIndex(index);
      setLastReportedIndex(index);

      await registrarProgreso(index);
    }
  };

  const handleImagePress = (imageUri: string) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Cargando lección...</Text>
      </View>
    );
  }

  if (!lessonDetail) {
    return <Text style={styles.errorText}>No se pudo cargar la lección.</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{lessonDetail[1]}</Text>
          <Text style={styles.educationLevel}>
            Nivel Educativo: {lessonDetail[4]}
          </Text>
        </View>

        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {images.map((imageUri, index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageContainer}
                onPress={() => handleImagePress(imageUri)}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.paginationDot,
                  currentImageIndex === index && styles.paginationDotActive,
                ]}
                onPress={() => {
                  scrollViewRef.current?.scrollTo({
                    x: index * screenWidth,
                    animated: true,
                  });
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#673AB7",
  },
  loadingText: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  headerContainer: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textAlign: "center",
  },
  educationLevel: {
    paddingTop: 5,
    fontSize: 16,
    marginBottom: 0,
    color: "#fff",
    textAlign: "center",
  },
  carouselContainer: {
    height: screenHeight * 0.4,
    marginBottom: 5,
    marginTop: -55,
  },
  imageContainer: {
    width: screenWidth - 20,
    height: screenHeight * 0.4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 0,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#fff",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.95,
  },
});

export default LeccionDetail;