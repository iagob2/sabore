import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
  TouchableOpacity
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '../components/Header';
import { indexStyles } from '../style/indexStyles';
import { colors } from '../style/colors';
import { useCart } from '../contexts/CartContext';
import StarRating from '../components/StarRating';
import { 
  buscarAvaliacoesPrato, 
  AvaliacaoPratoResponse, 
  calcularMediaAvaliacoes,
  formatarDataAvaliacao 
} from '../api/avaliacaoPrato';
import { toast } from '../hooks/use-toast';

const AvaliacoesPrato = () => {
  const router = useRouter();
  const { itemCount } = useCart();
  const { itemId, itemNome, itemPreco } = useLocalSearchParams();
  
  // Estados
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoPratoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar avaliações quando o componente montar
  useEffect(() => {
    if (itemId) {
      carregarAvaliacoes();
    }
  }, [itemId]);

  // Função para carregar avaliações
  const carregarAvaliacoes = async () => {
    if (!itemId) {
      setLoading(false);
      return;
    }

    try {
      console.log('📋 Carregando avaliações do prato:', itemId);
      const avaliacoesData = await buscarAvaliacoesPrato(Number(itemId));
      
      // Ordenar por data (mais recentes primeiro)
      const avaliacoesOrdenadas = avaliacoesData.sort((a, b) => 
        new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime()
      );
      
      setAvaliacoes(avaliacoesOrdenadas);
      console.log('✅ Avaliações carregadas:', avaliacoesOrdenadas.length);
    } catch (error) {
      console.error('❌ Erro ao carregar avaliações:', error);
      toast({
        title: "Erro ao Carregar Avaliações",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Função para atualizar avaliações (pull to refresh)
  const onRefresh = () => {
    setRefreshing(true);
    carregarAvaliacoes();
  };

  // Calcular estatísticas das avaliações
  const mediaAvaliacoes = calcularMediaAvaliacoes(avaliacoes);
  const totalAvaliacoes = avaliacoes.length;

  // Calcular distribuição das notas
  const distribuicaoNotas = [5, 4, 3, 2, 1].map(nota => {
    const count = avaliacoes.filter(av => av.nota === nota).length;
    const percentual = totalAvaliacoes > 0 ? (count / totalAvaliacoes) * 100 : 0;
    return { nota, count, percentual };
  });

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
        {/* Header com informações do prato */}
        <View style={styles.pratoHeader}>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => router.back()}
          >
            <Text style={[styles.textoBotaoVoltar, { color: colors.verdeFolha }]}>
              ← Voltar
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.pratoNome, { color: colors.verdeFolha }]}>
            {itemNome || 'Prato'}
          </Text>
          
          {itemPreco && (
            <Text style={[styles.pratoPreco, { color: colors.amareloOuro }]}>
              R$ {Number(itemPreco).toFixed(2).replace('.', ',')}
            </Text>
          )}
        </View>

        {loading ? (
          // Estado de loading
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color={colors.verdeFolha} />
            <Text style={[styles.loadingText, { color: colors.preto }]}>
              Carregando avaliações...
            </Text>
          </View>
        ) : (
          <>
            {/* Resumo das Avaliações */}
            <View style={[styles.resumoContainer, { 
              backgroundColor: colors.branco,
              borderColor: colors.verdeFolha 
            }]}>
              <View style={styles.mediaContainer}>
                <Text style={[styles.mediaNumero, { color: colors.amareloOuro }]}>
                  {mediaAvaliacoes.toFixed(1)}
                </Text>
                <StarRating rating={mediaAvaliacoes} size={24} />
                <Text style={[styles.totalAvaliacoes, { color: colors.marromFeijao }]}>
                  {totalAvaliacoes} avaliação{totalAvaliacoes !== 1 ? 'ões' : ''}
                </Text>
              </View>

              {/* Distribuição das Notas */}
              <View style={styles.distribuicaoContainer}>
                {distribuicaoNotas.map(({ nota, count, percentual }) => (
                  <View key={nota} style={styles.distribuicaoRow}>
                    <Text style={[styles.distribuicaoNota, { color: colors.marromFeijao }]}>
                      {nota}★
                    </Text>
                    <View style={styles.barraContainer}>
                      <View 
                        style={[styles.barraFundo, { backgroundColor: colors.verdeFolha + '20' }]} 
                      />
                      <View 
                        style={[
                          styles.barraPreenchida, 
                          { 
                            backgroundColor: colors.amareloOuro,
                            width: `${percentual}%` 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.distribuicaoCount, { color: colors.marromFeijao }]}>
                      {count}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Lista de Avaliações */}
            {avaliacoes.length === 0 ? (
              <View style={styles.centeredContainer}>
                <Text style={styles.emptyIcon}>⭐</Text>
                <Text style={[styles.emptyTitle, { color: colors.amareloOuro }]}>
                  Nenhuma Avaliação
                </Text>
                <Text style={[styles.emptyText, { color: colors.preto }]}>
                  Este prato ainda não foi avaliado por nenhum cliente.
                </Text>
              </View>
            ) : (
              <View style={styles.avaliacoesContainer}>
                <Text style={[styles.avaliacoesTitle, { color: colors.verdeFolha }]}>
                  📝 Avaliações dos Clientes
                </Text>
                
                {avaliacoes.map((avaliacao) => (
                  <View key={avaliacao.id} style={[styles.avaliacaoCard, {
                    backgroundColor: colors.branco,
                    borderColor: colors.marromFeijao
                  }]}>
                    {/* Header da avaliação */}
                    <View style={styles.avaliacaoHeader}>
                      <View>
                        <Text style={[styles.clienteNome, { color: colors.marromFeijao }]}>
                          {avaliacao.cliente.nome}
                        </Text>
                        <Text style={[styles.avaliacaoData, { color: colors.preto + '88' }]}>
                          {formatarDataAvaliacao(avaliacao.dataAvaliacao)}
                        </Text>
                      </View>
                      <StarRating rating={avaliacao.nota} size={20} />
                    </View>

                    {/* Comentário */}
                    {avaliacao.comentario && (
                      <View style={styles.comentarioContainer}>
                        <Text style={[styles.comentarioTexto, { color: colors.preto }]}>
                          "{avaliacao.comentario}"
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  pratoHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  botaoVoltar: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textoBotaoVoltar: {
    fontSize: 16,
    fontWeight: '600',
  },
  pratoNome: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  pratoPreco: {
    fontSize: 18,
    fontWeight: '600',
  },
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
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
    lineHeight: 22,
  },
  resumoContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mediaContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mediaNumero: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  totalAvaliacoes: {
    fontSize: 14,
    marginTop: 8,
  },
  distribuicaoContainer: {
    gap: 8,
  },
  distribuicaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  distribuicaoNota: {
    fontSize: 14,
    fontWeight: '600',
    width: 30,
  },
  barraContainer: {
    flex: 1,
    height: 8,
    position: 'relative',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barraFundo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  barraPreenchida: {
    position: 'absolute',
    height: '100%',
    borderRadius: 4,
  },
  distribuicaoCount: {
    fontSize: 14,
    fontWeight: '600',
    width: 30,
    textAlign: 'right',
  },
  avaliacoesContainer: {
    paddingBottom: 20,
  },
  avaliacoesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  avaliacaoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avaliacaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clienteNome: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  avaliacaoData: {
    fontSize: 12,
  },
  comentarioContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  comentarioTexto: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default AvaliacoesPrato;
