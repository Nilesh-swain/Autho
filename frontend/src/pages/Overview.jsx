import { useNavigate } from "react-router-dom";
import { LogOut, User, LayoutDashboard, Settings, Activity } from "lucide-react";

const Overview = () => {
  const navigate = useNavigate();
  
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const userName = userData?.name || "Architect";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-screen bg-[#020617] text-white flex">
      {/* SIDE NAVIGATION */}
      <div className="w-64 border-r border-white/10 flex flex-col p-6 hidden md:flex">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <span className="font-black tracking-tighter text-xl">NOVA.AI</span>
        </div>

        <nav className="flex-1 space-y-2">
          <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl flex items-center gap-3 cursor-pointer">
            <Activity className="w-5 h-5" /> Overview
          </div>
          <div className="p-3 text-slate-400 hover:text-white transition rounded-xl flex items-center gap-3 cursor-pointer">
            <Settings className="w-5 h-5" /> Settings
          </div>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto p-3 text-red-400 hover:bg-red-400/10 rounded-xl flex items-center gap-3 transition"
        >
          <LogOut className="w-5 h-5" /> Terminate Session
        </button>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 lg:p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2">
              Welcome back, <span className="text-indigo-400">{userName}</span>
            </h1>
            <p className="text-slate-400">System status: <span className="text-emerald-500 font-mono">ONLINE</span></p>
          </div>
          
          <div className="w-12 h-12 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center">
            <User className="text-slate-400" />
          </div>
        </header>

        {/* MOCK STATS CARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0e1325] border border-white/10 p-6 rounded-3xl">
            <p className="text-slate-400 text-sm mb-1">Active Projects</p>
            <h3 className="text-3xl font-bold">12</h3>
          </div>
          <div className="bg-[#0e1325] border border-white/10 p-6 rounded-3xl">
            <p className="text-slate-400 text-sm mb-1">Neural Uptime</p>
            <h3 className="text-3xl font-bold font-mono text-indigo-400">99.9%</h3>
          </div>
          <div className="bg-[#0e1325] border border-white/10 p-6 rounded-3xl">
            <p className="text-slate-400 text-sm mb-1">Security Score</p>
            <h3 className="text-3xl font-bold text-emerald-500">A+</h3>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Overview;