import Signout from "@/components/auth/sign-out";

export default function ManagerRoot() {

    return (
        <div>
            <h1>Manager Root Page (Should be protected)</h1>
            <Signout />
        </div>
    );
}
