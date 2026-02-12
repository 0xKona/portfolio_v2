"use client";
import { GameModal } from "@/components/game/game-modal";
import { GameTrigger } from "@/components/game/game-trigger";
import { TerminalButton } from "@/components/ui/terminal-button";
import { SOCIAL_LINKS } from "@/lib/constants/social-links";
import { useState } from "react";

export default function AboutPage() {
  const [isGameOpen, setIsGameOpen] = useState(false);

  const { github, linkedIn } = SOCIAL_LINKS;

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
                <span className="text-cyan-400">GITHUB:</span>{" "}
                <a
                  href={github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-green-400 transition-colors underline"
                >
                  {github.url}
                </a>
              </p>
              <p>
                <span className="text-cyan-400">LINKEDIN:</span>{" "}
                <a
                  href={linkedIn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-green-400 transition-colors underline"
                >
                  {linkedIn.url}
                </a>
              </p>
            </div>
          </div>
        </div>

        <GameTrigger variant="ghost" />
      </div>
    </main>
  );
}
