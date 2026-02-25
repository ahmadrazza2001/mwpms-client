import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-3 py-2 text-sm ${isActive ? "bg-brand-500 text-white" : "text-slate-300 hover:bg-slate-800"
  }`;

export const RoleSidebarLayout = ({ role }: { role: UserRole }) => {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems =
    role === "counsellor"
      ? [
        { to: "/counsellor/dashboard", label: "Dashboard" },
        { to: "/counsellor/programs", label: "Programs" },
      ]
      : [
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/users", label: "Users" },
      ];

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex h-full flex-col">
      <div className="mb-5 border-b border-slate-800 pb-4">
        <p className="text-sm text-slate-400">Signed in as</p>
        <p className="text-base font-semibold">{user?.name}</p>
        <p className="text-xs text-slate-400">{user?.email}</p>
      </div>

      <nav className={`gap-2 ${mobile ? "grid grid-cols-1" : "grid grid-cols-2 lg:grid-cols-1"}`}>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setDrawerOpen(false)}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button className="mt-auto w-full bg-red-600 text-white hover:bg-red-700" onClick={logout}>
        Logout
      </button>
    </div>
  );

  return (
    <div className="h-[calc(100dvh-1rem)] w-full overflow-hidden sm:h-[calc(100dvh-2rem)] md:h-[calc(100dvh-3rem)]">
      <header className="mb-3 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 lg:hidden">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-slate-400">{user?.email}</p>
        </div>
        <button
          aria-label="Open menu"
          className="rounded-md bg-slate-700 p-2 text-white hover:bg-slate-600"
          onClick={() => setDrawerOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 100 2h12a1 1 0 100-2H4z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </header>

      {drawerOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setDrawerOpen(false)} />
          <aside className="fixed left-0 top-0 z-50 h-full w-72 border-r border-slate-800 bg-slate-950 p-4 lg:hidden">
            <SidebarContent mobile />
          </aside>
        </>
      )}

      <div className="grid h-[calc(100%-3.5rem)] w-full gap-3 lg:h-full lg:grid-cols-[260px_1fr]">
        <aside className="hidden h-full rounded-xl border border-slate-800 bg-slate-900/60 p-4 lg:block">
          <SidebarContent />
        </aside>

        <section className="h-full w-full overflow-y-auto rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
          <Outlet />
        </section>
      </div>
    </div>
  );
};
