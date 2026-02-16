import { GameObject } from "./game-object";
import { OBSTACLE_CONFIG, ObstacleType, ObstacleSpawnConfig } from "./types";

/**
 * Obstacle class
 * Represents hazards the player must avoid
 * Supports varied sizes and types (ground, floating, tall, wide)
 */
export class Obstacle extends GameObject {
    private passed: boolean = false;
    private readonly pointValue: number = 10;
    private readonly obstacleType: ObstacleType;

    constructor(config: ObstacleSpawnConfig, canvasWidth: number) {
        super(canvasWidth, config.y, config.width, config.height);
        this.obstacleType = config.type;
    }

    /** Move obstacle left based on game speed */
    update(gameSpeed: number): void {
        this.x -= gameSpeed;

        // Mark for removal if off-screen
        if (this.x < -this.width) {
            this.destroy();
        }
    }

    /** Render obstacle to canvas with pixel-style appearance */
    render(ctx: CanvasRenderingContext2D): void {
        // Main body
        ctx.fillStyle = OBSTACLE_CONFIG.COLOR;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Darker border for depth
        ctx.strokeStyle = OBSTACLE_CONFIG.COLOR_DARK;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Inner detail lines for texture
        ctx.strokeStyle = OBSTACLE_CONFIG.COLOR_DARK;
        ctx.lineWidth = 1;

        // Horizontal lines
        const lineSpacing = 12;
        for (let i = lineSpacing; i < this.height; i += lineSpacing) {
            ctx.beginPath();
            ctx.moveTo(this.x + 2, this.y + i);
            ctx.lineTo(this.x + this.width - 2, this.y + i);
            ctx.stroke();
        }
    }

    /** Check if player has passed this obstacle (for scoring) */
    checkPassed(playerX: number): number {
        if (!this.passed && this.x + this.width < playerX) {
            this.passed = true;
            return this.pointValue;
        }
        return 0;
    }

    /** Check if obstacle has been passed */
    hasPassed(): boolean {
        return this.passed;
    }

    /** Get the obstacle type */
    getType(): ObstacleType {
        return this.obstacleType;
    }
}
