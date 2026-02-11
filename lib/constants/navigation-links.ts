/**
 * Navigation link objects for use in the navigation bar
 */
import { NavigationLink } from "@/types/navigation";

export const NAV_LINKS: NavigationLink[] = [
    {
        name: 'home',
        displayText: 'HOME',
        route: '/'
    },
    {
        name: 'projects',
        displayText: 'PROJECTS',
        route: '/projects'
    },
    {
        name: 'contact',
        displayText: 'CONTACT',
        route: '/contact'
    }
]