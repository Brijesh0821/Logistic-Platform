export const vehicles = {
  bike: { label: "Bike", base: 38, perKm: 5, includedKg: 0.5, extraKg: 7, multiplier: 0.9, min: 49, maxKg: 20 },
  tempo: { label: "Tempo", base: 149, perKm: 12, includedKg: 20, extraKg: 2, multiplier: 1, min: 249, maxKg: 800 },
  mini: { label: "Mini Truck", base: 229, perKm: 16, includedKg: 50, extraKg: 1.7, multiplier: 1.04, min: 349, maxKg: 1500 },
  truck: { label: "Truck", base: 329, perKm: 18, includedKg: 100, extraKg: 1.25, multiplier: 1.08, min: 449, maxKg: 8000 },
  container: { label: "Container", base: 1400, perKm: 36, includedKg: 500, extraKg: 0.95, multiplier: 1.28, min: 1999, maxKg: 28000 },
};

export const services = {
  standard: { label: "Standard", multiplier: 1, eta: "3-5 business days" },
  express: { label: "Express", multiplier: 1.16, eta: "1-3 business days" },
  sameDay: { label: "Same Day", multiplier: 1.42, eta: "Today, subject to slot availability" },
  overnight: { label: "Overnight", multiplier: 1.28, eta: "Next business day" },
};

export const speeds = {
  economy: { label: "Flexible window", multiplier: 0.96 },
  priority: { label: "Priority dispatch", multiplier: 1.04 },
  dedicated: { label: "Dedicated vehicle", multiplier: 1.2 },
};

export const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(value || 0));

const clampNumber = (value, min, max) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(Math.max(number, min), max);
};

export function calculatePrice(form) {
  const distance = clampNumber(form.distance, 0, 10000);
  const weight = clampNumber(form.weight, 0, 30000);
  const vehicle = vehicles[form.vehicle];
  const service = services[form.service];
  const speed = speeds[form.speed];

  const baseFare = vehicle.base;
  const distanceCharge = distance * vehicle.perKm;
  const chargeableWeight = Math.max(0, weight - vehicle.includedKg);
  const weightCharge = chargeableWeight * vehicle.extraKg;
  const freight = (baseFare + distanceCharge + weightCharge) * vehicle.multiplier * service.multiplier * speed.multiplier;
  const fuelSurcharge = freight * 0.07;
  const handlingFee = Math.max(25, Math.min(450, weight * 0.45 + distance * 0.25));
  const fragileFee = form.fragile ? Math.max(35, freight * 0.035) : 0;
  const insuranceFee = form.insurance ? Math.max(18, freight * 0.008) : 0;
  const codFee = form.cod ? Math.max(25, freight * 0.008) : 0;
  const subtotal = Math.max(vehicle.min, freight + fuelSurcharge + handlingFee + fragileFee + insuranceFee + codFee);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return {
    distance,
    weight,
    eta: service.eta,
    maxKg: vehicle.maxKg,
    total,
    breakdown: [
      ["Base fare", baseFare],
      ["Distance charge", distanceCharge],
      ["Weight charge", weightCharge],
      ["Vehicle and service adjustment", freight - baseFare - distanceCharge - weightCharge],
      ["Fuel surcharge", fuelSurcharge],
      ["Handling fee", handlingFee],
      ["Fragile handling", fragileFee],
      ["Insurance", insuranceFee],
      ["COD fee", codFee],
      ["GST / tax", gst],
    ],
  };
}
