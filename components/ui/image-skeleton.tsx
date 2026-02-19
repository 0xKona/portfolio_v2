export function ImageSkeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={`bg-neutral-900 animate-pulse ${className}`}
            aria-busy="true"
            aria-label="Loading image"
        />
    );
}
