// Importa a biblioteca axios para fazer requisições HTTP para o backend Java
const axios = require('axios');

// ===== CONFIGURAÇÃO DA URL DO BACKEND CENTRAL =====
// ===== IMPORTANTE: ALTERAR ESTA LINHA PARA CONECTAR COM BACKEND JAVA REAL =====
// URL do backend Java - pode ser configurada por variável de ambiente
// ATUAL: http://localhost:8080/api (para desenvolvimento local)
// ALTERAR PARA: http://IP-DO-SEU-COLEGA:8080/api (para backend real)
const BACKEND_CENTRAL_URL = process.env.BACKEND_CENTRAL_URL || 'http://localhost:8080/api';

// ===== CONFIGURAÇÃO DE TIMEOUT =====
// Tempo máximo (em milissegundos) para aguardar resposta do Java
const REQUEST_TIMEOUT = 5000;

// ===== CONFIGURAÇÃO DO CLIENTE HTTP =====
// Cria um cliente axios configurado para comunicar com o backend Java
const apiClient = axios.create({
    // URL base para todas as requisições
    baseURL: BACKEND_CENTRAL_URL,
    // Timeout configurado para evitar travamentos
    timeout: REQUEST_TIMEOUT,
    // Cabeçalho padrão para indicar que os dados são JSON
    headers: {
        'Content-Type': 'application/json',
    }
});

// ===== INTERCEPTOR PARA LOGS DE REQUISIÇÃO =====
// Registra informações antes de enviar cada requisição para o Java
apiClient.interceptors.request.use(
    (config) => {
        // Mostra qual método HTTP e para qual URL está sendo enviado
        console.log(`📤 Enviando ${config.method?.toUpperCase()} para: ${config.url}`);
        // Se houver dados no corpo da requisição, mostra o conteúdo
        if (config.data && Object.keys(config.data).length > 0) {
            console.log('📦 Payload:', JSON.stringify(config.data, null, 2));
        }
        // Retorna a configuração para continuar com a requisição
        return config;
    },
    (error) => {
        // Se der erro na configuração da requisição, registra no console
        console.error('❌ Erro na requisição:', error.message);
        // Rejeita a Promise para tratamento no código
        return Promise.reject(error);
    }
);

// ===== INTERCEPTOR PARA LOGS DE RESPOSTA =====
// Registra informações após receber cada resposta do Java
apiClient.interceptors.response.use(
    (response) => {
        // Mostra que recebeu resposta e qual foi o status
        console.log(`✅ Resposta recebida de ${response.config.url}: ${response.status}`);
        // Retorna a resposta para continuar o processamento
        return response;
    },
    (error) => {
        // Se der erro na resposta, registra detalhes específicos
        if (error.response) {
            // Erro com resposta do servidor (ex: 404, 500)
            console.error(`❌ Erro ${error.response.status} de ${error.config.url}:`, error.response.data);
        } else if (error.request) {
            // Erro sem resposta (ex: servidor offline)
            console.error('❌ Sem resposta do backend central:', error.message);
        } else {
            // Erro na configuração da requisição
            console.error('❌ Erro na configuração:', error.message);
        }
        // Rejeita a Promise para tratamento no código
        return Promise.reject(error);
    }
);

// ===== FUNÇÃO PRINCIPAL PARA ENVIAR REQUISIÇÕES =====
// Função que faz a ponte entre o intermediário e o backend Java
exports.sendRequest = async (endpoint, payload = {}, method = 'POST') => {
    try {
        // ===== VALIDAÇÕES BÁSICAS =====
        // Verifica se o endpoint foi fornecido e é uma string válida
        if (!endpoint || typeof endpoint !== 'string') {
            throw new Error('Endpoint inválido');
        }

        // Verifica se o método HTTP é válido
        const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
        if (!validMethods.includes(method.toUpperCase())) {
            throw new Error(`Método HTTP inválido: ${method}`);
        }

        // ===== CONFIGURAÇÃO DA REQUISIÇÃO =====
        // Prepara a configuração para enviar para o Java
        const config = {
            // Método HTTP em maiúsculo (GET, POST, PUT, DELETE)
            method: method.toUpperCase(),
            // Endpoint específico (ex: /clientes, /pedidos)
            url: endpoint,
            // Para métodos que não são GET, envia dados no corpo
            data: method.toUpperCase() !== 'GET' ? payload : undefined,
            // Para método GET, envia dados como parâmetros de URL
            params: method.toUpperCase() === 'GET' ? payload : undefined
        };

        // Registra qual requisição está sendo feita
        console.log(`🔄 Fazendo ${config.method} para: ${endpoint}`);
        
        // ===== ENVIO DA REQUISIÇÃO =====
        // Envia a requisição para o backend Java usando o cliente configurado
        const response = await apiClient(config);
        // Retorna apenas os dados da resposta (sem cabeçalhos HTTP)
        return response.data;
        
    } catch (err) {
        // ===== TRATAMENTO DE ERROS =====
        // Log detalhado do erro para facilitar o debug
        console.error('💥 Erro ao comunicar com backend central:');
        console.error('   Endpoint:', endpoint);
        console.error('   Método:', method);
        console.error('   Erro:', err.message);
        
        // Re-throw do erro para tratamento no controller (rota)
        throw err;
    }
};

// ===== FUNÇÃO PARA VERIFICAR SAÚDE DO BACKEND =====
// Verifica se o backend Java está online e funcionando
exports.healthCheck = async () => {
    try {
        // Faz requisição GET para /health no backend Java
        const response = await apiClient.get('/health');
        // Retorna status online com dados da resposta
        return {
            status: 'online',
            response: response.data,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        // Se der erro, retorna status offline
        return {
            status: 'offline',
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
};

// ===== FUNÇÃO PARA OBTER INFORMAÇÕES DO BACKEND =====
// Busca informações gerais do backend Java
exports.getBackendInfo = async () => {
    try {
        // Faz requisição GET para /info no backend Java
        const response = await apiClient.get('/info');
        // Retorna as informações recebidas
        return response.data;
    } catch (error) {
        // Se der erro, registra no console e retorna null
        console.error('Erro ao obter informações do backend:', error.message);
        return null;
    }
};
