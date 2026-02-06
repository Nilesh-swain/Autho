import { useNavigate } from "react-router-dom";
import { 
  LogOut, 
  User, 
  LayoutDashboard, 
  Activity, 
  Shield, 
  Zap, 
  Settings, 
  Search 
} from "lucide-react";

const OverviewPage = () => {
  const navigate = useNavigate();
  
  // Retrieve user data stored during login/verification
  const userData = JSON.parse(localStorage.getItem("user")) || { name: "Architect" };
  const userName = userData.name;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-200 flex">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 border-r border-white/5 bg-[#0e1325]/50 backdrop-blur-xl hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-white">NEURAL.</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active />
          <NavItem icon={<Activity size={20} />} label="Analytics" />
          <NavItem icon={<Zap size={20} />} label="Deployments" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Terminate Session</span>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP BAR */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-md">
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search neural assets..." 
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 outline-none focus:border-indigo-500/50 transition"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">{userName}</p>
              <p className="text-xs text-slate-500">System Level 4</p>
            </div>
            <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center">
              <User className="text-indigo-400" size={20} />
            </div>
          </div>
        </header>

        {/* DASHBOARD GRID */}
        <div className="p-8 overflow-y-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-white mb-2">Neural Dashboard</h1>
            <p className="text-slate-400 uppercase text-xs tracking-[0.2em] font-bold">Welcome back, {userName}. All systems operational.</p>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <StatCard label="Active Nodes" value="24" change="+2.4%" />
            <StatCard label="Memory Usage" value="64%" change="-5.1%" />
            <StatCard label="Security Rank" value="Elite" color="text-indigo-400" />
            <StatCard label="Latency" value="12ms" change="Stable" />
          </div>

          {/* LARGE CONTENT CARD */}
          <div className="bg-[#0e1325] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden">
            <div className="relative z-10 max-w-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Neural Link Active</h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Your connection to the core console is secured with 256-bit encryption. 
                Manage your neural projects and monitor real-time deployments from this centralized hub.
              </p>
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/30">
                Launch Project Console
              </button>
            </div>
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper Components
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
    active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
  }`}>
    {icon}
    <span className="font-semibold">{label}</span>
  </div>
);

const StatCard = ({ label, value, change, color = "text-white" }) => (
  <div className="bg-[#0e1325] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors">
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">{label}</p>
    <div className="flex items-end justify-between">
      <h3 className={`text-3xl font-black ${color}`}>{value}</h3>
      {change && (
        <span className={`text-xs font-bold px-2 py-1 rounded-md bg-white/5 ${change.startsWith('+') ? 'text-emerald-400' : 'text-slate-400'}`}>
          {change}
        </span>
      )}
    </div>
  </div>
);

export default OverviewPage;