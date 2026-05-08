import { useEffect, useState } from "react";

export default function Stats() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 20;
      setCount(i);
      if (i >= 1000) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[linear-gradient(135deg,#eef6ff,#fff4fb)] py-16">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          [`${count}+`, "Deliveries completed"],
          ["500+", "Business clients"],
          ["24/7", "Shipment support"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-2xl border border-white/80 bg-white/75 p-6 text-center shadow-lg shadow-blue-100/40 backdrop-blur">
            <h3 className="text-4xl font-bold text-blue-700">{value}</h3>
            <p className="mt-2 text-sm font-medium text-slate-600">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
