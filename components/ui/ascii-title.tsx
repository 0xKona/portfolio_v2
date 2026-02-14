/**
 * AsciiTitle — Reusable ASCII art heading component for page titles.
 * Smaller than the hero text, suitable for section/page headings.
 */
import { generateAsciiText } from "@/lib/ascii/generate-ascii-text";

interface AsciiTitleProps {
    /** The text to render as ASCII art */
    text: string;
    /** Accessible heading level */
    level?: 1 | 2 | 3;
    /** Additional CSS classes */
    className?: string;
}

function Heading({ level, text }: { level: 1 | 2 | 3; text: string }) {
    const headingClass = "sr-only";
    switch (level) {
        case 1:
            return <h1 className={headingClass}>{text}</h1>;
        case 2:
            return <h2 className={headingClass}>{text}</h2>;
        case 3:
            return <h3 className={headingClass}>{text}</h3>;
        default:
            return <h1 className={headingClass}>{text}</h1>;
    }
}

export function AsciiTitle({
    text,
    level = 1,
    className = "",
}: AsciiTitleProps) {
    const lines = generateAsciiText(text);

    return (
        <div className={className}>
            {/* Accessible heading hidden behind the decorative ASCII art */}
            <Heading level={level} text={text} />

            {/* ASCII art title */}
            <pre
                className="text-neutral-300 text-[6px] leading-none select-none sm:text-xs md:text-sm lg:text-base mx-auto w-fit"
                aria-hidden="true"
            >
                {lines.join("\n")}
            </pre>
        </div>
    );
}
