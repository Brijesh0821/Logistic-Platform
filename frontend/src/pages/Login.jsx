import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import Button from "../components/ui/Button";
import Card, { CardBody } from "../components/ui/Card";
import FormField, { inputClass, invalidInputClass } from "../components/ui/FormField";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.email) nextErrors.email = "Email is required";
    if (!form.password) nextErrors.password = "Password is required";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setErrors({ submit: "Invalid credentials. Please check your email and password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-16">
      <Card className="w-full max-w-md">
        <CardBody>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-950">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-500">Sign in to manage shipments and tracking.</p>
          </div>

          <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
            <FormField label="Email address" error={errors.email}>
              <input
                type="email"
                name="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="new-email"
                className={`${inputClass} ${errors.email ? invalidInputClass : ""}`}
              />
            </FormField>

            <FormField label="Password" error={errors.password}>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                className={`${inputClass} ${errors.password ? invalidInputClass : ""}`}
              />
            </FormField>

            {errors.submit && <p className="rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-600">{errors.submit}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            New to SwiftLogix?{" "}
            <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-800">
              Create an account
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
