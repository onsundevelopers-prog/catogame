// Universal Catabux System for All Games
// This script provides Catabux functionality to any game

class CatabuxRewards {
    constructor() {
        this.catabuxKey = 'catabux';
        this.gameRewardsKey = 'game_rewards';
        this.init();
    }

    init() {
        // Create Catabux display if it doesn't exist
        this.createCatabuxDisplay();
        
        // Load existing rewards data
        this.gameRewards = JSON.parse(localStorage.getItem(this.gameRewardsKey) || '{}');
        
        // Update display
        this.updateDisplay();
        
        // Auto-reward for just playing (once per game per day)
        this.givePlayReward();
    }

    getCatabux() {
        return parseInt(localStorage.getItem(this.catabuxKey)) || 0;
    }

    setCatabux(value) {
        localStorage.setItem(this.catabuxKey, value);
        this.updateDisplay();
        
        // Track analytics if available
        if (window.catagameAnalytics) {
            window.catagameAnalytics.trackEvent('catabux_earned', {
                amount: value - this.getCatabux(),
                source: 'game_reward',
                game: this.getGameName()
            });
        }
    }

    addCatabux(amount, reason = 'Game Reward') {
        const current = this.getCatabux();
        this.setCatabux(current + amount);
        this.showRewardNotification(amount, reason);
        return current + amount;
    }

    getGameName() {
        // Try to get game name from page title or URL
        const title = document.title;
        const path = window.location.pathname;
        
        if (title.includes('Homework')) return 'The Homework Game';
        if (title.includes('Robot') || path.includes('99thday')) return 'Are You a Robot?';
        if (title.includes('Asteroid') || path.includes('mapsurvallance')) return 'Asteroid Launcher';
        if (title.includes('Typer') || path.includes('unfairtyper')) return 'Unfair Typer';
        if (title.includes('Distractions')) return 'Distractions';
        if (title.includes('Report')) return 'Report Card';
        if (title.includes('Sandbox')) return 'The Sandbox';
        if (title.includes('Pick') || path.includes('Pickone')) return 'Pick One';
        if (title.includes('Defense') || path.includes('towerdefense')) return 'Tower Defense';
        if (title.includes('Circle') || path.includes('perfectcircle')) return 'Perfect Circle';
        if (title.includes('Bill') || path.includes('bill')) return 'Bill Gates Simulator';
        if (path.includes('newgame')) return 'New Game';
        
        return 'Unknown Game';
    }

    createCatabuxDisplay() {
        // Check if display already exists
        if (document.getElementById('catabux-game-display')) return;

        const display = document.createElement('div');
        display.id = 'catabux-game-display';
        display.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #feeacf;
            border: 3px solid #4d3529;
            border-radius: 20px;
            padding: 10px 20px;
            font-family: 'Inter', Arial, sans-serif;
            font-weight: 700;
            font-size: 16px;
            color: #4d3529;
            z-index: 10000;
            box-shadow: 6px 6px 0px #291b14;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        display.addEventListener('mouseenter', () => {
            display.style.transform = 'translate(-3px, -3px)';
            display.style.boxShadow = '10px 10px 0px #291b14';
        });
        
        display.addEventListener('mouseleave', () => {
            display.style.transform = 'translate(0, 0)';
            display.style.boxShadow = '6px 6px 0px #291b14';
        });
        
        display.addEventListener('click', () => {
            window.open('../../index.html', '_blank');
        });
        
        document.body.appendChild(display);
    }

    updateDisplay() {
        const display = document.getElementById('catabux-game-display');
        if (display) {
            display.textContent = `${this.getCatabux()} Catabux`;
        }
    }

    givePlayReward() {
        const gameName = this.getGameName();
        const today = new Date().toDateString();
        
        if (!this.gameRewards[gameName]) {
            this.gameRewards[gameName] = {};
        }
        
        // Give daily play reward
        if (this.gameRewards[gameName].lastPlayReward !== today) {
            this.addCatabux(5, 'Daily Play Bonus');
            this.gameRewards[gameName].lastPlayReward = today;
            this.gameRewards[gameName].totalPlays = (this.gameRewards[gameName].totalPlays || 0) + 1;
            localStorage.setItem(this.gameRewardsKey, JSON.stringify(this.gameRewards));
        }
    }

    giveCompletionReward(amount = 10) {
        this.addCatabux(amount, 'Game Completion');
    }

    giveScoreReward(score, multiplier = 0.1) {
        const reward = Math.max(1, Math.floor(score * multiplier));
        this.addCatabux(reward, `Score Bonus (${score} points)`);
    }

    giveTimeReward(seconds, maxReward = 20) {
        // Reward based on time spent (more time = more reward, up to max)
        const reward = Math.min(maxReward, Math.max(1, Math.floor(seconds / 30)));
        this.addCatabux(reward, `Time Bonus (${seconds}s)`);
    }

    giveAchievementReward(achievementName, amount = 15) {
        const gameName = this.getGameName();
        
        if (!this.gameRewards[gameName]) {
            this.gameRewards[gameName] = {};
        }
        
        if (!this.gameRewards[gameName].achievements) {
            this.gameRewards[gameName].achievements = [];
        }
        
        // Only give achievement reward once
        if (!this.gameRewards[gameName].achievements.includes(achievementName)) {
            this.addCatabux(amount, `Achievement: ${achievementName}`);
            this.gameRewards[gameName].achievements.push(achievementName);
            localStorage.setItem(this.gameRewardsKey, JSON.stringify(this.gameRewards));
        }
    }

    showRewardNotification(amount, reason) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #22c55e;
            color: white;
            border: 3px solid #16a34a;
            border-radius: 12px;
            padding: 15px 20px;
            font-family: 'Inter', Arial, sans-serif;
            font-weight: 700;
            font-size: 14px;
            z-index: 10001;
            box-shadow: 6px 6px 0px rgba(0,0,0,0.3);
            transform: translateX(400px);
            transition: all 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">💰</span>
                <div>
                    <div>+${amount} Catabux</div>
                    <div style="font-size: 12px; opacity: 0.9;">${reason}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Convenience methods for common game events
    onGameStart() {
        // Already handled in init with givePlayReward
    }

    onGameComplete(score = null) {
        this.giveCompletionReward();
        if (score !== null) {
            this.giveScoreReward(score);
        }
    }

    onLevelComplete(level) {
        this.addCatabux(2, `Level ${level} Complete`);
    }

    onHighScore(score) {
        this.giveAchievementReward('High Score', 25);
    }

    onFirstTime() {
        this.giveAchievementReward('First Time Player', 20);
    }

    // Method to track time and give time-based rewards
    startTimeTracking() {
        this.startTime = Date.now();
    }

    endTimeTracking() {
        if (this.startTime) {
            const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
            if (timeSpent > 10) { // Only reward if played for more than 10 seconds
                this.giveTimeReward(timeSpent);
            }
        }
    }
}

// Auto-initialize when script loads
window.catabuxRewards = new CatabuxRewards();

// Global convenience functions
window.addCatabux = (amount, reason) => window.catabuxRewards.addCatabux(amount, reason);
window.gameComplete = (score) => window.catabuxRewards.onGameComplete(score);
window.levelComplete = (level) => window.catabuxRewards.onLevelComplete(level);
window.achievement = (name, amount) => window.catabuxRewards.giveAchievementReward(name, amount);

// Auto-track time for games
window.addEventListener('load', () => {
    window.catabuxRewards.startTimeTracking();
});

window.addEventListener('beforeunload', () => {
    window.catabuxRewards.endTimeTracking();
});

console.log('🎮 Catabux Rewards System Loaded! Games will now reward Catabux automatically.');