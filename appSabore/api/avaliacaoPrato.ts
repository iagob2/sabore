// API para avaliações de pratos
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

// Importar getSessao para identificar o cliente logado
import { getSessao } from './cliente';

// Interfaces baseadas no controller fornecido
export interface AvaliacaoPratoRequest {
  nota: number; // 1 a 5
  comentario?: string; // máximo 500 caracteres
  prato: {
    id: number;
  };
}

export interface AvaliacaoPratoResponse {
  id: number;
  nota: number;
  comentario?: string;
  itemRestaurante: {
    id: number;
    nome: string;
    preco: number;
  };
  cliente: {
    id: number;
    nome: string;
  };
  dataAvaliacao: string; // ISO datetime
}

// Função para criar avaliação de prato
export const criarAvaliacaoPrato = async (
  avaliacaoData: AvaliacaoPratoRequest
): Promise<AvaliacaoPratoResponse> => {
  console.log('📤 === CRIANDO AVALIAÇÃO DE PRATO ===');
  console.log('⭐ Nota:', avaliacaoData.nota);
  console.log('🍽️ Prato ID:', avaliacaoData.prato.id);
  console.log('💬 Comentário:', avaliacaoData.comentario || 'Sem comentário');

  try {
    const response = await fetch(`${API_BASE_URL}/avaliacoes-prato`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Para usar cookies de autenticação
      body: JSON.stringify(avaliacaoData),
    });

    console.log('📡 Status da resposta:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      
      let errorMessage = 'Erro ao criar avaliação';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const avaliacaoCriada = await response.json();
    console.log('✅ Avaliação criada com sucesso:', avaliacaoCriada);
    
    return avaliacaoCriada;
  } catch (error) {
    console.error('❌ Erro ao criar avaliação:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erro de conexão ao criar avaliação');
  }
};

// Função para buscar avaliações de um prato específico
export const buscarAvaliacoesPrato = async (
  itemId: number
): Promise<AvaliacaoPratoResponse[]> => {
  console.log('📤 === BUSCANDO AVALIAÇÕES DO PRATO ===');
  console.log('🍽️ Item ID:', itemId);

  try {
    const response = await fetch(`${API_BASE_URL}/avaliacoes-prato/item/${itemId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    console.log('📡 Status da resposta:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      
      let errorMessage = 'Erro ao buscar avaliações';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const avaliacoes = await response.json();
    console.log('✅ Avaliações encontradas:', avaliacoes.length);
    
    return avaliacoes;
  } catch (error) {
    console.error('❌ Erro ao buscar avaliações:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erro de conexão ao buscar avaliações');
  }
};

// Função utilitária para calcular média das avaliações
export const calcularMediaAvaliacoes = (avaliacoes: AvaliacaoPratoResponse[]): number => {
  if (avaliacoes.length === 0) return 0;
  
  const soma = avaliacoes.reduce((acc, avaliacao) => acc + avaliacao.nota, 0);
  return Math.round((soma / avaliacoes.length) * 10) / 10; // Arredonda para 1 casa decimal
};

// Função para buscar avaliações do cliente logado
export const buscarAvaliacoesCliente = async (): Promise<AvaliacaoPratoResponse[]> => {
  console.log('📤 === BUSCANDO AVALIAÇÕES DO CLIENTE ===');

  try {
    const response = await fetch(`${API_BASE_URL}/avaliacoes-prato`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    console.log('📡 Status da resposta:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      
      let errorMessage = 'Erro ao buscar avaliações';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const todasAvaliacoes = await response.json();
    console.log('📋 Todas as avaliações retornadas:', todasAvaliacoes.length);
    console.log('📋 Dados completos das avaliações:', JSON.stringify(todasAvaliacoes, null, 2));
    
    // Filtrar apenas as avaliações do cliente logado
    // Como o backend retorna todas as avaliações, precisamos filtrar pelo cliente logado
    // Vamos usar a sessão para identificar o cliente
    const sessao = await getSessao();
    console.log('👤 Sessão do cliente:', JSON.stringify(sessao, null, 2));
    
    const avaliacoesDoCliente = todasAvaliacoes.filter((avaliacao: any) => {
      const match = avaliacao.cliente && avaliacao.cliente.email === sessao.email;
      console.log('🔍 Verificando avaliação:', {
        avaliacaoId: avaliacao.id,
        clienteEmail: avaliacao.cliente?.email,
        sessaoEmail: sessao.email,
        match: match
      });
      return match;
    });
    
    console.log('✅ Avaliações do cliente encontradas:', avaliacoesDoCliente.length);
    console.log('👤 Email do cliente logado:', sessao.email);
    console.log('📋 Avaliações filtradas:', JSON.stringify(avaliacoesDoCliente, null, 2));
    
    return avaliacoesDoCliente;
  } catch (error) {
    console.error('❌ Erro ao buscar avaliações do cliente:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Erro de conexão ao buscar avaliações do cliente');
  }
};

// Função utilitária para formatar data da avaliação
export const formatarDataAvaliacao = (dataISO: string): string => {
  try {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
};
