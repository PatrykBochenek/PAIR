import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePerformAction } from "@/hooks/useReviews";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  XCircle,
  ArrowUpCircle,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

interface ActionMeta {
  label: string;
  description: string;
  icon: LucideIcon;
  cardClass: string;
  confirmClass: string;
}

const ACTION_META: Record<string, ActionMeta> = {
  claim: {
    label: "Claim",
    description: "Assign this item to yourself and begin review.",
    icon: UserCheck,
    cardClass:
      "border-blue-200 hover:border-blue-400 hover:bg-blue-50 data-[active=true]:border-blue-400 data-[active=true]:bg-blue-50",
    confirmClass: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  approve: {
    label: "Approve",
    description: "Mark this item as approved and close it.",
    icon: CheckCircle,
    cardClass:
      "border-green-200 hover:border-green-400 hover:bg-green-50 data-[active=true]:border-green-400 data-[active=true]:bg-green-50",
    confirmClass: "bg-green-600 hover:bg-green-700 text-white",
  },
  reject: {
    label: "Reject",
    description: "Reject this item. This action cannot be undone.",
    icon: XCircle,
    cardClass:
      "border-red-200 hover:border-red-400 hover:bg-red-50 data-[active=true]:border-red-400 data-[active=true]:bg-red-50",
    confirmClass: "bg-red-600 hover:bg-red-700 text-white",
  },
  escalate: {
    label: "Escalate",
    description: "Escalate for senior review. This action cannot be undone.",
    icon: ArrowUpCircle,
    cardClass:
      "border-amber-200 hover:border-amber-400 hover:bg-amber-50 data-[active=true]:border-amber-400 data-[active=true]:bg-amber-50",
    confirmClass: "bg-amber-500 hover:bg-amber-600 text-white",
  },
};

interface Props {
  itemId: string;
  allowedActions: string[];
}

export function ActionButtons({ itemId, allowedActions }: Props) {
  const [pending, setPending] = useState<string | null>(null);
  const { mutate, isPending, error, isSuccess } = usePerformAction(itemId);

  if (allowedActions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No further actions — this item is in a terminal state.
      </p>
    );
  }

  const handleConfirm = (action: string) => {
    mutate(
      { action },
      { onSuccess: () => setPending(null) },
    );
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        {allowedActions.map((action) => {
          const meta = ACTION_META[action];
          const Icon = meta?.icon;
          const isActive = pending === action;

          return (
            <div
              key={action}
              data-active={isActive}
              onClick={() => !isPending && setPending(isActive ? null : action)}
              className={cn(
                "rounded-lg border p-3 cursor-pointer transition-all select-none",
                meta?.cardClass ?? "border-border hover:bg-muted",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  {Icon && <Icon className="w-4 h-4 shrink-0" />}
                  <div>
                    <p className="text-sm font-medium leading-none">{meta?.label ?? action}</p>
                    {meta?.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{meta.description}</p>
                    )}
                  </div>
                </div>

                {isActive && (
                  <Button
                    size="sm"
                    disabled={isPending}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirm(action);
                    }}
                    className={cn("shrink-0", meta?.confirmClass)}
                  >
                    {isPending ? "…" : "Confirm"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
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
