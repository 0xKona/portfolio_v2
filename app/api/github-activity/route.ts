import { NextResponse } from "next/server";

const GITHUB_USERNAME = "0xKona";

interface GitHubEvent {
    id: string;
    type: string;
    created_at: string;
    repo: {
        name: string;
        url: string;
    };
    payload: {
        ref?: string;
        ref_type?: string;
        commits?: Array<{ message: string }>;
        action?: string;
        pull_request?: {
            title: string;
            html_url: string;
        };
    };
}

export async function GET() {
    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=10`,
            {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                    ...(process.env.GITHUB_TOKEN && {
                        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    }),
                },
                next: { revalidate: 300 }, // Cache for 5 minutes
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch GitHub events");
        }

        const events: GitHubEvent[] = await response.json();

        const activities = events
            .filter((event) =>
                ["PushEvent", "CreateEvent", "ForkEvent", "PullRequestEvent"].includes(
                    event.type
                )
            )
            .map((event) => {
                const date = new Date(event.created_at);
                const timestamp = date.toISOString().split("T")[0];

                switch (event.type) {
                    case "PushEvent":
                        const commitMsg =
                            event.payload.commits?.[0]?.message || "code changes";
                        return {
                            id: event.id,
                            timestamp,
                            action: "PUSH",
                            description: `${event.repo.name}: ${commitMsg.slice(0, 60)}${commitMsg.length > 60 ? "..." : ""}`,
                            type: "push" as const,
                            url: `https://github.com/${event.repo.name}`,
                        };

                    case "CreateEvent":
                        const refType = event.payload.ref_type || "repository";
                        return {
                            id: event.id,
                            timestamp,
                            action: "CREATE",
                            description: `Created ${refType} ${event.payload.ref || event.repo.name}`,
                            type: "create" as const,
                            url: `https://github.com/${event.repo.name}`,
                        };

                    case "ForkEvent":
                        return {
                            id: event.id,
                            timestamp,
                            action: "FORK",
                            description: `Forked ${event.repo.name}`,
                            type: "fork" as const,
                            url: `https://github.com/${event.repo.name}`,
                        };

                    case "PullRequestEvent":
                        return {
                            id: event.id,
                            timestamp,
                            action: "PR",
                            description: `${event.payload.action} PR: ${event.payload.pull_request?.title}`,
                            type: "pr" as const,
                            url: event.payload.pull_request?.html_url,
                        };

                    default:
                        return null;
                }
            })
            .filter((activity) => activity !== null && !activity.description.includes("undefined"))
            .slice(0, 5);

        return NextResponse.json(activities);
    } catch (error) {
        console.error("GitHub API error:", error);
        return NextResponse.json([], { status: 200 }); // Return empty array on error
    }
}
