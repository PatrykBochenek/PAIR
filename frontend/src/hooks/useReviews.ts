import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchItem, fetchQueue, performAction } from "@/api/reviews";

export const QUEUE_KEY = ["reviews", "queue"] as const;
export const itemKey = (id: string) => ["reviews", "item", id] as const;

export function useQueue() {
  return useQuery({ queryKey: QUEUE_KEY, queryFn: fetchQueue });
}

export function useItem(id: string | null) {
  return useQuery({
    queryKey: itemKey(id ?? ""),
    queryFn: () => fetchItem(id!),
    enabled: id !== null,
  });
}

export function usePerformAction(itemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ action, reviewer }: { action: string; reviewer?: string }) =>
      performAction(itemId, action, reviewer),
    onSuccess: (updated) => {
      queryClient.setQueryData(itemKey(itemId), updated);
      queryClient.invalidateQueries({ queryKey: QUEUE_KEY });
    },
  });
}
