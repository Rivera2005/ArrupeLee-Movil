import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

type LessonItemProps = {
  title: string;
  progress: number;
  onPress: () => void;
};

const LessonItem: React.FC<LessonItemProps> = ({
  title,
  progress,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image
          source={require("../../assets/imgLecciones.png")}
          style={{ width: 24, height: 24 }}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>
      <Text style={styles.progressText}>{progress}%</Text>
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
});

export default LessonItem;