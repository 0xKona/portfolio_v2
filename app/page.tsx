import { GameTrigger } from "@/components/game/game-trigger";
import { AsciiHeroText } from "@/components/landing/ascii-hero";
import HeroTagline from "@/components/landing/tagline";
import { CompactSkills } from "@/components/landing/compact-skills";
import { FeaturedProjects } from "@/components/landing/featured-projects";
import { RecentActivity } from "@/components/landing/recent-activity";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connor Robinson — Software Developer",
  description:
    "Portfolio of Connor Robinson, a software developer specializing in full-stack development, cloud architecture, and modern web applications. Explore featured projects and recent work.",
  openGraph: {
    title: "Connor Robinson — Software Developer",
    description:
      "Portfolio of Connor Robinson, a software developer specializing in full-stack development, cloud architecture, and modern web applications. Explore featured projects and recent work.",
  },
};

/** Home — Portfolio Landing Page */
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center pt-20 pb-12">
      {/* Hero Section */}
      <AsciiHeroText firstName="CONNOR" lastName="ROBINSON" />
      <HeroTagline />

      {/* Game Trigger */}
      <GameTrigger className="mt-10" label="bored already?" variant="primary" />

      {/* Compact Skills */}
      <CompactSkills />

      {/* Featured Projects */}
      <FeaturedProjects />

      {/* Recent Activity */}
      <RecentActivity />
    </main>
  );
}
