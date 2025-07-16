import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 400;
const isLargeScreen = SCREEN_WIDTH > 900;

export const cardStyles = StyleSheet.create({
  card: {
    position: 'relative',
    backgroundColor: colors.branco, // era #F5F5F3
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.marromFeijao, // era #650C0C
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    width: 320,
    marginVertical: isSmallScreen ? 8 : 12,
    marginHorizontal: 'auto',
  },
  cardTransparent: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  cardInteractive: {
    // cursor: pointer (não existe no RN, mas pode ser usado no web)
  },
  cardHovered: {
    transform: [{ scale: 1.05 }],
    shadowColor: colors.amareloOuro, // era #FBBF24
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 4 / 3,
    backgroundColor: colors.branco, // era #F5F5F3
    overflow: 'hidden',
    width: '100%',
    marginBottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0,
    transform: [{ scale: 1.1 }],
  },
  imageLoaded: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  imageHovered: {
    // No RN, pode-se usar filter no web, mas aqui só scale
    transform: [{ scale: 1.08 }],
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  content: {
    paddingTop: 0,
    paddingRight: isSmallScreen ? 14 : isLargeScreen ? 32 : 24,
    paddingBottom: isSmallScreen ? 14 : isLargeScreen ? 32 : 24,
    paddingLeft: isSmallScreen ? 14 : isLargeScreen ? 32 : 24,
    minHeight: 200,
    maxHeight: 200,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.verdeFolha, // era #650C0C
    fontSize: isSmallScreen ? 16 : isLargeScreen ? 24 : 20,
    fontWeight: 'bold',
    marginBottom: 2,
    marginTop: 0,
    lineHeight: isSmallScreen ? 20 : isLargeScreen ? 28 : 24,
  },
  subtitle: {
    color: colors.preto, // era #0B0B0B
    fontSize: isSmallScreen ? 12 : isLargeScreen ? 18 : 15,
    marginBottom: 12,
    lineHeight: isSmallScreen ? 15 : isLargeScreen ? 22 : 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  ratingValue: {
    color: colors.amareloOuro, // era #FBBF24
    fontSize: isSmallScreen ? 13 : isLargeScreen ? 18 : 16,
    marginLeft: 8,
  },
  indicator: {
    marginRight: 10,
    width: isSmallScreen ? 8 : 10,
    height: isSmallScreen ? 8 : 10,
    borderRadius: 5,
    backgroundColor: colors.verdeFolha, // era #650C0C
    alignSelf: 'center',
  },
  borderGlow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.verdeFolha + '20', // verde-folha com opacidade (ex: #2E7D3220)
    zIndex: 4,
  },
  borderGlowHovered: {
    borderColor: colors.verdeFolha, // verde-folha
    borderWidth: 2,
  },
  titleContainer: {
    height: 32,
    justifyContent: 'center',
    marginBottom: 24,
  },
  descriptionContainer: {
    height: 40,
    justifyContent: 'center',
  },
}); 