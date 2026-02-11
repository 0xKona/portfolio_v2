/**
 * WorriedCharacter — Displays the worried chibi character animation.
 * Used on error and 404 pages to visually indicate something went wrong.
 */

import Image from "next/image";

interface WorriedCharacterProps {
    /** Alt text for accessibility */
    altText?: string;
}

export function WorriedCharacter({
    altText = "Error occurred",
}: WorriedCharacterProps) {
    return (
        <div className="relative w-32 h-32 mb-6">
            <Image
                src="/initial_worried.gif"
                alt={altText}
                fill
                className="object-contain"
                unoptimized
            />
        </div>
    );
}
