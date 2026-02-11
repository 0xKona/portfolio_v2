/**
 * MainNavigationBar — Primary site navigation with responsive layout.
 * Desktop: horizontal nav links with terminal-style prompt.
 * Mobile: burger menu with dropdown navigation panel.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants/navigation-links";
import { TerminalLink } from "@/components/ui/terminal-link";
import { BurgerMenu } from "@/components/navigation/burger-menu";
import { MobileNav } from "@/components/navigation/mobile-nav";

export default function MainNavigationBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    /** Handle ESC key to close mobile menu */
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setIsMobileMenuOpen(false);
        }
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.addEventListener("keydown", handleKeyDown);
            return () => document.removeEventListener("keydown", handleKeyDown);
        }
    }, [isMobileMenuOpen, handleKeyDown]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="z-50 bg-black border-b border-neutral-700">
            <div className="relative flex items-center justify-between h-12 px-4 max-w-7xl mx-auto">
                {/* Terminal-style prompt / logo */}
                <div className="flex items-center gap-2">
                    <span className="text-green-400">
                        guest@connors-portfolio
                    </span>
                    <span className="text-neutral-500">:</span>
                    <span className="text-cyan-400">~</span>
                    <span className="text-neutral-500">$</span>
                </div>

                {/* Desktop navigation */}
                <nav
                    className="hidden md:flex items-center gap-1"
                    aria-label="Main navigation"
                >
                    {NAV_LINKS.map((link) => (
                        <TerminalLink
                            key={link.name}
                            href={link.route}
                            isActive={pathname === link.route}
                        >
                            {link.displayText}
                        </TerminalLink>
                    ))}
                </nav>

                {/* Mobile burger menu button */}
                <BurgerMenu
                    isOpen={isMobileMenuOpen}
                    onClick={toggleMobileMenu}
                />

                {/* Mobile dropdown navigation */}
                <MobileNav
                    links={NAV_LINKS}
                    isOpen={isMobileMenuOpen}
                    currentPath={pathname}
                    onLinkClick={closeMobileMenu}
                />
            </div>
        </header>
    );
}
