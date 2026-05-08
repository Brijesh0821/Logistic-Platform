import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Booking from "./pages/Booking";
import Tracking from "./pages/Tracking";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Payment from "./pages/Payment";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Driver from "./pages/Driver";
import Profile from "./pages/Profile";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AppShell from "./components/layout/AppShell";

const appPageMeta = {
  "/dashboard": ["Dashboard", "Monitor bookings, revenue, and shipment performance"],
  "/booking": ["Create Shipment", "Book parcels with price estimation and invoice generation"],
  "/tracking": ["Track Shipment", "Follow real-time status and driver movement"],
  "/payment": ["Payments", "Complete booking payments securely"],
  "/profile": ["Profile", "Manage account and business details"],
  "/admin": ["Admin Operations", "Manage statuses and driver assignment"],
  "/driver": ["Driver Workspace", "Start live location sharing for assigned trips"],
};

function ShellRoute({ children }) {
  const location = useLocation();
  const [title, subtitle] = appPageMeta[location.pathname] || ["Workspace", "Logistics operations"];

  return (
    <AppShell title={title} subtitle={subtitle}>
      {children}
    </AppShell>
  );
}

function AppContent() {
  const location = useLocation();
  const isAppPage = Boolean(appPageMeta[location.pathname]);

  return (
    <>
      {!isAppPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route
          path="/tracking"
          element={
            <ShellRoute>
              <Tracking />
            </ShellRoute>
          }
        />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        <Route
          path="/driver"
          element={
            <ShellRoute>
              <Driver />
            </ShellRoute>
          }
        />

        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <ShellRoute>
                <Booking />
              </ShellRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ShellRoute>
                <Dashboard />
              </ShellRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <ShellRoute>
                <Payment />
              </ShellRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ShellRoute>
                <Profile />
              </ShellRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <ShellRoute>
                <Admin />
              </ShellRoute>
            </AdminRoute>
          }
        />
      </Routes>

      <Chatbot />
      {!isAppPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
