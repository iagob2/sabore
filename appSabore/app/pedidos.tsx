import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import { indexStyles } from '../style/indexStyles';
import { colors } from '../style/colors';
import { useAuthSession } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { 
  buscarPedidosCliente, 
  atualizarStatusPedido, 
  PedidoResponse, 
  formatarStatusPedido, 
  formatarDataPedido, 
  calcularValorTotal 
} from '../api/pedido';
import { toast } from '../hooks/use-toast';

const Pedidos = () => {
  const router = useRouter();
  const { session, isAuthenticated } = useAuthSession();
  const { itemCount } = useCart();
  
  // Estados
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  // Carregar pedidos quando o componente montar
  useEffect(() => {
    if (isAuthenticated) {
      carregarPedidos();
    }
  }, [isAuthenticated]);

  // Função para carregar pedidos
  const carregarPedidos = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      console.log('📋 Carregando pedidos do cliente...');
      console.log('🔐 Método de autenticação:', session?.token ? 'JWT Token' : 'Cookies');
      const pedidosData = await buscarPedidosCliente(session?.token);
      
      // Ordenar por data (mais recentes primeiro)
      const pedidosOrdenados = pedidosData.sort((a, b) => 
        new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
      );
      
      setPedidos(pedidosOrdenados);
      console.log('✅ Pedidos carregados:', pedidosOrdenados.length);
    } catch (error) {
      console.error('❌ Erro ao carregar pedidos:', error);
      toast({
        title: "Erro ao Carregar Pedidos",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Função para atualizar pedidos (pull to refresh)
  const onRefresh = () => {
    setRefreshing(true);
    carregarPedidos();
  };

  // Função para cancelar pedido (apenas se estiver com status NOVO)
  const cancelarPedido = (pedido: PedidoResponse) => {
    if (pedido.status !== 'NOVO') {
      Alert.alert(
        'Não é Possível Cancelar',
        'Apenas pedidos com status "Novo" podem ser cancelados.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Cancelar Pedido',
      `Tem certeza que deseja cancelar o pedido #${pedido.id}?`,
      [
        { text: 'Não', style: 'cancel' },
        { 
          text: 'Sim, Cancelar', 
          style: 'destructive',
          onPress: () => atualizarStatus(pedido.id, 'CANCELADO')
        }
      ]
    );
  };

  // Função para atualizar status do pedido
  const atualizarStatus = async (pedidoId: number, novoStatus: string) => {
    if (!isAuthenticated) return;

    try {
      setUpdatingStatus(pedidoId);
      console.log('🔄 Atualizando status do pedido:', pedidoId, 'para:', novoStatus);
      console.log('🔐 Método de autenticação:', session?.token ? 'JWT Token' : 'Cookies');
      
      await atualizarStatusPedido(pedidoId, novoStatus, session?.token);
      
      // Atualizar lista local
      setPedidos(prev => 
        prev.map(pedido => 
          pedido.id === pedidoId 
            ? { ...pedido, status: novoStatus as any }
            : pedido
        )
      );
      
      toast({
        title: "Status Atualizado!",
        description: `Pedido #${pedidoId} foi ${novoStatus === 'CANCELADO' ? 'cancelado' : 'atualizado'}.`,
      });
      
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      toast({
        title: "Erro ao Atualizar Status",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Renderizar se não estiver autenticado
  if (!isAuthenticated) {
    return (
      <View style={indexStyles.main}>
        <Header 
          logo="Saborê" 
          cartItemCount={itemCount}
          onCartPress={() => router.push('/carrinho')}
        />
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyIcon}>🔐</Text>
          <Text style={[styles.emptyTitle, { color: colors.verdeFolha }]}>Login Necessário</Text>
          <Text style={[styles.emptyText, { color: colors.preto }]}>
            Você precisa estar logado para ver seus pedidos.
          </Text>
          <TouchableOpacity 
            onPress={() => router.push('/login')}
            style={[styles.actionButton, { backgroundColor: colors.verdeFolha }]}
          >
            <Text style={[styles.actionButtonText, { color: colors.branco }]}>Fazer Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={indexStyles.main}>
      <Header 
        logo="Saborê" 
        cartItemCount={itemCount}
        onCartPress={() => router.push('/carrinho')}
      />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.branco }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.verdeFolha]}
            tintColor={colors.verdeFolha}
          />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.verdeFolha }]}>📋 Meus Pedidos</Text>
        </View>

        {loading ? (
          // Estado de loading
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color={colors.verdeFolha} />
            <Text style={[styles.loadingText, { color: colors.preto }]}>
              Carregando seus pedidos...
            </Text>
          </View>
        ) : pedidos.length === 0 ? (
          // Estado vazio
          <View style={styles.centeredContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={[styles.emptyTitle, { color: colors.amareloOuro }]}>Nenhum Pedido</Text>
            <Text style={[styles.emptyText, { color: colors.preto }]}>
              Você ainda não fez nenhum pedido. Que tal explorar nossos restaurantes?
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/indexEmpresas')}
              style={[styles.actionButton, { backgroundColor: colors.verdeFolha }]}
            >
              <Text style={[styles.actionButtonText, { color: colors.branco }]}>Explorar Restaurantes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Lista de pedidos
          <View style={styles.pedidosContainer}>
            {pedidos.map((pedido) => (
              <View key={pedido.id} style={[styles.pedidoCard, { 
                backgroundColor: colors.branco, 
                borderColor: colors.marromFeijao,
                borderWidth: 1.5 
              }]}>
                {/* Header do pedido */}
                <View style={styles.pedidoHeader}>
                  <View>
                    <Text style={[styles.pedidoId, { color: colors.verdeFolha }]}>
                      Pedido #{pedido.id}
                    </Text>
                    <Text style={[styles.pedidoData, { color: colors.marromFeijao }]}>
                      {formatarDataPedido(pedido.criadoEm)}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { 
                    backgroundColor: getStatusColor(pedido.status) + '20',
                    borderColor: getStatusColor(pedido.status)
                  }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(pedido.status) }]}>
                      {formatarStatusPedido(pedido.status)}
                    </Text>
                  </View>
                </View>

                {/* Informações do restaurante */}
                <View style={styles.restauranteInfo}>
                  <Text style={[styles.restauranteLabel, { color: colors.verdeFolha }]}>🏪 Restaurante:</Text>
                  <Text style={[styles.restauranteNome, { color: colors.marromFeijao }]}>
                    {pedido.restaurante.nome}
                  </Text>
                </View>

                {/* Lista de itens */}
                <View style={styles.itensContainer}>
                  <Text style={[styles.itensTitle, { color: colors.verdeFolha }]}>Itens do Pedido:</Text>
                  {pedido.itens.map((item, index) => (
                    <View key={item.id} style={styles.itemRow}>
                      <View style={styles.itemInfo}>
                        <Text style={[styles.itemNome, { color: colors.marromFeijao }]}>
                          {item.quantidade}x {item.itemRestaurante.nome}
                        </Text>
                        <Text style={[styles.itemPreco, { color: colors.amareloOuro }]}>
                          R$ {(item.itemRestaurante.preco * item.quantidade).toFixed(2).replace('.', ',')}
                        </Text>
                      </View>
                      
                      {/* Customizações */}
                      {(item.observacoes || item.ingredientesRemovidos || item.ingredientesAdicionados) && (
                        <View style={styles.customizacoes}>
                          {item.observacoes && (
                            <Text style={[styles.customizacaoText, { color: colors.azulRio }]}>
                              💬 {item.observacoes}
                            </Text>
                          )}
                          {item.ingredientesRemovidos && (
                            <Text style={[styles.customizacaoText, { color: colors.vermelhoCambuci }]}>
                              ➖ Sem: {item.ingredientesRemovidos}
                            </Text>
                          )}
                          {item.ingredientesAdicionados && (
                            <Text style={[styles.customizacaoText, { color: colors.verdeFolha }]}>
                              ➕ Extra: {item.ingredientesAdicionados}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  ))}
                </View>

                {/* Observações gerais */}
                {pedido.observacoesGerais && (
                  <View style={styles.observacoesContainer}>
                    <Text style={[styles.observacoesLabel, { color: colors.azulRio }]}>Observações Gerais:</Text>
                    <Text style={[styles.observacoesText, { color: colors.azulRio }]}>
                      {pedido.observacoesGerais}
                    </Text>
                  </View>
                )}

                {/* Footer com total e ações */}
                <View style={styles.pedidoFooter}>
                  <Text style={[styles.totalText, { color: colors.amareloOuro }]}>
                    Total: R$ {calcularValorTotal(pedido.itens).toFixed(2).replace('.', ',')}
                  </Text>
                  
                  {/* Botão de cancelar (apenas para status NOVO) */}
                  {pedido.status === 'NOVO' && (
                    <TouchableOpacity 
                      onPress={() => cancelarPedido(pedido)}
                      style={[styles.cancelButton, { 
                        backgroundColor: colors.vermelhoCambuci,
                        opacity: updatingStatus === pedido.id ? 0.7 : 1
                      }]}
                      disabled={updatingStatus === pedido.id}
                    >
                      {updatingStatus === pedido.id ? (
                        <ActivityIndicator size="small" color={colors.branco} />
                      ) : (
                        <Text style={[styles.cancelButtonText, { color: colors.branco }]}>
                          Cancelar Pedido
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Função para obter cor do status
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'NOVO':
      return colors.azulRio;
    case 'EM_PREPARO':
      return colors.amareloOuro;
    case 'CONCLUIDO':
      return colors.verdeFolha;
    case 'CANCELADO':
      return colors.vermelhoCambuci;
    default:
      return colors.marromFeijao;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  pedidosContainer: {
    paddingBottom: 20,
  },
  pedidoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pedidoId: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pedidoData: {
    fontSize: 14,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  restauranteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  restauranteLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  restauranteNome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itensContainer: {
    marginBottom: 16,
  },
  itensTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemRow: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemNome: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  itemPreco: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  customizacoes: {
    marginTop: 4,
    paddingLeft: 8,
  },
  customizacaoText: {
    fontSize: 12,
    marginBottom: 2,
  },
  observacoesContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  observacoesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  observacoesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  pedidoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Pedidos;
