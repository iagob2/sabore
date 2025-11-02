
import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, Image, Text, Dimensions, TouchableOpacity, useWindowDimensions, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import HorizontalCardCarousel from '../components/HorizontalCardCarousel';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from '../hooks/use-toast';
import { indexStyles } from '../style/indexStyles';
import { useRouter } from 'expo-router';
import { colors } from '../style/colors';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { listarRestaurantes, RestauranteResponse, API_BASE_URL } from '../api/restaurante';

const Index = () => {
  const [name, setName] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { width: screenWidth } = useWindowDimensions();
  const isSmallScreen = screenWidth < 380;
  const isMediumScreen = screenWidth >= 380 && screenWidth < 768;
  const carouselHeight = isSmallScreen ? 220 : isMediumScreen ? 260 : 320;
  const titleFontSize = isSmallScreen ? 18 : 20;
  const subtitleFontSize = isSmallScreen ? 14 : 16;
  const descFontSize = isSmallScreen ? 12 : 14;
  const arrowButtonSize = isSmallScreen ? 36 : 44;
  const arrowIconSize = isSmallScreen ? 24 : 28;
  const searchInputWidth = Math.min(520, Math.max(280, Math.floor(screenWidth * 0.9)));
  const [searchQuery, setSearchQuery] = useState('');
  const [useLocationFilter, setUseLocationFilter] = useState(false);
  const [userLocation, setUserLocation] = useState<null | { latitude: number; longitude: number }>(null);
  const [radiusKm, setRadiusKm] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para dados do backend
  const [restaurantes, setRestaurantes] = useState<RestauranteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar restaurantes do backend
  const carregarRestaurantes = async () => {
    try {
      setLoading(true);
      setError(null);
      const dados = await listarRestaurantes();
      console.log('Restaurantes carregados da API:', dados);
      
      setRestaurantes(dados);
    } catch (err) {
      console.error('Erro ao carregar restaurantes:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar restaurantes');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os restaurantes. Usando dados locais.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Função para pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    carregarRestaurantes();
  };

  // Carregar dados quando o componente montar
  useEffect(() => {
    carregarRestaurantes();
  }, []);

  // Array de imagens padrão para variar entre restaurantes
  const imagensPadrao = [
    require('../assets/restaurante1.png'),
    require('../assets/restaurante2.png'),
    require('../assets/rest1.png'),
    require('../assets/rest2.png')
  ];

  // Função para adaptar dados da API para o formato dos cards
  const adaptarRestauranteParaCard = (restaurante: RestauranteResponse, index: number = 0) => {
    let logoUrl = restaurante.logoUrl?.trim();
    
    // Se a URL não começa com http/https, construir com API_BASE_URL
    if (logoUrl && !logoUrl.startsWith('http://') && !logoUrl.startsWith('https://')) {
      // Remove barras iniciais duplicadas e constrói URL completa
      const path = logoUrl.startsWith('/') ? logoUrl : `/${logoUrl}`;
      logoUrl = `${API_BASE_URL}${path}`;
    }
    
    const temLogoValida = logoUrl && (logoUrl.startsWith('http://') || logoUrl.startsWith('https://'));
    // Usar index ao invés de ID para manter consistência com a ordem recebida
    const imagemPadrao = imagensPadrao[index % imagensPadrao.length];
    
    // Gerar dados aleatórios para demonstração
    const deliveryTimes = ['20-30 min', '30-45 min', '15-25 min', '25-35 min'];
    const deliveryFees = ['Grátis', 'R$ 3,00', 'R$ 5,00', 'R$ 2,50'];
    const distances = ['0.8 km', '1.2 km', '0.5 km', '1.5 km'];
    
    return {
      id: restaurante.id.toString(),
      imageUrl: temLogoValida ? logoUrl : imagemPadrao, // Passa string ou número diretamente
      name: restaurante.nome,
      rating: 4.0 + (Math.random() * 0.9), // Rating entre 4.0 e 4.9
      subtitle: restaurante.descricao || 'Deliciosos pratos esperando por você',
      latitude: -23.5505,
      longitude: -46.6333,
      // Novos dados para melhorar a experiência
      deliveryTime: deliveryTimes[restaurante.id % deliveryTimes.length],
      deliveryFee: deliveryFees[restaurante.id % deliveryFees.length],
      distance: distances[restaurante.id % distances.length],
      hasPromotion: restaurante.id % 3 === 0, // 33% têm promoções
    };
  };

  // Dados dos restaurantes locais
  const cardData = [
    {
      id: '1',
      imageUrl: require('../assets/restaurante1.png'),
      name: 'Brasil Brasileiro',
      rating: 4.9,
      subtitle: 'A melhor moqueca da cidade',
      latitude: -23.55052,
      longitude: -46.633308,
      deliveryTime: '25-35 min',
      deliveryFee: 'Grátis',
      distance: '0.8 km',
      hasPromotion: true,
    },
    {
      id: '2',
      imageUrl: require('../assets/restaurante2.png'),
      name: 'Cozinha da Mãe',
      rating: 4.8,
      subtitle: 'O melhor acarajé da cidade',
      latitude: -23.559616,
      longitude: -46.658279,
      deliveryTime: '20-30 min',
      deliveryFee: 'R$ 3,00',
      distance: '1.2 km',
      hasPromotion: false,
    },
    {
      id: '3',
      imageUrl: require('../assets/rest1.png'),
      name: 'Sashimi Express',
      rating: 4.7,
      subtitle: 'Sashimis frescos e delivery rápido',
      latitude: -23.566246,
      longitude: -46.652381,
      deliveryTime: '15-25 min',
      deliveryFee: 'R$ 5,00',
      distance: '0.5 km',
      hasPromotion: true,
    }
  ];

  const handleCardClick = (id: string) => {
    const card = todosOsCards.find(c => c.id === id);
    if (card) {
      router.push({
        pathname: '/perfilEmpresa',
        params: { 
          id: id,
          ...(restaurantes.length > 0 && { 
            restauranteData: JSON.stringify(restaurantes.find(r => r.id.toString() === id))
          })
        }
      });
    } else {
      toast({
        title: "Restaurante Selecionado",
        description: `Você escolheu: ${card?.name}`,
      });
    }
  };

  // Ofertas dos restaurantes para o carrossel do topo
  const ofertasPadrao = [
    {
      id: 'of1',
      image: require('../assets/restaurante1.png'),
      title: 'Brasil Brasileiro',
      subtitle: 'Moqueca com 20% OFF',
      description: 'Promo válida até domingo. Peça já!'
    },
    {
      id: 'of2',
      image: require('../assets/restaurante2.png'),
      title: 'Cozinha da Mãe',
      subtitle: 'Acarajé em dobro',
      description: 'Na compra de 1, leve 2. Somente hoje.'
    },
    {
      id: 'of3',
      image: require('../assets/rest1.png'),
      title: 'Sashimi Express',
      subtitle: 'Combo Sashimi -15%',
      description: 'Peixes frescos com desconto imperdível.'
    },
    {
      id: 'of4',
      image: require('../assets/rest2.png'),
      title: 'Casa do Sabor',
      subtitle: 'Frete grátis',
      description: 'Para pedidos acima de R$ 50,00.'
    }
  ];

  // Criar ofertas dinâmicas baseadas nos restaurantes da API
  const ofertasDinamicas = restaurantes.slice(0, 4).map((restaurante, index) => {
    let logoUrl = restaurante.logoUrl?.trim();
    
    // Se a URL não começa com http/https, construir com API_BASE_URL
    if (logoUrl && !logoUrl.startsWith('http://') && !logoUrl.startsWith('https://')) {
      // Remove barras iniciais duplicadas e constrói URL completa
      const path = logoUrl.startsWith('/') ? logoUrl : `/${logoUrl}`;
      logoUrl = `${API_BASE_URL}${path}`;
    }
    
    const temLogoValida = logoUrl && (logoUrl.startsWith('http://') || logoUrl.startsWith('https://'));
    // Usar index ao invés de ID para manter consistência com a ordem recebida
    const imagemPadrao = imagensPadrao[index % imagensPadrao.length];
    
    return {
      id: `api-${restaurante.id}`,
      image: temLogoValida ? { uri: logoUrl } : imagemPadrao,
      title: restaurante.nome,
      subtitle: 'Ofertas especiais disponíveis',
      description: restaurante.descricao || 'Venha experimentar nossos pratos deliciosos!'
    };
  });

  const offers = ofertasDinamicas.length > 0 ? ofertasDinamicas : ofertasPadrao;

  function abrirCarrinho() {
    console.log('Carrinho atual:', carrinho);
    router.push('/carrinho');
  }

  const goToSlide = (index: number) => {
    if (!scrollViewRef.current) return;
    const clampedIndex = Math.max(0, Math.min(index, offers.length - 1));
    scrollViewRef.current.scrollTo({ x: clampedIndex * screenWidth, animated: true });
    setCurrentSlide(clampedIndex);
  };

  const goPrev = () => goToSlide(currentSlide - 1);
  const goNext = () => goToSlide(currentSlide + 1);

  // Distância Haversine (km)
  const distanceInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleUseLocation = async () => {
    try {
      if (Platform.OS === 'web') {
        if (!('geolocation' in navigator)) {
          toast({ title: 'Indisponível', description: 'Geolocalização não suportada no navegador.' });
          return;
        }
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('timeout')), 6000);
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              clearTimeout(timeout);
              setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
              setUseLocationFilter(true);
              toast({ title: 'Localização ativada', description: 'Filtrando restaurantes próximos.' });
              resolve();
            },
            (err) => {
              clearTimeout(timeout);
              reject(err);
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 10000 }
          );
        });
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        toast({ title: 'Permissão negada', description: 'Não foi possível acessar sua localização.' });
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const coords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      setUserLocation(coords);
      setUseLocationFilter(true);
      toast({ title: 'Localização ativada', description: 'Filtrando restaurantes próximos.' });
    } catch (e) {
      toast({ title: 'Erro de localização', description: 'Tente novamente mais tarde.' });
    }
  };

  const clearLocationFilter = () => {
    setUseLocationFilter(false);
    setUserLocation(null);
  };

  // Combinar dados da API com dados locais para fallback
  // Garantir ordem consistente baseada no index
  const todosOsCards = [
    // Dados da API adaptados - usando index para manter ordem consistente
    ...restaurantes.map((restaurante, index) => {
      console.log(`📸 Restaurante ${restaurante.nome} (ID: ${restaurante.id}, Index: ${index}) - Logo: ${restaurante.logoUrl}`);
      return adaptarRestauranteParaCard(restaurante, index);
    }),
    // Dados locais como fallback caso a API não funcione
    ...(restaurantes.length === 0 ? cardData : [])
  ];

  // Garantir que sempre temos dados para exibir - priorizar dados locais quando há erro
  const cardsParaExibir = error || restaurantes.length === 0 ? cardData : todosOsCards;

  const filteredCards = cardsParaExibir.filter((card: any) => {
    const matchesText = `${card.name} ${card.subtitle ?? ''}`
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());
    if (!matchesText) return false;
    if (useLocationFilter && userLocation && card.latitude && card.longitude) {
      const dist = distanceInKm(
        userLocation.latitude,
        userLocation.longitude,
        card.latitude,
        card.longitude
      );
      return dist <= radiusKm;
    }
    return true;
  });

  return (
    <View style={indexStyles.main}>
      <Header 
        logo="Saborê" 
        cartItemCount={carrinho.length}
        onCartPress={abrirCarrinho}
      />
      <ScrollView 
        style={indexStyles.scroll} 
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.verdeFolha]}
            tintColor={colors.verdeFolha}
          />
        }
      >
        {/* Carrossel de Ofertas */}
        <View style={indexStyles.bannerContainer}>
          <View style={{
            width: '100%',
            height: carouselHeight,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 20,
            shadowColor: colors.preto,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 12,
          }}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const slideWidth = event.nativeEvent?.layoutMeasurement?.width || screenWidth || 1;
                const offsetX = event.nativeEvent?.contentOffset?.x || 0;
                const slideIndex = Math.max(0, Math.round(offsetX / slideWidth));
                if (!Number.isNaN(slideIndex) && Number.isFinite(slideIndex)) {
                  setCurrentSlide(Math.min(slideIndex, offers.length - 1));
                }
              }}
              style={{ flex: 1 }}
            >
              {offers.map((offer, index) => (
                <View key={offer.id} style={{
                  width: screenWidth,
                  height: carouselHeight,
                  position: 'relative'
                }}>
                  <Image
                    source={offer.image}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover'
                    }}
                  />
                  <View style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: colors.overlayEscuro,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 16,
                    shadowColor: colors.preto,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4,
                  }}>
                    <Text style={{ color: colors.branco, fontSize: 12, fontWeight: '600' }}>
                      {index + 1} / {offers.length}
                    </Text>
                  </View>
                  <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: colors.overlayEscuro,
                    padding: 20,
                    paddingBottom: 24
                  }}>
                    <Text style={{
                      color: colors.branco,
                      fontSize: titleFontSize,
                      fontWeight: '700',
                      marginBottom: 6,
                      letterSpacing: 0.3,
                    }}>
                      {offer.title}
                    </Text>
                    <Text style={{
                      color: colors.amareloOuro,
                      fontSize: subtitleFontSize,
                      fontWeight: '600',
                      marginBottom: 4,
                    }}>
                      {offer.subtitle}
                    </Text>
                    <Text style={{
                      color: colors.branco,
                      fontSize: descFontSize,
                      opacity: 0.9,
                      lineHeight: 18,
                    }}>
                      {offer.description}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            {/* Setas de navegação */}
            {offers.length > 1 && (
              <View
                pointerEvents="box-none"
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  justifyContent: 'center',
                }}
              >
                {/* Esquerda */}
                <TouchableOpacity
                  onPress={goPrev}
                  disabled={currentSlide === 0}
                  activeOpacity={0.7}
                  style={{
                    position: 'absolute',
                    left: 12,
                    width: arrowButtonSize,
                    height: arrowButtonSize,
                    borderRadius: arrowButtonSize / 2,
                    backgroundColor: colors.overlayEscuro,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: currentSlide === 0 ? 0.4 : 1,
                    shadowColor: colors.preto,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                  hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                >
                  <MaterialIcons name="chevron-left" size={arrowIconSize} color={colors.branco} />
                </TouchableOpacity>

                {/* Direita */}
                <TouchableOpacity
                  onPress={goNext}
                  disabled={currentSlide === offers.length - 1}
                  activeOpacity={0.7}
                  style={{
                    position: 'absolute',
                    right: 12,
                    width: arrowButtonSize,
                    height: arrowButtonSize,
                    borderRadius: arrowButtonSize / 2,
                    backgroundColor: colors.overlayEscuro,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: currentSlide === offers.length - 1 ? 0.4 : 1,
                    shadowColor: colors.preto,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                  hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                >
                  <MaterialIcons name="chevron-right" size={arrowIconSize} color={colors.branco} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Seção de Busca */}
        <View style={indexStyles.searchSection}>
          <Text style={indexStyles.searchTitle}>Encontre seu restaurante ideal</Text>
          <View style={{ width: '100%', gap: 16 }}>
            {/* Input centralizado */}
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: searchInputWidth, alignSelf: 'center' }}>
                <Input
                  placeholder="Pesquise por nome, especialidade ou prato..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  icon="search"
                />
              </View>
            </View>

            {/* Botão de localização */}
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                onPress={handleUseLocation}
                activeOpacity={0.85}
                style={indexStyles.filterButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialIcons name="my-location" color={colors.branco} size={18} />
                <Text style={indexStyles.filterButtonText}>Usar minha localização</Text>
              </TouchableOpacity>
            </View>

            {/* Filtros ativos */}
            {useLocationFilter && (
              <View style={indexStyles.filterContainer}>
                <TouchableOpacity
                  onPress={clearLocationFilter}
                  activeOpacity={0.85}
                  style={indexStyles.clearFilterButton}
                >
                  <MaterialIcons name="close" color={colors.branco} size={16} />
                  <Text style={indexStyles.clearFilterText}>Remover filtro</Text>
                </TouchableOpacity>
                {userLocation && (
                  <Text style={{ color: colors.cinzaEscuro, textAlign: 'center', fontSize: 14 }}>
                    Filtrando por proximidade (até {radiusKm} km)
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Resultados da Busca */}
        {searchQuery.trim() || useLocationFilter ? (
        <View style={indexStyles.carouselSection}>
            <Text style={indexStyles.carouselTitle}>
              {loading ? 'Buscando...' : `Resultados (${filteredCards.length})`}
            </Text>
          {loading ? (
              <View style={indexStyles.loadingContainer}>
                <LoadingSpinner 
                  size="large" 
                  text="Carregando restaurantes..."
                  color={colors.verdeFolha}
                />
            </View>
          ) : error ? (
              <View style={indexStyles.errorContainer}>
                <MaterialIcons name="error-outline" size={48} color={colors.vermelhoErro} />
                <Text style={indexStyles.errorText}>
                {error}
              </Text>
              <TouchableOpacity
                onPress={carregarRestaurantes}
                  style={indexStyles.retryButton}
                >
                  <Text style={indexStyles.retryButtonText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : filteredCards.length > 0 ? (
            <HorizontalCardCarousel
              cards={filteredCards as any}
              onCardClick={handleCardClick}
                title="Restaurantes encontrados"
            />
          ) : (
              <View style={indexStyles.emptyStateContainer}>
                <MaterialIcons name="search-off" size={48} color={colors.cinzaClaro} />
                <Text style={indexStyles.emptyStateText}>
                  Nenhum restaurante encontrado com esses critérios.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    clearLocationFilter();
                  }}
                  style={indexStyles.retryButton}
                >
                  <Text style={indexStyles.retryButtonText}>Limpar filtros</Text>
                </TouchableOpacity>
              </View>
          )}
        </View>
        ) : null}

        {/* Todos os Restaurantes */}
        <View style={indexStyles.carouselSection}>
          <Text style={indexStyles.carouselTitle}>
            {restaurantes.length > 0 ? 'Nossos Restaurantes' : 'Melhores Avaliados'}
          </Text>
          {loading ? (
            <View style={indexStyles.loadingContainer}>
              <LoadingSpinner 
                size="large" 
                text="Carregando restaurantes..."
                color={colors.verdeFolha}
              />
            </View>
          ) : error ? (
            <>
              {/* Mostrar dados locais mesmo com erro */}
              <HorizontalCardCarousel 
                cards={cardData as any}
                onCardClick={handleCardClick}
                title="Melhores Avaliados"
              />
              {/* Mostrar aviso discreto sobre o erro */}
              <View style={indexStyles.errorContainer}>
                <MaterialIcons name="info" size={24} color={colors.azulInfo} />
                <Text style={[indexStyles.errorText, { color: colors.azulInfo, fontSize: 14 }]}>
                  Usando dados locais. Alguns restaurantes podem não estar disponíveis.
                </Text>
                <TouchableOpacity
                  onPress={carregarRestaurantes}
                  style={[indexStyles.retryButton, { backgroundColor: colors.azulInfo }]}
                >
                  <Text style={indexStyles.retryButtonText}>Tentar novamente</Text>
                </TouchableOpacity>
            </View>
            </>
          ) : (
            <HorizontalCardCarousel 
              cards={cardsParaExibir as any}
              onCardClick={handleCardClick}
              title="Todos os restaurantes"
            />
          )}
        </View>
      
        {/* Seção Institucional */}
        <View style={indexStyles.aboutSection}>
          <Text style={indexStyles.aboutTitle}>Sobre o Saborê</Text>
          <Text style={indexStyles.aboutText}>
            O Saborê nasceu para conectar apaixonados por sabor especial aos melhores restaurantes e experiências gastronômicas. Nossa missão é facilitar o acesso, promover a cultura e valorizar os estabelecimentos que fazem do Brasil um sabor inesquecível.
          </Text>
        </View>

                {/* Footer */}
        <View style={indexStyles.footerContainer}>
          <View style={indexStyles.footerContent}>
            <View style={indexStyles.footerSection}>
              <Text style={indexStyles.footerTitle}>Saborê</Text>
              <Text style={indexStyles.footerDescription}>
                Conectando você aos melhores sabores do Brasil. Descubra restaurantes incríveis e faça pedidos deliciosos.
              </Text>
            </View>

            <View style={[indexStyles.footerSection, { marginTop: (isSmallScreen || isMediumScreen) ? 16 : 0 }]}>
              <Text style={indexStyles.footerSubtitle}>Navegação</Text>
              <View style={{ 
                width: '100%', 
                alignItems: isSmallScreen || isMediumScreen ? 'center' : 'flex-start',
                gap: isSmallScreen || isMediumScreen ? 4 : 0,
              }}>
                <TouchableOpacity onPress={() => router.push('/')}>
                  <Text style={indexStyles.footerLink}>• Página Inicial</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={indexStyles.footerLink}>• Fazer Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/cadastro')}>
                  <Text style={indexStyles.footerLink}>• Criar Conta</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/carrinho')}>
                  <Text style={indexStyles.footerLink}>• Meu Carrinho</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={[indexStyles.footerSubtitle, { marginTop: (isSmallScreen || isMediumScreen) ? 16 : 20 }]}>Empresas</Text>
              <View style={{ 
                width: '100%', 
                alignItems: isSmallScreen || isMediumScreen ? 'center' : 'flex-start',
                gap: isSmallScreen || isMediumScreen ? 4 : 0,
              }}>
                <TouchableOpacity onPress={() => router.push('/indexEmpresas')}>
                  <Text style={indexStyles.footerLink}>• Área Empresarial</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/loginEmpresas')}>
                  <Text style={indexStyles.footerLink}>• Login Empresas</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/cadastrarEmpresa')}>
                  <Text style={indexStyles.footerLink}>• Cadastrar Empresa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={indexStyles.footerBottom}>
            <Text style={indexStyles.footerCopyright}>
              © 2024 Saborê - Todos os direitos reservados | Desenvolvido com ❤️ no Brasil
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
