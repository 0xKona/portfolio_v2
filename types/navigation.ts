/**
 * Navigation-related type definitions
 */

export interface NavigationLink {
    /** Unique identifier for the link */
    name: string;
    /** Text displayed in the navigation */
    displayText: string;
    /** Route path for the link */
    route: string;
}
