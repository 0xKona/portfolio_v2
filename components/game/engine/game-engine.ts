import { Player } from "./player";
import { Obstacle } from "./obstacle";
import { Coin, Collectible } from "./collectible";
import {
    GAME_CONFIG,
    OBSTACLE_CONFIG,
    DIFFICULTY_CONFIG,
    COIN_CONFIG,
    PLAYER_CONFIG,
    GameEventCallback,
    ObstacleSpawnConfig,
    ObstacleType,
    Bounds,
} from "./types";

/**
 * Main game engine
 * Orchestrates game loop, entity management, and event dispatching
 */
export class GameEngine {
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private animationFrameId: number | null = null;

    private player: Player;
    private obstacles: Obstacle[] = [];
    private collectibles: Collectible[] = [];

    private gameSpeed: number = GAME_CONFIG.INITIAL_GAME_SPEED;
    private frameCount: number = 0;
    private score: number = 0;
    private coins: number = 0;
    private isRunning: boolean = false;
    private isPaused: boolean = false;

    // Difficulty and spawn tracking
    private lastObstacleSpawn: number = 0;
    private lastCoinSpawn: number = 0;
    private readonly COIN_OBSTACLE_BUFFER = 60; // Min pixels between coins and obstacles

    private eventCallback: GameEventCallback | null = null;

    /** Feature flags for easy toggling */
    private features = {
        coins: true,
        obstacles: true,
    };

    constructor() {
        this.player = new Player();
    }

    /** Initialize engine with canvas element */
    init(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    /** Set callback for game events */
    onEvent(callback: GameEventCallback): void {
        this.eventCallback = callback;
    }

    /** Enable/disable game features */
    setFeature(feature: keyof typeof this.features, enabled: boolean): void {
        this.features[feature] = enabled;
    }

    /** Emit event to React component */
    private emit(type: "score" | "coins" | "gameOver" | "playerMove", payload: number): void {
        this.eventCallback?.({ type, payload });
    }

    /** Start new game */
    start(): void {
        this.reset();
        this.isRunning = true;
        this.isPaused = false;
        this.gameLoop();
    }

    /** Stop the game */
    stop(): void {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /** Pause/unpause the game */
    togglePause(): void {
        this.isPaused = !this.isPaused;
        if (!this.isPaused && this.isRunning) {
            this.gameLoop();
        }
    }

    /** Reset game state */
    private reset(): void {
        this.player.reset();
        this.obstacles = [];
        this.collectibles = [];
        this.gameSpeed = GAME_CONFIG.INITIAL_GAME_SPEED;
        this.frameCount = 0;
        this.score = 0;
        this.coins = 0;
        this.lastObstacleSpawn = 0;
        this.lastCoinSpawn = 0;
    }

    /** Handle player jump input */
    jump(): void {
        if (this.isRunning && !this.isPaused) {
            this.player.jump();
        }
    }

    /** Main game loop */
    private gameLoop = (): void => {
        if (!this.isRunning || this.isPaused || !this.ctx) return;

        this.frameCount++;

        this.clearCanvas();
        this.drawGround();
        this.spawnEntities();
        this.updateEntities();
        this.checkCollisions();
        this.renderEntities();
        this.increaseSpeed();

        // Emit player position for sprite overlay
        this.emit("playerMove", this.player.getY());

        this.animationFrameId = requestAnimationFrame(this.gameLoop);
    };

    /** Clear canvas */
    private clearCanvas(): void {
        if (!this.ctx) return;
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
    }

    /** Draw ground line */
    private drawGround(): void {
        if (!this.ctx) return;
        this.ctx.strokeStyle = "#404040";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, GAME_CONFIG.GROUND_HEIGHT);
        this.ctx.lineTo(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.GROUND_HEIGHT);
        this.ctx.stroke();
    }

    /** Spawn new entities based on frame count */
    private spawnEntities(): void {
        const difficulty = this.getDifficulty();
        const spawnInterval = this.getObstacleSpawnInterval(difficulty);

        // Spawn obstacles with dynamic timing
        if (this.features.obstacles && this.frameCount - this.lastObstacleSpawn >= spawnInterval) {
            const config = this.generateObstacleConfig(difficulty);
            this.obstacles.push(new Obstacle(config));
            this.lastObstacleSpawn = this.frameCount;
        }

        // Spawn coins with smart placement (avoid obstacles)
        const coinInterval = COIN_CONFIG.SPAWN_INTERVAL;
        if (this.features.coins && this.frameCount - this.lastCoinSpawn >= coinInterval) {
            const coinPosition = this.findSafeCoinPosition();
            if (coinPosition) {
                this.collectibles.push(new Coin(coinPosition.x, coinPosition.y));
                this.lastCoinSpawn = this.frameCount;
            }
        } 
    }

    /** Calculate current difficulty (0 to 1) */
    private getDifficulty(): number {
        const progress = this.frameCount / OBSTACLE_CONFIG.DIFFICULTY_RAMP_FRAMES;
        return Math.min(progress, DIFFICULTY_CONFIG.MAX_DIFFICULTY);
    }

    /** Get spawn interval based on difficulty (larger = more space at start) */
    private getObstacleSpawnInterval(difficulty: number): number {
        const range = OBSTACLE_CONFIG.BASE_SPAWN_INTERVAL - OBSTACLE_CONFIG.MIN_SPAWN_INTERVAL;
        return OBSTACLE_CONFIG.BASE_SPAWN_INTERVAL - range * difficulty;
    }

    /** Generate obstacle configuration based on current difficulty */
    private generateObstacleConfig(difficulty: number): ObstacleSpawnConfig {
        const type = this.pickObstacleType(difficulty);

        let width: number;
        let height: number;
        let y: number;

        switch (type) {
            case "tall":
                // Tall narrow obstacles
                width = this.randomRange(OBSTACLE_CONFIG.MIN_WIDTH, OBSTACLE_CONFIG.MIN_WIDTH + 15);
                height = this.randomRange(OBSTACLE_CONFIG.MAX_HEIGHT - 10, OBSTACLE_CONFIG.MAX_HEIGHT);
                y = GAME_CONFIG.GROUND_HEIGHT - height;
                break;

            case "wide":
                // Wide short obstacles
                width = this.randomRange(OBSTACLE_CONFIG.MAX_WIDTH - 15, OBSTACLE_CONFIG.MAX_WIDTH);
                height = this.randomRange(OBSTACLE_CONFIG.MIN_HEIGHT, OBSTACLE_CONFIG.MIN_HEIGHT + 20);
                y = GAME_CONFIG.GROUND_HEIGHT - height;
                break;

            case "floating":
                // Floating obstacles - must be jumpable under
                width = this.randomRange(OBSTACLE_CONFIG.MIN_WIDTH, OBSTACLE_CONFIG.MIN_WIDTH + 20);
                height = this.randomRange(OBSTACLE_CONFIG.FLOAT_MIN_HEIGHT, OBSTACLE_CONFIG.FLOAT_MAX_HEIGHT);
                // Position so player can run under OR jump over
                const maxFloatY = GAME_CONFIG.GROUND_HEIGHT - PLAYER_CONFIG.HEIGHT - 15; // Min clearance
                const minFloatY = GAME_CONFIG.GROUND_HEIGHT - height - 80; // Max height to still jump over
                y = this.randomRange(Math.max(50, minFloatY), maxFloatY - height);
                break;

            case "ground":
            default:
                // Standard ground obstacle with size variance based on difficulty
                const sizeScale = 0.5 + difficulty * 0.5; // 50% to 100% of max size
                width = this.randomRange(
                    OBSTACLE_CONFIG.MIN_WIDTH,
                    OBSTACLE_CONFIG.MIN_WIDTH + (OBSTACLE_CONFIG.MAX_WIDTH - OBSTACLE_CONFIG.MIN_WIDTH) * sizeScale
                );
                height = this.randomRange(
                    OBSTACLE_CONFIG.MIN_HEIGHT,
                    OBSTACLE_CONFIG.MIN_HEIGHT + (OBSTACLE_CONFIG.MAX_HEIGHT - OBSTACLE_CONFIG.MIN_HEIGHT) * sizeScale
                );
                y = GAME_CONFIG.GROUND_HEIGHT - height;
                break;
        }

        return { type, width, height, y };
    }

    /** Pick obstacle type based on difficulty-weighted chances */
    private pickObstacleType(difficulty: number): ObstacleType {
        const floatChance = this.lerp(DIFFICULTY_CONFIG.FLOAT_CHANCE_MIN, DIFFICULTY_CONFIG.FLOAT_CHANCE_MAX, difficulty);
        const tallChance = this.lerp(DIFFICULTY_CONFIG.TALL_CHANCE_MIN, DIFFICULTY_CONFIG.TALL_CHANCE_MAX, difficulty);
        const wideChance = this.lerp(DIFFICULTY_CONFIG.WIDE_CHANCE_MIN, DIFFICULTY_CONFIG.WIDE_CHANCE_MAX, difficulty);

        const roll = Math.random();
        let cumulative = 0;

        cumulative += floatChance;
        if (roll < cumulative) return "floating";

        cumulative += tallChance;
        if (roll < cumulative) return "tall";

        cumulative += wideChance;
        if (roll < cumulative) return "wide";

        return "ground";
    }

    /** Find a safe position for coin that doesn't overlap obstacles */
    private findSafeCoinPosition(): { x: number; y: number } | null {
        const coinX = GAME_CONFIG.CANVAS_WIDTH;

        // Get bounds of upcoming obstacles near spawn point
        const nearbyObstacles = this.obstacles
            .filter((obs) => {
                const bounds = obs.getBounds();
                // Check obstacles that will be near the coin's path
                return bounds.x > GAME_CONFIG.CANVAS_WIDTH - 200;
            })
            .map((obs) => obs.getBounds());

        // Try multiple Y positions to find a safe spot
        const attempts = 5;
        for (let i = 0; i < attempts; i++) {
            // Random Y position for coin
            const coinY = GAME_CONFIG.GROUND_HEIGHT - COIN_CONFIG.HEIGHT - 30 - Math.random() * 100;

            const coinBounds: Bounds = {
                x: coinX,
                y: coinY,
                width: COIN_CONFIG.WIDTH + this.COIN_OBSTACLE_BUFFER * 2,
                height: COIN_CONFIG.HEIGHT + this.COIN_OBSTACLE_BUFFER * 2,
            };

            // Check if this position is safe
            let isSafe = true;
            for (const obsBounds of nearbyObstacles) {
                if (this.boundsOverlap(coinBounds, {
                    x: obsBounds.x - this.COIN_OBSTACLE_BUFFER,
                    y: obsBounds.y - this.COIN_OBSTACLE_BUFFER,
                    width: obsBounds.width + this.COIN_OBSTACLE_BUFFER * 2,
                    height: obsBounds.height + this.COIN_OBSTACLE_BUFFER * 2,
                })) {
                    isSafe = false;
                    break;
                }
            }

            if (isSafe) {
                return { x: coinX, y: coinY };
            }
        }

        // No safe position found, skip this coin spawn
        return null;
    }

    /** Check if two bounds overlap */
    private boundsOverlap(a: Bounds, b: Bounds): boolean {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    /** Linear interpolation */
    private lerp(min: number, max: number, t: number): number {
        return min + (max - min) * t;
    }

    /** Random number in range */
    private randomRange(min: number, max: number): number {
        return min + Math.random() * (max - min);
    }

    /** Update all game entities */
    private updateEntities(): void {
        // Update player
        this.player.update();

        // Update and filter obstacles
        this.obstacles = this.obstacles.filter((obstacle) => {
            obstacle.update(this.gameSpeed);

            // Check if player passed obstacle
            const points = obstacle.checkPassed(PLAYER_CONFIG.X_POSITION);
            if (points > 0) {
                this.addScore(points);
            }

            return obstacle.isActive();
        });

        // Update and filter collectibles
        this.collectibles = this.collectibles.filter((collectible) => {
            collectible.update(this.gameSpeed);
            return collectible.isActive();
        });
    }

    /** Check for collisions */
    private checkCollisions(): void {
        // Check obstacle collisions (game over)
        for (const obstacle of this.obstacles) {
            if (this.player.collidesWith(obstacle)) {
                this.gameOver();
                return;
            }
        }

        // Check collectible collisions (pickup)
        for (const collectible of this.collectibles) {
            if (this.player.collidesWith(collectible)) {
                collectible.collect();
                this.addCoin();
            }
        }
    }

    /** Render all entities */
    private renderEntities(): void {
        if (!this.ctx) return;

        // Render obstacles
        for (const obstacle of this.obstacles) {
            obstacle.render(this.ctx);
        }

        // Render collectibles
        for (const collectible of this.collectibles) {
            collectible.render(this.ctx);
        }

        // Player is rendered as HTML overlay for GIF support
    }

    /** Add to score and emit event */
    private addScore(points: number): void {
        this.score += points;
        this.emit("score", this.score);
    }

    /** Add coin and emit event */
    private addCoin(): void {
        this.coins++;
        this.emit("coins", this.coins);
    }

    /** Calculate final score with coin multiplier */
    private calculateFinalScore(): number {
        const multiplier = 1 + this.coins * COIN_CONFIG.MULTIPLIER;
        return Math.floor(this.score * multiplier);
    }

    /** Handle game over */
    private gameOver(): void {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.emit("gameOver", this.calculateFinalScore());
    }

    /** Gradually increase game speed */
    private increaseSpeed(): void {
        this.gameSpeed += GAME_CONFIG.SPEED_INCREMENT;
    }

    /** Get current score */
    getScore(): number {
        return this.score;
    }

    /** Get player Y position (for sprite positioning) */
    getPlayerY(): number {
        return this.player.getY();
    }

    /** Check if game is currently running */
    getIsRunning(): boolean {
        return this.isRunning;
    }

    /** Cleanup */
    destroy(): void {
        this.stop();
        this.canvas = null;
        this.ctx = null;
        this.eventCallback = null;
    }
}
