# 🧪 Como Testar o Sistema Sabore

## 🚀 Passo a Passo Simples

### 1. Iniciar os Servidores

**Terminal 1 - Backend Java Simulado:**
```bash
cd appSabore/server
node mock-java-backend.js
```

**Terminal 2 - Backend Intermediário:**
```bash
cd appSabore/server
npm run dev
```

### 2. Executar Teste

**Terminal 3 - Teste do Sistema:**
```bash
cd appSabore/server
node teste.js
```

## ✅ Resultado Esperado

Se tudo estiver funcionando, você verá:

```
🧪 TESTE DO SISTEMA SABORE
==========================

🔍 Verificando servidores...

✅ Backend Java: ONLINE
✅ Backend Intermediário: ONLINE

🧪 Testando funcionalidades...

✅ Login users: SUCESSO
✅ Cadastro: SUCESSO
✅ CEP: ENCONTRADO

🎉 SISTEMA FUNCIONANDO PERFEITAMENTE!
✨ Backend intermediário 100% operacional!
🚀 Pronto para conectar com backend Java real!
```

## 🔧 Se Der Erro

Se aparecer "OFFLINE" ou "ERRO":

1. **Verifique se os servidores estão rodando:**
   - Terminal 1 deve mostrar: "🚀 Backend Java Simulado rodando na porta 8080"
   - Terminal 2 deve mostrar: "🚀 Backend intermediário rodando na porta 4000"

2. **Verifique as portas:**
   - Porta 8080: Backend Java
   - Porta 4000: Backend Intermediário

3. **Reinicie os servidores:**
   - Pressione Ctrl+C para parar
   - Execute novamente os comandos

## 📊 O que o Teste Verifica

- ✅ **Backend Java**: Se está respondendo na porta 8080
- ✅ **Backend Intermediário**: Se está respondendo na porta 4000
- ✅ **Login**: Se consegue fazer login de usuário
- ✅ **Cadastro**: Se consegue cadastrar novo usuário
- ✅ **CEP**: Se consegue buscar CEP

## 🎯 Para Demonstrar ao Colega

**"O sistema está funcionando porque:"**

1. **Backend Intermediário Operacional**
   - Servidor Node.js rodando na porta 4000
   - Todas as rotas configuradas e respondendo
   - Logs detalhados mostrando comunicação

2. **Comunicação HTTP Funcionando**
   - Requisições sendo processadas corretamente
   - Respostas JSON válidas e estruturadas
   - Tratamento de erros implementado

3. **Funcionalidades Implementadas**
   - Sistema de autenticação funcionando
   - Cadastro de usuários
   - Integração com serviços externos (CEP)

4. **Arquitetura Escalável**
   - Separação clara de responsabilidades
   - Interface padronizada para comunicação
   - Fácil substituição do backend Java

## 🔄 Para Conectar com Backend Java Real

1. **Parar o mock:**
   - Ctrl+C no Terminal 1

2. **Iniciar Java real:**
   - Iniciar servidor Java na porta 8080

3. **Manter intermediário:**
   - Terminal 2 continua rodando

4. **Testar novamente:**
   ```bash
   node teste.js
   ```

## 📝 Comandos Úteis

```bash
# Verificar se as portas estão em uso
netstat -an | findstr :8080
netstat -an | findstr :4000

# Testar health check manualmente
curl http://localhost:4000/health
curl http://localhost:8080/api/health

# Ver logs do servidor
# (os logs aparecem automaticamente nos terminais)
```

---

**🎉 Pronto! Agora você pode demonstrar que o sistema está funcionando!**
