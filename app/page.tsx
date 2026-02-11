import { AsciiHero } from "@/components/landing/ascii-hero";

/** Home — portfolio landing page */
export default function Home() {
    return (
        <main className="min-h-screen bg-black">
            <AsciiHero firstName="CONNOR" lastName="ROBINSON" />
        </main>
    );
}
