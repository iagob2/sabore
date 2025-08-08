
import React, { useRef, useState } from 'react';
import { View, ScrollView, Image, Text, Dimensions, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import Header from '../components/Header';
import Input from '../components/Input';
import HorizontalCardCarousel from '../components/HorizontalCardCarousel';
import { toast } from '../hooks/use-toast';
import { indexStyles } from '../style/indexStyles';
import { useRouter } from 'expo-router';
import { colors } from '../style/colors';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

// Removido o banner estático em favor do carrossel de ofertas

const Index = () => {
  const [name, setName] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { width: screenWidth } = useWindowDimensions();
  const isSmallScreen = screenWidth < 380;
  const isMediumScreen = screenWidth >= 380 && screenWidth < 768;
  const carouselHeight = isSmallScreen ? 200 : isMediumScreen ? 240 : 300;
  const titleFontSize = isSmallScreen ? 16 : 18;
  const subtitleFontSize = isSmallScreen ? 13 : 14;
  const descFontSize = isSmallScreen ? 11 : 12;
  const arrowButtonSize = isSmallScreen ? 34 : 40;
  const arrowIconSize = isSmallScreen ? 24 : 28;
  const searchInputWidth = Math.min(520, Math.max(260, Math.floor(screenWidth * 0.9)));
  const [searchQuery, setSearchQuery] = useState('');
  const [useLocationFilter, setUseLocationFilter] = useState(false);
  const [userLocation, setUserLocation] = useState<null | { latitude: number; longitude: number }>(null);
  const [radiusKm, setRadiusKm] = useState(10);

  // Dados dos restaurantes
  const cardData = [
    {
      id: '1',
      imageUrl: require('../assets/restaurante1.png'),
      name: 'Brasil Brasileiro',
      rating: 4.9,
      subtitle: 'A melhor moqueca da cidade',
      latitude: -23.55052,
      longitude: -46.633308
    },
    {
      id: '2',
      imageUrl: require('../assets/restaurante2.png'),
      name: 'Cozinha da Mãe',
      rating: 4.8,
      subtitle: 'O melhor acarajé da cidade',
      latitude: -23.559616,
      longitude: -46.658279
    },
    {
      id: '3',
      imageUrl: require('../assets/rest1.png'),
      name: 'Sashimi Express',
      rating: 4.7,
      subtitle: 'Sashimis frescos e delivery rápido',
      latitude: -23.566246,
      longitude: -46.652381
    }
  ];

  const handleCardClick = (id: string) => {
    const card = cardData.find(c => c.id === id);
    toast({
      title: "Prato Selecionado",
      description: `Você escolheu: ${card?.name}`,
    });
  };

  // Ofertas dos restaurantes para o carrossel do topo
  const offers = [
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

  const filteredCards = cardData.filter((card: any) => {
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
        logo="Japones APP" 
        cartItemCount={carrinho.length}
        onCartPress={abrirCarrinho}
      />
      <ScrollView style={indexStyles.scroll} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Carrossel de Ofertas */}
        <View style={indexStyles.bannerContainer}>
          <View style={{
            width: '100%',
            height: carouselHeight,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 12
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
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12
                  }}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>
                      {index + 1} / {offers.length}
                    </Text>
                  </View>
                  <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    padding: 16,
                    paddingBottom: 20
                  }}>
                    <Text style={{
                      color: '#fff',
                      fontSize: titleFontSize,
                      fontWeight: 'bold',
                      marginBottom: 4
                    }}>
                      {offer.title} (Slide {index + 1})
                    </Text>
                    <Text style={{
                      color: '#FBBF24',
                      fontSize: subtitleFontSize,
                      fontWeight: '600',
                      marginBottom: 2
                    }}>
                      {offer.subtitle}
                    </Text>
                    <Text style={{
                      color: '#fff',
                      fontSize: descFontSize,
                      opacity: 0.9
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
                    left: 8,
                    width: arrowButtonSize,
                    height: arrowButtonSize,
                    borderRadius: arrowButtonSize / 2,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: currentSlide === 0 ? 0.4 : 1,
                  }}
                  hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                >
                  <MaterialIcons name="chevron-left" size={arrowIconSize} color="#fff" />
                </TouchableOpacity>

                {/* Direita */}
                <TouchableOpacity
                  onPress={goNext}
                  disabled={currentSlide === offers.length - 1}
                  activeOpacity={0.7}
                  style={{
                    position: 'absolute',
                    right: 8,
                    width: arrowButtonSize,
                    height: arrowButtonSize,
                    borderRadius: arrowButtonSize / 2,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: currentSlide === offers.length - 1 ? 0.4 : 1,
                  }}
                  hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                >
                  <MaterialIcons name="chevron-right" size={arrowIconSize} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        {/* Busca e filtros */}
        <View style={[indexStyles.carouselSection, { marginTop: 16 }]}>
          <Text style={indexStyles.carouselTitle}>Buscar restaurantes</Text>
          <View style={{ width: '100%', gap: 10 }}>
            {/* Input centralizado em seu próprio contêiner */}
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: searchInputWidth, alignSelf: 'center' }}>
                <Input
                  placeholder="Pesquise por nome, especialidade..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Botão centralizado abaixo do input */}
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                onPress={handleUseLocation}
                activeOpacity={0.85}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: colors.marromFeijao,
                  paddingHorizontal: 16,
                  height: 44,
                  borderRadius: 10,
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialIcons name="my-location" color="#fff" size={18} />
                <Text style={{ color: '#fff', fontWeight: '600' }}>Minha localização</Text>
              </TouchableOpacity>
            </View>

            {useLocationFilter && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <TouchableOpacity
                  onPress={clearLocationFilter}
                  activeOpacity={0.85}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: '#E11D48',
                    paddingHorizontal: 12,
                    height: 36,
                    borderRadius: 999,
                  }}
                >
                  <MaterialIcons name="close" color="#fff" size={18} />
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Remover filtro</Text>
                </TouchableOpacity>
                {userLocation && (
                  <Text style={{ color: colors.preto, opacity: 0.8, textAlign: 'center' }}>
                    Filtrando por proximidade (até {radiusKm} km)
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Resultados */}
        <View style={indexStyles.carouselSection}>
          <Text style={indexStyles.carouselTitle}>Resultados</Text>
          {filteredCards.length > 0 ? (
            <HorizontalCardCarousel
              cards={filteredCards as any}
              onCardClick={handleCardClick}
            />
          ) : (
            <Text style={{ color: colors.preto, opacity: 0.8 }}>Nenhum restaurante encontrado.</Text>
          )}
        </View>

        {/* Carrossel de Cards */}
        <View style={indexStyles.carouselSection}>
          <Text style={indexStyles.carouselTitle}>Melhores Avaliados</Text>
          <HorizontalCardCarousel 
            cards={cardData as any}
            onCardClick={handleCardClick}
          />
        </View>
      
        {/* Seção Institucional */}
        <View style={{ marginTop: 48, alignItems: 'center', paddingHorizontal: 12 }}>
          <Text style={[indexStyles.carouselTitle, { fontSize: 22 }]}>Sobre o Saborê</Text>
          <Text style={{ color: colors.preto, fontSize: 16, textAlign: 'center', maxWidth: 600, marginBottom: 24 }}>
            O Saborê nasceu para conectar apaixonados por sabor especial aos melhores restaurantes e experiências gastronômicas. Nossa missão é facilitar o acesso, promover a cultura e valorizar os estabelecimentos que fazem do Brasil um sabor inesquecível.
          </Text>
        </View>

        {/* Mapa do Site */}
        <View style={{ marginTop: 16, marginBottom: 32, alignItems: 'center' }}>
          <Text style={indexStyles.subtitle}>Mapa do Site</Text>
          <Text style={indexStyles.textSmall}>• Home</Text>
          <Text style={indexStyles.textSmall}>• Login</Text>
          <Text style={indexStyles.textSmall}>• Cadastro</Text>
          <Text
            style={indexStyles.textLink}
            onPress={() => router.push('/indexEmpresas')}
          >
            • Empresas
          </Text>
          <Text style={indexStyles.textSmall}>• Contato</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
