import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import Button from "../components/ui/Button";
import Card, { CardBody } from "../components/ui/Card";
import FormField, { inputClass, invalidInputClass } from "../components/ui/FormField";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name) nextErrors.name = "Full name is required";
    if (!form.email) nextErrors.email = "Email is required";
    if (!form.phone) nextErrors.phone = "Phone number is required";
    if (!form.password) nextErrors.password = "Password is required";
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) nextErrors.phone = "Enter a valid 10 digit mobile number";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    try {
      setLoading(true);
      await axios.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data);
      setErrors({ submit: err.response?.data?.msg || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field) => `${inputClass} ${errors[field] ? invalidInputClass : ""}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-24">
      <Card className="w-full max-w-3xl">
        <CardBody>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-950">Create business account</h1>
            <p className="mt-2 text-sm text-slate-500">Set up your logistics workspace in a minute.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Full name" error={errors.name} required>
                <input name="name" value={form.name} onChange={handleChange} className={fieldClass("name")} placeholder="Your name" />
              </FormField>
              <FormField label="Email address" error={errors.email} required>
                <input name="email" type="email" value={form.email} onChange={handleChange} className={fieldClass("email")} placeholder="you@company.com" />
              </FormField>
              <FormField label="Phone number" error={errors.phone} required>
                <input name="phone" value={form.phone} onChange={handleChange} className={fieldClass("phone")} placeholder="9876543210" />
              </FormField>
              <FormField label="Company">
                <input name="company" value={form.company} onChange={handleChange} className={inputClass} placeholder="Company or store name" />
              </FormField>
              <FormField label="Password" error={errors.password} required>
                <input name="password" type="password" value={form.password} onChange={handleChange} className={fieldClass("password")} placeholder="Create password" />
              </FormField>
              <FormField label="Account type">
                <select name="role" value={form.role} onChange={handleChange} className={inputClass}>
                  <option value="user">Business User</option>
                  <option value="driver">Driver</option>
                </select>
              </FormField>
            </div>

            {errors.submit && <p className="rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-600">{errors.submit}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
              Login
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
