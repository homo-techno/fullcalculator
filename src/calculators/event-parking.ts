import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eventParkingCalculator: CalculatorDefinition = {
  slug: "event-parking",
  title: "Event Parking Spaces Calculator",
  description: "Free event parking calculator. Estimate how many parking spaces you need for your event based on guest count and transportation options.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["event parking", "parking spaces", "venue parking", "wedding parking", "parking calculator"],
  variants: [
    {
      id: "standard",
      name: "Standard Calculation",
      fields: [
        { name: "guestCount", label: "Total Guests", type: "number", placeholder: "e.g. 150" },
        { name: "avgPerCar", label: "Average Guests Per Car", type: "number", placeholder: "e.g. 2.2" },
        { name: "shuttlePercent", label: "Using Shuttle/Rideshare (%)", type: "number", placeholder: "e.g. 15" },
        { name: "vendorVehicles", label: "Vendor/Staff Vehicles", type: "number", placeholder: "e.g. 10" },
        { name: "valetService", label: "Valet Service?", type: "select", options: [
          { label: "Yes", value: "yes" },
          { label: "No - Self Park", value: "no" },
        ] },
      ],
      calculate: (inputs) => {
        const guestCount = (inputs.guestCount as number) || 0;
        const avgPerCar = (inputs.avgPerCar as number) || 2.2;
        const shuttlePercent = (inputs.shuttlePercent as number) || 0;
        const vendorVehicles = (inputs.vendorVehicles as number) || 0;
        const valetService = (inputs.valetService as string) || "no";
        if (guestCount <= 0) return null;
        const drivingGuests = Math.ceil(guestCount * (1 - shuttlePercent / 100));
        const guestCars = Math.ceil(drivingGuests / avgPerCar);
        const totalSpaces = guestCars + vendorVehicles;
        const valetEfficiency = valetService === "yes" ? 0.85 : 1;
        const requiredLotSpaces = Math.ceil(totalSpaces * valetEfficiency);
        const handicapSpaces = Math.max(1, Math.ceil(requiredLotSpaces * 0.04));
        return {
          primary: { label: "Parking Spaces Needed", value: formatNumber(requiredLotSpaces) },
          details: [
            { label: "Guest Vehicles", value: formatNumber(guestCars) },
            { label: "Vendor/Staff Vehicles", value: formatNumber(vendorVehicles) },
            { label: "Guests Using Shuttle/Rideshare", value: formatNumber(guestCount - drivingGuests) },
            { label: "ADA Accessible Spaces", value: formatNumber(handicapSpaces) },
            { label: "Valet Efficiency Savings", value: valetService === "yes" ? formatNumber(totalSpaces - requiredLotSpaces) + " spaces" : "N/A" },
            { label: "Lot Size Needed (sq ft)", value: formatNumber(requiredLotSpaces * 180) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["event-space-capacity", "wedding-guest-list", "wedding-seating"],
  faq: [
    { question: "How many parking spaces per guest?", answer: "Plan for roughly 1 parking space per 2-2.5 guests. For 150 guests, you need approximately 60-75 parking spaces plus vendor spots." },
    { question: "Does valet parking save space?", answer: "Yes, valet parking can reduce the required lot size by 15-20% since cars can be parked more efficiently without walkways between rows." },
  ],
  formula: "Spaces = ceil(Driving Guests / Avg Per Car) + Vendor Vehicles",
};
