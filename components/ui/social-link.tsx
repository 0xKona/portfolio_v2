import Link from "next/link";
import { PixelIconComponent } from "@/types/socials";

interface SocialLinkProps {
    displayText: string;
    url: string;
    icon: PixelIconComponent;
    className?: string;
}

export function SocialLink({
    displayText,
    url,
    icon: Icon,
    className = "",
}: SocialLinkProps) {
    return (
        <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
                group inline-flex items-center justify-center
                w-8 h-8
                text-neutral-500 hover:text-cyan-400
                transition-colors duration-150
                ${className}
            `}
            aria-label={displayText}
            title={displayText}
        >
            <Icon size={24} />
        </Link>
    );
}
