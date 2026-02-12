/** Game configuration constants */
export const GAME_CONFIG = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 300,
    GROUND_HEIGHT: 250,
    INITIAL_GAME_SPEED: 5,
    SPEED_INCREMENT: 0.0015,
    GRAVITY: 0.6,
} as const;

/** Player-specific constants */
export const PLAYER_CONFIG = {
    WIDTH: 40,
    HEIGHT: 62,
    X_POSITION: 50,
    JUMP_STRENGTH: -15,
} as const;

/** Obstacle-specific constants */
export const OBSTACLE_CONFIG = {
    WIDTH: 30,
    HEIGHT: 50,
    SPAWN_INTERVAL: 100,
    COLOR: "#f87171",
} as const;

/** Coin-specific constants */
export const COIN_CONFIG = {
    WIDTH: 16,
    HEIGHT: 16,
    SPAWN_INTERVAL: 150,
    COLOR: "#4ADE80",
    COLOR_DARK: "#22C55E",
    SPIN_SPEED: 0.05,
    POINTS: 0, // Coins don't add points directly - they multiply at end
    MULTIPLIER: 0.1, // Each coin adds 10% to final score
} as const;

/** Position and dimensions for game objects */
export interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

/** Game state exposed to React component */
export interface GameState {
    isPlaying: boolean;
    score: number;
    coins: number;
    finalScore: number;
    gameOver: boolean;
    playerY: number;
}

/** Events emitted by game engine */
export type GameEventType = "score" | "coins" | "gameOver" | "playerMove";

export interface GameEvent {
    type: GameEventType;
    payload: number;
}

export type GameEventCallback = (event: GameEvent) => void;
