/**
 * Social link type definition
 */
import { ComponentType } from "react";

export interface PixelIconProps {
    size?: number;
    className?: string;
}

export type PixelIconComponent = ComponentType<PixelIconProps>;

export interface SocialLink {
    /** Unique identifier */
    name: string;
    /** Display text for the link */
    displayText: string;
    /** Full URL to social profile */
    url: string;
    /** Pixel icon component from @hackernoon/pixel-icon-library */
    icon: PixelIconComponent;
}