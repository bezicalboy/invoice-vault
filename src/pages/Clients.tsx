import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  X,
  Pencil,
  Trash2,
  Mail,
  Building2,
  Phone,
  MapPin,
  Users,
} from "lucide-react";

interface ClientFormData {
  name: string;
  email: string;
  company: string;
  address: string;
  phone: string;
}

export default function Clients() {
  const utils = trpc.useUtils();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    email: "",
    company: "",
    address: "",
    phone: "",
  });

  const { data: clients, isLoading } = trpc.clients.list.useQuery(
    search ? { search } : undefined
  );

  const createClient = trpc.clients.create.useMutation({
    onSuccess: () => {
      utils.clients.list.invalidate();
      resetForm();
    },
  });

  const updateClient = trpc.clients.update.useMutation({
    onSuccess: () => {
      utils.clients.list.invalidate();
      resetForm();
    },
  });

  const deleteClient = trpc.clients.delete.useMutation({
    onSuccess: () => {
      utils.clients.list.invalidate();
    },
  });

  const resetForm = () => {
    setFormData({ name: "", email: "", company: "", address: "", phone: "" });
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (client: {
    id: number;
    name: string;
    email: string | null;
    company: string | null;
    address: string | null;
    phone: string | null;
  }) => {
    setFormData({
      name: client.name,
      email: client.email || "",
      company: client.company || "",
      address: client.address || "",
      phone: client.phone || "",
    });
    setEditingId(client.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      updateClient.mutate({
        id: editingId,
        ...formData,
      });
    } else {
      createClient.mutate(formData);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Clients</h1>
          <p className="text-white/50 text-sm mt-1">
            {clients?.length || 0} total client
            {clients?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-[#d0ff59] text-black hover:bg-[#d0ff59]/90 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-[#111] border-white/10 text-white placeholder:text-white/30 focus:border-[#d0ff59]/50"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-2xl bg-[#111] border border-white/5 p-6 mb-6">
          <h3 className="font-medium mb-4">
            {editingId ? "Edit Client" : "New Client"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70">
                  Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Client name"
                  className="bg-black border-white/10 text-white focus:border-[#d0ff59]/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="client@example.com"
                  className="bg-black border-white/10 text-white focus:border-[#d0ff59]/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  Company
                </Label>
                <Input
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="Company name"
                  className="bg-black border-white/10 text-white focus:border-[#d0ff59]/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Phone
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 (555) 000-0000"
                  className="bg-black border-white/10 text-white focus:border-[#d0ff59]/50"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-white/70 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Address
                </Label>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Full address"
                  className="bg-black border-white/10 text-white focus:border-[#d0ff59]/50"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={
                  createClient.isPending || updateClient.isPending
                }
                className="bg-[#d0ff59] text-black hover:bg-[#d0ff59]/90 font-medium"
              >
                {editingId ? "Update" : "Create"} Client
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="border-white/20 text-white hover:bg-white/5"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Client List */}
      <div className="rounded-2xl bg-[#111] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                <th className="pb-3 pt-4 px-6 font-medium">Client</th>
                <th className="pb-3 pt-4 px-4 font-medium">Company</th>
                <th className="pb-3 pt-4 px-4 font-medium">Contact</th>
                <th className="pb-3 pt-4 px-6 font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="py-4 px-6">
                      <div className="animate-pulse bg-white/5 h-8 rounded" />
                    </td>
                  </tr>
                ))
              ) : clients?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-white/40">
                    <Users className="w-12 h-12 mx-auto mb-3 text-white/10" />
                    <p className="text-lg font-medium mb-1">
                      {search ? "No clients found" : "No clients yet"}
                    </p>
                    <p className="text-sm">
                      {search
                        ? "Try a different search term"
                        : "Add your first client to get started"}
                    </p>
                  </td>
                </tr>
              ) : (
                clients?.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#d0ff59]/10 flex items-center justify-center text-[#d0ff59] text-sm font-medium flex-shrink-0">
                          {client.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium">{client.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-white/50">
                      {client.company || "-"}
                    </td>
                    <td className="py-4 px-4 text-sm text-white/50">
                      {client.email || client.phone || "-"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(client)}
                          className="text-white/40 hover:text-white hover:bg-white/5 h-8 w-8 p-0"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (
                              confirm(
                                "Delete this client? This cannot be undone."
                              )
                            ) {
                              deleteClient.mutate({ id: client.id });
                            }
                          }}
                          className="text-white/40 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
