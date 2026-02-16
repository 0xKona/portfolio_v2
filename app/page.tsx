import { GameTrigger } from "@/components/game/game-trigger";
import { AsciiHeroText } from "@/components/landing/ascii-hero";
import HeroTagline from "@/components/landing/tagline";
import { UnderConstruction } from "@/components/ui/under-construction";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Connor Robinson — Software Developer",
    description:
        "Portfolio of Connor Robinson, a software developer specializing in full-stack development, cloud architecture, and modern web applications.",
    openGraph: {
        title: "Connor Robinson — Software Developer",
        description:
            "Portfolio of Connor Robinson, a software developer specializing in full-stack development, cloud architecture, and modern web applications.",
    },
};

/** Home — Portfolio Landing Page */
export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center pt-20">
            <AsciiHeroText firstName="CONNOR" lastName="ROBINSON" />
            <HeroTagline />
            <GameTrigger
                className="mt-10"
                label="bored already?"
                variant="primary"
            />
            <UnderConstruction progress={50} />
        </main>
    );
}
