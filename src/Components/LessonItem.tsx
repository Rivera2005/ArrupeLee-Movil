import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

type LessonItemProps = {
  title: string;
  progress: number;
  onPress: () => void;
  isLocked: boolean; // Prop para indicar si la lección está bloqueada
};

const LessonItem: React.FC<LessonItemProps> = ({
  title,
  progress,
  onPress,
  isLocked, // Usar la prop isLocked pasada desde LessonList
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isLocked && styles.lockedContainer]} // Aplica estilos adicionales si está bloqueada
      onPress={isLocked ? undefined : onPress} // Solo permite la navegación si no está bloqueada
      activeOpacity={isLocked ? 1 : 0.7} // Desactiva la opacidad de la interacción si está bloqueada
    >
      <View style={styles.iconContainer}>
        <Image
          source={require("../../assets/imgLecciones.png")}
          style={{
            width: 24,
            height: 24,
          }} // Cambia el color del ícono si está bloqueada
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, isLocked && styles.lockedText]}>
          {title}
        </Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>
      <Text style={[styles.progressText, isLocked && styles.lockedText]}>
        {progress}%
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  iconContainer: {
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  progressContainer: {
    height: 7,
    backgroundColor: "#E0E0E0",
    borderRadius: 2.5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  progressText: {
    fontSize: 14,
    color: "#888",
    marginLeft: 10,
  },
  lockedText: {
    color: "gray", // Cambia el color del texto si está bloqueada
  },
  lockedContainer: {
    opacity: 0.6, // Aplica una opacidad cuando está bloqueada
  },
});

export default LessonItem;
