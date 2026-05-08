import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // 🔒 No token → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🛑 No user → login
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch {
    console.error("Invalid user JSON");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // 🛑 Not admin → home
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
}
