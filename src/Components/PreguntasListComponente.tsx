import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, ActivityIndicator, Text } from "react-native";
import PreguntasItemComponente from "./PreguntasItemComponente";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Pregunta = {
  id: string;
  pregunta: string;
  pruebaId: number;
};

type PreguntasListComponenteProps = {
  pruebaId: number;
  renderFooter: (datosUsuariosRespuestas: any) => React.ReactElement;
  onTerminarEjercicio: (datosUsuariosRespuestas: any) => void;
};

const PreguntasListComponente: React.FC<PreguntasListComponenteProps> = ({
  pruebaId,
  renderFooter,
  onTerminarEjercicio,
}) => {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [selecciones, setSelecciones] = useState<{ [key: string]: string }>({});
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const response = await fetch(
          "http://192.168.0.10:8085/arrupe/sv/arrupe/preguntas"
        );
        const data = await response.json();

        const preguntasFiltradas = data.filter((pregunta: any[]) => {
          return pregunta[3] === pruebaId;
        });

        const preguntasMapeadas = preguntasFiltradas.map((pregunta: any[]) => ({
          id: pregunta[0].toString(),
          pregunta: pregunta[1],
          pruebaId: pregunta[3],
        }));

        setPreguntas(preguntasMapeadas);

        const storedUsuarioId = await AsyncStorage.getItem("userId");
        if (storedUsuarioId) {
          setUsuarioId(storedUsuarioId);
        }
      } catch (error) {
        setError("Error al cargar las preguntas.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreguntas();
  }, [pruebaId]);

  const handleGuardarOpcion = (
    preguntaId: string,
    opcionSeleccionada: string
  ) => {
    setSelecciones((prev) => ({ ...prev, [preguntaId]: opcionSeleccionada }));
  };

  const datosUsuariosRespuestas = preguntas.map((pregunta) => ({
    prueba: pruebaId,
    preguntas: parseInt(pregunta.id),
    respuestas: selecciones[pregunta.id] ? parseInt(selecciones[pregunta.id]) : null,
    Usuario: usuarioId ? parseInt(usuarioId) : null,
  }));

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
          onSelectOpcion={(opcion) => handleGuardarOpcion(item.id, opcion)}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ListFooterComponent={renderFooter(datosUsuariosRespuestas)}
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