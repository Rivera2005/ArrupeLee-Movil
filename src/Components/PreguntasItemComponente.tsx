import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type PreguntaItemProps = {
  pregunta: string;
  opciones: string[];
  onSelectOpcion: (opcion: string) => void;
};

const PreguntasItemComponente: React.FC<PreguntaItemProps> = ({
  pregunta,
  opciones,
  onSelectOpcion,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.pregunta}>{pregunta}</Text>
      {opciones.map((opcion, index) => (
        <TouchableOpacity
          key={index}
          style={styles.opcionButton}
          onPress={() => onSelectOpcion(opcion)}
        >
          <Text style={styles.opcionText}>{opcion}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.guardarButton}>
        <Text style={styles.guardarButtonText}>Guardar y continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#7E57C2",
    borderRadius: 10,
    padding: 20,
    margin: 10,
  },
  pregunta: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  opcionButton: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  opcionText: {
    color: "#673AB7",
  },
  guardarButton: {
    backgroundColor: "#4DD0E1",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  guardarButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default PreguntasItemComponente;
