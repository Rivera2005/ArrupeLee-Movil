import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, ActivityIndicator, Text } from "react-native";
import PreguntasItemComponente from "./PreguntasItemComponente";

type Pregunta = {
  id: string;
  pregunta: string;
  pruebaId: string;
};

type PreguntasListComponenteProps = {
  pruebaId: string;
  renderFooter: () => React.ReactElement;
};

const PreguntasListComponente: React.FC<PreguntasListComponenteProps> = ({
  pruebaId,
  renderFooter,
}) => {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const response = await fetch(
          "http://192.168.0.15:8085/arrupe/sv/arrupe/preguntas"
        );
        const data = await response.json();

        const preguntasFiltradas = data.filter((pregunta: any[]) => {
          return pregunta[3].toString() === pruebaId;
        });

        const preguntasMapeadas = preguntasFiltradas.map((pregunta: any[]) => ({
          id: pregunta[0].toString(),
          pregunta: pregunta[1],
          pruebaId: pregunta[3],
        }));

        setPreguntas(preguntasMapeadas);
      } catch (error) {
        setError("Error al cargar las preguntas.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreguntas();
  }, [pruebaId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#FFD700" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <FlatList
      data={preguntas}
      renderItem={({ item }) => (
        <PreguntasItemComponente
          pregunta={item.pregunta}
          preguntaId={item.id}
          onSelectOpcion={(opcion) =>
            console.log(`Pregunta ${item.id}, opción seleccionada: ${opcion}`)
          }
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  errorText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
});

export default PreguntasListComponente;