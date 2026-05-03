import { Skeleton } from "@/components/ui/skeleton";
import { useQueue } from "@/hooks/useReviews";
import { QueueItem } from "./QueueItem";

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function QueuePanel({ selectedId, onSelect }: Props) {
  const { data: items, isLoading, isError } = useQueue();

  return (
    <aside className="flex flex-col h-full border-r border-border">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Active Queue
        </h2>
        {items && (
          <p className="text-xs text-muted-foreground mt-0.5">{items.length} items</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-4 py-3 border-b border-border space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          ))}

        {isError && (
          <p className="px-4 py-6 text-sm text-destructive">Failed to load queue.</p>
        )}

        {items?.length === 0 && (
          <p className="px-4 py-6 text-sm text-muted-foreground">No items in queue.</p>
        )}

        {items?.map((item) => (
          <QueueItem
            key={item.id}
            item={item}
            selected={item.id === selectedId}
            onClick={() => onSelect(item.id)}
          />
        ))}
      </div>
    </aside>
  );
}
