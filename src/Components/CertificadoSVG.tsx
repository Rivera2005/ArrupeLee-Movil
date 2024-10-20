import React from "react";
import { Svg, Rect, Text, Image, Defs, Pattern } from "react-native-svg";
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
  carnet,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = 225;
  

  return (
    <Svg height={screenHeight} width={screenWidth} viewBox={`0 0 ${screenWidth} ${screenHeight}`}>
      {/* Fondo del certificado con imagen */}
      <Defs>
        <Pattern id="bgPattern" patternUnits="userSpaceOnUse" width="100%" height="100%">
          <Image
            href={require("../../assets/bg.png")}
            x="0"
            y="0"
            width={screenWidth}
            height={screenHeight}
            preserveAspectRatio="xMidYMid slice"
          />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#bgPattern)" />

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
        fontFamily="Baskerville, serif"
      >
        Certificado de Finalización
      </Text>

      {/* Descripción */}
      <Text
        fill="white"
        fontSize="10"
        x="10"
        y="115"
        fontFamily="Baskerville, serif"
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
        fontFamily="Baskerville, serif"
      >
        {`${nombre} ${apellido}`}
      </Text>

      {/* Carné del Estudiante */}
      <Text
        fill="white"
        fontSize="10"
        x="10"
        y="158"
        fontFamily="Baskerville, serif"
      >
        Con número de carné: {carnet}
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
        fontFamily="Baskerville, serif"
      >
        Ha completado satisfactoriamente el Nivel {nivel}
      </Text>

      {/* Fecha */}
      <Text
        fill="white"
        fontSize="10"
        x="10"
        y="216"
        fontFamily="Baskerville, serif"
      >
        Fecha: {fecha}
      </Text>
    </Svg>
  );
};

export default CertificadoSVG;