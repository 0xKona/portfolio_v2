"use client";

import { confirmSignIn } from "aws-amplify/auth";
import { useState } from "react";

interface NewPasswordRequiredProps {
    onComplete: () => void;
    onError: (error: string) => void;
}

export default function NewPasswordRequired({
    onComplete,
    onError,
}: NewPasswordRequiredProps) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            onError("Passwords do not match");
            return;
        }

        try {
            // Complete the NEW_PASSWORD_REQUIRED challenge
            await confirmSignIn({ challengeResponse: newPassword });
            onComplete();
        } catch {
            onError("Failed to set new password");
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <section className="w-full max-w-md mx-auto">
                <div className="font-mono text-sm text-neutral-500 mb-3">
                    guest@portfolio:~$ set-new-pass
                </div>
                <form
                    onSubmit={onSubmit}
                    className="bg-black border border-neutral-800 p-6 rounded-none"
                >
                    <h2 className="text-neutral-300 font-mono text-lg mb-2">
                        Set New Password
                    </h2>
                    <p className="text-sm text-neutral-500 mb-4">
                        You must set a new password before continuing
                    </p>

                    <label
                        className="block text-xs text-neutral-500 mb-1"
                        htmlFor="new-pass"
                    >
                        $ new password
                    </label>
                    <input
                        id="new-pass"
                        type="password"
                        className="w-full bg-black border border-neutral-700 text-neutral-300 px-3 py-2 mb-4 outline-none focus:border-cyan-400"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        required
                        minLength={8}
                    />

                    <label
                        className="block text-xs text-neutral-500 mb-1"
                        htmlFor="confirm-pass"
                    >
                        $ confirm password
                    </label>
                    <input
                        id="confirm-pass"
                        type="password"
                        className="w-full bg-black border border-neutral-700 text-neutral-300 px-3 py-2 mb-4 outline-none focus:border-cyan-400"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        required
                        minLength={8}
                    />

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            className="px-3 py-1.5 text-sm font-mono border border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                        >
                            Set Password
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}
