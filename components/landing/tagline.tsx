export default function HeroTagline() {
    return (
        /* Terminal-style divider */
        <>
            <div className="text-neutral-600 text-sm">--- • ---</div>

            {/* Intro/tagline */}
            <h2 className="text-center max-w-2xl">
                <span className="text-neutral-500">$</span>
                <span className="text-neutral-300 ml-2">
                    Full-stack developer building scalable web experiences
                </span>
                <div className="mt-2 text-sm text-neutral-400">
                    TypeScript • Next.js • AWS • Amplify
                </div>
            </h2>
        </>
    );
}
