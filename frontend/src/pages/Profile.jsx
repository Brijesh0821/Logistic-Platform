import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import Button from "../components/ui/Button";
import Card, { CardBody, CardHeader } from "../components/ui/Card";
import FormField, { inputClass } from "../components/ui/FormField";

export default function Profile() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get("/user/me");
      setForm(res.data);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await axios.put("/user/update", form);
      setMessage("Profile updated successfully.");
    } catch {
      setMessage("Unable to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader title="Account Details" subtitle="Keep your business and contact information current" />
      <CardBody>
        <div className="grid gap-4">
          <FormField label="Full name">
            <input name="name" value={form.name || ""} onChange={handleChange} className={inputClass} />
          </FormField>
          <FormField label="Email address" helper="Email cannot be changed from this screen.">
            <input name="email" value={form.email || ""} disabled className={inputClass} />
          </FormField>
          <FormField label="Phone number">
            <input name="phone" value={form.phone || ""} onChange={handleChange} className={inputClass} />
          </FormField>
          <FormField label="Company">
            <input name="company" value={form.company || ""} onChange={handleChange} className={inputClass} />
          </FormField>
        </div>

        {message && (
          <p className={`mt-4 rounded-lg p-3 text-sm font-medium ${message.includes("success") ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
            {message}
          </p>
        )}

        <Button onClick={handleUpdate} disabled={loading} className="mt-5 w-full sm:w-auto">
          {loading ? "Saving..." : "Update Profile"}
        </Button>
      </CardBody>
    </Card>
  );
}
