import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 400;
const isMediumScreen = SCREEN_WIDTH >= 400 && SCREEN_WIDTH < 768;
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
    marginTop: 20, // Mais espaçamento
    marginBottom: 32, // Mais espaçamento
    paddingHorizontal: 16, // Padding lateral
  },
  banner: {
    width: '100%',
    height: isSmallScreen ? 160 : isLargeScreen ? 360 : 280, // Altura aumentada
    borderRadius: 20, // Cantos mais arredondados
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: colors.verdeFolha, // Cor atualizada
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  carouselSection: {
    marginTop: 24, // Mais espaçamento
    marginBottom: 40, // Mais espaçamento
    alignItems: 'center',
    paddingHorizontal: 16, // Padding lateral consistente
  },
  carouselTitle: {
    color: colors.verdeFolha,
    fontSize: isSmallScreen ? 24 : isLargeScreen ? 32 : 28, // Tamanho ajustado
    fontWeight: '700', // Peso mais forte
    marginBottom: 16, // Mais espaçamento
    textAlign: 'center',
    letterSpacing: 0.5, // Espaçamento entre letras
  },
  subtitle: {
    color: colors.amareloOuro,
    fontSize: isSmallScreen ? 18 : isLargeScreen ? 22 : 20,
    fontWeight: '600', // Peso ajustado
    marginBottom: 12, // Mais espaçamento
    textAlign: 'center',
  },
  textSmall: {
    color: colors.cinzaEscuro, // Cor mais suave
    fontSize: 15,
    marginBottom: 4, // Menos espaçamento
    textAlign: 'center',
    lineHeight: 20,
  },
  textLink: {
    color: colors.vermelhoCambuci,
    fontSize: 15,
    marginBottom: 4,
    textDecorationLine: 'underline',
    fontWeight: '600', // Peso ajustado
    textAlign: 'center',
  },
  // Novos estilos para melhorar a experiência
  searchSection: {
    backgroundColor: colors.cinzaMuitoClaro,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  searchTitle: {
    color: colors.verdeFolha,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  filterButton: {
    backgroundColor: colors.verdeFolha,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonText: {
    color: colors.branco,
    fontSize: 14,
    fontWeight: '600',
  },
  clearFilterButton: {
    backgroundColor: colors.vermelhoErro,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearFilterText: {
    color: colors.branco,
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  loadingText: {
    color: colors.cinzaMedio,
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: colors.cinzaMuitoClaro,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  errorText: {
    color: colors.vermelhoErro,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: colors.verdeFolha,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonText: {
    color: colors.branco,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    color: colors.cinzaMedio,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  // Estilos para seção institucional
  aboutSection: {
    backgroundColor: colors.cinzaMuitoClaro,
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    borderRadius: 20,
    marginTop: 40,
    marginBottom: 24,
  },
  aboutTitle: {
    color: colors.verdeFolha,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  aboutText: {
    color: colors.cinzaEscuro,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  // Estilos para footer - Versão equilibrada
  footerContainer: {
    backgroundColor: colors.cinzaMuitoClaro,
    paddingVertical: isSmallScreen ? 24 : 32,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    marginTop: 24,
    width: '100%',
  },
  footerContent: {
    flexDirection: (isSmallScreen || isMediumScreen) ? 'column' : 'row',
    justifyContent: (isSmallScreen || isMediumScreen) ? 'flex-start' : 'space-around',
    flexWrap: 'wrap',
    gap: (isSmallScreen || isMediumScreen) ? 64 : 24,
    marginBottom: 24,
    width: '100%',
    alignItems: (isSmallScreen || isMediumScreen) ? 'stretch' : 'flex-start',
  },
  footerSection: {
    flex: (isSmallScreen || isMediumScreen) ? 0 : 1,
    width: (isSmallScreen || isMediumScreen) ? '100%' : undefined,
    minWidth: (isSmallScreen || isMediumScreen) ? '100%' : 200,
    maxWidth: (isSmallScreen || isMediumScreen) ? '100%' : undefined,
    alignItems: (isSmallScreen || isMediumScreen) ? 'center' : 'flex-start',
    marginBottom: 0,
    marginTop: 0,
    paddingTop: 0,
  },
  footerTitle: {
    color: colors.verdeFolha,
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: '700',
    marginBottom: isSmallScreen ? 12 : 8,
    textAlign: isSmallScreen ? 'center' : 'left',
    width: '100%',
  },
  footerDescription: {
    color: colors.cinzaEscuro,
    fontSize: isSmallScreen ? 13 : 14,
    lineHeight: isSmallScreen ? 18 : 20,
    marginBottom: (isSmallScreen || isMediumScreen) ? 0 : 16,
    textAlign: (isSmallScreen || isMediumScreen) ? 'center' : 'left',
    width: '100%',
    paddingHorizontal: (isSmallScreen || isMediumScreen) ? 8 : 0,
    paddingBottom: (isSmallScreen || isMediumScreen) ? 0 : 0,
  },
  footerSubtitle: {
    color: colors.verdeFolha,
    fontSize: isSmallScreen ? 15 : 16,
    fontWeight: '600',
    marginBottom: isSmallScreen ? 10 : 12,
    textAlign: isSmallScreen ? 'center' : 'left',
    width: '100%',
  },
  footerLink: {
    color: colors.cinzaEscuro,
    fontSize: (isSmallScreen || isMediumScreen) ? 13 : 14,
    marginBottom: 0,
    textDecorationLine: 'underline',
    textAlign: (isSmallScreen || isMediumScreen) ? 'center' : 'left',
    width: '100%',
    paddingVertical: (isSmallScreen || isMediumScreen) ? 4 : 0,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: colors.cinzaClaro,
    paddingTop: 16,
    alignItems: 'center',
  },
  footerCopyright: {
    color: colors.cinzaMedio,
    fontSize: 12,
    textAlign: 'center',
  },
  footerLinks: {
    alignItems: 'center',
    gap: 8,
  },
}); 