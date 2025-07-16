import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 400;
const isLargeScreen = SCREEN_WIDTH > 900;

export const inputStyles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: isLargeScreen ? 600 : isSmallScreen ? 280 : 400,
    marginBottom: isSmallScreen ? 12 : 24,
    alignSelf: 'center',
  },
  label: {
    color: colors.verdeFolha,
    fontSize: isSmallScreen ? 12 : isLargeScreen ? 20 : 16,
    fontWeight: '500',
    marginBottom: isSmallScreen ? 4 : 8,
    letterSpacing: 0.5,
  },
  field: {
    width: '100%',
    paddingVertical: isSmallScreen ? 8 : 14,
    paddingHorizontal: isSmallScreen ? 10 : 18,
    backgroundColor: colors.branco,
    borderWidth: 1.5,
    borderColor: colors.verdeFolha,
    borderRadius: 12,
    color: colors.verdeFolha,
    fontSize: isSmallScreen ? 13 : isLargeScreen ? 20 : 17,
  },
  fieldFocused: {
    borderColor: colors.amareloOuro,
    shadowColor: colors.amareloOuro,
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
}); 