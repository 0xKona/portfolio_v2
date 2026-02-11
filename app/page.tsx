import { AsciiHeroText } from "@/components/landing/ascii-hero";
import HeroTagline from "@/components/landing/tagline";
import { UnderConstruction } from "@/components/ui/under-construction";

/** Home — Portfolio Landing Page */
export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center pt-20">
            <AsciiHeroText firstName="CONNOR" lastName="ROBINSON" />
            <HeroTagline />
            <UnderConstruction progress={50} />
        </main>
    );
}
