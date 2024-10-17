import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from "react-native";
import OpcionesComponente from "./OpcionesComponente";

type PreguntaItemProps = {
  pregunta: string;
  preguntaId: string;
  onSelectOpcion: (opcion: string) => void;
};

const PreguntasItemComponente: React.FC<PreguntaItemProps> = ({
  pregunta,
  preguntaId,
  onSelectOpcion,
}) => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);

  const handleGuardarYContinuar = () => {
    if (opcionSeleccionada) {
      onSelectOpcion(opcionSeleccionada);
      setGuardado(true);
    } else {
      console.warn(`No se seleccionó ninguna opción para la pregunta ${preguntaId}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pregunta}>{pregunta}</Text>
      <OpcionesComponente
        preguntaId={preguntaId}
        onSelectOpcion={(opcion) => setOpcionSeleccionada(opcion)}
      />
      <TouchableOpacity style={styles.continuarButton} onPress={handleGuardarYContinuar}>
        <Text style={styles.continuarButtonText}>Guardar y continuar</Text>
        {guardado && (
          <Image
            source={{ uri: "http://arrupelee.edu.sv/main/img/icons/22/save.png" }}
            style={styles.iconoGuardado}
          />
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continuarButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  iconoGuardado: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
});

export default PreguntasItemComponente;