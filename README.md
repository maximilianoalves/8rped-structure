# 📅 Cronograma LifesHouse

Um sistema moderno e responsivo para exibir cronogramas de eventos com integração em tempo real com Google Sheets.

## ✨ Funcionalidades

- 🔄 **Integração Google Sheets**: Dados carregados em tempo real da planilha
- 🔍 **Busca Inteligente**: Busque por momento, responsável ou local
- 📱 **Responsivo**: Design otimizado para desktop, tablet e celular
- 🎨 **Design Moderno**: Gradiente azul-branco com animações suaves
- 📅 **Filtros por Dia**: Sexta, Sábado, Domingo
- ⏱️ **Horários Precisos**: Cada evento mostra seu horário de início
- 🔗 **Modal de Detalhes**: Informações completas de cada evento
- 🔄 **Auto-refresh**: Dados atualizados automaticamente a cada 5 minutos

## 🚀 Como Usar

### 1. Configurar Google Sheets API

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Ative a **Google Sheets API**
4. Vá em **Credenciais** > **Criar Credencial** > **Chave de API**
5. Copie sua chave de API

### 2. Configurar a Chave no HTML

Abra `schedule.html` e procure por:
```javascript
const GOOGLE_API_KEY = 'YOUR_API_KEY_HERE'; // ← Cole sua chave aqui
```

Cole sua chave de API nesse local.

### 3. Abrir o Arquivo

Simplesmente abra `schedule.html` em um navegador web.

## 📊 Estrutura da Planilha

A planilha Google Sheets deve ter a seguinte estrutura:

```
SEXTA-FEIRA
Horário | Momento | Responsável | Local
19:30   | Evento  | Pessoa      | Local
...

SÁBADO
Horário | Momento | Responsável | Local
...

DOMINGO
...
```

## 📦 Arquivos

- `schedule.html` - Interface principal (HTML + CSS + JS)
- `sheets-api.js` - Integração com Google Sheets API
- `.gitignore` - Configuração Git
- `README.md` - Este arquivo

## 🔒 Segurança

- A chave de API fica exposta no código (use em ambiente seguro)
- Para ambiente de produção, considere usar OAuth 2.0
- A planilha deve estar compartilhada publicamente para a API funcionar

## 💡 Personalizações

### Mudar cores
Edite as cores no CSS:
```css
background: linear-gradient(135deg, #0066cc 0%, #e6f2ff 100%);
```

### Mudar intervalo de auto-refresh
Em `sheets-api.js`, procure por:
```javascript
loader.startAutoRefresh((data, error) => {...}, 5); // 5 minutos
```

### Mudar descrição dos eventos
Em `schedule.html`, procure por `loremIpsum` e substitua pelo conteúdo desejado.

## 🌐 Publicar no GitHub Pages

1. Faça push do repositório para GitHub
2. Vá nas configurações do repositório
3. Em "Pages", selecione a branch "master" como source
4. O site ficará disponível em `https://seu-usuario.github.io/8rped-structure/`

## 📝 Licença

Livre para uso pessoal e comercial.

## 👨‍💻 Desenvolvido com ❤️

Copilot CLI - GitHub
