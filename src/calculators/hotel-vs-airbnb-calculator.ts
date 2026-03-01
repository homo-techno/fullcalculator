import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hotelVsAirbnbCalculator: CalculatorDefinition = {
  slug: "hotel-vs-airbnb-calculator",
  title: "Hotel vs Airbnb Calculator",
  description: "Compare the total cost of staying in a hotel versus an Airbnb including fees, taxes, and amenities.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hotel vs airbnb","accommodation comparison","hotel airbnb cost"],
  variants: [{
    id: "standard",
    name: "Hotel vs Airbnb",
    description: "Compare the total cost of staying in a hotel versus an Airbnb including fees, taxes, and amenities.",
    fields: [
      { name: "nights", label: "Number of Nights", type: "number", min: 1, max: 365, defaultValue: 5 },
      { name: "hotelNightly", label: "Hotel Nightly Rate", type: "number", prefix: "$", min: 1, max: 5000, defaultValue: 150 },
      { name: "hotelTaxPercent", label: "Hotel Tax Rate", type: "number", suffix: "%", min: 0, max: 30, defaultValue: 14 },
      { name: "airbnbNightly", label: "Airbnb Nightly Rate", type: "number", prefix: "$", min: 1, max: 5000, defaultValue: 120 },
      { name: "airbnbCleaningFee", label: "Airbnb Cleaning Fee", type: "number", prefix: "$", min: 0, max: 500, defaultValue: 75 },
    ],
    calculate: (inputs) => {
      const nights = inputs.nights as number;
      const hotelRate = inputs.hotelNightly as number;
      const hotelTax = (inputs.hotelTaxPercent as number) / 100;
      const airbnbRate = inputs.airbnbNightly as number;
      const cleaningFee = inputs.airbnbCleaningFee as number;
      if (!nights) return null;
      const hotelSubtotal = hotelRate * nights;
      const hotelTotal = hotelSubtotal * (1 + hotelTax);
      const airbnbServiceFee = airbnbRate * nights * 0.14;
      const airbnbTotal = (airbnbRate * nights) + cleaningFee + airbnbServiceFee;
      const savings = hotelTotal - airbnbTotal;
      const cheaper = savings > 0 ? "Airbnb" : "Hotel";
      return {
        primary: { label: "Savings with " + cheaper, value: "$" + formatNumber(Math.round(Math.abs(savings) * 100) / 100) },
        details: [
          { label: "Hotel Total", value: "$" + formatNumber(Math.round(hotelTotal * 100) / 100) },
          { label: "Airbnb Total", value: "$" + formatNumber(Math.round(airbnbTotal * 100) / 100) },
          { label: "Hotel Per Night (with tax)", value: "$" + formatNumber(Math.round(hotelTotal / nights * 100) / 100) },
          { label: "Airbnb Per Night (all-in)", value: "$" + formatNumber(Math.round(airbnbTotal / nights * 100) / 100) },
        ],
      };
    },
  }],
  relatedSlugs: ["travel-budget-calculator","road-trip-cost-calculator"],
  faq: [
    { question: "When is a hotel better value than an Airbnb?", answer: "Hotels tend to be better value for single-night stays, business travel, and when amenities like breakfast, gym, and daily cleaning are included. Airbnb cleaning fees can make short stays more expensive." },
    { question: "What hidden fees should I watch for?", answer: "Hotels may add resort fees, parking charges, and Wi-Fi fees. Airbnbs may have cleaning fees, service fees (typically 14%), and security deposits. Always compare the all-in total cost." },
  ],
  formula: "Hotel Total = Nightly Rate x Nights x (1 + Tax Rate); Airbnb Total = (Nightly Rate x Nights) + Cleaning Fee + Service Fee",
};
