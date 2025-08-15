// Importa o framework Express para criar o servidor web
const express = require('express');
// Importa o middleware CORS para permitir requisições de outros domínios
const cors = require('cors');
// Importa o middleware para processar dados JSON das requisições
const bodyParser = require('body-parser');

// Cria a aplicação Express
const app = express();

// ===== CONFIGURAÇÕES DE CORS =====
// Permite que o frontend (React Native, Web) faça requisições para este servidor
app.use(cors({
    // Lista de origens permitidas (frontends que podem acessar)
    origin: ['http://localhost:3000', 'http://localhost:19006', 'http://localhost:8081'],
    // Permite enviar cookies e credenciais de autenticação
    credentials: true
}));

// ===== MIDDLEWARES =====
// Processa requisições com dados JSON (ex: login, cadastro)
app.use(bodyParser.json());
// Processa requisições com dados de formulário (ex: upload de arquivos)
app.use(bodyParser.urlencoded({ extended: true }));

// ===== MIDDLEWARE DE LOGGING =====
// Registra todas as requisições que chegam no servidor
app.use((req, res, next) => {
    // Mostra data/hora, método HTTP e caminho da requisição
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    // Passa para o próximo middleware
    next();
});

// ===== IMPORTAÇÃO DAS ROTAS =====
// Importa o roteador de usuários (clientes)
const userRoutes = require('./routes/userRoutes');
// Importa o roteador de pedidos (apenas para usuários comuns)
const orderRoutes = require('./routes/orderRoutes');
// Importa o roteador de restaurantes
const restauranteRoutes = require('./routes/restauranteRoutes');
// Importa o roteador de relatórios (apenas para restaurantes)
const relatorioRoutes = require('./routes/relatorioRoutes');

// ===== CONFIGURAÇÃO DAS ROTAS =====
// Todas as rotas de usuários ficam em /users (ex: /users/login, /users/register)
app.use('/users', userRoutes);
// Todas as rotas de pedidos ficam em /orders (ex: /orders/create, /orders/123)
app.use('/orders', orderRoutes);
// Todas as rotas de restaurantes ficam em /restaurantes (ex: /restaurantes/login)
app.use('/restaurantes', restauranteRoutes);
// Todas as rotas de relatórios ficam em /relatorios (ex: /relatorios/vendas/123)
app.use('/relatorios', relatorioRoutes);

// ===== ROTA DE HEALTH CHECK =====
// Endpoint para verificar se o servidor está funcionando
app.get('/health', (req, res) => {
    // Retorna status OK com timestamp e mensagem
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Backend intermediário funcionando corretamente'
    });
});

// ===== MIDDLEWARE DE TRATAMENTO DE ERROS =====
// Captura erros que não foram tratados nas rotas
app.use((err, req, res, next) => {
    // Registra o erro no console para debug
    console.error('Erro não tratado:', err);
    // Retorna erro 500 (erro interno) para o frontend
    res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: err.message 
    });
});

// ===== ROTA PARA ENDPOINTS NÃO ENCONTRADOS =====
// Captura todas as requisições para rotas que não existem
app.use('*', (req, res) => {
    // Retorna erro 404 (não encontrado) com o caminho tentado
    res.status(404).json({ 
        error: 'Endpoint não encontrado',
        path: req.originalUrl 
    });
});

// ===== CONFIGURAÇÃO DA PORTA =====
// Usa a porta definida nas variáveis de ambiente ou porta 4000 por padrão
const PORT = process.env.PORT || 4000;

// ===== INICIALIZAÇÃO DO SERVIDOR =====
// Inicia o servidor na porta configurada
app.listen(PORT, () => {
    // Mostra mensagem de sucesso com emojis
    console.log(`🚀 Backend intermediário rodando na porta ${PORT}`);
    // Mostra qual backend Java está sendo usado
    console.log(`📡 Conectando ao backend central: http://localhost:8080/api`);
    // Mostra o link para o health check
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
