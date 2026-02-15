import { GameState } from "./engine";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useCallback, useEffect, useState } from "react";

interface GameOverProps {
    gameState: GameState;
    startGame: () => void;
}

type GameScore = Schema["GameScore"]["type"];

export default function GameOver({ gameState, startGame }: GameOverProps) {
    const client = generateClient<Schema>();

    const [topScores, setTopScores] = useState<GameScore[]>([]);
    const [playerName, setPlayerName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    /** Fetch top 10 scores from database */
    const fetchTopScores = useCallback(async () => {
        try {
            const response = await client.models.GameScore.list({
                filter: { game: { eq: "platformer" } },
                limit: 10,
            });
            console.log("Scores Response: ", response.data);
            // Sort by finalScore descending (since stored as string, need to parse)
            const sorted = response.data.sort(
                (a, b) => parseInt(b.finalScore) - parseInt(a.finalScore),
            );
            setTopScores(sorted);
        } catch (error) {
            console.error("Failed to fetch top scores:", error);
        }
    }, [client]);

    // Fetch top scores on load
    useEffect(() => {
        fetchTopScores();
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
            await fetchTopScores(); // Refresh scoreboard
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 p-4">
            <div className="text-center font-mono max-w-md w-full">
                <p className="text-red-400 text-lg mb-2">GAME OVER</p>
                <div className="text-neutral-500 text-xs mb-2 space-y-1">
                    <p>Base Score: {gameState.score}</p>
                    <p>
                        Coins: {gameState.coins}{" "}
                        <span className="text-green-400">
                            ({(1 + gameState.coins * 0.1).toFixed(1)}x
                            multiplier)
                        </span>
                    </p>
                </div>
                <p className="text-green-400 text-lg mb-4">
                    Final Score: {gameState.finalScore}
                </p>

                {/* Scoreboard */}
                <div className="mb-4">
                    <p className="text-cyan-400 text-sm mb-2">TOP SCORES</p>
                    <div className="bg-black/50 border border-neutral-700 rounded p-2 max-h-32 overflow-y-auto">
                        {topScores.length > 0 ? (
                            topScores.map((score, index) => (
                                <div
                                    key={score.id}
                                    className="flex justify-between text-xs text-neutral-300 mb-1"
                                >
                                    <span>
                                        {index + 1}. {score.playerName}
                                    </span>
                                    <span className="text-green-400">
                                        {score.finalScore}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-neutral-500 text-xs">
                                No scores yet
                            </p>
                        )}
                    </div>
                </div>

                {/* Submit score form */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full bg-black border border-neutral-700 text-neutral-300 px-2 py-1 text-xs font-mono mb-2"
                        maxLength={20}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                submitScore();
                            }
                        }}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={submitScore}
                            disabled={isSubmitting || !playerName.trim()}
                            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-neutral-600 text-black px-2 py-1 text-xs font-mono"
                        >
                            {isSubmitting ? "SUBMITTING..." : "SUBMIT SCORE"}
                        </button>
                        <button
                            onClick={startGame}
                            disabled={isSubmitting}
                            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-neutral-600 text-black px-2 py-1 text-xs font-mono"
                        >
                            START NEW GAME
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
