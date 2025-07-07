/**
 * LIGGA FIBRA - SISTEMA DE TRACKING COMPLETO
 * Configurado para: https://liggavendas.com.br/whatsapp
 * 
 * INSTRUÇÕES:
 * 1. Adicione este script antes do </body> em todas as páginas
 * 2. Links do WhatsApp serão interceptados automaticamente
 * 3. Todos os dados UTM + Ads serão capturados
 */

(function() {
    'use strict';

    // ================================
    // CONFIGURAÇÕES LIGGA FIBRA
    // ================================
    const CONFIG = {
        // URL da sua página de redirecionamento
        REDIRECT_BASE_URL: 'https://liggavendas.com.br/whatsapp',
        
        // Intercepta links automáticamente
        AUTO_INTERCEPT: true,
        
        // Debug (deixe false em produção)
        DEBUG: false,
        
        // Parâmetros para capturar
        TRACK_PARAMS: [
            // UTM padrão
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
            
            // Google Ads
            'gclid', 'gbraid', 'wbraid', 'gclsrc',
            
            // Meta/Facebook Ads
            'fbclid', 'fbp', 'fbc',
            
            // TikTok Ads
            'ttclid',
            
            // Microsoft Ads
            'msclkid',
            
            // Outros
            'referrer', 'ref', 'source', 'medium', 'campaign',
            
            // Ligga específicos
            'plano', 'velocidade', 'promo', 'desconto', 'cidade', 'bairro'
        ]
    };

    // ================================
    // CAPTURA DE DADOS COMPLETA
    // ================================
    
    function captureAllData() {
        const data = {};
        
        // 1. Parâmetros da URL
        const urlParams = new URLSearchParams(window.location.search);
        
        CONFIG.TRACK_PARAMS.forEach(param => {
            const value = urlParams.get(param);
            if (value) {
                data[param] = decodeURIComponent(value);
            }
        });
        
        // Captura outros parâmetros não listados
        for (let [key, value] of urlParams) {
            if (!CONFIG.TRACK_PARAMS.includes(key)) {
                data[key] = decodeURIComponent(value);
            }
        }
        
        // 2. Dados do referrer
        if (document.referrer) {
            data.referrer = document.referrer;
            data.referrer_domain = extractDomain(document.referrer);
        }
        
        // 3. Dados da página
        data.current_url = window.location.href;
        data.current_path = window.location.pathname;
        data.page_title = document.title;
        
        // 4. Detecta fonte se não definida
        if (!data.source && !data.utm_source) {
            data.source = detectSource();
        }
        
        // 5. Dados da sessão
        data.timestamp = new Date().toISOString();
        data.session_id = generateSessionId();
        
        // 6. Dados do dispositivo
        data.device_type = detectDeviceType();
        data.is_mobile = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent);
        data.language = navigator.language;
        data.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        log('📊 Dados capturados:', data);
        return data;
    }
    
    function detectSource() {
        const referrer = document.referrer.toLowerCase();
        const urlParams = new URLSearchParams(window.location.search);
        const path = window.location.pathname.toLowerCase();
        
        // Por parâmetros de ads
        if (urlParams.get('gclid')) return 'google_ads';
        if (urlParams.get('fbclid')) return 'facebook_ads';
        if (urlParams.get('ttclid')) return 'tiktok_ads';
        if (urlParams.get('msclkid')) return 'microsoft_ads';
        
        // Por referrer
        if (referrer.includes('google.com')) return 'google';
        if (referrer.includes('facebook.com')) return 'facebook';
        if (referrer.includes('instagram.com')) return 'instagram';
        if (referrer.includes('tiktok.com')) return 'tiktok';
        if (referrer.includes('youtube.com')) return 'youtube';
        if (referrer.includes('whatsapp.com')) return 'whatsapp';
        
        // Por página
        if (path.includes('plano') || path.includes('plan')) return 'planos';
        if (path.includes('contato') || path.includes('contact')) return 'contato';
        if (path === '/') return 'homepage';
        
        return referrer ? 'referral' : 'direct';
    }
    
    function detectDeviceType() {
        const ua = navigator.userAgent.toLowerCase();
        if (/ipad|android(?!.*mobile)|tablet/i.test(ua)) return 'tablet';
        if (/mobile|android|iphone|ipod|blackberry/i.test(ua)) return 'mobile';
        return 'desktop';
    }
    
    function extractDomain(url) {
        try {
            return new URL(url).hostname;
        } catch (e) {
            return url;
        }
    }
    
    function generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // ================================
    // INTERCEPTAÇÃO DE LINKS
    // ================================
    
    function interceptLinks() {
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a');
            
            if (!target || !target.href) return;
            
            const href = target.href;
            
            // Verifica se deve interceptar
            const shouldIntercept = (
                CONFIG.AUTO_INTERCEPT && 
                isWhatsAppLink(href) && 
                !isRedirectSystemLink(href)
            ) || target.classList.contains('ligga-track');
            
            if (shouldIntercept) {
                e.preventDefault();
                
                log('🎯 Link interceptado:', href);
                
                // Captura todos os dados
                const data = captureAllData();
                
                // Adiciona dados específicos do link
                if (target.dataset.source) data.source = target.dataset.source;
                if (target.dataset.campaign) data.campaign = target.dataset.campaign;
                if (target.dataset.plano) data.plano = target.dataset.plano;
                if (target.dataset.velocidade) data.velocidade = target.dataset.velocidade;
                if (target.dataset.promo) data.promo = target.dataset.promo;
                if (target.dataset.cidade) data.cidade = target.dataset.cidade;
                if (target.dataset.bairro) data.bairro = target.dataset.bairro;
                
                // Texto do link
                if (target.textContent) {
                    data.link_text = target.textContent.trim();
                }
                
                // Link original
                data.original_href = href;
                data.click_timestamp = new Date().toISOString();
                
                // Gera URL de redirecionamento
                const redirectUrl = generateRedirectUrl(data);
                
                log('🚀 Redirecionando:', redirectUrl);
                
                // Redireciona
                window.location.href = redirectUrl;
            }
        });
    }
    
    function generateRedirectUrl(data) {
        const urlParams = new URLSearchParams();
        
        // Adiciona todos os parâmetros
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (value !== null && value !== undefined && value !== '') {
                urlParams.set(key, value.toString());
            }
        });
        
        return `${CONFIG.REDIRECT_BASE_URL}?${urlParams.toString()}`;
    }

    // ================================
    // APRIMORAMENTO DE LINKS DIRETOS
    // ================================
    
    function enhanceDirectLinks() {
        // Links que já apontam para o sistema
        const redirectLinks = document.querySelectorAll(`a[href*="liggavendas.com.br/whatsapp"]`);
        
        redirectLinks.forEach(link => {
            const href = link.href;
            const url = new URL(href);
            const currentData = captureAllData();
            
            // Adiciona dados atuais se não existirem
            Object.keys(currentData).forEach(key => {
                if (!url.searchParams.has(key)) {
                    url.searchParams.set(key, currentData[key]);
                }
            });
            
            // Adiciona dados específicos do link
            if (link.dataset.source && !url.searchParams.has('source')) {
                url.searchParams.set('source', link.dataset.source);
            }
            if (link.dataset.plano && !url.searchParams.has('plano')) {
                url.searchParams.set('plano', link.dataset.plano);
            }
            if (link.dataset.velocidade && !url.searchParams.has('velocidade')) {
                url.searchParams.set('velocidade', link.dataset.velocidade);
            }
            
            link.href = url.toString();
            log('🔗 Link direto aprimorado:', link.href);
        });
    }

    // ================================
    // FUNÇÕES AUXILIARES
    // ================================
    
    function isWhatsAppLink(href) {
        return href && (
            href.includes('whatsapp.com') ||
            href.includes('wa.me') ||
            href.includes('api.whatsapp.com')
        );
    }

    function isRedirectSystemLink(href) {
        return href && (
            href.includes('liggavendas.com.br/whatsapp') ||
            href.includes('redirect.html')
        );
    }
    
    function log(message, data = null) {
        if (CONFIG.DEBUG) {
            console.log(`[Ligga Tracking] ${message}`, data || '');
        }
    }

    // ================================
    // API PÚBLICA
    // ================================
    
    window.LiggaTracking = {
        // Captura dados atuais
        getData: function() {
            return captureAllData();
        },
        
        // Cria link personalizado
        createLink: function(customData = {}) {
            const data = captureAllData();
            Object.assign(data, customData);
            return generateRedirectUrl(data);
        },
        
        // Redireciona com dados específicos
        redirect: function(customData = {}) {
            const url = this.createLink(customData);
            window.location.href = url;
        },
        
        // Configurações
        config: CONFIG
    };

    // ================================
    // INICIALIZAÇÃO
    // ================================
    
    function init() {
        log('🚀 Ligga Tracking inicializado');
        
        // Intercepta links
        if (CONFIG.AUTO_INTERCEPT) {
            interceptLinks();
        }
        
        // Aprimora links diretos
        enhanceDirectLinks();
        
        // Observer para novos links
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    setTimeout(enhanceDirectLinks, 100);
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Inicializa quando pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

/**
 * EXEMPLOS DE USO PARA LIGGA FIBRA:
 * 
 * 1. LINKS AUTOMÁTICOS (interceptados):
 * <a href="https://wa.me/5511999999999">Falar no WhatsApp</a>
 * 
 * 2. LINKS COM DADOS ESPECÍFICOS:
 * <a href="https://wa.me/5511999999999" 
 *    data-source="planos" 
 *    data-plano="100mb" 
 *    data-velocidade="100" 
 *    data-promo="black-friday">
 *    Contratar 100MB
 * </a>
 * 
 * 3. LINKS DIRETOS:
 * <a href="https://liggavendas.com.br/whatsapp?source=homepage&plano=200mb">
 *    Plano 200MB
 * </a>
 * 
 * 4. PROGRAMÁTICO:
 * LiggaTracking.redirect({
 *     source: 'popup',
 *     plano: '500mb',
 *     promo: 'desconto50'
 * });
 */
