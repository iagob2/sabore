// Camada de comunicação com o backend para Restaurante

export interface RestauranteLoginRequest {
  email: string;
  senha: string;
}

export interface RestauranteCreate {
  nome: string;
  cnpj: string;
  telefone?: string;
  email: string;
  senha: string;
  rua?: string;
  numero?: number; // backend usa Integer
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  descricao?: string;
  horario?: string;
  lotacao?: number; // backend usa Integer
  site?: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  cardapioUrl?: string;
  logoUrl?: string;
  bannerUrl?: string;
  aceitaComunicacao?: boolean;
  aceitaMarketing?: boolean;
  aceitaProtecaoDados?: boolean;
}

export interface RestauranteResponse {
  id: number;
  nome: string;
  cnpj: string;
  telefone?: string;
  email: string;
  rua?: string;
  numero?: number;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  descricao?: string;
  horario?: string;
  lotacao?: number;
  site?: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  cardapioUrl?: string;
  logoUrl?: string;
  bannerUrl?: string;
  aceitaComunicacao?: boolean;
  aceitaMarketing?: boolean;
  aceitaProtecaoDados?: boolean;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

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

export interface UploadAsset {
  uri: string;
  name?: string;
  mimeType?: string; // opcional
}

// Upload de arquivo do restaurante. Retorna a URL do arquivo salvo
export async function uploadRestauranteArquivo(tipo: 'logo' | 'banner' | 'cardapio', asset: UploadAsset): Promise<string> {
  // Busca o blob a partir do URI local
  const res = await fetch(asset.uri);
  if (!res.ok) throw new Error('Falha ao ler arquivo local');
  const blob = await res.blob();

  const filename = asset.name || `arquivo-${tipo}-${Date.now()}`;
  const form = new FormData();
  // Em navegadores, o terceiro parâmetro define o nome do arquivo
  form.append('file', blob as any, filename);
  
  // Baseado no controller, vamos usar os endpoints corretos
  const endpoints = [
    `/restaurantes/upload/${tipo}`, // Endpoint com tipo na URL
    `/restaurantes/upload`          // Endpoint com tipo como RequestParam
  ];

  let lastErr: any = null;
  
  // Primeiro tenta com tipo na URL
  try {
    const uploadRes = await fetch(`${API_BASE_URL}${endpoints[0]}`, {
      method: 'POST',
      body: form as any,
      credentials: 'include',
    });
    
    if (uploadRes.ok) {
      const data = await uploadRes.json();
      const url: string | undefined = data.url;
      if (!url) throw new Error('Resposta de upload sem URL');
      return url;
    }
    lastErr = new Error(`Falha no upload com tipo na URL (${uploadRes.status})`);
  } catch (e) {
    lastErr = e;
  }

  // Se falhar, tenta com tipo como RequestParam
  try {
    const formWithTipo = new FormData();
    formWithTipo.append('file', blob as any, filename);
    formWithTipo.append('tipo', tipo); // Adiciona tipo como RequestParam
    
    const uploadRes = await fetch(`${API_BASE_URL}${endpoints[1]}`, {
      method: 'POST',
      body: formWithTipo as any,
      credentials: 'include',
    });
    
    if (uploadRes.ok) {
      const data = await uploadRes.json();
      const url: string | undefined = data.url;
      if (!url) throw new Error('Resposta de upload sem URL');
      return url;
    }
    lastErr = new Error(`Falha no upload com RequestParam (${uploadRes.status})`);
  } catch (e) {
    lastErr = e;
  }

  throw (lastErr || new Error('Falha ao fazer upload'));
}

// Login custom do controller de restaurantes
export async function loginRestaurante(payload: RestauranteLoginRequest): Promise<RestauranteResponse> {
  return request('/restaurantes/login', { method: 'POST', body: payload });
}

export async function cadastrarRestaurante(payload: RestauranteCreate): Promise<RestauranteResponse> {
  return request('/restaurantes', { method: 'POST', body: payload });
}

export async function listarRestaurantes(): Promise<RestauranteResponse[]> {
  return request('/restaurantes');
}

export async function buscarRestaurante(id: number): Promise<RestauranteResponse> {
  return request(`/restaurantes/${id}`);
}

export async function atualizarRestaurante(id: number, payload: Partial<RestauranteCreate>): Promise<RestauranteResponse> {
  return request(`/restaurantes/${id}`, { method: 'PUT', body: payload });
}

export async function deletarRestaurante(id: number): Promise<void> {
  await request<void>(`/restaurantes/${id}`, { method: 'DELETE' });
}

// aqui