import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import Auth from "@/components/auth/auth";

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Connor Robinson — Portfolio",
    description: "Software developer portfolio",
};

// Configure Amplify using the generated outputs file
Amplify.configure(outputs);

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
            <body
                className={`${jetbrainsMono.variable} font-mono bg-black text-neutral-300 antialiased`}
            >
                <Auth>{children}</Auth>
            </body>
        </html>
    );
}
