import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import { indexStyles } from '../style/indexStyles';
import { colors } from '../style/colors';
import { useCart, calculateCartTotal } from '../contexts/CartContext';
import { useAuthSession } from '../contexts/AuthContext';
import { criarPedido, validarPedido, formatarStatusPedido, formatarDataPedido } from '../api/pedido';
import { toast } from '../hooks/use-toast';
import { API_BASE_URL } from '../api/restaurante';

const Carrinho = () => {
  const router = useRouter();
  const { 
    items: carrinho, 
    itemCount, 
    restauranteNome,
    removeItem, 
    updateQuantity, 
    clearCart, 
    getOrderData 
  } = useCart();
  const { session, isAuthenticated } = useAuthSession();
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<any>(null);

  // Debug: Log do estado do carrinho
  React.useEffect(() => {
    console.log('🛒 === DEBUG DO CARRINHO ===');
    console.log('📦 Itens no carrinho:', carrinho);
    console.log('🔢 Total de itens:', itemCount);
    console.log('🏪 Nome do restaurante:', restauranteNome);
    console.log('🔐 Autenticado:', isAuthenticated);
    console.log('👤 Sessão:', session);
    console.log('🎫 Token presente:', !!session?.token);
    
    // Debug específico para itens vindos do refazer pedido
    if (carrinho.length > 0) {
      console.log('🔄 === ANÁLISE DOS ITENS ===');
      carrinho.forEach((item, index) => {
        console.log(`📋 Item ${index + 1}:`, {
          nome: item.nome,
          preco: item.preco,
          quantidade: item.quantidade,
          restaurante: item.restauranteNome,
          descricao: item.descricao,
          observacoes: item.observacoes,
          isFromPreviousOrder: item.descricao === 'Item do pedido anterior'
        });
      });
    }
  }, [carrinho, itemCount, restauranteNome, isAuthenticated, session]);

  const calcularTotal = () => {
    return calculateCartTotal(carrinho);
  };

  const atualizarQuantidade = (cartId: string, novaQuantidade: number) => {
    updateQuantity(cartId, novaQuantidade);
  };

  const removerItem = (cartId: string, nomeItem: string) => {
    console.log('🗑️ === TENTATIVA DE REMOVER ITEM ===');
    console.log('🔍 CartId:', cartId);
    console.log('📦 Nome do item:', nomeItem);
    console.log('🛒 Função removeItem disponível:', typeof removeItem);
    
    // Teste direto sem Alert primeiro
    console.log('🧪 Testando remoção direta sem Alert...');
    try {
      removeItem(cartId);
      console.log('✅ Remoção direta funcionou!');
      return;
    } catch (error) {
      console.error('❌ Erro na remoção direta:', error);
    }
    
    // Se chegou aqui, usar Alert
    console.log('📱 Mostrando Alert de confirmação...');
    Alert.alert(
      'Remover Item',
      `Tem certeza que deseja remover "${nomeItem}" do carrinho?`,
      [
        { 
          text: 'Cancelar', 
          style: 'cancel',
          onPress: () => console.log('❌ Usuário cancelou remoção')
        },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => {
            console.log('✅ Usuário confirmou remoção do item:', cartId);
            try {
              removeItem(cartId);
              console.log('✅ Função removeItem chamada com sucesso via Alert');
            } catch (error) {
              console.error('❌ Erro ao chamar removeItem via Alert:', error);
            }
          }
        }
      ]
    );
  };

  const limparCarrinho = () => {
    console.log('🗑️ === TENTATIVA DE LIMPAR CARRINHO ===');
    console.log('📦 Itens atuais no carrinho:', carrinho.length);
    console.log('🛒 Função clearCart disponível:', typeof clearCart);
    
    // Teste direto sem Alert primeiro
    console.log('🧪 Testando limpeza direta sem Alert...');
    try {
      clearCart();
      console.log('✅ Limpeza direta funcionou!');
      return;
    } catch (error) {
      console.error('❌ Erro na limpeza direta:', error);
    }
    
    // Se chegou aqui, usar Alert
    console.log('📱 Mostrando Alert de confirmação...');
    Alert.alert(
      'Limpar Carrinho',
      'Tem certeza que deseja remover todos os itens do carrinho?',
      [
        { 
          text: 'Cancelar', 
          style: 'cancel',
          onPress: () => console.log('❌ Usuário cancelou limpeza')
        },
        { 
          text: 'Limpar', 
          style: 'destructive',
          onPress: () => {
            console.log('✅ Usuário confirmou limpeza do carrinho');
            try {
              clearCart();
              console.log('✅ Função clearCart chamada com sucesso via Alert');
            } catch (error) {
              console.error('❌ Erro ao chamar clearCart via Alert:', error);
            }
          }
        }
      ]
    );
  };

  const finalizarPedido = async () => {
    console.log('🚀 === INICIANDO FINALIZAÇÃO DO PEDIDO ===');
    console.log('📦 Itens no carrinho:', carrinho.length);
    console.log('🔐 Usuário autenticado:', isAuthenticated);
    console.log('👤 Session completa:', session);
    console.log('🎫 Token presente:', !!session?.token);
    console.log('🍪 Usando cookies:', !!session?.useCookies);
    
    // Verificar se carrinho não está vazio
    if (carrinho.length === 0) {
      console.log('❌ Carrinho vazio - parando execução');
      Alert.alert('Carrinho Vazio', 'Adicione itens ao carrinho antes de finalizar o pedido.');
      return;
    }

    // Verificar se usuário está autenticado (com verificação mais rigorosa)
    if (!isAuthenticated || (!session?.token && !session?.useCookies)) {
      console.log('❌ Usuário não autenticado - parando execução');
      console.log('🔍 Detalhes da sessão:', {
        session: session,
        isAuthenticated: isAuthenticated,
        hasToken: !!session?.token,
        useCookies: !!session?.useCookies
      });
      
      Alert.alert(
        'Login Necessário', 
        'Você precisa estar logado para fazer pedidos.\n\nSua sessão pode ter expirado. Por favor, faça login novamente.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Fazer Login', 
            onPress: () => router.push('/login')
          }
        ]
      );
      return;
    }

    // Obter dados do pedido
    console.log('📋 Obtendo dados do pedido...');
    const orderData = getOrderData();
    console.log('📋 Dados obtidos:', orderData);
    
    if (!orderData) {
      console.log('❌ Dados do pedido não encontrados - parando execução');
      Alert.alert('Erro', 'Não foi possível obter os dados do pedido.');
      return;
    }

    // Validar pedido
    console.log('✅ Validando pedido...');
    const validation = validarPedido(orderData);
    console.log('✅ Resultado da validação:', validation);
    
    if (!validation.valido) {
      console.log('❌ Pedido inválido:', validation.erros);
      Alert.alert(
        'Pedido Inválido',
        validation.erros.join('\n'),
        [{ text: 'OK' }]
      );
      return;
    }

    // Confirmar pedido
    console.log('✅ Mostrando confirmação do pedido...');
    console.log('📋 Dados para confirmação:', {
      restaurante: restauranteNome,
      itens: carrinho.length,
      total: calcularTotal().toFixed(2),
      autenticacao: session?.token ? 'JWT Token' : session?.useCookies ? 'Cookies' : 'Nenhuma'
    });
    
    // Usar modal customizado em vez de Alert.alert
    console.log('🔄 Abrindo modal de confirmação...');
    setPendingOrderData(orderData);
    setShowConfirmModal(true);
  };

  const confirmarPedido = () => {
    console.log('✅ === USUÁRIO CONFIRMOU O PEDIDO ===');
    console.log('🔄 Chamando função enviarPedido...');
    setShowConfirmModal(false);
    if (pendingOrderData) {
      enviarPedido(pendingOrderData);
    }
  };

  const cancelarPedido = () => {
    console.log('❌ Usuário cancelou o pedido');
    setShowConfirmModal(false);
    setPendingOrderData(null);
  };

  const enviarPedido = async (orderData: any) => {
    console.log('🚀 === FUNÇÃO ENVIAR PEDIDO CHAMADA ===');
    console.log('🔐 isAuthenticated:', isAuthenticated);
    console.log('👤 session:', session);
    console.log('📧 Email na sessão:', session?.email);
    console.log('🍪 Usando cookies:', session?.useCookies);
    console.log('🎫 Tem token:', !!session?.token);
    
    if (!isAuthenticated) {
      console.log('❌ Não autenticado - saindo da função');
      Alert.alert(
        'Login Necessário',
        'Você precisa estar logado para fazer pedidos.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Fazer Login', 
            onPress: () => router.push('/login')
          }
        ]
      );
      return;
    }

    try {
      setIsSubmittingOrder(true);
      console.log('📤 === INICIANDO ENVIO DO PEDIDO ===');
      console.log('📤 Dados do pedido:', orderData);
      console.log('🔐 Método de autenticação:', session?.token ? 'JWT Token' : 'Cookies');
      console.log('🌐 API_BASE_URL:', API_BASE_URL);
      console.log('🔗 URL completa:', `${API_BASE_URL}/pedidos`);

      // Chamar função de criação de pedido
      const pedidoCriado = await criarPedido(orderData, session?.token);
      
      console.log('✅ Pedido criado com sucesso:', pedidoCriado);
      
      // Limpar carrinho
      clearCart();
      
      // Mostrar sucesso
      Alert.alert(
        'Pedido Finalizado!', 
        `Seu pedido #${pedidoCriado.id} foi enviado com sucesso!\n\nStatus: ${formatarStatusPedido(pedidoCriado.status)}`,
        [
          { 
            text: 'Ver Meus Pedidos', 
            onPress: () => router.push('/pedidos')
          },
          { text: 'OK' }
        ]
      );
      
      toast({
        title: "Pedido Enviado!",
        description: `Pedido #${pedidoCriado.id} foi criado com sucesso.`,
      });

    } catch (error) {
      console.error('❌ Erro ao enviar pedido:', error);
      
      let errorMessage = 'Erro desconhecido ao criar pedido';
      let showLoginOption = false;
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Verificar se é erro de autenticação
        if (errorMessage.includes('não autorizada') || 
            errorMessage.includes('Sessão expirada') ||
            errorMessage.includes('401')) {
          showLoginOption = true;
        }
      }
      
      Alert.alert(
        'Erro ao Finalizar Pedido',
        errorMessage,
        showLoginOption ? [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Fazer Login', 
            onPress: () => router.push('/login')
          }
        ] : [{ text: 'OK' }]
      );
      
      toast({
        title: "Erro no Pedido",
        description: errorMessage,
      });
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <View style={indexStyles.main}>
      <Header 
        logo="Saborê" 
        cartItemCount={itemCount}
        onCartPress={() => router.push('/carrinho')}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: colors.branco }]}> 
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.verdeFolha }]}>🛒 Meu Carrinho</Text>
          {carrinho.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                console.log('🔘 Botão de limpar carrinho clicado!');
                console.log('📦 Itens no carrinho:', carrinho.length);
                limparCarrinho();
              }} 
              style={[styles.limparButton, { backgroundColor: colors.vermelhoCambuci }]}
            > 
              <Text style={[styles.limparText, { color: colors.branco }]}>Limpar Carrinho</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Mostrar restaurante quando há itens */}
        {carrinho.length > 0 && restauranteNome && (
          <View style={[styles.restaurantInfo, { backgroundColor: colors.branco, borderColor: colors.verdeFolha }]}>
            <Text style={[styles.restaurantLabel, { color: colors.verdeFolha }]}>🏪 Restaurante:</Text>
            <Text style={[styles.restaurantName, { color: colors.marromFeijao }]}>{restauranteNome}</Text>
          </View>
        )}

        {carrinho.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartIcon}>🛒</Text>
            <Text style={[styles.emptyCartTitle, { color: colors.amareloOuro }]}>Carrinho Vazio</Text>
            <Text style={[styles.emptyCartText, { color: colors.preto + '99' }]}>Adicione alguns pratos deliciosos ao seu carrinho!</Text>
            <TouchableOpacity 
              onPress={() => router.push('/indexEmpresas')}
              style={[styles.explorarButton, { backgroundColor: colors.verdeFolha }]}
            >
              <Text style={[styles.explorarButtonText, { color: colors.branco }]}>Explorar Restaurantes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Lista de Itens */}
            <View style={styles.itemsContainer}>
              {carrinho.map((item) => {
                // Determinar imagem do item
                const itemImage = item.imagemUrl 
                  ? { uri: item.imagemUrl } 
                  : require('../assets/pratos/prato1.png'); // Imagem padrão

                return (
                  <View key={item.cartId} style={[styles.itemCard, { backgroundColor: colors.branco, borderColor: colors.marromFeijao, borderWidth: 1.5 }]}> 
                    <Image source={itemImage} style={styles.itemImage} />
                    
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, { color: colors.verdeFolha }]}>{item.nome}</Text>
                      <Text style={[styles.itemRestaurant, { color: colors.marromFeijao }]}>{item.restauranteNome}</Text>
                      <Text style={[styles.itemPrice, { color: colors.amareloOuro }]}>R$ {item.preco.toFixed(2).replace('.', ',')}</Text>
                      
                      {/* Descrição do item */}
                      {item.descricao && (
                        <Text style={[styles.itemDescription, { color: colors.preto }]}>
                          {item.descricao === 'Item do pedido anterior' ? '🔄 ' : ''}{item.descricao}
                        </Text>
                      )}
                      
                      {/* Ingredientes Removidos */}
                      {item.ingredientesRemovidos && (
                        <View style={styles.ingredientsContainer}>
                          <Text style={[styles.ingredientsLabel, { color: colors.vermelhoCambuci }]}>Removidos:</Text>
                          <Text style={[styles.ingredientRemoved, { color: colors.vermelhoCambuci }]}>• {item.ingredientesRemovidos}</Text>
                        </View>
                      )}

                      {/* Ingredientes Adicionados */}
                      {item.ingredientesAdicionados && (
                        <View style={styles.ingredientsContainer}>
                          <Text style={[styles.ingredientsLabel, { color: colors.verdeFolha }]}>Adicionados:</Text>
                          <Text style={[styles.ingredientAdded, { color: colors.verdeFolha }]}>• {item.ingredientesAdicionados}</Text>
                        </View>
                      )}

                      {/* Observações */}
                      {item.observacoes && (
                        <View style={styles.observationsContainer}>
                          <Text style={[styles.observationsLabel, { color: colors.azulRio }]}>Observações:</Text>
                          <Text style={[styles.observationsText, { color: colors.azulRio }]}>{item.observacoes}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.itemActions}>
                      {/* Controle de Quantidade */}
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity 
                          onPress={() => atualizarQuantidade(item.cartId, item.quantidade - 1)}
                          style={[styles.quantityButton, { backgroundColor: colors.marromFeijao }]}
                        >
                          <Text style={[styles.quantityButtonText, { color: colors.branco }]}>-</Text>
                        </TouchableOpacity>
                        <Text style={[styles.quantityText, { color: colors.marromFeijao }]}>{item.quantidade}</Text>
                        <TouchableOpacity 
                          onPress={() => atualizarQuantidade(item.cartId, item.quantidade + 1)}
                          style={[styles.quantityButton, { backgroundColor: colors.verdeFolha }]}
                        >
                          <Text style={[styles.quantityButtonText, { color: colors.branco }]}>+</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Botão Remover */}
                      <TouchableOpacity 
                        onPress={() => {
                          console.log('🔘 Botão de remover item clicado!');
                          console.log('🔍 CartId do item:', item.cartId);
                          console.log('📦 Nome do item:', item.nome);
                          removerItem(item.cartId, item.nome);
                        }}
                        style={[styles.removeButton, { backgroundColor: colors.vermelhoCambuci }]}
                      >
                        <Text style={[styles.removeButtonText, { color: colors.branco }]}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Resumo do Pedido */}
            <View style={[styles.summaryCard, { backgroundColor: colors.branco, borderColor: colors.marromFeijao, borderWidth: 1.5 }]}> 
              <Text style={[styles.summaryTitle, { color: colors.verdeFolha }]}>Resumo do Pedido</Text>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.marromFeijao }]}>Itens:</Text>
                <Text style={[styles.summaryValue, { color: colors.verdeFolha }]}>{carrinho.length}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.marromFeijao }]}>Total:</Text>
                <Text style={[styles.summaryTotal, { color: colors.amareloOuro }]}>R$ {calcularTotal().toFixed(2).replace('.', ',')}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => {
                  console.log('🔘 Botão Finalizar Pedido clicado!');
                  finalizarPedido();
                }} 
                style={[
                  styles.finalizarButton, 
                  { 
                    backgroundColor: isSubmittingOrder ? colors.marromFeijao : colors.verdeFolha,
                    opacity: isSubmittingOrder ? 0.7 : 1
                  }
                ]}
                disabled={isSubmittingOrder}
              > 
                {isSubmittingOrder ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={colors.branco} style={{ marginRight: 8 }} />
                    <Text style={[styles.finalizarButtonText, { color: colors.branco }]}>Enviando Pedido...</Text>
                  </View>
                ) : (
                  <Text style={[styles.finalizarButtonText, { color: colors.branco }]}>Finalizar Pedido</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.branco, borderColor: colors.marromFeijao }]}>
            <Text style={[styles.modalTitle, { color: colors.verdeFolha }]}>Finalizar Pedido</Text>
            
            <View style={styles.modalBody}>
              <Text style={[styles.modalText, { color: colors.marromFeijao }]}>
                <Text style={{ fontWeight: 'bold' }}>Restaurante:</Text> {restauranteNome}
              </Text>
              <Text style={[styles.modalText, { color: colors.marromFeijao }]}>
                <Text style={{ fontWeight: 'bold' }}>Itens:</Text> {carrinho.length}
              </Text>
              <Text style={[styles.modalText, { color: colors.marromFeijao }]}>
                <Text style={{ fontWeight: 'bold' }}>Total:</Text> R$ {calcularTotal().toFixed(2).replace('.', ',')}
              </Text>
              
              <Text style={[styles.modalQuestion, { color: colors.verdeFolha }]}>
                Deseja finalizar o pedido?
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                onPress={cancelarPedido}
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.marromFeijao }]}
              >
                <Text style={[styles.modalButtonText, { color: colors.branco }]}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={confirmarPedido}
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.verdeFolha }]}
              >
                <Text style={[styles.modalButtonText, { color: colors.branco }]}>Finalizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FBBF24',
  },
  limparButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  limparText: {
    color: '#fff',
    fontSize: 14,
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyCartIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FBBF24',
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 24,
  },
  explorarButton: {
    backgroundColor: '#FBBF24',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  explorarButtonText: {
    color: '#18181b',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemsContainer: {
    marginBottom: 24,
  },
  itemCard: {
    backgroundColor: '#23232b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FBBF24',
    marginBottom: 4,
  },
  itemRestaurant: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  restaurantInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restaurantLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  ingredientsContainer: {
    marginBottom: 4,
  },
  ingredientsLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ingredientRemoved: {
    fontSize: 11,
    color: '#ff6b6b',
    marginRight: 8,
  },
  ingredientAdded: {
    fontSize: 11,
    color: '#51cf66',
    marginRight: 8,
  },
  observationsContainer: {
    marginTop: 4,
  },
  observationsLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  observationsText: {
    fontSize: 12,
    color: '#bbb',
    fontStyle: 'italic',
  },
  itemActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityButton: {
    backgroundColor: '#333',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  removeButton: {
    backgroundColor: '#ff6b6b',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 16,
  },
  summaryCard: {
    backgroundColor: '#23232b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FBBF24',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#bbb',
  },
  summaryValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  summaryTotal: {
    fontSize: 20,
    color: '#FBBF24',
    fontWeight: 'bold',
  },
  finalizarButton: {
    backgroundColor: '#FBBF24',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  finalizarButtonText: {
    color: '#18181b',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Estilos do Modal de Confirmação
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    margin: 20,
    borderWidth: 2,
    maxWidth: 400,
    width: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBody: {
    marginBottom: 24,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  modalQuestion: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 6,
  },
  confirmButton: {
    marginLeft: 6,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Carrinho; 