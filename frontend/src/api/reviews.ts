import type { ApiError, ReviewItem } from "@/types/review";

const BASE = "http://localhost:8000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({ detail: res.statusText }))) as ApiError;
    throw new Error(body.detail ?? res.statusText);
  }

  return res.json() as Promise<T>;
}

export const fetchQueue = (): Promise<ReviewItem[]> => request("/reviews/queue");

export const fetchItem = (id: string): Promise<ReviewItem> => request(`/reviews/${id}`);

export const performAction = (
  id: string,
  action: string,
  reviewer: string = "alex",
): Promise<ReviewItem> =>
  request(`/reviews/${id}/actions/${action}`, {
    method: "POST",
    body: JSON.stringify({ reviewer }),
  });
