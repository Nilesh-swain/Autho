import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./features/auth/Login.jsx";
import Signup from "./features/auth/Signup.jsx";
import OTPVerify from "./features/auth/OTPVerify.jsx";
import OverviewPage from "./features/overviewPage.jsx";

// PRO TIP: Create a wrapper to handle dynamic authentication checks
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>; // Or a proper loading component
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// PRO TIP: Prevent logged-in users from seeing the Login/Signup pages again
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>; // Or a proper loading component
  if (user) return <Navigate to="/overview" replace />;
  return children;
};

const App = () => {
  return (
    <div className="bg-[#020617] min-h-screen text-slate-100 selection:bg-indigo-500/30">
      <Router>
        <Routes>
          {/* PUBLIC ACCESS */}
          <Route
            path="/signup"
            element={
              <PublicRoute>
                {" "}
                <Signup />{" "}
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                {" "}
                <Login />{" "}
              </PublicRoute>
            }
          />
          <Route path="/verify-otp" element={<OTPVerify />} />

          {/* PROTECTED ACCESS */}
          <Route
            path="/overview"
            element={
              <ProtectedRoute>
                <OverviewPage />
              </ProtectedRoute>
            }
          />

          {/* SYSTEM REDIRECTS */}
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
