import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, ScrollView, StyleSheet, Platform, Clipboard, Dimensions, Modal, Pressable, TextInput, useWindowDimensions, ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent, Animated, TouchableWithoutFeedback, PanResponder } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { indexStyles } from '../style/indexStyles';
import Header from '../components/Header';
import CardPrato from '../components/CardPrato';
import StarRating from '../components/StarRating';
import { colors } from '../style/colors';
import { buscarRestaurante, RestauranteResponse, API_BASE_URL } from '../api/restaurante';
import { buscarItensPorRestaurante, ItemRestauranteResponse } from '../api/itemRestaurante';
import { buscarAvaliacoesPrato, calcularMediaAvaliacoes, AvaliacaoPratoResponse } from '../api/avaliacaoPrato';
import { buscarAvaliacoesRestaurante, calcularMediaAvaliacoesRestaurante } from '../api/avaliacaoRestaurante';
import { toast } from '../hooks/use-toast';
import { useCart, generateCartId, CartItem } from '../contexts/CartContext';
import { useAuthSession } from '../contexts/AuthContext';

const perfilEmpresaStyles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
    marginBottom: 0,
  },
  bannerImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  bannerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 18,
    zIndex: 2,
  },
  bannerTitle: {
    color: colors.branco,
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(101,12,12,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 1,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-condensed',
  },
  mainContentContainer: {
    width: '100%',
    maxWidth: 1200,
    marginTop: -80,
    zIndex: 2,
    paddingHorizontal: 20,
    position: 'relative',
    alignItems: 'flex-start',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.branco,
    backgroundColor: colors.branco,
    shadowColor: colors.marromFeijao,
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 12,
  },
  infoRapidaContainer: {
    position: 'absolute',
    top: 120,
    right: 40,
    zIndex: 3,
  },
  infoRapidaContainerMobile: {
    position: 'relative',
    top: 0,
    right: 0,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 12,
    width: '100%',
  },
  nome: {
    color: colors.verdeFolha,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    letterSpacing: 1,
  },
  descricao: {
    color: colors.preto,
    fontSize: 16,
    textAlign: 'left',
    marginTop: 12,
    marginBottom: 12,
    maxWidth: 640,
    lineHeight: 24,
  },
  infoRapida: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'nowrap',
    justifyContent: 'flex-end',
  },
  infoRapidaMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  infoItemMobile: {
    backgroundColor: colors.cinzaMuitoClaro,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'space-between',
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 6,
    color: colors.verdeFolha,
  },
  infoIconMobile: {
    fontSize: 18,
    marginRight: 8,
  },
  infoText: {
    color: colors.preto,
    fontSize: 13,
    marginRight: 4,
    maxWidth: 120,
    flexShrink: 1,
  },
  infoTextMobile: {
    fontSize: 14,
    maxWidth: '100%',
  },
  copyBtn: {
    marginLeft: 4,
    padding: 2,
  },
  socialRowContainer: {
    position: 'absolute',
    top: 120,
    left: 160,
    zIndex: 3,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 18,
  },
  socialRowContainerMobile: {
    position: 'relative',
    top: 0,
    left: 0,
    marginTop: 8,
    alignSelf: 'center',
    width: '100%',
  },
  socialRowMobile: {
    justifyContent: 'center',
    gap: 28,
    paddingVertical: 8,
  },
  socialIcon: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: colors.marromFeijao + '12', // marrom-feijão com opacidade
    marginHorizontal: 2,
  },
  actions: {
    width: '100%',
    maxWidth: 420,
    marginBottom: 28,
    alignSelf: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignSelf: 'center',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  cardTitle: {
    color: colors.verdeFolha,
    fontWeight: 'bold',
    fontSize: 19,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitleIcon: {
    fontSize: 18,
    marginRight: 6,
    color: colors.verdeFolha,
  },
  cardText: {
    color: colors.preto,
    fontSize: 15,
    marginBottom: 12,
    lineHeight: 21,
  },
  separator: {
    height: 1,
    backgroundColor: colors.marromFeijao,
    marginVertical: 8,
    width: '100%',
    borderRadius: 1,
  },
});

const infoDrawerStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 16,
  },
  headerTextGroup: {
    flex: 1,
  },
  title: {
    color: colors.verdeFolha,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: colors.cinzaEscuro,
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    color: colors.cinzaEscuro,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  sectionText: {
    color: colors.preto,
    fontSize: 15,
    lineHeight: 22,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.cinzaMuitoClaro,
  },
  chipText: {
    color: colors.verdeFolha,
    fontWeight: '600',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cinzaMuitoClaro,
    marginVertical: 12,
    borderRadius: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.verdeFolha,
    marginBottom: 10,
    gap: 12,
  },
  actionButtonText: {
    color: colors.verdeFolha,
    fontWeight: '600',
    fontSize: 15,
    flex: 1,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 8,
  },
});

const empresaData = {
  '1': {
    nome: 'Brasil Brasileiro',
    banner: require('../assets/restaurante1.png'),
    logo: require('../assets/restaurante1.png'),
    descricao: 'O melhor moqueca da cidade. Ambiente aconchegante e atendimento de excelência.',
    telefone: '(13) 3591-5817',
    endereco: 'Rua Brasil, 123 - Centro, Santos/SP',
    links: {
      site: '#',
      facebook: 'https://www.facebook.com',
      instagram: 'https://www.instagram.com',
      whatsapp: 'https://api.whatsapp.com',
      maps: 'https://www.google.com',
      email: '#',
      cardapio: '#',
      delivery: '#',
      festival: '#',
      promocoes: '#',
    },
    funcionamento: 'Comida feita na hora, frescor e sabor garantidos. Venha com tempo e aproveite a experiência!',
    horario: 'Sextas e sábados: 16h às 23h30. Outros dias: 16h às 22h30.',
    lotacao: 'Lotação máxima: 6 mesas simultâneas. Ambiente exclusivo e tranquilo.',
    acusticos: 'Shows acústicos em datas especiais. Consulte nossa agenda!',
    reservas: 'Reservas em breve pelo app ou WhatsApp.',
    aberto: true,
    avaliacao: 4.7,
  },
  '2': {
    nome: 'Cozinha da Mãe',
    banner: require('../assets/restaurante2.png'),
    logo: require('../assets/restaurante2.png'),
    descricao: 'O melhor acarajé da cidade. Ingredientes frescos e atendimento rápido.',
    telefone: '(13) 3333-2222',
    endereco: 'Av. Acarajé, 456 - Gonzaga, Santos/SP',
    links: {
      site: '#',
      facebook: '#',
      instagram: '#',
      whatsapp: '#',
      maps: '#',
      email: '#',
      cardapio: '#',
      delivery: '#',
      festival: '#',
      promocoes: '#',
    },
    funcionamento: 'Acarajés preparados na hora, variedade e sabor.',
    horario: 'Todos os dias: 17h às 23h.',
    lotacao: 'Ambiente amplo e confortável.',
    acusticos: 'Eventos especiais aos sábados.',
    reservas: 'Reservas pelo telefone.',
    aberto: false,
    avaliacao: 4.5,
  },
  '3': {
    nome: 'Sashimi Express',
    banner: require('../assets/sashimi.png'),
    logo: require('../assets/sashimi.png'),
    descricao: 'Sashimis frescos e delivery rápido. Tradição e qualidade.',
    telefone: '(13) 9999-8888',
    endereco: 'Rua do Peixe, 789 - Ponta da Praia, Santos/SP',
    links: {
      site: '#',
      facebook: '#',
      instagram: '#',
      whatsapp: '#',
      maps: '#',
      email: '#',
      cardapio: '#',
      delivery: '#',
      festival: '#',
      promocoes: '#',
    },
    funcionamento: 'Sashimis preparados sob demanda.',
    horario: 'Seg a Sex: 18h às 23h.',
    lotacao: 'Ambiente reservado.',
    acusticos: 'Não possui.',
    reservas: 'Reservas pelo app.',
    aberto: true,
    avaliacao: 4.8,
  },
};







const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isLargeScreen = SCREEN_WIDTH > 900;

// Componente de imagem com fallback automático
const ImageWithFallback = ({ source, fallbackSource, style, ...props }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset error state quando source mudar
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [source]);

  const handleError = () => {
    console.log('❌ Erro ao carregar imagem:', source);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log('✅ Imagem carregada com sucesso:', source);
    setIsLoading(false);
  };

  const finalSource = hasError ? fallbackSource : source;

  return (
    <Image
      {...props}
      source={finalSource}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};

const PerfilEmpresa = () => {
  const { id, restauranteData } = useLocalSearchParams();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const isSmallScreen = screenWidth < 380;
  const isMediumScreen = screenWidth >= 380 && screenWidth < 768;
  const isLargeScreenRuntime = screenWidth > 900;
  const isMobileRuntime = !isLargeScreenRuntime;
  const cardapioScrollRef = useRef<ScrollView>(null);
  const [cardapioScrollX, setCardapioScrollX] = useState(0);
  const [cardapioContentWidth, setCardapioContentWidth] = useState(0);
  const [cardapioViewportWidth, setCardapioViewportWidth] = useState(screenWidth);
  const [maxCardapioScroll, setMaxCardapioScroll] = useState(0);
  const cardapioCardWidth = isSmallScreen ? 220 : isMediumScreen ? 240 : 260;
  const cardapioScrollStep = cardapioCardWidth + 16;
  const canScrollCardapioLeft = cardapioScrollX > 12;
  const canScrollCardapioRight = cardapioScrollX < maxCardapioScroll - 12;
  const atualizarMaxCardapioScroll = (contentWidth: number, viewportWidth: number) => {
    const maxScrollValue = Math.max(0, contentWidth - viewportWidth);
    setMaxCardapioScroll(maxScrollValue);

    if (cardapioScrollX > maxScrollValue) {
      const clamped = Math.max(0, maxScrollValue);
      setCardapioScrollX(clamped);
      requestAnimationFrame(() => {
        cardapioScrollRef.current?.scrollTo({ x: clamped, animated: false });
      });
    }
  };

  const scrollCardapio = (direction: 'left' | 'right') => {
    if (!cardapioScrollRef.current) return;
    const target =
      direction === 'left'
        ? Math.max(0, cardapioScrollX - cardapioScrollStep)
        : Math.min(maxCardapioScroll, cardapioScrollX + cardapioScrollStep);

    cardapioScrollRef.current.scrollTo({ x: target, animated: true });
    setCardapioScrollX(target);
  };

  const [infoDrawerVisible, setInfoDrawerVisible] = useState(false);
  const infoDrawerAnim = useRef(new Animated.Value(0)).current;
  const drawerWidth = Math.min(screenWidth * 0.88, 420);
  const drawerTranslateX = infoDrawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [drawerWidth, 0],
  });

  const openInfoDrawer = () => {
    if (infoDrawerVisible) return;
    setInfoDrawerVisible(true);
    requestAnimationFrame(() => {
      Animated.timing(infoDrawerAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }).start();
    });
  };

  const closeInfoDrawer = () => {
    Animated.timing(infoDrawerAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setInfoDrawerVisible(false);
      }
    });
  };

  const edgePanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          !infoDrawerVisible &&
          gestureState.dx > 20 &&
          Math.abs(gestureState.dy) < 20 &&
          gestureState.moveX < 40
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 60) {
          openInfoDrawer();
        }
      },
    })
  ).current;

  const drawerPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        infoDrawerVisible && gestureState.dx < -20 && Math.abs(gestureState.dy) < 20,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -60) {
          closeInfoDrawer();
        }
      },
    })
  ).current;

  const handleCardapioScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent?.contentOffset?.x || 0;
    setCardapioScrollX(x);
  };
  
  const normalizarUrl = (url?: string | null) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const abrirLinkExterno = async (url?: string | null, descricao?: string) => {
    const urlNormalizada = normalizarUrl(url);
    if (!urlNormalizada) {
      toast({
        title: 'Link indisponível',
        description: descricao ? `Não encontramos o link de ${descricao}.` : 'Não encontramos o link informado.',
      });
      return;
    }

    try {
      const podeAbrir = await Linking.canOpenURL(urlNormalizada);
      if (!podeAbrir) {
        toast({
          title: 'Não foi possível abrir o link',
          description: 'Verifique se você possui um aplicativo compatível instalado.',
        });
        return;
      }
      await Linking.openURL(urlNormalizada);
    } catch (error) {
      console.error('Erro ao abrir link externo:', error);
      toast({
        title: 'Erro ao abrir link',
        description: 'Tente novamente mais tarde.',
      });
    }
  };
  
  // Estados para dados reais da API
  const [empresa, setEmpresa] = useState<RestauranteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para itens/pratos do restaurante
  const [itensRestaurante, setItensRestaurante] = useState<ItemRestauranteResponse[]>([]);
  const [loadingItens, setLoadingItens] = useState(false);
  
  // Estado para médias de avaliações por item
  const [mediasAvaliacoes, setMediasAvaliacoes] = useState<Record<number, number>>({});
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(false);
  
  // Estado para média de avaliações do restaurante
  const [mediaAvaliacaoRestaurante, setMediaAvaliacaoRestaurante] = useState<number>(0);
  const [loadingAvaliacaoRestaurante, setLoadingAvaliacaoRestaurante] = useState(false);
  
  // Estados do modal de pratos
  const [copied, setCopied] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [pratoSelecionado, setPratoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [observacoes, setObservacoes] = useState('');
  const [ingredientesRemovidos, setIngredientesRemovidos] = useState([]);
  const [ingredientesAdicionados, setIngredientesAdicionados] = useState([]);
  // Usar contexto do carrinho
  const { addItem: addToCart, itemCount: cartItemCount, canAddItem } = useCart();
  const { session, isAuthenticated } = useAuthSession();


  // Função para adaptar item da API para formato do CardPrato
  const adaptarItemParaCardPrato = (item: ItemRestauranteResponse, index: number = 0) => {
    console.log(`🔄 Adaptando item ${index + 1} (ID: ${item.id}):`, item.nome);
    
    // Array de imagens padrão para variar - mapeamento inteligente por nome
    const imagensPadraoItem = [
      require('../assets/pratos/prato1.png'),
      require('../assets/pratos/prato2.png'),
      require('../assets/pratos/prato3.png'),
      require('../assets/pratos/feijoada.png'),
      require('../assets/pratos/moqueca.png'),
      require('../assets/pratos/pao-queijo.png'),
      require('../assets/pratos/brigadeiro.png'),
      require('../assets/pratos/acaraje.png')
    ];
    
    // Mapeamento inteligente de pratos por nome
    const getImagemEspecifica = (nomePrato: string, itemIndex: number) => {
      const nome = nomePrato.toLowerCase();
      if (nome.includes('acarajé') || nome.includes('acaraje')) {
        return require('../assets/pratos/acaraje.png');
      }
      if (nome.includes('moqueca')) {
        return require('../assets/pratos/moqueca.png');
      }
      if (nome.includes('feijoada')) {
        return require('../assets/pratos/feijoada.png');
      }
      if (nome.includes('brigadeiro')) {
        return require('../assets/pratos/brigadeiro.png');
      }
      if (nome.includes('pão de queijo') || nome.includes('pao de queijo')) {
        return require('../assets/pratos/pao-queijo.png');
      }
      if (nome.includes('tempurá') || nome.includes('tempura')) {
        return require('../assets/pratos/prato2.png'); // Tempurá pode usar prato2
      }
      if (nome.includes('vinagrete') || nome.includes('salada')) {
        return require('../assets/pratos/salada.png');
      }
      // Usar index ao invés de ID para manter consistência com a ordem recebida
      return imagensPadraoItem[itemIndex % imagensPadraoItem.length];
    };
    
    // Selecionar imagem específica baseada no nome do prato
    const imagemEspecifica = getImagemEspecifica(item.nome || '', index);
    let imageSource = imagemEspecifica;
    
    console.log(`🎯 Imagem padrão selecionada para ${item.nome} (index ${index}):`, typeof imageSource);
    
    // Processar imagemUrl do backend - sempre priorizar URL do banco se disponível
    if (item.imagemUrl && item.imagemUrl.trim() !== '') {
      let urlCompleta = item.imagemUrl.trim();
      
      console.log('🖼️ Processando imagem do item:', item.nome);
      console.log('🖼️ URL original do backend:', urlCompleta);
      
      // Se não é uma URL completa, construir com API_BASE_URL
      if (!urlCompleta.startsWith('http://') && !urlCompleta.startsWith('https://')) {
        // Garantir que o caminho começa com / se não começar
        const path = urlCompleta.startsWith('/') ? urlCompleta : `/${urlCompleta}`;
        urlCompleta = `${API_BASE_URL}${path}`;
        console.log('🔗 URL construída com API_BASE_URL:', urlCompleta);
      }
      
      // Forçar HTTP em vez de HTTPS para evitar problemas de certificado em desenvolvimento
      if (urlCompleta.startsWith('https://localhost') || urlCompleta.startsWith('https://127.0.0.1')) {
        urlCompleta = urlCompleta.replace('https://', 'http://');
        console.log('🔒 Convertendo HTTPS para HTTP:', urlCompleta);
      }
      
      // Sempre tentar usar a imagem real primeiro
      try {
        // Validar se a URL parece válida
        new URL(urlCompleta);
        
        // Verificar se não é uma URL obviamente de exemplo (mas mesmo assim tentar carregar)
        const isExampleUrl = item.imagemUrl.includes('exemplo.com') || 
                            item.imagemUrl.includes('placeholder.com') ||
                            item.imagemUrl.includes('example.com');
        
        if (isExampleUrl) {
          console.log('🚫 URL de exemplo detectada, mas vamos tentar carregar mesmo assim:', urlCompleta);
        }
        
        imageSource = { uri: urlCompleta };
        console.log(`✅ Item ${item.nome}: Usando URL da imagem do backend:`, urlCompleta);
        
      } catch (e) {
        console.log('❌ URL da imagem inválida:', urlCompleta, 'Erro:', e);
        console.log(`🔄 Item ${item.nome}: Usando imagem padrão baseada no index ${index}`);
        // imageSource já está definido como imagemEspecifica
      }
    } else {
      console.log(`⚠️ Item ${item.nome} sem imagemUrl no backend, usando imagem padrão (index ${index})`);
      // imageSource já está definido como imagemEspecifica
    }
    
    // Usar descricao como ingredientes se disponível
    const ingredientes = item.descricao ? item.descricao.split(',').map(i => i.trim()) : ['Ingredientes não informados'];
    
    // Formatação do preço para exibição
    const valorFormatado = `R$ ${item.preco?.toFixed(2).replace('.', ',') || '0,00'}`;
    
    console.log('💰 Formatação do preço:', {
      precoOriginal: item.preco,
      valorFormatado: valorFormatado
    });
    
    console.log('🥘 Formatação dos ingredientes:', {
      descricaoOriginal: item.descricao,
      ingredientesArray: ingredientes,
      ingredientesString: ingredientes.join(', ')
    });
    
    // Buscar a média de avaliações para este item
    const mediaAvaliacao = mediasAvaliacoes[item.id] || 0;
    
    const adaptado = {
      // Propriedades que o CardPrato espera (formato correto)
      imagem: imageSource,
      imagemFallback: imagemEspecifica, // Para fallback manual se necessário
      nome: item.nome || 'Prato sem nome',
      ingredientes: ingredientes.join(', '), // CardPrato espera string, não array
      valor: valorFormatado,
      avaliacao: mediaAvaliacao,
      
      // Propriedades extras para compatibilidade com outros componentes
      id: item.id.toString(),
      name: item.nome || 'Prato sem nome',
      price: item.preco || 0,
      preco: item.preco || 0,
      description: item.descricao || 'Delicioso prato preparado com carinho',
      image: imageSource,
      category: 'Prato Principal',
      available: true,
      ingredients: ingredientes, // Array para outros componentes
      prepTime: 20,
      rating: mediaAvaliacao,
      
      _debug: {
        originalItem: item,
        hasImage: !!item.imagemUrl,
        restauranteId: item.restaurante?.id,
        finalImageSource: imageSource,
        ingredientesFromDescricao: ingredientes,
        valorFormatado: valorFormatado,
        precoOriginal: item.preco
      }
    };
    
    console.log('✅ Item adaptado final:', {
      nome: adaptado.nome,
      valor: adaptado.valor,
      ingredientes: adaptado.ingredientes,
      avaliacao: adaptado.avaliacao,
      mediaAvaliacao: mediaAvaliacao,
      imagemTipo: typeof adaptado.imagem,
      imagemUri: adaptado.imagem?.uri || 'local',
      imagemFallback: typeof adaptado.imagemFallback
    });
    
    return adaptado;
  };



  // Função para carregar avaliações de todos os itens
  const carregarAvaliacoesItens = async (itens: ItemRestauranteResponse[]) => {
    console.log('⭐ === CARREGANDO AVALIAÇÕES DOS ITENS ===');
    console.log('📊 Total de itens para buscar avaliações:', itens.length);
    
    setLoadingAvaliacoes(true);
    const medias: Record<number, number> = {};
    
    // Buscar avaliações para cada item em paralelo
    const promises = itens.map(async (item) => {
      try {
        console.log(`🔍 Buscando avaliações para item ${item.id}: ${item.nome}`);
        const avaliacoes = await buscarAvaliacoesPrato(item.id);
        const media = calcularMediaAvaliacoes(avaliacoes);
        
        console.log(`⭐ Item ${item.id} (${item.nome}): ${avaliacoes.length} avaliações, média: ${media}`);
        
        medias[item.id] = media;
      } catch (error) {
        console.warn(`⚠️ Erro ao buscar avaliações do item ${item.id}:`, error);
        // Se houver erro, usar média 0 (sem avaliações)
        medias[item.id] = 0;
      }
    });
    
    // Aguardar todas as buscas terminarem
    await Promise.all(promises);
    
    console.log('✅ Médias de avaliações calculadas:', medias);
    setMediasAvaliacoes(medias);
    setLoadingAvaliacoes(false);
  };

  // Função para carregar avaliações do restaurante
  const carregarAvaliacoesRestaurante = async (restauranteId: number) => {
    console.log('🏪 === CARREGANDO AVALIAÇÕES DO RESTAURANTE ===');
    console.log('🆔 Restaurante ID:', restauranteId);
    
    setLoadingAvaliacaoRestaurante(true);
    
    try {
      console.log(`🔍 Buscando avaliações para restaurante ${restauranteId}`);
      const avaliacoes = await buscarAvaliacoesRestaurante(restauranteId);
      const media = calcularMediaAvaliacoesRestaurante(avaliacoes);
      
      console.log(`🏪 Restaurante ${restauranteId}: ${avaliacoes.length} avaliações, média: ${media}`);
      
      setMediaAvaliacaoRestaurante(media);
    } catch (error) {
      console.warn(`⚠️ Erro ao buscar avaliações do restaurante ${restauranteId}:`, error);
      // Se houver erro, usar média 0 (sem avaliações)
      setMediaAvaliacaoRestaurante(0);
    } finally {
      setLoadingAvaliacaoRestaurante(false);
    }
  };

  // Função para carregar itens do restaurante
  const carregarItensRestaurante = async (restauranteId: number) => {
    try {
      setLoadingItens(true);
      console.log('🍽️ === CARREGANDO ITENS DO RESTAURANTE ===');
      console.log('🆔 Restaurante ID:', restauranteId);
      console.log('🔗 API_BASE_URL:', API_BASE_URL);
      console.log('🌐 URL completa:', `${API_BASE_URL}/itens/restaurante/${restauranteId}`);
      console.log('🔧 Controller público: /itens/restaurante/{restauranteId}');
      console.log('🔧 Service: buscarItensPorRestaurante() -> findByRestauranteIdOrderByNomeAsc()');
      
      const itens = await buscarItensPorRestaurante(restauranteId);
      console.log('✅ Resposta da API recebida!');
      console.log('📊 Quantidade de itens:', itens?.length || 0);
      console.log('📋 Dados completos dos itens:', itens);
      
      // Verificar se está vindo dados do endpoint correto
      if (itens && itens.length > 0) {
        const restaurantesUnicos = [...new Set(itens.map(item => item.restaurante?.id))];
        console.log('🏪 Restaurantes únicos nos itens:', restaurantesUnicos);
        console.log('🎯 Esperado restaurante ID:', restauranteId);
        
        if (restaurantesUnicos.length > 1) {
          console.warn('⚠️ ATENÇÃO: Recebendo itens de múltiplos restaurantes! Verifique se está usando /itens/restaurante/{id}');
        }
      }
      
      if (itens && itens.length > 0) {
        console.log('🔍 Primeiro item detalhado:', itens[0]);
        itens.forEach((item, index) => {
          console.log(`📝 Item ${index + 1}:`, {
            id: item.id,
            nome: item.nome,
            preco: item.preco,
            descricao: item.descricao,
            imagemUrl: item.imagemUrl,
            restauranteId: item.restaurante?.id
          });
        });
      } else {
        console.log('⚠️ Nenhum item encontrado para este restaurante');
      }
      
      setItensRestaurante(itens || []);
      
      // Carregar avaliações dos itens após carregar os itens
      if (itens && itens.length > 0) {
        await carregarAvaliacoesItens(itens);
      }
    } catch (err) {
      console.error('❌ ERRO ao carregar itens do restaurante:', err);
      console.error('🔍 Detalhes do erro:', {
        message: err instanceof Error ? err.message : 'Erro desconhecido',
        restauranteId,
        apiUrl: `${API_BASE_URL}/itens/restaurante/${restauranteId}`
      });
      
      // Em caso de erro, manter array vazio
      console.log('⚠️ Mantendo estado vazio devido ao erro');
      
      setItensRestaurante([]);
    } finally {
      setLoadingItens(false);
      console.log('🏁 Carregamento de itens finalizado');
    }
  };

  // Função para carregar dados do restaurante
  const carregarDadosRestaurante = async () => {
    try {
      setLoading(true);
      setError(null);

      let restaurante: RestauranteResponse;

      // Primeiro tenta usar os dados passados por parâmetro
      if (restauranteData) {
        try {
          restaurante = JSON.parse(restauranteData as string);
          console.log('📊 Usando dados do parâmetro:', restaurante);
        } catch (e) {
          throw new Error('Dados inválidos recebidos');
        }
      }
      // Se não tiver dados do parâmetro, busca pela API
      else if (id) {
        console.log('🔍 Buscando restaurante pela API, ID:', id);
        restaurante = await buscarRestaurante(Number(id));
      } else {
        throw new Error('ID do restaurante não fornecido');
      }

      setEmpresa(restaurante);

      // Carregar itens do restaurante e avaliações após carregar os dados
      await Promise.all([
        carregarItensRestaurante(restaurante.id),
        carregarAvaliacoesRestaurante(restaurante.id)
      ]);

    } catch (err) {
      console.error('❌ Erro ao carregar dados do restaurante:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      
      // Fallback para dados mockados em caso de erro
      const empresaFallback = empresaData[id as string] || empresaData['1'];
      console.log('🔄 Usando dados de fallback:', empresaFallback.nome);
      // Convertendo dados mockados para o formato da API
      setEmpresa({
        id: Number(id) || 1,
        nome: empresaFallback.nome,
        cnpj: '00.000.000/0000-00',
        telefone: empresaFallback.telefone,
        email: 'contato@' + empresaFallback.nome.toLowerCase().replace(' ', '') + '.com',
        rua: empresaFallback.endereco.split(',')[0] || '',
        numero: 123,
        bairro: empresaFallback.endereco.split('-')[1]?.split(',')[0]?.trim() || '',
        cidade: empresaFallback.endereco.split(',')[2]?.trim() || 'Santos',
        estado: 'SP',
        cep: '11000-000',
        descricao: empresaFallback.descricao,
        horario: empresaFallback.horario,
        lotacao: 6,
        site: empresaFallback.links.site,
        facebook: empresaFallback.links.facebook,
        instagram: empresaFallback.links.instagram,
        whatsapp: empresaFallback.links.whatsapp,
        cardapioUrl: empresaFallback.links.cardapio,
        logoUrl: null,
        bannerUrl: null,
        aceitaComunicacao: true,
        aceitaMarketing: false,
        aceitaProtecaoDados: true,
      } as RestauranteResponse);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando o componente montar
  useEffect(() => {
    carregarDadosRestaurante();
  }, [id, restauranteData]);

  const handleCopy = (text: string, label: string) => {
    Clipboard.setString(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 1200);
  };

  function abrirModal(prato) {
    setPratoSelecionado(prato);
    setModalVisible(true);
    setQuantidade(1);
    setObservacoes('');
    setIngredientesRemovidos([]);
    setIngredientesAdicionados([]);
  }
  
  function fecharModal() {
    setModalVisible(false);
    setPratoSelecionado(null);
    setQuantidade(1);
    setObservacoes('');
    setIngredientesRemovidos([]);
    setIngredientesAdicionados([]);
  }

  function adicionarAoCarrinho() {
    if (!empresa) {
      toast({
        title: "Erro",
        description: "Dados do restaurante não encontrados.",
      });
      return;
    }

    if (!pratoSelecionado) {
      toast({
        title: "Erro", 
        description: "Nenhum prato selecionado.",
      });
      return;
    }

    // Verificar se pode adicionar item deste restaurante
    if (!canAddItem(empresa.id)) {
      toast({
        title: "Restaurante Diferente",
        description: `Você só pode adicionar itens de um restaurante por vez. Limpe o carrinho para adicionar itens de "${empresa.nome}".`,
      });
      return;
    }

    try {
      // Converter arrays para strings (formato da API)
      const ingredientesRemovidosStr = ingredientesRemovidos.length > 0 
        ? ingredientesRemovidos.join(', ') 
        : undefined;
      const ingredientesAdicionadosStr = ingredientesAdicionados.length > 0 
        ? ingredientesAdicionados.join(', ') 
        : undefined;

      const cartItem: CartItem = {
        cartId: generateCartId(),
        itemRestauranteId: parseInt(pratoSelecionado.id) || 0,
        nome: pratoSelecionado.nome,
        preco: pratoSelecionado.preco || parseFloat(pratoSelecionado.valor?.replace('R$ ', '').replace(',', '.')) || 0,
        imagemUrl: pratoSelecionado.imagemUrl,
        descricao: pratoSelecionado.ingredientes,
        quantidade,
        observacoes: observacoes || undefined,
        ingredientesRemovidos: ingredientesRemovidosStr,
        ingredientesAdicionados: ingredientesAdicionadosStr,
        restauranteId: empresa.id,
        restauranteNome: empresa.nome
      };

      console.log('🛒 Adicionando item ao carrinho:', cartItem);
      
      addToCart(cartItem);
      
      toast({
        title: "Item Adicionado!",
        description: `${pratoSelecionado.nome} foi adicionado ao carrinho.`,
      });
      
      fecharModal();
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao adicionar item ao carrinho.",
      });
    }
  }

  function abrirCarrinho() {
    router.push('/carrinho');
  }

  function toggleIngrediente(ingrediente, tipo) {
    if (tipo === 'remover') {
      setIngredientesRemovidos(prev => 
        prev.includes(ingrediente) 
          ? prev.filter(i => i !== ingrediente)
          : [...prev, ingrediente]
      );
    } else {
      setIngredientesAdicionados(prev => 
        prev.includes(ingrediente) 
          ? prev.filter(i => i !== ingrediente)
          : [...prev, ingrediente]
      );
    }
  }



  // Função para navegar para a tela de avaliações de um prato
  function verAvaliacoesPrato(prato: any) {
    console.log('📊 Navegando para avaliações do prato:', prato.nome);
    router.push({
      pathname: '/avaliacoesPrato',
      params: {
        itemId: prato.id || prato._debug?.originalItem?.id,
        itemNome: prato.nome,
        itemPreco: prato.preco || prato.price
      }
    });
  }


  // Renderizar loading
  if (loading) {
    return (
      <View style={indexStyles.main}>
        <Header 
          logo="Saborê" 
          cartItemCount={cartItemCount}
          onCartPress={abrirCarrinho}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <ActivityIndicator size="large" color={colors.verdeFolha} />
          <Text style={{ color: colors.preto, fontSize: 16, marginTop: 16, textAlign: 'center' }}>
            Carregando dados do restaurante...
          </Text>
        </View>
      </View>
    );
  }

  // Renderizar erro (ainda permite fallback)
  if (error && !empresa) {
    return (
      <View style={indexStyles.main}>
        <Header 
          logo="Saborê" 
          cartItemCount={cartItemCount}
          onCartPress={abrirCarrinho}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: '#E11D48', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
            Erro ao carregar restaurante
          </Text>
          <Text style={{ color: colors.preto, fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={carregarDadosRestaurante}
            style={{
              backgroundColor: colors.verdeFolha,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8
            }}
          >
            <Text style={{ color: colors.branco, fontWeight: 'bold' }}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Processar pratos do banco de dados
  console.log('🔄 === PROCESSANDO PRATOS PARA EXIBIÇÃO ===');
  console.log('📦 Itens do restaurante disponíveis:', itensRestaurante.length);
  console.log('⭐ Médias de avaliações disponíveis:', Object.keys(mediasAvaliacoes).length);
  console.log('⭐ Médias carregadas:', mediasAvaliacoes);
  
  const pratosAdaptados = itensRestaurante.map((item, index) => {
    console.log(`📸 === Adaptando item ${index + 1} de ${itensRestaurante.length} ===`);
    console.log(`🆔 Item ID: ${item.id}, Nome: ${item.nome}, Index: ${index}`);
    console.log(`🖼️ imagemUrl original:`, item.imagemUrl);
    const adaptado = adaptarItemParaCardPrato(item, index);
    console.log(`✅ Item ${item.nome} adaptado com imagem:`, adaptado.imagem?.uri || 'local');
    return adaptado;
  });
  
  console.log('📋 Total de pratos adaptados:', pratosAdaptados.length);

  if (!empresa) {
    return null;
  }

  // Função para construir URL completa da imagem
  const construirUrlImagem = (url: string | null | undefined): string | null => {
    if (!url) return null;
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return null;
    
    // Se já é uma URL completa, retornar como está
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl;
    }
    
    // Se é um caminho relativo, construir com API_BASE_URL
    const path = trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`;
    const urlCompleta = `${API_BASE_URL}${path}`;
    
    console.log(`🔗 Construindo URL de imagem:`, {
      original: trimmedUrl,
      final: urlCompleta
    });
    
    return urlCompleta;
  };

  const construirUrlArquivo = (url: string | null | undefined): string | null => {
    if (!url) return null;
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return null;

    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl;
    }

    const path = trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`;
    return `${API_BASE_URL}${path}`;
  };

  // Array de imagens padrão para variar entre restaurantes
  const imagensPadrao = [
    require('../assets/restaurante1.png'),
    require('../assets/restaurante2.png'),
    require('../assets/rest1.png'),
    require('../assets/rest2.png')
  ];

  // Escolher imagem padrão baseada no ID do restaurante para consistência
  const imagemPadraoIndex = empresa.id % imagensPadrao.length;
  const imagemPadrao = imagensPadrao[imagemPadraoIndex];

  // Construir dados da empresa com fallbacks para campos não existentes no backend
  const empresaCompleta = {
    ...empresa,
    // Campos calculados/simulados
    aberto: true, // Simular como sempre aberto (pode implementar lógica de horário depois)
    avaliacao: 4.5, // Fallback (getAvaliacaoMedia() virá do backend depois)
    // Links formatados
    links: {
      site: empresa.site || '#',
      facebook: empresa.facebook || '#',
      instagram: empresa.instagram || '#',
      whatsapp: empresa.whatsapp || '#',
      maps: `https://maps.google.com/?q=${encodeURIComponent([empresa.rua, empresa.numero, empresa.bairro, empresa.cidade, empresa.estado].filter(Boolean).join(', '))}`,
      email: `mailto:${empresa.email}`,
      cardapio: construirUrlArquivo(empresa.cardapioUrl) || '#',
    },
    // Endereço formatado
    endereco: [empresa.rua, empresa.numero, empresa.bairro, empresa.cidade, empresa.estado].filter(Boolean).join(', ') || 'Endereço não informado',
    // Imagens com construção correta de URLs
    banner: (() => {
      const urlCompleta = construirUrlImagem(empresa.bannerUrl);
      return urlCompleta ? { uri: urlCompleta } : imagemPadrao;
    })(),
    logo: (() => {
      const urlCompleta = construirUrlImagem(empresa.logoUrl);
      return urlCompleta ? { uri: urlCompleta } : imagemPadrao;
    })(),
    // Textos informativos (não existem no backend, usar padrões)
    funcionamento: empresa.descricao || 'Restaurante com comida de qualidade e atendimento especial.',
    acusticos: 'Consulte nossos eventos especiais nas redes sociais.',
    reservas: 'Entre em contato conosco para fazer reservas.',
  };

  // Log final das imagens para debug
  console.log(`🏪 ${empresa.nome} - Imagens:`, {
    logoUrl: empresa.logoUrl,
    bannerUrl: empresa.bannerUrl,
    logoFinal: empresaCompleta.logo,
    bannerFinal: empresaCompleta.banner,
    logoIsUri: empresaCompleta.logo?.uri ? true : false,
    bannerIsUri: empresaCompleta.banner?.uri ? true : false
  });

  return (
    <View style={[indexStyles.main, { position: 'relative' }]}>
      <View
        {...edgePanResponder.panHandlers}
        pointerEvents={infoDrawerVisible ? 'none' : 'auto'}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 24,
          zIndex: 15,
        }}
      />
              <Header 
          logo="Saborê" 
          cartItemCount={cartItemCount}
          onCartPress={abrirCarrinho}
        />
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}>
        {/* Banner com gradiente e nome */}
        <View style={[perfilEmpresaStyles.bannerContainer, { height: isSmallScreen ? 160 : isMediumScreen ? 200 : 220 }]}>
          <ImageWithFallback 
            source={empresaCompleta.banner} 
            fallbackSource={imagemPadrao}
            style={[perfilEmpresaStyles.bannerImage, { height: isSmallScreen ? 160 : isMediumScreen ? 200 : 220 }]} 
          />
          <LinearGradient
            colors={[ 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.7)' ]}
            style={perfilEmpresaStyles.bannerGradient}
            pointerEvents="none"
          />
          
          {/* Título do restaurante no banner - Mobile */}
          {(isSmallScreen || isMediumScreen) && (
            <View
              style={{
                position: 'absolute',
                top: (isSmallScreen || isMediumScreen) ? 12 : 0,
                left: 0,
                right: 0,
                alignItems: 'center',
                zIndex: 5,
                paddingHorizontal: 16,
              }}
            >
              <Text 
                style={{ 
                  color: colors.branco, 
                  fontSize: isSmallScreen ? 22 : 26, 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  textShadowColor: 'rgba(0,0,0,0.75)',
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 8,
                  letterSpacing: 0.5,
                }}
              >
                {empresaCompleta.nome}
              </Text>
            </View>
          )}

          {/* Estrelinhas de avaliação - posicionamento melhorado para mobile */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: (isSmallScreen || isMediumScreen) ? 'rgba(0,0,0,0.6)' : 'rgba(101,12,12,0.07)',
              borderRadius: (isSmallScreen || isMediumScreen) ? 20 : 16,
              paddingVertical: isSmallScreen ? 6 : isMediumScreen ? 6 : 6,
              paddingHorizontal: isSmallScreen ? 14 : isMediumScreen ? 16 : 18,
              position: 'absolute',
              bottom: (isSmallScreen || isMediumScreen) ? 16 : 12,
              right: (isSmallScreen || isMediumScreen) ? 16 : 32,
              zIndex: 10,
              borderWidth: (isSmallScreen || isMediumScreen) ? 1.5 : 0,
              borderColor: (isSmallScreen || isMediumScreen) ? 'rgba(255, 179, 0, 0.5)' : 'transparent',
            }}
          >
            <StarRating 
              rating={mediaAvaliacaoRestaurante} 
              size={isSmallScreen ? 16 : isMediumScreen ? 18 : 22} 
              interactive={false}
            />
            <Text style={{ 
              color: colors.amareloOuro, 
              fontWeight: 'bold', 
              fontSize: isSmallScreen ? 14 : isMediumScreen ? 16 : 18, 
              marginLeft: isSmallScreen ? 6 : 10,
            }}>
              {mediaAvaliacaoRestaurante.toFixed(1)}
            </Text>
          </View>
        </View>
                        {/* Logo, descrição, informações e links sociais em container flexível */}
        <View style={perfilEmpresaStyles.mainContentContainer}>
          {/* Logo e descrição */}
          <View style={[
            perfilEmpresaStyles.logoContainer, 
            { 
              flexDirection: 'row', 
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              width: '100%'
            }
          ]}>
            <ImageWithFallback 
              source={empresaCompleta.logo} 
              fallbackSource={imagemPadrao}
              style={[
                perfilEmpresaStyles.logo, 
                { 
                  width: isSmallScreen ? 96 : isMediumScreen ? 100 : 120, 
                  height: isSmallScreen ? 96 : isMediumScreen ? 100 : 120, 
                  borderRadius: isSmallScreen ? 48 : isMediumScreen ? 50 : 60
                }
              ]} 
            />
            {/* Título do restaurante - Desktop (mobile mostra no banner) */}
            {!isSmallScreen && !isMediumScreen && (
              <View style={{ flex: 1, marginLeft: 20 }}>
                <Text style={[perfilEmpresaStyles.nome, { color: colors.branco, textAlign: 'left', fontSize: 30 }]}>{empresaCompleta.nome}</Text>
              </View>
            )}
          </View>

          {/* <Text
            style={[
              perfilEmpresaStyles.descricao,
              {
                alignSelf: isMobileRuntime ? 'center' : 'flex-start',
                textAlign: isMobileRuntime ? 'center' : 'left',
              },
            ]}
          >
            {empresaCompleta.descricao || empresaCompleta.funcionamento}
          </Text> */}

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 10,
              marginTop: 6,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: empresaCompleta.aberto
                  ? 'rgba(34, 197, 94, 0.15)'
                  : 'rgba(239, 68, 68, 0.15)',
                borderRadius: 999,
                paddingHorizontal: 14,
                paddingVertical: 6,
              }}
            >
              <Text
                style={{
                  color: empresaCompleta.aberto ? colors.verdeFolha : colors.vermelhoCambuci,
                  fontWeight: '600',
                  fontSize: 13,
                }}
              >
                {empresaCompleta.aberto ? 'Aberto agora' : 'Fechado no momento'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={openInfoDrawer}
            activeOpacity={0.85}
            style={{
              alignSelf: isMobileRuntime ? 'stretch' : 'flex-start',
              marginTop: 18,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: colors.verdeFolha,
              paddingVertical: 12,
              paddingHorizontal: 18,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              backgroundColor: colors.branco,
              shadowColor: colors.marromFeijao,
              shadowOpacity: 0.08,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3,
            }}
          >
            <MaterialIcons name="info-outline" size={20} color={colors.verdeFolha} />
            <Text style={{ color: colors.verdeFolha, fontWeight: '600', fontSize: 15, flex: 1 }}>
              Ver detalhes do restaurante
            </Text>
            <MaterialIcons name="chevron-right" size={22} color={colors.verdeFolha} />
          </TouchableOpacity>

        </View>

        {/* Área principal com cards do cardápio */}
        <View
          style={{
            width: '100%',
            maxWidth: 1400,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: isSmallScreen ? 24 : 48,
            marginBottom: 32,
            paddingHorizontal: isSmallScreen ? 12 : 20,
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 1200,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {loadingItens || loadingAvaliacoes ? (
                  // Estado de loading dos pratos e avaliações
                  <View style={{ 
                    width: '100%', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: 40,
                    marginTop: 20 
                  }}>
                    <ActivityIndicator size="large" color={colors.verdeFolha} />
                    <Text style={{ 
                      color: colors.preto, 
                      fontSize: 16, 
                      marginTop: 16, 
                      textAlign: 'center' 
                    }}>
                      {loadingItens ? 'Carregando pratos do restaurante...' : 'Carregando avaliações dos pratos...'}
                    </Text>
                  </View>
            ) : pratosAdaptados.length === 0 ? (
                  // Estado vazio - sem pratos cadastrados
                  <View style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 40,
                    marginTop: 20
                  }}>
                    <View style={{
                      backgroundColor: colors.branco,
                      borderWidth: 2,
                      borderColor: colors.marromFeijao,
                      borderStyle: 'dashed',
                      borderRadius: 16,
                      padding: 32,
                      alignItems: 'center',
                      maxWidth: 500,
                      width: '100%'
                    }}>
                      <Text style={{ 
                        fontSize: 48, 
                        marginBottom: 16 
                      }}>
                        🍽️
                      </Text>
                      <Text style={{ 
                        color: colors.verdeFolha, 
                        fontSize: 20, 
                        fontWeight: 'bold', 
                        textAlign: 'center', 
                        marginBottom: 12 
                      }}>
                        Cardápio em Construção
                      </Text>
                      <Text style={{ 
                        color: colors.preto, 
                        fontSize: 16, 
                        textAlign: 'center', 
                        marginBottom: 16,
                        lineHeight: 22
                      }}>
                        Este restaurante ainda não cadastrou seus pratos no sistema.
                      </Text>
                      <Text style={{ 
                        color: colors.marromFeijao, 
                        fontSize: 14, 
                        textAlign: 'center',
                        fontStyle: 'italic'
                      }}>
                        Entre em contato diretamente com o restaurante para conhecer as opções disponíveis.
                      </Text>
                    </View>
                  </View>
            ) : (
                  // Estado com pratos - exibir carrossel horizontal
                  <View style={{ width: '100%', alignItems: 'center', marginBottom: 24, position: 'relative' }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        marginBottom: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.verdeFolha,
                          fontWeight: 'bold',
                          fontSize: isSmallScreen ? 20 : 24,
                          textAlign: 'center',
                        }}
                      >
                        Faça seu pedido
                      </Text>
                      <MaterialIcons
                        name="sticky-note-2"
                        size={isSmallScreen ? 20 : 24}
                        color={colors.amareloOuro}
                      />
                    </View>

                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {pratosAdaptados.length > 1 && (
                        <TouchableOpacity
                          onPress={() => scrollCardapio('left')}
                          disabled={!canScrollCardapioLeft}
                          activeOpacity={0.75}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: colors.overlayEscuro,
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: canScrollCardapioLeft ? 1 : 0.3,
                            shadowColor: colors.preto,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 4,
                            marginRight: isSmallScreen ? 8 : 12,
                          }}
                        >
                          <MaterialIcons name="chevron-left" size={20} color={colors.branco} />
                        </TouchableOpacity>
                      )}

                      <View
                        style={{ flex: 1 }}
                        onLayout={(event) => {
                          const width = event.nativeEvent.layout.width;
                          setCardapioViewportWidth(width);
                          atualizarMaxCardapioScroll(cardapioContentWidth, width);
                        }}
                      >
                        <ScrollView
                          ref={cardapioScrollRef}
                          horizontal
                          nestedScrollEnabled
                          showsHorizontalScrollIndicator={false}
                          onScroll={handleCardapioScroll}
                          scrollEventThrottle={16}
                          onContentSizeChange={(contentWidth) => {
                            setCardapioContentWidth(contentWidth);
                            atualizarMaxCardapioScroll(contentWidth, cardapioViewportWidth);
                          }}
                          decelerationRate="fast"
                          snapToInterval={cardapioScrollStep}
                          snapToAlignment="center"
                          contentContainerStyle={{
                            paddingHorizontal: isSmallScreen ? 12 : 24,
                            alignItems: 'center',
                          }}
                          style={{ flexGrow: 0 }}
                        >
                          {pratosAdaptados.map((prato, idx) => (
                            <View
                              key={`${prato.nome}-${idx}`}
                              style={{
                                width: cardapioCardWidth,
                                marginRight: idx === pratosAdaptados.length - 1 ? 0 : 16,
                              }}
                            >
                              <CardPrato
                                {...prato}
                                onPress={() => abrirModal(prato)}
                                onPressAvaliacoes={() => verAvaliacoesPrato(prato)}
                              />
                            </View>
                          ))}
                        </ScrollView>
                      </View>

                      {pratosAdaptados.length > 1 && (
                        <TouchableOpacity
                          onPress={() => scrollCardapio('right')}
                          disabled={!canScrollCardapioRight}
                          activeOpacity={0.75}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: colors.overlayEscuro,
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: canScrollCardapioRight ? 1 : 0.3,
                            shadowColor: colors.preto,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 4,
                            marginLeft: isSmallScreen ? 8 : 12,
                          }}
                        >
                          <MaterialIcons name="chevron-right" size={20} color={colors.branco} />
                        </TouchableOpacity>
                      )}
                    </View>

                    {isMobileRuntime && pratosAdaptados.length > 1 && (
                      <View
                        style={{
                          marginTop: 12,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                          backgroundColor: 'rgba(0,0,0,0.25)',
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 16,
                        }}
                      >
                      </View>
                    )}
                  </View>
                )}
          </View>
        </View>
      </ScrollView>

      {infoDrawerVisible && (
        <Modal
          transparent
          visible={infoDrawerVisible}
          animationType="fade"
          onRequestClose={closeInfoDrawer}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <TouchableWithoutFeedback onPress={closeInfoDrawer}>
              <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
            </TouchableWithoutFeedback>
            <Animated.View
              {...drawerPanResponder.panHandlers}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: drawerWidth,
                backgroundColor: colors.branco,
                paddingTop: Platform.select({ ios: 60, default: 48 }),
                shadowColor: colors.preto,
                shadowOpacity: 0.25,
                shadowRadius: 12,
                shadowOffset: { width: -4, height: 0 },
                elevation: 12,
                transform: [{ translateX: drawerTranslateX }],
              }}
            >
              <View style={infoDrawerStyles.container}>
                <View style={infoDrawerStyles.headerRow}>
                  <View style={infoDrawerStyles.headerTextGroup}>
                    <Text style={infoDrawerStyles.title}>{empresaCompleta.nome}</Text>
                    <Text style={infoDrawerStyles.subtitle}>
                      {[empresaCompleta.cidade, empresaCompleta.estado].filter(Boolean).join(' / ') ||
                        'Localização não informada'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={closeInfoDrawer}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <MaterialIcons name="close" size={24} color={colors.cinzaEscuro} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 32 }}
                >
                  <View style={infoDrawerStyles.section}>
                    <Text style={infoDrawerStyles.sectionLabel}>Descrição</Text>
                    <Text style={infoDrawerStyles.sectionText}>
                      {empresaCompleta.funcionamento}
                    </Text>
                  </View>

                  <View style={infoDrawerStyles.section}>
                    <Text style={infoDrawerStyles.sectionLabel}>Horário</Text>
                    <Text style={infoDrawerStyles.sectionText}>
                      {empresaCompleta.horario || 'Horário não informado'}
                    </Text>
                  </View>

                  <View style={infoDrawerStyles.section}>
                    <Text style={infoDrawerStyles.sectionLabel}>Lotação</Text>
                    <Text style={infoDrawerStyles.sectionText}>
                      {empresaCompleta.lotacao
                        ? `Capacidade para ${empresaCompleta.lotacao} pessoas`
                        : 'Capacidade não informada'}
                    </Text>
                  </View>

                  <View style={infoDrawerStyles.section}>
                    <Text style={infoDrawerStyles.sectionLabel}>Reservas</Text>
                    <Text style={infoDrawerStyles.sectionText}>{empresaCompleta.reservas}</Text>
                  </View>

                  <View style={infoDrawerStyles.divider} />

                  <View style={infoDrawerStyles.section}>
                    <Text style={infoDrawerStyles.sectionLabel}>Contato</Text>
                    <TouchableOpacity
                      onPress={() => handleCopy(empresaCompleta.telefone || '', 'telefone')}
                      style={infoDrawerStyles.actionButton}
                    >
                      <MaterialIcons name="content-copy" size={20} color={colors.verdeFolha} />
                      <Text style={infoDrawerStyles.actionButtonText}>
                        {empresaCompleta.telefone || 'Telefone não informado'}
                      </Text>
                      <Text style={{ color: colors.verdeFolha, fontWeight: '600', fontSize: 12 }}>
                        {copied === 'telefone' ? 'Copiado!' : 'Copiar'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => abrirLinkExterno(empresaCompleta.links.whatsapp, 'WhatsApp')}
                      style={[infoDrawerStyles.actionButton, { borderColor: colors.amareloOuro }]}
                    >
                      <FontAwesome name="whatsapp" size={20} color={colors.amareloOuro} />
                      <Text style={infoDrawerStyles.actionButtonText}>Conversar pelo WhatsApp</Text>
                      <MaterialIcons name="open-in-new" size={18} color={colors.amareloOuro} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleCopy(empresaCompleta.endereco || '', 'endereco')}
                      style={infoDrawerStyles.actionButton}
                    >
                      <MaterialIcons name="place" size={20} color={colors.verdeFolha} />
                      <Text style={infoDrawerStyles.actionButtonText}>
                        {empresaCompleta.endereco}
                      </Text>
                      <Text style={{ color: colors.verdeFolha, fontWeight: '600', fontSize: 12 }}>
                        {copied === 'endereco' ? 'Copiado!' : 'Copiar'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => abrirLinkExterno(empresaCompleta.links.maps, 'Mapa')}
                      style={[infoDrawerStyles.actionButton, { borderColor: colors.azulInfo }]}
                    >
                      <MaterialIcons name="map" size={20} color={colors.azulInfo} />
                      <Text style={infoDrawerStyles.actionButtonText}>Abrir no Google Maps</Text>
                      <MaterialIcons name="open-in-new" size={18} color={colors.azulInfo} />
                    </TouchableOpacity>
                  </View>

                  <View style={infoDrawerStyles.divider} />

                  <View style={infoDrawerStyles.section}>
                    <Text style={infoDrawerStyles.sectionLabel}>Redes Sociais</Text>
                    <View style={infoDrawerStyles.socialRow}>
                      <TouchableOpacity
                        onPress={() => abrirLinkExterno(empresaCompleta.links.facebook, 'Facebook')}
                      >
                        <FontAwesome name="facebook" size={22} color={colors.verdeFolha} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => abrirLinkExterno(empresaCompleta.links.instagram, 'Instagram')}
                      >
                        <FontAwesome name="instagram" size={22} color={colors.verdeFolha} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => abrirLinkExterno(empresaCompleta.links.site, 'Site')}
                      >
                        <MaterialIcons name="public" size={24} color={colors.verdeFolha} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => abrirLinkExterno(empresaCompleta.links.cardapio, 'Cardápio')}
                      >
                        <MaterialIcons name="restaurant-menu" size={24} color={colors.verdeFolha} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </Animated.View>
          </View>
        </Modal>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={fecharModal}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ 
            backgroundColor: colors.branco, 
            borderRadius: 20, 
            width: '100%', 
            maxWidth: 600,
            maxHeight: '90%',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.verdeFolha,
            shadowColor: colors.marromFeijao,
            shadowOpacity: 0.18,
            shadowRadius: 12,
            elevation: 10,
          }}>
            {pratoSelecionado && (
              <ScrollView 
                style={{ width: '100%' }}
                contentContainerStyle={{ 
                  padding: 32,
                  alignItems: 'center'
                }}
                showsVerticalScrollIndicator={false}
              >
                {/* Header do Modal */}
                <View style={{ width: '100%', alignItems: 'center', marginBottom: 24 }}>
                  <Image source={pratoSelecionado.imagem} style={{ width: 280, height: 140, borderRadius: 15, marginBottom: 16, resizeMode: 'cover', borderWidth: 2, borderColor: colors.amareloOuro }} />
                  <Text style={{ color: colors.verdeFolha, fontWeight: 'bold', fontSize: 28, marginBottom: 8, textAlign: 'center', letterSpacing: 1 }}>{pratoSelecionado.nome}</Text>
                  <Text style={{ color: colors.preto, fontSize: 16, marginBottom: 12, textAlign: 'center' }}>{pratoSelecionado.ingredientes}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ color: colors.preto, fontWeight: 'bold', fontSize: 24, marginRight: 16 }}>{pratoSelecionado.valor}</Text>
                    <StarRating rating={pratoSelecionado.avaliacao} size={24} />
                  </View>
                </View>

                {/* Quantidade */}
                <View style={{ width: '100%', marginBottom: 24 }}>
                  <Text style={{ color: colors.verdeFolha, fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Quantidade</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Pressable 
                      onPress={() => setQuantidade(Math.max(1, quantidade - 1))}
                      style={{ 
                        backgroundColor: colors.marromFeijao, 
                        width: 40, 
                        height: 40, 
                        borderRadius: 20, 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginRight: 16,
                        borderWidth: 2,
                        borderColor: colors.marromFeijao
                      }}
                    >
                      <Text style={{ color: colors.branco, fontSize: 20, fontWeight: 'bold' }}>-</Text>
                    </Pressable>
                    <Text style={{ color: colors.preto, fontSize: 24, fontWeight: 'bold', marginHorizontal: 20 }}>{quantidade}</Text>
                    <Pressable 
                      onPress={() => setQuantidade(quantidade + 1)}
                      style={{ 
                        backgroundColor: colors.verdeFolha, 
                        width: 40, 
                        height: 40, 
                        borderRadius: 20, 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginLeft: 16,
                        borderWidth: 2,
                        borderColor: colors.verdeFolha
                      }}
                    >
                      <Text style={{ color: colors.branco, fontSize: 20, fontWeight: 'bold' }}>+</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Ingredientes para Remover */}
                <View style={{ width: '100%', marginBottom: 24 }}>
                  <Text style={{ color: colors.verdeFolha, fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Remover Ingredientes</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {pratoSelecionado.ingredientes.split(',').map((ingrediente, index) => {
                      const ingredienteLimpo = ingrediente.trim();
                      return (
                        <Pressable
                          key={index}
                          onPress={() => toggleIngrediente(ingredienteLimpo, 'remover')}
                          style={{
                            backgroundColor: ingredientesRemovidos.includes(ingredienteLimpo) ? colors.verdeFolha : colors.branco,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 20,
                            borderWidth: 1.5,
                            borderColor: colors.verdeFolha,
                            marginBottom: 4,
                          }}
                        >
                          <Text style={{ 
                            color: ingredientesRemovidos.includes(ingredienteLimpo) ? colors.branco : colors.verdeFolha,
                            fontSize: 14,
                            fontWeight: ingredientesRemovidos.includes(ingredienteLimpo) ? 'bold' : 'normal'
                          }}>
                            {ingredientesRemovidos.includes(ingredienteLimpo) ? '✓ ' : ''}{ingredienteLimpo}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Ingredientes para Adicionar */}
                <View style={{ width: '100%', marginBottom: 24 }}>
                  <Text style={{ color: colors.verdeFolha, fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Adicionar Ingredientes</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {['Bacon', 'Queijo Extra', 'Molho Especial', 'Pimenta Extra', 'Cebola Caramelizada'].map((ingrediente) => (
                      <Pressable
                        key={ingrediente}
                        onPress={() => toggleIngrediente(ingrediente, 'adicionar')}
                        style={{
                          backgroundColor: ingredientesAdicionados.includes(ingrediente) ? colors.verdeFolha : colors.branco,
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 20,
                          borderWidth: 1.5,
                          borderColor: colors.verdeFolha,
                          marginBottom: 4,
                        }}
                      >
                        <Text style={{ 
                          color: ingredientesAdicionados.includes(ingrediente) ? colors.branco : colors.verdeFolha,
                          fontSize: 14,
                          fontWeight: ingredientesAdicionados.includes(ingrediente) ? 'bold' : 'normal'
                        }}>
                          {ingredientesAdicionados.includes(ingrediente) ? '✓ ' : ''}{ingrediente}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Observações */}
                <View style={{ width: '100%', marginBottom: 32 }}>
                  <Text style={{ color: colors.verdeFolha, fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Observações</Text>
                  <TextInput
                    style={{
                      backgroundColor: colors.branco,
                      borderRadius: 12,
                      padding: 16,
                      color: colors.preto,
                      fontSize: 16,
                      minHeight: 80,
                      textAlignVertical: 'top',
                      borderWidth: 1.5,
                      borderColor: colors.verdeFolha
                    }}
                    placeholder="Ex: Bem passado, sem sal, etc..."
                    placeholderTextColor={colors.preto + '88'}
                    value={observacoes}
                    onChangeText={setObservacoes}
                    multiline
                  />
                </View>

                {/* Botões */}
                <View style={{ width: '100%', gap: 12 }}>
                  <Pressable 
                    onPress={fecharModal} 
                    style={{ 
                      backgroundColor: colors.branco,
                      paddingVertical: 14,
                      paddingHorizontal: 24,
                      borderRadius: 12,
                      alignItems: 'center',
                      borderWidth: 1.5,
                      borderColor: colors.marromFeijao,
                      width: '100%',
                    }}
                  >
                    <Text style={{ color: colors.marromFeijao, fontWeight: 'bold', fontSize: 15 }}>Cancelar</Text>
              </Pressable>
                  <Pressable 
                    onPress={adicionarAoCarrinho} 
                    style={{ 
                      backgroundColor: colors.verdeFolha, 
                      paddingVertical: 14, 
                      paddingHorizontal: 24, 
                      borderRadius: 12, 
                      alignItems: 'center',
                      borderWidth: 1.5,
                      borderColor: colors.verdeFolha,
                      width: '100%',
                    }}
                  >
                    <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 15 }}>Adicionar ao Carrinho</Text>
              </Pressable>
            </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>



    </View>
  );
};

export default PerfilEmpresa; 