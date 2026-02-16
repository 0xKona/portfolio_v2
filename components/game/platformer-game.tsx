"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
    GameEngine,
    GAME_CONFIG,
    PLAYER_CONFIG,
    UI_CONFIG,
    GameState,
} from "./engine";
import GameOver from "./game-over";

interface PlatformerGameProps {
    /** Callback when game ends with final score */
    onGameOver?: (score: number) => void;
    /** Enable coin collection feature */
    enableCoins?: boolean;
}

/** Calculate responsive canvas dimensions */
function calculateCanvasDimensions(
    containerWidth: number,
    containerHeight: number,
) {
    const availableHeight = containerHeight - UI_CONFIG.UI_ELEMENTS_HEIGHT;
    const availableWidth = containerWidth - 16; // Padding

    // Calculate aspect ratio based on available space
    const aspectRatio = Math.max(
        GAME_CONFIG.MIN_ASPECT_RATIO,
        Math.min(
            GAME_CONFIG.MAX_ASPECT_RATIO,
            availableWidth / availableHeight,
        ),
    );

    let width: number;
    let height: number;

    if (availableWidth / availableHeight > aspectRatio) {
        // Height constrained
        height = Math.max(GAME_CONFIG.MIN_HEIGHT, availableHeight);
        width = Math.floor(height * aspectRatio);
    } else {
        // Width constrained
        width = Math.max(GAME_CONFIG.MIN_WIDTH, availableWidth);
        height = Math.floor(width / aspectRatio);
    }

    const groundHeight = Math.floor(height * GAME_CONFIG.GROUND_RATIO);

    return { width, height, groundHeight };
}

export function PlatformerGame({
    onGameOver,
    enableCoins = true,
}: PlatformerGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<GameEngine | null>(null);

    // Canvas dimensions (calculated from container)
    const [canvasDims, setCanvasDims] = useState({
        width: 400,
        height: 300,
        groundHeight: 255,
    });

    const [gameState, setGameState] = useState<GameState>({
        isPlaying: false,
        score: 0,
        coins: 0,
        finalScore: 0,
        gameOver: false,
        playerY: canvasDims.groundHeight - PLAYER_CONFIG.HEIGHT,
    });

    /** Calculate canvas dimensions based on container */
    useEffect(() => {
        const updateDimensions = () => {
            if (!containerRef.current) return;
            const container = containerRef.current;
            const dims = calculateCanvasDimensions(
                container.clientWidth,
                container.clientHeight,
            );
            setCanvasDims(dims);
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    /** Initialize game engine */
    useEffect(() => {
        engineRef.current = new GameEngine();

        // Configure features
        engineRef.current.setFeature("coins", enableCoins);

        // Set up event handling
        engineRef.current.onEvent((event) => {
            switch (event.type) {
                case "score":
                    setGameState((prev) => ({ ...prev, score: event.payload }));
                    break;
                case "coins":
                    setGameState((prev) => ({ ...prev, coins: event.payload }));
                    break;
                case "gameOver":
                    setGameState((prev) => ({
                        ...prev,
                        gameOver: true,
                        isPlaying: false,
                        finalScore: event.payload,
                    }));
                    onGameOver?.(event.payload);
                    break;
                case "playerMove":
                    setGameState((prev) => ({
                        ...prev,
                        playerY: event.payload,
                    }));
                    break;
            }
        });

        return () => {
            engineRef.current?.destroy();
            engineRef.current = null;
        };
    }, [enableCoins, onGameOver]);

    /** Initialize/reinitialize canvas when dimensions change */
    useEffect(() => {
        if (canvasRef.current && engineRef.current) {
            engineRef.current.init(canvasRef.current);
        }
    }, [canvasDims]);

    /** Start or restart the game */
    const startGame = useCallback(() => {
        setGameState({
            isPlaying: true,
            score: 0,
            coins: 0,
            finalScore: 0,
            gameOver: false,
            playerY: canvasDims.groundHeight - PLAYER_CONFIG.HEIGHT,
        });
        engineRef.current?.start();
    }, [canvasDims.groundHeight]);

    /** Reset to menu state without starting game */
    const resetToMenu = useCallback(() => {
        engineRef.current?.stop();
        setGameState({
            isPlaying: false,
            score: 0,
            coins: 0,
            finalScore: 0,
            gameOver: false,
            playerY: canvasDims.groundHeight - PLAYER_CONFIG.HEIGHT,
        });
    }, [canvasDims.groundHeight]);

    /** Handle jump input */
    const handleJump = useCallback(() => {
        engineRef.current?.jump();
    }, []);

    /** Handle game interaction (start or jump) */
    const handleInteraction = useCallback(() => {
        if (gameState.gameOver) {
            // Don't auto-start on game over, let buttons handle it
            return;
        } else if (!gameState.isPlaying) {
            startGame();
        } else {
            handleJump();
        }
    }, [gameState.gameOver, gameState.isPlaying, startGame, handleJump]);

    /** Handle keyboard input */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" || e.code === "ArrowUp") {
                e.preventDefault();
                if (gameState.isPlaying) {
                    handleJump();
                } else if (!gameState.isPlaying && !gameState.gameOver) {
                    startGame();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameState.isPlaying, gameState.gameOver, startGame, handleJump]);

    return (
        <div
            ref={containerRef}
            className="flex flex-col items-center justify-center gap-2 md:gap-4 p-2 md:p-4 w-full h-full"
        >
            {/* Score and coins display */}
            <div className="flex gap-4 md:gap-8 font-mono text-sm md:text-lg">
                <div className="text-neutral-300">
                    <span className="hidden sm:inline">SCORE: </span>
                    <span className="sm:hidden">S:</span>
                    {gameState.score.toString().padStart(6, "0")}
                </div>
                <div className="text-green-400">
                    <span className="hidden sm:inline">COINS: </span>
                    <span className="sm:hidden">C:</span>
                    {gameState.coins.toString().padStart(3, "0")}{" "}
                    <span className="text-neutral-500 text-xs md:text-base">
                        ({(1 + gameState.coins * 0.1).toFixed(1)}x)
                    </span>
                </div>
            </div>

            {/* Game canvas container */}
            <div
                className="relative border border-neutral-700 overflow-hidden touch-none"
                style={{
                    width: canvasDims.width,
                    height: canvasDims.height,
                }}
                onClick={handleInteraction}
                onTouchStart={(e) => {
                    e.preventDefault();
                    handleInteraction();
                }}
            >
                <canvas
                    ref={canvasRef}
                    width={canvasDims.width}
                    height={canvasDims.height}
                    className="bg-black cursor-pointer absolute top-0 left-0"
                />

                {/* Player running GIF */}
                {gameState.isPlaying && (
                    <Image
                        src="/running.gif"
                        alt="Player"
                        width={PLAYER_CONFIG.WIDTH}
                        height={PLAYER_CONFIG.HEIGHT}
                        className="absolute pointer-events-none"
                        style={{
                            left: `${PLAYER_CONFIG.X_POSITION}px`,
                            top: `${gameState.playerY}px`,
                            mixBlendMode: "lighten",
                        }}
                        unoptimized
                    />
                )}

                {/* Start menu overlay - only show in initial state */}
                {!gameState.isPlaying &&
                    !gameState.gameOver &&
                    gameState.score === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                            <div className="text-center font-mono">
                                <p className="text-neutral-400 text-sm mb-2">
                                    <span className="hidden md:inline">
                                        Press SPACE or{" "}
                                    </span>
                                    <span className="md:hidden">Tap to </span>
                                    <span className="hidden md:inline">
                                        click to{" "}
                                    </span>
                                    start
                                </p>
                                <p className="text-neutral-600 text-xs px-4">
                                    Jump over obstacles and collect coins!
                                </p>
                            </div>
                        </div>
                    )}

                {/* Game over overlay */}
                {gameState.gameOver && (
                    <GameOver gameState={gameState} resetToMenu={resetToMenu} />
                )}
            </div>

            {/* Controls hint */}
            <div className="font-mono text-neutral-600 text-xs text-center">
                <p className="hidden md:block">SPACE / ↑ / CLICK to jump</p>
                <p className="md:hidden">TAP to jump</p>
            </div>
        </div>
    );
}
