import { useParams, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Printer,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { format } from "date-fns";

const statusConfig: Record<
  string,
  { color: string; bg: string; icon: typeof CheckCircle2 }
> = {
  draft: { color: "text-white/60", bg: "bg-white/10", icon: FileText },
  sent: { color: "text-blue-400", bg: "bg-blue-500/10", icon: Send },
  paid: { color: "text-[#d0ff59]", bg: "bg-[#d0ff59]/10", icon: CheckCircle2 },
  overdue: { color: "text-red-400", bg: "bg-red-500/10", icon: AlertTriangle },
  cancelled: { color: "text-white/30", bg: "bg-white/5", icon: Clock },
};

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const invoiceId = Number(id);

  const { data: invoice, isLoading } = trpc.invoice.getById.useQuery(
    { id: invoiceId },
    { enabled: !!invoiceId }
  );
  const utils = trpc.useUtils();

  const updateStatus = trpc.invoice.updateStatus.useMutation({
    onSuccess: () => {
      utils.invoice.getById.invalidate({ id: invoiceId });
      utils.invoice.list.invalidate();
      utils.dashboard.stats.invalidate();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-6 h-6 border-2 border-[#d0ff59] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/40">
        <FileText className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-medium mb-2">Invoice not found</h2>
        <Button
          variant="ghost"
          onClick={() => navigate("/invoices")}
          className="text-[#d0ff59] hover:text-[#d0ff59] hover:bg-[#d0ff59]/10"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Invoices
        </Button>
      </div>
    );
  }

  const status = statusConfig[invoice.status] || statusConfig.draft;
  const StatusIcon = status.icon;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/invoices")}
            className="text-white/50 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-medium tracking-tight">
              {invoice.invoiceNumber}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${status.bg} ${status.color}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {invoice.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {invoice.status === "draft" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateStatus.mutate({ id: invoice.id, status: "sent" })
              }
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            >
              <Send className="w-4 h-4 mr-1" />
              Mark Sent
            </Button>
          )}
          {invoice.status === "sent" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateStatus.mutate({ id: invoice.id, status: "paid" })
              }
              className="border-[#d0ff59]/30 text-[#d0ff59] hover:bg-[#d0ff59]/10"
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Mark Paid
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="border-white/20 text-white hover:bg-white/5"
          >
            <Printer className="w-4 h-4 mr-1" />
            Print
          </Button>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="rounded-2xl bg-[#111] border border-white/5 p-8 md:p-12 print:bg-white print:text-black print:border-black/20">
        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#d0ff59]/10 flex items-center justify-center print:bg-black/10">
                <FileText className="w-5 h-5 text-[#d0ff59] print:text-black" />
              </div>
              <span className="text-xl font-medium">Invoice Vault</span>
            </div>
            <p className="text-sm text-white/50 print:text-black/50">
              Professional invoicing platform
            </p>
          </div>
          <div className="text-left md:text-right">
            <h2 className="text-3xl font-light text-[#d0ff59] print:text-black mb-2">
              INVOICE
            </h2>
            <p className="text-sm text-white/50 print:text-black/50 font-mono">
              {invoice.invoiceNumber}
            </p>
          </div>
        </div>

        {/* Bill To / Invoice Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/40 print:text-black/40 mb-2">
              Bill To
            </p>
            <p className="font-medium text-lg">{invoice.client?.name}</p>
            {invoice.client?.company && (
              <p className="text-white/60 print:text-black/60">
                {invoice.client.company}
              </p>
            )}
            {invoice.client?.email && (
              <p className="text-white/50 print:text-black/50 text-sm">
                {invoice.client.email}
              </p>
            )}
            {invoice.client?.address && (
              <p className="text-white/50 print:text-black/50 text-sm mt-1">
                {invoice.client.address}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/40 print:text-black/40 mb-1">
                Issue Date
              </p>
              <p className="font-medium">
                {invoice.issueDate
                  ? format(new Date(invoice.issueDate), "MMM d, yyyy")
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/40 print:text-black/40 mb-1">
                Due Date
              </p>
              <p className="font-medium">
                {invoice.dueDate
                  ? format(new Date(invoice.dueDate), "MMM d, yyyy")
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/40 print:text-black/40 mb-1">
                Status
              </p>
              <p className={`font-medium capitalize ${status.color} print:text-black`}>
                {invoice.status}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/40 print:text-black/40 mb-1">
                Currency
              </p>
              <p className="font-medium">{invoice.currency}</p>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full mb-12">
          <thead>
            <tr className="border-b border-white/10 print:border-black/20">
              <th className="text-left pb-3 text-xs uppercase tracking-wider text-white/40 print:text-black/40 font-medium">
                Description
              </th>
              <th className="text-right pb-3 text-xs uppercase tracking-wider text-white/40 print:text-black/40 font-medium">
                Qty
              </th>
              <th className="text-right pb-3 text-xs uppercase tracking-wider text-white/40 print:text-black/40 font-medium">
                Unit Price
              </th>
              <th className="text-right pb-3 text-xs uppercase tracking-wider text-white/40 print:text-black/40 font-medium">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 print:divide-black/10">
            {invoice.items?.map((item) => (
              <tr key={item.id}>
                <td className="py-4 text-sm">{item.description}</td>
                <td className="py-4 text-sm text-right">
                  {Number(item.quantity).toFixed(2)}
                </td>
                <td className="py-4 text-sm text-right">
                  ${Number(item.unitPrice).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="py-4 text-sm text-right font-medium">
                  ${Number(item.amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-full max-w-sm space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/50 print:text-black/50">Subtotal</span>
              <span className="font-medium">
                ${Number(invoice.subtotal).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50 print:text-black/50">
                Tax ({Number(invoice.taxRate)}%)
              </span>
              <span className="font-medium">
                ${Number(invoice.taxAmount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="border-t border-white/10 print:border-black/20 pt-3 flex justify-between">
              <span className="font-medium text-lg">Total</span>
              <span className="text-2xl font-light text-[#d0ff59] print:text-black">
                ${Number(invoice.total).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t border-white/10 print:border-black/20 pt-8">
            <p className="text-xs uppercase tracking-wider text-white/40 print:text-black/40 mb-2">
              Notes
            </p>
            <p className="text-sm text-white/60 print:text-black/60 whitespace-pre-wrap">
              {invoice.notes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 print:border-black/20 text-center">
          <p className="text-xs text-white/30 print:text-black/30">
            Thank you for your business. Payment is due by the due date.
          </p>
        </div>
      </div>
    </div>
  );
}
