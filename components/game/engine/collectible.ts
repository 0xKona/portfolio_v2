import { GameObject } from "./game-object";
import { COIN_CONFIG } from "./types";

/**
 * Base collectible class
 * Can be extended for different pickup types (coins, powerups, etc.)
 */
export abstract class Collectible extends GameObject {
    protected collected: boolean = false;
    protected pointValue: number;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        pointValue: number
    ) {
        super(x, y, width, height);
        this.pointValue = pointValue;
    }

    /** Move collectible left based on game speed */
    update(gameSpeed: number): void {
        this.x -= gameSpeed;

        // Mark for removal if off-screen
        if (this.x < -this.width) {
            this.destroy();
        }
    }

    /** Handle collection by player */
    collect(): number {
        if (!this.collected) {
            this.collected = true;
            this.destroy();
            return this.pointValue;
        }
        return 0;
    }

    /** Check if already collected */
    isCollected(): boolean {
        return this.collected;
    }
}

/**
 * Coin collectible
 * Pixel-style spinning coin with terminal green theme
 */
export class Coin extends Collectible {
    private animationFrame: number = 0;

    constructor(canvasWidth: number, groundHeight: number, y?: number) {
        // Position coin at varying heights for variety
        const coinY =
            y ?? groundHeight - COIN_CONFIG.HEIGHT - 30 - Math.random() * 80;
        super(canvasWidth, coinY, COIN_CONFIG.WIDTH, COIN_CONFIG.HEIGHT, COIN_CONFIG.POINTS);
    }

    update(gameSpeed: number): void {
        super.update(gameSpeed);
        this.animationFrame++;
    }

    /** Render pixel-art spinning coin */
    render(ctx: CanvasRenderingContext2D): void {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        // Calculate spin (varies width to simulate 3D rotation)
        const spinPhase = this.animationFrame * COIN_CONFIG.SPIN_SPEED;
        const scaleX = Math.cos(spinPhase);
        const absScaleX = Math.abs(scaleX);

        // Apparent width based on rotation
        const apparentWidth = Math.max(2, this.width * absScaleX);
        const halfWidth = apparentWidth / 2;
        const halfHeight = this.height / 2;

        // Use darker shade when "facing away"
        const isFrontFace = scaleX > 0;
        const mainColor = isFrontFace ? COIN_CONFIG.COLOR : COIN_CONFIG.COLOR_DARK;

        // Draw pixel-style rectangular coin body
        ctx.fillStyle = mainColor;
        ctx.fillRect(
            centerX - halfWidth,
            centerY - halfHeight,
            apparentWidth,
            this.height
        );

        // Pixel border (1px darker outline)
        ctx.strokeStyle = "#166534";
        ctx.lineWidth = 1;
        ctx.strokeRect(
            centerX - halfWidth,
            centerY - halfHeight,
            apparentWidth,
            this.height
        );

        // Inner detail line when wide enough (simulates $ symbol)
        if (apparentWidth > 6) {
            ctx.strokeStyle = "#166534";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - halfHeight + 3);
            ctx.lineTo(centerX, centerY + halfHeight - 3);
            ctx.stroke();
        }
    }
}

/**
 * Example powerup class - can be extended for different powerup types
 * Uncomment and customize when ready to implement
 */
// export class SpeedBoost extends Collectible {
//     constructor(x: number = GAME_CONFIG.CANVAS_WIDTH) {
//         super(x, GAME_CONFIG.GROUND_HEIGHT - 60, 25, 25, 0);
//     }
//
//     render(ctx: CanvasRenderingContext2D): void {
//         ctx.fillStyle = "#22d3ee"; // cyan
//         ctx.fillRect(this.x, this.y, this.width, this.height);
//     }
//
//     collect(): number {
//         // Return special value or trigger powerup effect
//         this.collected = true;
//         this.destroy();
//         return -1; // Negative indicates powerup, not points
//     }
// }
