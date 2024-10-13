import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

type OpcionComponenteProps = {
  preguntaId: string;
  onSelectOpcion: (opcion: string) => void;
};

const OpcionesComponente: React.FC<OpcionComponenteProps> = ({ preguntaId, onSelectOpcion }) => {
  const [opciones, setOpciones] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const response = await fetch(`http://192.168.0.15:8085/arrupe/sv/arrupe/respuestas`);
        const data = await response.json();
        const respuestasFiltradas = data.filter((respuesta: any[]) => respuesta[2].toString() === preguntaId);
        const opcionesMapeadas = respuestasFiltradas.map((respuesta: any[]) => respuesta[1]);
        setOpciones(opcionesMapeadas);
      } catch (error) {
        setError("Error al cargar las opciones.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpciones();
  }, [preguntaId]);

  if (loading) {
    return <ActivityIndicator size="small" color="#FFD700" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {opciones.map((opcion, index) => (
        <TouchableOpacity key={index} style={styles.opcionButton} onPress={() => onSelectOpcion(opcion)}>
          <View style={styles.bullet} />
          <Text style={styles.opcionText}>{opcion}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  opcionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
    marginRight: 10,
  },
  opcionText: {
    fontSize: 14,
    color: "#FFD700",
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default OpcionesComponente;