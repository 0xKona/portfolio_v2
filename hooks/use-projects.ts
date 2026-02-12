"use client";

import { useState, useEffect, useCallback } from "react";
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
 * @param authMode - Amplify auth mode. Use 'userPool' for authenticated
 *   manager pages, 'identityPool' for public guest-readable pages.
 */
export function useProjects(authMode: 'userPool' | 'identityPool' = 'userPool'): UseProjectsReturn {
    const [projects, setProjects] = useState<AmplifyProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
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
    }, [authMode]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const createProject = async (
        input: Omit<AmplifyProject, "id" | "createdAt" | "updatedAt">
    ): Promise<AmplifyProject | null> => {
        try {
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
