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
  ImageBackground,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../Components/Header";
import NavigationBar from "../Components/NavigationBar";
import CertificadoSVG from "../Components/CertificadoSVG";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

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
  const [userCarnet, setUserCarnet] = useState("");

  const viewShotRef = React.useRef(null);

  useEffect(() => {
    (async () => {
      const literalProgress = await AsyncStorage.getItem("progressLiteral");
      const inferencialProgress = await AsyncStorage.getItem(
        "progressInferencial"
      );
      const criticoProgress = await AsyncStorage.getItem("progressCritico");
      const nombre = await AsyncStorage.getItem("userNombre");
      const apellido = await AsyncStorage.getItem("userApellido");
      const carnet = await AsyncStorage.getItem("usercarnet");

      setProgressLiteral(Number(literalProgress));
      setProgressInferencial(Number(inferencialProgress));
      setProgressCritico(Number(criticoProgress));
      setUserNombre(nombre || "");
      setUserApellido(apellido || "");
      setUserCarnet(carnet || "");
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
      const uri = await viewShotRef.current.capture();
      const localUri = `${FileSystem.cacheDirectory}certificate.png`;

      await FileSystem.moveAsync({
        from: uri,
        to: localUri,
      });

      await Sharing.shareAsync(localUri);
    } catch (error) {
      alert("Hubo un error al intentar compartir el certificado.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/bg.png")} // Reemplaza con la URL de tu imagen o una ruta local
      style={styles.container}
    >
      <SafeAreaView style={styles.containerview}>
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
              onObtenerCertificado={() =>
                handleObtenerCertificado("INFERENCIAL")
              }
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
              <ViewShot
                ref={viewShotRef}
                options={{ format: "png", quality: 1.0 }}
                style={{ marginBottom: 0, padding: 0 }}
              >
                <CertificadoSVG
                  nombre={userNombre}
                  apellido={userApellido}
                  nivel={certificadoNivel}
                  fecha={new Date().toLocaleDateString()}
                  logoUrl="https://static.wixstatic.com/media/700331_13536b8cb95a4445a4519949edf76265~mv2.png/v1/fill/w_480,h_478,al_c,q_85,usm_4.00_1.00_0.00,enc_auto/2020_escudo%20colegio%20PA_20%25.png"
                  planetaUrl={getPlanetaUrl(certificadoNivel)}
                  carnet={userCarnet}
                />
              </ViewShot>
            </View>
            <TouchableOpacity
              style={styles.compartirButton}
              onPress={handleShare}
            >
              <Text style={styles.compartirButtonText}>
                Compartir Certificado
              </Text>
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
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 10,
    paddingHorizontal: 60,
    paddingVertical: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  planet: {
    width: 155,
    height: 155,
    marginBottom: 8,
  },
  cardTitle: {
    color: "white",
    fontSize: 18,
    marginVertical: 6,
    textAlign: "center",
    fontWeight: "bold",
  },
  descripcion: {
    color: "white",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ffd700",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  certificadoContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 0,
    padding: 1,
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
