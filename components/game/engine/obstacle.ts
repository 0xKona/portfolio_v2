import { GameObject } from "./game-object";
import { GAME_CONFIG, OBSTACLE_CONFIG } from "./types";

/**
 * Obstacle class
 * Represents hazards the player must avoid
 */
export class Obstacle extends GameObject {
    private passed: boolean = false;
    private readonly pointValue: number = 10;

    constructor(x: number = GAME_CONFIG.CANVAS_WIDTH) {
        super(
            x,
            GAME_CONFIG.GROUND_HEIGHT - OBSTACLE_CONFIG.HEIGHT,
            OBSTACLE_CONFIG.WIDTH,
            OBSTACLE_CONFIG.HEIGHT
        );
    }

    /** Move obstacle left based on game speed */
    update(gameSpeed: number): void {
        this.x -= gameSpeed;

        // Mark for removal if off-screen
        if (this.x < -this.width) {
            this.destroy();
        }
    }

    /** Render obstacle to canvas */
    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = OBSTACLE_CONFIG.COLOR;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
}
