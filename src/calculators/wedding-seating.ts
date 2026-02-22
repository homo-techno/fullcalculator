import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingSeatingCalculator: CalculatorDefinition = {
  slug: "wedding-seating",
  title: "Wedding Seating Chart Calculator",
  description: "Free wedding seating chart calculator. Determine the number of tables, seats per table, and room layout needed for your wedding reception.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wedding seating", "seating chart", "table layout", "reception seating", "wedding tables"],
  variants: [
    {
      id: "roundTables",
      name: "Round Tables",
      fields: [
        { name: "guestCount", label: "Number of Guests", type: "number", placeholder: "e.g. 150" },
        { name: "seatsPerTable", label: "Seats Per Table", type: "select", options: [
          { label: "6 seats", value: "6" },
          { label: "8 seats", value: "8" },
          { label: "10 seats", value: "10" },
          { label: "12 seats", value: "12" },
        ] },
        { name: "headTableSeats", label: "Head Table Seats", type: "number", placeholder: "e.g. 10" },
        { name: "sqftPerGuest", label: "Sq Ft Per Guest", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const guestCount = (inputs.guestCount as number) || 0;
        const seatsPerTable = parseInt(inputs.seatsPerTable as string) || 8;
        const headTableSeats = (inputs.headTableSeats as number) || 0;
        const sqftPerGuest = (inputs.sqftPerGuest as number) || 12;
        if (guestCount <= 0) return null;
        const remainingGuests = guestCount - headTableSeats;
        const tablesNeeded = Math.ceil(remainingGuests / seatsPerTable);
        const totalTables = tablesNeeded + (headTableSeats > 0 ? 1 : 0);
        const totalSqFt = guestCount * sqftPerGuest;
        const emptySeats = (tablesNeeded * seatsPerTable) - remainingGuests;
        return {
          primary: { label: "Total Tables Needed", value: formatNumber(totalTables) },
          details: [
            { label: "Guest Tables", value: formatNumber(tablesNeeded) },
            { label: "Seats Per Table", value: formatNumber(seatsPerTable) },
            { label: "Head Table Seats", value: formatNumber(headTableSeats) },
            { label: "Empty Seats", value: formatNumber(emptySeats) },
            { label: "Min Room Size (sq ft)", value: formatNumber(totalSqFt) },
            { label: "Dance Floor Space (sq ft)", value: formatNumber(Math.ceil(guestCount * 4.5)) },
          ],
        };
      },
    },
    {
      id: "longTables",
      name: "Long/Banquet Tables",
      fields: [
        { name: "guestCount", label: "Number of Guests", type: "number", placeholder: "e.g. 120" },
        { name: "seatsPerSide", label: "Seats Per Side", type: "number", placeholder: "e.g. 10" },
        { name: "headTableSeats", label: "Head Table Seats", type: "number", placeholder: "e.g. 8" },
        { name: "sqftPerGuest", label: "Sq Ft Per Guest", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const guestCount = (inputs.guestCount as number) || 0;
        const seatsPerSide = (inputs.seatsPerSide as number) || 10;
        const headTableSeats = (inputs.headTableSeats as number) || 0;
        const sqftPerGuest = (inputs.sqftPerGuest as number) || 10;
        if (guestCount <= 0) return null;
        const seatsPerTable = seatsPerSide * 2;
        const remainingGuests = guestCount - headTableSeats;
        const tablesNeeded = Math.ceil(remainingGuests / seatsPerTable);
        const totalTables = tablesNeeded + (headTableSeats > 0 ? 1 : 0);
        const totalSqFt = guestCount * sqftPerGuest;
        return {
          primary: { label: "Total Tables Needed", value: formatNumber(totalTables) },
          details: [
            { label: "Guest Tables", value: formatNumber(tablesNeeded) },
            { label: "Seats Per Table", value: formatNumber(seatsPerTable) },
            { label: "Table Length (ft)", value: formatNumber(seatsPerSide * 2) },
            { label: "Min Room Size (sq ft)", value: formatNumber(totalSqFt) },
            { label: "Empty Seats", value: formatNumber((tablesNeeded * seatsPerTable) - remainingGuests) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wedding-guest-list", "event-space-capacity", "catering-quantity"],
  faq: [
    { question: "How much space per guest at a wedding?", answer: "Plan for 10-12 square feet per guest for seated dining with round tables. For banquet-style seating, 8-10 square feet per guest is usually sufficient." },
    { question: "What is the ideal table size for a wedding?", answer: "Round tables seating 8-10 guests are the most popular choice. They facilitate conversation and fit well in most venues." },
  ],
  formula: "Tables Needed = ceil((Total Guests - Head Table) / Seats Per Table)",
};
