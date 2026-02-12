import { PixelGitHub, PixelLinkedIn } from "@/components/icons/pixel-icons";
import { SocialLink } from "@/types/socials";

interface SocialLinkObject {
    [key: string]: SocialLink;
}

/**
 * Social media links displayed in the header.
 * Icons use @hackernoon/pixel-icon-library for authentic 8-bit pixel art.
 * 
 * TODO: Move from hardcoded links to fetching from a config
 */
export const SOCIAL_LINKS: SocialLinkObject = {
    github: {
        name: "github",
        displayText: "GitHub",
        url: "https://github.com/0xKona",
        icon: PixelGitHub,
    },
    linkedIn: {
        name: "linkedin",
        displayText: "LinkedIn",
        url: "https://www.linkedin.com/in/konarobinson/",
        icon: PixelLinkedIn,
    },
};