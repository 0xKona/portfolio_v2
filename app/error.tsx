"use client";

/**
 * Error — Global error boundary for the application.
 * Displays a terminal-style error message with the worried chibi character.
 * Required to be a client component by Next.js.
 */

import Link from "next/link";
import { useEffect } from "react";
import { TerminalStatus } from "@/components/ui/terminal-status";
import { WorriedCharacter } from "@/components/ui/worried-character";
import { TerminalErrorBox } from "@/components/ui/terminal-error-box";

interface ErrorProps {
    /** The error object thrown */
    error: Error & { digest?: string };
    /** Function to reset the error boundary and re-render */
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log error to console or error reporting service
        console.error("Application error:", error);
    }, [error]);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
            <TerminalStatus message="error: command failed" variant="error" />

            <WorriedCharacter altText="Error occurred" />

            <TerminalErrorBox
                title="[ERROR] Something went wrong"
                message={error.message || "An unexpected error occurred"}
                footer={error.digest ? `Error ID: ${error.digest}` : undefined}
            />

            {/* Action buttons */}
            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="border border-green-400 text-green-400 px-6 py-2 font-mono text-sm hover:bg-green-400 hover:text-black transition-colors"
                >
                    &gt; retry
                </button>
                <Link
                    href="/"
                    className="border border-cyan-400 text-cyan-400 px-6 py-2 font-mono text-sm hover:bg-cyan-400 hover:text-black transition-colors"
                >
                    &gt; go home
                </Link>
            </div>
        </main>
    );
}
