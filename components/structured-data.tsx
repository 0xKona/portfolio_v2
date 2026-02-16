export function StructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Connor Robinson",
        url: "https://konarobinson.com",
        jobTitle: "Software Developer",
        sameAs: [
            "https://github.com/konarobinson",
            "https://linkedin.com/in/konarobinson",
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
