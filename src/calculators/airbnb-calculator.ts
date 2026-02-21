import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airbnbCalculator: CalculatorDefinition = {
  slug: "airbnb-calculator",
  title: "Airbnb Pricing Calculator",
  description:
    "Free Airbnb pricing calculator. Estimate total Airbnb stay costs including service fees, cleaning fees, and taxes, or calculate hosting income.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "airbnb cost",
    "airbnb pricing",
    "airbnb fees",
    "vacation rental cost",
    "airbnb calculator",
  ],
  variants: [
    {
      id: "guest",
      name: "Guest Total Cost",
      description: "Calculate total Airbnb cost as a guest",
      fields: [
        {
          name: "nightlyRate",
          label: "Nightly Rate ($)",
          type: "number",
          placeholder: "e.g. 120",
        },
        {
          name: "nights",
          label: "Number of Nights",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "cleaningFee",
          label: "Cleaning Fee ($)",
          type: "number",
          placeholder: "e.g. 75",
        },
        {
          name: "serviceFeePercent",
          label: "Airbnb Service Fee (%)",
          type: "number",
          placeholder: "e.g. 14",
          step: 0.1,
          defaultValue: 14,
        },
        {
          name: "taxPercent",
          label: "Local Tax Rate (%)",
          type: "number",
          placeholder: "e.g. 12",
          step: 0.1,
        },
        {
          name: "guests",
          label: "Number of Guests",
          type: "select",
          options: [
            { label: "1 guest", value: "1" },
            { label: "2 guests", value: "2" },
            { label: "3 guests", value: "3" },
            { label: "4 guests", value: "4" },
            { label: "5 guests", value: "5" },
            { label: "6+ guests", value: "6" },
          ],
          defaultValue: "2",
        },
      ],
      calculate: (inputs) => {
        const nightlyRate = inputs.nightlyRate as number;
        const nights = inputs.nights as number;
        const cleaningFee = (inputs.cleaningFee as number) || 0;
        const serviceFeePercent = (inputs.serviceFeePercent as number) || 14;
        const taxPercent = (inputs.taxPercent as number) || 0;
        const guests = parseInt(inputs.guests as string) || 2;
        if (!nightlyRate || !nights || nightlyRate <= 0 || nights <= 0) return null;

        const accommodationSubtotal = nightlyRate * nights;
        const serviceFee = accommodationSubtotal * (serviceFeePercent / 100);
        const subtotalBeforeTax = accommodationSubtotal + cleaningFee + serviceFee;
        const taxAmount = subtotalBeforeTax * (taxPercent / 100);
        const grandTotal = subtotalBeforeTax + taxAmount;
        const perNight = grandTotal / nights;
        const perGuestPerNight = perNight / guests;

        return {
          primary: {
            label: "Total Airbnb Cost",
            value: `$${formatNumber(grandTotal, 2)}`,
          },
          details: [
            { label: "Accommodation", value: `$${formatNumber(accommodationSubtotal, 2)} (${nights} nights x $${formatNumber(nightlyRate, 2)})` },
            { label: "Cleaning fee", value: `$${formatNumber(cleaningFee, 2)}` },
            { label: "Service fee", value: `$${formatNumber(serviceFee, 2)} (${formatNumber(serviceFeePercent, 1)}%)` },
            { label: "Taxes", value: `$${formatNumber(taxAmount, 2)} (${formatNumber(taxPercent, 1)}%)` },
            { label: "Grand total", value: `$${formatNumber(grandTotal, 2)}` },
            { label: "True cost per night", value: `$${formatNumber(perNight, 2)}/night` },
            { label: "Per guest per night", value: `$${formatNumber(perGuestPerNight, 2)}/person/night` },
          ],
          note: `The listed $${formatNumber(nightlyRate, 2)}/night actually costs $${formatNumber(perNight, 2)}/night after fees and taxes. Fees add ${formatNumber(((perNight - nightlyRate) / nightlyRate) * 100, 1)}% to the advertised rate.`,
        };
      },
    },
    {
      id: "host",
      name: "Host Earnings Estimate",
      description: "Estimate your earnings as an Airbnb host",
      fields: [
        {
          name: "nightlyRate",
          label: "Nightly Rate You Set ($)",
          type: "number",
          placeholder: "e.g. 120",
        },
        {
          name: "occupancyRate",
          label: "Expected Occupancy Rate",
          type: "select",
          options: [
            { label: "30% (low)", value: "30" },
            { label: "50% (average)", value: "50" },
            { label: "65% (good)", value: "65" },
            { label: "80% (high)", value: "80" },
            { label: "90% (very high)", value: "90" },
          ],
          defaultValue: "65",
        },
        {
          name: "hostFeePercent",
          label: "Airbnb Host Fee (%)",
          type: "number",
          placeholder: "e.g. 3",
          step: 0.1,
          defaultValue: 3,
        },
        {
          name: "monthlyCosts",
          label: "Monthly Costs (utilities, cleaning, etc.)",
          type: "number",
          placeholder: "e.g. 500",
        },
      ],
      calculate: (inputs) => {
        const nightlyRate = inputs.nightlyRate as number;
        const occupancy = parseInt(inputs.occupancyRate as string) || 65;
        const hostFee = (inputs.hostFeePercent as number) || 3;
        const monthlyCosts = (inputs.monthlyCosts as number) || 0;
        if (!nightlyRate || nightlyRate <= 0) return null;

        const daysPerMonth = 30;
        const bookedNights = Math.round(daysPerMonth * (occupancy / 100));
        const grossRevenue = nightlyRate * bookedNights;
        const airbnbFee = grossRevenue * (hostFee / 100);
        const netRevenue = grossRevenue - airbnbFee;
        const monthlyProfit = netRevenue - monthlyCosts;
        const annualProfit = monthlyProfit * 12;

        return {
          primary: {
            label: "Monthly Net Income",
            value: `$${formatNumber(monthlyProfit, 2)}`,
          },
          details: [
            { label: "Booked nights/month", value: `${bookedNights} nights` },
            { label: "Gross monthly revenue", value: `$${formatNumber(grossRevenue, 2)}` },
            { label: "Airbnb host fee", value: `$${formatNumber(airbnbFee, 2)} (${formatNumber(hostFee, 1)}%)` },
            { label: "Net after Airbnb fee", value: `$${formatNumber(netRevenue, 2)}` },
            { label: "Monthly costs", value: `$${formatNumber(monthlyCosts, 2)}` },
            { label: "Monthly profit", value: `$${formatNumber(monthlyProfit, 2)}` },
            { label: "Annual profit", value: `$${formatNumber(annualProfit, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hotel-cost-calculator", "travel-budget-calculator"],
  faq: [
    {
      question: "What fees does Airbnb charge guests?",
      answer:
        "Airbnb typically charges guests a service fee of 14-16% of the booking subtotal. Additionally, hosts may add cleaning fees (often $50-$150), and local occupancy taxes apply in many jurisdictions. The total cost is usually 20-35% more than the listed nightly rate.",
    },
    {
      question: "How much does Airbnb take from hosts?",
      answer:
        "Under the split-fee model, Airbnb charges hosts 3% per booking. Under the host-only fee model (common outside the US), hosts pay 14-16%. Hosts should factor in cleaning costs, supplies, maintenance, insurance, and utilities when calculating profitability.",
    },
    {
      question: "Is Airbnb cheaper than a hotel?",
      answer:
        "Airbnb can be cheaper for longer stays and group travel since you can split costs and cook meals. For short 1-2 night stays, hotels are often cheaper once Airbnb cleaning fees are factored in. Always compare the total cost including all fees.",
    },
  ],
  formula:
    "Guest Total = (Nightly Rate x Nights) + Cleaning Fee + Service Fee (14%) + Taxes; Host Income = Gross Revenue - Airbnb Fee (3%) - Costs.",
};
