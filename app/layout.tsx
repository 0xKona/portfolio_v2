import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import Auth from "@/components/auth/auth";
import MainNavigationBar from "@/components/navigation/main-nav-bar";
import { Footer } from "@/components/navigation/footer";
import { StructuredData } from "@/components/structured-data";

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Connor Robinson — Software Developer",
        template: "%s | Connor Robinson",
    },
    description:
        "Portfolio of Connor Robinson, a software developer specializing in full-stack development, cloud architecture, and modern web applications.",
    keywords: [
        "Connor Robinson",
        "software developer",
        "portfolio",
        "full-stack developer",
        "web development",
        "cloud architecture",
    ],
    authors: [{ name: "Connor Robinson" }],
    creator: "Connor Robinson",
    publisher: "Connor Robinson",
    metadataBase: new URL("https://konarobinson.com"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_GB",
        url: "https://konarobinson.com",
        siteName: "Connor Robinson — Portfolio",
        title: "Connor Robinson — Software Developer",
        description:
            "Portfolio of Connor Robinson, a software developer specializing in full-stack development, cloud architecture, and modern web applications.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Connor Robinson — Software Developer",
        description:
            "Portfolio of Connor Robinson, a software developer specializing in full-stack development, cloud architecture, and modern web applications.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        // Add your Google Search Console verification code here after signing up
        // google: 'your-verification-code-here',
    },
};

// Configure Amplify with SSR support for cookie-based auth
Amplify.configure(outputs, { ssr: true });

/**
 * RootLayout — wraps every page with the monospace font, black background,
 * and authentication provider.
 */
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <StructuredData />
            </head>
            <body
                className={`${jetbrainsMono.variable} min-h-dvh font-mono bg-black text-neutral-300 antialiased flex flex-col`}
            >
                <Auth>
                    <MainNavigationBar />
                    <div className="max-w-7xl mx-auto px-4 flex-1 w-full">
                        {children}
                    </div>
                    <Footer />
                </Auth>
            </body>
        </html>
    );
}
