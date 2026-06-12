import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Receipt,
  Calendar,
  User,
} from "lucide-react";
import { format } from "date-fns";

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function NewInvoice() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const { data: clients } = trpc.clients.list.useQuery();
  const createInvoice = trpc.invoice.create.useMutation({
    onSuccess: () => {
      utils.invoice.list.invalidate();
      utils.dashboard.stats.invalidate();
      navigate("/invoices");
    },
  });

  const [clientId, setClientId] = useState<number | "">("");
  const [issueDate, setIssueDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [dueDate, setDueDate] = useState(
    format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd")
  );
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;

    const validItems = items.filter(
      (item) => item.description && item.quantity > 0
    );
    if (validItems.length === 0) return;

    createInvoice.mutate({
      clientId: Number(clientId),
      issueDate,
      dueDate,
      items: validItems,
      taxRate,
      notes: notes || undefined,
      currency,
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
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
            Create Invoice
          </h1>
          <p className="text-white/50 text-sm">
            Fill in the details to generate a new invoice
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Row: Client, Dates */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-white/70 flex items-center gap-2">
              <User className="w-4 h-4" />
              Client *
            </Label>
            <select
              value={clientId}
              onChange={(e) => setClientId(Number(e.target.value) || "")}
              required
              className="w-full h-10 px-3 rounded-lg bg-[#111] border border-white/10 text-white text-sm focus:border-[#d0ff59]/50 focus:outline-none appearance-none"
            >
              <option value="">Select a client</option>
              {clients?.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                  {client.company ? ` — ${client.company}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-white/70 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Issue Date *
            </Label>
            <Input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
              className="bg-[#111] border-white/10 text-white focus:border-[#d0ff59]/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white/70 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Due Date *
            </Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="bg-[#111] border-white/10 text-white focus:border-[#d0ff59]/50"
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="rounded-2xl bg-[#111] border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#d0ff59]" />
              Line Items
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addItem}
              className="text-[#d0ff59] hover:text-[#d0ff59] hover:bg-[#d0ff59]/10"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 items-start"
              >
                <div className="col-span-6">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                    required
                    className="bg-black border-white/10 text-white focus:border-[#d0ff59]/50"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Qty"
                    min="0.01"
                    step="0.01"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      updateItem(index, "quantity", parseFloat(e.target.value) || 0)
                    }
                    required
                    className="bg-black border-white/10 text-white focus:border-[#d0ff59]/50"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    min="0"
                    step="0.01"
                    value={item.unitPrice || ""}
                    onChange={(e) =>
                      updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)
                    }
                    required
                    className="bg-black border-white/10 text-white focus:border-[#d0ff59]/50"
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-white/30 hover:text-red-400 hover:bg-red-400/10 h-10 w-10 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tax, Notes, Totals */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/70">Tax Rate (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="bg-[#111] border-white/10 text-white focus:border-[#d0ff59]/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Currency</Label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#111] border border-white/10 text-white text-sm focus:border-[#d0ff59]/50 focus:outline-none appearance-none"
              >
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="JPY">JPY — Japanese Yen</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Notes</Label>
              <Textarea
                placeholder="Additional notes for the client..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="bg-[#111] border-white/10 text-white focus:border-[#d0ff59]/50 resize-none"
              />
            </div>
          </div>

          {/* Totals */}
          <div className="rounded-2xl bg-[#111] border border-white/5 p-6 h-fit">
            <h3 className="font-medium mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Subtotal</span>
                <span className="font-medium">
                  ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">
                  Tax ({taxRate}%)
                </span>
                <span className="font-medium">
                  ${taxAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="text-xl font-light text-[#d0ff59]">
                  ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={createInvoice.isPending}
            className="bg-[#d0ff59] text-black hover:bg-[#d0ff59]/90 font-medium px-8"
          >
            {createInvoice.isPending ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                Creating...
              </span>
            ) : (
              "Create Invoice"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/invoices")}
            className="border-white/20 text-white hover:bg-white/5"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
