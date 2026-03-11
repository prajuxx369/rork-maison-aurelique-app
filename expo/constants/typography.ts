import { Platform, TextStyle } from 'react-native';

const serifFamily = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, "Times New Roman", serif',
}) as string;

const sansFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}) as string;

export const Typography = {
  serifFamily,
  sansFamily,
  hero: {
    fontFamily: serifFamily,
    fontSize: 42,
    fontWeight: '300' as const,
    letterSpacing: 2,
    lineHeight: 50,
  } satisfies TextStyle,
  h1: {
    fontFamily: serifFamily,
    fontSize: 32,
    fontWeight: '400' as const,
    letterSpacing: 1.5,
    lineHeight: 40,
  } satisfies TextStyle,
  h2: {
    fontFamily: serifFamily,
    fontSize: 24,
    fontWeight: '400' as const,
    letterSpacing: 1,
    lineHeight: 32,
  } satisfies TextStyle,
  h3: {
    fontFamily: serifFamily,
    fontSize: 20,
    fontWeight: '400' as const,
    letterSpacing: 0.8,
    lineHeight: 28,
  } satisfies TextStyle,
  subtitle: {
    fontFamily: sansFamily,
    fontSize: 16,
    fontWeight: '300' as const,
    letterSpacing: 2,
    lineHeight: 24,
    textTransform: 'uppercase' as const,
  } satisfies TextStyle,
  body: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: 0.3,
    lineHeight: 24,
  } satisfies TextStyle,
  bodySmall: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0.2,
    lineHeight: 20,
  } satisfies TextStyle,
  caption: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '300' as const,
    letterSpacing: 2,
    lineHeight: 16,
    textTransform: 'uppercase' as const,
  } satisfies TextStyle,
  price: {
    fontFamily: serifFamily,
    fontSize: 22,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
    lineHeight: 28,
  } satisfies TextStyle,
  button: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
  } satisfies TextStyle,
};
