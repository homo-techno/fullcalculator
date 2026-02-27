import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const destinationWeddingCostCalculator: CalculatorDefinition = {
  slug: "destination-wedding-cost-calculator",
  title: "Destination Wedding Cost Calculator",
  description:
    "Estimate the total cost of a destination wedding. Calculate expenses for travel, venue, accommodations, catering, and vendor fees at popular destinations.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "destination wedding",
    "wedding cost",
    "wedding budget",
    "beach wedding",
    "wedding abroad",
  ],
  variants: [
    {
      id: "fullBudget",
      name: "Full Budget Planner",
      description: "Calculate all destination wedding expenses",
      fields: [
        { name: "destination", label: "Destination Type", type: "select", options: [
          { label: "Caribbean/Mexico (mid-range)", value: "caribbean" },
          { label: "Hawaii", value: "hawaii" },
          { label: "Europe", value: "europe" },
          { label: "Domestic Resort", value: "domestic" },
          { label: "Southeast Asia (budget-friendly)", value: "asia" },
        ], defaultValue: "caribbean" },
        { name: "numGuests", label: "Number of Guests", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "nightsStay", label: "Nights at Destination", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "coupleFlightCost", label: "Couple's Flights ($)", type: "number", placeholder: "e.g. 1200", defaultValue: 1200 },
        { name: "hotelPerNight", label: "Couple's Hotel per Night ($)", type: "number", placeholder: "e.g. 250", defaultValue: 250 },
        { name: "weddingPackage", label: "Wedding/Venue Package ($)", type: "number", placeholder: "e.g. 5000", defaultValue: 5000 },
        { name: "cateringPerPerson", label: "Catering per Person ($)", type: "number", placeholder: "e.g. 80", defaultValue: 80 },
        { name: "photography", label: "Photography/Video ($)", type: "number", placeholder: "e.g. 3000", defaultValue: 3000 },
        { name: "attire", label: "Wedding Attire ($)", type: "number", placeholder: "e.g. 2000", defaultValue: 2000 },
        { name: "flowers", label: "Flowers & Decor ($)", type: "number", placeholder: "e.g. 1500", defaultValue: 1500 },
      ],
      calculate: (inputs) => {
        const numGuests = parseFloat(inputs.numGuests as string) || 0;
        const nightsStay = parseFloat(inputs.nightsStay as string) || 0;
        const coupleFlightCost = parseFloat(inputs.coupleFlightCost as string) || 0;
        const hotelPerNight = parseFloat(inputs.hotelPerNight as string) || 0;
        const weddingPackage = parseFloat(inputs.weddingPackage as string) || 0;
        const cateringPerPerson = parseFloat(inputs.cateringPerPerson as string) || 0;
        const photography = parseFloat(inputs.photography as string) || 0;
        const attire = parseFloat(inputs.attire as string) || 0;
        const flowers = parseFloat(inputs.flowers as string) || 0;

        if (numGuests <= 0) return null;

        const travelCost = coupleFlightCost + (hotelPerNight * nightsStay);
        const cateringTotal = numGuests * cateringPerPerson;
        const weddingCost = weddingPackage + cateringTotal + photography + attire + flowers;
        const grandTotal = travelCost + weddingCost;
        const costPerGuest = grandTotal / numGuests;

        return {
          primary: { label: "Total Wedding Cost", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Couple's Travel & Hotel", value: `$${formatNumber(travelCost, 2)}` },
            { label: "Wedding/Venue Package", value: `$${formatNumber(weddingPackage, 2)}` },
            { label: "Catering Total", value: `$${formatNumber(cateringTotal, 2)}` },
            { label: "Photography/Video", value: `$${formatNumber(photography, 2)}` },
            { label: "Attire", value: `$${formatNumber(attire, 2)}` },
            { label: "Flowers & Decor", value: `$${formatNumber(flowers, 2)}` },
            { label: "Cost per Guest", value: `$${formatNumber(costPerGuest, 2)}` },
          ],
        };
      },
    },
    {
      id: "guestTravel",
      name: "Guest Travel Estimator",
      description: "Estimate what your guests will spend to attend",
      fields: [
        { name: "numGuests", label: "Number of Guests", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "avgFlightCost", label: "Avg Guest Flight ($)", type: "number", placeholder: "e.g. 400", defaultValue: 400 },
        { name: "avgHotelPerNight", label: "Avg Hotel per Night ($)", type: "number", placeholder: "e.g. 150", defaultValue: 150 },
        { name: "nightsStay", label: "Nights Guests Stay", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "couplePaysGuestPercent", label: "% Couple Covers for Guests", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const numGuests = parseFloat(inputs.numGuests as string) || 0;
        const avgFlightCost = parseFloat(inputs.avgFlightCost as string) || 0;
        const avgHotelPerNight = parseFloat(inputs.avgHotelPerNight as string) || 0;
        const nightsStay = parseFloat(inputs.nightsStay as string) || 0;
        const couplePaysPercent = parseFloat(inputs.couplePaysGuestPercent as string) || 0;

        if (numGuests <= 0) return null;

        const perGuestTotal = avgFlightCost + (avgHotelPerNight * nightsStay);
        const allGuestTravel = perGuestTotal * numGuests;
        const couplePays = allGuestTravel * (couplePaysPercent / 100);
        const guestPays = perGuestTotal - (couplePays / numGuests);

        return {
          primary: { label: "Total Guest Travel Cost", value: `$${formatNumber(allGuestTravel, 2)}` },
          details: [
            { label: "Per Guest Travel Cost", value: `$${formatNumber(perGuestTotal, 2)}` },
            { label: "Couple's Share", value: `$${formatNumber(couplePays, 2)}` },
            { label: "Each Guest Pays", value: `$${formatNumber(guestPays, 2)}` },
            { label: "Flight Cost per Guest", value: `$${formatNumber(avgFlightCost, 2)}` },
            { label: "Hotel Total per Guest", value: `$${formatNumber(avgHotelPerNight * nightsStay, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bar-mitzvah-cost-calculator", "quinceanera-cost-calculator", "budget-calculator"],
  faq: [
    {
      question: "How much does a destination wedding cost?",
      answer:
        "A destination wedding typically costs $20,000-$50,000 for the couple, not including guest travel. Caribbean/Mexico weddings average $20,000-$35,000, European weddings $30,000-$60,000+, and Hawaiian weddings $25,000-$45,000.",
    },
    {
      question: "Is a destination wedding cheaper than a traditional one?",
      answer:
        "Often yes, primarily because guest lists are smaller (50-75 vs 150-200). The per-guest cost may be higher, but fewer guests can make the total lower. However, added travel expenses and vendor logistics can offset savings.",
    },
    {
      question: "Should I pay for my guests' travel to a destination wedding?",
      answer:
        "It is not expected, but appreciated. Most couples do not pay for guest travel. However, you might negotiate group hotel rates, provide welcome bags, or host a welcome dinner. Some couples cover specific costs for the bridal party.",
    },
  ],
  formula:
    "Total = Couple Travel + Venue Package + (Guests x Catering) + Photography + Attire + Flowers + Decor",
};
