import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import StarRating from '../components/StarRating';
import { colors } from '../style/colors';
import { useAuthSession } from '../contexts/AuthContext';
import { useCart, generateCartId, CartItem } from '../contexts/CartContext';

// APIs
import { ClienteResponse, atualizarCliente, getSessao, logoutCliente, buscarCliente, buscarEnderecoPorCep, buscarDadosClienteLogado } from '../api/cliente';
import { PedidoResponse, buscarPedidosCliente, formatarDataPedido, formatarStatusPedido, calcularValorTotal } from '../api/pedido';
import { AvaliacaoPratoResponse, formatarDataAvaliacao } from '../api/avaliacaoPrato';
import { ItemRestauranteResponse, buscarItemPorId } from '../api/itemRestaurante';

// Interface estendida para incluir campos formatados
interface ClienteFormatado extends ClienteResponse {
  cpfFormatado?: string;
  telefoneFormatado?: string;
  cepFormatado?: string;
  enderecoCompleto?: string;
  cidadeEstado?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isLargeScreen = SCREEN_WIDTH > 900;
const isMediumScreen = SCREEN_WIDTH > 600;

const perfilUsuarioStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cinzaMuitoClaro,
  },
  headerSection: {
    backgroundColor: colors.branco,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.verdeFolha,
    shadowColor: colors.verdeFolha,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.verdeFolha,
    backgroundColor: colors.verdeFolha,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: colors.branco,
    fontSize: 36,
    fontWeight: 'bold',
  },
  userName: {
    color: colors.verdeFolha,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  userEmail: {
    color: colors.preto,
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: colors.vermelhoCambuci,
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: colors.preto,
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    backgroundColor: colors.branco,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.verdeFolha,
    shadowColor: colors.verdeFolha,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    color: colors.verdeFolha,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  orderCard: {
    backgroundColor: colors.branco,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cinzaClaro,
    shadowColor: colors.verdeFolha,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderRestaurant: {
    color: colors.verdeFolha,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  orderDate: {
    color: colors.cinzaEscuro,
    fontSize: 14,
  },
  orderItems: {
    color: colors.preto,
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  orderTotal: {
    color: colors.vermelhoCambuci,
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  statusConcluido: {
    backgroundColor: colors.verdeSucesso,
  },
  statusEmPreparo: {
    backgroundColor: colors.laranjaAviso,
  },
  statusNovo: {
    backgroundColor: colors.azulInfo,
  },
  statusCancelado: {
    backgroundColor: colors.vermelhoErro,
  },
  statusText: {
    color: colors.branco,
    fontSize: 12,
    fontWeight: 'bold',
  },
  reviewCard: {
    backgroundColor: colors.branco,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cinzaClaro,
    shadowColor: colors.verdeFolha,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewPrato: {
    color: colors.verdeFolha,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  reviewText: {
    color: colors.preto,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: colors.verdeFolha,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: colors.branco,
    fontSize: 14,
    fontWeight: 'bold',
  },
  reorderCard: {
    backgroundColor: colors.branco,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.amareloOuro,
    borderStyle: 'dashed',
    shadowColor: colors.amareloOuro,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  reorderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reorderTitle: {
    color: colors.verdeFolha,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  reorderButton: {
    backgroundColor: colors.amareloOuro,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reorderButtonText: {
    color: colors.preto,
    fontSize: 14,
    fontWeight: 'bold',
  },
  reorderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reorderItems: {
    color: colors.preto,
    fontSize: 14,
    flex: 1,
  },
  reorderTotal: {
    color: colors.vermelhoCambuci,
    fontSize: 16,
    fontWeight: 'bold',
  },
  reorderDate: {
    color: colors.cinzaMedio,
    fontSize: 12,
    fontStyle: 'italic',
  },
  favoriteCard: {
    backgroundColor: colors.branco,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cinzaClaro,
    shadowColor: colors.verdeFolha,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.vermelhoCambuci,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteImageText: {
    color: colors.branco,
    fontSize: 24,
    fontWeight: 'bold',
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    color: colors.verdeFolha,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  favoriteDetails: {
    color: colors.preto,
    fontSize: 14,
    marginBottom: 4,
  },
  favoriteRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteRatingText: {
    color: colors.cinzaEscuro,
    fontSize: 12,
    marginLeft: 4,
  },
  favoriteButton: {
    backgroundColor: colors.verdeFolha,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  favoriteButtonText: {
    color: colors.branco,
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.overlayEscuro,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.branco,
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.verdeFolha,
  },
  modalTitle: {
    color: colors.verdeFolha,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: colors.verdeFolha,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.branco,
    borderWidth: 1,
    borderColor: colors.verdeFolha,
    borderRadius: 8,
    padding: 12,
    color: colors.preto,
    fontSize: 16,
  },
  inputReadOnly: {
    backgroundColor: colors.cinzaMuitoClaro,
    borderWidth: 1,
    borderColor: colors.cinzaClaro,
    borderRadius: 8,
    padding: 12,
    color: colors.cinzaMedio,
    fontSize: 16,
  },
  readOnlyLabel: {
    color: colors.cinzaMedio,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  formRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  formColumn: {
    flex: 1,
  },
  divider: {
    height: 2,
    backgroundColor: colors.cinzaClaro,
    marginVertical: 20,
    borderRadius: 1,
  },
  sectionHeader: {
    color: colors.verdeFolha,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: colors.verdeFolha,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: colors.branco,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
    color: colors.cinzaMedio,
    marginBottom: 16,
  },
  emptyText: {
    color: colors.preto,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    color: colors.cinzaMedio,
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cinzaMuitoClaro,
  },
  loadingText: {
    marginTop: 16,
    color: colors.verdeFolha,
    fontSize: 16,
  },
  configItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cinzaClaro,
  },
  configText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  logoutText: {
    color: colors.vermelhoErro,
  },
});

const PerfilUsuario = () => {
  const { session, clearSession } = useAuthSession();
  const { addItem: addToCart, canAddItem, clearCart, itemCount } = useCart();
  const [userData, setUserData] = useState<ClienteFormatado | null>(null);
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoPratoResponse[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPedidoVisible, setModalPedidoVisible] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoResponse | null>(null);
  const [precosAtuais, setPrecosAtuais] = useState<{[key: number]: number}>({});
  const [loadingPrecos, setLoadingPrecos] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState<'refazer' | 'detalhes'>('detalhes');
  const [editData, setEditData] = useState({
    nome: '',
    telefone: '',
    email: '',
    cpf: '',
    cep: '',
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
    numero: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fetchingCep, setFetchingCep] = useState(false);

  const router = useRouter();

  // Função de teste para debug (pode ser chamada manualmente)
  const testarAPIs = async () => {
    console.log('🧪 === TESTE DE APIS PARA DEBUG ===');
    
    try {
      console.log('🔍 Testando getSessao()...');
      const sessao = await getSessao();
      console.log('✅ getSessao() resultado:', sessao);
      
      if (sessao.id) {
        console.log('🔍 Testando buscarCliente(' + sessao.id + ')...');
        const cliente = await buscarCliente(sessao.id);
        console.log('✅ buscarCliente() resultado:', cliente);
      }
      
      console.log('🔍 Testando buscarDadosClienteLogado()...');
      const dados = await buscarDadosClienteLogado();
      console.log('✅ buscarDadosClienteLogado() resultado:', dados);
      
    } catch (error) {
      console.error('❌ Erro no teste:', error);
    }
  };

  // Carregar dados do usuário
  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  const carregarDadosUsuario = async () => {
    try {
      setLoading(true);
      
      // Buscar dados completos do cliente logado (com fallback inteligente)
      console.log('🔍 Carregando dados do cliente logado...');
      const dadosUsuario = await buscarDadosClienteLogado();
      console.log('👤 Dados do usuário carregados:', dadosUsuario);
      
      // Formatar dados para melhor exibição
      const dadosFormatados = {
        ...dadosUsuario,
        // Formatação do CPF: 123.456.789-00
        cpfFormatado: dadosUsuario.cpf ? dadosUsuario.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '',
        // Formatação do telefone: (13) 99608-3999
        telefoneFormatado: dadosUsuario.telefone ? dadosUsuario.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') : '',
        // Formatação do CEP: 11717-037
        cepFormatado: dadosUsuario.cep ? dadosUsuario.cep.replace(/(\d{5})(\d{3})/, '$1-$2') : '',
        // Endereço completo formatado
        enderecoCompleto: dadosUsuario.rua && dadosUsuario.numero 
          ? `${dadosUsuario.rua}, ${dadosUsuario.numero}${dadosUsuario.bairro ? ` - ${dadosUsuario.bairro}` : ''}`
          : '',
        cidadeEstado: dadosUsuario.cidade && dadosUsuario.estado 
          ? `${dadosUsuario.cidade} - ${dadosUsuario.estado}`
          : ''
      };
      
      // Buscar pedidos
      console.log('📋 Carregando pedidos do cliente...');
      const pedidosData = await buscarPedidosCliente();
      
      // Ordenar por data de criação (mais recente primeiro) e limitar aos últimos 5
      const pedidosOrdenados = pedidosData
        .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
        .slice(0, 5);
      
      setPedidos(pedidosOrdenados);
      console.log('📋 Pedidos carregados e ordenados:', pedidosOrdenados.length);
      console.log('📋 Últimos 5 pedidos:', pedidosOrdenados.map(p => ({ id: p.id, data: p.criadoEm })));
      
      // TODO: Implementar busca de avaliações do cliente
      // const avaliacoesData = await buscarAvaliacoesCliente();
      // setAvaliacoes(avaliacoesData);
      
      setUserData(dadosFormatados);
      
      // Configurar dados para edição (sem formatação para edição)
      setEditData({
        nome: dadosUsuario.nome || '',
        telefone: dadosUsuario.telefone || '',
        email: dadosUsuario.email || '',
        cpf: dadosUsuario.cpf || '',
        cep: dadosFormatados.cepFormatado || '',
        rua: dadosUsuario.rua || '',
        bairro: dadosUsuario.bairro || '',
        cidade: dadosUsuario.cidade || '',
        estado: dadosUsuario.estado || '',
        numero: dadosUsuario.numero || '',
      });
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    console.log('📝 === ABRINDO MODAL DE EDIÇÃO ===');
    console.log('👤 Dados do usuário no estado:', JSON.stringify(userData, null, 2));
    console.log('✏️ Dados de edição atuais:', JSON.stringify(editData, null, 2));
    
    // Garantir que os dados de edição estão sincronizados com os dados do usuário
    if (userData) {
      const dadosAtualizados = {
        nome: userData.nome || '',
        telefone: userData.telefone || '',
        email: userData.email || '',
        cpf: userData.cpf || '',
        cep: userData.cep || '',
        rua: userData.rua || '',
        bairro: userData.bairro || '',
        cidade: userData.cidade || '',
        estado: userData.estado || '',
        numero: userData.numero || '',
      };
      
      console.log('🔄 Sincronizando dados de edição:', JSON.stringify(dadosAtualizados, null, 2));
      setEditData(dadosAtualizados);
    }
    
    setModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!userData) return;
    
    try {
      setUpdating(true);
      
      // Remover formatação dos dados antes de enviar para o backend
      const dadosParaEnvio = {
        nome: editData.nome,
        telefone: editData.telefone.replace(/\D/g, ''), // Remove formatação do telefone
        email: editData.email,
        cpf: editData.cpf.replace(/\D/g, ''), // Remove formatação do CPF
        cep: editData.cep.replace(/\D/g, ''), // Remove formatação do CEP
        rua: editData.rua,
        bairro: editData.bairro,
        cidade: editData.cidade,
        estado: editData.estado,
        numero: editData.numero,
      };

      // Atualizar dados no backend (não enviamos os campos de aceite pois são imutáveis)
      const dadosAtualizados = await atualizarCliente(userData.id, dadosParaEnvio);
      
      setUserData(dadosAtualizados);
      setModalVisible(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
    } finally {
      setUpdating(false);
    }
  };

  const buscarPrecosAtuais = async (pedido: PedidoResponse) => {
    try {
      setLoadingPrecos(true);
      console.log('💰 Buscando preços atuais dos itens do pedido...');
      
      const precosMap: {[key: number]: number} = {};
      
      // Buscar preço atual de cada item
      for (const item of pedido.itens) {
        try {
          console.log(`🔍 Buscando preço atual do item ${item.itemRestaurante.id}: ${item.itemRestaurante.nome}`);
          const itemAtual = await buscarItemPorId(item.itemRestaurante.id);
          precosMap[item.itemRestaurante.id] = itemAtual.preco;
          console.log(`💲 Preço atual: R$ ${itemAtual.preco.toFixed(2)} (Original: R$ ${item.itemRestaurante.preco.toFixed(2)})`);
        } catch (error) {
          console.warn(`⚠️ Erro ao buscar preço do item ${item.itemRestaurante.id}, usando preço original:`, error);
          // Se não conseguir buscar o preço atual, usar o preço original
          precosMap[item.itemRestaurante.id] = item.itemRestaurante.preco;
        }
      }
      
      console.log('✅ Mapa de preços atuais:', precosMap);
      setPrecosAtuais(precosMap);
      
    } catch (error) {
      console.error('❌ Erro ao buscar preços atuais:', error);
      // Em caso de erro, usar preços originais
      const precosOriginais: {[key: number]: number} = {};
      pedido.itens.forEach(item => {
        precosOriginais[item.itemRestaurante.id] = item.itemRestaurante.preco;
      });
      setPrecosAtuais(precosOriginais);
    } finally {
      setLoadingPrecos(false);
    }
  };

  const handleRefazerPedido = async (pedido: PedidoResponse) => {
    console.log('🔄 Abrindo modal do pedido para refazer:', pedido);
    setModoVisualizacao('refazer');
    setPedidoSelecionado(pedido);
    setModalPedidoVisible(true);
    
    // Buscar preços atuais dos itens
    await buscarPrecosAtuais(pedido);
  };

  const handleVerDetalhesPedido = (pedido: PedidoResponse) => {
    console.log('📋 Abrindo detalhes do pedido:', pedido);
    setModoVisualizacao('detalhes');
    setPedidoSelecionado(pedido);
    setModalPedidoVisible(true);
    
    // Para visualização, usar preços originais do pedido
    const precosOriginais: {[key: number]: number} = {};
    pedido.itens.forEach(item => {
      precosOriginais[item.itemRestaurante.id] = item.itemRestaurante.preco;
    });
    setPrecosAtuais(precosOriginais);
    setLoadingPrecos(false);
  };

  const fecharModalPedido = () => {
    setModalPedidoVisible(false);
    setPedidoSelecionado(null);
    setPrecosAtuais({});
    setLoadingPrecos(false);
    setModoVisualizacao('detalhes');
  };

  const adicionarPedidoAoCarrinho = () => {
    if (!pedidoSelecionado) return;
    
    try {
      console.log('🛒 === ADICIONANDO PEDIDO AO CARRINHO ===');
      console.log('🍽️ Pedido selecionado:', pedidoSelecionado);
      console.log('💰 Preços atuais:', precosAtuais);
      
      // Verificar se pode adicionar itens deste restaurante
      if (!canAddItem(pedidoSelecionado.restaurante.id)) {
        Alert.alert(
          'Carrinho de outro restaurante',
          'Você já tem itens de outro restaurante no carrinho. Deseja limpar o carrinho e adicionar os itens deste pedido?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Limpar e Adicionar',
              onPress: () => {
                clearCart();
                adicionarItensAoCarrinho();
              }
            }
          ]
        );
        return;
      }
      
      adicionarItensAoCarrinho();
      
    } catch (error) {
      console.error('❌ Erro ao adicionar pedido ao carrinho:', error);
      Alert.alert('Erro', 'Não foi possível adicionar os itens ao carrinho');
    }
  };

  const adicionarItensAoCarrinho = () => {
    if (!pedidoSelecionado) return;
    
    let itensAdicionados = 0;
    
    // Adicionar cada item do pedido ao carrinho
    pedidoSelecionado.itens.forEach((item) => {
      try {
        const precoAtual = obterPrecoAtual(item.itemRestaurante.id, item.itemRestaurante.preco);
        
        const cartItem: CartItem = {
          cartId: generateCartId(),
          itemRestauranteId: item.itemRestaurante.id,
          nome: item.itemRestaurante.nome,
          preco: precoAtual, // Usar preço atual
          imagemUrl: item.itemRestaurante.imagemUrl,
          descricao: item.itemRestaurante.descricao || 'Item do pedido anterior',
          quantidade: item.quantidade,
          observacoes: item.observacoes || undefined,
          ingredientesRemovidos: item.ingredientesRemovidos || undefined,
          ingredientesAdicionados: item.ingredientesAdicionados || undefined,
          restauranteId: pedidoSelecionado.restaurante.id,
          restauranteNome: pedidoSelecionado.restaurante.nome
        };

        console.log('🛒 Adicionando item ao carrinho:', cartItem);
        addToCart(cartItem);
        itensAdicionados++;
        
      } catch (error) {
        console.error(`❌ Erro ao adicionar item ${item.itemRestaurante.nome}:`, error);
      }
    });
    
    fecharModalPedido();
    
    // Mostrar feedback de sucesso
    const totalItens = pedidoSelecionado.itens.reduce((total, item) => total + item.quantidade, 0);
    
    Alert.alert(
      'Itens Adicionados! 🛒',
      `${totalItens} ${totalItens === 1 ? 'item foi adicionado' : 'itens foram adicionados'} ao carrinho de ${pedidoSelecionado.restaurante.nome}.`,
      [
        { text: 'Continuar Comprando', style: 'cancel' },
        {
          text: 'Ver Carrinho',
          onPress: () => router.push('/carrinho')
        }
      ]
    );
  };

  const navegarParaRestaurante = () => {
    if (!pedidoSelecionado) return;
    
    fecharModalPedido();
    
    // Navegar para o perfil do restaurante
    router.push({
      pathname: '/perfilEmpresa',
      params: {
        id: pedidoSelecionado.restaurante.id.toString(),
        restauranteData: JSON.stringify(pedidoSelecionado.restaurante)
      }
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutCliente();
              clearSession();
              router.replace('/');
            } catch (error) {
              console.error('❌ Erro ao fazer logout:', error);
              // Mesmo com erro, limpar sessão local
              clearSession();
              router.replace('/');
            }
          },
        },
      ]
    );
  };

  // Função para formatar telefone durante digitação
  const handleTelefoneChange = (telefone: string) => {
    // Remover caracteres não numéricos e limitar a 11 dígitos
    const telefoneNumerico = telefone.replace(/\D/g, '').slice(0, 11);
    
    // Formatar telefone: (13) 99608-3999
    let telefoneFormatado = telefoneNumerico;
    if (telefoneNumerico.length >= 2) {
      telefoneFormatado = `(${telefoneNumerico.slice(0, 2)}) ${telefoneNumerico.slice(2)}`;
    }
    if (telefoneNumerico.length >= 7) {
      telefoneFormatado = `(${telefoneNumerico.slice(0, 2)}) ${telefoneNumerico.slice(2, 7)}-${telefoneNumerico.slice(7)}`;
    }
    
    setEditData({ ...editData, telefone: telefoneFormatado });
  };

  const handleBuscarCep = async (cep: string) => {
    // Remover caracteres não numéricos e limitar a 8 dígitos
    const cepNumerico = cep.replace(/\D/g, '').slice(0, 8);
    
    // Formatar CEP com máscara: 12345-678
    const cepFormatado = cepNumerico.length > 5 
      ? `${cepNumerico.slice(0, 5)}-${cepNumerico.slice(5)}`
      : cepNumerico;
    
    // Atualizar o CEP no estado
    setEditData({ ...editData, cep: cepFormatado });
    
    // Se o CEP tem 8 dígitos, buscar dados do endereço
    if (cepNumerico.length === 8) {
      setFetchingCep(true);
      try {
        const endereco = await buscarEnderecoPorCep(cepNumerico);
        setEditData(prev => ({
          ...prev,
          cep: cepFormatado,
          rua: endereco.rua || prev.rua,
          bairro: endereco.bairro || prev.bairro,
          cidade: endereco.cidade || prev.cidade,
          estado: endereco.estado || prev.estado,
        }));
      } catch (error) {
        console.warn('⚠️ Erro ao buscar CEP:', error);
        // Não mostramos erro ao usuário para não interromper a edição
      } finally {
        setFetchingCep(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONCLUIDO':
        return perfilUsuarioStyles.statusConcluido;
      case 'EM_PREPARO':
        return perfilUsuarioStyles.statusEmPreparo;
      case 'NOVO':
        return perfilUsuarioStyles.statusNovo;
      case 'CANCELADO':
        return perfilUsuarioStyles.statusCancelado;
      default:
        return perfilUsuarioStyles.statusNovo;
    }
  };

  const calcularEstatisticas = () => {
    const totalAvaliacoes = avaliacoes.length;
    const mediaAvaliacao = avaliacoes.length > 0 
      ? avaliacoes.reduce((acc, av) => acc + av.nota, 0) / avaliacoes.length 
      : 0;
    
    return {
      totalAvaliacoes,
      mediaAvaliacao: Math.round(mediaAvaliacao * 10) / 10,
    };
  };

  const calcularTotalComPrecosAtuais = (pedido: PedidoResponse) => {
    if (Object.keys(precosAtuais).length === 0) {
      // Se ainda não tem preços atuais, usar original
      return calcularValorTotal(pedido.itens);
    }
    
    return pedido.itens.reduce((total, item) => {
      const precoAtual = precosAtuais[item.itemRestaurante.id] || item.itemRestaurante.preco;
      return total + (item.quantidade * precoAtual);
    }, 0);
  };

  const obterPrecoAtual = (itemId: number, precoOriginal: number) => {
    return precosAtuais[itemId] || precoOriginal;
  };

  const verificarMudancaPreco = (itemId: number, precoOriginal: number) => {
    const precoAtual = precosAtuais[itemId];
    if (!precoAtual) return false;
    return Math.abs(precoAtual - precoOriginal) > 0.01; // Diferença maior que 1 centavo
  };

  if (loading) {
    return (
      <View style={perfilUsuarioStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.verdeFolha} />
        <Text style={perfilUsuarioStyles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={perfilUsuarioStyles.container}>
        <Header 
          logo="Sabore" 
          cartItemCount={itemCount}
          onCartPress={() => router.push('/carrinho')}
        />
        <View style={perfilUsuarioStyles.emptyState}>
          <Text style={perfilUsuarioStyles.emptyIcon}>❌</Text>
          <Text style={perfilUsuarioStyles.emptyText}>Erro ao carregar perfil</Text>
          <TouchableOpacity onPress={carregarDadosUsuario} style={perfilUsuarioStyles.editButton}>
            <Text style={perfilUsuarioStyles.editButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const stats = calcularEstatisticas();
  const ultimoPedido = pedidos.length > 0 ? pedidos[0] : null;

  return (
    <View style={perfilUsuarioStyles.container}>
      <Header 
        logo="Sabore" 
        cartItemCount={itemCount}
        onCartPress={() => router.push('/carrinho')}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        
        {/* Seção do Cabeçalho do Usuário */}
        <View style={perfilUsuarioStyles.headerSection}>
          <View style={perfilUsuarioStyles.avatar}>
            <Text style={perfilUsuarioStyles.avatarText}>
              {userData.nome.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={perfilUsuarioStyles.userName}>{userData.nome}</Text>
          <Text style={perfilUsuarioStyles.userEmail}>{userData.email}</Text>
          {userData.telefoneFormatado && (
            <Text style={[perfilUsuarioStyles.userEmail, { color: colors.cinzaEscuro }]}>
              📞 {userData.telefoneFormatado}
            </Text>
          )}
          {userData.cidadeEstado && (
            <Text style={[perfilUsuarioStyles.userEmail, { color: colors.cinzaEscuro }]}>
              📍 {userData.cidadeEstado}
            </Text>
          )}
          
          <View style={perfilUsuarioStyles.statsContainer}>
            <View style={perfilUsuarioStyles.statItem}>
              <Text style={perfilUsuarioStyles.statNumber}>{stats.totalAvaliacoes}</Text>
              <Text style={perfilUsuarioStyles.statLabel}>Avaliações</Text>
            </View>
            <View style={perfilUsuarioStyles.statItem}>
              <Text style={perfilUsuarioStyles.statNumber}>
                {stats.mediaAvaliacao > 0 ? stats.mediaAvaliacao.toFixed(1) : '0.0'}
              </Text>
              <Text style={perfilUsuarioStyles.statLabel}>Média ⭐</Text>
            </View>
          </View>
          
          <TouchableOpacity onPress={handleEditProfile} style={perfilUsuarioStyles.editButton}>
            <Text style={perfilUsuarioStyles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Seção Refazer Último Pedido */}
        {ultimoPedido && (
          <View style={perfilUsuarioStyles.section}>
            <Text style={perfilUsuarioStyles.sectionTitle}>
              <Text style={perfilUsuarioStyles.sectionIcon}>🔄</Text>
              Refazer Último Pedido
            </Text>
            
            <View style={perfilUsuarioStyles.reorderCard}>
              <View style={perfilUsuarioStyles.reorderHeader}>
                <Text style={perfilUsuarioStyles.reorderTitle}>
                  {ultimoPedido.restaurante.nome}
                </Text>
                <TouchableOpacity 
                  onPress={() => handleRefazerPedido(ultimoPedido)} 
                  style={perfilUsuarioStyles.reorderButton}
                >
                  <Text style={perfilUsuarioStyles.reorderButtonText}>Refazer Pedido</Text>
                </TouchableOpacity>
              </View>
              
              <View style={perfilUsuarioStyles.reorderInfo}>
                <Text style={perfilUsuarioStyles.reorderItems}>
                  {ultimoPedido.itens.map(item => item.itemRestaurante.nome).join(', ')}
                </Text>
                <Text style={perfilUsuarioStyles.reorderTotal}>
                  R$ {ultimoPedido.itens.reduce((total, item) => total + (item.quantidade * item.itemRestaurante.preco), 0).toFixed(2).replace('.', ',')}
                </Text>
              </View>
              
              <Text style={perfilUsuarioStyles.reorderDate}>
                Pedido realizado em {formatarDataPedido(ultimoPedido.criadoEm)}
              </Text>
            </View>
          </View>
        )}

        {/* Seção Histórico de Pedidos */}
        <View style={perfilUsuarioStyles.section}>
          <Text style={perfilUsuarioStyles.sectionTitle}>
            <Text style={perfilUsuarioStyles.sectionIcon}>📋</Text>
            Histórico de Pedidos
          </Text>
          
          {pedidos.length > 0 ? (
            pedidos.map((pedido) => (
              <View key={pedido.id} style={perfilUsuarioStyles.orderCard}>
                <View style={perfilUsuarioStyles.orderHeader}>
                  <Text style={perfilUsuarioStyles.orderRestaurant}>
                    {pedido.restaurante.nome}
                  </Text>
                  <View style={[perfilUsuarioStyles.orderStatus, getStatusColor(pedido.status)]}>
                    <Text style={perfilUsuarioStyles.statusText}>
                      {formatarStatusPedido(pedido.status)}
                    </Text>
                  </View>
                </View>
                
                <View style={{ marginBottom: 8 }}>
                  {pedido.itens.map((item, index) => (
                    <View key={index} style={{ marginBottom: 4 }}>
                      <Text style={perfilUsuarioStyles.orderItems}>
                        {item.quantidade}x {item.itemRestaurante.nome} - R$ {item.itemRestaurante.preco.toFixed(2).replace('.', ',')} cada
                      </Text>
                      {item.observacoes && (
                        <Text style={[perfilUsuarioStyles.orderItems, { fontSize: 12, color: colors.cinzaEscuro, fontStyle: 'italic' }]}>
                          Obs: {item.observacoes}
                        </Text>
                      )}
                      {item.ingredientesRemovidos && (
                        <Text style={[perfilUsuarioStyles.orderItems, { fontSize: 12, color: colors.vermelhoCambuci, fontStyle: 'italic' }]}>
                          Removido: {item.ingredientesRemovidos}
                        </Text>
                      )}
                      {item.ingredientesAdicionados && (
                        <Text style={[perfilUsuarioStyles.orderItems, { fontSize: 12, color: colors.verdeFolha, fontStyle: 'italic' }]}>
                          Adicionado: {item.ingredientesAdicionados}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={perfilUsuarioStyles.orderTotal}>
                    R$ {pedido.itens.reduce((total, item) => total + (item.quantidade * item.itemRestaurante.preco), 0).toFixed(2).replace('.', ',')}
                  </Text>
                  <Text style={perfilUsuarioStyles.orderDate}>
                    {formatarDataPedido(pedido.criadoEm)}
                  </Text>
                </View>

                {/* Botão para ver detalhes do pedido */}
                <TouchableOpacity 
                  onPress={() => handleVerDetalhesPedido(pedido)}
                  style={{
                    backgroundColor: colors.verdeFolha + '15',
                    borderWidth: 1,
                    borderColor: colors.verdeFolha,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    alignSelf: 'flex-start',
                  }}
                >
                  <Text style={{
                    color: colors.verdeFolha,
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}>
                    📋 Ver Detalhes
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={perfilUsuarioStyles.emptyState}>
              <Text style={perfilUsuarioStyles.emptyIcon}>🍽️</Text>
              <Text style={perfilUsuarioStyles.emptyText}>Nenhum pedido encontrado</Text>
              <Text style={perfilUsuarioStyles.emptySubtext}>
                Faça seu primeiro pedido e ele aparecerá aqui!
              </Text>
            </View>
          )}
        </View>

        {/* Seção Minhas Avaliações */}
        <View style={perfilUsuarioStyles.section}>
          <Text style={perfilUsuarioStyles.sectionTitle}>
            <Text style={perfilUsuarioStyles.sectionIcon}>⭐</Text>
            Minhas Avaliações
          </Text>
          
          {avaliacoes.length > 0 ? (
            avaliacoes.map((avaliacao) => (
              <View key={avaliacao.id} style={perfilUsuarioStyles.reviewCard}>
                <View style={perfilUsuarioStyles.reviewHeader}>
                  <Text style={perfilUsuarioStyles.reviewPrato}>
                    {avaliacao.itemRestaurante.nome}
                  </Text>
                  <StarRating rating={avaliacao.nota} size={16} />
                </View>
                {avaliacao.comentario && (
                  <Text style={perfilUsuarioStyles.reviewText}>{avaliacao.comentario}</Text>
                )}
                <Text style={perfilUsuarioStyles.orderDate}>
                  {formatarDataAvaliacao(avaliacao.dataAvaliacao)}
                </Text>
              </View>
            ))
          ) : (
            <View style={perfilUsuarioStyles.emptyState}>
              <Text style={perfilUsuarioStyles.emptyIcon}>⭐</Text>
              <Text style={perfilUsuarioStyles.emptyText}>Nenhuma avaliação encontrada</Text>
              <Text style={perfilUsuarioStyles.emptySubtext}>
                Avalie os pratos que você experimentou!
              </Text>
            </View>
          )}
        </View>

        {/* Seção Configurações */}
        <View style={perfilUsuarioStyles.section}>
          <Text style={perfilUsuarioStyles.sectionTitle}>
            <Text style={perfilUsuarioStyles.sectionIcon}>⚙️</Text>
            Configurações
          </Text>
          
          <TouchableOpacity style={perfilUsuarioStyles.configItem}>
            <Text style={perfilUsuarioStyles.sectionIcon}>🔔</Text>
            <Text style={[perfilUsuarioStyles.configText, { color: colors.verdeFolha }]}>
              Notificações
            </Text>
            <Icon name="chevron-right" size={16} color={colors.cinzaMedio} />
          </TouchableOpacity>
          
          <TouchableOpacity style={perfilUsuarioStyles.configItem}>
            <Text style={perfilUsuarioStyles.sectionIcon}>🔒</Text>
            <Text style={[perfilUsuarioStyles.configText, { color: colors.verdeFolha }]}>
              Privacidade
            </Text>
            <Icon name="chevron-right" size={16} color={colors.cinzaMedio} />
          </TouchableOpacity>
          
          <TouchableOpacity style={perfilUsuarioStyles.configItem}>
            <Text style={perfilUsuarioStyles.sectionIcon}>💳</Text>
            <Text style={[perfilUsuarioStyles.configText, { color: colors.verdeFolha }]}>
              Métodos de Pagamento
            </Text>
            <Icon name="chevron-right" size={16} color={colors.cinzaMedio} />
          </TouchableOpacity>
          
          <TouchableOpacity style={perfilUsuarioStyles.configItem}>
            <Text style={perfilUsuarioStyles.sectionIcon}>📍</Text>
            <Text style={[perfilUsuarioStyles.configText, { color: colors.verdeFolha }]}>
              Endereços Salvos
            </Text>
            <Icon name="chevron-right" size={16} color={colors.cinzaMedio} />
          </TouchableOpacity>
          
          <TouchableOpacity style={perfilUsuarioStyles.configItem}>
            <Text style={perfilUsuarioStyles.sectionIcon}>❓</Text>
            <Text style={[perfilUsuarioStyles.configText, { color: colors.verdeFolha }]}>
              Ajuda e Suporte
            </Text>
            <Icon name="chevron-right" size={16} color={colors.cinzaMedio} />
          </TouchableOpacity>
          
          <TouchableOpacity style={perfilUsuarioStyles.configItem} onPress={handleLogout}>
            <Text style={perfilUsuarioStyles.sectionIcon}>🚪</Text>
            <Text style={[perfilUsuarioStyles.configText, perfilUsuarioStyles.logoutText]}>
              Sair da Conta
            </Text>
            <Icon name="chevron-right" size={16} color={colors.vermelhoErro} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Edição */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={perfilUsuarioStyles.modalContainer}>
          <View style={perfilUsuarioStyles.modalContent}>
            <View style={perfilUsuarioStyles.modalHeader}>
              <Text style={perfilUsuarioStyles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)} 
                style={perfilUsuarioStyles.closeButton}
              >
                <Icon name="times" size={24} color={colors.verdeFolha} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Seção: Dados Pessoais */}
              <Text style={perfilUsuarioStyles.sectionHeader}>📋 Dados Pessoais</Text>
              
              <View style={perfilUsuarioStyles.formRow}>
                <View style={perfilUsuarioStyles.formColumn}>
                  <View style={perfilUsuarioStyles.inputContainer}>
                    <Text style={perfilUsuarioStyles.inputLabel}>Nome</Text>
                    <TextInput
                      style={perfilUsuarioStyles.input}
                      value={editData.nome}
                      onChangeText={(text) => setEditData({ ...editData, nome: text })}
                      placeholder="Digite seu nome"
                      placeholderTextColor={colors.cinzaMedio}
                    />
                  </View>
                </View>
                <View style={perfilUsuarioStyles.formColumn}>
                  <View style={perfilUsuarioStyles.inputContainer}>
                    <Text style={perfilUsuarioStyles.inputLabel}>Telefone</Text>
                    <TextInput
                      style={perfilUsuarioStyles.input}
                      value={editData.telefone}
                      onChangeText={handleTelefoneChange}
                      placeholder="Digite seu telefone"
                      placeholderTextColor={colors.cinzaMedio}
                      keyboardType="phone-pad"
                      maxLength={15}
                    />
                  </View>
                </View>
              </View>

              <View style={perfilUsuarioStyles.formRow}>
                <View style={perfilUsuarioStyles.formColumn}>
                  <View style={perfilUsuarioStyles.inputContainer}>
                    <Text style={perfilUsuarioStyles.readOnlyLabel}>CPF</Text>
                    <TextInput
                      style={perfilUsuarioStyles.inputReadOnly}
                      value={userData.cpfFormatado || 'CPF não informado'}
                      editable={false}
                      placeholder="CPF não informado"
                      placeholderTextColor={colors.cinzaMedio}
                    />
                  </View>
                </View>
                <View style={perfilUsuarioStyles.formColumn}>
                  <View style={perfilUsuarioStyles.inputContainer}>
                    <Text style={perfilUsuarioStyles.inputLabel}>E-mail</Text>
                    <TextInput
                      style={perfilUsuarioStyles.input}
                      value={editData.email}
                      onChangeText={(text) => setEditData({ ...editData, email: text })}
                      placeholder="Digite seu e-mail"
                      placeholderTextColor={colors.cinzaMedio}
                      keyboardType="email-address"
                    />
                  </View>
                </View>
              </View>

              <View style={perfilUsuarioStyles.divider} />

              {/* Seção: Endereço */}
              <Text style={perfilUsuarioStyles.sectionHeader}>📍 Endereço</Text>

              <View style={perfilUsuarioStyles.formRow}>
                <View style={perfilUsuarioStyles.formColumn}>
                  <View style={perfilUsuarioStyles.inputContainer}>
                    <Text style={perfilUsuarioStyles.inputLabel}>CEP</Text>
                    <TextInput
                      style={perfilUsuarioStyles.input}
                      value={editData.cep}
                      onChangeText={handleBuscarCep}
                      placeholder="Digite seu CEP"
                      placeholderTextColor={colors.cinzaMedio}
                      keyboardType="numeric"
                      maxLength={9}
                    />
                    {fetchingCep && (
                      <ActivityIndicator 
                        size="small" 
                        color={colors.verdeFolha} 
                        style={{ position: 'absolute', right: 12, top: 40 }}
                      />
                    )}
                  </View>
                </View>
                <View style={perfilUsuarioStyles.formColumn}>
                  <View style={perfilUsuarioStyles.inputContainer}>
                    <Text style={perfilUsuarioStyles.inputLabel}>Estado</Text>
                    <TextInput
                      style={perfilUsuarioStyles.input}
                      value={editData.estado}
                      onChangeText={(text) => setEditData({ ...editData, estado: text })}
                      placeholder="UF"
                      placeholderTextColor={colors.cinzaMedio}
                      maxLength={2}
                    />
                  </View>
                </View>
              </View>

              <View style={perfilUsuarioStyles.inputContainer}>
                <Text style={perfilUsuarioStyles.inputLabel}>Rua/Logradouro</Text>
                <TextInput
                  style={perfilUsuarioStyles.input}
                  value={editData.rua}
                  onChangeText={(text) => setEditData({ ...editData, rua: text })}
                  placeholder="Digite sua rua"
                  placeholderTextColor={colors.cinzaMedio}
                />
              </View>

              <View style={perfilUsuarioStyles.formRow}>
                <View style={perfilUsuarioStyles.formColumn}>
                  <View style={perfilUsuarioStyles.inputContainer}>
                    <Text style={perfilUsuarioStyles.inputLabel}>Bairro</Text>
                    <TextInput
                      style={perfilUsuarioStyles.input}
                      value={editData.bairro}
                      onChangeText={(text) => setEditData({ ...editData, bairro: text })}
                      placeholder="Digite seu bairro"
                      placeholderTextColor={colors.cinzaMedio}
                    />
                  </View>
                </View>
                <View style={perfilUsuarioStyles.formColumn}>
                  <View style={perfilUsuarioStyles.inputContainer}>
                    <Text style={perfilUsuarioStyles.inputLabel}>Número</Text>
                    <TextInput
                      style={perfilUsuarioStyles.input}
                      value={editData.numero}
                      onChangeText={(text) => setEditData({ ...editData, numero: text })}
                      placeholder="Nº"
                      placeholderTextColor={colors.cinzaMedio}
                    />
                  </View>
                </View>
              </View>

              <View style={perfilUsuarioStyles.inputContainer}>
                <Text style={perfilUsuarioStyles.inputLabel}>Cidade</Text>
                <TextInput
                  style={perfilUsuarioStyles.input}
                  value={editData.cidade}
                  onChangeText={(text) => setEditData({ ...editData, cidade: text })}
                  placeholder="Digite sua cidade"
                  placeholderTextColor={colors.cinzaMedio}
                />
              </View>

              <View style={perfilUsuarioStyles.divider} />

              {/* Seção: Preferências (somente leitura) */}
              <Text style={perfilUsuarioStyles.sectionHeader}>⚙️ Preferências de Conta</Text>
              <Text style={{ 
                color: colors.cinzaMedio, 
                fontSize: 12, 
                textAlign: 'center', 
                marginBottom: 16,
                fontStyle: 'italic' 
              }}>
                Estas configurações não podem ser alteradas aqui
              </Text>

              <View style={perfilUsuarioStyles.inputContainer}>
                <Text style={perfilUsuarioStyles.readOnlyLabel}>📋 Aceita Política de Dados</Text>
                <Text style={[perfilUsuarioStyles.inputReadOnly, { 
                  color: userData?.aceitaProtecaoDados ? colors.verdeFolha : colors.vermelhoCambuci,
                  fontWeight: 'bold'
                }]}>
                  {userData?.aceitaProtecaoDados ? '✅ Aceito' : '❌ Não Aceito'}
                </Text>
              </View>

              <View style={perfilUsuarioStyles.inputContainer}>
                <Text style={perfilUsuarioStyles.readOnlyLabel}>📧 Aceita Marketing</Text>
                <Text style={[perfilUsuarioStyles.inputReadOnly, { 
                  color: userData?.aceitaMarketing ? colors.verdeFolha : colors.cinzaMedio,
                  fontWeight: 'bold'
                }]}>
                  {userData?.aceitaMarketing ? '✅ Aceito' : '❌ Não Aceito'}
                </Text>
              </View>

              <View style={perfilUsuarioStyles.inputContainer}>
                <Text style={perfilUsuarioStyles.readOnlyLabel}>🤝 Aceita Melhoria de Atendimento</Text>
                <Text style={[perfilUsuarioStyles.inputReadOnly, { 
                  color: userData?.aceitaAtendimento ? colors.verdeFolha : colors.cinzaMedio,
                  fontWeight: 'bold'
                }]}>
                  {userData?.aceitaAtendimento ? '✅ Aceito' : '❌ Não Aceito'}
                </Text>
              </View>

              <TouchableOpacity 
                onPress={handleSaveProfile} 
                style={perfilUsuarioStyles.saveButton}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color={colors.branco} size="small" />
                ) : (
                  <Text style={perfilUsuarioStyles.saveButtonText}>💾 Salvar Alterações</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Detalhes do Pedido */}
      <Modal
        visible={modalPedidoVisible}
        transparent
        animationType="fade"
        onRequestClose={fecharModalPedido}
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
            {pedidoSelecionado && (
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
                  <Text style={{ 
                    color: colors.verdeFolha, 
                    fontWeight: 'bold', 
                    fontSize: 28, 
                    marginBottom: 8, 
                    textAlign: 'center', 
                    letterSpacing: 1 
                  }}>
                    {modoVisualizacao === 'detalhes' ? '📋 Detalhes do Pedido' : '🔄 Refazer Pedido'}
                  </Text>
                  
                  <Text style={{ 
                    color: colors.verdeFolha, 
                    fontSize: 20, 
                    fontWeight: 'bold', 
                    marginBottom: 8, 
                    textAlign: 'center' 
                  }}>
                    🏪 {pedidoSelecionado.restaurante.nome}
                  </Text>
                  
                  <Text style={{ 
                    color: colors.preto, 
                    fontSize: 16, 
                    marginBottom: 12, 
                    textAlign: 'center' 
                  }}>
                    📅 Pedido realizado em {formatarDataPedido(pedidoSelecionado.criadoEm)}
                  </Text>
                  
                  <View style={[perfilUsuarioStyles.orderStatus, getStatusColor(pedidoSelecionado.status), { alignSelf: 'center' }]}>
                    <Text style={perfilUsuarioStyles.statusText}>
                      {formatarStatusPedido(pedidoSelecionado.status)}
                    </Text>
                  </View>
                </View>

                {/* Lista de Itens */}
                <View style={{ width: '100%', marginBottom: 24 }}>
                  <Text style={{ 
                    color: colors.verdeFolha, 
                    fontWeight: 'bold', 
                    fontSize: 18, 
                    marginBottom: 16, 
                    textAlign: 'center' 
                  }}>
                    🍽️ Itens do Pedido
                  </Text>

                  {loadingPrecos ? (
                    <View style={{ alignItems: 'center', padding: 20 }}>
                      <ActivityIndicator size="large" color={colors.verdeFolha} />
                      <Text style={{ color: colors.verdeFolha, marginTop: 8, fontSize: 14 }}>
                        Buscando preços atuais...
                      </Text>
                    </View>
                  ) : (
                    pedidoSelecionado.itens.map((item, index) => {
                      const precoAtual = obterPrecoAtual(item.itemRestaurante.id, item.itemRestaurante.preco);
                      const precoMudou = verificarMudancaPreco(item.itemRestaurante.id, item.itemRestaurante.preco);
                      const precoSubiu = precoAtual > item.itemRestaurante.preco;
                      const precoDesceu = precoAtual < item.itemRestaurante.preco;
                      
                      return (
                        <View
                          key={`${item.itemRestaurante.id}-${index}`}
                          style={{
                            backgroundColor: colors.branco,
                            borderWidth: 1.5,
                            borderColor: precoMudou ? (precoSubiu ? colors.vermelhoErro : colors.verdeSucesso) : colors.verdeFolha,
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 12,
                            shadowColor: colors.verdeFolha,
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2,
                          }}
                        >
                          {precoMudou && (
                            <View style={{
                              position: 'absolute',
                              top: -1,
                              right: -1,
                              backgroundColor: precoSubiu ? colors.vermelhoErro : colors.verdeSucesso,
                              borderRadius: 12,
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              zIndex: 1,
                            }}>
                              <Text style={{
                                color: colors.branco,
                                fontSize: 10,
                                fontWeight: 'bold',
                              }}>
                                {precoSubiu ? '↗️ SUBIU' : '↘️ DESCEU'}
                              </Text>
                            </View>
                          )}
                          
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <View style={{ flex: 1 }}>
                              <Text style={{
                                color: colors.verdeFolha,
                                fontSize: 16,
                                fontWeight: 'bold',
                                marginBottom: 4,
                              }}>
                                {item.quantidade}x {item.itemRestaurante.nome}
                              </Text>
                              
                              {item.itemRestaurante.descricao && (
                                <Text style={{
                                  color: colors.preto,
                                  fontSize: 14,
                                  marginBottom: 4,
                                  lineHeight: 20,
                                }}>
                                  {item.itemRestaurante.descricao}
                                </Text>
                              )}
                              
                              <View style={{ marginBottom: 8 }}>
                                {precoMudou ? (
                                  <View>
                                    <Text style={{
                                      color: colors.cinzaEscuro,
                                      fontSize: 12,
                                      textDecorationLine: 'line-through',
                                      opacity: 0.7,
                                    }}>
                                      Preço original: R$ {item.itemRestaurante.preco.toFixed(2).replace('.', ',')} cada
                                    </Text>
                                    <Text style={{
                                      color: precoSubiu ? colors.vermelhoErro : colors.verdeSucesso,
                                      fontSize: 14,
                                      fontWeight: 'bold',
                                    }}>
                                      Preço atual: R$ {precoAtual.toFixed(2).replace('.', ',')} cada
                                    </Text>
                                  </View>
                                ) : (
                                  <Text style={{
                                    color: colors.preto,
                                    fontSize: 14,
                                    opacity: 0.8,
                                  }}>
                                    R$ {precoAtual.toFixed(2).replace('.', ',')} cada
                                  </Text>
                                )}
                              </View>
                              
                              {item.observacoes && (
                                <View style={{
                                  backgroundColor: colors.amareloOuro + '20',
                                  borderLeftWidth: 3,
                                  borderLeftColor: colors.amareloOuro,
                                  paddingLeft: 8,
                                  paddingVertical: 4,
                                  marginTop: 8,
                                  borderRadius: 4,
                                }}>
                                  <Text style={{
                                    color: colors.preto,
                                    fontSize: 12,
                                    fontStyle: 'italic',
                                  }}>
                                    💬 Obs: {item.observacoes}
                                  </Text>
                                </View>
                              )}
                            </View>

                            <View style={{ alignItems: 'flex-end' }}>
                              <Text style={{
                                color: colors.verdeFolha,
                                fontSize: 16,
                                fontWeight: 'bold',
                                marginLeft: 12,
                              }}>
                                R$ {(item.quantidade * precoAtual).toFixed(2).replace('.', ',')}
                              </Text>
                              
                              {precoMudou && (
                                <Text style={{
                                  color: colors.cinzaEscuro,
                                  fontSize: 11,
                                  textDecorationLine: 'line-through',
                                  opacity: 0.7,
                                  marginTop: 2,
                                }}>
                                  Era: R$ {(item.quantidade * item.itemRestaurante.preco).toFixed(2).replace('.', ',')}
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                      );
                    })
                  )}
                </View>

                {/* Total do Pedido */}
                {!loadingPrecos && (
                  <View style={{
                    width: '100%',
                    backgroundColor: colors.verdeFolha,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 32,
                    borderWidth: 1.5,
                    borderColor: colors.verdeFolha,
                  }}>
                    {(() => {
                      const totalOriginal = calcularValorTotal(pedidoSelecionado.itens);
                      const totalAtual = calcularTotalComPrecosAtuais(pedidoSelecionado);
                      const totalMudou = Math.abs(totalAtual - totalOriginal) > 0.01;
                      
                      return totalMudou ? (
                        <View>
                          <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 8,
                          }}>
                            <Text style={{
                              color: colors.branco,
                              fontSize: 16,
                              fontWeight: 'bold',
                            }}>
                              💰 Total Atualizado:
                            </Text>
                            <Text style={{
                              color: colors.branco,
                              fontSize: 20,
                              fontWeight: 'bold',
                            }}>
                              R$ {totalAtual.toFixed(2).replace('.', ',')}
                            </Text>
                          </View>
                          
                          <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: 8,
                            borderTopWidth: 1,
                            borderTopColor: colors.branco + '40',
                          }}>
                            <Text style={{
                              color: colors.branco,
                              fontSize: 14,
                              opacity: 0.8,
                            }}>
                              Total original era:
                            </Text>
                            <Text style={{
                              color: colors.branco,
                              fontSize: 14,
                              opacity: 0.8,
                              textDecorationLine: 'line-through',
                            }}>
                              R$ {totalOriginal.toFixed(2).replace('.', ',')}
                            </Text>
                          </View>
                          
                          <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 8,
                          }}>
                            <Text style={{
                              color: colors.branco,
                              fontSize: 12,
                              fontWeight: 'bold',
                              backgroundColor: colors.branco + '20',
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 12,
                            }}>
                              {totalAtual > totalOriginal 
                                ? `↗️ +R$ ${(totalAtual - totalOriginal).toFixed(2).replace('.', ',')}` 
                                : `↘️ -R$ ${(totalOriginal - totalAtual).toFixed(2).replace('.', ',')}`
                              }
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                          <Text style={{
                            color: colors.branco,
                            fontSize: 18,
                            fontWeight: 'bold',
                          }}>
                            💰 Total do Pedido:
                          </Text>
                          <Text style={{
                            color: colors.branco,
                            fontSize: 20,
                            fontWeight: 'bold',
                          }}>
                            R$ {totalAtual.toFixed(2).replace('.', ',')}
                          </Text>
                        </View>
                      );
                    })()}
                  </View>
                )}

                {/* Botões de Ação */}
                {modoVisualizacao === 'detalhes' ? (
                  // Modo apenas visualização - só botão Fechar
                  <View style={{ width: '100%' }}>
                    <TouchableOpacity 
                      onPress={fecharModalPedido}
                      style={{ 
                        backgroundColor: colors.verdeFolha,
                        paddingVertical: 16,
                        paddingHorizontal: 32,
                        borderRadius: 12,
                        alignItems: 'center',
                        borderWidth: 1.5,
                        borderColor: colors.verdeFolha
                      }}
                    >
                      <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 16 }}>Fechar</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  // Modo refazer pedido - botões Fechar e Adicionar ao Carrinho
                  <View style={{ flexDirection: 'row', gap: 16, width: '100%' }}>
                    <TouchableOpacity 
                      onPress={fecharModalPedido}
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
                      <Text style={{ color: colors.marromFeijao, fontWeight: 'bold', fontSize: 16 }}>Fechar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={adicionarPedidoAoCarrinho}
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
                      <Text style={{ color: colors.branco, fontWeight: 'bold', fontSize: 16 }}>🛒 Adicionar ao Carrinho</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PerfilUsuario;
