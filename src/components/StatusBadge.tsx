import { cn } from "@/lib/utils";

type StatusVariant = "success" | "warning" | "error";

interface StatusBadgeProps {
  variant: StatusVariant;
  children: React.ReactNode;
}

const variantClasses: Record<StatusVariant, string> = {
  success: "bg-status-success-bg text-status-success-text",
  warning: "bg-status-warning-bg text-status-warning-text",
  error: "bg-status-error-bg text-status-error-text",
};

const StatusBadge = ({ variant, children }: StatusBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-table-sm font-medium",
      variantClasses[variant]
    )}
  >
    {children}
  </span>
);

export default StatusBadge;
