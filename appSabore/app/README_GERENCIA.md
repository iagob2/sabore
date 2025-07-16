# Tela de Gerenciamento da Empresa

## Visão Geral

A tela `gerenciaEmpresa.tsx` é o painel de controle para o responsável da empresa gerenciar seu estabelecimento. Esta tela oferece acesso completo às funcionalidades administrativas.

## Funcionalidades Principais

### 📊 **Dashboard de Estatísticas**
- **Pedidos do Dia**: Contador de pedidos realizados hoje
- **Pratos Cadastrados**: Total de pratos no cardápio
- **Avaliação Média**: Nota média dos clientes
- **Faturamento Mensal**: Receita total do mês

### ⚡ **Ações Rápidas**
- **Alterar Status**: Abrir/fechar o estabelecimento
- **Gerenciar Cardápio**: Adicionar/editar/remover pratos
- **Promoções**: Criar e gerenciar ofertas especiais
- **Relatórios**: Visualizar dados de vendas e performance

### 🏢 **Informações da Empresa**
- **Telefone**: Editar número de contato
- **Endereço**: Atualizar localização
- **E-mail**: Modificar e-mail de contato
- **Lotação**: Definir capacidade máxima

### ⏰ **Horário de Funcionamento**
- Visualizar horários atuais
- Editar dias e horários de funcionamento
- Definir horários especiais para fins de semana

### 💰 **Faturamento**
- Visualizar receita mensal
- Acessar relatórios detalhados
- Análise de performance

### ⚙️ **Configurações**
- Configurações gerais do sistema
- Backup de dados
- Configurações de notificações

## Estrutura da Tela

```
┌─────────────────────────────────────┐
│ Header: "Gerenciamento"             │
├─────────────────────────────────────┤
│ Header da Empresa                   │
│ - Nome da empresa                   │
│ - Status (Aberto/Fechado)           │
├─────────────────────────────────────┤
│ Estatísticas do Dia                 │
│ - Pedidos, Pratos, Avaliação        │
├─────────────────────────────────────┤
│ Ações Rápidas                       │
│ - Botões de ação principais         │
├─────────────────────────────────────┤
│ Informações da Empresa              │
│ - Dados editáveis em cards          │
├─────────────────────────────────────┤
│ Horário de Funcionamento            │
│ - Horários atuais + botão editar    │
├─────────────────────────────────────┤
│ Faturamento do Mês                  │
│ - Valor + botão ver detalhes        │
├─────────────────────────────────────┤
│ Configurações                       │
│ - Configurações gerais e backup     │
└─────────────────────────────────────┘
```

## Componentes Utilizados

### ActionButton
Todos os botões de ação utilizam o componente `ActionButton` reutilizável:

```tsx
// Exemplo de uso na tela
<ActionButton
  text="Alterar Status"
  icon={empresa.status === 'aberto' ? '🔴' : '🟢'}
  onPress={handleAlterarStatus}
  variant="primary"
/>
```

### Layout Responsivo
- **Desktop**: Layout em grid com múltiplas colunas
- **Mobile**: Layout em coluna única
- **Adaptativo**: Se ajusta automaticamente ao tamanho da tela

## Estados e Interações

### Status do Estabelecimento
- **Aberto**: 🟢 Verde com opção de fechar
- **Fechado**: 🔴 Vermelho com opção de abrir
- **Alteração em tempo real**: Status muda imediatamente

### Cards de Informação
- **Visualização**: Dados atuais da empresa
- **Edição**: Botão "Editar" em cada card
- **Validação**: Campos obrigatórios e formatos

### Feedback ao Usuário
- **Alertas**: Confirmações de ações
- **Estados visuais**: Botões com feedback visual
- **Loading**: Indicadores de carregamento (futuro)

## Dados Mockados

Atualmente a tela usa dados mockados para demonstração:

```tsx
const empresaData = {
  id: '1',
  nome: 'Sushi House',
  status: 'aberto',
  telefone: '(13) 3591-5817',
  endereco: 'Rua Japão, 123 - Centro, Santos/SP',
  email: 'contato@sushihouse.com.br',
  horario: 'Sextas e sábados: 16h às 23h30\nOutros dias: 16h às 22h30',
  lotacao: '6 mesas simultâneas',
  pratosCadastrados: 45,
  pedidosHoje: 23,
  avaliacaoMedia: 4.7,
  faturamentoMes: 'R$ 12.450,00',
};
```

## Próximas Implementações

### Funcionalidades Pendentes
- [ ] Formulários de edição de dados
- [ ] Upload de imagens para pratos
- [ ] Sistema de notificações
- [ ] Relatórios detalhados
- [ ] Backup automático
- [ ] Integração com API real

### Melhorias de UX
- [ ] Animações de transição
- [ ] Modo escuro/claro
- [ ] Atalhos de teclado (desktop)
- [ ] Gestos de swipe (mobile)
- [ ] Feedback háptico

## Navegação

A tela é acessível através de:
- Login como responsável da empresa
- Parâmetro `id` da empresa na URL
- Navegação interna do app

## Segurança

- **Autenticação**: Apenas responsáveis autorizados
- **Validação**: Dados de entrada validados
- **Permissões**: Controle de acesso por função
- **Logs**: Registro de ações administrativas 