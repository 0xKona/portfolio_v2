import { generateAsciiText } from "../../lib/ascii/ascii-text";

interface AsciiHeroProps {
    firstName: string;
    lastName?: string;
}

export function AsciiHero({ firstName, lastName }: AsciiHeroProps) {
    const firstNameLines = generateAsciiText(firstName);
    const lastNameLines = lastName ? generateAsciiText(lastName) : [];

    // Combine with a blank separator line between names
    const allLines = lastName
        ? [...firstNameLines, "", ...lastNameLines]
        : firstNameLines;

    return (
        <section className="flex flex-col items-center justify-center min-h-screen px-4">
            {/* Accessible heading hidden behind the decorative ASCII art */}
            <h1 className="sr-only">
                {firstName}
                {lastName ? ` ${lastName}` : ""}
            </h1>

            <pre
                className="text-neutral-300 text-[10px] leading-none select-none sm:text-sm md:text-lg lg:text-xl xl:text-2xl mx-auto w-fit text-center"
                aria-hidden="true"
            >
                {allLines.join("\n")}
            </pre>
        </section>
    );
}
