import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 400;
const isLargeScreen = SCREEN_WIDTH > 900;

export const indexStyles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.branco,
    minHeight: '100%',
  },
  scroll: {
    flex: 1,
  },
  bannerContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  banner: {
    width: '100%',
    height: isSmallScreen ? 140 : isLargeScreen ? 340 : 260,
    borderRadius: 16,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: colors.marromFeijao,
  },
  carouselSection: {
    marginTop: 12,
    marginBottom: 32,
    alignItems: 'center',
  },
  carouselTitle: {
    color: colors.verdeFolha,
    fontSize: 28, // aumentado para dar mais destaque
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: colors.amareloOuro,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textSmall: {
    color: colors.preto,
    fontSize: 15,
    marginBottom: 2,
  },
  textLink: {
    color: colors.vermelhoCambuci,
    fontSize: 15,
    marginBottom: 2,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
}); 