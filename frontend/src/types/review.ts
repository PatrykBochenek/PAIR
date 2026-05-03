export interface ReviewItem {
  id: string;
  title: string;
  submitted_at: string;
  risk_level: "high" | "medium" | "low";
  customer_tier: "priority" | "standard";
  status: "unassigned" | "in_review" | "approved" | "rejected" | "escalated";
  assigned_reviewer: string | null;
  notes_count: number;
  summary: string;
  allowed_actions: string[];
}

export interface ApiError {
  detail: string;
}
