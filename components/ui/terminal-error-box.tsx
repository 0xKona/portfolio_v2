/**
 * TerminalErrorBox — Bordered error message box with terminal styling.
 * Displays error codes, messages, and optional metadata in a terminal-like format.
 */

import { ReactNode } from "react";

interface TerminalErrorBoxProps {
    /** Error code or title to display */
    title: string;
    /** Main error message */
    message: string;
    /** Optional footer text or metadata */
    footer?: string | ReactNode;
}

export function TerminalErrorBox({
    title,
    message,
    footer,
}: TerminalErrorBoxProps) {
    return (
        <div className="border border-red-400 max-w-2xl w-full p-6 mb-6">
            <pre className="text-red-400 text-xs mb-2">{title}</pre>
            <p className="text-neutral-400 font-mono text-sm mb-4">{message}</p>
            {footer && <div className="text-neutral-600 text-xs">{footer}</div>}
        </div>
    );
}
