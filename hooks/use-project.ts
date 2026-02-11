"use client";

import { useState, useEffect } from "react";
import { client } from "@/lib/amplify-client";
import type { Schema } from "@/amplify/data/resource";

type AmplifyProject = Schema["PortfolioProjectV2"]["type"];

interface UseProjectReturn {
    project: AmplifyProject | null;
    isLoading: boolean;
    error: string | null;
}

/**
 * @param authMode - Amplify auth mode. Use 'userPool' for authenticated
 *   manager pages, 'identityPool' for public guest-readable pages.
 */
export function useProject(id: string | null, authMode: 'userPool' | 'identityPool' = 'userPool'): UseProjectReturn {
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
    }, [id, authMode]);

    return { project, isLoading, error };
}
