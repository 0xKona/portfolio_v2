/**
 * TerminalStatus — Terminal-style status message with prompt prefix.
 * Used for displaying command outputs, errors, and status messages.
 */

interface TerminalStatusProps {
    /** The status message to display */
    message: string;
    /** Color variant for the message */
    variant?: "error" | "success" | "info";
}

export function TerminalStatus({
    message,
    variant = "error",
}: TerminalStatusProps) {
    const colorClass = {
        error: "text-red-400",
        success: "text-green-400",
        info: "text-cyan-400",
    }[variant];

    return (
        <div className={`${colorClass} text-sm mb-6 font-mono`}>
            <span className="text-neutral-500">$</span> {message}
        </div>
    );
}
