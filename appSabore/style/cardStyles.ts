import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 400;
const isLargeScreen = SCREEN_WIDTH > 900;

export const cardStyles = StyleSheet.create({
  card: {
    position: 'relative',
    backgroundColor: colors.branco,
    borderRadius: 20, // Cantos arredondados
    overflow: 'hidden',
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    width: '100%',
    maxWidth: 220,
    minWidth: 180,
    marginVertical: isSmallScreen ? 8 : 12,
    borderWidth: 1,
    borderColor: colors.cinzaMuitoClaro, // Borda sutil
  },
  cardCompact: {
    borderRadius: 18,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTransparent: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 0,
  },
  cardInteractive: {
    // cursor: pointer (não existe no RN, mas pode ser usado no web)
  },
  cardHovered: {
    transform: [{ scale: 1.015 }], // Escala mais sutil
    shadowColor: colors.verdeFolha,
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
    borderColor: colors.verdeFolha,
  },
  cardHoveredCompact: {
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 16 / 10, // Proporção mais moderna
    backgroundColor: colors.cinzaMuitoClaro, // Placeholder color
    overflow: 'hidden',
    width: '100%',
    marginBottom: 0,
  },
  imageContainerCompact: {
    aspectRatio: 4 / 3,
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
    transform: [{ scale: 1.05 }], // Escala mais sutil
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
    paddingTop: 12,
    paddingRight: isSmallScreen ? 12 : isLargeScreen ? 18 : 16,
    paddingBottom: isSmallScreen ? 12 : isLargeScreen ? 20 : 16,
    paddingLeft: isSmallScreen ? 12 : isLargeScreen ? 18 : 16,
    minHeight: 110,
    maxHeight: 130,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  contentCompact: {
    paddingTop: 10,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    minHeight: 100,
    maxHeight: 120,
  },
  title: {
    color: colors.verdeFolha,
    fontSize: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 0,
    lineHeight: isSmallScreen ? 20 : isLargeScreen ? 24 : 22,
    letterSpacing: 0.2, // Espaçamento entre letras
  },
  titleCompact: {
    fontSize: isSmallScreen ? 15 : isLargeScreen ? 18 : 16,
    marginBottom: 2,
  },
  subtitle: {
    color: colors.cinzaEscuro, // Cor mais suave
    fontSize: isSmallScreen ? 12 : isLargeScreen ? 15 : 13,
    marginBottom: 10,
    lineHeight: isSmallScreen ? 16 : isLargeScreen ? 20 : 18,
    fontWeight: '400',
  },
  subtitleCompact: {
    fontSize: isSmallScreen ? 11.5 : isLargeScreen ? 14 : 12,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.cinzaMuitoClaro, // Divisor sutil
  },
  ratingRowCompact: {
    marginTop: 8,
    paddingTop: 8,
  },
  ratingValue: {
    color: colors.amareloOuro,
    fontSize: isSmallScreen ? 14 : isLargeScreen ? 16 : 15,
    marginLeft: 8,
    fontWeight: '600',
  },
  ratingValueCompact: {
    fontSize: isSmallScreen ? 13 : isLargeScreen ? 15 : 14,
  },
  indicator: {
    marginRight: 10,
    width: isSmallScreen ? 8 : 10,
    height: isSmallScreen ? 8 : 10,
    borderRadius: 5,
    backgroundColor: colors.verdeFolha,
    alignSelf: 'center',
  },
  borderGlow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.verdeFolha + '20',
    zIndex: 4,
  },
  borderGlowCompact: {
    borderRadius: 18,
  },
  borderGlowHovered: {
    borderColor: colors.verdeFolha,
    borderWidth: 2,
  },
  titleContainer: {
    height: 24, // Altura ajustada
    justifyContent: 'center',
    marginBottom: 6, // Menos espaçamento
  },
  titleContainerCompact: {
    height: 22,
    marginBottom: 4,
  },
  descriptionContainer: {
    minHeight: 32,
    maxHeight: 36,
    justifyContent: 'center',
  },
  descriptionContainerCompact: {
    minHeight: 28,
    maxHeight: 32,
  },
  // Novos estilos para badges e tags
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 5,
  },
  badgeContainerCompact: {
    top: 10,
    right: 10,
  },
  badge: {
    backgroundColor: colors.rosaPromocao,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeCompact: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    color: colors.branco,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  badgeTextCompact: {
    fontSize: 9,
  },
  // Estilos para informações adicionais
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
    flexWrap: 'wrap',
  },
  infoRowCompact: {
    marginTop: 6,
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    color: colors.cinzaMedio,
    fontSize: 12,
    fontWeight: '500',
  },
  infoTextCompact: {
    fontSize: 11,
  },
}); 