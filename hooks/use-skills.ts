"use client";

import { useState, useEffect, useCallback } from "react";
import { client } from "@/lib/amplify-client";
import type { Schema } from "@/amplify/data/resource";

/** Amplify-generated skill type from the schema */
export type AmplifySkill = Schema["PortfolioSkillV2"]["type"];

interface UseSkillsReturn {
    skills: AmplifySkill[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    createSkill: (
        input: Omit<AmplifySkill, "id" | "createdAt" | "updatedAt">
    ) => Promise<AmplifySkill | null>;
    updateSkill: (
        id: string,
        input: Partial<Omit<AmplifySkill, "id" | "createdAt" | "updatedAt">>
    ) => Promise<AmplifySkill | null>;
    deleteSkill: (id: string) => Promise<boolean>;
}

/**
 * @param authMode - Amplify auth mode. Use 'userPool' for authenticated
 *   manager pages, 'identityPool' for public guest-readable pages.
 */
export function useSkills(authMode: 'userPool' | 'identityPool' = 'userPool'): UseSkillsReturn {
    const [skills, setSkills] = useState<AmplifySkill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, errors } =
                await client.models.PortfolioSkillV2.list({ authMode });
            if (errors?.length) {
                setError(errors[0].message);
            } else {
                setSkills(data);
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch skills"
            );
        } finally {
            setIsLoading(false);
        }
    }, [authMode]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const createSkill = async (
        input: Omit<AmplifySkill, "id" | "createdAt" | "updatedAt">
    ): Promise<AmplifySkill | null> => {
        try {
            const { data, errors } =
                await client.models.PortfolioSkillV2.create(input, { authMode });
            if (errors?.length) {
                setError(errors[0].message);
                return null;
            }
            await refresh();
            return data;
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to create skill"
            );
            return null;
        }
    };

    const updateSkill = async (
        id: string,
        input: Partial<Omit<AmplifySkill, "id" | "createdAt" | "updatedAt">>
    ): Promise<AmplifySkill | null> => {
        try {
            const { data, errors } =
                await client.models.PortfolioSkillV2.update({ id, ...input }, { authMode });
            if (errors?.length) {
                setError(errors[0].message);
                return null;
            }
            await refresh();
            return data;
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to update skill"
            );
            return null;
        }
    };

    const deleteSkill = async (id: string): Promise<boolean> => {
        try {
            const { errors } =
                await client.models.PortfolioSkillV2.delete({ id }, { authMode });
            if (errors?.length) {
                setError(errors[0].message);
                return false;
            }
            await refresh();
            return true;
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to delete skill"
            );
            return false;
        }
    };

    return {
        skills,
        isLoading,
        error,
        refresh,
        createSkill,
        updateSkill,
        deleteSkill,
    };
}
