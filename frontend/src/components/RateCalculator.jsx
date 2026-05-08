import { useState } from "react";
import Button from "./ui/Button";
import FormField, { inputClass } from "./ui/FormField";

export default function RateCalculator() {
  const [form, setForm] = useState({ distance: "", weight: "", vehicle: "mini", service: "standard" });
  const [price, setPrice] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const calculate = () => {
    if (!form.distance || !form.weight) {
      setError("Distance and weight are required.");
      return;
    }

    const vehicleRate = { mini: 10, truck: 20, container: 30 };
    const serviceMultiplier = { standard: 1, express: 1.5 };
    const cost = (100 + form.distance * vehicleRate[form.vehicle] + form.weight * 3) * serviceMultiplier[form.service];
    setPrice(Math.round(cost + cost * 0.18));
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-950">Smart Price Calculator</h2>

      <div className="grid gap-3">
        <FormField label="Distance (km)">
          <input name="distance" value={form.distance} onChange={handleChange} className={inputClass} placeholder="450" inputMode="decimal" />
        </FormField>
        <FormField label="Weight (kg)">
          <input name="weight" value={form.weight} onChange={handleChange} className={inputClass} placeholder="12" inputMode="decimal" />
        </FormField>
        <FormField label="Vehicle">
          <select name="vehicle" value={form.vehicle} onChange={handleChange} className={inputClass}>
            <option value="mini">Mini Truck</option>
            <option value="truck">Truck</option>
            <option value="container">Container</option>
          </select>
        </FormField>
        <FormField label="Service">
          <select name="service" value={form.service} onChange={handleChange} className={inputClass}>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
          </select>
        </FormField>
      </div>

      {error && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-600">{error}</p>}

      <Button onClick={calculate} className="mt-4 w-full">
        Calculate
      </Button>

      {price && <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-center text-lg font-bold text-emerald-700">Rs. {price}</div>}
    </div>
  );
}
