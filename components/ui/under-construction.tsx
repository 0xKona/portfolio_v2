/**
 * UnderConstruction — Display component for pages/sections not yet completed.
 * Shows a chibi character hammering with a customizable message.
 */
import Image from "next/image";

interface UnderConstructionProps {
    /** Message to display below the animation */
    message?: string;
}

export function UnderConstruction({
    message = "This section is under construction",
}: UnderConstructionProps) {
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
                <div className="text-neutral-600 text-xs">[░░░░░░░░░░] 0%</div>
            </div>
        </div>
    );
}
