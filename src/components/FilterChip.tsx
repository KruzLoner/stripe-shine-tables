import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const FilterChip = ({ label, active, onClick }: FilterChipProps) => (
  <button
    onClick={onClick}
    className={cn(
      "inline-flex items-center rounded-full border px-3 py-1.5 text-table-sm font-medium transition-colors",
      active
        ? "border-primary/30 bg-primary/5 text-primary"
        : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
    )}
  >
    {label}
  </button>
);

export default FilterChip;
