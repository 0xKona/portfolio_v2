"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { client } from "@/lib/amplify-client";
import type { Schema } from "@/amplify/data/resource";

/** Amplify-generated project type from the schema */
type AmplifyProject = Schema["PortfolioProjectV2"]["type"];

interface UseProjectsReturn {
    projects: AmplifyProject[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    createProject: (
        input: Omit<AmplifyProject, "id" | "createdAt" | "updatedAt">
    ) => Promise<AmplifyProject | null>;
    updateProject: (
        id: string,
        input: Partial<Omit<AmplifyProject, "id" | "createdAt" | "updatedAt">>
    ) => Promise<AmplifyProject | null>;
    deleteProject: (id: string) => Promise<boolean>;
}

/**
 * Hook for managing projects with automatic auth mode detection.
 * Uses userPool for authenticated users, identityPool for guests.
 */
export function useProjects(forceAuthMode?: 'userPool' | 'identityPool'): UseProjectsReturn {
    const [projects, setProjects] = useState<AmplifyProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getAuthMode = async (): Promise<'userPool' | 'identityPool'> => {
        // If auth mode is forced, use it
        if (forceAuthMode) return forceAuthMode;
        
        // Auto-detect: check if user is authenticated
        try {
            const session = await fetchAuthSession();
            return session.tokens ? 'userPool' : 'identityPool';
        } catch {
            return 'identityPool';
        }
    };

    const refresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const authMode = await getAuthMode();
            const { data, errors } =
                await client.models.PortfolioProjectV2.list({ authMode });
            if (errors?.length) {
                setError(errors[0].message);
            } else {
                setProjects(data);
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch projects"
            );
        } finally {
            setIsLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [forceAuthMode]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const createProject = async (
        input: Omit<AmplifyProject, "id" | "createdAt" | "updatedAt">
    ): Promise<AmplifyProject | null> => {
        try {
            const authMode = await getAuthMode();
            const { data, errors } =
                await client.models.PortfolioProjectV2.create(input, { authMode });
            if (errors?.length) {
                setError(errors[0].message);
                return null;
            }
            // Refresh list after creation
            await refresh();
            return data;
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create project"
            );
            return null;
        }
    };

    const updateProject = async (
        id: string,
        input: Partial<Omit<AmplifyProject, "id" | "createdAt" | "updatedAt">>
    ): Promise<AmplifyProject | null> => {
        try {
            const authMode = await getAuthMode();
            const { data, errors } =
                await client.models.PortfolioProjectV2.update({
                    id,
                    ...input,
                }, { authMode });
            if (errors?.length) {
                setError(errors[0].message);
                return null;
            }
            await refresh();
            return data;
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update project"
            );
            return null;
        }
    };

    const deleteProject = async (id: string): Promise<boolean> => {
        try {
            const authMode = await getAuthMode();
            const { errors } =
                await client.models.PortfolioProjectV2.delete({ id }, { authMode });
            if (errors?.length) {
                setError(errors[0].message);
                return false;
            }
            await refresh();
            return true;
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete project"
            );
            return false;
        }
    };

    return {
        projects,
        isLoading,
        error,
        refresh,
        createProject,
        updateProject,
        deleteProject,
    };
}
