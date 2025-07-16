import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import { indexStyles } from '../style/indexStyles';
import { colors } from '../style/colors';

// Dados mockados do carrinho (em uma aplicação real, isso viria de um contexto global ou estado)
const carrinhoMock = [
  {
    id: 1,
    prato: {
      nome: 'Yakissoba',
      imagem: require('../assets/pratos/prato1.png'),
      valor: 'R$ 32,00',
      avaliacao: 4.7
    },
    quantidade: 2,
    observacoes: 'Bem passado, sem sal',
    ingredientesRemovidos: ['Cebola'],
    ingredientesAdicionados: ['Bacon'],
    empresa: 'Sushi House'
  },
  {
    id: 2,
    prato: {
      nome: 'Sashimi',
      imagem: require('../assets/pratos/prato1.png'),
      valor: 'R$ 38,00',
      avaliacao: 4.9
    },
    quantidade: 1,
    observacoes: '',
    ingredientesRemovidos: [],
    ingredientesAdicionados: ['Queijo Extra'],
    empresa: 'Sushi House'
  }
];

const Carrinho = () => {
  const router = useRouter();
  const [carrinho, setCarrinho] = useState(carrinhoMock);

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => {
      const valor = parseFloat(item.prato.valor.replace('R$ ', '').replace(',', '.'));
      return total + (valor * item.quantidade);
    }, 0);
  };

  const atualizarQuantidade = (id: number, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      removerItem(id);
      return;
    }
    
    setCarrinho(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  };

  const removerItem = (id: number) => {
    Alert.alert(
      'Remover Item',
      'Tem certeza que deseja remover este item do carrinho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => {
            setCarrinho(prev => prev.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  const limparCarrinho = () => {
    Alert.alert(
      'Limpar Carrinho',
      'Tem certeza que deseja remover todos os itens do carrinho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar', 
          style: 'destructive',
          onPress: () => setCarrinho([])
        }
      ]
    );
  };

  const finalizarPedido = () => {
    if (carrinho.length === 0) {
      Alert.alert('Carrinho Vazio', 'Adicione itens ao carrinho antes de finalizar o pedido.');
      return;
    }

    Alert.alert(
      'Finalizar Pedido',
      `Total: R$ ${calcularTotal().toFixed(2).replace('.', ',')}\n\nDeseja finalizar o pedido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Finalizar', 
          onPress: () => {
            Alert.alert('Pedido Finalizado!', 'Seu pedido foi enviado com sucesso!');
            setCarrinho([]);
          }
        }
      ]
    );
  };

  return (
    <View style={indexStyles.main}>
      <Header 
        logo="Saborê" 
        cartItemCount={carrinho.length}
        onCartPress={() => router.push('/carrinho')}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: colors.branco }]}> 
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.verdeFolha }]}>🛒 Meu Carrinho</Text>
          {carrinho.length > 0 && (
            <TouchableOpacity onPress={limparCarrinho} style={[styles.limparButton, { backgroundColor: colors.vermelhoCambuci }]}> 
              <Text style={[styles.limparText, { color: colors.branco }]}>Limpar Carrinho</Text>
            </TouchableOpacity>
          )}
        </View>

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
              {carrinho.map((item) => (
                <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.branco, borderColor: colors.marromFeijao, borderWidth: 1.5 }]}> 
                  <Image source={item.prato.imagem} style={styles.itemImage} />
                  
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { color: colors.verdeFolha }]}>{item.prato.nome}</Text>
                    <Text style={[styles.itemRestaurant, { color: colors.marromFeijao }]}>{item.empresa}</Text>
                    <Text style={[styles.itemPrice, { color: colors.amareloOuro }]}>{item.prato.valor}</Text>
                    
                    {/* Ingredientes Removidos */}
                    {item.ingredientesRemovidos.length > 0 && (
                      <View style={styles.ingredientsContainer}>
                        <Text style={[styles.ingredientsLabel, { color: colors.vermelhoCambuci }]}>Removidos:</Text>
                        <View style={styles.ingredientsList}>
                          {item.ingredientesRemovidos.map((ing, index) => (
                            <Text key={index} style={[styles.ingredientRemoved, { color: colors.vermelhoCambuci }]}>• {ing}</Text>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Ingredientes Adicionados */}
                    {item.ingredientesAdicionados.length > 0 && (
                      <View style={styles.ingredientsContainer}>
                        <Text style={[styles.ingredientsLabel, { color: colors.verdeFolha }]}>Adicionados:</Text>
                        <View style={styles.ingredientsList}>
                          {item.ingredientesAdicionados.map((ing, index) => (
                            <Text key={index} style={[styles.ingredientAdded, { color: colors.verdeFolha }]}>• {ing}</Text>
                          ))}
                        </View>
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
                        onPress={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                        style={[styles.quantityButton, { backgroundColor: colors.marromFeijao }]}
                      >
                        <Text style={[styles.quantityButtonText, { color: colors.branco }]}>-</Text>
                      </TouchableOpacity>
                      <Text style={[styles.quantityText, { color: colors.marromFeijao }]}>{item.quantidade}</Text>
                      <TouchableOpacity 
                        onPress={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                        style={[styles.quantityButton, { backgroundColor: colors.verdeFolha }]}
                      >
                        <Text style={[styles.quantityButtonText, { color: colors.branco }]}>+</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Botão Remover */}
                    <TouchableOpacity 
                      onPress={() => removerItem(item.id)}
                      style={[styles.removeButton, { backgroundColor: colors.vermelhoCambuci }]}
                    >
                      <Text style={[styles.removeButtonText, { color: colors.branco }]}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
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
              <TouchableOpacity onPress={finalizarPedido} style={[styles.finalizarButton, { backgroundColor: colors.verdeFolha }]}> 
                <Text style={[styles.finalizarButtonText, { color: colors.branco }]}>Finalizar Pedido</Text>
              </TouchableOpacity>
            </View>
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
});

export default Carrinho; 