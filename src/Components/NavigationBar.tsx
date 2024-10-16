import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Modal, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/StackNavigator";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavbarNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  keyof RootStackParamList
>;

const NavigationBar = () => {
  const navigation = useNavigation<NavbarNavigationProp>();
  const route =
    useRoute<RouteProp<RootStackParamList, keyof RootStackParamList>>();
  const [isMenuVisible, setMenuVisible] = useState(false);

  const [userNombre, setUserNombre] = useState<string | null>(null);
  const [userApellido, setUserApellido] = useState<string | null>(null);
  const [userCorreo, setUserCorreo] = useState<string | null>(null);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const nombre = await AsyncStorage.getItem("userNombre");
        const apellido = await AsyncStorage.getItem("userApellido");
        const correo = await AsyncStorage.getItem("userCorreo");

        if (nombre) setUserNombre(nombre);
        if (apellido) setUserApellido(apellido);
        if (correo) setUserCorreo(correo);
      } catch (error) {
        console.error("Error al cargar el perfil del usuario:", error);
      }
    };

    getUserProfile();
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const getButtonBackgroundColor = (screen: keyof RootStackParamList) => {
    return route.name === screen ? "#FFC107" : "#673AB7";
  };

  return (
    <View>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={toggleMenu}>
          <Ionicons name="menu-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={toggleMenu}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <View style={styles.userProfile}>
              <Image
                source={require("../../assets/perfilDefault.png")}
                style={styles.avatar}
              />
              <Text style={styles.userName}>
                {userNombre} {userApellido}
              </Text>
              <Text style={styles.userEmail}>{userCorreo}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.menuItem,
                { backgroundColor: getButtonBackgroundColor("Home") },
              ]}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.menuItemText}>Mi aventura lectora</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.menuItem,
                { backgroundColor: getButtonBackgroundColor("Niveles") },
              ]}
              onPress={() => navigation.navigate("BitacoraVuelo")}
            >
              <Text style={styles.menuItemText}>Mi progreso</Text>
            </TouchableOpacity>
            <View style={styles.menuFooter}>
              <TouchableOpacity style={styles.footerItem}>
                <Ionicons name="mail-outline" size={24} color="#666" />
                <Text style={styles.footerItemText}>Bandeja de entrada</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.footerItem}
                onPress={() => navigation.navigate("Certificados")}
              >
                <Ionicons name="school-outline" size={24} color="#666" />
                <Text style={styles.footerItemText}>Mis certificados</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.footerItem}
                onPress={() => navigation.navigate("Niveles")}
              >
                <Ionicons name="log-out-outline" size={24} color="#FF0000" />
                <Text style={styles.footerItemTextLogout}>Salir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#512DA8",
    height: 60,
  },
  iconButton: {
    padding: 5,
    width: 40,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuContainer: {
    backgroundColor: "white",
    width: "80%",
    height: "100%",
  },
  userProfile: {
    padding: 20,
    backgroundColor: "#673AB7",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  userEmail: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  menuItem: {
    padding: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: "white",
  },
  menuFooter: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  footerItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  footerItemTextLogout: {
    marginLeft: 10,
    fontSize: 16,
    color: "#FF0000",
  },
});

export default NavigationBar;