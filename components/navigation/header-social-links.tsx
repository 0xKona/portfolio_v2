import { SOCIAL_LINKS } from "@/lib/constants/social-links";
import { SocialLink } from "@/components/ui/social-link";

export function HeaderSocialLinks() {
  return (
    <div className="flex items-center gap-3" aria-label="Social links">
      <span className="text-neutral-600 mr-1 hidden sm:inline">|</span>
      {Object.values(SOCIAL_LINKS).map((link) => (
        <SocialLink
          key={link.name}
          displayText={link.displayText}
          url={link.url}
          icon={link.icon}
        />
      ))}
    </div>
  );
}
