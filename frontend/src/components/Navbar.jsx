import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiUser, FiX } from "react-icons/fi";
import Button from "./ui/Button";

export default function Navbar() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdown(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/booking", label: "Book" },
    { to: "/tracking", label: "Track" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/70 bg-white/75 text-slate-900 shadow-sm shadow-blue-100/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-extrabold tracking-tight">
          Swift<span className="text-blue-600">Logix</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="text-sm font-semibold text-slate-600 hover:text-blue-700">
              {link.label}
            </Link>
          ))}

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setDropdown(!dropdown)}
              >
                <FiUser className="h-4 w-4" />
                {user.name}
              </button>
              {dropdown && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <button onClick={() => navigate("/profile")} className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50">
                    My Profile
                  </button>
                  {user.role === "admin" && (
                    <button onClick={() => navigate("/admin")} className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50">
                      Admin Panel
                    </button>
                  )}
                  {user.role === "driver" && (
                    <button onClick={() => navigate("/driver")} className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50">
                      Driver Panel
                    </button>
                  )}
                  <button onClick={logout} className="block w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="secondary" className="bg-white/80" onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/register")}>Register</Button>
            </div>
          )}
        </div>

        <button className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden" onClick={() => setOpen(!open)}>
          {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700">
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <button onClick={() => navigate("/profile")} className="text-left text-sm font-medium text-slate-700">Profile</button>
                <button onClick={logout} className="text-left text-sm font-medium text-rose-600">Logout</button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => navigate("/login")}>Login</Button>
                <Button onClick={() => navigate("/register")}>Register</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
