# 🍕 Sabore - Aplicativo Multiplataforma

> Um aplicativo de delivery desenvolvido com React Native/Expo que roda em **Mobile**, **Web** e **Desktop**.

## 🚀 Tecnologias Utilizadas

- **Frontend Mobile/Web:** React Native + Expo Router
- **Backend:** Node.js + Express
- **Desktop:** Electron
- **Styling:** Tailwind CSS + React Native
- **Ícones:** Lucide React + React Native Vector Icons

## 📱💻🌐 Plataformas Suportadas

- ✅ **Mobile:** iOS e Android
- ✅ **Web:** Todos os navegadores modernos
- ✅ **Desktop:** Windows, macOS e Linux

---

## ⚡ Comandos de Desenvolvimento

### 🏁 Inicialização Geral
```bash
# Instalar dependências
npm install

# Menu principal do Expo (escolher plataforma)
npm start
```

### 📱 Mobile
```bash
# Android
npm run android

# iOS  
npm run ios

# Ambos (via QR Code)
npm start
```

### 🌐 Web
```bash
# Rodar no navegador
npm run web
```

### 💻 Desktop
```bash
# Rodar aplicação desktop (Electron)
npm run electron

# Desktop apenas (requer web rodando separado)
npm run electron-dev
```

---

## 🏗️ Comandos de Build/Produção

### 📦 Web
```bash
# Build para produção web
npm run build-web

# Deploy (se configurado)
npm run deploy
```

### 💻 Desktop
```bash
# Gerar executável (.exe, .dmg, .AppImage)
npm run build-desktop

# Apenas empacotar (sem installer)
npm run pack-desktop
```

### 📱 Mobile
```bash
# Android APK/AAB (via EAS)
eas build --platform android

# iOS IPA (via EAS) 
eas build --platform ios

# Ambas as plataformas
eas build --platform all
```

---

## 🛠️ Scripts do Backend

```bash
# Acessar pasta do servidor
cd server

# Instalar dependências do backend
npm install

# Rodar servidor em desenvolvimento
npm start
# ou
npm run dev

# O servidor roda na porta 3000
```

---

## 📂 Estrutura do Projeto

```
sabore/
├── appSabore/              # Frontend (React Native/Expo)
│   ├── app/                # Rotas (Expo Router)
│   ├── components/         # Componentes reutilizáveis
│   ├── assets/            # Imagens, ícones, fontes
│   ├── desktop/           # Configuração Electron
│   │   └── main.js        # Arquivo principal do desktop
│   ├── package.json       # Dependências frontend
│   └── app.json          # Configurações Expo
│
└── server/                # Backend (Node.js + Express)
    ├── routes/            # Rotas da API
    ├── services/          # Serviços e lógica de negócio
    ├── package.json       # Dependências backend
    └── index.js          # Servidor principal
```

---

## 🔧 Configuração do Ambiente

### Pré-requisitos
- **Node.js** 18+ 
- **npm** ou **yarn**
- **Android Studio** (para Android)
- **Xcode** (para iOS - apenas macOS)

### Primeira configuração
```bash
# 1. Clonar repositório
git clone [URL_DO_REPOSITORIO]

# 2. Instalar dependências frontend
cd appSabore
npm install

# 3. Instalar dependências backend  
cd ../server
npm install

# 4. Voltar para frontend
cd ../appSabore
```

---

## 🚀 Como Rodar o Projeto Completo

### Opção 1: Desenvolvimento completo
```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
cd appSabore  
npm run electron
```

### Opção 2: Apenas uma plataforma
```bash
# Backend (sempre necessário)
cd server && npm start

# Escolha uma plataforma:
cd appSabore && npm run web      # Web
cd appSabore && npm run android  # Android
cd appSabore && npm run ios      # iOS
cd appSabore && npm run electron # Desktop
```

---

## 📱 Como Testar no Dispositivo

### Android
1. Ativar **Depuração USB** no dispositivo
2. Conectar via cabo USB
3. Executar: `npm run android`

### iOS (apenas macOS)
1. Conectar iPhone via cabo
2. Confiar no computador
3. Executar: `npm run ios`

### Web
1. Executar: `npm run web`
2. Abrir `http://localhost:8081` no navegador

### Desktop
1. Executar: `npm run electron`
2. Aplicação abre automaticamente

---

## 🔍 Resolução de Problemas

### ❌ Erro "Metro bundler not found"
```bash
npm install -g @expo/cli
npx expo start --clear
```

### ❌ Erro "Android SDK not found" 
- Instalar Android Studio
- Configurar variáveis de ambiente ANDROID_HOME

### ❌ Erro "Cannot connect to development server"
- Verificar se dispositivo está na mesma rede Wi-Fi
- Desabilitar firewall temporariamente
- Usar túnel: `npx expo start --tunnel`

### ❌ Erro no Electron
```bash
# Reinstalar dependências do Electron
npm install --save-dev electron electron-is-dev
```

### ❌ Backend não conecta
- Verificar se porta 3000 está livre
- Verificar IP do servidor no código frontend
- Testar backend: `http://localhost:3000/health`

---

## 📋 Checklist para Deploy

### ✅ Web
- [ ] Build gerado: `npm run build-web`
- [ ] Testado em diferentes navegadores
- [ ] URLs da API configuradas para produção

### ✅ Desktop
- [ ] Executável gerado: `npm run build-desktop`
- [ ] Testado no sistema operacional alvo
- [ ] Ícones configurados

### ✅ Mobile
- [ ] APK/IPA gerado via EAS Build
- [ ] Testado em dispositivos físicos
- [ ] Permissões configuradas (localização, câmera, etc.)

---

## 🤝 Para Colaboradores

### Workflow de desenvolvimento
1. **Sempre puxar últimas alterações:** `git pull`
2. **Instalar dependências:** `npm install`
3. **Testar antes de commitar:** `npm run web`
4. **Fazer commits pequenos e descritivos**
5. **Testar em pelo menos 2 plataformas**

### Comandos úteis para debug
```bash
# Limpar cache
npx expo start --clear

# Reset completo
rm -rf node_modules && npm install

# Ver logs detalhados
npx expo start --dev-client
```

### Padrões de código
- Usar **camelCase** para variáveis
- Componentes em **PascalCase**
- Sempre adicionar **PropTypes** ou **TypeScript**
- Testar responsividade para web

---

## 📞 Suporte

### Em caso de problemas:
1. **Verificar documentação oficial:** [Expo Docs](https://docs.expo.dev/)
2. **Conferir issues do projeto:** GitHub Issues
3. **Testar em ambiente limpo:** Criar projeto novo para reproduzir erro

### Links úteis:
- 📚 [Documentação Expo](https://docs.expo.dev/)
- 🐛 [React Native Debugging](https://reactnative.dev/docs/debugging)
- ⚡ [Electron Documentation](https://www.electronjs.org/docs)
- 🎨 [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🏆 Status do Projeto

- ✅ **Mobile:** Funcional (iOS/Android)
- ✅ **Web:** Funcional (todos navegadores)
- ✅ **Desktop:** Funcional (Windows/Mac/Linux)
- ✅ **Backend:** API REST funcional
- ✅ **Build:** Configurado para todas plataformas

**Projeto multiplataforma 100% funcional! 🎉**