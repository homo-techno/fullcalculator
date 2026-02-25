import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const disneyTripCost: CalculatorDefinition = {
  slug: "disney-trip-cost",
  title: "Disney Trip Cost Calculator",
  description:
    "Free online Disney trip cost calculator. Estimate total Disney theme park vacation cost including tickets, hotel, food, and extras.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "disney cost",
    "disney vacation",
    "theme park cost",
    "disney world budget",
    "disneyland cost",
  ],
  variants: [
    {
      id: "total-cost",
      name: "Total Disney Trip Cost",
      fields: [
        {
          name: "park",
          label: "Disney Park",
          type: "select",
          options: [
            { label: "Walt Disney World (Florida)", value: "wdw" },
            { label: "Disneyland (California)", value: "dl" },
            { label: "Disneyland Paris", value: "dlp" },
            { label: "Tokyo Disney Resort", value: "tdr" },
          ],
        },
        {
          name: "days",
          label: "Number of Park Days",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "adults",
          label: "Number of Adults",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "children",
          label: "Number of Children (3-9)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "hotelLevel",
          label: "Hotel Level",
          type: "select",
          options: [
            { label: "Value/Off-Site Budget", value: "value" },
            { label: "Disney Moderate Resort", value: "moderate" },
            { label: "Disney Deluxe Resort", value: "deluxe" },
          ],
        },
      ],
      calculate: (inputs) => {
        const days = parseFloat(inputs.days as string) || 0;
        const adults = parseFloat(inputs.adults as string) || 0;
        const children = parseFloat(inputs.children as string) || 0;
        const park = inputs.park as string;
        const hotelLevel = inputs.hotelLevel as string;
        const totalPeople = adults + children;
        const nights = Math.max(days, 1);

        // Ticket prices per day (multi-day discounts applied)
        const ticketBase: Record<string, { adult: number; child: number }> = {
          wdw: { adult: 109, child: 104 },
          dl: { adult: 104, child: 98 },
          dlp: { adult: 87, child: 80 },
          tdr: { adult: 75, child: 50 },
        };

        const multiDayDiscount = days >= 4 ? 0.85 : days >= 2 ? 0.92 : 1.0;
        const base = ticketBase[park] || ticketBase.wdw;
        const adultTicketPerDay = base.adult * multiDayDiscount;
        const childTicketPerDay = base.child * multiDayDiscount;
        const totalTickets = (adultTicketPerDay * adults + childTicketPerDay * children) * days;

        // Hotel per night
        const hotelCosts: Record<string, Record<string, number>> = {
          wdw: { value: 120, moderate: 280, deluxe: 500 },
          dl: { value: 130, moderate: 300, deluxe: 550 },
          dlp: { value: 100, moderate: 250, deluxe: 450 },
          tdr: { value: 90, moderate: 200, deluxe: 400 },
        };

        const hotelPerNight = (hotelCosts[park] || hotelCosts.wdw)[hotelLevel] || 280;
        const totalHotel = hotelPerNight * nights;

        // Food per person per day
        const foodAdult = park === "tdr" ? 40 : 60;
        const foodChild = park === "tdr" ? 25 : 35;
        const totalFood = (foodAdult * adults + foodChild * children) * days;

        // Extras: Genie+/Lightning Lane, souvenirs, parking
        const geniePerPerson = 25;
        const totalGenie = geniePerPerson * totalPeople * days;
        const souvenirs = 30 * totalPeople;
        const parking = 30 * days;
        const totalExtras = totalGenie + souvenirs + parking;

        const grandTotal = totalTickets + totalHotel + totalFood + totalExtras;
        const perPerson = grandTotal / Math.max(totalPeople, 1);

        return {
          primary: { label: "Total Trip Cost", value: "$" + formatNumber(grandTotal, 2) },
          details: [
            { label: "Park Tickets", value: "$" + formatNumber(totalTickets, 2) },
            { label: "Hotel (" + nights + " nights)", value: "$" + formatNumber(totalHotel, 2) },
            { label: "Food & Dining", value: "$" + formatNumber(totalFood, 2) },
            { label: "Genie+ / Lightning Lane", value: "$" + formatNumber(totalGenie, 2) },
            { label: "Souvenirs (est.)", value: "$" + formatNumber(souvenirs, 2) },
            { label: "Parking", value: "$" + formatNumber(parking, 2) },
            { label: "Cost per Person", value: "$" + formatNumber(perPerson, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["beach-vacation-cost", "travel-budget-daily", "vacation-days-needed"],
  faq: [
    {
      question: "How much does a Disney World trip cost for a family of 4?",
      answer:
        "A typical 5-day Disney World trip for a family of 4 costs $4,000-$8,000 depending on hotel level and dining choices. Budget options start around $3,000, while deluxe resort stays can exceed $10,000.",
    },
    {
      question: "How can I save money on a Disney trip?",
      answer:
        "Book during value season (January-February, September), stay off-site, bring snacks into the park, skip Genie+ on less crowded days, and look for ticket package deals.",
    },
    {
      question: "Is Genie+ worth the cost?",
      answer:
        "Genie+ ($15-35/person/day) is worth it on crowded days as it saves 1-2 hours of waiting. On lighter crowd days, you may not need it. Lightning Lane for individual rides costs extra.",
    },
  ],
  formula:
    "Total = Tickets + Hotel + Food + Genie+ + Souvenirs + Parking\nTickets = (Adult Price x Adults + Child Price x Children) x Days x Multi-Day Discount",
};
