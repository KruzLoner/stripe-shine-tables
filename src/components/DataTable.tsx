import { useState } from "react";
import { MoreHorizontal, CreditCard, Building2, Wallet, ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusBadge from "./StatusBadge";
import FilterChip from "./FilterChip";

type PaymentStatus = "succeeded" | "pending" | "failed";

interface Payment {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: PaymentStatus;
  method: "card" | "bank" | "wallet";
  date: string;
}

const payments: Payment[] = [
  { id: "pay_1NqR3x", customer: "Olivia Martin", email: "olivia@example.com", amount: 1999.0, status: "succeeded", method: "card", date: "Mar 14, 2026" },
  { id: "pay_1NqR4y", customer: "Jackson Lee", email: "jackson@example.com", amount: 39.0, status: "pending", method: "bank", date: "Mar 13, 2026" },
  { id: "pay_1NqR5z", customer: "Isabella Nguyen", email: "isabella@example.com", amount: 299.0, status: "succeeded", method: "card", date: "Mar 13, 2026" },
  { id: "pay_1NqR6a", customer: "William Kim", email: "will@example.com", amount: 99.0, status: "failed", method: "wallet", date: "Mar 12, 2026" },
  { id: "pay_1NqR7b", customer: "Sofia Davis", email: "sofia@example.com", amount: 499.0, status: "succeeded", method: "card", date: "Mar 12, 2026" },
  { id: "pay_1NqR8c", customer: "Liam Johnson", email: "liam@example.com", amount: 150.0, status: "succeeded", method: "bank", date: "Mar 11, 2026" },
  { id: "pay_1NqR9d", customer: "Emma Wilson", email: "emma@example.com", amount: 2450.0, status: "pending", method: "card", date: "Mar 11, 2026" },
  { id: "pay_1NqRAe", customer: "Noah Brown", email: "noah@example.com", amount: 74.5, status: "succeeded", method: "wallet", date: "Mar 10, 2026" },
];

const statusMap: Record<PaymentStatus, { label: string; variant: "success" | "warning" | "error" }> = {
  succeeded: { label: "Succeeded", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  failed: { label: "Failed", variant: "error" },
};

const methodIcons: Record<string, React.ReactNode> = {
  card: <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />,
  bank: <Building2 className="h-3.5 w-3.5 text-muted-foreground" />,
  wallet: <Wallet className="h-3.5 w-3.5 text-muted-foreground" />,
};

const filters = ["All payments", "Succeeded", "Pending", "Failed"];

const DataTable = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState("All payments");

  const filtered = activeFilter === "All payments"
    ? payments
    : payments.filter((p) => p.status === activeFilter.toLowerCase());

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Payments</h1>
        <p className="text-table text-muted-foreground mt-1">
          Manage and track all payment transactions.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        {filters.map((f) => (
          <FilterChip
            key={f}
            label={f}
            active={activeFilter === f}
            onClick={() => setActiveFilter(f)}
          />
        ))}
      </div>

      {/* Table container */}
      <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-4 py-3 text-left text-table-sm font-medium text-table-header">
                  <span className="inline-flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                    Customer <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-table-sm font-medium text-table-header">Status</th>
                <th className="px-4 py-3 text-left text-table-sm font-medium text-table-header">Method</th>
                <th className="px-4 py-3 text-right text-table-sm font-medium text-table-header">
                  <span className="inline-flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors justify-end">
                    Amount <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-4 py-3 text-right text-table-sm font-medium text-table-header">Date</th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-border last:border-b-0 hover:bg-table-hover transition-colors h-[54px]"
                >
                  <td className="px-4">
                    <Checkbox
                      checked={selected.has(payment.id)}
                      onCheckedChange={() => toggleOne(payment.id)}
                      aria-label={`Select ${payment.customer}`}
                    />
                  </td>
                  <td className="px-4">
                    <div>
                      <div className="text-table font-medium text-foreground">{payment.customer}</div>
                      <div className="text-table-sm text-muted-foreground">{payment.email}</div>
                    </div>
                  </td>
                  <td className="px-4">
                    <StatusBadge variant={statusMap[payment.status].variant}>
                      {statusMap[payment.status].label}
                    </StatusBadge>
                  </td>
                  <td className="px-4">
                    <div className="flex items-center gap-2 text-table text-muted-foreground">
                      {methodIcons[payment.method]}
                      <span className="capitalize">{payment.method}</span>
                    </div>
                  </td>
                  <td className="px-4 text-right text-table font-medium text-foreground tabular-nums">
                    ${payment.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 text-right text-table text-muted-foreground">
                    {payment.date}
                  </td>
                  <td className="px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Copy ID</DropdownMenuItem>
                        <DropdownMenuItem>Refund</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-table-sm text-muted-foreground">
            {selected.size > 0
              ? `${selected.size} of ${filtered.length} row(s) selected`
              : `${filtered.length} results`}
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-table-sm font-medium rounded-md border border-border bg-card text-muted-foreground hover:bg-muted transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 text-table-sm font-medium rounded-md border border-border bg-card text-muted-foreground hover:bg-muted transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
