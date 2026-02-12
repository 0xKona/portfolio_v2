"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { GameEngine, GAME_CONFIG, PLAYER_CONFIG, GameState } from "./engine";

interface PlatformerGameProps {
    /** Callback when game ends with final score */
    onGameOver?: (score: number) => void;
    /** Enable coin collection feature */
    enableCoins?: boolean;
}

export function PlatformerGame({
    onGameOver,
    enableCoins = true,
}: PlatformerGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<GameEngine | null>(null);

    const [gameState, setGameState] = useState<GameState>({
        isPlaying: false,
        score: 0,
        coins: 0,
        finalScore: 0,
        gameOver: false,
        playerY: GAME_CONFIG.GROUND_HEIGHT - PLAYER_CONFIG.HEIGHT,
    });

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

    /** Initialize canvas when available */
    useEffect(() => {
        if (canvasRef.current && engineRef.current) {
            engineRef.current.init(canvasRef.current);
        }
    }, []);

    /** Start or restart the game */
    const startGame = useCallback(() => {
        setGameState({
            isPlaying: true,
            score: 0,
            coins: 0,
            finalScore: 0,
            gameOver: false,
            playerY: GAME_CONFIG.GROUND_HEIGHT - PLAYER_CONFIG.HEIGHT,
        });
        engineRef.current?.start();
    }, []);

    /** Handle jump input */
    const handleJump = useCallback(() => {
        engineRef.current?.jump();
    }, []);

    /** Handle keyboard input */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" || e.code === "ArrowUp") {
                e.preventDefault();
                if (gameState.gameOver) {
                    startGame();
                } else if (gameState.isPlaying) {
                    handleJump();
                } else {
                    startGame();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameState.isPlaying, gameState.gameOver, startGame, handleJump]);

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            {/* Score and coins display */}
            <div className="flex gap-8 font-mono text-lg">
                <div className="text-neutral-300">
                    SCORE: {gameState.score.toString().padStart(6, "0")}
                </div>
                <div className="text-green-400">
                    COINS: {gameState.coins.toString().padStart(3, "0")}{" "}
                    <span className="text-neutral-500">
                        ({(1 + gameState.coins * 0.1).toFixed(1)}x)
                    </span>
                </div>
            </div>

            {/* Game canvas */}
            <div
                className="relative border border-neutral-700"
                style={{
                    width: GAME_CONFIG.CANVAS_WIDTH,
                    height: GAME_CONFIG.CANVAS_HEIGHT,
                }}
            >
                <canvas
                    ref={canvasRef}
                    width={GAME_CONFIG.CANVAS_WIDTH}
                    height={GAME_CONFIG.CANVAS_HEIGHT}
                    className="bg-black cursor-pointer absolute top-0 left-0"
                    onClick={() => {
                        if (gameState.gameOver) {
                            startGame();
                        } else if (!gameState.isPlaying) {
                            startGame();
                        } else {
                            handleJump();
                        }
                    }}
                />

                {/* Player running GIF */}
                {gameState.isPlaying && (
                    <Image
                        src="/running.gif"
                        alt="Player"
                        width={PLAYER_CONFIG.WIDTH}
                        height={PLAYER_CONFIG.HEIGHT}
                        className="absolute top-0 left-0 pointer-events-none mix-blend-mode: lighten"
                        style={{
                            left: `${PLAYER_CONFIG.X_POSITION}px`,
                            top: `${gameState.playerY}px`,
                        }}
                        unoptimized
                    />
                )}

                {/* Overlay messages */}
                {!gameState.isPlaying && !gameState.gameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                        <div className="text-center font-mono">
                            <p className="text-neutral-400 text-sm mb-2">
                                Press SPACE or click to start
                            </p>
                            <p className="text-neutral-600 text-xs">
                                Jump over obstacles and collect coins!
                            </p>
                        </div>
                    </div>
                )}

                {gameState.gameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                        <div className="text-center font-mono">
                            <p className="text-red-400 text-lg mb-2">
                                GAME OVER
                            </p>
                            <div className="text-neutral-500 text-xs mb-2 space-y-1">
                                <p>Base Score: {gameState.score}</p>
                                <p>
                                    Coins: {gameState.coins}{" "}
                                    <span className="text-green-400">
                                        (
                                        {(1 + gameState.coins * 0.1).toFixed(1)}
                                        x multiplier)
                                    </span>
                                </p>
                            </div>
                            <p className="text-green-400 text-lg mb-4">
                                Final Score: {gameState.finalScore}
                            </p>
                            <p className="text-neutral-600 text-xs">
                                Press SPACE or click to restart
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls hint */}
            <div className="font-mono text-neutral-600 text-xs text-center">
                <p>SPACE / ↑ / CLICK to jump</p>
            </div>
        </div>
    );
}
