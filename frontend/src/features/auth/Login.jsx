import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, LogIn, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithToken } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userString = params.get("user");

    // If both exist, we are returning from a Google Auth redirect
    if (token && userString) {
      try {
        // Use decodeURIComponent twice if necessary, but once is standard
        // We wrap it in a clean string check
        const decodedUser = decodeURIComponent(userString);
        const userData = JSON.parse(decodedUser);

        if (userData && token) {
          loginWithToken(userData, token);
          // Small timeout ensures Context has updated state before navigation
          setTimeout(() => navigate("/overview"), 100);
        }
      } catch (err) {
        console.error("Sync error details:", err);
        setError("Neural sync failed. The Google data was corrupted.");
      }
    }
  }, [location, navigate, loginWithToken]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(credentials);
      if (result.success) {
        navigate("/overview");
      } else {
        setError(result.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Authentication failed. Connection to neural core lost.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Direct redirect to backend
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="h-screen w-screen flex bg-[#020617] text-white overflow-hidden">
      {/* LEFT FORM PANEL */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-[#0e1325] border border-white/20 rounded-3xl p-10 shadow-2xl flex flex-col">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/50">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white leading-snug">Login</h2>
            <p className="text-slate-400 text-sm mt-2">Access your Neural Console</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                required
                name="email"
                type="email"
                placeholder="Terminal ID"
                value={credentials.email}
                onChange={handleChange}
                className="w-full bg-[#161b2e] border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500 transition placeholder:text-slate-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                required
                name="password"
                type="password"
                placeholder="Passkey"
                value={credentials.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full bg-[#161b2e] border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500 transition placeholder:text-slate-400"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold transition shadow-lg shadow-indigo-600/50 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Login <LogIn className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-slate-500 text-xs">
            <span className="flex-1 h-px bg-slate-700" /> or <span className="flex-1 h-px bg-slate-700" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-slate-700 bg-[#161b2e] py-3.5 rounded-2xl font-medium flex items-center justify-center gap-3 hover:bg-[#1f2840] transition text-white"
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-slate-400">
            New Architect? <Link to="/signup" className="text-indigo-400 hover:underline">Register Profile</Link>
          </p>
        </div>
      </div>
      
      {/* Right side background panel */}
      <div className="hidden lg:flex w-1/2 h-full relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/80" />
      </div>
    </div>
  );
};

export default Login;