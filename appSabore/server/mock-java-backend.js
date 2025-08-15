const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Configuração CORS
app.use(cors({
    origin: ['http://localhost:4000', 'http://localhost:3000', 'http://localhost:19006'],
    credentials: true
}));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging
app.use((req, res, next) => {
    console.log(`📥 [MOCK JAVA] ${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ===== DADOS MOCK =====
let users = [
    { id: 1, nome: 'João Silva', email: 'joao@email.com', senha: '123456', tipo: 'cliente' },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com', senha: '123456', tipo: 'cliente' }
];

let restaurantes = [
    { id: 1, nome: 'Restaurante do Chef', cnpj: '12345678901234', email: 'chef@email.com', senha: '123456' },
    { id: 2, nome: 'Cantinho Brasileiro', cnpj: '98765432109876', email: 'cantinho@email.com', senha: '123456' }
];

let pedidos = [
    { id: 1, clienteId: 1, restauranteId: 1, status: 'preparando', valor: 45.90, data: new Date() },
    { id: 2, clienteId: 2, restauranteId: 2, status: 'entregue', valor: 32.50, data: new Date() }
];

// ===== ENDPOINTS =====

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Backend Java Simulado funcionando!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Info do Backend
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Backend Java Simulado - Sabore',
        version: '1.0.0',
        description: 'Servidor mock para demonstração',
        endpoints: [
            '/api/health',
            '/api/users',
            '/api/restaurantes',
            '/api/pedidos'
        ]
    });
});

// ===== USUÁRIOS =====

// Login de usuário
app.post('/api/users/login', (req, res) => {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    const user = users.find(u => u.email === email && u.senha === senha);
    
    if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    res.json({
        success: true,
        user: { id: user.id, nome: user.nome, email: user.email, tipo: user.tipo },
        token: 'mock-jwt-token-' + user.id
    });
});

// Cadastro de usuário
app.post('/api/users/register', (req, res) => {
    const { nome, email, senha } = req.body;
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }
    
    if (users.find(u => u.email === email)) {
        return res.status(409).json({ error: 'Email já cadastrado' });
    }
    
    const newUser = {
        id: users.length + 1,
        nome,
        email,
        senha,
        tipo: 'cliente'
    };
    
    users.push(newUser);
    
    res.status(201).json({
        success: true,
        user: { id: newUser.id, nome: newUser.nome, email: newUser.email, tipo: newUser.tipo }
    });
});

// Listar usuários
app.get('/api/users', (req, res) => {
    res.json(users.map(u => ({ id: u.id, nome: u.nome, email: u.email, tipo: u.tipo })));
});

// Buscar usuário por ID
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ id: user.id, nome: user.nome, email: user.email, tipo: user.tipo });
});

// ===== RESTAURANTES =====

// Login de restaurante
app.post('/api/restaurantes/login', (req, res) => {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    const restaurante = restaurantes.find(r => r.email === email && r.senha === senha);
    
    if (!restaurante) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    res.json({
        success: true,
        restaurante: { id: restaurante.id, nome: restaurante.nome, email: restaurante.email },
        token: 'mock-jwt-token-rest-' + restaurante.id
    });
});

// Cadastro de restaurante
app.post('/api/restaurantes/register', (req, res) => {
    const { nome, cnpj, email, senha } = req.body;
    
    if (!nome || !cnpj || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    if (restaurantes.find(r => r.email === email)) {
        return res.status(409).json({ error: 'Email já cadastrado' });
    }
    
    const newRestaurante = {
        id: restaurantes.length + 1,
        nome,
        cnpj,
        email,
        senha
    };
    
    restaurantes.push(newRestaurante);
    
    res.status(201).json({
        success: true,
        restaurante: { id: newRestaurante.id, nome: newRestaurante.nome, email: newRestaurante.email }
    });
});

// Listar restaurantes
app.get('/api/restaurantes', (req, res) => {
    res.json(restaurantes.map(r => ({ id: r.id, nome: r.nome, email: r.email })));
});

// ===== PEDIDOS =====

// Criar pedido
app.post('/api/pedidos', (req, res) => {
    const { clienteId, restauranteId, itens } = req.body;
    
    if (!clienteId || !restauranteId || !itens) {
        return res.status(400).json({ error: 'Dados do pedido são obrigatórios' });
    }
    
    const newPedido = {
        id: pedidos.length + 1,
        clienteId,
        restauranteId,
        itens,
        status: 'recebido',
        valor: itens.reduce((total, item) => total + (item.preco * item.quantidade), 0),
        data: new Date()
    };
    
    pedidos.push(newPedido);
    
    res.status(201).json({
        success: true,
        pedido: newPedido
    });
});

// Listar pedidos do usuário
app.get('/api/pedidos/user/:userId', (req, res) => {
    const userPedidos = pedidos.filter(p => p.clienteId == req.params.userId);
    res.json(userPedidos);
});

// ===== RELATÓRIOS =====

// Relatório de vendas
app.get('/api/relatorios/vendas/:restauranteId', (req, res) => {
    const restaurantePedidos = pedidos.filter(p => p.restauranteId == req.params.restauranteId);
    const totalVendas = restaurantePedidos.reduce((total, p) => total + p.valor, 0);
    
    res.json({
        restauranteId: req.params.restauranteId,
        totalVendas,
        totalPedidos: restaurantePedidos.length,
        pedidos: restaurantePedidos
    });
});

// ===== CEP =====

// Buscar CEP (simulado)
app.get('/api/cep/:cep', (req, res) => {
    const cep = req.params.cep;
    
    // Simula busca de CEP
    const endereco = {
        cep: cep,
        logradouro: 'Rua das Flores',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        complemento: 'Apto 123'
    };
    
    res.json(endereco);
});

// ===== ERRO 404 =====
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Endpoint não encontrado no backend Java',
        path: req.originalUrl 
    });
});

// ===== INICIALIZAÇÃO =====
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`🚀 Backend Java Simulado rodando na porta ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}/api`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Endpoints disponíveis:`);
    console.log(`   - POST /api/users/login`);
    console.log(`   - POST /api/users/register`);
    console.log(`   - GET /api/users`);
    console.log(`   - POST /api/restaurantes/login`);
    console.log(`   - POST /api/restaurantes/register`);
    console.log(`   - GET /api/restaurantes`);
    console.log(`   - POST /api/pedidos`);
    console.log(`   - GET /api/relatorios/vendas/:id`);
    console.log(`   - GET /api/cep/:cep`);
});
