"use client";

import { useEffect, useState } from "react";

interface GitHubActivity {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  type: "push" | "create" | "star" | "fork" | "pr";
  url?: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<GitHubActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGitHubActivity() {
      try {
        const response = await fetch("/api/github-activity");
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        }
      } catch (error) {
        console.error("Failed to fetch GitHub activity:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGitHubActivity();
  }, []);

  const getTypeColor = (type: GitHubActivity["type"]) => {
    switch (type) {
      case "push":
        return "text-green-400";
      case "create":
        return "text-cyan-400";
      case "star":
        return "text-yellow-400";
      case "fork":
        return "text-purple-400";
      case "pr":
        return "text-blue-400";
      default:
        return "text-neutral-400";
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="font-mono text-neutral-500 text-sm mb-4">
        <span className="text-green-400">$</span> tail -f github-activity.log
      </div>

      <div className="border border-neutral-800 p-6">
        <h2 className="text-green-400 font-mono text-lg mb-4">
          RECENT ACTIVITY
        </h2>

        {isLoading ? (
          <div className="text-neutral-600 text-sm font-mono">
            <span className="animate-pulse">▊</span> fetching activity...
          </div>
        ) : activities.length === 0 ? (
          <div className="text-neutral-600 text-sm font-mono">
            no recent activity found
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <a
                key={activity.id}
                href={activity.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-mono border-l-2 border-neutral-700 pl-3 py-2 hover:border-cyan-400 transition-colors group"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                  <span className="text-neutral-600 text-xs">
                    {activity.timestamp}
                  </span>
                  <span className={`${getTypeColor(activity.type)} text-xs`}>
                    [{activity.action}]
                  </span>
                </div>
                <div className="text-neutral-400 group-hover:text-cyan-400 transition-colors wrap-break-word">
                  {activity.description}
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-4 text-neutral-600 text-xs font-mono">
          <span className="animate-pulse">▊</span> watching for changes...
        </div>
      </div>
    </section>
  );
}
