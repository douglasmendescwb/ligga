# Ligga Fibra - Sistema de Tracking Completo

Sistema avançado de rastreamento e redirecionamento para links do WhatsApp, desenvolvido especificamente para provedores de internet e empresas de telecomunicações.

## 🚀 Funcionalidades

- **Interceptação automática** de links do WhatsApp
- **Captura completa** de dados UTM e parâmetros de ads
- **Tracking multi-plataforma** (Google Ads, Meta Ads, TikTok Ads, Microsoft Ads)
- **Detecção automática de fonte** quando não especificada
- **Dados de dispositivo e sessão** para análise completa
- **API JavaScript** para uso programático
- **Zero configuração** - funciona automaticamente após instalação

## 📊 Dados Capturados

### Parâmetros UTM
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`

### Plataformas de Ads
- **Google Ads**: `gclid`, `gbraid`, `wbraid`, `gclsrc`
- **Meta/Facebook**: `fbclid`, `fbp`, `fbc`
- **TikTok**: `ttclid`
- **Microsoft**: `msclkid`

### Dados Específicos do Negócio
- `plano`, `velocidade`, `promo`, `desconto`
- `cidade`, `bairro`

### Dados da Sessão
- URL atual, referrer, título da página
- Tipo de dispositivo, idioma, timezone
- ID de sessão único, timestamp

## 🛠️ Instalação

### 1. Instalação Básica

Adicione o script antes do `</body>` em todas as páginas:

```html
<script src="path/to/ligga-tracking.js"></script>
```

### 2. Configuração

O sistema funciona automaticamente com as configurações padrão. Para personalizar:

```javascript
// Modifique as configurações no início do arquivo
const CONFIG = {
    REDIRECT_BASE_URL: 'https://seudominio.com.br/whatsapp',
    AUTO_INTERCEPT: true,
    DEBUG: false, // true para logs detalhados
    TRACK_PARAMS: [/* seus parâmetros personalizados */]
};
```

## 📝 Como Usar

### Links Automáticos (Interceptados)

Qualquer link do WhatsApp será automaticamente interceptado:

```html
<a href="https://wa.me/5511999999999">Falar no WhatsApp</a>
<a href="https://api.whatsapp.com/send?phone=5511999999999">Contato</a>
```

### Links com Dados Específicos

Use `data-attributes` para adicionar informações específicas:

```html
<a href="https://wa.me/5511999999999" 
   data-source="planos" 
   data-plano="100mb" 
   data-velocidade="100" 
   data-promo="black-friday"
   data-cidade="sao-paulo"
   data-bairro="centro">
   Contratar Plano 100MB
</a>
```

### Links Diretos ao Sistema

Links que já apontam para sua página de redirecionamento serão automaticamente aprimorados:

```html
<a href="https://liggavendas.com.br/whatsapp?source=homepage&plano=200mb">
    Plano 200MB - R$ 79,90
</a>
```

## 🔧 API JavaScript

### Capturar Dados Atuais

```javascript
const dados = LiggaTracking.getData();
console.log(dados);
```

### Criar Link Personalizado

```javascript
const link = LiggaTracking.createLink({
    source: 'popup',
    plano: '500mb',
    promo: 'desconto50',
    cidade: 'rio-de-janeiro'
});
```

### Redirecionamento Programático

```javascript
// Redireciona imediatamente com dados personalizados
LiggaTracking.redirect({
    source: 'botao-cta',
    plano: '1gb',
    velocidade: '1000',
    promo: 'primeira-mensalidade-gratis'
});
```

### Forçar Tracking em Link Específico

```html
<a href="https://wa.me/5511999999999" class="ligga-track">
    Este link será sempre interceptado
</a>
```

## 🎯 Exemplos Práticos

### Landing Page de Planos

```html
<!-- Plano Básico -->
<a href="https://wa.me/5511999999999"
   data-source="landing-planos"
   data-plano="basico"
   data-velocidade="100"
   data-promo="primeira-mensalidade-50off">
   Contratar Plano Básico - 100MB
</a>

<!-- Plano Premium -->
<a href="https://wa.me/5511999999999"
   data-source="landing-planos"
   data-plano="premium"
   data-velocidade="500"
   data-promo="instalacao-gratis">
   Contratar Plano Premium - 500MB
</a>
```

### Popup de Promoção

```javascript
// Quando usuário clica em "Quero Desconto"
document.getElementById('popup-desconto').addEventListener('click', function() {
    LiggaTracking.redirect({
        source: 'popup-promocional',
        promo: 'black-friday-70off',
        plano: 'escolha-do-usuario',
        urgencia: 'limitado'
    });
});
```

### Página de Cidade Específica

```html
<!-- Para São Paulo -->
<a href="https://wa.me/5511999999999"
   data-source="pagina-cidade"
   data-cidade="sao-paulo"
   data-bairro="vila-madalena"
   data-cobertura="disponivel">
   Verificar Cobertura - Vila Madalena
</a>
```

## 📈 Dados Coletados (Exemplo)

```json
{
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "planos-fibra-sp",
  "gclid": "Cj0KCQjw...",
  "source": "google_ads",
  "plano": "200mb",
  "velocidade": "200",
  "promo": "black-friday",
  "cidade": "sao-paulo",
  "current_url": "https://seusite.com.br/planos",
  "referrer": "https://www.google.com/",
  "device_type": "mobile",
  "is_mobile": true,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "session_id": "1642248600abc123",
  "link_text": "Contratar Agora",
  "original_href": "https://wa.me/5511999999999"
}
```

## ⚙️ Configurações Avançadas

### Debug Mode

```javascript
const CONFIG = {
    DEBUG: true // Ativa logs detalhados no console
};
```

### Parâmetros Personalizados

```javascript
const CONFIG = {
    TRACK_PARAMS: [
        // UTMs padrão
        'utm_source', 'utm_medium', 'utm_campaign',
        // Seus parâmetros específicos
        'região', 'vendedor', 'canal_origem'
    ]
};
```

### Interceptação Seletiva

```javascript
const CONFIG = {
    AUTO_INTERCEPT: false // Desativa interceptação automática
};

// Use class="ligga-track" nos links que quer rastrear
```

## 🔍 Troubleshooting

### Links não são interceptados
- Verifique se `AUTO_INTERCEPT` está `true`
- Certifique-se que são links do WhatsApp válidos
- Use `DEBUG: true` para ver logs no console

### Dados não aparecem
- Verifique se o script está carregado antes dos links
- Confirme se a URL de redirecionamento está correta
- Use `LiggaTracking.getData()` para testar

### Performance
- O script é leve (~8KB minificado)
- Usa event delegation (eficiente)
- Não interfere em outros scripts

## 📞 Suporte

Para dúvidas ou customizações específicas, entre em contato através do WhatsApp configurado no sistema.

---

**Desenvolvido especificamente para provedores de internet que precisam de tracking avançado e conversões otimizadas via WhatsApp.**
