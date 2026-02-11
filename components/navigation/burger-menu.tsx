/**
 * BurgerMenu — ASCII-styled hamburger menu button for mobile navigation.
 * Transforms between hamburger and close (X) states.
 */

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
                /* Close icon: bracket-enclosed X */
                <span className="text-sm font-bold select-none">[X]</span>
            ) : (
                /* Menu icon: three horizontal bars */
                <span className="text-m select-none">≡</span>
            )}
        </button>
    );
}
