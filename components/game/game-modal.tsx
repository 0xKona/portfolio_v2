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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 md:bg-black/90"
            onClick={onClose}
        >
            {/* Modal content - fullscreen on mobile, contained on desktop */}
            <div
                className="relative bg-black w-full h-full md:h-auto md:max-w-4xl md:border md:border-green-400 md:mx-4 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Terminal-style header */}
                <div className="flex items-center justify-between p-3 md:p-4 md:pb-2 border-b border-neutral-700 shrink-0">
                    <div className="font-mono text-green-400 text-xs md:text-sm">
                        <span className="text-neutral-500">$</span>{" "}
                        ./platformer.exe
                    </div>
                    <button
                        onClick={onClose}
                        className="font-mono text-neutral-500 hover:text-red-400 transition-colors text-sm md:text-base p-1"
                        aria-label="Close game"
                    >
                        [X]
                    </button>
                </div>

                {/* Game component - flex-grow to fill available space */}
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                    <PlatformerGame
                        onGameOver={(score) =>
                            console.log("Game over! Score:", score)
                        }
                    />
                </div>

                {/* Footer hint */}
                <div className="p-2 md:p-3 border-t border-neutral-700 text-center shrink-0">
                    <p className="font-mono text-neutral-600 text-[10px] md:text-xs">
                        <span className="hidden md:inline">
                            Press ESC or click outside to close
                        </span>
                        <span className="md:hidden">Tap [X] to close</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
