'use client';

import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

export default function Signout() {

    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.replace('/');
        router.refresh();
    };

    return (
        <button onClick={handleSignOut}>Sign Out</button>
    )
}