import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiBarChart2,
  FiBox,
  FiCreditCard,
  FiHome,
  FiLogOut,
  FiMapPin,
  FiMenu,
  FiSettings,
  FiTruck,
  FiUser,
  FiX,
} from "react-icons/fi";
import Button from "../ui/Button";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FiBarChart2 },
  { to: "/booking", label: "Create Shipment", icon: FiBox },
  { to: "/tracking", label: "Tracking", icon: FiMapPin },
  { to: "/payment", label: "Payments", icon: FiCreditCard },
  { to: "/profile", label: "Profile", icon: FiUser },
];

export default function AppShell({ children, title = "Dashboard", subtitle }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const navigate = useNavigate();

  const menu = useMemo(() => {
    const roleItems = [];
    if (user?.role === "admin") roleItems.push({ to: "/admin", label: "Admin", icon: FiSettings });
    if (user?.role === "driver") roleItems.push({ to: "/driver", label: "Driver", icon: FiTruck });
    return [...navItems, ...roleItems];
  }, [user]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const Sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-white/80 bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
        <Link to="/" className="text-xl font-bold tracking-tight text-slate-950">
          Swift<span className="text-blue-600">Logix</span>
        </Link>
        <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(false)}>
          <FiX className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <NavLink
          to="/"
          className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
        >
          <FiHome className="h-4 w-4" /> Home
        </NavLink>
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`
            }
            onClick={() => setOpen(false)}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="mb-3 rounded-lg bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-900">{user?.name || "Logistics User"}</p>
          <p className="truncate text-xs text-slate-500">{user?.email || "Operations workspace"}</p>
        </div>
        <Button variant="ghost" className="w-full justify-start text-rose-600 hover:bg-rose-50" onClick={logout}>
          <FiLogOut /> Logout
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#eef6ff_52%,#fff5fb_100%)] text-slate-900">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex">{Sidebar}</div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} aria-label="Close menu" />
          <div className="relative h-full">{Sidebar}</div>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/80 bg-white/75 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)}>
                <FiMenu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-slate-950 sm:text-xl">{title}</h1>
                {subtitle && <p className="hidden text-sm text-slate-500 sm:block">{subtitle}</p>}
              </div>
            </div>
            <Button variant="secondary" onClick={() => navigate("/booking")}>
              <FiBox /> New Shipment
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
