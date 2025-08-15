// Importa o framework Express para criar rotas web
const express = require('express');
// Cria um roteador para organizar todas as rotas de usuários
const router = express.Router();
// Importa o serviço que faz a ponte de comunicação com o backend Java
const backendService = require('../services/backendService');

// ===== ROTA: LOGIN DE CLIENTE =====
// Endpoint: POST /users/login
// Função: Recebe email e senha do frontend, envia para o Java, retorna resposta
router.post('/login', async (req, res) => {
    try {
        // Envia dados de login para o endpoint /users/login do backend Java
        const data = await backendService.sendRequest('/users/login', req.body);
        // Retorna a resposta do Java diretamente para o frontend
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro no login do cliente:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// ===== ROTA: CADASTRO DE CLIENTE =====
// Endpoint: POST /users/register
// Função: Recebe dados do novo cliente, envia para o Java, retorna cliente criado
router.post('/register', async (req, res) => {
    try {
        // Envia dados de cadastro para o endpoint /users/register do Java
        const data = await backendService.sendRequest('/users/register', req.body);
        // Retorna os dados do cliente criado pelo Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro no cadastro do cliente:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao registrar' });
    }
});

// ===== ROTA: LOGOUT DO USUÁRIO =====
// Endpoint: POST /users/logout
// Função: Envia comando de logout para o Java, retorna sucesso sem conteúdo
router.post('/logout', async (req, res) => {
    try {
        // Faz requisição POST para /logout no Java
        await backendService.sendRequest('/logout', {}, 'POST');
        // Retorna status 204 (sucesso sem conteúdo) para o frontend
        res.status(204).send();
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro no logout:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao fazer logout' });
    }
});

// ===== ROTA: SESSÃO ATUAL DO USUÁRIO =====
// Endpoint: GET /users/me/session
// Função: Busca dados da sessão atual do usuário logado no Java
router.get('/me/session', async (req, res) => {
    try {
        // Faz requisição GET para /clientes/me no Java (usuário atual logado)
        const data = await backendService.sendRequest('/clientes/me', {}, 'GET');
        // Retorna dados da sessão atual recebidos do Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao buscar sessão:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao buscar sessão' });
    }
});

// ===== ROTA: BUSCAR ENDEREÇO POR CEP =====
// Endpoint: GET /users/cep/:cep
// Função: Consulta endereço no Java pelo CEP, retorna dados do endereço
router.get('/cep/:cep', async (req, res) => {
    try {
        // Extrai o CEP dos parâmetros da URL (ex: /users/cep/12345678)
        const { cep } = req.params;
        // Valida formato básico do CEP (8 dígitos)
        if (!/^\d{8}$/.test(cep)) {
            return res.status(400).json({ error: 'CEP deve conter exatamente 8 dígitos' });
        }
        // Faz requisição GET para /cep/{cep} no Java
        const data = await backendService.sendRequest(`/cep/${cep}`, {}, 'GET');
        // Retorna os dados do endereço encontrado pelo Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao buscar CEP:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao buscar CEP' });
    }
});

// ===== ROTA: LISTAR TODOS OS CLIENTES =====
// Endpoint: GET /users
// Função: Busca lista de todos os clientes no Java, retorna para o frontend
router.get('/', async (req, res) => {
    try {
        // Faz requisição GET para o endpoint /clientes do Java
        const data = await backendService.sendRequest('/clientes', {}, 'GET');
        // Retorna a lista de clientes recebida do Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao listar clientes:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao listar clientes' });
    }
});

// ===== ROTA: BUSCAR CLIENTE POR ID =====
// Endpoint: GET /users/:id
// Função: Busca cliente específico no Java pelo ID, retorna dados do cliente
// IMPORTANTE: Esta rota deve ficar POR ÚLTIMO entre as rotas GET para evitar conflitos
router.get('/:id', async (req, res) => {
    try {
        // Valida se o ID é um número
        const { id } = req.params;
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ error: 'ID deve ser um número válido' });
        }
        // Faz requisição GET para /clientes/{id} no Java
        const data = await backendService.sendRequest(`/clientes/${id}`, {}, 'GET');
        // Retorna os dados do cliente encontrado pelo Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao buscar cliente:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
});

// ===== ROTA: ATUALIZAR DADOS DO CLIENTE =====
// Endpoint: PUT /users/:id
// Função: Envia dados atualizados para o Java, retorna cliente atualizado
router.put('/:id', async (req, res) => {
    try {
        // Valida se o ID é um número
        const { id } = req.params;
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ error: 'ID deve ser um número válido' });
        }
        // Faz requisição PUT para /clientes/{id} no Java com os novos dados
        const data = await backendService.sendRequest(`/clientes/${id}`, req.body, 'PUT');
        // Retorna os dados atualizados do cliente pelo Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao atualizar cliente:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
});

// ===== ROTA: DELETAR CLIENTE =====
// Endpoint: DELETE /users/:id
// Função: Remove cliente no Java, retorna sucesso sem conteúdo
router.delete('/:id', async (req, res) => {
    try {
        // Valida se o ID é um número
        const { id } = req.params;
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ error: 'ID deve ser um número válido' });
        }
        // Faz requisição DELETE para /clientes/{id} no Java
        await backendService.sendRequest(`/clientes/${id}`, {}, 'DELETE');
        // Retorna status 204 (sucesso sem conteúdo) para o frontend
        res.status(204).send();
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao deletar cliente:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
});

// Exporta o roteador para ser usado no servidor principal (index.js)
module.exports = router;