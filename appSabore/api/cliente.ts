// Camada de comunicação com o backend para Cliente
// Usa cookie de sessão (JSESSIONID), portanto credentials: 'include'

import { API_BASE_URL } from './restaurante';

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
  id?: number;
  telefone?: string;
  cpf?: string;
  cep?: string;
  rua?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  numero?: string;
  aceitaProtecaoDados?: boolean;
  aceitaMarketing?: boolean;
  aceitaAtendimento?: boolean;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

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
// Login usando endpoint customizado do backend: POST /clientes/login
export async function loginCliente(payload: LoginRequest): Promise<void> {
  console.log('🔐 === INICIANDO LOGIN ===');
  console.log('📧 Email:', payload.email);
  console.log('🌐 API_BASE_URL:', API_BASE_URL);
  console.log('🔗 URL completa:', `${API_BASE_URL}/clientes/login`);

  try {
    const response = await fetch(`${API_BASE_URL}/clientes/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: payload.email,
        senha: payload.senha,
      }),
      credentials: 'include', // Importante para receber cookies JSESSIONID
    });

    console.log('📡 Status da resposta:', response.status);
    console.log('📡 Headers da resposta:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = 'Falha no login.';
      
      // Tentar ler mensagem de erro do backend
      try {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const errorText = await response.text();
          if (errorText && !errorText.startsWith('<!')) {
            errorMessage = errorText;
          }
        }
      } catch (e) {
        // Se não conseguir ler erro, usar mensagem padrão
        console.warn('⚠️ Não foi possível ler mensagem de erro:', e);
      }
      
      console.error('❌ Erro no login:', errorMessage);
      throw new Error(errorMessage);
    }

    // Login bem-sucedido
    const data = await response.json();
    console.log('✅ Login realizado com sucesso:', data);
    
    // Verificar se recebeu cookie JSESSIONID (será enviado automaticamente pelo servidor)
    console.log('🍪 Verificando se cookie JSESSIONID foi recebido...');
    
    // O cookie será armazenado automaticamente pelo navegador devido ao credentials: 'include'
    return;
  } catch (error) {
    console.error('❌ Erro ao fazer login:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro desconhecido ao fazer login.');
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

// Sessão atual do usuário logado (retorna dados completos do cliente)
export async function getSessao(): Promise<SessaoResponse> {
  try {
    const data = await request<any>('/clientes/me');
    
    // Mapear dados dependendo da estrutura retornada pelo backend
    const mapped = {
      id: data.id ?? data.clienteId ?? data.cliente?.id,
      email: data.email ?? data.username ?? data.user?.email ?? data.cliente?.email,
      nome: data.nome ?? data.name ?? data.user?.nome ?? data.cliente?.nome,
      telefone: data.telefone ?? data.cliente?.telefone,
      cpf: data.cpf ?? data.cliente?.cpf,
      cep: data.cep ?? data.cliente?.cep,
      rua: data.rua ?? data.cliente?.rua ?? data.logradouro,
      bairro: data.bairro ?? data.cliente?.bairro,
      cidade: data.cidade ?? data.cliente?.cidade ?? data.localidade,
      estado: data.estado ?? data.cliente?.estado ?? data.uf,
      numero: data.numero ?? data.cliente?.numero,
      aceitaProtecaoDados: data.aceitaProtecaoDados ?? data.cliente?.aceitaProtecaoDados,
      aceitaMarketing: data.aceitaMarketing ?? data.cliente?.aceitaMarketing,
      aceitaAtendimento: data.aceitaAtendimento ?? data.cliente?.aceitaAtendimento,
    } as SessaoResponse;
    
    return mapped;
    
  } catch (error: any) {
    // 401 é esperado quando o usuário não está autenticado - não logar como erro
    if (error?.message?.includes('401') || error?.message?.includes('Erro 401')) {
      // Silenciar - é comportamento esperado quando não há sessão ativa
      throw error;
    }
    
    // Para outros erros, logar apenas em modo debug (pode ser removido em produção)
    if (__DEV__) {
      console.warn('⚠️ Erro ao buscar sessão (não é 401):', error?.message || error);
    }
    throw error;
  }
}

// Função para buscar dados completos do cliente logado (com fallback)
export async function buscarDadosClienteLogado(): Promise<ClienteResponse> {
  console.log('🔍 === INICIANDO BUSCA DE DADOS DO CLIENTE ===');
  
  try {
    // Primeiro tenta a API /clientes/me que deve retornar dados completos
    console.log('📡 Chamando API /clientes/me...');
    const sessaoData = await getSessao();
    console.log('📊 Dados da sessão recebidos:', JSON.stringify(sessaoData, null, 2));
    
    // Verificar se temos dados mínimos
    if (!sessaoData.email && !sessaoData.nome && !sessaoData.id) {
      console.warn('⚠️ Dados da sessão estão vazios ou inválidos');
      throw new Error('Dados da sessão inválidos');
    }
    
    // WORKAROUND: Se só temos email, tentar buscar por todos os clientes e encontrar o que tem esse email
    if (sessaoData.email && !sessaoData.id) {
      console.log('🔧 WORKAROUND: Tentando buscar cliente por email via /clientes...');
      try {
        const todosClientes = await listarClientes();
        console.log('📋 Total de clientes encontrados:', todosClientes.length);
        
        const clienteEncontrado = todosClientes.find(cliente => 
          cliente.email && cliente.email.toLowerCase() === sessaoData.email?.toLowerCase()
        );
        
        if (clienteEncontrado) {
          console.log('✅ Cliente encontrado por email:', JSON.stringify(clienteEncontrado, null, 2));
          return clienteEncontrado;
        } else {
          console.warn('⚠️ Nenhum cliente encontrado com email:', sessaoData.email);
        }
      } catch (error) {
        console.warn('⚠️ Erro ao buscar clientes por email:', error);
      }
    }
    
    // Se temos um ID, buscar dados completos via /clientes/{id}
    if (sessaoData.id) {
      try {
        console.log('🔍 Buscando dados completos via /clientes/' + sessaoData.id);
        const dadosCompletos = await buscarCliente(sessaoData.id);
        console.log('✅ Dados completos encontrados via /clientes/{id}:', JSON.stringify(dadosCompletos, null, 2));
        return dadosCompletos;
      } catch (error) {
        console.warn('⚠️ Erro ao buscar por ID, continuando com dados da sessão:', error);
      }
    } else {
      console.warn('⚠️ ID do cliente não encontrado na sessão');
    }
    
    // Fallback: montar ClienteResponse a partir dos dados da sessão
    const dadosUsuario = {
      id: sessaoData.id || 0,
      nome: sessaoData.nome || 'Usuário',
      email: sessaoData.email || '',
      cpf: sessaoData.cpf || '',
      telefone: sessaoData.telefone || '',
      cep: sessaoData.cep || '',
      rua: sessaoData.rua || '',
      bairro: sessaoData.bairro || '',
      cidade: sessaoData.cidade || '',
      estado: sessaoData.estado || '',
      numero: sessaoData.numero || '',
      aceitaProtecaoDados: sessaoData.aceitaProtecaoDados ?? true,
      aceitaMarketing: sessaoData.aceitaMarketing ?? false,
      aceitaAtendimento: sessaoData.aceitaAtendimento ?? false,
    };
    
    console.log('🔄 Usando dados da sessão como fallback:', JSON.stringify(dadosUsuario, null, 2));
    return dadosUsuario;
    
  } catch (error) {
    console.error('❌ Erro crítico ao buscar dados do cliente:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'Stack não disponível');
    throw error;
  }
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

  console.log('🔍 === BUSCANDO CEP ===');
  console.log('📮 CEP sanitizado:', sanitized);

  // Primeiro tenta ViaCEP público (mais confiável no mobile)
  const viaCepUrl = `https://viacep.com.br/ws/${sanitized}/json/`;
  try {
    console.log('🌐 Tentando ViaCEP público:', viaCepUrl);
    
    // Usar AbortController para timeout no React Native
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
    
    try {
      const res = await fetch(viaCepUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log('📡 Status da resposta ViaCEP:', res.status);
      
      if (!res.ok) {
        throw new Error(`ViaCEP retornou status ${res.status}`);
      }
      
      const data = await res.json();
      console.log('📊 Dados do ViaCEP:', data);
      
      if (data.erro) {
        throw new Error('CEP não encontrado no ViaCEP.');
      }
      
      const result = {
        cep: data.cep,
        rua: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
      };
      
      console.log('✅ CEP encontrado via ViaCEP:', result);
      return result;
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.warn('⏱️ Timeout ao buscar CEP no ViaCEP');
        throw new Error('Timeout ao consultar CEP. Verifique sua conexão.');
      }
      throw fetchError;
    }
  } catch (viaCepError: any) {
    console.warn('⚠️ Erro ao buscar no ViaCEP, tentando backend:', viaCepError.message);
    
    // Fallback: Tenta backend em caminhos comuns
    const backendPaths = [`/viacep/${sanitized}`, `/enderecos/cep/${sanitized}`, `/cep/${sanitized}`];
    for (const path of backendPaths) {
      try {
        console.log('🔧 Tentando backend path:', path);
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
          console.log('✅ CEP encontrado via backend:', normalized);
          return normalized;
        }
      } catch (backendError) {
        console.warn(`⚠️ Erro ao tentar path ${path}:`, backendError);
        // tenta próximo path
      }
    }
    
    // Se chegou aqui, nenhuma tentativa funcionou
    console.error('❌ Todas as tentativas de buscar CEP falharam');
    throw new Error(viaCepError.message || 'Falha ao consultar CEP. Verifique sua conexão.');
  }
}
