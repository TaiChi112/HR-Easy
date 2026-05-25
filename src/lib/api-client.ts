import { treaty } from "@elysiajs/eden";
import type { AppType } from "../app/api/[...elysia]/route";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

export const client = treaty<AppType>(getBaseUrl());

type EdenResponse<TData> = {
  data?: TData;
  error?: unknown;
};

export async function unwrapEdenResponse<TData>(
  responsePromise: Promise<EdenResponse<TData>>,
): Promise<NonNullable<TData>> {
  const response = await responsePromise;

  if (response.error) {
    throw response.error instanceof Error
      ? response.error
      : new Error("Failed to fetch data from the API.");
  }

  if (response.data === undefined || response.data === null) {
    throw new Error("API returned no data.");
  }

  return response.data as NonNullable<TData>;
}
