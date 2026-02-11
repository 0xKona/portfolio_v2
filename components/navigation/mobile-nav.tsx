/**
 * MobileNav — Dropdown navigation menu for mobile devices.
 * Renders as a terminal-style panel below the header.
 */
"use client";

import { TerminalLink } from "@/components/ui/terminal-link";
import { NavigationLink } from "@/types/navigation";

interface MobileNavProps {
    links: NavigationLink[];
    isOpen: boolean;
    currentPath: string;
    onLinkClick: () => void;
}

export function MobileNav({
    links,
    isOpen,
    currentPath,
    onLinkClick,
}: MobileNavProps) {
    if (!isOpen) return null;

    return (
        <nav
            className="
                absolute top-full left-0 right-0
                bg-black border-b border-neutral-700
                md:hidden
                z-50
            "
            aria-label="Mobile navigation"
        >
            {/* Terminal-style header */}
            <div className="px-4 py-2 border-b border-neutral-800">
                <span className="text-neutral-500 text-xs">
                    --- NAVIGATION ---
                </span>
            </div>

            {/* Navigation links */}
            <ul className="flex flex-col py-2">
                {links.map((link) => (
                    <li key={link.name}>
                        <TerminalLink
                            href={link.route}
                            isActive={currentPath === link.route}
                            onClick={onLinkClick}
                            className="w-full px-4 py-2"
                        >
                            {link.displayText}
                        </TerminalLink>
                    </li>
                ))}
            </ul>

            {/* Terminal-style footer */}
            <div className="px-4 py-2 border-t border-neutral-800">
                <span className="text-neutral-500 text-xs">
                    Press ESC to close
                </span>
            </div>
        </nav>
    );
}
