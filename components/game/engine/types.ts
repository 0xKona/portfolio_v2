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
    COLOR: "#f87171",
    COLOR_DARK: "#dc2626",
    // Base dimensions (will vary with difficulty)
    MIN_WIDTH: 20,
    MAX_WIDTH: 60,
    MIN_HEIGHT: 30,
    MAX_HEIGHT: 80,
    // Floating obstacle settings
    FLOAT_MIN_HEIGHT: 40,
    FLOAT_MAX_HEIGHT: 90,
    // Spawn timing
    BASE_SPAWN_INTERVAL: 180, // Frames between spawns at start
    MIN_SPAWN_INTERVAL: 80, // Minimum frames between spawns at max difficulty
    // Difficulty ramping
    DIFFICULTY_RAMP_FRAMES: 3600, // ~60 seconds to reach max difficulty
} as const;

/** Difficulty configuration */
export const DIFFICULTY_CONFIG = {
    // How quickly difficulty increases (0-1 scale over DIFFICULTY_RAMP_FRAMES)
    MAX_DIFFICULTY: 1,
    // Chance of floating obstacle (increases with difficulty)
    FLOAT_CHANCE_MIN: 0,
    FLOAT_CHANCE_MAX: 0.3,
    // Chance of tall obstacle (increases with difficulty)
    TALL_CHANCE_MIN: 0,
    TALL_CHANCE_MAX: 0.4,
    // Chance of wide obstacle (increases with difficulty)
    WIDE_CHANCE_MIN: 0.1,
    WIDE_CHANCE_MAX: 0.5,
} as const;

/** Obstacle type for varied shapes */
export type ObstacleType = "ground" | "floating" | "tall" | "wide";

/** Obstacle spawn configuration */
export interface ObstacleSpawnConfig {
    type: ObstacleType;
    width: number;
    height: number;
    y: number;
}

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
