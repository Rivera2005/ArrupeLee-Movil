import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface ResultadoComponenteProps {
  titulo: string;
  nombreUsuario: string;
  idUsuario: string;
  fechaInicio: string;
  duracion: string;
  respuestasGuardadas: number;
  puntuacion: number;
  puntuacionMaxima: number;
  onRegresarListaIntentos: () => void;
  mensajeAdicional?: string; // Agregar este prop
}

const ResultadoComponente: React.FC<ResultadoComponenteProps> = ({
  titulo,
  nombreUsuario,
  idUsuario,
  fechaInicio,
  puntuacion,
  puntuacionMaxima,
  onRegresarListaIntentos,
  mensajeAdicional, // Recibir el nuevo prop
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
      <View style={styles.infoContainer}>
        <Image
          source={require('../../assets/perfilDefault.png')}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{nombreUsuario}</Text>
          <Text style={styles.userDetail}>Nombre de usuario: {idUsuario}</Text>
          <Text style={styles.userDetail}>Fecha de inicio: {fechaInicio}</Text>
        </View>
      </View>
      <View style={styles.puntuacionContainer}>
        <Text style={styles.puntuacionText}>
          Su puntuación total es: {puntuacion} / {puntuacionMaxima}
        </Text>
        {mensajeAdicional && ( // Mostrar mensaje adicional si existe
          <Text style={styles.mensajeAdicional}>{mensajeAdicional}</Text>
        )}
      </View>
      <Text style={styles.felicitaciones}>
        {puntuacion < 60
          ? "No ha alcanzado el puntaje mínimo."
          : "Felicitaciones ha aprobado el ejercicio."}
      </Text>
      <View style={styles.botonesContainer}>
        <TouchableOpacity
          style={styles.botonRegresar}
          onPress={onRegresarListaIntentos}
        >
          <Text style={styles.botonTexto}>REGRESAR A LA LISTA DE INTENTOS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#673AB7',
    padding: 20,
    borderRadius: 10,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  userDetail: {
    fontSize: 14,
    color: 'white',
  },
  resultadoContainer: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  resultadoText: {
    color: 'white',
    textAlign: 'center',
  },
  agradecimiento: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  puntuacionContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  puntuacionText: {
    color: '#673AB7',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  felicitaciones: {
    fontSize: 18,
    color: '#FFC107',
    textAlign: 'center',
    marginBottom: 20,
  },
  botonesContainer: {
    alignItems: 'center',
  },
  botonRealizarOtro: {
    backgroundColor: '#03A9F4',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  botonRegresar: {
    backgroundColor: '#00BCD4',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  botonTexto: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  mensajeAdicional: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default ResultadoComponente;