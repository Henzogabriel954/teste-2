import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Path,
  G,
  Rect,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import COLORS from '../theme/colors';

export default function HortaLogo({ size = 110, showText = true }) {
  const viewBoxSize = 200;
  const radius = 94;
  const center = 100;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
        <Defs>
          <LinearGradient id="techGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={COLORS.primary} />
            <Stop offset="100%" stopColor={COLORS.techBlue} />
          </LinearGradient>
          <LinearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#48C343" />
            <Stop offset="100%" stopColor={COLORS.primary} />
          </LinearGradient>
        </Defs>

        {/* Círculo de fundo branco com borda verde dupla */}
        <Circle cx={center} cy={center} r={radius} fill="#FFFFFF" stroke={COLORS.primary} strokeWidth="6" />
        <Circle cx={center} cy={center} r={radius - 7} fill="none" stroke={COLORS.lightGreen} strokeWidth="1.5" />

        {/* Texto superior do arco: HORTA 4.0 */}
        <SvgText
          x="100"
          y="42"
          textAnchor="middle"
          fill={COLORS.primary}
          fontSize="22"
          fontWeight="900"
          letterSpacing="2"
        >
          HORTA 4.0
        </SvgText>

        {/* Elemento central: Base Tecnológica / Circuito / QR Code */}
        <G transform="translate(68, 108)">
          {/* Base em bloco simulando matriz QR Code / Circuito */}
          <Rect x="0" y="0" width="64" height="28" rx="6" fill="#F0F7F3" stroke={COLORS.primary} strokeWidth="2.5" />
          
          {/* Padrão de blocos QR internos */}
          <Rect x="5" y="5" width="8" height="8" rx="1.5" fill={COLORS.primary} />
          <Rect x="17" y="5" width="6" height="6" rx="1" fill={COLORS.techBlue} />
          <Rect x="27" y="5" width="10" height="5" rx="1" fill={COLORS.primary} />
          <Rect x="41" y="5" width="6" height="6" rx="1" fill={COLORS.secondary} />
          <Rect x="51" y="5" width="8" height="8" rx="1.5" fill={COLORS.primary} />

          <Rect x="5" y="16" width="6" height="6" rx="1" fill={COLORS.techBlue} />
          <Rect x="15" y="15" width="14" height="7" rx="1.5" fill={COLORS.primary} />
          <Rect x="33" y="15" width="8" height="7" rx="1" fill={COLORS.techBlue} />
          <Rect x="45" y="15" width="14" height="7" rx="1.5" fill={COLORS.secondary} />
        </G>

        {/* Planta e Folhas brotando do solo tecnológico */}
        <G transform="translate(100, 108)">
          {/* Caule central */}
          <Path
            d="M 0 0 L 0 -38"
            stroke={COLORS.primary}
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Folha central grande */}
          <Path
            d="M 0 -38 C -12 -58, 0 -72, 0 -76 C 0 -72, 12 -58, 0 -38 Z"
            fill="url(#leafGrad)"
            stroke={COLORS.primary}
            strokeWidth="2"
          />

          {/* Folha esquerda */}
          <Path
            d="M 0 -22 C -18 -26, -28 -42, -26 -52 C -18 -48, -8 -36, 0 -22 Z"
            fill={COLORS.secondary}
            stroke={COLORS.primary}
            strokeWidth="2"
          />

          {/* Folha direita */}
          <Path
            d="M 0 -24 C 18 -28, 28 -44, 26 -54 C 18 -50, 8 -38, 0 -24 Z"
            fill={COLORS.secondary}
            stroke={COLORS.primary}
            strokeWidth="2"
          />

          {/* Nervuras das folhas */}
          <Path d="M 0 -70 L 0 -42" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <Path d="M -18 -46 Q -10 -36 0 -26" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          <Path d="M 18 -48 Q 10 -38 0 -28" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        </G>

        {/* Texto circular inferior: RASTREABILIDADE · PEGADA DE CARBONO · CONSUMO CONSCIENTE */}
        {showText && (
          <G>
            <SvgText
              x="100"
              y="156"
              textAnchor="middle"
              fill={COLORS.primary}
              fontSize="7.2"
              fontWeight="800"
              letterSpacing="0.8"
            >
              RASTREABILIDADE
            </SvgText>
            <SvgText
              x="100"
              y="167"
              textAnchor="middle"
              fill={COLORS.textMuted}
              fontSize="6.2"
              fontWeight="700"
              letterSpacing="0.4"
            >
              • PEGADA DE CARBONO •
            </SvgText>
            <SvgText
              x="100"
              y="178"
              textAnchor="middle"
              fill={COLORS.primary}
              fontSize="6.8"
              fontWeight="800"
              letterSpacing="0.5"
            >
              CONSUMO CONSCIENTE
            </SvgText>
          </G>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
