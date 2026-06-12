import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Eye,
  ArrowUpDown,
  X,
} from "lucide-react";
import { format } from "date-fns";

const statusFilters = [
  { value: "", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

const statusColors: Record<string, string> = {
  draft: "bg-white/10 text-white/60",
  sent: "bg-blue-500/10 text-blue-400",
  paid: "bg-[#d0ff59]/10 text-[#d0ff59]",
  overdue: "bg-red-500/10 text-red-400",
  cancelled: "bg-white/5 text-white/30",
};

export default function Invoices() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = trpc.invoice.list.useQuery({
    status: status || undefined,
    search: search || undefined,
    page,
    limit: 20,
  });

  const updateStatus = trpc.invoice.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteInvoice = trpc.invoice.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const invoices = data?.invoices || [];
  const total = data?.total || 0;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Invoices</h1>
          <p className="text-white/50 text-sm mt-1">
            {total} total invoice{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => navigate("/invoices/new")}
          className="bg-[#d0ff59] text-black hover:bg-[#d0ff59]/90 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 bg-[#111] border-white/10 text-white placeholder:text-white/30 focus:border-[#d0ff59]/50"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                setStatus(filter.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                status === filter.value
                  ? "bg-[#d0ff59] text-black"
                  : "bg-[#111] text-white/50 hover:text-white hover:bg-white/5 border border-white/5"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice List */}
      <div className="rounded-2xl bg-[#111] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                <th className="pb-3 pt-4 px-6 font-medium">
                  <button className="flex items-center gap-1 hover:text-white/60 transition-colors">
                    Invoice #
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="pb-3 pt-4 px-4 font-medium">Status</th>
                <th className="pb-3 pt-4 px-4 font-medium">Issue Date</th>
                <th className="pb-3 pt-4 px-4 font-medium">Due Date</th>
                <th className="pb-3 pt-4 px-4 font-medium text-right">
                  Amount
                </th>
                <th className="pb-3 pt-4 px-6 font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="py-4 px-6">
                      <div className="animate-pulse bg-white/5 h-8 rounded" />
                    </td>
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-white/40"
                  >
                    <ReceiptIcon className="w-12 h-12 mx-auto mb-3 text-white/10" />
                    <p className="text-lg font-medium mb-1">
                      No invoices found
                    </p>
                    <p className="text-sm">
                      Create your first invoice to get started
                    </p>
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <span className="text-sm font-mono text-white/80">
                        {invoice.invoiceNumber}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={invoice.status}
                        onChange={(e) =>
                          updateStatus.mutate({
                            id: invoice.id,
                            status: e.target.value as
                              | "draft"
                              | "sent"
                              | "paid"
                              | "overdue"
                              | "cancelled",
                          })
                        }
                        className={`text-xs font-medium capitalize px-2.5 py-1 rounded-full border-0 cursor-pointer outline-none ${statusColors[invoice.status]} appearance-none`}
                      >
                        {statusFilters
                          .filter((s) => s.value)
                          .map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="py-4 px-4 text-sm text-white/50">
                      {invoice.issueDate
                        ? format(new Date(invoice.issueDate), "MMM d, yyyy")
                        : "-"}
                    </td>
                    <td className="py-4 px-4 text-sm text-white/50">
                      {invoice.dueDate
                        ? format(new Date(invoice.dueDate), "MMM d, yyyy")
                        : "-"}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-right">
                      <span className="text-[#d0ff59]">
                        ${Number(invoice.total).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/invoices/${invoice.id}`)}
                          className="text-white/40 hover:text-white hover:bg-white/5 h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to delete this invoice?"
                              )
                            ) {
                              deleteInvoice.mutate({ id: invoice.id });
                            }
                          }}
                          className="text-white/40 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <span className="text-sm text-white/40">
              Showing {(page - 1) * 20 + 1} -{" "}
              {Math.min(page * 20, total)} of {total}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="text-white/60 hover:text-white disabled:opacity-30"
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page * 20 >= total}
                className="text-white/60 hover:text-white disabled:opacity-30"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReceiptIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
      <path d="M16 8h-6" />
      <path d="M16 12h-6" />
      <path d="M16 16h-6" />
    </svg>
  );
}
