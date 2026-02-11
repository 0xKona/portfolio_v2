import { PixelGitHub, PixelLinkedIn } from "@/components/icons/pixel-icons";
import { SocialLink } from "@/types/socials";

/**
 * Social media links displayed in the header.
 * Icons use @hackernoon/pixel-icon-library for authentic 8-bit pixel art.
 * 
 * TODO: Move from hardcoded links to fetching from a config
 */
export const SOCIAL_LINKS: SocialLink[] = [
    {
        name: "github",
        displayText: "GitHub",
        url: "https://github.com/0xKona",
        icon: PixelGitHub,
    },
    {
        name: "linkedin",
        displayText: "LinkedIn",
        url: "https://www.linkedin.com/in/konarobinson/",
        icon: PixelLinkedIn,
    },
];