import { useState, useEffect } from "react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Receipt,
  Palette,
  Save,
  CheckCircle2,
  Globe,
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const { data: profile, isLoading } = trpc.companyProfile.get.useQuery();

  const upsertProfile = trpc.companyProfile.upsert.useMutation({
    onSuccess: () => {
      utils.companyProfile.get.invalidate();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    taxId: "",
    currency: "USD",
    accentColor: "#d0ff59",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        companyName: profile.companyName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        taxId: profile.taxId || "",
        currency: profile.currency || "USD",
        accentColor: profile.accentColor || "#d0ff59",
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertProfile.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-6 h-6 border-2 border-[#d0ff59] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">Settings</h1>
        <p className="text-white/50 text-sm mt-1">
          Manage your company profile and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Profile */}
        <div className="rounded-2xl bg-[#111] border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#d0ff59]/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#d0ff59]" />
            </div>
            <div>
              <h3 className="font-medium">Company Profile</h3>
              <p className="text-sm text-white/50">
                This information appears on your invoices
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/70 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Company Name
              </Label>
              <Input
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                placeholder="Your Company Inc."
                className="bg-black border-white/10 text-white focus:border-[#d0ff59]/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/70 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Address
              </Label>
              <Input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="123 Business St, City, State 12345"
                className="bg-black border-white/10 text-white focus:border-[#d0ff59]/50"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
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
                  placeholder="billing@company.com"
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
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5" />
                  Tax ID / VAT Number
                </Label>
                <Input
                  value={formData.taxId}
                  onChange={(e) =>
                    setFormData({ ...formData, taxId: e.target.value })
                  }
                  placeholder="XX-XXXXXXX"
                  className="bg-black border-white/10 text-white focus:border-[#d0ff59]/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  Default Currency
                </Label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-lg bg-black border border-white/10 text-white text-sm focus:border-[#d0ff59]/50 focus:outline-none appearance-none"
                >
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="JPY">JPY — Japanese Yen</option>
                  <option value="CAD">CAD — Canadian Dollar</option>
                  <option value="AUD">AUD — Australian Dollar</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl bg-[#111] border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#d0ff59]/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-[#d0ff59]" />
            </div>
            <div>
              <h3 className="font-medium">Appearance</h3>
              <p className="text-sm text-white/50">
                Customize your invoice accent color
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/70">Accent Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) =>
                    setFormData({ ...formData, accentColor: e.target.value })
                  }
                  className="w-10 h-10 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                />
                <Input
                  value={formData.accentColor}
                  onChange={(e) =>
                    setFormData({ ...formData, accentColor: e.target.value })
                  }
                  className="bg-black border-white/10 text-white focus:border-[#d0ff59]/50 w-32 font-mono text-sm"
                />
                <div className="flex gap-2">
                  {["#d0ff59", "#3b82f6", "#ef4444", "#a78bfa", "#f59e0b"].map(
                    (color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, accentColor: color })
                        }
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          formData.accentColor === color
                            ? "border-white scale-110"
                            : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="rounded-2xl bg-[#111] border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#d0ff59]/10 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#d0ff59] text-sm font-medium">
                  {(user?.name || "U")[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-medium">Account</h3>
              <p className="text-sm text-white/50">
                Your login information
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-white/50">Name</span>
              <span className="text-sm font-medium">{user?.name || "-"}</span>
            </div>
            <Separator className="bg-white/5" />
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-white/50">Email</span>
              <span className="text-sm font-medium">{user?.email || "-"}</span>
            </div>
            <Separator className="bg-white/5" />
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-white/50">Role</span>
              <span className="text-sm font-medium capitalize">
                {user?.role || "user"}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={upsertProfile.isPending}
            className="bg-[#d0ff59] text-black hover:bg-[#d0ff59]/90 font-medium px-8"
          >
            {upsertProfile.isPending ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                Saving...
              </span>
            ) : saved ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Saved!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
