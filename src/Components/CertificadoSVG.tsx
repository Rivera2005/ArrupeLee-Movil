import React from "react";
import { Svg, Rect, Text, Image } from "react-native-svg";

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
  return (
    <Svg height="600" width="800" viewBox="0 0 800 600">
      <Rect x="0" y="0" width="800" height="600" fill="#8A2BE2" />

      <Image
        x="20"
        y="20"
        width="100"
        height="100"
        href={logoUrl}
        preserveAspectRatio="xMidYMid slice"
      />

      <Text
        fill="white"
        fontSize="40"
        x="400"
        y="80"
        textAnchor="middle"
        fontWeight="bold"
      >
        Certificado de Finalización
      </Text>

      <Text fill="white" fontSize="24" x="50" y="200">
        Por este medio Arrupe Lee certifica que el estudiante:
      </Text>

      <Text
        fill="white"
        fontSize="32"
        x="400"
        y="280"
        textAnchor="middle"
        fontWeight="bold"
      >
        {`${nombre} ${apellido}`}
      </Text>

      <Text fill="white" fontSize="24" x="50" y="350">
        {`Ha completado satisfactoriamente el Nivel ${nivel}`}
      </Text>

      <Text fill="white" fontSize="20" x="50" y="550">
        {`Fecha: ${fecha}`}
      </Text>

      <Image
        x="650"
        y="450"
        width="100"
        height="100"
        href={planetaUrl}
        preserveAspectRatio="xMidYMid slice"
      />
    </Svg>
  );
};

export default CertificadoSVG;
