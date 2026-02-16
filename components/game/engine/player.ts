import { GameObject } from "./game-object";
import { GAME_CONFIG, PLAYER_CONFIG } from "./types";

/**
 * Player character class
 * Handles player physics, jumping, and ground collision
 */
export class Player extends GameObject {
    private velocityY: number = 0;
    private isJumping: boolean = false;
    private groundY: number;

    constructor(groundHeight?: number) {
        const groundY = (groundHeight ?? 300) - PLAYER_CONFIG.HEIGHT;
        super(
            PLAYER_CONFIG.X_POSITION,
            groundY,
            PLAYER_CONFIG.WIDTH,
            PLAYER_CONFIG.HEIGHT
        );
        this.groundY = groundY;
    }

    /** Set ground level (for responsive canvas) */
    setGroundLevel(groundHeight: number): void {
        this.groundY = groundHeight - PLAYER_CONFIG.HEIGHT;
        if (!this.isJumping) {
            this.y = this.groundY;
        }
    }

    /** Process physics each frame */
    update(): void {
        // Apply gravity
        this.velocityY += GAME_CONFIG.GRAVITY;
        this.y += this.velocityY;

        // Ground collision
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;
            this.isJumping = false;
        }
    }

    /** Player is rendered via HTML/Image overlay, not canvas */
    render(): void {
        // Player sprite is rendered as an HTML element for GIF support
        // This method intentionally left empty
    }

    /** Initiate a jump if grounded */
    jump(): boolean {
        if (!this.isJumping && this.y >= this.groundY) {
            this.velocityY = PLAYER_CONFIG.JUMP_STRENGTH;
            this.isJumping = true;
            return true;
        }
        return false;
    }

    /** Check if player is currently jumping */
    getIsJumping(): boolean {
        return this.isJumping;
    }

    /** Reset player to initial state */
    reset(): void {
        this.y = this.groundY;
        this.velocityY = 0;
        this.isJumping = false;
        this.active = true;
    }
}
