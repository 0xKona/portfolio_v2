import { AboutContent } from "@/components/landing/about-content";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About & Contact",
    description:
        "Get in touch with Connor Robinson. Find links to GitHub, LinkedIn, and other professional profiles.",
    openGraph: {
        title: "About & Contact | Connor Robinson",
        description:
            "Get in touch with Connor Robinson. Find links to GitHub, LinkedIn, and other professional profiles.",
    },
};

export default function AboutPage() {
    return <AboutContent />;
}
