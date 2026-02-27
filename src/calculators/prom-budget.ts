import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const promBudgetCalculator: CalculatorDefinition = {
  slug: "prom-budget-calculator",
  title: "Prom Budget Calculator",
  description:
    "Calculate the total cost of prom including attire, tickets, transportation, dinner, and accessories. Plan your prom budget so there are no surprises.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "prom budget",
    "prom cost",
    "prom expenses",
    "prom dress cost",
    "prom tuxedo",
  ],
  variants: [
    {
      id: "fullBreakdown",
      name: "Full Prom Budget",
      description: "Calculate all prom-related expenses",
      fields: [
        { name: "ticketCost", label: "Prom Ticket ($)", type: "number", placeholder: "e.g. 75", defaultValue: 75 },
        { name: "attireCost", label: "Dress/Tux ($)", type: "number", placeholder: "e.g. 200", defaultValue: 200 },
        { name: "shoes", label: "Shoes ($)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "hairMakeup", label: "Hair & Makeup ($)", type: "number", placeholder: "e.g. 80", defaultValue: 80 },
        { name: "accessories", label: "Accessories/Jewelry ($)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
        { name: "corsageBoutonniere", label: "Corsage/Boutonniere ($)", type: "number", placeholder: "e.g. 35", defaultValue: 35 },
        { name: "dinnerCost", label: "Pre-Prom Dinner ($)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "transportCost", label: "Transportation (limo share) ($)", type: "number", placeholder: "e.g. 60", defaultValue: 60 },
        { name: "photos", label: "Photos ($)", type: "number", placeholder: "e.g. 25", defaultValue: 25 },
        { name: "afterParty", label: "After-Prom Activities ($)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
      ],
      calculate: (inputs) => {
        const ticketCost = parseFloat(inputs.ticketCost as string) || 0;
        const attireCost = parseFloat(inputs.attireCost as string) || 0;
        const shoes = parseFloat(inputs.shoes as string) || 0;
        const hairMakeup = parseFloat(inputs.hairMakeup as string) || 0;
        const accessories = parseFloat(inputs.accessories as string) || 0;
        const corsageBoutonniere = parseFloat(inputs.corsageBoutonniere as string) || 0;
        const dinnerCost = parseFloat(inputs.dinnerCost as string) || 0;
        const transportCost = parseFloat(inputs.transportCost as string) || 0;
        const photos = parseFloat(inputs.photos as string) || 0;
        const afterParty = parseFloat(inputs.afterParty as string) || 0;

        const attireTotal = attireCost + shoes + hairMakeup + accessories;
        const eventTotal = ticketCost + corsageBoutonniere + dinnerCost + transportCost + photos + afterParty;
        const grandTotal = attireTotal + eventTotal;

        if (grandTotal <= 0) return null;

        return {
          primary: { label: "Total Prom Cost", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Attire & Grooming", value: `$${formatNumber(attireTotal, 2)}` },
            { label: "Event & Activities", value: `$${formatNumber(eventTotal, 2)}` },
            { label: "Ticket", value: `$${formatNumber(ticketCost, 2)}` },
            { label: "Dress/Tux", value: `$${formatNumber(attireCost, 2)}` },
            { label: "Hair & Makeup", value: `$${formatNumber(hairMakeup, 2)}` },
            { label: "Transportation", value: `$${formatNumber(transportCost, 2)}` },
            { label: "Dinner", value: `$${formatNumber(dinnerCost, 2)}` },
          ],
        };
      },
    },
    {
      id: "coupleVsSolo",
      name: "Couple vs Solo Cost",
      description: "Compare prom costs when going as a couple vs solo",
      fields: [
        { name: "ticketSingle", label: "Single Ticket ($)", type: "number", placeholder: "e.g. 75", defaultValue: 75 },
        { name: "ticketCouple", label: "Couple Ticket ($)", type: "number", placeholder: "e.g. 130", defaultValue: 130 },
        { name: "attirePerson1", label: "Person 1 Attire ($)", type: "number", placeholder: "e.g. 250", defaultValue: 250 },
        { name: "attirePerson2", label: "Person 2 Attire ($)", type: "number", placeholder: "e.g. 150", defaultValue: 150 },
        { name: "sharedDinner", label: "Shared Dinner ($)", type: "number", placeholder: "e.g. 80", defaultValue: 80 },
        { name: "sharedTransport", label: "Shared Transport ($)", type: "number", placeholder: "e.g. 100", defaultValue: 100 },
        { name: "corsages", label: "Corsage + Boutonniere ($)", type: "number", placeholder: "e.g. 60", defaultValue: 60 },
      ],
      calculate: (inputs) => {
        const ticketSingle = parseFloat(inputs.ticketSingle as string) || 0;
        const ticketCouple = parseFloat(inputs.ticketCouple as string) || 0;
        const attirePerson1 = parseFloat(inputs.attirePerson1 as string) || 0;
        const attirePerson2 = parseFloat(inputs.attirePerson2 as string) || 0;
        const sharedDinner = parseFloat(inputs.sharedDinner as string) || 0;
        const sharedTransport = parseFloat(inputs.sharedTransport as string) || 0;
        const corsages = parseFloat(inputs.corsages as string) || 0;

        const soloTotal = ticketSingle + attirePerson1 + (sharedDinner / 2) + (sharedTransport / 2);
        const coupleTotal = ticketCouple + attirePerson1 + attirePerson2 + sharedDinner + sharedTransport + corsages;
        const couplePerPerson = coupleTotal / 2;

        return {
          primary: { label: "Couple Total Cost", value: `$${formatNumber(coupleTotal, 2)}` },
          details: [
            { label: "Solo Total", value: `$${formatNumber(soloTotal, 2)}` },
            { label: "Couple per Person", value: `$${formatNumber(couplePerPerson, 2)}` },
            { label: "Couple Ticket Savings", value: `$${formatNumber((ticketSingle * 2) - ticketCouple, 2)}` },
            { label: "Corsage + Boutonniere", value: `$${formatNumber(corsages, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["back-to-school-cost-calculator", "budget-calculator", "valentines-date-cost-calculator"],
  faq: [
    {
      question: "How much does prom cost on average?",
      answer:
        "The average prom costs $500-$1,000 per person. Major expenses include attire ($150-$500), tickets ($50-$150), dinner ($30-$100), transportation ($40-$100), and hair/makeup ($50-$150). Costs vary widely by region.",
    },
    {
      question: "How can I save money on prom?",
      answer:
        "Rent or borrow a dress/tux, do hair and makeup with friends, share limo costs with a group, cook dinner together instead of going out, and watch for prom ticket early-bird discounts. Thrift stores can have amazing formal wear.",
    },
    {
      question: "What hidden prom costs should I plan for?",
      answer:
        "Often-forgotten expenses include alterations ($20-$80), undergarments/shapewear ($20-$50), after-prom activities ($20-$60), pre-prom party contributions, and tanning or other grooming services.",
    },
  ],
  formula:
    "Total = Ticket + Attire + Shoes + Hair/Makeup + Accessories + Corsage + Dinner + Transport + Photos + After-Party",
};
