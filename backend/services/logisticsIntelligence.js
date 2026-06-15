const COURIERS = [
  { courier: "Delhivery", base: 48, perKg: 24, days: [3, 5], reliability: 91, cod: 12 },
  { courier: "Ecom Express", base: 44, perKg: 22, days: [4, 6], reliability: 87, cod: 10 },
  { courier: "Xpressbees", base: 42, perKg: 23, days: [3, 6], reliability: 88, cod: 11 },
  { courier: "Blue Dart", base: 82, perKg: 31, days: [1, 3], reliability: 96, cod: 18 },
];

const number = (value) => Math.max(0, Number(value) || 0);

const calculateWeightAnalysis = ({ weight, length, breadth, height }) => {
  const declaredWeight = number(weight);
  const volumetricWeight = Number(((number(length) * number(breadth) * number(height)) / 5000).toFixed(2));
  const chargeableWeight = Math.max(declaredWeight, volumetricWeight);
  const discrepancyPercent = declaredWeight
    ? Math.round(((volumetricWeight - declaredWeight) / declaredWeight) * 100)
    : volumetricWeight > 0 ? 100 : 0;

  return {
    declaredWeight,
    volumetricWeight,
    chargeableWeight,
    discrepancyPercent,
    mismatch: volumetricWeight > declaredWeight * 1.2,
  };
};

const compareCouriers = (input) => {
  const analysis = calculateWeightAnalysis(input);
  const isExpress = String(input.priority || input.service).toLowerCase().includes("express");
  const isCod = String(input.payment).toLowerCase().includes("cash");
  const fragile = /fragile|glass|electronic|breakable/.test(String(input.itemType || input.item).toLowerCase());

  const quotes = COURIERS.map((provider) => {
    const expressFee = isExpress ? (provider.courier === "Blue Dart" ? 35 : 75) : 0;
    const price = Math.round(provider.base + analysis.chargeableWeight * provider.perKg + expressFee + (fragile ? 22 : 0) + (isCod ? provider.cod : 0));
    const score = Math.round(provider.reliability + (isExpress ? (7 - provider.days[0]) * 5 : 0) - price / 35);
    return {
      courier: provider.courier,
      price,
      estimatedDays: `${Math.max(1, provider.days[0] - (isExpress ? 1 : 0))}-${Math.max(2, provider.days[1] - (isExpress ? 1 : 0))} days`,
      score,
      reliability: provider.reliability,
      bestValue: false,
    };
  }).sort((a, b) => a.price - b.price);

  const best = [...quotes].sort((a, b) => b.score - a.score)[0];
  quotes.forEach((quote) => { quote.bestValue = quote.courier === best.courier; });

  return {
    quotes,
    recommendation: {
      courier: best.courier,
      reason: `${best.reliability}% reliability, ${isExpress ? "strong express performance" : "balanced price and speed"}, ${fragile ? "suited to sensitive parcels" : "competitive weight pricing"}`,
      confidence: Math.min(98, Math.max(72, best.score)),
    },
    weightAnalysis: analysis,
  };
};

const predictDelay = (input) => {
  const riskFactors = [];
  let delayProbability = 12;
  if (number(input.chargeableWeight || input.weight) > 20) { delayProbability += 13; riskFactors.push("Heavy parcel handling"); }
  if (String(input.payment).toLowerCase().includes("cash")) { delayProbability += 6; riskFactors.push("COD handover dependency"); }
  if (String(input.service).toLowerCase().includes("standard")) { delayProbability += 5; riskFactors.push("Standard service routing"); }
  if (String(input.pickupPincode || "")[0] !== String(input.dropPincode || "")[0]) { delayProbability += 9; riskFactors.push("Long-distance route"); }
  if (input.weightMismatch) { delayProbability += 16; riskFactors.push("Weight verification required"); }
  delayProbability = Math.min(78, delayProbability);
  return {
    onTimeProbability: 100 - delayProbability,
    delayProbability,
    riskFactors: riskFactors.length ? riskFactors : ["No major delay factors detected"],
  };
};

module.exports = { calculateWeightAnalysis, compareCouriers, predictDelay };
