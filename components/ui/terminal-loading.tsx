/**
 * TerminalLoading — Reusable loading indicator with the chibi running animation.
 * Displays a terminal-style loading message with configurable text.
 */

import Image from "next/image";

interface TerminalLoadingProps {
    /** The loading message to display after the prompt */
    message?: string;
    /** Additional CSS classes */
    className?: string;
}

export function TerminalLoading({
    message = "loading...",
    className = "",
}: TerminalLoadingProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center py-12 ${className}`}
        >
            <div className="relative w-24 h-24 mb-4">
                <Image
                    src="/running.gif"
                    alt="Loading"
                    fill
                    className="object-contain"
                    unoptimized
                />
            </div>
            <div className="text-neutral-500 text-sm font-mono">
                <span className="text-neutral-600">$</span> {message}
            </div>
        </div>
    );
}
