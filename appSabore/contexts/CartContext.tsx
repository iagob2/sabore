import React, { createContext, useContext, useState, useCallback } from 'react';
import { ItemPedidoRequest } from '../api/pedido';

// Tipo para item do carrinho (baseado na estrutura da API)
export interface CartItem {
  // Dados do item do restaurante
  itemRestauranteId: number;
  nome: string;
  preco: number;
  imagemUrl?: string;
  descricao?: string;
  
  // Dados do pedido
  quantidade: number;
  observacoes?: string;
  ingredientesRemovidos?: string;
  ingredientesAdicionados?: string;
  
  // Dados do restaurante
  restauranteId: number;
  restauranteNome: string;
  
  // ID único para o carrinho (para controle local)
  cartId: string;
}

// Contexto do carrinho
interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  restauranteId: number | null;
  restauranteNome: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  updateObservations: (cartId: string, observacoes?: string, ingredientesRemovidos?: string, ingredientesAdicionados?: string) => void;
  clearCart: () => void;
  getOrderData: () => { restauranteId: number; itens: ItemPedidoRequest[] } | null;
  canAddItem: (restauranteId: number) => boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Calcular valores derivados
  const itemCount = items.reduce((total, item) => total + item.quantidade, 0);
  const restauranteId = items.length > 0 ? items[0].restauranteId : null;
  const restauranteNome = items.length > 0 ? items[0].restauranteNome : null;

  // Verificar se pode adicionar item (mesmo restaurante)
  const canAddItem = useCallback((newRestauranteId: number): boolean => {
    if (items.length === 0) return true;
    return items[0].restauranteId === newRestauranteId;
  }, [items]);

  // Adicionar item ao carrinho
  const addItem = useCallback((newItem: CartItem) => {
    console.log('🛒 Adicionando item ao carrinho:', newItem);
    
    // Verificar se é do mesmo restaurante
    if (!canAddItem(newItem.restauranteId)) {
      throw new Error(`Você só pode adicionar itens de um restaurante por vez. Limpe o carrinho para adicionar itens de "${newItem.restauranteNome}".`);
    }

    setItems(prevItems => {
      // Verificar se já existe item idêntico (mesmo itemRestauranteId e customizações)
      const existingItemIndex = prevItems.findIndex(item => 
        item.itemRestauranteId === newItem.itemRestauranteId &&
        item.observacoes === newItem.observacoes &&
        item.ingredientesRemovidos === newItem.ingredientesRemovidos &&
        item.ingredientesAdicionados === newItem.ingredientesAdicionados
      );

      if (existingItemIndex >= 0) {
        // Se existe, somar as quantidades
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantidade: updatedItems[existingItemIndex].quantidade + newItem.quantidade
        };
        console.log('✅ Item existente atualizado, nova quantidade:', updatedItems[existingItemIndex].quantidade);
        return updatedItems;
      } else {
        // Se não existe, adicionar novo
        console.log('✅ Novo item adicionado ao carrinho');
        return [...prevItems, newItem];
      }
    });
  }, [canAddItem]);

  // Remover item do carrinho
  const removeItem = useCallback((cartId: string) => {
    console.log('🗑️ Removendo item do carrinho:', cartId);
    setItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  }, []);

  // Atualizar quantidade
  const updateQuantity = useCallback((cartId: string, quantity: number) => {
    console.log('📊 Atualizando quantidade do item:', cartId, 'para:', quantity);
    
    if (quantity <= 0) {
      removeItem(cartId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.cartId === cartId ? { ...item, quantidade: quantity } : item
      )
    );
  }, [removeItem]);

  // Atualizar observações e customizações
  const updateObservations = useCallback((
    cartId: string, 
    observacoes?: string, 
    ingredientesRemovidos?: string, 
    ingredientesAdicionados?: string
  ) => {
    console.log('📝 Atualizando observações do item:', cartId);
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.cartId === cartId 
          ? { 
              ...item, 
              observacoes, 
              ingredientesRemovidos, 
              ingredientesAdicionados 
            } 
          : item
      )
    );
  }, []);

  // Limpar carrinho
  const clearCart = useCallback(() => {
    console.log('🗑️ Limpando carrinho completo');
    setItems([]);
  }, []);

  // Obter dados formatados para a API
  const getOrderData = useCallback(() => {
    if (items.length === 0 || !restauranteId) {
      return null;
    }

    const itens: ItemPedidoRequest[] = items.map(item => ({
      itemRestauranteId: item.itemRestauranteId,
      quantidade: item.quantidade,
      observacoes: item.observacoes || undefined,
      ingredientesRemovidos: item.ingredientesRemovidos || undefined,
      ingredientesAdicionados: item.ingredientesAdicionados || undefined,
    }));

    return {
      restauranteId,
      itens
    };
  }, [items, restauranteId]);

  const value: CartContextValue = {
    items,
    itemCount,
    restauranteId,
    restauranteNome,
    addItem,
    removeItem,
    updateQuantity,
    updateObservations,
    clearCart,
    getOrderData,
    canAddItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar o contexto do carrinho
export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

// Função utilitária para criar ID único do carrinho
export const generateCartId = (): string => {
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Função utilitária para calcular total do carrinho
export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.preco * item.quantidade), 0);
};
