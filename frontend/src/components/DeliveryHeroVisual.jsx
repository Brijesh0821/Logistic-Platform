import { FiCheckCircle, FiMapPin } from "react-icons/fi";
import deliveryAgent from "../assets/delivery-agent.png";

export default function DeliveryHeroVisual() {
  return (
    <div className="relative mx-auto h-[430px] w-full max-w-[600px] sm:h-[540px]">
      <div className="absolute inset-x-10 bottom-2 h-16 rounded-full bg-blue-900/15 blur-3xl" />
      <div className="absolute right-2 top-8 h-[360px] w-[360px] rounded-full bg-blue-500/95 sm:h-[430px] sm:w-[430px]" />
      <div className="absolute right-0 top-16 h-[350px] w-[350px] rounded-full border-[38px] border-blue-100/90 sm:h-[420px] sm:w-[420px] sm:border-[48px]" />
      <div className="absolute right-16 top-24 h-72 w-72 rounded-full bg-gradient-to-br from-white/85 via-blue-100/80 to-pink-100/60 blur-[1px] sm:h-80 sm:w-80" />
      <div className="absolute right-14 top-10 h-[360px] w-[360px] rounded-full bg-blue-400/20 blur-3xl sm:h-[460px] sm:w-[460px]" />

      <div className="absolute left-0 top-24 z-20 hidden rounded-2xl border border-white/90 bg-white/90 p-4 shadow-xl shadow-blue-200/50 backdrop-blur sm:block">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <FiCheckCircle className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Delivered</p>
            <p className="text-sm font-bold text-slate-900">96 orders today</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 right-0 z-20 hidden rounded-2xl border border-white/90 bg-white/90 p-4 shadow-xl shadow-blue-200/50 backdrop-blur sm:block">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <FiMapPin className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Live route</p>
            <p className="text-sm font-bold text-slate-900">Delhi to Mumbai</p>
          </div>
        </div>
      </div>

      <img
        src={deliveryAgent}
        alt="Professional delivery agent holding a parcel"
        className="absolute bottom-0 left-1/2 z-10 h-[405px] max-w-none -translate-x-[48%] object-contain drop-shadow-[0_28px_36px_rgba(37,99,235,0.22)] sm:h-[525px] lg:h-[560px]"
      />
    </div>
  );
}
