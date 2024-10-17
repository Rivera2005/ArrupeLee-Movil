import React from "react";
import { Svg, Rect, Text, Image } from "react-native-svg";
import { Dimensions } from "react-native";

interface CertificadoSVGProps {
  nombre: string;
  apellido: string;
  nivel: string;
  fecha: string;
  logoUrl: string;
  planetaUrl: string;
}

const CertificadoSVG: React.FC<CertificadoSVGProps & { carnet: string }> = ({
  nombre,
  apellido,
  nivel,
  fecha,
  logoUrl,
  planetaUrl,
  carnet, // Añadir el carné
}) => {
  const screenWidth = Dimensions.get("window").width;
  var screenHeight = Dimensions.get("window").height;
  const height = 225;

  return (
    <Svg
      height={height}
      width={screenWidth}
      viewBox={`0 0 ${screenWidth} ${height}`}
    >
      {/* Fondo del certificado */}
      <Rect x="-2" y="0" width="100%" height="100%" fill="#7F40BD" />

      {/* Logo "Padre Arrupe" */}
      <Image
        x="10"
        y="15"
        width="55"
        height="55"
        href={logoUrl}
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Logo "Planet Arrupe" */}
      <Image
        x="65"
        y="25"
        width="145"
        height="35"
        href={require("../../assets/homeLogo.png")}
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Título del Certificado */}
      <Text
        fill="white"
        fontSize="14"
        x="10"
        y="95"
        fontWeight="bold"
        fontFamily="Georgia, serif"
      >
        Certificado de Finalización
      </Text>

      {/* Descripción */}
      <Text
        fill="white"
        fontSize="10"
        x="10"
        y="115"
        fontFamily="Georgia, serif"
      >
        Por este medio Arrupe Lee certifica que el estudiante:
      </Text>

      {/* Nombre del Estudiante */}
      <Text
        fill="white"
        fontSize="15"
        x="10"
        y="138"
        fontWeight="bold"
        fontFamily="Georgia, serif"
      >
        {`${nombre} ${apellido}`}
      </Text>

      {/* Carné del Estudiante */}
      <Text
        fill="white"
        fontSize="10"
        x="10"
        y="158"
        fontFamily="Georgia, serif"
      >
        Con número de carné: {carnet} {/* Usar el carné dinámico */}
      </Text>

      {/* Imagen del Planeta */}
      <Image
        x="250"
        y="60"
        width="110"
        height="110"
        href={planetaUrl}
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Descripción del Nivel */}
      <Text
        fill="white"
        fontSize="10"
        x="10"
        y="178"
        fontFamily="Georgia, serif"
      >
        Ha completado satisfactoriamente el Nivel {nivel}
      </Text>

      {/* Fecha */}
      <Text
        fill="white"
        fontSize="10"
        x="10"
        y="216"
        fontFamily="Georgia, serif"
      >
        Fecha: {fecha}
      </Text>
    </Svg>
  );
};

export default CertificadoSVG;
