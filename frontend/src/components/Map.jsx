export default function Map() {
  return (
    <section className="bg-white/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">Our presence</h2>
          <p className="mt-3 text-slate-600">Plan pickups and deliveries across major logistics routes.</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/80 shadow-xl shadow-blue-100/40 backdrop-blur">
          <iframe
            title="SwiftLogix service map"
            src="https://www.google.com/maps?q=Delhi&output=embed"
            className="h-[400px] w-full"
          />
        </div>
      </div>
    </section>
  );
}
