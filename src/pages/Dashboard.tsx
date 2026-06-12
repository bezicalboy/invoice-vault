import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  DollarSign,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  draft: "bg-white/10 text-white/60",
  sent: "bg-blue-500/10 text-blue-400",
  paid: "bg-[#d0ff59]/10 text-[#d0ff59]",
  overdue: "bg-red-500/10 text-red-400",
  cancelled: "bg-white/5 text-white/30",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  // Prepare chart data
  const barData =
    stats?.monthlyRevenue.map((m) => ({
      month: format(new Date(m.month + "-01"), "MMM"),
      amount: m.amount,
    })) || [];

  const pieData = [
    { name: "Paid", value: stats?.totalRevenue || 0, color: "#d0ff59" },
    {
      name: "Outstanding",
      value: stats?.outstandingAmount || 0,
      color: "#3b82f6",
    },
    { name: "Overdue", value: stats?.overdueAmount || 0, color: "#ef4444" },
  ];

  const summaryCards = [
    {
      title: "Total Revenue",
      value: stats ? `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00",
      change: "+12.5%",
      up: true,
      icon: DollarSign,
      accent: "#d0ff59",
    },
    {
      title: "Outstanding",
      value: stats ? `$${stats.outstandingAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00",
      change: "+3.2%",
      up: false,
      icon: Clock,
      accent: "#3b82f6",
    },
    {
      title: "Overdue",
      value: stats ? `$${stats.overdueAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00",
      change: "-8.1%",
      up: true,
      icon: AlertTriangle,
      accent: "#ef4444",
    },
    {
      title: "Total Invoices",
      value: stats ? stats.totalInvoices.toString() : "0",
      change: "+24",
      up: true,
      icon: Receipt,
      accent: "#a78bfa",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-6 h-6 border-2 border-[#d0ff59] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Dashboard</h1>
          <p className="text-white/50 text-sm mt-1">
            Overview of your business finances
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

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="p-5 rounded-2xl bg-[#111] border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${card.accent}15` }}
              >
                <card.icon
                  className="w-5 h-5"
                  style={{ color: card.accent }}
                />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  card.up ? "text-[#d0ff59]" : "text-red-400"
                }`}
              >
                {card.up ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {card.change}
              </div>
            </div>
            <div className="text-2xl font-light mb-1">{card.value}</div>
            <div className="text-sm text-white/50">{card.title}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#111] border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-medium">Monthly Recurring Revenue</h3>
              <p className="text-sm text-white/50">Revenue over time</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#d0ff59]">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5%</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  formatter={(value: number) =>
                    `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                  }
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {barData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        index === barData.length - 1 ? "#d0ff59" : "#222"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Distribution */}
        <div className="p-6 rounded-2xl bg-[#111] border border-white/5">
          <h3 className="font-medium mb-1">Revenue Distribution</h3>
          <p className="text-sm text-white/50 mb-6">By status</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  formatter={(value: number) =>
                    `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-white/60">{item.name}</span>
                </div>
                <span className="text-sm font-medium">
                  ${item.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="p-6 rounded-2xl bg-[#111] border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-medium">Recent Invoices</h3>
            <p className="text-sm text-white/50">Latest invoice activity</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/invoices")}
            className="text-[#d0ff59] hover:text-[#d0ff59] hover:bg-[#d0ff59]/10"
          >
            View All
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-white/40 uppercase tracking-wider">
                <th className="pb-3 font-medium">Invoice</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium text-right">Amount</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats?.recentInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3">
                    <span className="text-sm font-medium text-white/80">
                      {invoice.invoiceNumber}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        statusColors[invoice.status]
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-white/50">
                    {invoice.issueDate
                      ? format(new Date(invoice.issueDate), "MMM d, yyyy")
                      : "-"}
                  </td>
                  <td className="py-3 text-sm font-medium text-right">
                    ${Number(invoice.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                      className="text-white/40 hover:text-white hover:bg-white/5 h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {(!stats?.recentInvoices || stats.recentInvoices.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-white/40">
                    No invoices yet. Create your first invoice to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
