import React, { useState, useEffect } from "react";
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
import CustomAlert from "./CustomAlert"; // Importa tu componente CustomAlert

type IntentoPrueba = {
  id: number;
  fecha: string;
  fechaFormateada: string;
  puntuacion: string;
  indiceConsecutivo: number;
};

type PruebaComponentProps = {
  intentos: IntentoPrueba[]; // Lista de intentos recibidos desde DetalleLeccionScreen
  pruebaId: number | null; // Ahora recibimos el pruebaId como prop
  lessonId: number | null;
  formatearFecha: (fecha: string) => string;
};

const PruebaComponent: React.FC<PruebaComponentProps> = ({
  intentos,
  pruebaId,
  lessonId,
  formatearFecha,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [progreso, setProgreso] = useState<number | null>(null); // Estado para almacenar el progreso del usuario
  const [showAlert, setShowAlert] = useState(false); // Estado para controlar si mostramos el CustomAlert
  const [alertMessage, setAlertMessage] = useState(""); // Estado para el mensaje del CustomAlert

  useEffect(() => {
    const obtenerProgreso = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");

      if (storedUserId) {
        const userId = Number(storedUserId); // No es necesario convertir a entero ya que usaremos como string

        // Aquí se hace la petición para obtener el progreso del usuario
        const response = await fetch(
          `http://192.168.0.10:8085/arrupe/sv/arrupe/progresoEstudiante`
        );

        if (response.ok) {
          const data: Array<[number, number, string, number, number]> =
            await response.json();

          // Filtramos los datos para encontrar el progreso del usuario en la lección actual
          const usuarioProgreso = data.find(
            (item) => item[1] === userId && item[3] === lessonId
          );

          if (usuarioProgreso) {
            setProgreso(usuarioProgreso[4]); // Suponemos que el progreso está en la posición 4 del array
          } else {
            console.log(
              "No se encontró progreso para el usuario en la lección especificada."
            );
          }
        } else {
          console.error("Error al obtener el progreso del usuario.");
        }
      }
    };

    obtenerProgreso();
  }, [lessonId]); // Agregar lessonId como dependencia para que se vuelva a ejecutar si cambia

  console.log(pruebaId)
  const iniciarPrueba = () => {
    if (progreso !== null && progreso >= 75) {
      if (pruebaId && lessonId) {
        navigation.navigate("Preguntas", {
          pruebaId: pruebaId,
          leccionId: lessonId,
        });
      } else {
        console.warn(
          "El id de la prueba o el id de la lección no está disponible."
        );
      }
    } else {
      setAlertMessage(
        "Antes de iniciar la prueba, por favor lea la lección completa."
      );
      setShowAlert(true); // Mostramos la alerta
    }
  };

  const onMostrarDetalle = (intentoId: number) => {
    navigation.navigate("ResultadoIntento", { intentoId });
  };

  const renderItem = ({ item }: { item: IntentoPrueba }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.indiceConsecutivo}</Text>
      <Text style={styles.cell}>{item.fechaFormateada}</Text>
      <Text style={styles.cell}>{item.puntuacion}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onMostrarDetalle(item.id)}
      >
        <Text style={styles.buttonText}>Mostrar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
    {showAlert && (
      <CustomAlert
        message={alertMessage}
        onDismiss={() => setShowAlert(false)}
      />
    )}

    <View style={styles.container}>
      {/* Mover CustomAlert aquí para asegurarse de que se ve en la pantalla */}
    
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
          data={[...intentos].reverse()}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
    </>
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
