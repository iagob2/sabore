// Importa o framework Express para criar rotas web
const express = require('express');
// Cria um roteador para organizar todas as rotas de restaurantes
const router = express.Router();
// Importa o serviço que faz a ponte de comunicação com o backend Java
const backendService = require('../services/backendService');

// ===== ROTA: LOGIN DE RESTAURANTE =====
// Endpoint: POST /restaurantes/login
// Função: Recebe email e senha do restaurante, envia para o Java, retorna dados do restaurante
router.post('/login', async (req, res) => {
    try {
        // Envia dados de login para o endpoint /restaurantes/login do backend Java
        const data = await backendService.sendRequest('/restaurantes/login', req.body);
        // Retorna os dados do restaurante logado pelo Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro no login do restaurante:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao fazer login do restaurante' });
    }
});

// ===== ROTA: CADASTRO DE RESTAURANTE =====
// Endpoint: POST /restaurantes/register
// Função: Recebe dados do novo restaurante, envia para o Java, retorna restaurante criado
router.post('/register', async (req, res) => {
    try {
        // Envia dados de cadastro para o endpoint /restaurantes do Java
        const data = await backendService.sendRequest('/restaurantes', req.body);
        // Retorna os dados do restaurante criado pelo Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro no cadastro do restaurante:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao cadastrar restaurante' });
    }
});

// ===== ROTA: LISTAR TODOS OS RESTAURANTES =====
// Endpoint: GET /restaurantes
// Função: Busca lista de todos os restaurantes no Java, retorna para o frontend
router.get('/', async (req, res) => {
    try {
        // Faz requisição GET para o endpoint /restaurantes do Java
        const data = await backendService.sendRequest('/restaurantes', {}, 'GET');
        // Retorna a lista de restaurantes recebida do Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao listar restaurantes:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao listar restaurantes' });
    }
});

// ===== ROTA: BUSCAR RESTAURANTE POR ID =====
// Endpoint: GET /restaurantes/:id
// Função: Busca restaurante específico no Java pelo ID, retorna dados do restaurante
router.get('/:id', async (req, res) => {
    try {
        // Faz requisição GET para /restaurantes/{id} no Java
        const data = await backendService.sendRequest(`/restaurantes/${req.params.id}`, {}, 'GET');
        // Retorna os dados do restaurante encontrado pelo Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao buscar restaurante:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao buscar restaurante' });
    }
});

// ===== ROTA: ATUALIZAR DADOS DO RESTAURANTE =====
// Endpoint: PUT /restaurantes/:id
// Função: Envia dados atualizados para o Java, retorna restaurante atualizado
router.put('/:id', async (req, res) => {
    try {
        // Faz requisição PUT para /restaurantes/{id} no Java com os novos dados
        const data = await backendService.sendRequest(`/restaurantes/${req.params.id}`, req.body, 'PUT');
        // Retorna os dados atualizados do restaurante pelo Java
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao atualizar restaurante:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao atualizar restaurante' });
    }
});

// ===== ROTA: DELETAR RESTAURANTE =====
// Endpoint: DELETE /restaurantes/:id
// Função: Remove restaurante no Java, retorna sucesso sem conteúdo
router.delete('/:id', async (req, res) => {
    try {
        // Faz requisição DELETE para /restaurantes/{id} no Java
        await backendService.sendRequest(`/restaurantes/${req.params.id}`, {}, 'DELETE');
        // Retorna status 204 (sucesso sem conteúdo) para o frontend
        res.status(204).send();
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro ao deletar restaurante:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao deletar restaurante' });
    }
});

// ===== ROTA: UPLOAD DE ARQUIVOS DO RESTAURANTE =====
// Endpoint: POST /restaurantes/upload/:tipo
// Função: Recebe arquivo (logo, banner, cardápio), envia para o Java, retorna URL do arquivo
router.post('/upload/:tipo', async (req, res) => {
    try {
        // Pega o tipo de upload dos parâmetros da URL (logo, banner, cardapio)
        const { tipo } = req.params;
        // Cria um FormData para enviar o arquivo
        const formData = new FormData();
        
        // Verifica se o arquivo foi enviado na requisição
        if (req.files && req.files.file) {
            // Adiciona o arquivo ao FormData
            formData.append('file', req.files.file);
            // Adiciona o tipo de arquivo ao FormData
            formData.append('tipo', tipo);
        }
        
        // Envia o arquivo para o endpoint de upload do Java
        const data = await backendService.sendRequest(`/restaurantes/upload/${tipo}`, formData);
        // Retorna a resposta do Java (geralmente a URL do arquivo salvo)
        res.json(data);
    } catch (err) {
        // Se der erro, registra no console para debug
        console.error('Erro no upload:', err.message);
        // Retorna erro 500 (erro interno) para o frontend
        res.status(500).json({ error: 'Erro ao fazer upload' });
    }
});

// Exporta o roteador para ser usado no servidor principal (index.js)
module.exports = router;
