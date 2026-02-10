/**
 * Landing page — the root page of the portfolio.
 * Renders the ASCII hero section as the primary above-the-fold content.
 */
import { AsciiHero } from "@/components/landing/ascii-hero";

/** Home — portfolio landing page */
export default function Home() {
    return (
        <main className="min-h-screen bg-black">
            <AsciiHero firstName="CONNOR" lastName="ROBINSON" />
        </main>
    );
}
