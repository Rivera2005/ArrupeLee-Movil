import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';

type LevelProgressProps = {
  currentLevel: string;
  onLevelPress: (level: string) => void;
  unlockedLevels: string[];
};

const levels = ['LITERAL', 'INFERENCIAL', 'CRITICO'];

const LevelProgress: React.FC<LevelProgressProps> = ({ currentLevel, onLevelPress, unlockedLevels }) => {
  return (
    <View style={styles.container}>
      {levels.map((level) => {
        const isUnlocked = unlockedLevels.includes(level);
        const isCurrent = level === currentLevel;
        
        return (
          <TouchableOpacity 
            key={level} 
            onPress={() => isUnlocked && onLevelPress(level)}
            style={styles.planetContainer}
            disabled={!isUnlocked}
          >
            <Image
              source={
                level === 'LITERAL'
                  ? require('../../assets/nivelLiteral.png')
                  : level === 'INFERENCIAL'
                  ? require('../../assets/nivelInferencial.png')
                  : require('../../assets/nivelCritico.png')
              }
              style={[
                styles.planet,
                isUnlocked && !isCurrent && styles.unselectedPlanet,
                isCurrent && styles.selectedPlanet,
                !isUnlocked && styles.lockedPlanet
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  planetContainer: {
    alignItems: 'center',
  },
  planet: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  selectedPlanet: {
    opacity: 1,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  unselectedPlanet: {
    opacity: 0.6,
  },
  lockedPlanet: {
    opacity: 0.1, 
  },
});

export default LevelProgress;