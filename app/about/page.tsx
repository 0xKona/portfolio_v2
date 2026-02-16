import { AboutMe } from "@/components/landing/about-me";
import { AboutContact } from "@/components/landing/about-contact";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About & Contact",
    description:
        "Find links to GitHub, LinkedIn, and other professional profiles.",
    openGraph: {
        title: "About & Contact | Connor Robinson",
        description:
            "Find links to GitHub, LinkedIn, and other professional profiles.",
    },
};

export default function AboutPage() {
    return (
        <main className="min-h-screen">
            <AboutMe />
            <AboutContact />
        </main>
    );
}
