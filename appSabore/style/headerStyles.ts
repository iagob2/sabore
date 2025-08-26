import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 400;
const isLargeScreen = SCREEN_WIDTH > 900;

export const headerStyles = StyleSheet.create({
  header: {
    width: '100%',
    maxWidth: isLargeScreen ? 1800 : isSmallScreen ? 600 : 1400,
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: isSmallScreen ? 16 : isLargeScreen ? 24 : 16, // Padding superior aumentado para mobile
    paddingBottom: isSmallScreen ? 4 : isLargeScreen ? 24 : 16,
    paddingHorizontal: isSmallScreen ? 6 : isLargeScreen ? 64 : 32,
    backgroundColor: colors.branco,
    // Removida a linha e adicionada sombra mais sutil
    borderBottomWidth: 0,
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 9999,
  },
  logo: {
    fontSize: isSmallScreen ? 16 : isLargeScreen ? 40 : 32, // Ainda mais reduzido para mobile
    fontWeight: 'bold',
    color: colors.verdeFolha,
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: isSmallScreen ? 6 : 16,
    flexWrap: 'wrap',
    justifyContent: isSmallScreen ? 'center' : 'flex-end',
    flexShrink: 1,
    maxWidth: '100%',
  },
  btn: {
    paddingVertical: isSmallScreen ? 4 : 8,
    paddingHorizontal: isSmallScreen ? 12 : 24,
    fontSize: isSmallScreen ? 12 : 16,
    color: colors.verdeFolha,
    backgroundColor: colors.branco,
    borderRadius: 8,
    fontWeight: '500',
    borderWidth: 1.5,
    borderColor: colors.verdeFolha,
    marginLeft: isSmallScreen ? 4 : 8,
  },
  btnActive: {
    borderWidth: 2,
    borderColor: colors.verdeFolha,
    backgroundColor: colors.verdeFolha,
  },
  btnRegister: {
    backgroundColor: colors.vermelhoCambuci,
    color: colors.branco,
    fontWeight: '600',
    borderColor: colors.vermelhoCambuci,
    borderWidth: 1.5,
  },
  cartButton: {
    position: 'relative',
    paddingVertical: isSmallScreen ? 4 : 8,
    paddingHorizontal: isSmallScreen ? 12 : 16,
    backgroundColor: 'transparent',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: isSmallScreen ? 4 : 8,
  },
  cartBadge: {
    position: 'absolute',
    top: isSmallScreen ? -2 : -4,
    right: isSmallScreen ? -2 : -4,
    backgroundColor: colors.amareloOuro,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.branco,
  },
  cartBadgeText: {
    color: colors.marromFeijao,
    fontSize: isSmallScreen ? 10 : 12,
    fontWeight: 'bold',
  },
  // Menu suspenso (usado inline, mas pode ser referenciado)
  dropdownMenu: {
    backgroundColor: colors.branco,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.marromFeijao,
    minWidth: 180,
    zIndex: 9999,
    shadowColor: colors.marromFeijao,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  mobileMenuPanel: {
    width: '100%',
    backgroundColor: colors.branco,
    borderBottomWidth: 1,
    borderBottomColor: colors.marromFeijao,
    borderTopWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  mobileMenuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.marromFeijao,
  },
  mobileMenuText: {
    color: colors.verdeFolha,
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 