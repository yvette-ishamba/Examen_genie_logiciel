import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useLogin } from './loginContext';

export default function AppLayout() {
  const { user, logout, isAuthenticated, isLoading } = useLogin();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    // Usually, you'd navigate here, but the AuthProvider update might trigger a re-render/redirect if routes are protected.
    // For now, let's just trigger the clear.
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface pb-24">
      {/* TopAppBar */}
      <header className="bg-white sticky top-0 z-50 flex justify-between items-center px-6 py-4 w-full shadow-sm">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">account_balance</span>
          <h1 className="font-['Public_Sans'] font-black text-xl text-primary tracking-tight">
            L'Autorité Bienveillante
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-on-surface leading-none">{user?.full_name || 'Utilisateur'}</p>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">
                {user?.role === 'Agent local' ? 'Agent de collecte' : (user?.role || 'Agent')}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border-2 border-primary/10">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDr7illqNsP7B3YZWHzcOUCXQYCZ3S3iwBYwiI8-apqLpSFyAMYTd3eGpmTeboEDwUcniUXZCtnU7WE8VDCEsi0j_rWHqXo8Cr1_KarztUShUikfzQva1u8NhbQ3iJJpdRdULaTg1oAyfZZ7n2cbajAc2H-IRdlRH7k4DMBDxwU_d1VVgC3U3X0fIp88BtjRa2ik440tlweS_N4U_fJNA3lA0urwJFBIdWyi-4no62S0OARO4rzscKcoH706IASO7mT8Jfc0EsEymc" 
                alt="Profil Agent" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center justify-center p-2 rounded-xl text-error bg-error/5 hover:bg-error/10 hover:text-error-variant transition-all active:scale-90 border border-error/10"
            title="Déconnexion"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-white/85 backdrop-blur-xl z-50 rounded-t-xl shadow-[0_-8px_24px_rgba(27,28,28,0.06)] border-t border-stone-200/20">
        {(user?.role === 'Autorité Locale') && (
          <>
            <NavItem to="/dashboard" icon="dashboard" label="Tableau" />
            <NavItem to="/collecte" icon="payments" label="Collecte" />
            <NavItem to="/vendeurs" icon="groups" label="Vendeurs" />
            <NavItem to="/membres" icon="person_search" label="Membres" />
            <NavItem to="/taxes" icon="settings_suggest" label="Taxes" />
            <NavItem to="/signalements" icon="report_problem" label="Signalements" />
          </>
        )}
        
        {(user?.role === 'Agent de Collecte') && (
          <NavItem to="/collecte" icon="payments" label="Collecte" />
        )}

        {(user?.role === 'Vendeur') && (
          <>
            <NavItem to="/vendeurs" icon="groups" label="Vendeurs" />
            <NavItem to="/signalements" icon="report_problem" label="Signalements" />
          </>
        )}
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex flex-col items-center justify-center p-3 transition-all active:scale-90
        ${isActive 
          ? 'bg-primary text-white rounded-xl transform -translate-y-1 shadow-md' 
          : 'text-stone-500 hover:text-primary'}
      `}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
        {label}
      </span>
    </NavLink>
  );
}
