/**
 * BurgerMenu — ASCII-styled hamburger menu button for mobile navigation.
 * Transforms between hamburger and close (X) states.
 */

import { PixelBurger, PixelClose } from "../icons/pixel-icons";

interface BurgerMenuProps {
    isOpen: boolean;
    onClick: () => void;
}

export function BurgerMenu({ isOpen, onClick }: BurgerMenuProps) {
    return (
        <button
            onClick={onClick}
            className="
                flex flex-col items-center justify-center
                w-10 h-10 p-2
                text-neutral-300 hover:text-cyan-400
                transition-colors duration-150
                cursor-pointer
                md:hidden
            "
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
        >
            {isOpen ? (
                /* Close icon: pixel X */
                <PixelClose className="text-neutral-500" />
            ) : (
                /* Menu icon: three horizontal bars */
                // <span className="text-m select-none">≡</span>
                <PixelBurger className="text-neutral-500" />
            )}
        </button>
    );
}
