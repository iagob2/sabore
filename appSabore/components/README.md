# Componentes Reutilizáveis

## ActionButton

O componente `ActionButton` é um botão de ação reutilizável que pode ser usado em diferentes partes do app.

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `text` | `string` | **obrigatório** | Texto do botão |
| `icon` | `string` | `undefined` | Ícone emoji (ex: "🍣", "🚚") |
| `onPress` | `() => void` | `undefined` | Função executada ao clicar |
| `url` | `string` | `undefined` | URL para abrir (se não usar onPress) |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | Estilo do botão |
| `disabled` | `boolean` | `false` | Se o botão está desabilitado |
| `style` | `any` | `undefined` | Estilos adicionais |

### Variantes

- **primary**: Botão amarelo (#FBBF24) com texto preto
- **secondary**: Botão branco com texto vermelho

### Exemplos de Uso

```tsx
// Botão primário com ícone
<ActionButton 
  text="Cardápio" 
  icon="🍣" 
  url="https://exemplo.com/cardapio" 
  variant="primary"
/>

// Botão secundário com função personalizada
<ActionButton 
  text="Entrar" 
  onPress={() => console.log('Login!')} 
  variant="secondary"
/>

// Botão desabilitado
<ActionButton 
  text="Indisponível" 
  disabled={true}
/>

// Botão com estilos customizados
<ActionButton 
  text="Largura Total" 
  style={{ width: '100%', marginTop: 20 }}
/>

// Botão dinâmico (muda ícone baseado no estado)
<ActionButton 
  text="Alterar Status" 
  icon={status === 'aberto' ? '🔴' : '🟢'}
  onPress={handleAlterarStatus} 
  variant="primary"
/>

// Botão de gerenciamento
<ActionButton 
  text="Gerenciar Cardápio" 
  icon="🍣" 
  onPress={handleGerenciarCardapio} 
  variant="primary"
/>
```

### Funcionalidades

- **Acessibilidade**: Inclui `accessibilityRole` e `accessibilityLabel`
- **URLs**: Abre automaticamente URLs usando `Linking.openURL`
- **Estados**: Suporte para estado desabilitado
- **Flexibilidade**: Aceita estilos customizados via prop `style` 