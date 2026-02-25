import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const skiTripCost: CalculatorDefinition = {
  slug: "ski-trip-cost",
  title: "Ski Trip Cost Calculator",
  description:
    "Free online ski trip cost calculator. Estimate total ski vacation cost including lift tickets, lodging, equipment rental, and more.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "ski trip cost",
    "ski vacation",
    "ski budget",
    "lift ticket cost",
    "ski resort cost",
  ],
  variants: [
    {
      id: "total-cost",
      name: "Estimate Ski Trip Cost",
      fields: [
        {
          name: "resort",
          label: "Resort Type",
          type: "select",
          options: [
            { label: "Major (Vail, Park City, Aspen)", value: "major" },
            { label: "Mid-Range (Breckenridge, Killington)", value: "midrange" },
            { label: "Budget (Smaller Regional)", value: "budget" },
            { label: "European (Alps)", value: "european" },
            { label: "Canadian (Whistler, Banff)", value: "canadian" },
          ],
        },
        {
          name: "days",
          label: "Number of Ski Days",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "nights",
          label: "Number of Nights Lodging",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "skiers",
          label: "Number of Skiers",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "needRentals",
          label: "Equipment Rental",
          type: "select",
          options: [
            { label: "No Rental Needed (Own Equipment)", value: "none" },
            { label: "Standard Rental Package", value: "standard" },
            { label: "Premium Rental Package", value: "premium" },
          ],
        },
      ],
      calculate: (inputs) => {
        const days = parseFloat(inputs.days as string) || 0;
        const nights = parseFloat(inputs.nights as string) || 0;
        const skiers = parseFloat(inputs.skiers as string) || 1;
        const resort = inputs.resort as string;
        const needRentals = inputs.needRentals as string;

        // Lift ticket per day per person
        const liftTickets: Record<string, number> = {
          major: 200,
          midrange: 140,
          budget: 80,
          european: 65,
          canadian: 130,
        };

        // Lodging per night (per room, assume 2 per room)
        const lodging: Record<string, number> = {
          major: 350,
          midrange: 220,
          budget: 120,
          european: 180,
          canadian: 250,
        };

        const rentalCosts: Record<string, number> = {
          none: 0,
          standard: 45,
          premium: 75,
        };

        const liftPerDay = liftTickets[resort] || 140;
        const totalLifts = liftPerDay * days * skiers;

        const rooms = Math.ceil(skiers / 2);
        const lodgingPerNight = (lodging[resort] || 220) * rooms;
        const totalLodging = lodgingPerNight * nights;

        const rentalPerDay = rentalCosts[needRentals] || 0;
        const totalRentals = rentalPerDay * days * skiers;

        const foodPerPersonPerDay = resort === "major" ? 80 : resort === "european" ? 60 : 55;
        const totalFood = foodPerPersonPerDay * (nights + 1) * skiers;

        const lessonsEstimate = 0;
        const transportEstimate = resort === "european" ? 200 * skiers : 100 * skiers;

        const totalCost = totalLifts + totalLodging + totalRentals + totalFood + transportEstimate;
        const perPerson = totalCost / skiers;
        const perDay = totalCost / Math.max(days, 1);

        return {
          primary: { label: "Total Ski Trip Cost", value: "$" + formatNumber(totalCost, 2) },
          details: [
            { label: "Lift Tickets", value: "$" + formatNumber(totalLifts, 2) },
            { label: "Lodging", value: "$" + formatNumber(totalLodging, 2) },
            { label: "Equipment Rental", value: "$" + formatNumber(totalRentals, 2) },
            { label: "Food & Dining", value: "$" + formatNumber(totalFood, 2) },
            { label: "Transport (est.)", value: "$" + formatNumber(transportEstimate, 2) },
            { label: "Cost per Person", value: "$" + formatNumber(perPerson, 2) },
            { label: "Cost per Ski Day", value: "$" + formatNumber(perDay, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["beach-vacation-cost", "road-trip-cost", "travel-budget-daily"],
  faq: [
    {
      question: "How much does a ski trip cost?",
      answer:
        "A typical 5-day ski trip for two costs $3,000-$7,000 at US resorts. Lift tickets ($80-200/day/person), lodging ($120-350/night), and food ($55-80/person/day) are the biggest expenses.",
    },
    {
      question: "How can I save on lift tickets?",
      answer:
        "Buy season passes (Ikon or Epic) if skiing 5+ days, purchase multi-day tickets in advance online, ski midweek, look for military/college discounts, and consider smaller resorts.",
    },
    {
      question: "Is skiing in Europe cheaper than the US?",
      answer:
        "European ski resorts typically have much cheaper lift tickets ($40-70/day vs $100-200+ in the US). Lodging and food can be comparable, but the overall value is often better in Europe.",
    },
  ],
  formula:
    "Total = Lift Tickets + Lodging + Rentals + Food + Transport\nLift Tickets = Price/Day x Days x Skiers",
};
