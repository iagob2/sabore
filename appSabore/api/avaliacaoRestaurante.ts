import { API_BASE_URL } from './restaurante';

// Interface para a resposta da API de avaliação de restaurante
export interface AvaliacaoRestauranteResponse {
  id: number;
  nota: number;
  comentario?: string;
  restaurante: {
    id: number;
    nome: string;
    cnpj: string;
    telefone: string;
    email: string;
    rua: string;
    numero: number;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    descricao: string;
    horario: string;
    lotacao: number;
    site: string;
    facebook: string;
    instagram: string;
    whatsapp: string;
    cardapioUrl: string;
    logoUrl: string;
    bannerUrl: string;
    aceitaComunicacao: boolean;
    aceitaMarketing: boolean;
    aceitaProtecaoDados: boolean;
    avaliacaoMedia: number;
  };
  cliente: {
    id: number;
    nome: string;
    telefone: string;
    cpf: string;
    email: string;
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    numero: string;
    aceitaProtecaoDados: boolean;
    aceitaMarketing: boolean;
    aceitaAtendimento: boolean;
  };
  dataAvaliacao: string;
}

// Interface para criar uma nova avaliação de restaurante
export interface AvaliacaoRestauranteCreate {
  nota: number;
  comentario?: string;
  restaurante: {
    id: number;
  };
}

// Função para criar uma nova avaliação de restaurante
export const criarAvaliacaoRestaurante = async (avaliacao: AvaliacaoRestauranteCreate): Promise<AvaliacaoRestauranteResponse> => {
  console.log('🏪 === CRIANDO AVALIAÇÃO DE RESTAURANTE ===');
  console.log('📊 Dados da avaliação:', JSON.stringify(avaliacao, null, 2));

  try {
    const url = `${API_BASE_URL}/avaliacoes`;
    console.log('🌐 URL da requisição:', url);
    console.log('🔧 API_BASE_URL:', API_BASE_URL);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(avaliacao),
    });

    console.log('📡 Status da resposta:', response.status);

    if (!response.ok && response.status !== 201) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);

      let errorMessage = 'Erro ao criar avaliação do restaurante';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    // Verificar se a resposta é JSON válido
    const responseText = await response.text();
    console.log('📄 Resposta bruta:', responseText.substring(0, 200) + '...');
    
    try {
      const novaAvaliacao = JSON.parse(responseText);
      console.log('✅ Avaliação de restaurante criada com sucesso:', novaAvaliacao);
      return novaAvaliacao;
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError);
      console.error('📄 Conteúdo da resposta:', responseText);
      throw new Error('Resposta do servidor não é um JSON válido');
    }

  } catch (error) {
    console.error('❌ Erro ao criar avaliação do restaurante:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Erro de conexão ao criar avaliação do restaurante');
  }
};

// Função para buscar avaliações de um restaurante específico
export const buscarAvaliacoesRestaurante = async (restauranteId: number): Promise<AvaliacaoRestauranteResponse[]> => {
  console.log('🔍 === BUSCANDO AVALIAÇÕES DO RESTAURANTE ===');
  console.log('🏪 ID do restaurante:', restauranteId);

  try {
    const response = await fetch(`${API_BASE_URL}/avaliacoes/${restauranteId}`, {
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

      let errorMessage = 'Erro ao buscar avaliações do restaurante';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    const avaliacoes = await response.json();
    console.log('✅ Avaliações do restaurante encontradas:', avaliacoes.length);
    return avaliacoes;

  } catch (error) {
    console.error('❌ Erro ao buscar avaliações do restaurante:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Erro de conexão ao buscar avaliações do restaurante');
  }
};

// Função para buscar todas as avaliações de restaurantes
export const buscarTodasAvaliacoesRestaurante = async (): Promise<AvaliacaoRestauranteResponse[]> => {
  console.log('📋 === BUSCANDO TODAS AS AVALIAÇÕES DE RESTAURANTES ===');

  try {
    const response = await fetch(`${API_BASE_URL}/avaliacoes`, {
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

      let errorMessage = 'Erro ao buscar avaliações de restaurantes';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    const avaliacoes = await response.json();
    console.log('✅ Todas as avaliações de restaurantes encontradas:', avaliacoes.length);
    return avaliacoes;

  } catch (error) {
    console.error('❌ Erro ao buscar avaliações de restaurantes:', error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Erro de conexão ao buscar avaliações de restaurantes');
  }
};

// Função para calcular a média de avaliações de um restaurante
export const calcularMediaAvaliacoesRestaurante = (avaliacoes: AvaliacaoRestauranteResponse[]): number => {
  if (avaliacoes.length === 0) {
    return 0;
  }

  const somaNotas = avaliacoes.reduce((total, avaliacao) => total + avaliacao.nota, 0);
  const media = somaNotas / avaliacoes.length;
  
  // Arredondar para 1 casa decimal
  return Math.round(media * 10) / 10;
};

// Função para formatar data de avaliação
export const formatarDataAvaliacaoRestaurante = (dataAvaliacao: string): string => {
  try {
    const data = new Date(dataAvaliacao);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.warn('⚠️ Erro ao formatar data da avaliação:', error);
    return dataAvaliacao;
  }
};
