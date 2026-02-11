/**
 * UnderConstruction — Display component for pages/sections not yet completed.
 * Shows a chibi character hammering with a customizable message.
 */
import Image from "next/image";

interface UnderConstructionProps {
    /** Message to display below the animation */
    message?: string;
    /** Progress percentage (0-100) for the loading bar */
    progress?: number;
}

export function UnderConstruction({
    message = "This section is under construction",
    progress = 0,
}: UnderConstructionProps) {
    // Clamp progress between 0 and 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    // Calculate how many blocks should be filled (out of 10)
    const totalBlocks = 10;
    const filledBlocks = Math.round((clampedProgress / 100) * totalBlocks);

    // Generate progress bar string
    const progressBar =
        "█".repeat(filledBlocks) + "░".repeat(totalBlocks - filledBlocks);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
            {/* Terminal-style header */}
            <div className="text-neutral-600 text-sm mb-6">
                <span className="text-neutral-500">$</span> building...
            </div>

            {/* Chibi character animation */}
            <div className="relative w-32 h-32 mb-6">
                <Image
                    src="/hammering.gif"
                    alt="Construction in progress"
                    fill
                    className="object-contain"
                    unoptimized
                />
            </div>

            {/* Message */}
            <div className="text-center">
                <p className="text-neutral-400 font-mono text-sm mb-2">
                    {message}
                </p>
                <div className="text-neutral-600 text-xs">
                    [{progressBar}] {clampedProgress}%
                </div>
            </div>
        </div>
    );
}
