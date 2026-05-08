import { FaTruck, FaRoute, FaCalculator, FaFileInvoice, FaChartLine, FaComments } from "react-icons/fa";

export default function Tools() {
  const tools = [
    { icon: <FaTruck />, title: "Shipment Tracker", desc: "Track shipment movement in real time." },
    { icon: <FaRoute />, title: "Route Planner", desc: "Plan faster routes and reduce delivery delays." },
    { icon: <FaCalculator />, title: "Rate Calculator", desc: "Estimate shipping cost before booking." },
    { icon: <FaFileInvoice />, title: "Invoice Generator", desc: "Generate invoices after confirmed orders." },
    { icon: <FaChartLine />, title: "Operations Dashboard", desc: "Monitor orders, revenue, and status trends." },
    { icon: <FaComments />, title: "Customer Support", desc: "Answer common shipping questions quickly." },
  ];

  return (
    <section className="bg-[linear-gradient(180deg,rgba(255,255,255,0.4),rgba(239,246,255,0.65))] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">Logistics tools</h2>
          <p className="mt-3 text-slate-600">Everything needed to manage shipping operations from pickup to delivery.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="rounded-2xl border border-white/80 bg-white/80 p-6 shadow-lg shadow-blue-100/40 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-700">{tool.icon}</div>
              <h3 className="text-lg font-semibold text-slate-950">{tool.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
