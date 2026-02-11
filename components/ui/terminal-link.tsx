/**
 * TerminalLink — A reusable link component styled to match the terminal aesthetic.
 * Features hover effects with cyan highlight and optional prefix characters.
 */
import Link from "next/link";

interface TerminalLinkProps {
    href: string;
    children: React.ReactNode;
    /** Optional prefix character (e.g., ">", "$", "~") */
    prefix?: string;
    /** Whether this link is currently active */
    isActive?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Click handler for closing menus etc */
    onClick?: () => void;
}

export function TerminalLink({
    href,
    children,
    prefix = ">",
    isActive = false,
    className = "",
    onClick,
}: TerminalLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`
                group flex items-center gap-2 px-2 py-1
                transition-colors duration-150
                ${isActive ? "text-green-400" : "text-neutral-300 hover:text-cyan-400"}
                ${className}
            `}
        >
            <span
                className={`
                    transition-colors duration-150
                    ${isActive ? "text-green-400" : "text-neutral-500 group-hover:text-cyan-400"}
                `}
            >
                {prefix}
            </span>
            <span>{children}</span>
        </Link>
    );
}
