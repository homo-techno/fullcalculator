import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const truckPayloadCalculator: CalculatorDefinition = {
  slug: "truck-payload-calculator",
  title: "Truck Payload Calculator",
  description: "Free truck payload calculator. Calculate your truck's available payload capacity and verify your load is within safe weight limits.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["truck payload calculator", "payload capacity", "truck weight calculator", "truck load calculator", "GVWR payload"],
  variants: [
    {
      id: "payload",
      name: "Calculate Available Payload",
      description: "Determine how much payload your truck can carry",
      fields: [
        { name: "gvwr", label: "GVWR (Gross Vehicle Weight Rating)", type: "number", placeholder: "e.g. 7200", suffix: "lbs" },
        { name: "curbWeight", label: "Curb Weight", type: "number", placeholder: "e.g. 5100", suffix: "lbs" },
        { name: "passengers", label: "Number of Passengers", type: "select", options: [
          { label: "1 (driver only)", value: "1" },
          { label: "2 passengers", value: "2" },
          { label: "3 passengers", value: "3" },
          { label: "4 passengers", value: "4" },
          { label: "5 passengers (full cab)", value: "5" },
        ], defaultValue: "1" },
        { name: "avgPassengerWeight", label: "Avg Passenger Weight (lbs)", type: "number", placeholder: "e.g. 180", defaultValue: 180 },
        { name: "accessories", label: "Aftermarket Accessories Weight (lbs)", type: "number", placeholder: "e.g. 200 (toolbox, bumper, etc.)" },
        { name: "tongueWeight", label: "Trailer Tongue Weight (lbs)", type: "number", placeholder: "e.g. 0" },
      ],
      calculate: (inputs) => {
        const gvwr = inputs.gvwr as number;
        const curb = inputs.curbWeight as number;
        const passengers = parseInt(inputs.passengers as string) || 1;
        const avgWeight = (inputs.avgPassengerWeight as number) || 180;
        const accessories = (inputs.accessories as number) || 0;
        const tongueWeight = (inputs.tongueWeight as number) || 0;
        if (!gvwr || !curb) return null;

        const maxPayload = gvwr - curb;
        const passengerWeight = passengers * avgWeight;
        const usedPayload = passengerWeight + accessories + tongueWeight;
        const availablePayload = maxPayload - usedPayload;
        const pctUsed = (usedPayload / maxPayload) * 100;

        let status = "OK - within capacity";
        if (availablePayload < 0) status = "OVER payload capacity!";
        else if (availablePayload < 200) status = "Near capacity - use caution";

        return {
          primary: { label: "Available Payload", value: `${formatNumber(availablePayload, 0)} lbs` },
          details: [
            { label: "Max payload capacity", value: `${formatNumber(maxPayload, 0)} lbs` },
            { label: "Passengers", value: `${formatNumber(passengerWeight, 0)} lbs (${passengers} x ${avgWeight} lbs)` },
            { label: "Accessories", value: `${formatNumber(accessories, 0)} lbs` },
            { label: "Tongue weight", value: `${formatNumber(tongueWeight, 0)} lbs` },
            { label: "Payload used", value: `${formatNumber(pctUsed, 0)}%` },
            { label: "Status", value: status },
          ],
        };
      },
    },
    {
      id: "material",
      name: "Material Load Calculator",
      description: "Calculate how much material you can haul",
      fields: [
        { name: "availablePayload", label: "Available Payload (lbs)", type: "number", placeholder: "e.g. 1500" },
        { name: "material", label: "Material Type", type: "select", options: [
          { label: "Topsoil (2,200 lbs/cu yd)", value: "2200" },
          { label: "Mulch (600 lbs/cu yd)", value: "600" },
          { label: "Gravel (2,700 lbs/cu yd)", value: "2700" },
          { label: "Sand (2,500 lbs/cu yd)", value: "2500" },
          { label: "Concrete (3,600 lbs/cu yd)", value: "3600" },
          { label: "Firewood (~2,500 lbs/cord)", value: "2500" },
          { label: "Lumber (~35 lbs/board foot)", value: "0" },
        ], defaultValue: "2200" },
        { name: "bedVolume", label: "Truck Bed Volume (cu ft)", type: "number", placeholder: "e.g. 55" },
      ],
      calculate: (inputs) => {
        const payload = inputs.availablePayload as number;
        const materialLbsPerYd = parseInt(inputs.material as string) || 2200;
        const bedVolume = (inputs.bedVolume as number) || 55;
        if (!payload) return null;

        if (materialLbsPerYd === 0) {
          // Lumber special case
          const boardFeet = payload / 35;
          return {
            primary: { label: "Max Lumber Load", value: `~${formatNumber(boardFeet, 0)} board feet` },
            details: [
              { label: "Available payload", value: `${formatNumber(payload, 0)} lbs` },
              { label: "2x4x8 equivalent", value: `~${formatNumber(boardFeet / 5.33, 0)} boards` },
              { label: "4x8 plywood sheets (70 lbs each)", value: `~${Math.floor(payload / 70)} sheets` },
            ],
          };
        }

        const bedVolumeYd = bedVolume / 27;
        const maxByWeight = payload / materialLbsPerYd;
        const maxByVolume = bedVolumeYd;
        const maxLoad = Math.min(maxByWeight, maxByVolume);
        const limitedBy = maxByWeight < maxByVolume ? "weight" : "volume";
        const loadWeight = maxLoad * materialLbsPerYd;

        return {
          primary: { label: "Max Material Load", value: `${formatNumber(maxLoad, 2)} cubic yards` },
          details: [
            { label: "Load weight", value: `${formatNumber(loadWeight, 0)} lbs` },
            { label: "Limited by", value: limitedBy === "weight" ? "Payload capacity" : "Bed volume" },
            { label: "Max by weight", value: `${formatNumber(maxByWeight, 2)} cu yd` },
            { label: "Max by volume (bed level)", value: `${formatNumber(maxByVolume, 2)} cu yd` },
            { label: "Payload used", value: `${formatNumber((loadWeight / payload) * 100, 0)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["trailer-weight-calculator", "cargo-volume-calculator", "towing-capacity-calculator"],
  faq: [
    { question: "How do I find my truck's payload capacity?", answer: "Payload capacity = GVWR minus curb weight. GVWR is on the driver's door jamb sticker. Curb weight is in the owner's manual or manufacturer's website. For example, a truck with 7,200 lb GVWR and 5,200 lb curb weight has a 2,000 lb payload capacity." },
    { question: "What is the difference between GVWR and tow rating?", answer: "GVWR is the maximum total weight of the truck itself (including everything in and on it). Tow rating is the maximum weight the truck can pull behind it. They are independent limits - you must not exceed either one. Tongue weight from a trailer counts against your payload." },
    { question: "What happens if I exceed my payload capacity?", answer: "Exceeding payload stresses the frame, axles, brakes, and suspension beyond their design limits. It can cause brake failure, tire blowouts, broken springs, and loss of control. It also voids your warranty and may result in legal liability in an accident." },
  ],
  formula: "Available Payload = GVWR - Curb Weight - Passengers - Accessories - Tongue Weight",
};
