/**
 * amplify-client — Singleton Amplify Data client for frontend CRUDL operations.
 * Import this wherever you need to interact with the Amplify Data API.
 */
"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

/** Pre-configured Amplify Data client typed to the portfolio schema */
export const client = generateClient<Schema>();
