# 🔗 Como Alterar o Link do Backend Central

## 📍 **LOCALIZAÇÃO DOS ARQUIVOS PARA ALTERAR:**

### **1. Arquivo Principal: `.env`**
```
📁 appSabore/server/.env
```

**Linha para alterar:**
```bash
# ===== IMPORTANTE: ALTERAR ESTA LINHA PARA CONECTAR COM BACKEND JAVA REAL =====
# ATUAL: http://localhost:8080/api (para desenvolvimento local)
# ALTERAR PARA: http://IP-DO-SEU-COLEGA:8080/api (para backend real)
BACKEND_CENTRAL_URL=http://localhost:8080/api
```

### **2. Arquivo de Serviço: `services/backendService.js`**
```
📁 appSabore/server/services/backendService.js
```

**Linha para alterar (linha 6):**
```javascript
// ===== IMPORTANTE: ALTERAR ESTA LINHA PARA CONECTAR COM BACKEND JAVA REAL =====
// ATUAL: http://localhost:8080/api (para desenvolvimento local)
// ALTERAR PARA: http://IP-DO-SEU-COLEGA:8080/api (para backend real)
const BACKEND_CENTRAL_URL = process.env.BACKEND_CENTRAL_URL || 'http://localhost:8080/api';
```

## 🔧 **COMO ALTERAR:**

### **Opção 1: Alterar arquivo `.env` (RECOMENDADO)**
1. Abra o arquivo: `appSabore/server/.env`
2. Encontre a linha: `BACKEND_CENTRAL_URL=http://localhost:8080/api`
3. Altere para: `BACKEND_CENTRAL_URL=http://IP-DO-SEU-COLEGA:8080/api`
4. Salve o arquivo

### **Opção 2: Alterar arquivo `backendService.js`**
1. Abra o arquivo: `appSabore/server/services/backendService.js`
2. Encontre a linha 6: `const BACKEND_CENTRAL_URL = process.env.BACKEND_CENTRAL_URL || 'http://localhost:8080/api';`
3. Altere para: `const BACKEND_CENTRAL_URL = process.env.BACKEND_CENTRAL_URL || 'http://IP-DO-SEU-COLEGA:8080/api';`
4. Salve o arquivo

## 🌐 **EXEMPLOS DE URLS:**

### **Para desenvolvimento local:**
```bash
BACKEND_CENTRAL_URL=http://localhost:8080/api
```

### **Para backend do colega na mesma rede:**
```bash
BACKEND_CENTRAL_URL=http://192.168.1.100:8080/api
BACKEND_CENTRAL_URL=http://10.0.0.50:8080/api
```

### **Para backend remoto:**
```bash
BACKEND_CENTRAL_URL=http://servidor-empresa.com:8080/api
BACKEND_CENTRAL_URL=https://api.sabore.com/api
```

## ✅ **PASSOS PARA TESTAR:**

1. **Alterar a URL** em um dos arquivos acima
2. **Reiniciar o servidor intermediário:**
   ```bash
   # Pressione Ctrl+C para parar
   npm run dev
   ```
3. **Testar a conexão:**
   ```bash
   node teste.js
   ```

## 🔍 **COMO VERIFICAR SE FUNCIONOU:**

### **Se funcionar, você verá:**
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
```

### **Se não funcionar, você verá:**
```
❌ Backend Java: OFFLINE
```

## 🆘 **SE DER ERRO:**

1. **Verificar se o IP está correto**
2. **Verificar se a porta está correta (8080)**
3. **Verificar se o backend Java está rodando**
4. **Verificar se não há firewall bloqueando**

## 📝 **RESUMO:**

**Arquivo principal para alterar:** `appSabore/server/.env`
**Linha específica:** `BACKEND_CENTRAL_URL=http://localhost:8080/api`
**Alterar para:** `BACKEND_CENTRAL_URL=http://IP-DO-SEU-COLEGA:8080/api`

---

**🎯 Pronto! Agora você sabe exatamente onde alterar para conectar com o backend Java real!**
