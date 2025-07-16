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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: isSmallScreen ? 8 : isLargeScreen ? 24 : 16,
    paddingHorizontal: isSmallScreen ? 10 : isLargeScreen ? 64 : 32,
    backgroundColor: colors.branco, // era #F5F5F3
    borderBottomWidth: 1.5,
    borderBottomColor: colors.marromFeijao, // era #650C0C
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 9999,
  },
  logo: {
    fontSize: isSmallScreen ? 20 : isLargeScreen ? 40 : 32,
    fontWeight: 'bold',
    color: colors.verdeFolha, // era #650C0C
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: isSmallScreen ? 8 : 16,
  },
  btn: {
    paddingVertical: isSmallScreen ? 4 : 8,
    paddingHorizontal: isSmallScreen ? 12 : 24,
    fontSize: isSmallScreen ? 12 : 16,
    color: colors.verdeFolha, // era #650C0C
    backgroundColor: colors.branco, // novo: fundo branco
    borderRadius: 8,
    fontWeight: '500',
    borderWidth: 1.5,
    borderColor: colors.verdeFolha, // novo: borda verde-folha
    marginLeft: isSmallScreen ? 4 : 8,
  },
  btnActive: {
    borderWidth: 2,
    borderColor: colors.verdeFolha, // novo: verde-folha
    backgroundColor: colors.verdeFolha, // novo: fundo verde-folha
  },
  btnRegister: {
    backgroundColor: colors.vermelhoCambuci, // novo: vermelho-cambuci
    color: colors.branco, // novo: texto branco
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
    backgroundColor: colors.amareloOuro, // novo: amarelo-ouro
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.branco, // novo: branco
  },
  cartBadgeText: {
    color: colors.marromFeijao, // novo: marrom-feijão
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
}); 