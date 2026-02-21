import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petTravelCostCalculator: CalculatorDefinition = {
  slug: "pet-travel-cost-calculator",
  title: "Pet Travel & Boarding Cost Calculator",
  description:
    "Free pet travel cost calculator. Estimate boarding, pet sitting, airline pet travel, and road trip costs for your dog or cat.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pet travel cost calculator",
    "pet boarding cost",
    "dog boarding calculator",
    "pet sitting cost",
    "flying with a pet cost",
  ],
  variants: [
    {
      id: "boarding",
      name: "Boarding / Pet Sitting",
      fields: [
        {
          name: "petType",
          label: "Pet Type",
          type: "select",
          options: [
            { label: "Dog (small, under 25 lbs)", value: "dog_small" },
            { label: "Dog (medium, 25-50 lbs)", value: "dog_medium" },
            { label: "Dog (large, 50+ lbs)", value: "dog_large" },
            { label: "Cat", value: "cat" },
          ],
        },
        {
          name: "nights",
          label: "Number of Nights",
          type: "number",
          placeholder: "e.g. 7",
          min: 1,
          max: 90,
        },
        {
          name: "careType",
          label: "Care Type",
          type: "select",
          options: [
            { label: "Standard Kennel Boarding", value: "kennel" },
            { label: "Luxury Boarding / Pet Hotel", value: "luxury" },
            { label: "In-Home Pet Sitter (daily visits)", value: "sitter_visits" },
            { label: "In-Home Pet Sitter (overnight stays)", value: "sitter_overnight" },
            { label: "Dog Daycare (per day)", value: "daycare" },
          ],
        },
        {
          name: "extraServices",
          label: "Extra Services",
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "Grooming + Playtime", value: "grooming" },
            { label: "Medication Administration", value: "medication" },
            { label: "All Extras (grooming + play + meds)", value: "all" },
          ],
        },
      ],
      calculate: (inputs) => {
        const petType = (inputs.petType as string) || "dog_medium";
        const nights = inputs.nights as number;
        const careType = (inputs.careType as string) || "kennel";
        const extras = (inputs.extraServices as string) || "none";
        if (!nights || nights <= 0) return null;

        // Base rates per night/visit (2024 US averages)
        const baseRates: Record<string, Record<string, number>> = {
          dog_small: { kennel: 35, luxury: 65, sitter_visits: 25, sitter_overnight: 55, daycare: 30 },
          dog_medium: { kennel: 45, luxury: 75, sitter_visits: 25, sitter_overnight: 60, daycare: 35 },
          dog_large: { kennel: 55, luxury: 90, sitter_visits: 30, sitter_overnight: 65, daycare: 40 },
          cat: { kennel: 25, luxury: 45, sitter_visits: 20, sitter_overnight: 45, daycare: 20 },
        };

        const dailyRate = baseRates[petType]?.[careType] || 45;

        // Extra services
        const extraCosts: Record<string, number> = {
          none: 0,
          grooming: 15,
          medication: 10,
          all: 25,
        };
        const dailyExtra = extraCosts[extras] || 0;
        const totalDaily = dailyRate + dailyExtra;
        const totalCost = totalDaily * nights;

        // Holiday surcharge (estimate 20% more)
        const holidayTotal = totalCost * 1.2;

        // Tips
        const tipAmount = totalCost * 0.15;

        return {
          primary: {
            label: "Total Estimated Cost",
            value: "$" + formatNumber(totalCost, 0),
          },
          details: [
            { label: "Base Rate", value: "$" + formatNumber(dailyRate, 0) + "/night" },
            { label: "Extra Services", value: dailyExtra > 0 ? "+$" + formatNumber(dailyExtra, 0) + "/night" : "None" },
            { label: "Total Per Night", value: "$" + formatNumber(totalDaily, 0) },
            { label: "Number of Nights", value: String(nights) },
            { label: "Holiday Rate (est.)", value: "$" + formatNumber(holidayTotal, 0) + " (+20%)" },
            { label: "Suggested Tip (15%)", value: "$" + formatNumber(tipAmount, 0) },
            { label: "Total with Tip", value: "$" + formatNumber(totalCost + tipAmount, 0) },
            {
              label: "Booking Tip",
              value: "Book 2-4 weeks in advance. Holiday weeks (Christmas, July 4th) book up months ahead.",
            },
          ],
        };
      },
    },
    {
      id: "airTravel",
      name: "Airline Pet Travel",
      fields: [
        {
          name: "travelType",
          label: "Travel Type",
          type: "select",
          options: [
            { label: "In-Cabin (small pet under 20 lbs)", value: "cabin" },
            { label: "Cargo (checked baggage)", value: "cargo" },
            { label: "Pet Shipping Service", value: "shipping" },
          ],
        },
        {
          name: "tripType",
          label: "Trip Type",
          type: "select",
          options: [
            { label: "Domestic One-Way", value: "domestic_one" },
            { label: "Domestic Round-Trip", value: "domestic_round" },
            { label: "International One-Way", value: "international_one" },
            { label: "International Round-Trip", value: "international_round" },
          ],
        },
        {
          name: "needsVetCert",
          label: "Health Certificate Needed?",
          type: "select",
          options: [
            { label: "Yes (required for most flights)", value: "yes" },
            { label: "No (already have one)", value: "no" },
          ],
        },
      ],
      calculate: (inputs) => {
        const travelType = (inputs.travelType as string) || "cabin";
        const tripType = (inputs.tripType as string) || "domestic_round";
        const needsCert = (inputs.needsVetCert as string) || "yes";

        // Airline pet fees (2024 averages)
        const fees: Record<string, Record<string, number>> = {
          cabin: { domestic_one: 125, domestic_round: 250, international_one: 200, international_round: 400 },
          cargo: { domestic_one: 250, domestic_round: 500, international_one: 500, international_round: 1000 },
          shipping: { domestic_one: 500, domestic_round: 1000, international_one: 1500, international_round: 3000 },
        };

        const airlineFee = fees[travelType]?.[tripType] || 250;

        // Additional costs
        const vetCertCost = needsCert === "yes" ? 150 : 0;
        const carrierCost = travelType === "cabin" ? 40 : 80;
        const microchipCost = 45;

        const isInternational = tripType.startsWith("international");
        const quarantineCost = isInternational ? 500 : 0; // Some countries require quarantine
        const importPermit = isInternational ? 100 : 0;

        const totalCost = airlineFee + vetCertCost + carrierCost + (isInternational ? quarantineCost + importPermit : 0);

        return {
          primary: {
            label: "Estimated Total Cost",
            value: "$" + formatNumber(totalCost, 0),
          },
          details: [
            { label: "Airline Pet Fee", value: "$" + formatNumber(airlineFee, 0) },
            { label: "Vet Health Certificate", value: needsCert === "yes" ? "$" + formatNumber(vetCertCost, 0) : "Already obtained" },
            { label: "Pet Carrier", value: "$" + formatNumber(carrierCost, 0) + " (if needed)" },
            ...(isInternational
              ? [
                  { label: "Import Permit (est.)", value: "$" + formatNumber(importPermit, 0) },
                  { label: "Quarantine (est.)", value: "$" + formatNumber(quarantineCost, 0) + " (varies by country)" },
                ]
              : []),
            { label: "Travel Type", value: travelType === "cabin" ? "In-Cabin" : travelType === "cargo" ? "Cargo Hold" : "Pet Shipping Service" },
            {
              label: "Requirements",
              value: "Health certificate within 10 days of travel. Airline-approved carrier. Current vaccinations.",
            },
            {
              label: "Note",
              value: travelType === "cargo"
                ? "Cargo travel is restricted in extreme temperatures. Some breeds (brachycephalic) are banned from cargo."
                : "In-cabin: pet + carrier must fit under seat. Max weight typically 20 lbs.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pet-insurance-calculator", "pet-food-calculator", "dog-calorie-calculator"],
  faq: [
    {
      question: "How much does dog boarding cost?",
      answer:
        "Dog boarding typically costs $30-55 per night at a standard kennel, $60-100+ at luxury pet hotels, and $45-75 per night for in-home pet sitters. Costs vary by location, dog size, and time of year. Holiday periods (Christmas, Thanksgiving, summer) often have premium rates of 20-50% more.",
    },
    {
      question: "How much does it cost to fly with a pet?",
      answer:
        "In-cabin domestic flights cost $100-150 each way on most US airlines (2024 rates). Cargo travel costs $200-500+ depending on the airline and distance. International flights cost more, plus you'll need a health certificate ($100-200), and some countries require import permits and quarantine periods.",
    },
    {
      question: "Should I tip my pet sitter?",
      answer:
        "Tipping 10-20% of the total bill is customary for pet sitters, especially for excellent service, holidays, or pets requiring extra care (medication, special needs). For boarding facilities, tipping individual staff $5-20 is appreciated but not expected.",
    },
  ],
  formula:
    "Boarding total = (nightly rate + extras) x nights. Airline total = airline fee + health certificate + carrier + (international: import permit + quarantine). Holiday surcharge: +20%. Tip: 15% of total.",
};
