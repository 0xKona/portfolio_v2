"use client";
import { GameModal } from "@/components/game/game-modal";
import { TerminalButton } from "@/components/ui/terminal-button";
import { useState } from "react";

export default function AboutPage() {
  const [isGameOpen, setIsGameOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Terminal header */}
        <div className="font-mono text-neutral-500 text-sm">
          <span className="text-green-400">$</span> cat contact.txt
        </div>

        {/* Contact content */}
        <div className="space-y-6">
          <h1 className="font-mono text-3xl text-green-400">GET IN TOUCH</h1>

          <div className="space-y-4 text-neutral-300 font-mono text-sm">
            <p>
              {">"} Feel free to reach out for collaborations, opportunities, or
              just to say hi!
            </p>

            <div className="space-y-2 pl-4 border-l-2 border-neutral-700">
              <p>
                <span className="text-cyan-400">EMAIL:</span>{" "}
                <a
                  href="mailto:contact@example.com"
                  className="text-neutral-400 hover:text-green-400 transition-colors underline"
                >
                  contact@example.com
                </a>
              </p>
              <p>
                <span className="text-cyan-400">GITHUB:</span>{" "}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-green-400 transition-colors underline"
                >
                  github.com/username
                </a>
              </p>
              <p>
                <span className="text-cyan-400">LINKEDIN:</span>{" "}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-green-400 transition-colors underline"
                >
                  linkedin.com/in/username
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Easter egg button */}
        <div className="pt-8 border-t border-neutral-800">
          <TerminalButton
            variant="ghost"
            prefix=">"
            onClick={() => setIsGameOpen(true)}
            className="text-neutral-600 hover:text-cyan-400"
          >
            bored?
          </TerminalButton>
        </div>
      </div>

      {/* Game modal */}
      <GameModal isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />
    </main>
  );
}
