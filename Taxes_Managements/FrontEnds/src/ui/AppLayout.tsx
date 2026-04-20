import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useLogin } from './loginContext';

export default function AppLayout() {
  const { user, logout, isAuthenticated, isLoading } = useLogin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 sticky top-0 h-screen z-50">
        <div className="p-6 border-b border-stone-100 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">account_balance</span>
          <h1 className="font-['Public_Sans'] font-black text-lg text-primary tracking-tight">
            Autorité
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarNav user={user} />
        </nav>

        <div className="p-4 border-t border-stone-100">
          <div className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-stone-100">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border border-primary/10">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDr7illqNsP7B3YZWHzcOUCXQYCZ3S3iwBYwiI8-apqLpSFyAMYTd3eGpmTeboEDwUcniUXZCtnU7WE8VDCEsi0j_rWHqXo8Cr1_KarztUShUikfzQva1u8NhbQ3iJJpdRdULaTg1oAyfZZ7n2cbajAc2H-IRdlRH7k4DMBDxwU_d1VVgC3U3X0fIp88BtjRa2ik440tlweS_N4U_fJNA3lA0urwJFBIdWyi-4no62S0OARO4rzscKcoH706IASO7mT8Jfc0EsEymc" 
                alt="Profil" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-on-surface truncate">{user?.full_name}</p>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="text-stone-400 hover:text-error transition-colors">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* TopAppBar - Mobile Only */}
        <header className="md:hidden bg-white sticky top-0 z-50 flex justify-between items-center px-6 py-4 w-full shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">account_balance</span>
            <h1 className="font-['Public_Sans'] font-black text-xl text-primary tracking-tight">
              Autorité
            </h1>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center p-2 rounded-xl text-error bg-error/5 border border-error/10"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 pb-24 md:pb-0 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* BottomNavBar - Mobile Only */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-2 pb-6 pt-2 bg-white/85 backdrop-blur-xl z-50 rounded-t-xl shadow-[0_-8px_24px_rgba(27,28,28,0.06)] border-t border-stone-200/20 overflow-x-auto">
          <MobileNav user={user} />
        </nav>
      </div>
    </div>
  );
}

function SidebarNav({ user }: { user: any }) {
  const commonClasses = "flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm";
  const activeClasses = "bg-primary text-white shadow-md";
  const inactiveClasses = "text-stone-500 hover:bg-stone-50 hover:text-primary";

  const items = getNavItems(user);

  return (
    <>
      {items.map(item => (
        <NavLink 
          key={item.to} 
          to={item.to} 
          className={({ isActive }) => `${commonClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </>
  );
}

function MobileNav({ user }: { user: any }) {
  const items = getNavItems(user);

  return (
    <>
      {items.map(item => (
        <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
      ))}
    </>
  );
}

function getNavItems(user: any) {
  const items = [];
  if (user?.role === 'Autorité Locale') {
    items.push(
      { to: "/dashboard", icon: "dashboard", label: "Tableau" },
      { to: "/collecte", icon: "payments", label: "Collecte" },
      { to: "/vendeurs", icon: "groups", label: "Vendeurs" },
      { to: "/membres", icon: "person_search", label: "Membres" },
      { to: "/taxes", icon: "settings_suggest", label: "Taxes" },
      { to: "/signalements", icon: "report_problem", label: "Signalements" }
    );
  } else if (user?.role === 'Agent de Collecte') {
    items.push({ to: "/collecte", icon: "payments", label: "Collecte" });
  } else if (user?.role === 'Vendeur') {
    items.push(
      { to: "/vendeurs", icon: "groups", label: "Vendeurs" },
      { to: "/signalements", icon: "report_problem", label: "Signalements" }
    );
  }
  return items;
}

function NavItem({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex flex-col items-center justify-center p-2 min-w-[64px] transition-all active:scale-90
        ${isActive 
          ? 'text-primary' 
          : 'text-stone-400 hover:text-stone-600'}
      `}
    >
      {({ isActive }) => (
        <>
          <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-primary/10' : ''}`}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter mt-1 truncate w-full text-center">
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

