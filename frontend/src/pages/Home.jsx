import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiArrowRight, FiDollarSign, FiPackage, FiSearch } from "react-icons/fi";
import Tools from "../components/Tools";
import Testimonials from "../components/Testimonials";
import Stats from "../components/Stats";
import Map from "../components/Map";
import RateCalculator from "../components/RateCalculator";
import Button from "../components/ui/Button";
import DeliveryHeroVisual from "../components/DeliveryHeroVisual";

export default function Home() {
  const navigate = useNavigate();
  const [showCalc, setShowCalc] = useState(false);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f9fbff_0%,#edf4ff_42%,#fff3fb_100%)] text-slate-900">
      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_22%,rgba(37,99,235,0.18),transparent_32%),radial-gradient(circle_at_28%_88%,rgba(236,72,153,0.13),transparent_28%)]" />
        <div className="relative mx-auto grid min-h-[670px] max-w-7xl items-center gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div className="animate-fadeIn">
            <span className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-blue-800 ring-1 ring-blue-100 backdrop-blur">
              Courier aggregator for Indian businesses
            </span>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-[#202124] sm:text-5xl lg:text-6xl">
              Best Courier Aggregator for eCommerce Shipping in India
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600 sm:text-xl">
              Compare couriers, create shipments, track orders, reduce RTO, and manage COD from one professional logistics dashboard.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Button onClick={() => navigate("/booking")} className="px-7 py-3 text-base">
                <FiPackage /> Create Order
              </Button>
              <Button variant="secondary" onClick={() => navigate("/tracking")} className="bg-white/80 px-7 py-3 text-base backdrop-blur">
                <FiSearch /> Track Shipment
              </Button>
              <Button variant="secondary" onClick={() => setShowCalc(!showCalc)} className="bg-white/80 px-7 py-3 text-base backdrop-blur">
                <FiDollarSign /> {showCalc ? "Hide Price" : "Check Price"}
              </Button>
            </div>

            {showCalc && (
              <div className="mt-8 max-w-3xl animate-fadeIn">
                <RateCalculator />
              </div>
            )}
          </div>

          <div className="relative">
            <DeliveryHeroVisual />
          </div>
        </div>

        <div className="relative mx-auto -mt-8 grid max-w-5xl gap-4 px-4 pb-12 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            ["25+", "Courier partners"],
            ["29K+", "Pincodes covered"],
            ["96%", "On-time dispatch"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-white/70 bg-white/75 p-5 text-center shadow-lg shadow-blue-100/50 backdrop-blur">
              <p className="text-3xl font-extrabold text-blue-700">{value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <Tools />
      <Stats />
      <Map />
      <Testimonials />
    </div>
  );
}
