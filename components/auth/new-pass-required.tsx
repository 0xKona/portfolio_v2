'use client';

import { confirmSignIn } from 'aws-amplify/auth';
import { useState } from 'react';

interface NewPasswordRequiredProps {
    onComplete: () => void;
    onError: (error: string) => void;
}

export default function NewPasswordRequired({ onComplete, onError }: NewPasswordRequiredProps) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            onError('Passwords do not match');
            return;
        }

        try {
            // Complete the NEW_PASSWORD_REQUIRED challenge
            await confirmSignIn({ challengeResponse: newPassword });
            onComplete();
        } catch {
            onError('Failed to set new password');
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <h2>Set New Password</h2>
            <p>You must set a new password before continuing</p>
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                required
                minLength={8}
            />
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                minLength={8}
            />
            <button type="submit">Set Password</button>
        </form>
    );
}
