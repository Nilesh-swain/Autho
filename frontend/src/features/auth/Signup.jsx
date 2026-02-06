import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signup(formData);
      if (result.success) {
        // Store email for the OTP verification page
        sessionStorage.setItem("verifyEmail", formData.email);
        navigate("/verify-otp");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Connection to neural core failed.");
    } finally {
      setLoading(false);
    }
  };

  // FIX: Redirects browser to backend for Google OAuth
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="h-screen w-screen flex bg-[#020617] text-white overflow-hidden">
      {/* LEFT IMAGE PANEL */}
      <div className="hidden lg:flex w-1/2 h-full relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/80" />
        <div className="relative z-10 flex flex-col justify-center px-16 max-w-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-black italic">Nova.AI</span>
          </div>
          <h1 className="text-5xl font-black leading-tight">
            Build products <br />
            <span className="text-indigo-400">people trust.</span>
          </h1>
          <p className="mt-6 text-slate-300 max-w-md text-lg">
            Join a focused community of developers building scalable,
            intelligent systems with clarity.
          </p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center overflow-auto px-6 py-12">
        <div className="w-full max-w-md bg-[#0e1325] border border-white/20 rounded-3xl p-10 shadow-2xl flex flex-col">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black leading-snug text-white">
              Create your account
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              It takes less than a minute.
            </p>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                required
                name="name"
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#161b2e] border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition placeholder:text-slate-400"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                required
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#161b2e] border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition placeholder:text-slate-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                required
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full bg-[#161b2e] border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition placeholder:text-slate-400"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-bold transition shadow-lg shadow-indigo-600/50 active:scale-[0.97] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create account <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-slate-500 text-xs">
            <span className="flex-1 h-px bg-slate-700" /> or{" "}
            <span className="flex-1 h-px bg-slate-700" />
          </div>

          {/* UPDATED: Google Button with handler */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-slate-700 bg-[#161b2e] py-3.5 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-[#1f2840] transition text-white"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              className="w-5 h-5"
              alt="Google"
            />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white font-semibold hover:text-indigo-400"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
