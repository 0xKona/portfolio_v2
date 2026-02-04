import Signin from "@/components/auth/sign-in";
import { Suspense } from "react";

export default function SignInPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Signin />
        </Suspense>
    );
}
