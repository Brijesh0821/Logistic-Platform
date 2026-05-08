export default function Testimonials() {
  const data = [
    { name: "Rahul", text: "Clean dashboard and quick booking flow for our daily shipments." },
    { name: "Amit", text: "Tracking updates helped our operations team reduce support calls." },
    { name: "Sneha", text: "Reliable, simple, and easy for our drivers to use." },
  ];

  return (
    <section className="bg-[linear-gradient(180deg,rgba(255,255,255,0.35),rgba(239,246,255,0.55))] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">What clients say</h2>
          <p className="mt-3 text-slate-600">Built for teams that need speed and visibility.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {data.map((item) => (
            <div key={item.name} className="rounded-2xl border border-white/80 bg-white/80 p-6 shadow-lg shadow-blue-100/40 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
              <p className="mb-4 text-sm leading-6 text-slate-600">"{item.text}"</p>
              <h4 className="font-semibold text-blue-700">{item.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
