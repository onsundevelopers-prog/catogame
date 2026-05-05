// Catagame Analytics & Data Collection System
class CatagameAnalytics {
    constructor() {
        this.userId = this.getUserId();
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.events = [];
        this.userPreferences = this.loadUserPreferences();
        this.init();
    }

    getUserId() {
        let userId = localStorage.getItem('catagame_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('catagame_user_id', userId);
        }
        return userId;
    }

    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    loadUserPreferences() {
        return JSON.parse(localStorage.getItem('catagame_preferences') || '{}');
    }

    saveUserPreferences() {
        localStorage.setItem('catagame_preferences', JSON.stringify(this.userPreferences));
    }

    init() {
        this.trackPageView();
        this.setupEventListeners();
        this.trackUserBehavior();
        this.collectDeviceInfo();
        
        // Send data every 30 seconds
        setInterval(() => this.sendData(), 30000);
        
        // Send data before page unload
        window.addEventListener('beforeunload', () => this.sendData());
    }

    trackEvent(eventName, data = {}) {
        const event = {
            event: eventName,
            timestamp: Date.now(),
            userId: this.userId,
            sessionId: this.sessionId,
            url: window.location.href,
            ...data
        };
        
        this.events.push(event);
        console.log('Analytics Event:', event);
        
        // Send immediately for important events
        if (['game_start', 'purchase', 'signup'].includes(eventName)) {
            this.sendData();
        }
    }

    trackPageView() {
        this.trackEvent('page_view', {
            page: window.location.pathname,
            title: document.title,
            referrer: document.referrer,
            userAgent: navigator.userAgent
        });
    }

    setupEventListeners() {
        // Track clicks
        document.addEventListener('click', (e) => {
            const element = e.target;
            const data = {
                element: element.tagName,
                className: element.className,
                id: element.id,
                text: element.textContent?.substring(0, 100),
                x: e.clientX,
                y: e.clientY
            };

            // Special tracking for games
            if (element.closest('.game-card')) {
                const gameCard = element.closest('.game-card');
                const gameTitle = gameCard.querySelector('h4')?.textContent;
                this.trackEvent('game_click', { 
                    ...data, 
                    gameTitle,
                    gameUrl: gameCard.href 
                });
                this.updateGamePreference(gameTitle, 'clicked');
            }
            // Track shop purchases
            else if (element.classList.contains('buy-btn')) {
                const shopCard = element.closest('.shop-card');
                const itemName = shopCard.querySelector('h3')?.textContent;
                const price = shopCard.dataset.price;
                this.trackEvent('shop_item_click', { 
                    ...data, 
                    itemName, 
                    price 
                });
            }
            // Track button clicks
            else if (element.tagName === 'BUTTON') {
                this.trackEvent('button_click', data);
            }
            // Track link clicks
            else if (element.tagName === 'A') {
                this.trackEvent('link_click', { 
                    ...data, 
                    href: element.href 
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            this.trackEvent('form_submit', {
                formId: form.id,
                formClass: form.className,
                action: form.action
            });
        });

        // Track scroll behavior
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                this.trackEvent('scroll', { 
                    scrollPercent,
                    scrollY: window.scrollY 
                });
            }, 1000);
        });

        // Track time spent on page
        let timeOnPage = 0;
        setInterval(() => {
            timeOnPage += 5;
            if (timeOnPage % 30 === 0) { // Every 30 seconds
                this.trackEvent('time_on_page', { 
                    timeSpent: timeOnPage,
                    isActive: document.hasFocus()
                });
            }
        }, 5000);

        // Track Catabux usage
        const originalSetCatabux = window.setCatabux;
        if (originalSetCatabux) {
            window.setCatabux = (value) => {
                const oldValue = window.getCatabux ? window.getCatabux() : 0;
                const change = value - oldValue;
                this.trackEvent('catabux_change', {
                    oldValue,
                    newValue: value,
                    change,
                    action: change > 0 ? 'earned' : 'spent'
                });
                return originalSetCatabux(value);
            };
        }
    }

    trackUserBehavior() {
        // Track mouse movement patterns
        let mouseMovements = 0;
        document.addEventListener('mousemove', () => {
            mouseMovements++;
            if (mouseMovements % 100 === 0) {
                this.trackEvent('mouse_activity', { movements: mouseMovements });
            }
        });

        // Track keyboard usage
        let keyPresses = 0;
        document.addEventListener('keydown', (e) => {
            keyPresses++;
            if (keyPresses % 50 === 0) {
                this.trackEvent('keyboard_activity', { 
                    keyPresses,
                    lastKey: e.key 
                });
            }
        });

        // Track window focus/blur
        window.addEventListener('focus', () => {
            this.trackEvent('window_focus');
        });

        window.addEventListener('blur', () => {
            this.trackEvent('window_blur');
        });

        // Track screen resolution and viewport
        this.trackEvent('viewport_info', {
            screenWidth: screen.width,
            screenHeight: screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio
        });
    }

    collectDeviceInfo() {
        const deviceInfo = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screenColorDepth: screen.colorDepth,
            screenPixelDepth: screen.pixelDepth
        };

        this.trackEvent('device_info', deviceInfo);
    }

    updateGamePreference(gameTitle, action) {
        if (!this.userPreferences.games) {
            this.userPreferences.games = {};
        }
        
        if (!this.userPreferences.games[gameTitle]) {
            this.userPreferences.games[gameTitle] = {
                clicks: 0,
                plays: 0,
                timeSpent: 0,
                lastPlayed: null,
                rating: null
            };
        }

        const game = this.userPreferences.games[gameTitle];
        
        switch (action) {
            case 'clicked':
                game.clicks++;
                break;
            case 'played':
                game.plays++;
                game.lastPlayed = Date.now();
                break;
            case 'rated':
                // This would be called when user rates a game
                break;
        }

        this.saveUserPreferences();
        this.trackEvent('preference_update', { 
            gameTitle, 
            action, 
            preferences: game 
        });
    }

    // Track what users like/dislike
    trackLike(item, type = 'game') {
        if (!this.userPreferences.likes) {
            this.userPreferences.likes = [];
        }
        
        this.userPreferences.likes.push({
            item,
            type,
            timestamp: Date.now()
        });
        
        this.saveUserPreferences();
        this.trackEvent('user_like', { item, type });
    }

    trackDislike(item, type = 'game') {
        if (!this.userPreferences.dislikes) {
            this.userPreferences.dislikes = [];
        }
        
        this.userPreferences.dislikes.push({
            item,
            type,
            timestamp: Date.now()
        });
        
        this.saveUserPreferences();
        this.trackEvent('user_dislike', { item, type });
    }

    // Send data to server (you'll need to implement the backend)
    async sendData() {
        if (this.events.length === 0) return;

        const payload = {
            userId: this.userId,
            sessionId: this.sessionId,
            events: [...this.events],
            preferences: this.userPreferences,
            timestamp: Date.now()
        };

        try {
            // Replace with your actual analytics endpoint
            const response = await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                this.events = []; // Clear sent events
                console.log('Analytics data sent successfully');
            }
        } catch (error) {
            console.log('Analytics data stored locally (no server):', payload);
            // Store in localStorage as backup
            const stored = JSON.parse(localStorage.getItem('catagame_analytics_backup') || '[]');
            stored.push(payload);
            localStorage.setItem('catagame_analytics_backup', JSON.stringify(stored.slice(-10))); // Keep last 10
        }
    }

    // Public methods for manual tracking
    trackGameStart(gameTitle) {
        this.trackEvent('game_start', { gameTitle });
        this.updateGamePreference(gameTitle, 'played');
    }

    trackGameEnd(gameTitle, duration, score = null) {
        this.trackEvent('game_end', { 
            gameTitle, 
            duration, 
            score 
        });
        
        if (this.userPreferences.games && this.userPreferences.games[gameTitle]) {
            this.userPreferences.games[gameTitle].timeSpent += duration;
            this.saveUserPreferences();
        }
    }

    trackPurchase(item, price, currency = 'catabux') {
        this.trackEvent('purchase', { 
            item, 
            price, 
            currency 
        });
    }

    trackError(error, context = '') {
        this.trackEvent('error', { 
            error: error.toString(), 
            context,
            stack: error.stack 
        });
    }
}

// Initialize analytics
window.catagameAnalytics = new CatagameAnalytics();

// Global error tracking
window.addEventListener('error', (e) => {
    window.catagameAnalytics.trackError(e.error, 'global_error');
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CatagameAnalytics;
}