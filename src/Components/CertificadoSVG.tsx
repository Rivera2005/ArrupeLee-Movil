import React from "react";
import { Svg, Rect, Text, Image } from "react-native-svg";
import { Dimensions } from 'react-native';

interface CertificadoSVGProps {
  nombre: string;
  apellido: string;
  nivel: string;
  fecha: string;
  logoUrl: string;
  planetaUrl: string;
}

const CertificadoSVG: React.FC<CertificadoSVGProps> = ({
  nombre,
  apellido,
  nivel,
  fecha,
  logoUrl,
  planetaUrl,
}) => {
  const screenWidth = Dimensions.get('window').width;
  var screenHeight = Dimensions.get('window').height;
  console.log(screenHeight);
  const height = 390; // Establece una altura fija o calculada según el contenido
  screenHeight = 776


  return (
    <Svg height={height} width={screenWidth} viewBox={`0 0 ${screenWidth} ${screenHeight}`}>
      {/* Fondo del certificado */}
      <Rect x="-220" y="15" width="100%" height="51%" fill="#7F40BD" />

      {/* Logo "Padre Arrupe" */}
      <Image
        x="-130"
        y="45"
        width="115"
        height="115"
        href={logoUrl}
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Logo "Planet Arrupe" */}
      <Image
        x="0"
        y="75"
        width="230"
        height="50"
        href={require("../../assets/homeLogo.png")} // Ruta a tu logo de Planet Arrupe
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Título del Certificado */}
      <Text
        fill="white"
        fontSize="28"
        x="55"
        y="200"
        textAnchor="middle"
        fontWeight="bold"
      >
        Certificado de Finalización
      </Text>

      {/* Descripción */}
      <Text
        fill="white"
        fontSize="15"
        x="65"
        y="235"
        textAnchor="middle"
      >
        Por este medio Arrupe Lee certifica que el estudiante:
      </Text>

      {/* Nombre del Estudiante */}
      <Text
        fill="white"
        fontSize="28"
        x="65"
        y="280"
        textAnchor="middle"
        fontWeight="bold"
      >
        {`${nombre} ${apellido}`}
      </Text>

      {/* Carné del Estudiante */}
      <Text
        fill="white"
        fontSize="16"
        x="0"
        y="315"
        textAnchor="middle"
      >
        Con número de carné: VY131112
      </Text>

      {/* Imagen del Planeta */}
      <Image
        x="285"
        y="120"
        width="225"
        height="225"
        href={planetaUrl}
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Descripción del Nivel */}
      <Text
        fill="white"
        fontSize="16"
        x="-115"
        y="348"
      >
        Ha completado satisfactoriamente el Nivel {nivel}
      </Text>

      {/* Fecha */}
      <Text
        fill="white"
        fontSize="14"
        x="-150"
        y="390"
      >
        Fecha: {fecha}
      </Text>
    </Svg>
  );
};

export default CertificadoSVG;
