import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomAlert from "../Components/CustomAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  const [carnet, setCarnet] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigateTo = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "http://192.242.6.131:8085/arrupe/sv/arrupe/usuarios",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorText}`
        );
      }

      const data = await response.json();

      const usuario = data.find((user: any) => user[1] === carnet);

      if (usuario && usuario[4] === password) {
        await AsyncStorage.setItem("userId", usuario[0].toString());
        await AsyncStorage.setItem("userNombre", usuario[2]);
        await AsyncStorage.setItem("userApellido", usuario[3]);
        await AsyncStorage.setItem("userCorreo", usuario[13]);
        await AsyncStorage.setItem("userNivelEducativo", usuario[12]);

        setAlertMessage("Inicio de sesión exitoso");
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
          navigation.navigate("Home");
        }, 1000);
      } else {
        setError("Credenciales inválidas");
      }
    } catch (err) {
      console.error("Error de conexión:", err.message);
      setError("Error al conectar con el servidor");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../../assets/header_AL.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Identificación</Text>
        <TextInput
          style={styles.input}
          placeholder="Carné N°"
          placeholderTextColor="#999"
          value={carnet}
          onChangeText={setCarnet}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
          >
            <Feather
              name={showPassword ? "eye" : "eye-off"}
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>¿Ha olvidado su contraseña?</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <Text style={styles.footer}>Proyecto de Fundación Padre Arrupe</Text>
      <Text style={styles.copyright}>© 2024</Text>
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onDismiss={() => setShowAlert(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#673AB7",
    padding: 20,
  },
  card: {
    backgroundColor: "#7E57C2",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 50,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#00BCD4",
    width: "100%",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#FFEB3B",
    marginTop: 15,
  },
  error: {
    color: "#FF5252",
    marginTop: 10,
  },
  footer: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
  },
  copyright: {
    color: "#FFFFFF",
    marginTop: 5,
    fontSize: 12,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
});
