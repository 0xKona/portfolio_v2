"use client";

import { useState } from "react";
import { TerminalButton } from "@/components/ui/terminal-button";
import { GameModal } from "@/components/game/game-modal";

interface GameTriggerProps {
  label?: string;
  variant?: "primary" | "secondary" | "ghost";
  prefix?: string;
  className?: string;
}

export function GameTrigger({
  label = "bored?",
  variant = "ghost",
  prefix = ">",
  className = "",
}: GameTriggerProps) {
  const [isGameOpen, setIsGameOpen] = useState(false);

  return (
    <>
      <TerminalButton
        variant={variant}
        prefix={prefix}
        onClick={() => setIsGameOpen(true)}
        className={className}
      >
        {label}
      </TerminalButton>

      <GameModal isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />
    </>
  );
}
