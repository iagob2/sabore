import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 400;
const isLargeScreen = SCREEN_WIDTH > 900;

export const cardStyles = StyleSheet.create({
  card: {
    position: 'relative',
    backgroundColor: colors.branco,
    borderRadius: 24, // Cantos mais arredondados
    overflow: 'hidden',
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: 4 }, // Sombra mais pronunciada
    shadowOpacity: 0.12,
    shadowRadius: 12, // Sombra mais suave
    elevation: 8, // Elevação aumentada para Android
    width: 320,
    marginVertical: isSmallScreen ? 12 : 16, // Mais espaçamento
    marginHorizontal: 'auto',
    borderWidth: 1,
    borderColor: colors.cinzaMuitoClaro, // Borda sutil
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
    transform: [{ scale: 1.02 }], // Escala mais sutil
    shadowColor: colors.verdeFolha,
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
    borderColor: colors.verdeFolha,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 16 / 10, // Proporção mais moderna
    backgroundColor: colors.cinzaMuitoClaro, // Placeholder color
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
    paddingTop: 16, // Mais espaçamento no topo
    paddingRight: isSmallScreen ? 16 : isLargeScreen ? 24 : 20,
    paddingBottom: isSmallScreen ? 16 : isLargeScreen ? 24 : 20,
    paddingLeft: isSmallScreen ? 16 : isLargeScreen ? 24 : 20,
    minHeight: 120, // Altura reduzida para melhor proporção
    maxHeight: 140,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.verdeFolha,
    fontSize: isSmallScreen ? 18 : isLargeScreen ? 22 : 20,
    fontWeight: '700', // Peso mais forte
    marginBottom: 6, // Mais espaçamento
    marginTop: 0,
    lineHeight: isSmallScreen ? 22 : isLargeScreen ? 26 : 24,
    letterSpacing: 0.2, // Espaçamento entre letras
  },
  subtitle: {
    color: colors.cinzaEscuro, // Cor mais suave
    fontSize: isSmallScreen ? 13 : isLargeScreen ? 16 : 14,
    marginBottom: 12,
    lineHeight: isSmallScreen ? 18 : isLargeScreen ? 20 : 18,
    fontWeight: '400',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12, // Mais espaçamento
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cinzaMuitoClaro, // Divisor sutil
  },
  ratingValue: {
    color: colors.amareloOuro,
    fontSize: isSmallScreen ? 14 : isLargeScreen ? 16 : 15,
    marginLeft: 8,
    fontWeight: '600',
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
  borderGlowHovered: {
    borderColor: colors.verdeFolha,
    borderWidth: 2,
  },
  titleContainer: {
    height: 28, // Altura ajustada
    justifyContent: 'center',
    marginBottom: 8, // Menos espaçamento
  },
  descriptionContainer: {
    height: 36, // Altura ajustada
    justifyContent: 'center',
  },
  // Novos estilos para badges e tags
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 5,
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
  badgeText: {
    color: colors.branco,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  // Estilos para informações adicionais
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
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
}); 