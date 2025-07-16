import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, ScrollView, StyleSheet, Platform, Clipboard, Dimensions, Modal, Pressable, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { indexStyles } from '../style/indexStyles';
import Header from '../components/Header';
import CardPrato from '../components/CardPrato';
import StarRating from '../components/StarRating';
import { colors } from '../style/colors';

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
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  nome: {
    color: colors.verdeFolha,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    letterSpacing: 1,
  },
  descricao: {
    color: colors.preto,
    fontSize: 17,
    textAlign: 'left',
    marginTop: 8,
    marginBottom: 14,
    maxWidth: 400,
    lineHeight: 22,
    marginRight: 300,
  },
  infoRapida: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'nowrap',
    justifyContent: 'flex-end',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 6,
    color: colors.verdeFolha,
  },
  infoText: {
    color: colors.preto,
    fontSize: 13,
    marginRight: 4,
    maxWidth: 120,
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

const pratosQuentes = [
  {
    imagem: require('../assets/pratos/prato1.png'),
    nome: 'Yakissoba',
    ingredientes: 'Macarrão, legumes, carne, molho especial',
    valor: 'R$ 32,00',
    avaliacao: 4.7,
  },
  {
    imagem: require('../assets/pratos/prato2.png'),
    nome: 'Tempurá',
    ingredientes: 'Legumes empanados, camarão',
    valor: 'R$ 28,00',
    avaliacao: 4.5,
  },
  {
    imagem: require('../assets/pratos/prato3.png'),
    nome: 'Lamen',
    ingredientes: 'Macarrão, caldo, ovo, carne de porco',
    valor: 'R$ 36,00',
    avaliacao: 4.8,
  },
];
const pratosFrios = [
  {
    imagem: require('../assets/pratos/prato1.png'),
    nome: 'Sashimi',
    ingredientes: 'Fatias de salmão fresco',
    valor: 'R$ 38,00',
    avaliacao: 4.9,
  },
  {
    imagem: require('../assets/pratos/prato2.png'),
    nome: 'Ceviche',
    ingredientes: 'Peixe branco, limão, cebola roxa',
    valor: 'R$ 29,00',
    avaliacao: 4.6,
  },
  {
    imagem: require('../assets/pratos/prato3.png'),
    nome: 'Uramaki',
    ingredientes: 'Arroz, salmão, nori, cream cheese',
    valor: 'R$ 34,00',
    avaliacao: 4.7,
  },
];
const pratosFavoritos = [
  {
    imagem: require('../assets/pratos/prato1.png'),
    nome: 'Hot Roll',
    ingredientes: 'Salmão, cream cheese, empanado',
    valor: 'R$ 27,00',
    avaliacao: 5.0,
  },
  {
    imagem: require('../assets/pratos/prato2.png'),
    nome: 'Combinado Especial',
    ingredientes: 'Sushi, sashimi, uramaki',
    valor: 'R$ 59,00',
    avaliacao: 4.8,
  },
  {
    imagem: require('../assets/pratos/prato3.png'),
    nome: 'Temaki Salmão',
    ingredientes: 'Cone de nori, arroz, salmão',
    valor: 'R$ 25,00',
    avaliacao: 4.9,
  },
];

// Pratos brasileiros típicos
const pratosBrasileiros = {
  quentes: [
    {
      imagem: require('../assets/pratos/feijoada.png'),
      nome: 'Feijoada',
      ingredientes: 'Feijão preto, carne seca, linguiça, arroz, couve',
      valor: 'R$ 38,00',
      avaliacao: 4.9,
    },
    {
      imagem: require('../assets/pratos/moqueca.png'),
      nome: 'Moqueca Baiana',
      ingredientes: 'Peixe, leite de coco, azeite de dendê, pimentão',
      valor: 'R$ 44,00',
      avaliacao: 4.8,
    },
    {
      imagem: require('../assets/pratos/escondidinho.png'),
      nome: 'Escondidinho de Carne Seca',
      ingredientes: 'Carne seca, purê de mandioca, queijo coalho',
      valor: 'R$ 32,00',
      avaliacao: 4.7,
    },
  ],
  frios: [
    {
      imagem: require('../assets/pratos/salada.png'),
      nome: 'Salada de Palmito',
      ingredientes: 'Palmito, tomate, cebola, azeite',
      valor: 'R$ 22,00',
      avaliacao: 4.6,
    },
    {
      imagem: require('../assets/pratos/salada.png'),
      nome: 'Vinagrete',
      ingredientes: 'Tomate, cebola, pimentão, vinagre',
      valor: 'R$ 16,00',
      avaliacao: 4.5,
    },
    {
      imagem: require('../assets/pratos/ceviche-brasileiro.png'),
      nome: 'Ceviche Brasileiro',
      ingredientes: 'Peixe branco, limão, cebola roxa, coentro',
      valor: 'R$ 29,00',
      avaliacao: 4.7,
    },
  ],
  favoritos: [
    {
      imagem: require('../assets/pratos/pao-queijo.png'),
      nome: 'Pão de Queijo',
      ingredientes: 'Polvilho, queijo, ovos, leite',
      valor: 'R$ 12,00',
      avaliacao: 5.0,
    },
    {
      imagem: require('../assets/pratos/brigadeiro.png'),
      nome: 'Brigadeiro',
      ingredientes: 'Leite condensado, chocolate, manteiga',
      valor: 'R$ 8,00',
      avaliacao: 4.9,
    },
    {
      imagem: require('../assets/pratos/acaraje.png'),
      nome: 'Acarajé',
      ingredientes: 'Feijão-fradinho, camarão, vatapá',
      valor: 'R$ 15,00',
      avaliacao: 4.8,
    },
  ],
};

// Pratos típicos da Cozinha da Mãe
const pratosCozinhaMae = {
  quentes: [
    {
      imagem: require('../assets/pratos/acaraje.png'),
      nome: 'Acarajé Quente',
      ingredientes: 'Feijão-fradinho, camarão, vatapá, pimenta',
      valor: 'R$ 18,00',
      avaliacao: 4.8,
    },
    {
      imagem: require('../assets/pratos/moqueca.png'),
      nome: 'Moqueca de Camarão',
      ingredientes: 'Camarão, leite de coco, azeite de dendê',
      valor: 'R$ 42,00',
      avaliacao: 4.7,
    },
    {
      imagem: require('../assets/pratos/bobo-camarao.png'),
      nome: 'Bobó de Camarão',
      ingredientes: 'Camarão, mandioca, leite de coco, arroz',
      valor: 'R$ 39,00',
      avaliacao: 4.9,
    },
  ],
  frios: [
    {
      imagem: require('../assets/pratos/salada.png'),
      nome: 'Salada de Bacalhau',
      ingredientes: 'Bacalhau, batata, cebola, azeite',
      valor: 'R$ 28,00',
      avaliacao: 4.6,
    },
    {
      imagem: require('../assets/pratos/salada.png'),
      nome: 'Salada de Grão-de-Bico',
      ingredientes: 'Grão-de-bico, tomate, cebola, azeite',
      valor: 'R$ 19,00',
      avaliacao: 4.5,
    },
    {
      imagem: require('../assets/pratos/cuscuz-paulista.png'),
      nome: 'Cuscuz Paulista',
      ingredientes: 'Farinha de milho, legumes, ovos, sardinha',
      valor: 'R$ 16,00',
      avaliacao: 4.7,
    },
  ],
  favoritos: [
    {
      imagem: require('../assets/pratos/bolo-fuba.png'),
      nome: 'Bolo de Fubá',
      ingredientes: 'Fubá, ovos, leite, fermento',
      valor: 'R$ 10,00',
      avaliacao: 5.0,
    },
    {
      imagem: require('../assets/pratos/canjica.png'),
      nome: 'Canjica',
      ingredientes: 'Milho branco, leite, coco, amendoim',
      valor: 'R$ 9,00',
      avaliacao: 4.8,
    },
    {
      imagem: require('../assets/pratos/quindim.png'),
      nome: 'Quindim',
      ingredientes: 'Coco, ovos, açúcar',
      valor: 'R$ 7,00',
      avaliacao: 4.9,
    },
  ],
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isLargeScreen = SCREEN_WIDTH > 900;

const PerfilEmpresa = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const empresa = empresaData[id as string] || empresaData['1'];
  const [copied, setCopied] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [pratoSelecionado, setPratoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [observacoes, setObservacoes] = useState('');
  const [ingredientesRemovidos, setIngredientesRemovidos] = useState([]);
  const [ingredientesAdicionados, setIngredientesAdicionados] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [modalAvaliacaoVisible, setModalAvaliacaoVisible] = useState(false);
  const [avaliacaoUsuario, setAvaliacaoUsuario] = useState(0);
  const [observacaoUsuario, setObservacaoUsuario] = useState('');
  const [estrelasPressionadas, setEstrelasPressionadas] = useState(false);

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
    const itemDoCarrinho = {
      id: Date.now(),
      prato: pratoSelecionado,
      quantidade,
      observacoes,
      ingredientesRemovidos,
      ingredientesAdicionados,
      empresa: empresa.nome
    };
    
    setCarrinho(prev => [...prev, itemDoCarrinho]);
    console.log('Adicionado ao carrinho:', itemDoCarrinho);
    fecharModal();
  }

  function abrirCarrinho() {
    console.log('Carrinho atual:', carrinho);
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

  function abrirModalAvaliacao() {
    setModalAvaliacaoVisible(true);
  }
  function fecharModalAvaliacao() {
    setModalAvaliacaoVisible(false);
    setAvaliacaoUsuario(0);
    setObservacaoUsuario('');
  }
  function enviarAvaliacao() {
    // Aqui você pode enviar para API ou processar a avaliação
    console.log('Avaliação enviada:', avaliacaoUsuario, observacaoUsuario);
    fecharModalAvaliacao();
  }

  // Seleciona os pratos conforme o restaurante
  const isBrasileiro = empresa.nome === 'Brasil Brasileiro';
  const isCozinhaMae = empresa.nome === 'Cozinha da Mãe';
  const pratosQuentesExibir = isBrasileiro ? pratosBrasileiros.quentes : isCozinhaMae ? pratosCozinhaMae.quentes : pratosQuentes;
  const pratosFriosExibir = isBrasileiro ? pratosBrasileiros.frios : isCozinhaMae ? pratosCozinhaMae.frios : pratosFrios;
  const pratosFavoritosExibir = isBrasileiro ? pratosBrasileiros.favoritos : isCozinhaMae ? pratosCozinhaMae.favoritos : pratosFavoritos;

  return (
    <View style={indexStyles.main}>
      <Header 
        logo="Japones APP" 
        cartItemCount={carrinho.length}
        onCartPress={abrirCarrinho}
      />
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}>
        {/* Banner com gradiente e nome */}
        <View style={perfilEmpresaStyles.bannerContainer}>
          <Image source={empresa.banner} style={perfilEmpresaStyles.bannerImage} />
          <LinearGradient
            colors={[ 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.7)' ]}
            style={perfilEmpresaStyles.bannerGradient}
            pointerEvents="none"
          />
          {/* Estrelinhas de avaliação no limite inferior do banner */}
          <TouchableOpacity
            onPress={abrirModalAvaliacao}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(101,12,12,0.07)',
              borderRadius: 16,
              paddingVertical: 6,
              paddingHorizontal: 18,
              position: 'absolute',
              bottom: 12,
              right: 32,
              zIndex: 10,
            }}
          >
            <StarRating rating={empresa.avaliacao || 4.8} size={22} />
            <Text style={{ color: colors.amareloOuro, fontWeight: 'bold', fontSize: 18, marginLeft: 10 }}>
              {empresa.avaliacao ? empresa.avaliacao.toFixed(1) : '4.8'}
            </Text>
          </TouchableOpacity>
        </View>
                        {/* Logo, descrição, informações e links sociais em container flexível */}
        <View style={perfilEmpresaStyles.mainContentContainer}>
          {/* Logo e descrição */}
          <View style={perfilEmpresaStyles.logoContainer}>
            <Image source={empresa.logo} style={perfilEmpresaStyles.logo} />
            <View style={{ flex: 1, marginLeft: 20 }}>
              <Text style={[perfilEmpresaStyles.nome, {color: colors.branco}]}>{empresa.nome}</Text>
              {/* Descrição removida para melhor legibilidade */}
            </View>
          </View>

          {/* Info rápida na parte inferior do banner */}
          <View style={perfilEmpresaStyles.infoRapidaContainer}>
            <View style={perfilEmpresaStyles.infoRapida}>
              <View style={perfilEmpresaStyles.infoItem}>
                <Text style={perfilEmpresaStyles.infoIcon}>{empresa.aberto ? '🟢' : '🔴'}</Text>
                <Text style={perfilEmpresaStyles.infoText}>{empresa.aberto ? 'Aberto' : 'Fechado'}</Text>
              </View>
              <View style={perfilEmpresaStyles.infoItem}>
                <Icon name="phone" size={14} color={colors.verdeFolha} style={{ marginRight: 4 }} />
                <Text style={perfilEmpresaStyles.infoText}>{empresa.telefone}</Text>
                <TouchableOpacity style={perfilEmpresaStyles.copyBtn} onPress={() => handleCopy(empresa.telefone, 'telefone')} accessibilityLabel="Copiar telefone">
                  <Text style={{ color: colors.verdeFolha, fontSize: 12 }}>{copied === 'telefone' ? '✔️' : '📋'}</Text>
                </TouchableOpacity>
              </View>
              <View style={perfilEmpresaStyles.infoItem}>
                <Icon name="map-marker" size={14} color={colors.verdeFolha} style={{ marginRight: 4 }} />
                <Text style={perfilEmpresaStyles.infoText}>{empresa.endereco}</Text>
                <TouchableOpacity style={perfilEmpresaStyles.copyBtn} onPress={() => handleCopy(empresa.endereco, 'endereco')} accessibilityLabel="Copiar endereço">
                  <Text style={{ color: colors.verdeFolha, fontSize: 12 }}>{copied === 'endereco' ? '✔️' : '📋'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Links sociais sempre abaixo da descrição */}
          <View style={perfilEmpresaStyles.socialRowContainer}>
            <View style={perfilEmpresaStyles.socialRow}>
              <TouchableOpacity accessibilityLabel="Site" onPress={() => Linking.openURL(empresa.links.site)}>
                <Icon name="globe" size={28} color={colors.verdeFolha} style={perfilEmpresaStyles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity accessibilityLabel="Facebook" onPress={() => Linking.openURL(empresa.links.facebook)}>
                <Icon name="facebook" size={28} color={colors.verdeFolha} style={perfilEmpresaStyles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity accessibilityLabel="Instagram" onPress={() => Linking.openURL(empresa.links.instagram)}>
                <Icon name="instagram" size={28} color={colors.verdeFolha} style={perfilEmpresaStyles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity accessibilityLabel="WhatsApp" onPress={() => Linking.openURL(empresa.links.whatsapp)}>
                <Icon name="whatsapp" size={28} color={colors.verdeFolha} style={perfilEmpresaStyles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity accessibilityLabel="Maps" onPress={() => Linking.openURL(empresa.links.maps)}>
                <Icon name="map-marker" size={28} color={colors.verdeFolha} style={perfilEmpresaStyles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity accessibilityLabel="E-mail" onPress={() => Linking.openURL(empresa.links.email)}>
                <Icon name="envelope" size={28} color={colors.verdeFolha} style={perfilEmpresaStyles.socialIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

            {/* Área principal com seções institucionais e cards de pratos */}
            <View style={{
              width: '100%',
              maxWidth: 1400,
              flexDirection: isLargeScreen ? 'row' : 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              marginTop: 60,
              marginBottom: 32,
              paddingHorizontal: 20,
            }}>
              {/* Seções institucionais na esquerda */}
              <View style={{
                width: isLargeScreen ? 350 : '100%',
                marginBottom: isLargeScreen ? 0 : 20,
                marginRight: isLargeScreen ? 40 : 0,
              }}>
                <View style={perfilEmpresaStyles.card}>
                  <Text style={perfilEmpresaStyles.cardTitle}><Text style={perfilEmpresaStyles.cardTitleIcon}>⏰</Text>Funcionamento</Text>
                  <Text style={perfilEmpresaStyles.cardText}>{empresa.funcionamento}</Text>
                  <View style={perfilEmpresaStyles.separator} />
                  <Text style={perfilEmpresaStyles.cardTitle}><Text style={perfilEmpresaStyles.cardTitleIcon}>🗓️</Text>Horário</Text>
                  <Text style={perfilEmpresaStyles.cardText}>{empresa.horario}</Text>
                  <View style={perfilEmpresaStyles.separator} />
                  <Text style={perfilEmpresaStyles.cardTitle}><Text style={perfilEmpresaStyles.cardTitleIcon}>👥</Text>Lotação</Text>
                  <Text style={perfilEmpresaStyles.cardText}>{empresa.lotacao}</Text>
                  <View style={perfilEmpresaStyles.separator} />
                  <Text style={perfilEmpresaStyles.cardTitle}><Text style={perfilEmpresaStyles.cardTitleIcon}>🎶</Text>Acústicos</Text>
                  <Text style={perfilEmpresaStyles.cardText}>{empresa.acusticos}</Text>
                  <View style={perfilEmpresaStyles.separator} />
                  <Text style={perfilEmpresaStyles.cardTitle}><Text style={perfilEmpresaStyles.cardTitleIcon}>📋</Text>Reservas</Text>
                  <Text style={perfilEmpresaStyles.cardText}>{empresa.reservas}</Text>
                </View>
              </View>

              {/* Cards de Pratos por Categoria */}
              <View style={{
                flex: 1,
                maxWidth: 1200,
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
              }}>
                {/* Categoria Quentes */}
                <View style={{ width: '100%', alignItems: 'flex-start', marginBottom: 8 }}>
                  <Text style={{ color: colors.verdeFolha, fontWeight: 'bold', fontSize: 20, marginBottom: 8, textAlign: 'left', marginLeft: 40 }}>Quentes</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={{ 
                      paddingHorizontal: 20,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }} 
                    style={{ marginBottom: 18, width: '100%' }}
                  >
                    {pratosQuentesExibir.map((prato, idx) => (
                      <CardPrato key={prato.nome + idx} {...prato} onPress={() => abrirModal(prato)} />
                    ))}
                  </ScrollView>
                </View>
                {/* Categoria Frios */}
                <View style={{ width: '100%', alignItems: 'flex-start', marginBottom: 8 }}>
                  <Text style={{ color: colors.verdeFolha, fontWeight: 'bold', fontSize: 20, marginBottom: 8, textAlign: 'left', marginLeft: 40 }}>Frios</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={{ 
                      paddingHorizontal: 20,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }} 
                    style={{ marginBottom: 18, width: '100%' }}
                  >
                    {pratosFriosExibir.map((prato, idx) => (
                      <CardPrato key={prato.nome + idx} {...prato} onPress={() => abrirModal(prato)} />
                    ))}
                  </ScrollView>
                </View>
                {/* Categoria Favoritos */}
                <View style={{ width: '100%', alignItems: 'flex-start', marginBottom: 8 }}>
                  <Text style={{ color: colors.verdeFolha, fontWeight: 'bold', fontSize: 20, marginBottom: 8, textAlign: 'left', marginLeft: 40 }}>Favoritos</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={{ 
                      paddingHorizontal: 20,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }} 
                    style={{ marginBottom: 18, width: '100%' }}
                  >
                    {pratosFavoritosExibir.map((prato, idx) => (
                      <CardPrato key={prato.nome + idx} {...prato} onPress={() => abrirModal(prato)} />
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
      </ScrollView>

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
                <View style={{ flexDirection: 'row', gap: 16, width: '100%' }}>
                  <Pressable 
                    onPress={fecharModal} 
                    style={{ 
                      backgroundColor: colors.branco,
                      paddingVertical: 16,
                      paddingHorizontal: 32,
                      borderRadius: 12,
                      flex: 1,
                      alignItems: 'center',
                      borderWidth: 1.5,
                      borderColor: colors.marromFeijao
                    }}
                  >
                    <Text style={{ color: colors.marromFeijao, fontWeight: 'bold', fontSize: 16 }}>Cancelar</Text>
              </Pressable>
                  <Pressable 
                    onPress={adicionarAoCarrinho} 
                    style={{ 
                      backgroundColor: colors.verdeFolha, 
                      paddingVertical: 16, 
                      paddingHorizontal: 32, 
                      borderRadius: 12, 
                      flex: 1,
                      alignItems: 'center',
                      borderWidth: 1.5,
                      borderColor: colors.verdeFolha
                    }}
                  >
                    <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 16 }}>Adicionar ao Carrinho</Text>
              </Pressable>
            </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalAvaliacaoVisible}
        transparent
        animationType="fade"
        onRequestClose={fecharModalAvaliacao}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: colors.branco, borderRadius: 20, width: '100%', maxWidth: 400, alignItems: 'center', padding: 28, borderWidth: 2, borderColor: colors.verdeFolha, shadowColor: colors.marromFeijao, shadowOpacity: 0.18, shadowRadius: 12, elevation: 10 }}>
            <Text style={{ color: colors.verdeFolha, fontWeight: 'bold', fontSize: 22, marginBottom: 18, textAlign: 'center', letterSpacing: 1 }}>Avalie este restaurante</Text>
            <StarRating rating={avaliacaoUsuario} interactive onRatingChange={setAvaliacaoUsuario} size={32} />
            <TextInput
              style={{
                width: '100%',
                minHeight: 60,
                backgroundColor: colors.branco,
                color: colors.preto,
                borderRadius: 10,
                padding: 12,
                marginTop: 18,
                marginBottom: 18,
                fontSize: 16,
                borderWidth: 1.5,
                borderColor: colors.verdeFolha
              }}
              placeholder="Deixe uma observação (opcional)"
              placeholderTextColor={colors.preto + '88'}
              multiline
              value={observacaoUsuario}
              onChangeText={setObservacaoUsuario}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <TouchableOpacity onPress={fecharModalAvaliacao} style={{ padding: 12, borderRadius: 8, backgroundColor: colors.branco, marginRight: 10, flex: 1, borderWidth: 1.5, borderColor: colors.marromFeijao }}>
                <Text style={{ color: colors.marromFeijao, textAlign: 'center', fontWeight: 'bold' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={enviarAvaliacao} style={{ padding: 12, borderRadius: 8, backgroundColor: colors.verdeFolha, flex: 1, borderWidth: 1.5, borderColor: colors.verdeFolha }} disabled={avaliacaoUsuario === 0}>
                <Text style={{ color: colors.branco, textAlign: 'center', fontWeight: 'bold' }}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PerfilEmpresa; 