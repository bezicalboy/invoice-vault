import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  BarChart3,
  FileText,
  Users,
  CheckCircle2,
} from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: FileText,
      title: "Smart Invoicing",
      description:
        "Create professional invoices in seconds with automatic calculations and customizable templates.",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description:
        "Track revenue, outstanding payments, and cash flow with beautiful interactive charts.",
    },
    {
      icon: Users,
      title: "Client Management",
      description:
        "Organize all your clients in one place with contact details and invoice history.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Bank-grade security with encrypted passwords and secure session management.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Built for speed with instant invoice generation and real-time updates.",
    },
    {
      icon: Globe,
      title: "Multi-Currency",
      description:
        "Support for multiple currencies with automatic conversion and formatting.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Receipt className="w-6 h-6 text-[#d0ff59]" />
            <span className="font-medium text-lg tracking-tight">
              Invoice Vault
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-white/70 hover:text-white hover:bg-white/5"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate("/login")}
              className="bg-[#d0ff59] text-black hover:bg-[#d0ff59]/90 font-medium"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(208,255,89,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(208,255,89,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d0ff59]/10 border border-[#d0ff59]/20 text-[#d0ff59] text-sm mb-8">
              <Zap className="w-4 h-4" />
              <span>Free for small businesses</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight mb-6">
              Invoicing made
              <br />
              <span className="text-gradient font-medium">effortless.</span>
            </h1>

            <p className="text-lg text-white/60 leading-relaxed max-w-xl mb-10">
              Create, send, and track professional invoices. Manage clients,
              monitor cash flow, and get paid faster — all from one powerful
              dashboard.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="bg-[#d0ff59] text-black hover:bg-[#d0ff59]/90 font-medium px-8 h-12 text-base"
              >
                Start Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")}
                className="border-white/20 text-white hover:bg-white/5 hover:border-white/30 h-12 px-8 text-base"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/10 bg-[#111]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "50K+", label: "Invoices Created" },
              { value: "$12M+", label: "Revenue Processed" },
              { value: "10K+", label: "Active Users" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-light text-[#d0ff59] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              Everything you need to{" "}
              <span className="text-gradient">get paid.</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              A complete invoicing toolkit designed for modern businesses. From
              creation to collection, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-[#111] border border-white/5 hover:border-[#d0ff59]/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#d0ff59]/10 flex items-center justify-center mb-4 group-hover:bg-[#d0ff59]/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-[#d0ff59]" />
                </div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 p-12 md:p-16 overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#d0ff59]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative max-w-xl">
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
                Ready to streamline your{" "}
                <span className="text-gradient">billing?</span>
              </h2>
              <p className="text-white/50 mb-8">
                Join thousands of businesses using Invoice Vault to manage their
                invoicing. Start free, no credit card required.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "Unlimited invoices",
                  "Client management",
                  "Real-time analytics",
                  "Secure cloud storage",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#d0ff59]" />
                    <span className="text-white/70">{item}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="bg-[#d0ff59] text-black hover:bg-[#d0ff59]/90 font-medium px-8 h-12 text-base"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#d0ff59]" />
            <span className="text-white/60 text-sm">Invoice Vault</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <span className="hover:text-white/60 cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">
              Terms
            </span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">
              Security
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#d0ff59] animate-pulse" />
            <span className="text-[#d0ff59] text-sm">SYSTEM OPTIMAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
