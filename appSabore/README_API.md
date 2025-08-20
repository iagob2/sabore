# Configuração da API - App Sabore

## Mudanças Recentes

O diretório `server` foi removido conforme solicitado pelo colega. O projeto agora depende de um backend Java externo.

## Configuração Necessária

### 1. Variável de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
EXPO_PUBLIC_API_URL=http://localhost:8080
```

### 2. Backend Java

Certifique-se de que o backend Java está rodando na porta 8080 (ou configure a URL correta no `.env`).

### 3. Endpoints Esperados

O frontend espera os seguintes endpoints no backend:

#### Clientes
- `POST /login` - Login com form data
- `POST /clientes` - Cadastro
- `GET /clientes` - Listar
- `GET /clientes/{id}` - Buscar
- `PUT /clientes/{id}` - Atualizar
- `DELETE /clientes/{id}` - Deletar
- `GET /clientes/me` - Sessão atual
- `POST /logout` - Logout

#### Restaurantes
- `POST /restaurantes/login` - Login
- `POST /restaurantes` - Cadastro
- `GET /restaurantes` - Listar
- `GET /restaurantes/{id}` - Buscar
- `PUT /restaurantes/{id}` - Atualizar
- `DELETE /restaurantes/{id}` - Deletar
- `POST /restaurantes/upload/{tipo}` - Upload de arquivos

#### CEP (Opcional)
- `GET /viacep/{cep}` - Busca CEP
- `GET /enderecos/cep/{cep}` - Busca CEP (alternativo)
- `GET /cep/{cep}` - Busca CEP (alternativo)

Se não disponível, usa ViaCEP público como fallback.

## Testando

1. Configure o `.env` com a URL correta
2. Inicie o backend Java
3. Execute `npm start` para testar o frontend

## Observações

- Todas as APIs usam `credentials: 'include'` para cookies de sessão
- O projeto mantém compatibilidade com Spring Security padrão
- Uploads de arquivo tentam múltiplos endpoints para compatibilidade
