import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

type OpcionComponenteProps = {
  preguntaId: string;
  onSelectOpcion: (opcion: string) => void;
};

type Opcion = {
  id: string;
  texto: string;
};

const shuffleArray = (array: Opcion[]): Opcion[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const OpcionesComponente: React.FC<OpcionComponenteProps> = ({
  preguntaId,
  onSelectOpcion,
}) => {
  const [opciones, setOpciones] = useState<Opcion[]>([]);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const response = await fetch(
          `http://192.168.0.15:8085/arrupe/sv/arrupe/respuestas`
        );
        const data = await response.json();
        const respuestasFiltradas = data.filter(
          (respuesta: any[]) => respuesta[2].toString() === preguntaId
        );
        const opcionesMapeadas = respuestasFiltradas.map(
          (respuesta: any[]) => ({
            id: respuesta[0].toString(),
            texto: respuesta[1],
          })
        );

        const opcionesBarajadas = shuffleArray(opcionesMapeadas);
        setOpciones(opcionesBarajadas);
      } catch (error) {
        setError("Error al cargar las opciones.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpciones();
  }, [preguntaId]);

  const handleSelectOpcion = (opcion: Opcion) => {
    setOpcionSeleccionada(opcion.texto);
    onSelectOpcion(opcion.id);
  };

  if (loading) {
    return <ActivityIndicator size="small" color="#FFD700" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {opciones.map((opcion) => (
        <TouchableOpacity
          key={opcion.id}
          style={[
            styles.opcionButton,
            opcion.texto === opcionSeleccionada && styles.opcionButtonSeleccionada,
          ]}
          onPress={() => handleSelectOpcion(opcion)}
        >
          <View
            style={[
              styles.bullet,
              opcion.texto === opcionSeleccionada && styles.bulletSeleccionada,
            ]}
          />
          <Text
            style={[
              styles.opcionText,
              opcion.texto === opcionSeleccionada && styles.opcionTextSeleccionada,
            ]}
          >
            {opcion.texto}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  opcionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "transparent",
  },
  opcionButtonSeleccionada: {
    backgroundColor: "#FFD70020",
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFD700",
    marginRight: 10,
  },
  bulletSeleccionada: {
    backgroundColor: "#FFD700",
  },
  opcionText: {
    fontSize: 14,
    color: "#FFD700",
    flex: 1,
    fontWeight: "bold",
    textAlign: "left",
  },
  opcionTextSeleccionada: {
    color: "#FFFFFF",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

export default OpcionesComponente;