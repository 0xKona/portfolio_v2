/**
 * NotFound — 404 page for non-existent routes.
 * Displays a terminal-style 404 message with the worried chibi character.
 */

import Link from "next/link";
import { TerminalStatus } from "@/components/ui/terminal-status";
import { WorriedCharacter } from "@/components/ui/worried-character";
import { TerminalErrorBox } from "@/components/ui/terminal-error-box";

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
            <TerminalStatus message="404: command not found" variant="error" />

            <WorriedCharacter altText="Page not found" />

            <TerminalErrorBox
                title="[404] Page not found"
                message="The requested page does not exist in this directory."
                footer="bash: cd: no such file or directory"
            />

            {/* Action button */}
            <div className="flex gap-4">
                <Link
                    href="/"
                    className="border border-cyan-400 text-cyan-400 px-6 py-2 font-mono text-sm hover:bg-cyan-400 hover:text-black transition-colors"
                >
                    &gt; cd ~/home
                </Link>
            </div>
        </main>
    );
}
