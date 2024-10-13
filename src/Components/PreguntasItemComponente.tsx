import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import OpcionesComponente from "./OpcionesComponente";

type PreguntaItemProps = {
  pregunta: string;
  preguntaId: string;
  onSelectOpcion: (opcion: string) => void;
};

const PreguntasItemComponente: React.FC<PreguntaItemProps> = ({ pregunta, preguntaId, onSelectOpcion }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.pregunta}>{pregunta}</Text>
      <OpcionesComponente preguntaId={preguntaId} onSelectOpcion={onSelectOpcion} />
      <TouchableOpacity style={styles.continuarButton}>
        <Text style={styles.continuarButtonText}>Guardar y continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#7E57C2",
    borderRadius: 10,
    marginBottom: 20,
    width: windowWidth - 20,
    alignSelf: 'center',
  },
  pregunta: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#fff",
    textAlign: "center",
  },
  continuarButton: {
    backgroundColor: '#4FC3F7',
    padding: 10,
    marginTop: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  continuarButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default PreguntasItemComponente;