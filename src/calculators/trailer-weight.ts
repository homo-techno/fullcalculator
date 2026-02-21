import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const trailerWeightCalculator: CalculatorDefinition = {
  slug: "trailer-weight-calculator",
  title: "Trailer Weight & Tongue Weight Calculator",
  description: "Free trailer weight calculator. Calculate tongue weight, payload distribution, and verify your trailer and tow vehicle are properly loaded for safe towing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["trailer weight calculator", "tongue weight", "trailer load calculator", "towing weight", "trailer payload"],
  variants: [
    {
      id: "tongue",
      name: "Tongue Weight Calculator",
      description: "Calculate tongue weight from trailer weight and load position",
      fields: [
        { name: "trailerWeight", label: "Total Loaded Trailer Weight (lbs)", type: "number", placeholder: "e.g. 5000" },
        { name: "tongueWeightPct", label: "Target Tongue Weight (%)", type: "select", options: [
          { label: "10% (minimum recommended)", value: "10" },
          { label: "12% (good for travel trailers)", value: "12" },
          { label: "15% (ideal for most trailers)", value: "15" },
          { label: "20% (5th wheel / gooseneck)", value: "20" },
          { label: "25% (heavy 5th wheel)", value: "25" },
        ], defaultValue: "15" },
        { name: "hitchRating", label: "Hitch Weight Rating (lbs)", type: "number", placeholder: "e.g. 800" },
      ],
      calculate: (inputs) => {
        const trailerWeight = inputs.trailerWeight as number;
        const tongueWeightPct = parseInt(inputs.tongueWeightPct as string) || 15;
        const hitchRating = (inputs.hitchRating as number) || 0;
        if (!trailerWeight) return null;

        const tongueWeight = trailerWeight * (tongueWeightPct / 100);
        const axleWeight = trailerWeight - tongueWeight;

        let safetyStatus = "OK";
        if (hitchRating > 0 && tongueWeight > hitchRating) {
          safetyStatus = "EXCEEDS hitch rating!";
        }

        const minTongue = trailerWeight * 0.10;
        const maxTongue = trailerWeight * 0.15;

        return {
          primary: { label: "Tongue Weight", value: `${formatNumber(tongueWeight, 0)} lbs` },
          details: [
            { label: "Trailer total weight", value: `${formatNumber(trailerWeight, 0)} lbs` },
            { label: "Weight on trailer axles", value: `${formatNumber(axleWeight, 0)} lbs` },
            { label: "Tongue weight percentage", value: `${tongueWeightPct}%` },
            { label: "Recommended range", value: `${formatNumber(minTongue, 0)} - ${formatNumber(maxTongue, 0)} lbs (10-15%)` },
            { label: "Hitch status", value: hitchRating > 0 ? safetyStatus : "Enter hitch rating to check" },
          ],
          note: "Tongue weight should be 10-15% of total trailer weight for conventional trailers, and 15-25% for 5th wheel/gooseneck trailers. Too little tongue weight causes trailer sway.",
        };
      },
    },
    {
      id: "payload",
      name: "Towing Payload Check",
      description: "Check if your tow vehicle can safely handle the load",
      fields: [
        { name: "gvwr", label: "Tow Vehicle GVWR (lbs)", type: "number", placeholder: "e.g. 7000" },
        { name: "curbWeight", label: "Tow Vehicle Curb Weight (lbs)", type: "number", placeholder: "e.g. 5200" },
        { name: "passengers", label: "Passenger + Cargo Weight (lbs)", type: "number", placeholder: "e.g. 400" },
        { name: "tongueWeight", label: "Tongue Weight (lbs)", type: "number", placeholder: "e.g. 750" },
        { name: "towRating", label: "Max Tow Rating (lbs)", type: "number", placeholder: "e.g. 10000" },
        { name: "trailerWeight", label: "Total Trailer Weight (lbs)", type: "number", placeholder: "e.g. 5000" },
      ],
      calculate: (inputs) => {
        const gvwr = inputs.gvwr as number;
        const curbWeight = inputs.curbWeight as number;
        const passengers = (inputs.passengers as number) || 0;
        const tongueWeight = (inputs.tongueWeight as number) || 0;
        const towRating = (inputs.towRating as number) || 0;
        const trailerWeight = (inputs.trailerWeight as number) || 0;
        if (!gvwr || !curbWeight) return null;

        const maxPayload = gvwr - curbWeight;
        const usedPayload = passengers + tongueWeight;
        const remainingPayload = maxPayload - usedPayload;
        const payloadPct = (usedPayload / maxPayload) * 100;

        const towingOk = towRating > 0 ? trailerWeight <= towRating : true;
        const payloadOk = remainingPayload >= 0;

        let overallStatus = "SAFE to tow";
        if (!payloadOk) overallStatus = "OVER payload capacity!";
        else if (!towingOk) overallStatus = "EXCEEDS tow rating!";

        return {
          primary: { label: "Remaining Payload", value: `${formatNumber(remainingPayload, 0)} lbs` },
          details: [
            { label: "Max payload capacity", value: `${formatNumber(maxPayload, 0)} lbs` },
            { label: "Used payload", value: `${formatNumber(usedPayload, 0)} lbs (${formatNumber(payloadPct, 0)}%)` },
            { label: "Tow rating remaining", value: towRating > 0 ? `${formatNumber(towRating - trailerWeight, 0)} lbs` : "N/A" },
            { label: "Status", value: overallStatus },
          ],
          note: "GVWR includes the vehicle's curb weight plus all passengers, cargo, and tongue weight. Never exceed GVWR or tow rating.",
        };
      },
    },
  ],
  relatedSlugs: ["truck-payload-calculator", "boat-fuel-calculator", "rv-fuel-calculator"],
  faq: [
    { question: "What is tongue weight and why does it matter?", answer: "Tongue weight is the downward force the trailer exerts on the hitch. It should be 10-15% of total trailer weight for bumper-pull trailers. Too little tongue weight (under 10%) causes dangerous trailer sway. Too much overloads the rear axle and lifts the front of the tow vehicle." },
    { question: "How do I weigh my trailer's tongue weight?", answer: "Use a tongue weight scale (available for $30-$80), or take the trailer to a public truck scale (CAT scale). You can also estimate by weighing the tow vehicle with and without the trailer attached, and the difference at the rear axle is approximately the tongue weight." },
    { question: "What is GVWR vs tow rating?", answer: "GVWR (Gross Vehicle Weight Rating) is the maximum total weight of the vehicle including passengers, cargo, and tongue weight. Tow rating is the maximum weight the vehicle can pull behind it. Both limits must be respected independently for safe towing." },
  ],
  formula: "Tongue Weight = Total Trailer Weight x Tongue Weight %; Payload Used = Passengers + Cargo + Tongue Weight",
};
