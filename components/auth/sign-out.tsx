"use client";

import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { TerminalButton } from "@/components/ui/terminal-button";

export default function Signout() {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.replace("/");
        router.refresh();
    };

    return (
        <TerminalButton variant="secondary" onClick={handleSignOut}>
            Sign Out
        </TerminalButton>
    );
}
