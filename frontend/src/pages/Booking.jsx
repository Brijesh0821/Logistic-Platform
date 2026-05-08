import { useState } from "react";
import { FiCheckCircle, FiDollarSign, FiPackage } from "react-icons/fi";
import axios from "../utils/axiosConfig";
import { generateInvoice } from "../utils/generateInvoice";
import Button from "../components/ui/Button";
import Card, { CardBody, CardHeader } from "../components/ui/Card";
import FormField, { inputClass, invalidInputClass } from "../components/ui/FormField";

const initialForm = {
  pickupAddress: "",
  pickupPincode: "",
  dropAddress: "",
  dropPincode: "",
  name: "",
  phone: "",
  item: "",
  weight: "",
  length: "",
  breadth: "",
  height: "",
  service: "Standard",
  payment: "Prepaid",
};

const labels = {
  pickupAddress: "Pickup address",
  pickupPincode: "Pickup pincode",
  dropAddress: "Delivery address",
  dropPincode: "Delivery pincode",
  name: "Customer name",
  phone: "Phone number",
  weight: "Weight",
};

export default function Booking() {
  const [form, setForm] = useState(initialForm);
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", submit: "", price: "" });
    setSuccess("");
  };

  const validate = (fields = ["pickupAddress", "pickupPincode", "dropAddress", "dropPincode", "name", "phone", "weight"]) => {
    const nextErrors = {};
    fields.forEach((field) => {
      if (!String(form[field] || "").trim()) nextErrors[field] = `${labels[field]} is required`;
    });
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) nextErrors.phone = "Enter a valid 10 digit mobile number";
    if (form.pickupPincode && !/^\d{6}$/.test(form.pickupPincode)) nextErrors.pickupPincode = "Enter a valid 6 digit pincode";
    if (form.dropPincode && !/^\d{6}$/.test(form.dropPincode)) nextErrors.dropPincode = "Enter a valid 6 digit pincode";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const calculatePrice = () => {
    if (!validate(["pickupPincode", "dropPincode", "weight"])) return;
    const base = 50;
    const weightCost = Number(form.weight || 0) * 5;
    const distanceCost = Math.abs(Number(form.pickupPincode) - Number(form.dropPincode)) * 0.02;
    const sizeCost = (Number(form.length || 0) * Number(form.breadth || 0) * Number(form.height || 0)) / 5000;
    const serviceCost = form.service === "Express" ? 120 : 0;
    setPrice(Math.round(base + weightCost + distanceCost + sizeCost + serviceCost));
  };

  const handleBooking = async () => {
    if (!validate()) return;
    if (!price) {
      setErrors({ ...errors, price: "Calculate the price before confirming." });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/booking", {
        ...form,
        from: form.pickupAddress,
        to: form.dropAddress,
        price,
      });
      const booking = res.data?.booking || res.data;
      generateInvoice(booking);
      setSuccess(`Shipment booked successfully. Tracking ID: ${booking.trackingId || booking._id || "Generated"}`);
      setForm(initialForm);
      setPrice(null);
    } catch (err) {
      console.log(err);
      setErrors({ ...errors, submit: "Booking failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field) => `${inputClass} ${errors[field] ? invalidInputClass : ""}`;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card className="bg-white/85 backdrop-blur">
        <CardHeader title="Shipment Details" subtitle="Enter pickup, delivery, customer, and parcel information" />
        <CardBody>
          <div className="space-y-8">
            <section>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Pickup and Delivery</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Pickup address" error={errors.pickupAddress} required>
                  <input name="pickupAddress" value={form.pickupAddress} onChange={handleChange} className={fieldClass("pickupAddress")} placeholder="Warehouse, street, city" />
                </FormField>
                <FormField label="Pickup pincode" error={errors.pickupPincode} required>
                  <input name="pickupPincode" value={form.pickupPincode} onChange={handleChange} className={fieldClass("pickupPincode")} placeholder="110001" inputMode="numeric" />
                </FormField>
                <FormField label="Delivery address" error={errors.dropAddress} required>
                  <input name="dropAddress" value={form.dropAddress} onChange={handleChange} className={fieldClass("dropAddress")} placeholder="Customer address" />
                </FormField>
                <FormField label="Delivery pincode" error={errors.dropPincode} required>
                  <input name="dropPincode" value={form.dropPincode} onChange={handleChange} className={fieldClass("dropPincode")} placeholder="400001" inputMode="numeric" />
                </FormField>
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Customer and Parcel</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Customer name" error={errors.name} required>
                  <input name="name" value={form.name} onChange={handleChange} className={fieldClass("name")} placeholder="Recipient name" />
                </FormField>
                <FormField label="Phone number" error={errors.phone} required>
                  <input name="phone" value={form.phone} onChange={handleChange} className={fieldClass("phone")} placeholder="9876543210" inputMode="tel" />
                </FormField>
                <FormField label="Item type">
                  <input name="item" value={form.item} onChange={handleChange} className={inputClass} placeholder="Clothes, electronics, documents" />
                </FormField>
                <FormField label="Weight (kg)" error={errors.weight} required>
                  <input name="weight" type="number" value={form.weight} onChange={handleChange} className={fieldClass("weight")} placeholder="2.5" min="0" />
                </FormField>
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Package and Service</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <FormField label="Length (cm)">
                  <input name="length" value={form.length} onChange={handleChange} className={inputClass} placeholder="30" inputMode="decimal" />
                </FormField>
                <FormField label="Breadth (cm)">
                  <input name="breadth" value={form.breadth} onChange={handleChange} className={inputClass} placeholder="20" inputMode="decimal" />
                </FormField>
                <FormField label="Height (cm)">
                  <input name="height" value={form.height} onChange={handleChange} className={inputClass} placeholder="12" inputMode="decimal" />
                </FormField>
                <FormField label="Service">
                  <select name="service" value={form.service} onChange={handleChange} className={inputClass}>
                    <option value="Standard">Standard Delivery</option>
                    <option value="Express">Express Delivery</option>
                  </select>
                </FormField>
                <FormField label="Payment">
                  <select name="payment" value={form.payment} onChange={handleChange} className={inputClass}>
                    <option value="Prepaid">Prepaid</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                </FormField>
              </div>
            </section>
          </div>
        </CardBody>
      </Card>

      <Card className="h-fit bg-white/85 backdrop-blur">
        <CardBody>
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <FiPackage className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-950">Booking Summary</h2>
              <p className="text-sm text-slate-500">Calculate and confirm the shipment.</p>
            </div>
          </div>

          {price ? (
            <dl className="space-y-3 rounded-xl bg-blue-50/80 p-4">
              <div className="flex justify-between text-sm"><dt className="text-slate-500">Service</dt><dd className="font-semibold">{form.service}</dd></div>
              <div className="flex justify-between text-sm"><dt className="text-slate-500">Payment</dt><dd className="font-semibold">{form.payment}</dd></div>
              <div className="flex justify-between text-sm"><dt className="text-slate-500">Estimated charge</dt><dd className="font-bold text-blue-700">Rs. {price}</dd></div>
            </dl>
          ) : (
            <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/60 p-4 text-sm text-slate-600">
              Add package weight and pincodes to estimate courier charges.
            </div>
          )}

          {errors.price && <p className="mt-3 text-sm font-medium text-rose-600">{errors.price}</p>}
          {errors.submit && <p className="mt-3 text-sm font-medium text-rose-600">{errors.submit}</p>}
          {success && (
            <p className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
              <FiCheckCircle className="mt-0.5 h-4 w-4" /> {success}
            </p>
          )}

          <div className="mt-5 grid gap-3">
            <Button variant="secondary" onClick={calculatePrice} className="w-full bg-white/80">
              <FiDollarSign /> Calculate Price
            </Button>
            <Button onClick={handleBooking} disabled={loading} className="w-full">
              {loading ? "Confirming..." : "Confirm Booking"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
