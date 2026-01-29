'use client';

import { getCurrentUser, signIn } from 'aws-amplify/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import NewPasswordRequired from './new-pass-required';

export default function Signin() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [needsNewPassword, setNeedsNewPassword] = useState(false);

    // Check if user is already authenticated on mount
    useEffect(() => {
        async function checkUser() {
            try {
                await getCurrentUser();
                // If authenticated, redirect to intended page or home
                const redirect = searchParams.get('redirect') || '/';
                router.replace(redirect);
            } catch { /* User not signed in, stay on login page */ }
        }
        checkUser();
    }, [router, searchParams]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            // Authenticate with Cognito
            const result = await signIn({ username: email, password });
            
            // Check if user needs to set a new password
            if (result.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
                setNeedsNewPassword(true);
                return;
            }
            
            // Redirect to the page they were trying to access, or home
            const redirect = searchParams.get('redirect') || '/';
            router.push(redirect);
        } catch {
            setError('Invalid email or password');
        }
    };

    const handlePasswordComplete = () => {
        // After password is set, redirect to intended page
        const redirect = searchParams.get('redirect') || '/';
        router.push(redirect);
    };

    // Show new password form if challenge is required
    if (needsNewPassword) {
        return <NewPasswordRequired onComplete={handlePasswordComplete} onError={setError} />;
    }

    return (
        <form onSubmit={onSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            {error && <p>{error}</p>}
            <button type="submit">Sign In</button>
        </form>
    );
}
