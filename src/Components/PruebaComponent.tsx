import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/StackNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

type IntentoPrueba = {
  id: number;
  fecha: string;
  fechaFormateada: string;
  puntuacion: string;
  indiceConsecutivo: number; // Agrega el campo aquí
};

type PruebaComponentProps = {
  intentos: IntentoPrueba[];
  onMostrarDetalles: (id: number) => void;
  onObtenerPruebaId: (id: number) => void;
  formatearFecha: (fecha: string) => string;
};

const PruebaComponent: React.FC<PruebaComponentProps> = ({
  intentos,
  onObtenerPruebaId,
  formatearFecha,
}) => {
  const [pruebaId, setPruebaId] = useState<number | null>(null);
  const [lessonId, setLessonId] = useState<number | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchLessonPruebaId = async () => {
      try {
        const storedLessonId = await AsyncStorage.getItem("lessonId");
        if (storedLessonId) {
          const parsedLessonId = parseInt(storedLessonId, 10);
          setLessonId(parsedLessonId);

          const response = await fetch(
            "http://192.168.0.15:8085/arrupe/sv/arrupe/leccionesPruebas"
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          const matchingLesson = data.find(
            (lesson: any[]) => lesson[1] === parsedLessonId
          );

          if (matchingLesson) {
            const id_leccion_prueba = matchingLesson[0];
            const pruebaResponse = await fetch(
              `http://192.168.0.15:8085/arrupe/sv/arrupe/leccionesPruebas/${id_leccion_prueba}`
            );
            if (!pruebaResponse.ok) {
              throw new Error(`HTTP error! Status: ${pruebaResponse.status}`);
            }

            const pruebaData = await pruebaResponse.json();
            const obtainedPruebaId = pruebaData[0][3];
            setPruebaId(obtainedPruebaId);

            if (onObtenerPruebaId && obtainedPruebaId) {
              onObtenerPruebaId(obtainedPruebaId);
            }
          }
        } else {
          console.error("No se encontró el lessonId en AsyncStorage.");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error al obtener el id de la prueba:", error.message);
        } else {
          console.error("Error desconocido:", error);
        }
      }
    };

    fetchLessonPruebaId();
  }, [onObtenerPruebaId]); // Asegurarnos de que se ejecute si cambia onObtenerPruebaId

  const iniciarPrueba = () => {
    if (pruebaId) {
      navigation.navigate("Preguntas", { pruebaId: pruebaId.toString() });
    } else {
      console.warn("El id de la prueba no está disponible.");
    }
  };

  const onMostrarDetalle = (intentoId: number) => {
    navigation.navigate("ResultadoIntento", { intentoId }); // Pasar intentoId
  };

  const renderItem = ({ item }: { item: IntentoPrueba }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.indiceConsecutivo}</Text>
      <Text style={styles.cell}>{item.fechaFormateada}</Text>
      <Text style={styles.cell}>{item.puntuacion}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onMostrarDetalle(item.id)} // Usa el ID real para operaciones
      >
        <Text style={styles.buttonText}>Mostrar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prueba de Conocimientos</Text>
      <TouchableOpacity style={styles.iniciarButton} onPress={iniciarPrueba}>
        <Text style={styles.iniciarButtonText}>INICIAR LA PRUEBA</Text>
      </TouchableOpacity>
      <View style={styles.tableContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Intento</Text>
          <Text style={styles.headerText}>Fecha de inicio</Text>
          <Text style={styles.headerText}>Puntuación</Text>
          <Text style={styles.headerText}>Detalles</Text>
        </View>
        <FlatList
          data={[...intentos].reverse()} // Invierte el orden de los intentos
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 0,
    paddingTop: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 16,
    textAlign: "center",
  },
  iniciarButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 16,
  },
  iniciarButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  tableContainer: {
    backgroundColor: "#7E57C2",
    borderRadius: 4,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#5E35B1",
    padding: 8,
  },
  headerText: {
    flex: 1,
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#5E35B1",
    padding: 8,
  },
  cell: {
    flex: 1,
    color: "#FFF",
    fontSize: 12,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3F51B5",
    padding: 4,
    borderRadius: 4,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 12,
  },
});

export default PruebaComponent;
