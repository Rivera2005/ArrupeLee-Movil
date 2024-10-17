import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/StackNavigator";

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

    const iniciarPrueba = () => {
      if (pruebaId && lessonId) {
        navigation.navigate("Preguntas", { pruebaId: pruebaId, leccionId: lessonId });
      } else {
        console.warn("El id de la prueba o el id de la lección no está disponible.");
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
          data={[...intentos].reverse()} // Mostrar los intentos en orden inverso
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
