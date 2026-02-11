import "@hackernoon/pixel-icon-library/fonts/iconfont.css";

interface PixelIconProps {
    size?: number;
    className?: string;
}

export function PixelGitHub({ size = 24, className = "" }: PixelIconProps) {
    return (
        <i
            className={`hn hn-github ${className}`}
            style={{ fontSize: `${size}px` }}
        />
    );
}

export function PixelLinkedIn({ size = 24, className = "" }: PixelIconProps) {
    return (
        <i
            className={`hn hn-linkedin ${className}`}
            style={{ fontSize: `${size}px` }}
        />
    );
}

export function PixelEnvelope({ size = 24, className = "" }: PixelIconProps) {
    return (
        <i
            className={`hn hn-envelope ${className}`}
            style={{ fontSize: `${size}px` }}
        />
    );
}
