import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import Header from "../Components/Header";
import NavigationBar from "../Components/NavigationBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { captureRef } from "react-native-view-shot";
import CertificadoSVG from "../Components/CertificadoSVG";

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

  const certificadoRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Se requieren permisos para acceder a la galería.");
      }

      const literalProgress = await AsyncStorage.getItem("progressLiteral");
      const inferencialProgress = await AsyncStorage.getItem(
        "progressInferencial"
      );
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

  const handleDescargarCertificado = async () => {
    try {
      const uri = await captureRef(certificadoRef, {
        format: "png",
        quality: 0.8,
      });

      const fileName = `certificado_${certificadoNivel.toLowerCase()}.png`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await Sharing.shareAsync(asset.uri);
    } catch (error) {
      console.error("Error al descargar el certificado:", error);
      alert("Ocurrió un error al descargar el certificado.");
    }
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
            onObtenerCertificado={() =>
              handleObtenerCertificado(
                require("../../assets/certificadoPrueba.png")
              )
            }
          />
        )}
        {progressInferencial === 100 && (
          <CertificadoCard
            planetImage={require("../../assets/nivelInferencial.png")}
            nivel="INFERENCIAL"
            descripcion="Tras haber completado todas las lecciones del Nivel Inferencial has obtenido un reconocimiento."
            onObtenerCertificado={() =>
              handleObtenerCertificado(
                require("../../assets/certificadoPrueba.png")
              )
            }
          />
        )}
        {progressCritico === 100 && (
          <CertificadoCard
            planetImage={require("../../assets/nivelCritico.png")}
            nivel="CRÍTICO"
            descripcion="Tras haber completado todas las lecciones del Nivel Crítico has obtenido un reconocimiento."
            onObtenerCertificado={() =>
              handleObtenerCertificado(
                require("../../assets/certificadoPrueba.png")
              )
            }
          />
        )}
        {progressLiteral < 100 &&
          progressInferencial < 100 &&
          progressCritico < 100 && (
            <View style={styles.noCertificatesContainer}>
              <Text style={styles.noCertificatesText}>
                Aún no tienes certificados, completa los niveles de lectura.
              </Text>
            </View>
          )}
      </ScrollView>

      <Modal
        visible={certificadoVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View ref={certificadoRef} style={styles.certificadoContainer}>
            <CertificadoSVG
              nombre={userNombre}
              apellido={userApellido}
              nivel={certificadoNivel}
              fecha={new Date().toLocaleDateString()}
              logoUrl="https://static.wixstatic.com/media/700331_13536b8cb95a4445a4519949edf76265~mv2.png/v1/fill/w_480,h_478,al_c,q_85,usm_4.00_1.00_0.00,enc_auto/2020_escudo%20colegio%20PA_20%25.png"
              planetaUrl={getPlanetaUrl(certificadoNivel)}
            />
          </View>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDescargarCertificado}
          >
            <Text style={styles.downloadButtonText}>Compartir Certificado</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setCertificadoVisible(false)}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
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
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    marginBottom: 30,
  },
  planet: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  descripcion: {
    color: "white",
    textAlign: "center",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#ffd700",
    padding: 10,
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
  certificadoImage: {
    width: "90%",
    height: "70%",
  },
  downloadButton: {
    backgroundColor: "#ffd700",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  downloadButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  noCertificatesContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  noCertificatesText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  certificadoContainer: {
    width: 800,
    height: 600,
    backgroundColor: 'white',
  },
});
