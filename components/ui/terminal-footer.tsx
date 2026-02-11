/**
 * TerminalFooter — Displays a terminal-style footer message.
 * Used to provide additional context or exit instructions.
 */

interface TerminalFooterProps {
    /** Footer message to display */
    message?: string;
}

export function TerminalFooter({
    message = "Press ESC to exit...",
}: TerminalFooterProps) {
    return (
        <div className="text-neutral-600 text-xs mt-8 font-mono">{message}</div>
    );
}
