"use client";

import { getCurrentUser, signIn } from "aws-amplify/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import NewPasswordRequired from "./new-pass-required";
import { TerminalButton } from "@/components/ui/terminal-button";

export default function Signin() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [needsNewPassword, setNeedsNewPassword] = useState(false);

    // Check if user is already authenticated on mount
    useEffect(() => {
        async function checkUser() {
            try {
                await getCurrentUser();
                // If authenticated, redirect to intended page or home
                const redirect = searchParams.get("redirect") || "/";
                router.replace(redirect);
            } catch {
                /* User not signed in, stay on login page */
            }
        }
        checkUser();
    }, [router, searchParams]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // Authenticate with Cognito
            const result = await signIn({ username: email, password });

            // Check if user needs to set a new password
            if (
                result.nextStep.signInStep ===
                "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
            ) {
                setNeedsNewPassword(true);
                return;
            }

            // Redirect to the page they were trying to access, or home
            const redirect = searchParams.get("redirect") || "/";
            router.push(redirect);
        } catch {
            setError("Invalid email or password");
        }
    };

    const handlePasswordComplete = () => {
        // After password is set, redirect to intended page
        const redirect = searchParams.get("redirect") || "/";
        router.push(redirect);
    };

    // Show new password form if challenge is required
    if (needsNewPassword) {
        return (
            <NewPasswordRequired
                onComplete={handlePasswordComplete}
                onError={setError}
            />
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <section className="w-full max-w-md mx-auto">
                <div className="font-mono text-sm text-neutral-500 mb-3">
                    guest@portfolio:~$ signin
                </div>
                <form
                    onSubmit={onSubmit}
                    className="bg-black border border-neutral-800 p-6 rounded-none"
                >
                    <label
                        className="block text-xs text-neutral-500 mb-1"
                        htmlFor="email"
                    >
                        $ email
                    </label>
                    <input
                        id="email"
                        className="w-full bg-black border border-neutral-700 text-neutral-300 px-3 py-2 mb-4 outline-none focus:border-cyan-400"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                    />

                    <label
                        className="block text-xs text-neutral-500 mb-1"
                        htmlFor="password"
                    >
                        $ password
                    </label>
                    <input
                        id="password"
                        className="w-full bg-black border border-neutral-700 text-neutral-300 px-3 py-2 mb-4 outline-none focus:border-cyan-400"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                    />

                    {error && (
                        <p className="text-sm text-red-400 mb-3">{error}</p>
                    )}

                    <div className="flex items-center gap-3">
                        <TerminalButton type="submit" variant="primary">
                            Sign In
                        </TerminalButton>

                        <TerminalButton
                            type="button"
                            variant="ghost"
                            onClick={() => router.push("/")}
                        >
                            Cancel
                        </TerminalButton>
                    </div>
                </form>
            </section>
        </main>
    );
}
