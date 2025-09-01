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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.branco,
    borderWidth: 1.5,
    borderColor: colors.cinzaClaro,
    borderRadius: 16,
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: colors.verdeFolha,
    shadowColor: colors.verdeFolha,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainerError: {
    borderColor: colors.vermelhoErro,
    shadowColor: colors.vermelhoErro,
    shadowOpacity: 0.15,
  },
  inputContainerDisabled: {
    backgroundColor: colors.cinzaMuitoClaro,
    borderColor: colors.cinzaClaro,
    opacity: 0.6,
  },
  field: {
    flex: 1,
    paddingVertical: isSmallScreen ? 12 : 16,
    paddingHorizontal: isSmallScreen ? 12 : 16,
    color: colors.preto,
    fontSize: isSmallScreen ? 14 : isLargeScreen ? 18 : 16,
    fontWeight: '400',
  },
  fieldWithIcon: {
    paddingLeft: 8,
  },
  fieldWithSecureIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  rightIcon: {
    marginRight: 12,
    marginLeft: 8,
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  errorText: {
    color: colors.vermelhoErro,
    fontSize: 12,
    fontWeight: '500',
  },
  // Estilos legados para compatibilidade
  fieldFocused: {
    borderColor: colors.amareloOuro,
    shadowColor: colors.amareloOuro,
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
}); 