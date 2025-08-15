// Importa o framework Express para criar rotas web
const express = require('express');
// Cria um roteador para organizar todas as rotas de pedidos
const router = express.Router();
// Importa o serviço que faz a ponte de comunicação com o backend Java
const backendService = require('../services/backendService');

// ===== ROTA: CRIAR PEDIDO (APENAS USUÁRIOS COMUNS) =====
// Endpoint: POST /orders/create
// Função: Recebe dados do novo pedido, envia para o Java, retorna pedido criado
router.post('/create', async (req, res) => {
    try {
        // Envia dados do pedido para o endpoint /pedidos do backend Java
        const data = await backendService.sendRequest('/pedidos', req.body);
        // Retorna os dados do pedido criado pelo Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao criar pedido:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao criar pedido' });
    }
});

// ===== ROTA: LISTAR PEDIDOS DO USUÁRIO =====
// Endpoint: GET /orders/user/:userId
// Função: Busca todos os pedidos de um usuário específico no Java
router.get('/user/:userId', async (req, res) => {
    try {
        // Faz requisição GET para /pedidos/usuario/{userId} no Java
        const data = await backendService.sendRequest(`/pedidos/usuario/${req.params.userId}`, {}, 'GET');
        // Retorna a lista de pedidos do usuário recebida do Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao listar pedidos:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
});

// ===== ROTA: BUSCAR PEDIDO POR ID =====
// Endpoint: GET /orders/:id
// Função: Busca pedido específico no Java pelo ID, retorna dados do pedido
router.get('/:id', async (req, res) => {
    try {
        // Faz requisição GET para /pedidos/{id} no Java
        const data = await backendService.sendRequest(`/pedidos/${req.params.id}`, {}, 'GET');
        // Retorna os dados do pedido encontrado pelo Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao buscar pedido:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
});

// ===== ROTA: ATUALIZAR STATUS DO PEDIDO =====
// Endpoint: PUT /orders/:id/status
// Função: Atualiza o status do pedido no Java (ex: em preparo, entregue)
router.put('/:id/status', async (req, res) => {
    try {
        // Faz requisição PUT para /pedidos/{id}/status no Java com o novo status
        const data = await backendService.sendRequest(`/pedidos/${req.params.id}/status`, req.body, 'PUT');
        // Retorna os dados atualizados do pedido pelo Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao atualizar status:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
    }
});

// ===== ROTA: CANCELAR PEDIDO =====
// Endpoint: PUT /orders/:id/cancel
// Função: Cancela um pedido no Java, retorna pedido cancelado
router.put('/:id/cancel', async (req, res) => {
    try {
        // Faz requisição PUT para /pedidos/{id}/cancelar no Java
        const data = await backendService.sendRequest(`/pedidos/${req.params.id}/cancelar`, {}, 'PUT');
        // Retorna os dados do pedido cancelado pelo Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao cancelar pedido:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao cancelar pedido' });
    }
});

// ===== ROTA: HISTÓRICO DE PEDIDOS =====
// Endpoint: GET /orders/history/:userId
// Função: Busca histórico completo de pedidos de um usuário no Java
router.get('/history/:userId', async (req, res) => {
    try {
        // Faz requisição GET para /pedidos/historico/{userId} no Java
        const data = await backendService.sendRequest(`/pedidos/historico/${req.params.userId}`, {}, 'GET');
        // Retorna o histórico de pedidos recebido do Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao buscar histórico:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao buscar histórico de pedidos' });
    }
});

// Exporta o roteador para ser usado no servidor principal (index.js)
module.exports = router;
