"use client";

import { useEffect } from "react";
import { PlatformerGame } from "./platformer-game";

interface GameModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function GameModal({ isOpen, onClose }: GameModalProps) {
    /** Handle ESC key to close modal */
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    /** Prevent body scroll when modal is open */
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={onClose}
        >
            {/* Modal content */}
            <div
                className="relative border border-green-400 bg-black p-6 max-w-4xl w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Terminal-style header */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-700">
                    <div className="font-mono text-green-400 text-sm">
                        <span className="text-neutral-500">$</span>{" "}
                        ./platformer.exe
                    </div>
                    <button
                        onClick={onClose}
                        className="font-mono text-neutral-500 hover:text-red-400 transition-colors text-sm"
                        aria-label="Close game"
                    >
                        [X]
                    </button>
                </div>

                {/* Game component */}
                <PlatformerGame
                    onGameOver={(score) =>
                        console.log("Game over! Score:", score)
                    }
                />

                {/* Footer hint */}
                <div className="mt-4 pt-2 border-t border-neutral-700 text-center">
                    <p className="font-mono text-neutral-600 text-xs">
                        Press ESC or click outside to close
                    </p>
                </div>
            </div>
        </div>
    );
}
