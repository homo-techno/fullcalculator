import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const partyRentalEquipmentCostCalculator: CalculatorDefinition = {
  slug: "party-rental-equipment-cost-calculator",
  title: "Party Rental Equipment Cost Calculator",
  description: "Estimate rental costs for party equipment including tables, chairs, linens, dinnerware, and glassware for your event.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["party rental cost","table and chair rental","event equipment rental","linen rental cost"],
  variants: [{
    id: "standard",
    name: "Party Rental Equipment Cost",
    description: "Estimate rental costs for party equipment including tables, chairs, linens, dinnerware, and glassware for your event.",
    fields: [
      { name: "guestCount", label: "Number of Guests", type: "number", min: 10, max: 500, defaultValue: 100 },
      { name: "tableRental", label: "Table Rental Each ($)", type: "number", min: 5, max: 100, defaultValue: 12 },
      { name: "seatsPerTable", label: "Seats Per Table", type: "number", min: 4, max: 12, defaultValue: 8 },
      { name: "chairRental", label: "Chair Rental Each ($)", type: "number", min: 1, max: 20, defaultValue: 3 },
      { name: "linenPerTable", label: "Linen Per Table ($)", type: "number", min: 0, max: 50, defaultValue: 15 },
      { name: "placeSettingCost", label: "Place Setting Per Guest ($)", type: "number", min: 0, max: 25, defaultValue: 5 },
      { name: "glasswareCost", label: "Glassware Per Guest ($)", type: "number", min: 0, max: 10, defaultValue: 3 },
    ],
    calculate: (inputs) => {
    const guests = inputs.guestCount as number;
    const tablePrice = inputs.tableRental as number;
    const seatsPerTable = inputs.seatsPerTable as number;
    const chairPrice = inputs.chairRental as number;
    const linenPrice = inputs.linenPerTable as number;
    const placeSetting = inputs.placeSettingCost as number;
    const glassware = inputs.glasswareCost as number;
    const tablesNeeded = Math.ceil(guests / seatsPerTable);
    const totalTables = tablesNeeded * tablePrice;
    const totalChairs = guests * chairPrice;
    const totalLinens = tablesNeeded * linenPrice;
    const totalPlaceSettings = guests * placeSetting;
    const totalGlassware = guests * glassware;
    const subtotal = totalTables + totalChairs + totalLinens + totalPlaceSettings + totalGlassware;
    const delivery = subtotal * 0.1;
    const total = subtotal + delivery;
    return {
      primary: { label: "Total Rental Cost", value: "$" + formatNumber(Math.round(total)) },
      details: [
        { label: "Tables (" + tablesNeeded + ")", value: "$" + formatNumber(Math.round(totalTables)) },
        { label: "Chairs (" + guests + ")", value: "$" + formatNumber(Math.round(totalChairs)) },
        { label: "Linens", value: "$" + formatNumber(Math.round(totalLinens)) },
        { label: "Place Settings", value: "$" + formatNumber(Math.round(totalPlaceSettings)) },
        { label: "Glassware", value: "$" + formatNumber(Math.round(totalGlassware)) },
        { label: "Delivery/Pickup (10%)", value: "$" + formatNumber(Math.round(delivery)) }
      ]
    };
  },
  }],
  relatedSlugs: ["event-catering-calculator","reception-venue-cost-calculator","tent-rental-cost-calculator"],
  faq: [
    { question: "How much does party equipment rental cost?", answer: "Basic table and chair rental runs $5-$15 per person. Adding linens, dinnerware, and glassware brings it to $15-$40 per person depending on quality." },
    { question: "When should you book party rentals?", answer: "Book event rentals 3-6 months in advance, especially for peak wedding season (May-October). Last-minute bookings may have limited inventory and higher prices." },
    { question: "What is included in a place setting rental?", answer: "A standard place setting includes a dinner plate, salad plate, fork, knife, spoon, and napkin. Charger plates and specialty utensils cost extra." },
  ],
  formula: "Tables = ceil(Guests / SeatsPerTable) x TablePrice; Chairs = Guests x ChairPrice; Total = Tables + Chairs + Linens + PlaceSettings + Glassware + Delivery",
};
