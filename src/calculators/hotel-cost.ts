import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hotelCostCalculator: CalculatorDefinition = {
  slug: "hotel-cost-calculator",
  title: "Hotel Cost Comparison Calculator",
  description:
    "Free hotel cost comparison calculator. Compare total hotel stay costs including taxes, resort fees, and parking to find the best deal.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "hotel cost",
    "hotel comparison",
    "hotel price",
    "accommodation cost",
    "hotel total cost",
  ],
  variants: [
    {
      id: "total",
      name: "Total Hotel Stay Cost",
      description: "Calculate total cost including all fees and taxes",
      fields: [
        {
          name: "nightlyRate",
          label: "Nightly Rate ($)",
          type: "number",
          placeholder: "e.g. 150",
        },
        {
          name: "nights",
          label: "Number of Nights",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "taxRate",
          label: "Tax Rate (%)",
          type: "number",
          placeholder: "e.g. 13",
          step: 0.1,
        },
        {
          name: "resortFee",
          label: "Daily Resort/Amenity Fee ($)",
          type: "number",
          placeholder: "e.g. 35",
        },
        {
          name: "parkingFee",
          label: "Daily Parking Fee ($)",
          type: "number",
          placeholder: "e.g. 25",
        },
        {
          name: "rooms",
          label: "Number of Rooms",
          type: "select",
          options: [
            { label: "1 room", value: "1" },
            { label: "2 rooms", value: "2" },
            { label: "3 rooms", value: "3" },
            { label: "4 rooms", value: "4" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const nightlyRate = inputs.nightlyRate as number;
        const nights = inputs.nights as number;
        const taxRate = (inputs.taxRate as number) || 0;
        const resortFee = (inputs.resortFee as number) || 0;
        const parkingFee = (inputs.parkingFee as number) || 0;
        const rooms = parseInt(inputs.rooms as string) || 1;
        if (!nightlyRate || !nights || nightlyRate <= 0 || nights <= 0) return null;

        const subtotal = nightlyRate * nights * rooms;
        const taxAmount = subtotal * (taxRate / 100);
        const totalResortFees = resortFee * nights * rooms;
        const totalParkingFees = parkingFee * nights;
        const grandTotal = subtotal + taxAmount + totalResortFees + totalParkingFees;
        const effectiveNightly = grandTotal / nights / rooms;
        const perNightWithFees = nightlyRate + resortFee + parkingFee / rooms;
        const perNightWithTax = perNightWithFees * (1 + taxRate / 100);

        return {
          primary: {
            label: "Total Stay Cost",
            value: `$${formatNumber(grandTotal, 2)}`,
          },
          details: [
            { label: "Room subtotal", value: `$${formatNumber(subtotal, 2)}` },
            { label: "Taxes", value: `$${formatNumber(taxAmount, 2)} (${formatNumber(taxRate, 1)}%)` },
            { label: "Resort fees", value: `$${formatNumber(totalResortFees, 2)}` },
            { label: "Parking fees", value: `$${formatNumber(totalParkingFees, 2)}` },
            { label: "Grand total", value: `$${formatNumber(grandTotal, 2)}` },
            { label: "Effective nightly rate", value: `$${formatNumber(effectiveNightly, 2)}/night` },
            { label: "True cost per night (with tax)", value: `$${formatNumber(perNightWithTax, 2)}` },
          ],
          note: `The advertised rate of $${formatNumber(nightlyRate, 2)}/night actually costs $${formatNumber(effectiveNightly, 2)}/night after all fees and taxes - that's ${formatNumber(((effectiveNightly - nightlyRate) / nightlyRate) * 100, 1)}% more.`,
        };
      },
    },
    {
      id: "compare",
      name: "Compare Two Hotels",
      description: "Compare total costs of two hotel options",
      fields: [
        {
          name: "nights",
          label: "Number of Nights",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "hotel1Rate",
          label: "Hotel A - Nightly Rate ($)",
          type: "number",
          placeholder: "e.g. 120",
        },
        {
          name: "hotel1Fees",
          label: "Hotel A - Daily Fees ($)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "hotel2Rate",
          label: "Hotel B - Nightly Rate ($)",
          type: "number",
          placeholder: "e.g. 160",
        },
        {
          name: "hotel2Fees",
          label: "Hotel B - Daily Fees ($)",
          type: "number",
          placeholder: "e.g. 0",
        },
        {
          name: "taxRate",
          label: "Tax Rate (%)",
          type: "number",
          placeholder: "e.g. 13",
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const nights = inputs.nights as number;
        const rate1 = inputs.hotel1Rate as number;
        const fees1 = (inputs.hotel1Fees as number) || 0;
        const rate2 = inputs.hotel2Rate as number;
        const fees2 = (inputs.hotel2Fees as number) || 0;
        const tax = (inputs.taxRate as number) || 0;
        if (!nights || !rate1 || !rate2) return null;

        const total1 = (rate1 * nights + fees1 * nights) * (1 + tax / 100);
        const total2 = (rate2 * nights + fees2 * nights) * (1 + tax / 100);
        const diff = Math.abs(total1 - total2);
        const cheaper = total1 < total2 ? "Hotel A" : "Hotel B";

        return {
          primary: {
            label: `${cheaper} is Cheaper`,
            value: `Save $${formatNumber(diff, 2)}`,
          },
          details: [
            { label: "Hotel A total", value: `$${formatNumber(total1, 2)}` },
            { label: "Hotel A per night (true)", value: `$${formatNumber(total1 / nights, 2)}` },
            { label: "Hotel B total", value: `$${formatNumber(total2, 2)}` },
            { label: "Hotel B per night (true)", value: `$${formatNumber(total2 / nights, 2)}` },
            { label: "Difference", value: `$${formatNumber(diff, 2)}` },
            { label: "Better deal", value: cheaper },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["airbnb-calculator", "travel-budget-calculator"],
  faq: [
    {
      question: "What hidden fees should I watch for at hotels?",
      answer:
        "Common hidden fees include resort fees ($15-$50/night), parking ($15-$60/night), Wi-Fi charges, minibar restocking fees, early check-in/late check-out fees, and tourism/occupancy taxes. Always ask for the total cost including all fees before booking.",
    },
    {
      question: "How much are hotel taxes typically?",
      answer:
        "Hotel taxes vary widely: US cities charge 10-18% (New York City is around 14.75%), European cities charge 5-15% plus city tourist taxes of 1-7 euros per night, and some destinations like the Maldives or Cancun add additional tourism levies.",
    },
    {
      question: "When is the cheapest time to book a hotel?",
      answer:
        "Generally, booking 1-3 months in advance for domestic travel and 2-5 months ahead for international trips gets the best rates. Tuesdays and Wednesdays often have lower prices. Avoid booking during holidays, conventions, and peak tourist season.",
    },
  ],
  formula:
    "Total = (Nightly Rate x Nights x Rooms) x (1 + Tax%) + (Resort Fee x Nights x Rooms) + (Parking x Nights).",
};
