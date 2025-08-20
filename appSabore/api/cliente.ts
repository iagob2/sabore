// Camada de comunicação com o backend para Cliente
// Usa cookie de sessão (JSESSIONID), portanto credentials: 'include'

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface ClienteCreate {
  nome: string;
  telefone?: string;
  cpf: string;
  email: string;
  senha: string;
  cep?: string;
  rua?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  numero?: string; // No backend Cliente.numero é String
  aceitaProtecaoDados: boolean;
  aceitaMarketing?: boolean;
  aceitaAtendimento?: boolean;
}

export interface ClienteResponse {
  id: number;
  nome: string;
  telefone?: string;
  cpf: string;
  email: string;
  cep?: string;
  rua?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  numero?: string;
  aceitaProtecaoDados: boolean;
  aceitaMarketing?: boolean;
  aceitaAtendimento?: boolean;
}

export interface EnderecoLookupResponse {
  cep?: string;
  rua?: string; // logradouro
  bairro?: string;
  cidade?: string; // localidade
  estado?: string; // uf
}

export interface SessaoResponse {
  email: string;
  nome?: string;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

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

  // DELETE 204 sem body
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return (await response.json()) as T;
}

// Autenticação
// Login padrão Spring Security (formLogin em POST /login)
export async function loginCliente(payload: LoginRequest): Promise<void> {
  const form = new URLSearchParams();
  form.set('username', payload.email);
  form.set('password', payload.senha);

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
    credentials: 'include',
    redirect: 'follow',
  });

  if (!response.ok && response.status !== 204) {
    throw new Error('Falha no login.');
  }
}

// CRUD Cliente
export async function cadastrarCliente(payload: ClienteCreate): Promise<ClienteResponse> {
  return request('/clientes', { method: 'POST', body: payload });
}

export async function listarClientes(): Promise<ClienteResponse[]> {
  return request('/clientes');
}

export async function buscarCliente(id: number): Promise<ClienteResponse> {
  return request(`/clientes/${id}`);
}

export async function atualizarCliente(id: number, payload: Partial<ClienteCreate>): Promise<ClienteResponse> {
  return request(`/clientes/${id}`, { method: 'PUT', body: payload });
}

export async function deletarCliente(id: number): Promise<void> {
  await request<void>(`/clientes/${id}`, { method: 'DELETE' });
}

// Sessão atual do usuário logado (depende do backend expor esse endpoint)
export async function getSessao(): Promise<SessaoResponse> {
  const data = await request<any>('/clientes/me');
  return {
    email: data.email ?? data.username ?? data.user?.email,
    nome: data.nome ?? data.name ?? data.user?.nome,
  } as SessaoResponse;
}

// Logout (Spring Security padrão usa POST /logout)
export async function logoutCliente(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
    redirect: 'manual',
  });
  // Spring Security geralmente retorna 302 para /login?logout, ou 200/204 se customizado
  if (res.status === 200 || res.status === 204 || res.status === 302 || res.status === 0) {
    return;
  }
  // Se já não estiver autenticado, podemos considerar ok
  if (res.status === 401) return;
  throw new Error('Falha no logout');
}

// Busca CEP pelo backend (se disponível) com fallback para ViaCEP público
export async function buscarEnderecoPorCep(cep: string): Promise<EnderecoLookupResponse> {
  const sanitized = (cep || '').replace(/\D/g, '');
  if (sanitized.length !== 8) {
    throw new Error('O CEP deve conter 8 dígitos.');
  }

  // Tenta backend em caminhos comuns
  const backendPaths = [`/viacep/${sanitized}`, `/enderecos/cep/${sanitized}`, `/cep/${sanitized}`];
  for (const path of backendPaths) {
    try {
      const data = await request<any>(path);
      // Normaliza possíveis formatos do backend
      const normalized: EnderecoLookupResponse = {
        cep: data.cep ?? data.CEP ?? undefined,
        rua: data.rua ?? data.logradouro ?? undefined,
        bairro: data.bairro ?? undefined,
        cidade: data.cidade ?? data.localidade ?? undefined,
        estado: data.estado ?? data.uf ?? undefined,
      };
      if (normalized.cidade || normalized.rua || normalized.estado || normalized.bairro) {
        return normalized;
      }
    } catch {
      // tenta próximo path
    }
  }

  // Fallback: ViaCEP público
  const viaCepUrl = `https://viacep.com.br/ws/${sanitized}/json/`;
  const res = await fetch(viaCepUrl);
  if (!res.ok) {
    throw new Error('Falha ao consultar CEP.');
  }
  const data = await res.json();
  if (data.erro) {
    throw new Error('CEP não encontrado.');
  }
  return {
    cep: data.cep,
    rua: data.logradouro,
    bairro: data.bairro,
    cidade: data.localidade,
    estado: data.uf,
  };
}
