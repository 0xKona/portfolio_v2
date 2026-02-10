import figlet from "figlet";
import fontAnsiShadow from "figlet/importable-fonts/ANSI Shadow";
import { DEFAULT_FIGLET_FONT } from "@/lib/constants/ascii-art-config";

/** Register the default font once on module load */
figlet.parseFont(DEFAULT_FIGLET_FONT, fontAnsiShadow);

/**
 * generateAsciiText — returns FIGlet ASCII art as an array of lines.
 * Falls back to the raw string if font rendering fails.
 */
export function generateAsciiText(
    text: string,
    font: string = DEFAULT_FIGLET_FONT,
): string[] {
    try {
        const result = figlet.textSync(text, {
            font: font as figlet.Fonts,
            horizontalLayout: "fitted",
            verticalLayout: "fitted",
        });
        return result.split("\n");
    } catch {
        return [text];
    }
}
