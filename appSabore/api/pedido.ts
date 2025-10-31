// API para gerenciamento de pedidos
import { API_BASE_URL } from './restaurante';

// Tipos para pedidos
export interface ItemPedidoRequest {
  itemRestauranteId: number;
  quantidade: number;
  observacoes?: string;
  ingredientesRemovidos?: string;
  ingredientesAdicionados?: string;
}

export interface PedidoRequest {
  restauranteId: number;
  observacoesGerais?: string;
  itens: ItemPedidoRequest[];
}

export interface ItemPedidoResponse {
  id: number;
  itemRestaurante: {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    imagemUrl?: string;
    restaurante: {
      id: number;
      nome: string;
    };
  };
  quantidade: number;
  observacoes?: string;
  ingredientesRemovidos?: string;
  ingredientesAdicionados?: string;
}

export interface PedidoResponse {
  id: number;
  cliente: {
    id: number;
    nome: string;
    email: string;
  };
  restaurante: {
    id: number;
    nome: string;
    telefone?: string;
    endereco?: string;
  };
  itens: ItemPedidoResponse[];
  observacoesGerais?: string;
  criadoEm: string;
  status: 'NOVO' | 'EM_PREPARO' | 'CONCLUIDO' | 'CANCELADO';
  valorTotal?: number;
}

// Função para criar um pedido
export const criarPedido = async (pedido: PedidoRequest, token?: string): Promise<PedidoResponse> => {
  console.log('📤 === CRIANDO PEDIDO ===');
  console.log('🏪 Restaurante ID:', pedido.restauranteId);
  console.log('📦 Quantidade de itens:', pedido.itens.length);
  console.log('📋 Dados do pedido:', JSON.stringify(pedido, null, 2));
  console.log('🔑 Token:', token ? 'Presente' : 'Ausente (usando cookies)');

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Se tiver token, usar Authorization header, senão usar cookies
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/pedidos`, {
      method: 'POST',
      headers,
      credentials: 'include', // Incluir cookies para Spring Security
      body: JSON.stringify(pedido),
    });

    console.log('📡 Status da resposta:', response.status);
    console.log('📡 Headers da resposta:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      
      let errorMessage = 'Erro ao criar pedido';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const pedidoCriado = await response.json();
    console.log('✅ Pedido criado com sucesso:', pedidoCriado);
    
    return pedidoCriado;
  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erro de conexão ao criar pedido');
  }
};

// Função para buscar pedidos do cliente (baseada no controller: GET /pedidos)
export const buscarPedidosCliente = async (token?: string): Promise<PedidoResponse[]> => {
  console.log('🔍 === BUSCANDO PEDIDOS DO CLIENTE ===');
  console.log('🔑 Token:', token ? 'Presente' : 'Ausente (usando cookies)');

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/pedidos`, {
      method: 'GET',
      headers,
      credentials: 'include', // Incluir cookies para Spring Security
    });

    console.log('📡 Status da resposta:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      
      let errorMessage = 'Erro ao buscar pedidos';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const pedidos = await response.json();
    console.log('✅ Pedidos encontrados:', pedidos.length);
    console.log('📋 Lista de pedidos:', pedidos);
    
    return pedidos;
  } catch (error) {
    console.error('❌ Erro ao buscar pedidos:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erro de conexão ao buscar pedidos');
  }
};

// Função para buscar um pedido específico
export const buscarPedido = async (pedidoId: number, token: string): Promise<PedidoResponse> => {
  console.log('🔍 === BUSCANDO PEDIDO ESPECÍFICO ===');
  console.log('🆔 Pedido ID:', pedidoId);
  console.log('🔑 Token:', token ? 'Presente' : 'Ausente');

  try {
    const response = await fetch(`${API_BASE_URL}/pedidos/${pedidoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('📡 Status da resposta:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      
      let errorMessage = 'Erro ao buscar pedido';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const pedido = await response.json();
    console.log('✅ Pedido encontrado:', pedido);
    
    return pedido;
  } catch (error) {
    console.error('❌ Erro ao buscar pedido:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erro de conexão ao buscar pedido');
  }
};

// Função para atualizar status do pedido (baseada no controller: PUT /pedidos/{id}/status)
export const atualizarStatusPedido = async (pedidoId: number, status: string, token?: string): Promise<PedidoResponse> => {
  console.log('🔄 === ATUALIZANDO STATUS DO PEDIDO ===');
  console.log('🆔 Pedido ID:', pedidoId);
  console.log('📊 Novo status:', status);
  console.log('🔑 Token:', token ? 'Presente' : 'Ausente (usando cookies)');

  // Validar status
  const statusValidos = ['NOVO', 'EM_PREPARO', 'CONCLUIDO', 'CANCELADO'];
  if (!statusValidos.includes(status)) {
    throw new Error(`Status inválido. Use um dos seguintes: ${statusValidos.join(', ')}`);
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/pedidos/${pedidoId}/status?status=${encodeURIComponent(status)}`, {
      method: 'PUT',
      headers,
      credentials: 'include', // Incluir cookies para Spring Security
    });

    console.log('📡 Status da resposta:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      
      let errorMessage = 'Erro ao atualizar status do pedido';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const pedidoAtualizado = await response.json();
    console.log('✅ Status do pedido atualizado:', pedidoAtualizado);
    
    return pedidoAtualizado;
  } catch (error) {
    console.error('❌ Erro ao atualizar status do pedido:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erro de conexão ao atualizar status do pedido');
  }
};

// Função para validar dados do pedido antes de enviar
export const validarPedido = (pedido: PedidoRequest): { valido: boolean; erros: string[] } => {
  const erros: string[] = [];

  // Validar restauranteId
  if (!pedido.restauranteId || pedido.restauranteId <= 0) {
    erros.push('É necessário informar o restaurante do pedido.');
  }

  // Validar itens
  if (!pedido.itens || pedido.itens.length === 0) {
    erros.push('O pedido deve conter pelo menos um item.');
  } else {
    // Validar cada item
    pedido.itens.forEach((item, index) => {
      if (!item.itemRestauranteId || item.itemRestauranteId <= 0) {
        erros.push(`Item ${index + 1}: É necessário informar o ID do item do cardápio.`);
      }
      
      if (!item.quantidade || item.quantidade <= 0) {
        erros.push(`Item ${index + 1}: A quantidade deve ser maior que 0.`);
      }

      // Validar tamanhos máximos
      if (item.observacoes && item.observacoes.length > 500) {
        erros.push(`Item ${index + 1}: Observações não podem exceder 500 caracteres.`);
      }

      if (item.ingredientesRemovidos && item.ingredientesRemovidos.length > 1000) {
        erros.push(`Item ${index + 1}: Ingredientes removidos não podem exceder 1000 caracteres.`);
      }

      if (item.ingredientesAdicionados && item.ingredientesAdicionados.length > 1000) {
        erros.push(`Item ${index + 1}: Ingredientes adicionados não podem exceder 1000 caracteres.`);
      }
    });
  }

  // Verificar se todos os itens são do mesmo restaurante (validação adicional)
  const restaurantesUnicos = new Set(pedido.itens.map(item => item.itemRestauranteId));
  if (restaurantesUnicos.size === 0) {
    // Esta validação será feita no backend, mas é boa prática verificar no frontend também
    console.log('⚠️ Aviso: Não é possível validar se todos os itens pertencem ao mesmo restaurante no frontend');
  }

  return {
    valido: erros.length === 0,
    erros
  };
};

// Função utilitária para calcular valor total do pedido
export const calcularValorTotal = (itens: ItemPedidoResponse[]): number => {
  return itens.reduce((total, item) => {
    return total + (item.itemRestaurante.preco * item.quantidade);
  }, 0);
};

// Função utilitária para formatar status do pedido
export const formatarStatusPedido = (status: string): string => {
  const statusMap = {
    'NOVO': '🆕 Novo',
    'EM_PREPARO': '👨‍🍳 Em Preparo',
    'CONCLUIDO': '✅ Concluído',
    'CANCELADO': '❌ Cancelado'
  };
  
  return statusMap[status as keyof typeof statusMap] || status;
};

// Função utilitária para formatar data
export const formatarDataPedido = (dataString: string): string => {
  try {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return dataString;
  }
};
