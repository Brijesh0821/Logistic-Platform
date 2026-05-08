import Button from "./ui/Button";

export default function Hero() {
  return (
    <section className="bg-slate-50 px-4 py-24 text-center">
      <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
        Safe load, swift delivery
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
        Manage orders, tracking, payments, and delivery teams in one professional logistics dashboard.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button>Create Shipment</Button>
        <Button variant="secondary">Track Order</Button>
      </div>
    </section>
  );
}
