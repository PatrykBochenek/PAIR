import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useItem } from "@/hooks/useReviews";
import { cn } from "@/lib/utils";
import type { ReviewItem } from "@/types/review";
import { ActionButtons } from "./ActionButtons";

const STATUS_BADGE: Record<ReviewItem["status"], string> = {
  unassigned: "bg-slate-100 text-slate-600 border-slate-200",
  in_review: "bg-blue-100 text-blue-700 border-blue-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  escalated: "bg-amber-100 text-amber-700 border-amber-200",
};

const STATUS_LABELS: Record<ReviewItem["status"], string> = {
  unassigned: "Unassigned",
  in_review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
  escalated: "Escalated",
};

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

interface Props {
  selectedId: string | null;
}

export function DetailPanel({ selectedId }: Props) {
  const { data: item, isLoading, isError } = useItem(selectedId);

  if (!selectedId) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Select an item from the queue to review it.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>Failed to load item details.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const submittedAt = new Date(item.submitted_at).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
          <Badge variant="outline" className={cn("text-xs", STATUS_BADGE[item.status])}>
            {STATUS_LABELS[item.status]}
          </Badge>
        </div>
        <h1 className="text-xl font-semibold leading-snug">{item.title}</h1>
      </div>

      <Separator />

      {/* Metadata */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Details
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <MetaRow label="Risk level" value={
            <Badge variant="outline" className={cn("text-xs", {
              "bg-red-100 text-red-700 border-red-200": item.risk_level === "high",
              "bg-amber-100 text-amber-700 border-amber-200": item.risk_level === "medium",
              "bg-green-100 text-green-700 border-green-200": item.risk_level === "low",
            })}>
              {item.risk_level}
            </Badge>
          } />
          <MetaRow label="Customer tier" value={
            <Badge variant="outline" className={cn("text-xs", {
              "bg-purple-100 text-purple-700 border-purple-200": item.customer_tier === "priority",
              "bg-slate-100 text-slate-600 border-slate-200": item.customer_tier === "standard",
            })}>
              {item.customer_tier}
            </Badge>
          } />
          <MetaRow label="Assigned reviewer" value={item.assigned_reviewer ?? "—"} />
          <MetaRow label="Notes" value={item.notes_count} />
          <MetaRow label="Submitted" value={submittedAt} />
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{item.summary}</p>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActionButtons itemId={item.id} allowedActions={item.allowed_actions} />
        </CardContent>
      </Card>
    </div>
  );
}
