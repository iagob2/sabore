// Camada de comunicação com o backend para ItemRestaurante

export interface ItemRestauranteCreate {
  nome: string;
  descricao?: string; // Usado para ingredientes no frontend
  preco: number; // Double no backend
  imagemUrl?: string;
  restaurante: {
    id: number;
  };
}

export interface ItemRestauranteResponse {
  id: number;
  nome: string;
  descricao?: string; // Usado para ingredientes no frontend
  preco: number; // Double no backend
  imagemUrl?: string;
  restaurante: {
    id: number;
    nome: string;
    // outros campos do restaurante podem vir aqui
  };
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Usa a mesma API_BASE_URL do restaurante
import { API_BASE_URL } from './restaurante';

async function request<T>(path: string, options?: { method?: HttpMethod; body?: unknown }): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options?.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  });

  if (!response.ok) {
    let message = `Erro ${response.status}`;
    
    try {
      const data = await response.json();
      if (data && typeof data.message === 'string') {
        message = data.message;
      }
    } catch (_) {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return (await response.json()) as T;
}

// Funções da API baseadas no controller

export async function cadastrarItem(payload: ItemRestauranteCreate): Promise<ItemRestauranteResponse> {
  return request('/itens', { method: 'POST', body: payload });
}

export async function buscarTodosItens(): Promise<ItemRestauranteResponse[]> {
  return request('/itens');
}

export async function buscarItemPorId(id: number): Promise<ItemRestauranteResponse> {
  return request(`/itens/${id}`);
}

export async function atualizarItem(id: number, payload: Partial<ItemRestauranteCreate>): Promise<ItemRestauranteResponse> {
  return request(`/itens/${id}`, { method: 'PUT', body: payload });
}

export async function deletarItem(id: number): Promise<void> {
  await request<void>(`/itens/${id}`, { method: 'DELETE' });
}

// Função mais importante para nosso caso: buscar itens por restaurante
export async function buscarItensPorRestaurante(restauranteId: number): Promise<ItemRestauranteResponse[]> {
  return request(`/itens/restaurante/${restauranteId}`);
}

// Nova função de upload de imagem para itens
export interface UploadAssetItem {
  uri: string;
  name?: string;
  mimeType?: string;
}

export async function uploadItemImagem(asset: UploadAssetItem): Promise<string> {
  // Busca o blob a partir do URI local
  const res = await fetch(asset.uri);
  if (!res.ok) throw new Error('Falha ao ler arquivo local');
  const blob = await res.blob();

  const filename = asset.name || `item-${Date.now()}.jpg`;
  const form = new FormData();
  form.append('file', blob as any, filename);
  
  const uploadRes = await fetch(`${API_BASE_URL}/itens/upload`, {
    method: 'POST',
    body: form as any,
    credentials: 'include',
  });
  
  if (!uploadRes.ok) {
    throw new Error(`Falha no upload da imagem (${uploadRes.status})`);
  }
  
  const data = await uploadRes.json();
  const url: string | undefined = data.url;
  if (!url) throw new Error('Resposta de upload sem URL');
  
  return url;
}
