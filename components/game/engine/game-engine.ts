import { Player } from "./player";
import { Obstacle } from "./obstacle";
import { Coin, Collectible } from "./collectible";
import {
    GAME_CONFIG,
    OBSTACLE_CONFIG,
    COIN_CONFIG,
    PLAYER_CONFIG,
    GameEventCallback,
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
        // Spawn obstacles
        if (this.features.obstacles && this.frameCount % OBSTACLE_CONFIG.SPAWN_INTERVAL === 0) {
            this.obstacles.push(new Obstacle());
        }

        // Spawn coins (offset from obstacles)
        if (this.features.coins && this.frameCount % COIN_CONFIG.SPAWN_INTERVAL === 50) {
            this.collectibles.push(new Coin());
        }
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
