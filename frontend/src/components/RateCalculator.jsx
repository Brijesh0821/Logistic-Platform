import { useMemo, useState } from "react";
import { FiCheck, FiClock, FiMapPin, FiPackage, FiShield, FiTruck } from "react-icons/fi";
import FormField, { inputClass, invalidInputClass } from "./ui/FormField";
import { calculatePrice, money, services, speeds, vehicles } from "../utils/pricing";

export default function RateCalculator() {
  const [form, setForm] = useState({
    pickup: "",
    delivery: "",
    distance: "100",
    weight: "10",
    vehicle: "truck",
    service: "express",
    speed: "priority",
    fragile: false,
    insurance: true,
    cod: false,
  });

  const estimate = useMemo(() => calculatePrice(form), [form]);
  const errors = {
    distance: !estimate.distance ? "Enter a distance above 0 km" : "",
    weight: !estimate.weight ? "Enter a weight above 0 kg" : "",
    vehicle: estimate.weight > estimate.maxKg ? `${vehicles[form.vehicle].label} supports up to ${estimate.maxKg} kg` : "",
  };
  const hasError = Boolean(errors.distance || errors.weight || errors.vehicle);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const bestValue =
    form.service === "standard"
      ? "Standard is best value for this route."
      : `Save around ${money(estimate.total - calculatePrice({ ...form, service: "standard" }).total)} with Standard.`;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-950 p-5 text-white">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-blue-500/20 p-2 text-blue-200">
            <FiTruck className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Smart Price Calculator</h2>
            <p className="text-xs text-slate-300">Live logistics estimate with taxes and surcharges</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:gap-4">
            <FormField label="Pickup location">
              <div className="relative">
                <FiMapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input name="pickup" value={form.pickup} onChange={handleChange} className={`${inputClass} pl-9`} placeholder="Warehouse, city, pincode" />
              </div>
            </FormField>
            <FormField label="Delivery location">
              <div className="relative">
                <FiMapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input name="delivery" value={form.delivery} onChange={handleChange} className={`${inputClass} pl-9`} placeholder="Customer city, pincode" />
              </div>
            </FormField>
            <FormField label="Distance (km)" error={errors.distance}>
              <input name="distance" type="number" min="1" max="10000" value={form.distance} onChange={handleChange} className={`${inputClass} ${errors.distance ? invalidInputClass : ""}`} />
            </FormField>
            <FormField label="Weight (kg)" error={errors.weight || errors.vehicle}>
              <input name="weight" type="number" min="0.1" max="30000" value={form.weight} onChange={handleChange} className={`${inputClass} ${errors.weight || errors.vehicle ? invalidInputClass : ""}`} />
            </FormField>
            <FormField label="Vehicle type">
              <select name="vehicle" value={form.vehicle} onChange={handleChange} className={inputClass}>
                {Object.entries(vehicles).map(([value, item]) => (
                  <option key={value} value={value}>{item.label}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Service type">
              <select name="service" value={form.service} onChange={handleChange} className={inputClass}>
                {Object.entries(services).map(([value, item]) => (
                  <option key={value} value={value}>{item.label}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Delivery speed">
              <select name="speed" value={form.speed} onChange={handleChange} className={inputClass}>
                {Object.entries(speeds).map(([value, item]) => (
                  <option key={value} value={value}>{item.label}</option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid gap-2">
            {[
              ["fragile", "Fragile item", <FiPackage key="fragile-icon" className="h-4 w-4 text-blue-600" />],
              ["insurance", "Insurance", <FiShield key="insurance-icon" className="h-4 w-4 text-blue-600" />],
              ["cod", "COD support", <FiClock key="cod-icon" className="h-4 w-4 text-blue-600" />],
            ].map(([name, label, icon]) => (
              <label
                key={name}
                className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                  form[name] ? "border-blue-200 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-700 hover:border-blue-200"
                }`}
              >
                <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="sr-only" />
                <span className="flex min-w-0 items-center gap-3">
                  <span className="shrink-0 text-blue-600">{icon}</span>
                  <span className="truncate">{label}</span>
                </span>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    form[name] ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white text-transparent"
                  }`}
                >
                  <FiCheck className="h-3.5 w-3.5" />
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 xl:sticky xl:top-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Estimated payable</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <p className="text-3xl font-bold leading-none text-slate-950 sm:text-4xl">{hasError ? "--" : money(estimate.total)}</p>
            <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Best Value</span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{hasError ? "Fix the highlighted inputs to calculate accurately." : bestValue}</p>
          <p className="mt-3 rounded-lg bg-white p-3 text-sm text-slate-700 shadow-sm">
            ETA: <span className="font-semibold text-slate-950">{estimate.eta}</span>
          </p>

          <div className="mt-4 space-y-2">
            {estimate.breakdown.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 text-sm">
                <span className="min-w-0 text-slate-500">{label}</span>
                <span className={`text-right font-semibold ${value < 0 ? "text-emerald-700" : "text-slate-800"}`}>{money(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
