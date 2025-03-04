import { config } from './config.js';

class GameState {
    constructor() {
        this._storageKey = 'gameProgress';
        this._currentLevel = 1;
        this._lives = config.initialLives;
        this._hints = config.initialHints;
        this._time = config.timePerQuestion;
        this.loadFromStorage();
        
        // Load developer settings if in dev mode
        if (config.devMode) {
            this.loadDevSettings();
        }
    }

    loadDevSettings() {
        const devLives = localStorage.getItem('dev_lives');
        const devHints = localStorage.getItem('dev_hints');
        const devLevel = localStorage.getItem('dev_level');

        if (devLives) this._lives = parseInt(devLives);
        if (devHints) this._hints = parseInt(devHints);
        if (devLevel) this._currentLevel = parseInt(devLevel);
    }

    loadFromStorage() {
        const savedState = localStorage.getItem(this._storageKey);
        if (savedState) {
            const state = JSON.parse(savedState);
            this._currentLevel = state.level || 1;
            this._lives = state.lives || config.initialLives;
            this._hints = state.hints || config.initialHints;
        }
    }

    saveToStorage() {
        const state = {
            level: this._currentLevel,
            lives: this._lives,
            hints: this._hints,
            timestamp: Date.now()
        };
        localStorage.setItem(this._storageKey, JSON.stringify(state));
    }

    get currentLevel() { return this._currentLevel; }
    set currentLevel(value) {
        this._currentLevel = value;
        this.saveToStorage();
    }

    get lives() { return this._lives; }
    set lives(value) {
        this._lives = value;
        this.saveToStorage();
    }

    get hints() { return this._hints; }
    set hints(value) {
        this._hints = value;
        this.saveToStorage();
    }

    get time() { return this._time; }
}

const gameState = new GameState();
export default gameState;
