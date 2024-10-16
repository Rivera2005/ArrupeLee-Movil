import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  Share, // Importar Share
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../Components/Header";
import NavigationBar from "../Components/NavigationBar";
import CertificadoSVG from "../Components/CertificadoSVG";
import ViewShot from "react-native-view-shot";
import * as FileSystem from 'expo-file-system'; // Para manipular archivos
import * as Sharing from 'expo-sharing'; // Para compartir archivos


type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Certificados: undefined;
};

type PlanetArrupeCertificadosScreen = NativeStackNavigationProp<
  RootStackParamList,
  "Certificados"
>;

type Props = {
  navigation: PlanetArrupeCertificadosScreen;
};

const CertificadoCard: React.FC<{
  planetImage: any;
  nivel: string;
  descripcion: string;
  onObtenerCertificado: () => void;
}> = ({ planetImage, nivel, descripcion, onObtenerCertificado }) => (
  <View style={styles.card}>
    <Image source={planetImage} style={styles.planet} />
    <Text style={styles.cardTitle}>Certificado - Nivel {nivel}</Text>
    <Text style={styles.descripcion}>{descripcion}</Text>
    <TouchableOpacity style={styles.button} onPress={onObtenerCertificado}>
      <Text style={styles.buttonText}>Obtener Certificado</Text>
    </TouchableOpacity>
  </View>
);

export default function PlanetArrupeCertificadosScreen({ navigation }: Props) {
  const [certificadoVisible, setCertificadoVisible] = useState(false);
  const [certificadoNivel, setCertificadoNivel] = useState("");
  const [progressLiteral, setProgressLiteral] = useState(0);
  const [progressInferencial, setProgressInferencial] = useState(0);
  const [progressCritico, setProgressCritico] = useState(0);
  const [userNombre, setUserNombre] = useState("");
  const [userApellido, setUserApellido] = useState("");
  const viewShotRef = React.useRef(null); // Referencia para capturar el certificado

  useEffect(() => {
    (async () => {
      const literalProgress = await AsyncStorage.getItem("progressLiteral");
      const inferencialProgress = await AsyncStorage.getItem("progressInferencial");
      const criticoProgress = await AsyncStorage.getItem("progressCritico");
      const nombre = await AsyncStorage.getItem("userNombre");
      const apellido = await AsyncStorage.getItem("userApellido");

      setProgressLiteral(Number(literalProgress));
      setProgressInferencial(Number(inferencialProgress));
      setProgressCritico(Number(criticoProgress));
      setUserNombre(nombre || "");
      setUserApellido(apellido || "");
    })();
  }, []);

  const handleObtenerCertificado = (nivel: string) => {
    setCertificadoNivel(nivel);
    setCertificadoVisible(true);
  };

  const getPlanetaUrl = (nivel: string) => {
    switch (nivel) {
      case "LITERAL":
        return require("../../assets/nivelLiteral.png");
      case "INFERENCIAL":
        return require("../../assets/nivelInferencial.png");
      case "CRÍTICO":
        return require("../../assets/nivelCritico.png");
      default:
        return require("../../assets/nivelLiteral.png");
    }
  };

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current.capture(); // Capturar la imagen
      const localUri = `${FileSystem.cacheDirectory}certificate.png`; // Guardar la imagen en el caché

      // Mover la imagen a una ubicación local
      await FileSystem.moveAsync({
        from: uri,
        to: localUri,
      });

      // Compartir la imagen
      await Sharing.shareAsync(localUri);
    } catch (error) {
      alert("Hubo un error al intentar compartir el certificado.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <NavigationBar />
      <ScrollView style={styles.content}>
        {progressLiteral === 100 && (
          <CertificadoCard
            planetImage={require("../../assets/nivelLiteral.png")}
            nivel="LITERAL"
            descripcion="Tras haber completado todas las lecciones del Nivel Literal has obtenido un reconocimiento."
            onObtenerCertificado={() => handleObtenerCertificado("LITERAL")}
          />
        )}
        {progressInferencial === 100 && (
          <CertificadoCard
            planetImage={require("../../assets/nivelInferencial.png")}
            nivel="INFERENCIAL"
            descripcion="Tras haber completado todas las lecciones del Nivel Inferencial has obtenido un reconocimiento."
            onObtenerCertificado={() => handleObtenerCertificado("INFERENCIAL")}
          />
        )}
        {progressCritico === 100 && (
          <CertificadoCard
            planetImage={require("../../assets/nivelCritico.png")}
            nivel="CRÍTICO"
            descripcion="Tras haber completado todas las lecciones del Nivel Crítico has obtenido un reconocimiento."
            onObtenerCertificado={() => handleObtenerCertificado("CRÍTICO")}
          />
        )}
      </ScrollView>

      <Modal
        visible={certificadoVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.certificadoContainer}>
            {/* Envolver el certificado en ViewShot */}
            <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0 }} style={{ margin: 0, padding: 0 }}>
            <CertificadoSVG
                nombre={userNombre}
                apellido={userApellido}
                nivel={certificadoNivel}
                fecha={new Date().toLocaleDateString()}
                logoUrl="https://static.wixstatic.com/media/700331_13536b8cb95a4445a4519949edf76265~mv2.png/v1/fill/w_480,h_478,al_c,q_85,usm_4.00_1.00_0.00,enc_auto/2020_escudo%20colegio%20PA_20%25.png"
                planetaUrl={getPlanetaUrl(certificadoNivel)}
              />
            </ViewShot>
          </View>
          <TouchableOpacity
            style={styles.compartirButton}
            onPress={handleShare} // Botón para compartir
          >
            <Text style={styles.compartirButtonText}>Compartir Certificado</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.compartirButton}
            onPress={() => setCertificadoVisible(false)}
          >
            <Text style={styles.compartirButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#673AB7",
    paddingBottom: 5,
  },
  content: {
    flex: 1,
    padding: 10, // Ajuste del padding para que el contenido no se vea tan ajustado
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Ligero ajuste de la opacidad para mejorar la estética
    borderRadius: 10,
    padding: 20, // Ajuste del padding para pantallas móviles
    alignItems: "center",
    marginBottom: 15, // Ajuste del margin
  },
  planet: {
    width: 120, // Reducción de tamaño para mejor ajuste en pantallas pequeñas
    height: 120,
    marginBottom: 8,
  },
  cardTitle: {
    color: "white",
    fontSize: 16, // Ajuste de tamaño para mayor claridad
    marginVertical: 6,
    textAlign: "center",
  },
  descripcion: {
    color: "white",
    textAlign: "center",
    fontSize: 12, // Ajuste para no ocupar demasiado espacio en pantallas móviles
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#ffd700",
    paddingVertical: 5, // Ajuste para hacerlo más compacto
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  certificadoContainer: {
    width: "100%",
    height: "30%", // Ajuste de tamaño para que el modal no ocupe toda la pantalla
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10, // Pequeño padding para que el contenido no esté pegado a los bordes
  },
  compartirButton: {
    backgroundColor: "#ffd700",
    padding: 12,
    borderRadius: 5,
    marginTop: 15,
  },
  compartirButtonText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
});