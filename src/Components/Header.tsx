import React from "react";
import { View, Image, StyleSheet} from "react-native";

const Header = () => {
    return (
      <View style={styles.header}>
          <Image
            source={require("../../assets/homeLogo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
      </View>
    );
  };
  
const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    paddingTop: 30,
    backgroundColor: "#673AB7",
  },
  headerLogo: {
    width: "80%",
    height: 60,
  },
});

export default Header;