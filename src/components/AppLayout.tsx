import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { LOGIN_PATH } from "@/const";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FileText, label: "Invoices", path: "/invoices" },
  { icon: Users, label: "Clients", path: "/clients" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function AppLayout() {
  const { user, isLoading, isAuthenticated, logout } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: LOGIN_PATH,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-[#d0ff59] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 bg-[#111] border-r border-white/10 flex flex-col transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
          <Receipt className="w-6 h-6 text-[#d0ff59] flex-shrink-0" />
          {!collapsed && (
            <span className="text-white font-medium text-lg tracking-tight">
              Invoice Vault
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#d0ff59]/10 text-[#d0ff59]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-2 border-t border-white/10 space-y-1">
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span>Collapse</span>
              </>
            )}
          </button>

          {/* User + Logout */}
          {!collapsed && (
            <div className="px-3 py-2">
              <div className="flex items-center gap-3 mb-2">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || ""}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#d0ff59]/20 flex items-center justify-center text-[#d0ff59] text-sm font-medium">
                    {(user?.name || "U")[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-white/40 text-xs truncate">
                    {user?.email || ""}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full text-white/40 hover:text-red-400 hover:bg-red-400/10 justify-start gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          )}
          {collapsed && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
