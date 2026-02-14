"use client";

import { useState, useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { client } from "@/lib/amplify-client";
import type { Schema } from "@/amplify/data/resource";

type AmplifyProject = Schema["PortfolioProjectV2"]["type"];

interface UseProjectReturn {
    project: AmplifyProject | null;
    isLoading: boolean;
    error: string | null;
}

/**
 * Hook for fetching a single project with automatic auth mode detection.
 * Uses userPool for authenticated users, identityPool for guests.
 */
export function useProject(id: string | null, forceAuthMode?: 'userPool' | 'identityPool'): UseProjectReturn {
    const [project, setProject] = useState<AmplifyProject | null>(null);
    const [isLoading, setIsLoading] = useState(!!id);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setProject(null);
            setIsLoading(false);
            return;
        }

        let cancelled = false;

        const fetchProject = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Auto-detect auth mode if not forced
                let authMode: 'userPool' | 'identityPool' = 'identityPool';
                if (forceAuthMode) {
                    authMode = forceAuthMode;
                } else {
                    try {
                        const session = await fetchAuthSession();
                        authMode = session.tokens ? 'userPool' : 'identityPool';
                    } catch {
                        authMode = 'identityPool';
                    }
                }

                const { data, errors } =
                    await client.models.PortfolioProjectV2.get({ id }, { authMode });
                if (cancelled) return;
                if (errors?.length) {
                    setError(errors[0].message);
                } else {
                    setProject(data);
                }
            } catch (err) {
                if (cancelled) return;
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch project"
                );
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetchProject();
        return () => {
            cancelled = true;
        };
    }, [forceAuthMode, id]);

    return { project, isLoading, error };
}
