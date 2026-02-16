import { GameState } from "./engine";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useCallback, useEffect, useState } from "react";

interface GameOverProps {
    gameState: GameState;
    resetToMenu: () => void;
}

type GameScore = Schema["GameScore"]["type"];

export default function GameOver({ gameState, resetToMenu }: GameOverProps) {
    const client = generateClient<Schema>();

    const [topScores, setTopScores] = useState<GameScore[]>([]);
    const [isLoadingScores, setIsLoadingScores] = useState(true);
    const [playerName, setPlayerName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    /** Format relative time (e.g., "2d ago", "3h ago") */
    const formatRelativeTime = (dateString: string): string => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    /** Fetch top 5 scores from database */
    const fetchTopScores = useCallback(async () => {
        /* This is inefficinet but fine for this site, if for some reason
        10's of 1000's of players start playing, move to full graphql with indexing */
        setIsLoadingScores(true);
        try {
            const response = await client.models.GameScore.list({
                filter: { game: { eq: "platformer" } },
            });
            const sorted = response.data
                .sort((a, b) => parseInt(b.finalScore) - parseInt(a.finalScore))
                .slice(0, 5);
            setTopScores(sorted);
        } catch (error) {
            console.error("Failed to fetch top scores:", error);
        } finally {
            setIsLoadingScores(false);
        }
    }, [client]);

    // Fetch top scores on load
    useEffect(() => {
        fetchTopScores();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** Submit score to database */
    const submitScore = useCallback(async () => {
        if (!playerName.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await client.models.GameScore.create({
                playerName: playerName.trim(),
                score: gameState.score.toString(),
                multiplier: (1 + gameState.coins * 0.1).toFixed(1),
                finalScore: gameState.finalScore.toString(),
                game: "platformer",
                createdAt: new Date().toISOString(),
            });
            setPlayerName("");
            setHasSubmitted(true);
            await fetchTopScores();
        } catch (error) {
            console.error("Failed to submit score:", error);
        } finally {
            setIsSubmitting(false);
        }
    }, [
        playerName,
        gameState.score,
        gameState.coins,
        gameState.finalScore,
        isSubmitting,
        client,
        fetchTopScores,
    ]);

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 font-mono overflow-hidden">
            {/* Game Over Title */}
            <p className="text-red-400 text-xl md:text-2xl mb-3 md:mb-4">
                GAME OVER
            </p>

            {/* Score Summary */}
            <div className="text-center mb-2 md:mb-3">
                <p className="text-green-400 text-lg md:text-xl leading-tight">
                    Total Score: {gameState.finalScore}
                </p>
            </div>

            {/* Scoreboard */}
            <div className="w-full max-w-70 md:max-w-xs mb-3 md:mb-4 px-2">
                <p className="text-cyan-400 text-xs mb-1 text-center">
                    TOP SCORES
                </p>
                <div className="bg-black border border-neutral-700 p-1.5 md:p-2 max-h-24 md:max-h-32 overflow-y-auto">
                    {isLoadingScores ? (
                        // Skeleton loading
                        Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={`skeleton-${index}`}
                                className="flex justify-between items-center text-[10px] md:text-xs gap-2 mb-1"
                            >
                                <span className="text-neutral-700 w-4">
                                    {index + 1}.
                                </span>
                                <span className="flex-1 h-3 bg-neutral-800 rounded animate-pulse" />
                                <span className="w-12 h-3 bg-neutral-800 rounded animate-pulse" />
                                <span className="w-10 h-3 bg-neutral-800 rounded animate-pulse" />
                            </div>
                        ))
                    ) : topScores.length > 0 ? (
                        topScores.map((score, index) => (
                            <div
                                key={score.id}
                                className="flex justify-between items-center text-[10px] md:text-xs text-neutral-300 leading-tight mb-1 gap-2"
                            >
                                <span className="text-neutral-500 w-4">
                                    {index + 1}.
                                </span>
                                <span className="flex-1 truncate">
                                    {score.playerName}
                                </span>
                                <span className="text-green-400 text-right whitespace-nowrap">
                                    {score.finalScore}
                                </span>
                                <span className="text-neutral-600 text-[8px] text-right whitespace-nowrap w-10">
                                    {score.createdAt
                                        ? formatRelativeTime(score.createdAt)
                                        : "—"}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-neutral-500 text-[10px] md:text-xs text-center py-2">
                            No scores yet
                        </p>
                    )}
                </div>
            </div>

            {/* Submit Score Form */}
            <div className="w-full max-w-70 md:max-w-xs px-2 mb-3">
                {hasSubmitted ? (
                    <p className="text-green-400 text-xs text-center py-3 border border-neutral-700 bg-black">
                        SCORE SUBMITTED
                    </p>
                ) : (
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter name (optional)"
                        className="w-full bg-black border border-neutral-700 text-neutral-300 px-2 py-1.5 text-xs"
                        maxLength={15}
                        onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === "Enter" && playerName.trim()) {
                                submitScore();
                            }
                        }}
                    />
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full max-w-70 md:max-w-xs px-2">
                <button
                    onClick={submitScore}
                    disabled={
                        isSubmitting || !playerName.trim() || hasSubmitted
                    }
                    className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-neutral-700 disabled:text-neutral-500 text-black px-2 py-1.5 text-xs"
                >
                    {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                </button>
                <button
                    onClick={resetToMenu}
                    className="flex-1 border border-neutral-600 hover:border-neutral-400 text-neutral-400 hover:text-neutral-300 px-2 py-1.5 text-xs"
                >
                    RESET
                </button>
            </div>
        </div>
    );
}
