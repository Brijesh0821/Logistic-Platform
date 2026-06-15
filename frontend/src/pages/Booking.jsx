import { useState } from "react";
import { FiAlertTriangle, FiCamera, FiCheck, FiCheckCircle, FiClock, FiPackage, FiStar, FiTrash2, FiZap } from "react-icons/fi";
import axios from "../utils/axiosConfig";
import { generateInvoice } from "../utils/generateInvoice";
import Button from "../components/ui/Button";
import Card, { CardBody, CardHeader } from "../components/ui/Card";
import FormField, { inputClass, invalidInputClass } from "../components/ui/FormField";

const initialForm = {
  pickupAddress: "", pickupPincode: "", dropAddress: "", dropPincode: "", name: "", phone: "",
  item: "", weight: "", length: "", breadth: "", height: "", service: "Standard", payment: "Prepaid",
};

const required = ["pickupAddress", "pickupPincode", "dropAddress", "dropPincode", "name", "phone", "weight"];
const labels = { pickupAddress: "Pickup address", pickupPincode: "Pickup pincode", dropAddress: "Delivery address", dropPincode: "Delivery pincode", name: "Customer name", phone: "Phone number", weight: "Weight" };

export default function Booking() {
  const [form, setForm] = useState(initialForm);
  const [analysis, setAnalysis] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState("");
  const [parcelImages, setParcelImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
    setErrors((current) => ({ ...current, [e.target.name]: "", submit: "" }));
    setAnalysis(null);
  };

  const validate = (fields = required) => {
    const next = {};
    fields.forEach((field) => { if (!String(form[field] || "").trim()) next[field] = `${labels[field]} is required`; });
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) next.phone = "Enter a valid 10 digit mobile number";
    ["pickupPincode", "dropPincode"].forEach((field) => { if (form[field] && !/^\d{6}$/.test(form[field])) next[field] = "Enter a valid 6 digit pincode"; });
    setErrors(next);
    return !Object.keys(next).length;
  };

  const compare = async () => {
    if (!validate(["pickupPincode", "dropPincode", "weight"])) return;
    try {
      setComparing(true);
      const { data } = await axios.post("/shipping/compare", form);
      setAnalysis(data);
      setSelectedCourier(data.recommendation.courier);
    } catch {
      setErrors({ submit: "Could not compare couriers. Please try again." });
    } finally {
      setComparing(false);
    }
  };

  const addImages = (event) => {
    const files = [...event.target.files].slice(0, 3 - parcelImages.length);
    files.forEach((file) => {
      if (file.size > 1_500_000) {
        setErrors((current) => ({ ...current, images: "Each image must be smaller than 1.5 MB." }));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setParcelImages((current) => [...current, reader.result].slice(0, 3));
      reader.readAsDataURL(file);
    });
  };

  const book = async () => {
    if (!validate()) return;
    if (!analysis) return setErrors((current) => ({ ...current, submit: "Compare couriers before confirming the shipment." }));
    try {
      setLoading(true);
      const quote = analysis.quotes.find((item) => item.courier === selectedCourier);
      const { data } = await axios.post("/booking", {
        ...form,
        from: form.pickupAddress,
        to: form.dropAddress,
        selectedCourier,
        price: quote?.price,
        parcelImages,
      });
      generateInvoice(data);
      setSuccess(`Shipment booked with ${data.selectedCourier}. Tracking ID: ${data.trackingId}`);
      setForm(initialForm);
      setAnalysis(null);
      setParcelImages([]);
    } catch {
      setErrors((current) => ({ ...current, submit: "Booking failed. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (name) => `${inputClass} ${errors[name] ? invalidInputClass : ""}`;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
        <Card className="bg-white/90">
          <CardHeader title="Smart Shipment Booking" subtitle="Compare couriers, verify parcel weight, and predict delivery risk before booking" />
          <CardBody className="space-y-8">
            <section>
              <SectionTitle number="01" title="Route and customer" />
              <div className="grid gap-4 md:grid-cols-2">
                <Field name="pickupAddress" label="Pickup address" form={form} onChange={handleChange} errors={errors} className={fieldClass("pickupAddress")} placeholder="Warehouse, street, city" />
                <Field name="pickupPincode" label="Pickup pincode" form={form} onChange={handleChange} errors={errors} className={fieldClass("pickupPincode")} placeholder="110001" />
                <Field name="dropAddress" label="Delivery address" form={form} onChange={handleChange} errors={errors} className={fieldClass("dropAddress")} placeholder="Customer address, city" />
                <Field name="dropPincode" label="Delivery pincode" form={form} onChange={handleChange} errors={errors} className={fieldClass("dropPincode")} placeholder="400001" />
                <Field name="name" label="Customer name" form={form} onChange={handleChange} errors={errors} className={fieldClass("name")} placeholder="Recipient name" />
                <Field name="phone" label="Phone number" form={form} onChange={handleChange} errors={errors} className={fieldClass("phone")} placeholder="9876543210" />
              </div>
            </section>

            <section>
              <SectionTitle number="02" title="Parcel intelligence" />
              <div className="grid gap-4 md:grid-cols-2">
                <Field name="item" label="Item type" form={form} onChange={handleChange} errors={errors} className={inputClass} placeholder="Electronics, clothes, documents" />
                <Field name="weight" label="Declared weight (kg)" type="number" form={form} onChange={handleChange} errors={errors} className={fieldClass("weight")} placeholder="2.5" />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {["length", "breadth", "height"].map((name) => <Field key={name} name={name} label={`${name[0].toUpperCase() + name.slice(1)} (cm)`} type="number" form={form} onChange={handleChange} errors={errors} className={inputClass} placeholder="20" />)}
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <FormField label="Delivery priority"><select name="service" value={form.service} onChange={handleChange} className={inputClass}><option>Standard</option><option>Express</option></select></FormField>
                <FormField label="Payment mode"><select name="payment" value={form.payment} onChange={handleChange} className={inputClass}><option>Prepaid</option><option>Cash on Delivery</option></select></FormField>
              </div>
            </section>

            <section>
              <SectionTitle number="03" title="Parcel image verification" />
              <div className="grid gap-3 sm:grid-cols-3">
                {parcelImages.map((image, index) => (
                  <div key={image.slice(-20)} className="group relative aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    <img src={image} alt={`Parcel preview ${index + 1}`} className="h-full w-full object-cover" />
                    <button onClick={() => setParcelImages((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="absolute right-2 top-2 rounded-md bg-white p-2 text-rose-600 opacity-0 shadow transition group-hover:opacity-100" aria-label="Remove image"><FiTrash2 /></button>
                  </div>
                ))}
                {parcelImages.length < 3 && <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-blue-300 bg-blue-50 text-center text-sm font-medium text-blue-700 transition hover:bg-blue-100"><FiCamera className="mb-2 h-5 w-5" />Add parcel image<input type="file" accept="image/*" multiple onChange={addImages} className="hidden" /></label>}
              </div>
              {errors.images && <p className="mt-2 text-sm text-rose-600">{errors.images}</p>}
            </section>
          </CardBody>
        </Card>

        <div className="space-y-5">
          <Card className="bg-white/90"><CardBody>
            <div className="flex items-center gap-3"><span className="rounded-lg bg-blue-50 p-3 text-blue-700"><FiZap /></span><div><h2 className="font-semibold text-slate-950">Courier Intelligence</h2><p className="text-sm text-slate-500">Free rule-based decision engine</p></div></div>
            <Button onClick={compare} disabled={comparing} className="mt-5 w-full">{comparing ? "Analyzing..." : "Compare Couriers"}</Button>
            {errors.submit && <p className="mt-3 text-sm font-medium text-rose-600">{errors.submit}</p>}
            {success && <p className="mt-3 flex gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700"><FiCheckCircle className="mt-0.5 shrink-0" />{success}</p>}
          </CardBody></Card>

          {analysis && <IntelligenceSummary analysis={analysis} />}
        </div>
      </div>

      {analysis && (
        <Card>
          <CardHeader title="Multi-Courier Price Comparison" subtitle="Sorted by cheapest option. Best value balances price, reliability, and speed." />
          <CardBody>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {analysis.quotes.map((quote) => (
                <button key={quote.courier} onClick={() => setSelectedCourier(quote.courier)} className={`relative rounded-lg border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${selectedCourier === quote.courier ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white"}`}>
                  {quote.bestValue && <span className="absolute right-3 top-3 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase text-emerald-700">Best value</span>}
                  <p className="font-semibold text-slate-950">{quote.courier}</p>
                  <p className="mt-4 text-2xl font-bold text-slate-950">Rs. {quote.price}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><FiClock /> {quote.estimatedDays}</p>
                  <p className="mt-3 text-xs font-semibold text-slate-500">{quote.reliability}% reliability</p>
                  {selectedCourier === quote.courier && <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-700"><FiCheck /> Selected</span>}
                </button>
              ))}
            </div>
            <Button onClick={book} disabled={loading} className="mt-5 w-full sm:w-auto">{loading ? "Confirming..." : `Book with ${selectedCourier}`}</Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function SectionTitle({ number, title }) {
  return <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase text-slate-600"><span className="rounded bg-slate-950 px-2 py-1 text-[10px] text-white">{number}</span>{title}</h3>;
}

function Field({ name, label, form, onChange, errors, className, placeholder, type = "text" }) {
  return <FormField label={label} error={errors[name]} required={required.includes(name)}><input name={name} type={type} value={form[name]} onChange={onChange} className={className} placeholder={placeholder} min={type === "number" ? "0" : undefined} /></FormField>;
}

function IntelligenceSummary({ analysis }) {
  const { recommendation, weightAnalysis, delayPrediction } = analysis;
  return <Card className="bg-slate-950 text-white"><CardBody className="space-y-5">
    <div><p className="flex items-center gap-2 text-xs font-bold uppercase text-blue-300"><FiStar /> Smart recommendation</p><p className="mt-2 text-xl font-bold">{recommendation.courier}</p><p className="mt-1 text-sm leading-6 text-slate-300">{recommendation.reason}</p><p className="mt-2 text-sm font-bold text-emerald-300">{recommendation.confidence}% confidence</p></div>
    <div className={`rounded-lg p-3 ${weightAnalysis.mismatch ? "bg-amber-400/15 text-amber-200" : "bg-emerald-400/15 text-emerald-200"}`}><p className="flex items-center gap-2 font-semibold">{weightAnalysis.mismatch ? <FiAlertTriangle /> : <FiPackage />}{weightAnalysis.mismatch ? "Possible weight mismatch" : "Weight verified"}</p><p className="mt-1 text-xs">Declared {weightAnalysis.declaredWeight} kg | Volumetric {weightAnalysis.volumetricWeight} kg | Chargeable {weightAnalysis.chargeableWeight} kg</p></div>
    <div><div className="flex justify-between text-sm"><span>On-time probability</span><strong>{delayPrediction.onTimeProbability}%</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${delayPrediction.onTimeProbability}%` }} /></div><p className="mt-2 text-xs text-slate-400">{delayPrediction.riskFactors.join(" • ")}</p></div>
  </CardBody></Card>;
}
