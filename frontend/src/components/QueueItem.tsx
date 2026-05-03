import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReviewItem } from "@/types/review";

const RISK_BADGE: Record<ReviewItem["risk_level"], string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

const TIER_BADGE: Record<ReviewItem["customer_tier"], string> = {
  priority: "bg-purple-100 text-purple-700 border-purple-200",
  standard: "bg-slate-100 text-slate-600 border-slate-200",
};

interface Props {
  item: ReviewItem;
  selected: boolean;
  onClick: () => void;
}

export function QueueItem({ item, selected, onClick }: Props) {
  const age = new Date(item.submitted_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 border-b border-border transition-colors",
        "hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected && "bg-accent border-l-2 border-l-primary",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
        <span className="text-xs text-muted-foreground shrink-0">{age}</span>
      </div>
      <p className="text-sm font-medium mt-0.5 leading-snug line-clamp-2">{item.title}</p>
      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
        <Badge variant="outline" className={cn("text-xs", RISK_BADGE[item.risk_level])}>
          {item.risk_level}
        </Badge>
        <Badge variant="outline" className={cn("text-xs", TIER_BADGE[item.customer_tier])}>
          {item.customer_tier}
        </Badge>
      </div>
    </button>
  );
}
