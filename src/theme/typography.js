import { Platform } from 'react-native';

const FONT_TITLE = Platform.select({
  ios: 'System',
  android: 'Roboto',
  web: 'Montserrat, sans-serif',
  default: 'sans-serif',
});

const FONT_BODY = Platform.select({
  ios: 'System',
  android: 'Roboto',
  web: 'Inter, sans-serif',
  default: 'sans-serif',
});

export const FONTS = {
  // H1: Título Principal (28/32)
  h1: {
    fontFamily: FONT_TITLE,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
  },
  // H2: Seção (20/26)
  h2: {
    fontFamily: FONT_TITLE,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
  },
  // H3: Subtítulo (16/22)
  h3: {
    fontFamily: FONT_TITLE,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  // Body: Texto do corpo (14/20)
  body: {
    fontFamily: FONT_BODY,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  bodyBold: {
    fontFamily: FONT_BODY,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  // Caption: Legenda (12/16)
  caption: {
    fontFamily: FONT_BODY,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  captionBold: {
    fontFamily: FONT_BODY,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
};

export default FONTS;
