import { Bounds } from "./types";

/**
 * Base class for all game objects
 * Provides common functionality for positioning, rendering, and collision
 */
export abstract class GameObject {
    protected x: number;
    protected y: number;
    protected width: number;
    protected height: number;
    protected active: boolean = true;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /** Update object state each frame */
    abstract update(gameSpeed: number): void;

    /** Render object to canvas */
    abstract render(ctx: CanvasRenderingContext2D): void;

    /** Get bounding box for collision detection */
    getBounds(): Bounds {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };
    }

    /** Check if this object collides with another */
    collidesWith(other: GameObject): boolean {
        const a = this.getBounds();
        const b = other.getBounds();

        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    /** Check if object is still active/alive */
    isActive(): boolean {
        return this.active;
    }

    /** Mark object for removal */
    destroy(): void {
        this.active = false;
    }

    /** Get current X position */
    getX(): number {
        return this.x;
    }

    /** Get current Y position */
    getY(): number {
        return this.y;
    }

    /** Set position */
    setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
}
