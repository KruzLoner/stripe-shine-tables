import { useState } from "react";
import { MoreHorizontal, ArrowUpDown, MapPin, Store, Truck, Package, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusBadge from "./StatusBadge";
import FilterChip from "./FilterChip";

type OrderStatus = "delivered" | "in_transit" | "pending" | "cancelled";
type Priority = "high" | "medium" | "low";
type ServiceType = "Express" | "Standard" | "Same Day";

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  customerAddress: string;
  storeNumber: string;
  pickUpAddress: string;
  serviceType: ServiceType;
  status: OrderStatus;
  priority: Priority;
  scheduled: string;
  price: number;
}

const orders: Order[] = [
  { id: "1", orderNumber: "ORD-4821", customer: "Olivia Martin", customerAddress: "742 Evergreen Terrace, Springfield, IL", storeNumber: "STR-012", pickUpAddress: "1200 Market St, Springfield, IL", serviceType: "Express", status: "delivered", priority: "high", scheduled: "Mar 19, 2:00 PM", price: 24.99 },
  { id: "2", orderNumber: "ORD-4822", customer: "Jackson Lee", customerAddress: "88 Colin P Kelly Jr St, San Francisco, CA", storeNumber: "STR-007", pickUpAddress: "500 Terry Francine St, San Francisco, CA", serviceType: "Standard", status: "in_transit", priority: "medium", scheduled: "Mar 19, 4:30 PM", price: 12.50 },
  { id: "3", orderNumber: "ORD-4823", customer: "Isabella Nguyen", customerAddress: "350 5th Ave, New York, NY", storeNumber: "STR-003", pickUpAddress: "200 Broadway, New York, NY", serviceType: "Same Day", status: "pending", priority: "high", scheduled: "Mar 19, 6:00 PM", price: 34.00 },
  { id: "4", orderNumber: "ORD-4824", customer: "William Kim", customerAddress: "1600 Amphitheatre Pkwy, Mountain View, CA", storeNumber: "STR-019", pickUpAddress: "2300 Traverwood Dr, Ann Arbor, MI", serviceType: "Standard", status: "cancelled", priority: "low", scheduled: "Mar 20, 10:00 AM", price: 8.75 },
  { id: "5", orderNumber: "ORD-4825", customer: "Sofia Davis", customerAddress: "1 Apple Park Way, Cupertino, CA", storeNumber: "STR-012", pickUpAddress: "1200 Market St, Springfield, IL", serviceType: "Express", status: "delivered", priority: "medium", scheduled: "Mar 18, 1:00 PM", price: 42.00 },
  { id: "6", orderNumber: "ORD-4826", customer: "Liam Johnson", customerAddress: "410 Terry Ave N, Seattle, WA", storeNumber: "STR-005", pickUpAddress: "800 Occidental Ave S, Seattle, WA", serviceType: "Same Day", status: "in_transit", priority: "high", scheduled: "Mar 19, 3:15 PM", price: 19.99 },
  { id: "7", orderNumber: "ORD-4827", customer: "Emma Wilson", customerAddress: "1 Hacker Way, Menlo Park, CA", storeNumber: "STR-003", pickUpAddress: "200 Broadway, New York, NY", serviceType: "Standard", status: "pending", priority: "low", scheduled: "Mar 21, 9:00 AM", price: 15.25 },
  { id: "8", orderNumber: "ORD-4828", customer: "Noah Brown", customerAddress: "345 Spear St, San Francisco, CA", storeNumber: "STR-007", pickUpAddress: "500 Terry Francine St, San Francisco, CA", serviceType: "Express", status: "delivered", priority: "medium", scheduled: "Mar 18, 11:30 AM", price: 56.80 },
];

const statusMap: Record<OrderStatus, { label: string; variant: "success" | "warning" | "error" }> = {
  delivered: { label: "Delivered", variant: "success" },
  in_transit: { label: "In Transit", variant: "warning" },
  pending: { label: "Pending", variant: "warning" },
  cancelled: { label: "Cancelled", variant: "error" },
};

const priorityMap: Record<Priority, { label: string; variant: "success" | "warning" | "error" }> = {
  high: { label: "High", variant: "error" },
  medium: { label: "Medium", variant: "warning" },
  low: { label: "Low", variant: "success" },
};

const serviceIcons: Record<ServiceType, React.ReactNode> = {
  Express: <Truck className="h-3.5 w-3.5 text-muted-foreground" />,
  Standard: <Package className="h-3.5 w-3.5 text-muted-foreground" />,
  "Same Day": <Clock className="h-3.5 w-3.5 text-muted-foreground" />,
};

const filters = ["All orders", "Delivered", "In Transit", "Pending", "Cancelled"];

const DataTable = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState("All orders");

  const filterStatusMap: Record<string, OrderStatus> = {
    "Delivered": "delivered",
    "In Transit": "in_transit",
    "Pending": "pending",
    "Cancelled": "cancelled",
  };

  const filtered = activeFilter === "All orders"
    ? orders
    : orders.filter((o) => o.status === filterStatusMap[activeFilter]);

  const allSelected = filtered.length > 0 && filtered.every((o) => selected.has(o.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((o) => o.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Orders</h1>
        <p className="text-table text-muted-foreground mt-1">
          Track and manage delivery orders across all stores.
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
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                </th>
                <th className="px-4 py-3 text-left text-table-sm font-medium text-table-header whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                    Order # <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-table-sm font-medium text-table-header">Customer</th>
                <th className="px-4 py-3 text-left text-table-sm font-medium text-table-header whitespace-nowrap">Customer Address</th>
                <th className="px-4 py-3 text-left text-table-sm font-medium text-table-header whitespace-nowrap">Store #</th>
                <th className="px-4 py-3 text-left text-table-sm font-medium text-table-header whitespace-nowrap">Pick Up Address</th>
                <th className="px-4 py-3 text-left text-table-sm font-medium text-table-header whitespace-nowrap">Service Type</th>
                <th className="px-4 py-3 text-left text-table-sm font-medium text-table-header">Status</th>
                <th className="px-4 py-3 text-left text-table-sm font-medium text-table-header">Priority</th>
                <th className="px-4 py-3 text-left text-table-sm font-medium text-table-header">Scheduled</th>
                <th className="px-4 py-3 text-right text-table-sm font-medium text-table-header">
                  <span className="inline-flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors justify-end">
                    Price <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="w-12 px-4 py-3 text-table-sm font-medium text-table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-b-0 hover:bg-table-hover transition-colors h-[54px]"
                >
                  <td className="px-4">
                    <Checkbox
                      checked={selected.has(order.id)}
                      onCheckedChange={() => toggleOne(order.id)}
                      aria-label={`Select ${order.orderNumber}`}
                    />
                  </td>
                  <td className="px-4 text-table font-medium text-primary whitespace-nowrap">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 text-table font-medium text-foreground whitespace-nowrap">
                    {order.customer}
                  </td>
                  <td className="px-4">
                    <div className="flex items-center gap-1.5 text-table text-muted-foreground max-w-[200px]">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{order.customerAddress}</span>
                    </div>
                  </td>
                  <td className="px-4">
                    <div className="flex items-center gap-1.5 text-table text-foreground whitespace-nowrap">
                      <Store className="h-3.5 w-3.5 text-muted-foreground" />
                      {order.storeNumber}
                    </div>
                  </td>
                  <td className="px-4">
                    <div className="flex items-center gap-1.5 text-table text-muted-foreground max-w-[200px]">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{order.pickUpAddress}</span>
                    </div>
                  </td>
                  <td className="px-4">
                    <div className="flex items-center gap-2 text-table text-muted-foreground whitespace-nowrap">
                      {serviceIcons[order.serviceType]}
                      {order.serviceType}
                    </div>
                  </td>
                  <td className="px-4">
                    <StatusBadge variant={statusMap[order.status].variant}>
                      {statusMap[order.status].label}
                    </StatusBadge>
                  </td>
                  <td className="px-4">
                    <StatusBadge variant={priorityMap[order.priority].variant}>
                      {priorityMap[order.priority].label}
                    </StatusBadge>
                  </td>
                  <td className="px-4 text-table text-muted-foreground whitespace-nowrap">
                    {order.scheduled}
                  </td>
                  <td className="px-4 text-right text-table font-medium text-foreground tabular-nums whitespace-nowrap">
                    ${order.price.toFixed(2)}
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
                        <DropdownMenuItem>Edit order</DropdownMenuItem>
                        <DropdownMenuItem>Track delivery</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Cancel order</DropdownMenuItem>
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
