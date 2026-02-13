import { SKILL_ICONS, SkillIconName } from "../constants/skill-icons";

/** Get icon component for a skill name */
export function renderIcon(name: SkillIconName, className: string = "w-3 h-3") {
    const Icon = SKILL_ICONS[name];
    return Icon ? <Icon className={className} /> : null;
}
