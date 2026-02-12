"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface GameState {
  isPlaying: boolean;
  score: number;
  gameOver: boolean;
}

interface PlatformerGameProps {
  /** Callback when game ends with final score */
  onGameOver?: (score: number) => void;
}

export function PlatformerGame({ onGameOver }: PlatformerGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerImageRef = useRef<HTMLImageElement | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    gameOver: false,
  });

  // Game constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 300;
  const GROUND_HEIGHT = 250;
  const PLAYER_WIDTH = 40;
  const PLAYER_HEIGHT = 40;
  const OBSTACLE_WIDTH = 30;
  const OBSTACLE_HEIGHT = 50;
  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -12;
  const INITIAL_GAME_SPEED = 5;
  const SPEED_INCREMENT = 0.0005;

  // Load player sprite
  useEffect(() => {
    const img = new Image();
    img.src = "/hammering.gif";
    playerImageRef.current = img;
  }, []);

  // Game state refs (for animation loop)
  const gameStateRef = useRef({
    playerY: GROUND_HEIGHT - PLAYER_HEIGHT,
    playerVelocityY: 0,
    isJumping: false,
    obstacles: [] as { x: number; passed: boolean }[],
    gameSpeed: INITIAL_GAME_SPEED,
    frameCount: 0,
    score: 0,
  });

  /** Start or restart the game */
  const startGame = useCallback(() => {
    gameStateRef.current = {
      playerY: GROUND_HEIGHT - PLAYER_HEIGHT,
      playerVelocityY: 0,
      isJumping: false,
      obstacles: [],
      gameSpeed: INITIAL_GAME_SPEED,
      frameCount: 0,
      score: 0,
    };
    setGameState({ isPlaying: true, score: 0, gameOver: false });
  }, []);

  /** Handle jump input */
  const handleJump = useCallback(() => {
    const state = gameStateRef.current;
    if (!state.isJumping && state.playerY >= GROUND_HEIGHT - PLAYER_HEIGHT) {
      state.playerVelocityY = JUMP_STRENGTH;
      state.isJumping = true;
    }
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

  /** Main game loop */
  useEffect(() => {
    if (!gameState.isPlaying || gameState.gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const gameLoop = () => {
      const state = gameStateRef.current;
      state.frameCount++;

      // Clear canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw ground line
      ctx.strokeStyle = "#404040";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_HEIGHT);
      ctx.lineTo(CANVAS_WIDTH, GROUND_HEIGHT);
      ctx.stroke();

      // Update player physics
      state.playerVelocityY += GRAVITY;
      state.playerY += state.playerVelocityY;

      // Ground collision
      if (state.playerY >= GROUND_HEIGHT - PLAYER_HEIGHT) {
        state.playerY = GROUND_HEIGHT - PLAYER_HEIGHT;
        state.playerVelocityY = 0;
        state.isJumping = false;
      }

      // Draw player sprite or fallback rectangle
      if (playerImageRef.current?.complete) {
        ctx.drawImage(
          playerImageRef.current,
          50,
          state.playerY,
          PLAYER_WIDTH,
          PLAYER_HEIGHT,
        );
      } else {
        ctx.fillStyle = "#4ade80";
        ctx.fillRect(50, state.playerY, PLAYER_WIDTH, PLAYER_HEIGHT);
      }

      // Spawn obstacles
      if (state.frameCount % 100 === 0) {
        state.obstacles.push({ x: CANVAS_WIDTH, passed: false });
      }

      // Update and draw obstacles
      state.obstacles = state.obstacles.filter((obstacle) => {
        obstacle.x -= state.gameSpeed;

        // Check if player passed obstacle
        if (!obstacle.passed && obstacle.x + OBSTACLE_WIDTH < 50) {
          obstacle.passed = true;
          state.score += 10;
          setGameState((prev) => ({ ...prev, score: state.score }));
        }

        // Draw obstacle
        ctx.fillStyle = "#f87171";
        ctx.fillRect(
          obstacle.x,
          GROUND_HEIGHT - OBSTACLE_HEIGHT,
          OBSTACLE_WIDTH,
          OBSTACLE_HEIGHT,
        );

        // Collision detection
        const playerLeft = 50;
        const playerRight = 50 + PLAYER_WIDTH;
        const playerTop = state.playerY;
        const playerBottom = state.playerY + PLAYER_HEIGHT;

        const obstacleLeft = obstacle.x;
        const obstacleRight = obstacle.x + OBSTACLE_WIDTH;
        const obstacleTop = GROUND_HEIGHT - OBSTACLE_HEIGHT;
        const obstacleBottom = GROUND_HEIGHT;

        if (
          playerRight > obstacleLeft &&
          playerLeft < obstacleRight &&
          playerBottom > obstacleTop &&
          playerTop < obstacleBottom
        ) {
          // Game over
          setGameState((prev) => ({
            ...prev,
            gameOver: true,
            isPlaying: false,
          }));
          onGameOver?.(state.score);
          return false;
        }

        return obstacle.x > -OBSTACLE_WIDTH;
      });

      // Increase game speed over time
      state.gameSpeed += SPEED_INCREMENT;

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState.isPlaying, gameState.gameOver, onGameOver]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Score display */}
      <div className="font-mono text-green-400 text-lg">
        SCORE: {gameState.score.toString().padStart(6, "0")}
      </div>

      {/* Game canvas */}
      <div className="relative border border-neutral-700">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="bg-black cursor-pointer"
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

        {/* Overlay messages */}
        {!gameState.isPlaying && !gameState.gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center font-mono">
              <p className="text-neutral-400 text-sm mb-2">
                Press SPACE or click to start
              </p>
              <p className="text-neutral-600 text-xs">
                Jump over obstacles to score points
              </p>
            </div>
          </div>
        )}

        {gameState.gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center font-mono">
              <p className="text-red-400 text-lg mb-2">GAME OVER</p>
              <p className="text-neutral-400 text-sm mb-4">
                Final Score: {gameState.score}
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
