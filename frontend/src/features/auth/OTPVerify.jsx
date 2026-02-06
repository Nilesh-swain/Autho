import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const OTPVerify = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const { verifyOtp, signup } = useAuth();

  const email = sessionStorage.getItem("verifyEmail");

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    
    // Check if the input is a number
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Take only the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input field
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous field on backspace if current field is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleAuthorize = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setError("Input sequence incomplete.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await verifyOtp({ email, otp: otpCode });
      if (result.success) {
        sessionStorage.removeItem("verifyEmail");
        navigate("/overview");
      } else {
        setError(result.message || "Invalid Authorization Code");
      }
    } catch (err) {
      setError("Invalid or expired authorization code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      const result = await signup({ email, resend: true });
      if (result.success) {
        alert("New code dispatched to your terminal.");
      } else {
        setError(result.message);
      }
    } catch {
      setError("Failed to resend code.");
    }
  };

  return (
    <div className="min-h-screen w-screen flex bg-[#020617] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#0e1325] border border-white/20 rounded-3xl p-10 shadow-2xl flex flex-col text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
            <ShieldCheck className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            Verify Terminal
          </h2>
          <p className="text-slate-400 text-sm">
            Sequence sent to{" "}
            <span className="text-indigo-400 font-medium">{email}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-xs font-mono uppercase tracking-widest">
            {error}
          </div>
        )}

        <div className="flex justify-between gap-2 mb-8">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-14 text-2xl font-bold text-center bg-[#161b2e] border border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all outline-none text-white shadow-inner"
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button
          onClick={handleAuthorize}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold tracking-widest uppercase transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Authorize Access"
          )}
        </button>

        <button
          onClick={handleResend}
          className="mt-6 text-xs font-bold text-slate-500 tracking-widest uppercase cursor-pointer hover:text-indigo-400 transition bg-transparent border-none outline-none"
        >
          Resend Code
        </button>

        <p className="mt-8 text-sm text-slate-500">
          Wrong terminal?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-white font-semibold hover:text-indigo-400 transition bg-transparent border-none cursor-pointer"
          >
            Reset Profile
          </button>
        </p>
      </div>
    </div>
  );
};

export default OTPVerify;