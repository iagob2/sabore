# 🚀 Backend Intermediário - Sabore

Este é o backend intermediário que funciona como ponte de comunicação entre o frontend (web, mobile, desktop) e o backend central Java.

## 📋 Funcionalidades

- ✅ **Ponte de Comunicação**: Recebe requisições e encaminha para o backend Java
- ✅ **Sem Lógica de Negócio**: Apenas roteamento e validação básica
- ✅ **Sem Armazenamento**: Dados ficam centralizados no Java
- ✅ **Logs Detalhados**: Monitoramento completo das requisições
- ✅ **Tratamento de Erros**: Respostas padronizadas e informativas

## 🏗️ Arquitetura

```
Frontend → Backend Intermediário (Porta 4000) → Backend Java (Porta 8080)
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+
- Backend Java rodando na porta 8080

### Instalação
```bash
cd server
npm install
```

### Execução
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

## 📡 Endpoints Disponíveis

### 🔐 Usuários (Clientes)
- `POST /users/login` - Login de cliente
- `POST /users/register` - Cadastro de cliente
- `GET /users` - Listar clientes
- `GET /users/:id` - Buscar cliente por ID
- `PUT /users/:id` - Atualizar cliente
- `DELETE /users/:id` - Deletar cliente
- `GET /users/me/session` - Sessão atual
- `POST /users/logout` - Logout
- `GET /users/cep/:cep` - Buscar endereço por CEP

### 🏪 Restaurantes
- `POST /restaurantes/login` - Login de restaurante
- `POST /restaurantes/register` - Cadastro de restaurante
- `GET /restaurantes` - Listar restaurantes
- `GET /restaurantes/:id` - Buscar restaurante por ID
- `PUT /restaurantes/:id` - Atualizar restaurante
- `DELETE /restaurantes/:id` - Deletar restaurante
- `POST /restaurantes/upload/:tipo` - Upload de arquivos

### 🛒 Pedidos (Apenas Usuários Comuns)
- `POST /orders/create` - Criar pedido
- `GET /orders/user/:userId` - Listar pedidos do usuário
- `GET /orders/:id` - Buscar pedido por ID
- `PUT /orders/:id/status` - Atualizar status do pedido
- `PUT /orders/:id/cancel` - Cancelar pedido
- `GET /orders/history/:userId` - Histórico de pedidos

### 📊 Relatórios (Apenas Restaurantes)
- `GET /relatorios/vendas/:restauranteId` - Relatório de vendas
- `GET /relatorios/pedidos/:restauranteId` - Relatório de pedidos
- `GET /relatorios/produtos/:restauranteId` - Produtos mais vendidos
- `GET /relatorios/financeiro/:restauranteId` - Relatório financeiro
- `GET /relatorios/clientes/:restauranteId` - Relatório de clientes

### 🏥 Health Check
- `GET /health` - Status do servidor intermediário

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` baseado no `config.env.example`:

```env
PORT=4000
BACKEND_CENTRAL_URL=http://localhost:8080/api
CORS_ORIGINS=http://localhost:3000,http://localhost:19006,http://localhost:8081
REQUEST_TIMEOUT=5000
LOG_LEVEL=info
NODE_ENV=development
```

## 📝 Exemplos de Uso

### Login de Cliente
```bash
curl -X POST http://localhost:4000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cliente@email.com","senha":"123456"}'
```

### Cadastro de Restaurante
```bash
curl -X POST http://localhost:4000/restaurantes/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Restaurante Teste","cnpj":"12345678901234","email":"rest@email.com","senha":"123456"}'
```

### Criar Pedido
```bash
curl -X POST http://localhost:4000/orders/create \
  -H "Content-Type: application/json" \
  -d '{"clienteId":1,"restauranteId":1,"itens":[{"produtoId":1,"quantidade":2}]}'
```

## 🔍 Logs e Monitoramento

O sistema gera logs detalhados para cada operação:

- 📤 Requisições enviadas
- ✅ Respostas recebidas
- ❌ Erros e falhas
- 🔄 Status das operações

## 🚨 Tratamento de Erros

Todos os endpoints retornam respostas padronizadas:

```json
{
  "error": "Descrição do erro",
  "message": "Mensagem adicional (quando disponível)"
}
```

## 🔒 Segurança

- CORS configurado para origens específicas
- Validação de entrada em todos os endpoints
- Timeout configurável para requisições
- Logs de auditoria para todas as operações

## 📚 Dependências

- `express`: Framework web
- `axios`: Cliente HTTP para comunicação com Java
- `cors`: Middleware CORS
- `body-parser`: Parser de requisições
- `nodemon`: Auto-reload em desenvolvimento

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, consulte os logs do servidor ou entre em contato com a equipe de desenvolvimento iago correia de lima .
