// Importa o framework Express para criar rotas web
const express = require('express');
// Cria um roteador para organizar todas as rotas de relatórios
const router = express.Router();
// Importa o serviço que faz a ponte de comunicação com o backend Java
const backendService = require('../services/backendService');

// ===== ROTA: RELATÓRIO DE VENDAS POR PERÍODO =====
// Endpoint: GET /relatorios/vendas/:restauranteId
// Função: Gera relatório de vendas de um restaurante em um período específico
router.get('/vendas/:restauranteId', async (req, res) => {
    try {
        // Pega o ID do restaurante dos parâmetros da URL
        const { restauranteId } = req.params;
        // Pega as datas de início e fim dos parâmetros de query (ex: ?dataInicio=2024-01-01&dataFim=2024-01-31)
        const { dataInicio, dataFim } = req.query;
        
        // Cria objeto com os parâmetros para enviar ao Java
        const params = { dataInicio, dataFim };
        // Faz requisição GET para o endpoint de relatório de vendas no Java
        const data = await backendService.sendRequest(`/relatorios/vendas/${restauranteId}`, params, 'GET');
        // Retorna os dados do relatório recebidos do Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao gerar relatório de vendas:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao gerar relatório de vendas' });
    }
});

// ===== ROTA: RELATÓRIO DE PEDIDOS POR STATUS =====
// Endpoint: GET /relatorios/pedidos/:restauranteId
// Função: Gera relatório de pedidos de um restaurante filtrado por status e período
router.get('/pedidos/:restauranteId', async (req, res) => {
    try {
        // Pega o ID do restaurante dos parâmetros da URL
        const { restauranteId } = req.params;
        // Pega status, data início e fim dos parâmetros de query
        const { status, dataInicio, dataFim } = req.query;
        
        // Cria objeto com os parâmetros para enviar ao Java
        const params = { status, dataInicio, dataFim };
        // Faz requisição GET para o endpoint de relatório de pedidos no Java
        const data = await backendService.sendRequest(`/relatorios/pedidos/${restauranteId}`, params, 'GET');
        // Retorna os dados do relatório recebidos do Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao gerar relatório de pedidos:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao gerar relatório de pedidos' });
    }
});

// ===== ROTA: RELATÓRIO DE PRODUTOS MAIS VENDIDOS =====
// Endpoint: GET /relatorios/produtos/:restauranteId
// Função: Gera relatório dos produtos mais vendidos de um restaurante
router.get('/produtos/:restauranteId', async (req, res) => {
    try {
        // Pega o ID do restaurante dos parâmetros da URL
        const { restauranteId } = req.params;
        // Pega datas e limite de produtos dos parâmetros de query
        const { dataInicio, dataFim, limite } = req.query;
        
        // Cria objeto com os parâmetros para enviar ao Java
        const params = { dataInicio, dataFim, limite };
        // Faz requisição GET para o endpoint de relatório de produtos no Java
        const data = await backendService.sendRequest(`/relatorios/produtos/${restauranteId}`, params, 'GET');
        // Retorna os dados do relatório recebidos do Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao gerar relatório de produtos:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao gerar relatório de produtos' });
    }
});

// ===== ROTA: RELATÓRIO FINANCEIRO =====
// Endpoint: GET /relatorios/financeiro/:restauranteId
// Função: Gera relatório financeiro de um restaurante por mês/ano
router.get('/financeiro/:restauranteId', async (req, res) => {
    try {
        // Pega o ID do restaurante dos parâmetros da URL
        const { restauranteId } = req.params;
        // Pega mês e ano dos parâmetros de query
        const { mes, ano } = req.query;
        
        // Cria objeto com os parâmetros para enviar ao Java
        const params = { mes, ano };
        // Faz requisição GET para o endpoint de relatório financeiro no Java
        const data = await backendService.sendRequest(`/relatorios/financeiro/${restauranteId}`, params, 'GET');
        // Retorna os dados do relatório recebidos do Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao gerar relatório financeiro:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao gerar relatório financeiro' });
    }
});

// ===== ROTA: RELATÓRIO DE CLIENTES =====
// Endpoint: GET /relatorios/clientes/:restauranteId
// Função: Gera relatório de clientes de um restaurante em um período específico
router.get('/clientes/:restauranteId', async (req, res) => {
    try {
        // Pega o ID do restaurante dos parâmetros da URL
        const { restauranteId } = req.params;
        // Pega as datas de início e fim dos parâmetros de query
        const { dataInicio, dataFim } = req.query;
        
        // Cria objeto com os parâmetros para enviar ao Java
        const params = { dataInicio, dataFim };
        // Faz requisição GET para o endpoint de relatório de clientes no Java
        const data = await backendService.sendRequest(`/relatorios/clientes/${restauranteId}`, params, 'GET');
        // Retorna os dados do relatório recebidos do Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao gerar relatório de clientes:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao gerar relatório de clientes' });
    }
});

// Exporta o roteador para ser usado no servidor principal (index.js)
module.exports = router;
