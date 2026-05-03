import { Button } from "@/components/ui/button";
import { usePerformAction } from "@/hooks/useReviews";
import { cn } from "@/lib/utils";

const ACTION_STYLES: Record<string, string> = {
  claim: "bg-blue-600 hover:bg-blue-700 text-white",
  approve: "bg-green-600 hover:bg-green-700 text-white",
  reject: "bg-red-600 hover:bg-red-700 text-white",
  escalate: "bg-amber-500 hover:bg-amber-600 text-white",
};

const ACTION_LABELS: Record<string, string> = {
  claim: "Claim",
  approve: "Approve",
  reject: "Reject",
  escalate: "Escalate",
};

interface Props {
  itemId: string;
  allowedActions: string[];
}

export function ActionButtons({ itemId, allowedActions }: Props) {
  const { mutate, isPending, error, isSuccess } = usePerformAction(itemId);

  if (allowedActions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No further actions available — this item is in a terminal state.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {allowedActions.map((action) => (
          <Button
            key={action}
            disabled={isPending}
            onClick={() => mutate({ action })}
            className={cn("capitalize", ACTION_STYLES[action] ?? "")}
          >
            {ACTION_LABELS[action] ?? action}
          </Button>
        ))}
      </div>

      {isSuccess && (
        <p className="text-sm text-green-600 font-medium">Action applied successfully.</p>
      )}

      {error && (
        <p className="text-sm text-destructive">{(error as Error).message}</p>
      )}
    </div>
  );
}
