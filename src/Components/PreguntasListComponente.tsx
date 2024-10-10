import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import PreguntasItemComponente from "./PreguntasItemComponente";

type Pregunta = {
  id: string;
  pregunta: string;
  opciones: string[];
};

const PreguntasListComponente: React.FC = () => {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);

  useEffect(() => {
    // Aquí irá la lógica para cargar las preguntas desde una API
    // Por ahora, usaremos datos de ejemplo
    setPreguntas([
      {
        id: "1",
        pregunta: "¿Por qué el ratón foráneo comió con el ratón citadino?",
        opciones: [
          "Porque el ratón citadino lo invitó a comer",
          "Porque el ratón foráneo estaba perdido en la ciudad y tenía hambre.",
          "Porque el ratón citadino quería presumir de sus comodidades.",
          "Porque eran amigos desde hace mucho tiempo y se reunieron para cenar.",
        ],
      },
      // Añadir más preguntas aquí...
    ]);
  }, []);

  const handleSelectOpcion = (preguntaId: string, opcion: string) => {
    // Aquí irá la lógica para manejar la selección de una opción
    console.log(`Pregunta ${preguntaId}, opción seleccionada: ${opcion}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={preguntas}
        renderItem={({ item }) => (
          <PreguntasItemComponente
            pregunta={item.pregunta}
            opciones={item.opciones}
            onSelectOpcion={(opcion) => handleSelectOpcion(item.id, opcion)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#673AB7",
  },
});

export default PreguntasListComponente;
