import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const roverPetSitterCalculator: CalculatorDefinition = {
  slug: "rover-pet-sitter-calculator",
  title: "Rover Pet Sitter Earnings Calculator",
  description:
    "Calculate your Rover.com net earnings after the 20% service fee and taxes. Find your optimal pricing for dog boarding, walking, and pet sitting.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Rover pet sitter calculator",
    "Rover earnings after fees",
    "how much does Rover take",
    "dog walker income calculator",
    "pet sitter net income Rover",
  ],
  variants: [
    {
      id: "boarding",
      name: "Pet Boarding & Sitting",
      description: "Calculate net income from Rover boarding and sitting",
      fields: [
        {
          name: "nightlyRate",
          label: "Your Nightly Rate",
          type: "number",
          placeholder: "e.g. 45",
          prefix: "$",
          suffix: "/night",
        },
        {
          name: "nightsPerMonth",
          label: "Nights Booked per Month",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "nights",
        },
        {
          name: "walkRate",
          label: "Dog Walk Rate (if applicable)",
          type: "number",
          placeholder: "e.g. 20",
          prefix: "$",
          suffix: "/walk",
          defaultValue: 0,
        },
        {
          name: "walksPerMonth",
          label: "Walks per Month",
          type: "number",
          placeholder: "e.g. 0",
          suffix: "walks",
          defaultValue: 0,
        },
        {
          name: "serviceType",
          label: "Primary Service",
          type: "select",
          options: [
            { label: "Dog Boarding (in your home)", value: "boarding" },
            { label: "House Sitting (at client home)", value: "housesit" },
            { label: "Drop-In Visits", value: "dropin" },
            { label: "Dog Walking", value: "walking" },
            { label: "Doggy Day Care", value: "daycare" },
          ],
          defaultValue: "boarding",
        },
      ],
      calculate: (inputs) => {
        const nightlyRate = parseFloat(inputs.nightlyRate as string) || 0;
        const nights = parseFloat(inputs.nightsPerMonth as string) || 0;
        const walkRate = parseFloat(inputs.walkRate as string) || 0;
        const walks = parseFloat(inputs.walksPerMonth as string) || 0;

        const roverFeeRate = 0.20; // Rover takes 20%
        const boardingGross = nightlyRate * nights;
        const walkingGross = walkRate * walks;
        const totalGross = boardingGross + walkingGross;

        const roverFee = totalGross * roverFeeRate;
        const netBeforeTax = totalGross - roverFee;

        // Supplies (food, cleaning, waste bags, etc.)
        const suppliesEstimate = nights * 2 + walks * 0.5;
        const netAfterSupplies = netBeforeTax - suppliesEstimate;

        const seTax = netAfterSupplies > 0 ? netAfterSupplies * 0.9235 * 0.153 : 0;
        const incomeTax = netAfterSupplies > 0 ? netAfterSupplies * 0.10 : 0;
        const netAfterTax = netAfterSupplies - seTax - incomeTax;

        const annualNet = netAfterTax * 12;

        // What to charge to net a target rate
        const targetHourly = 15; // target $15/hr net
        const requiredNightly = (targetHourly * 10) / (1 - roverFeeRate) / 0.75; // 10 hrs effort/night est.

        return {
          primary: { label: "Monthly Net Income", value: `$${formatNumber(netAfterTax, 2)}` },
          details: [
            { label: "Boarding revenue", value: `$${formatNumber(boardingGross, 2)}` },
            { label: "Walking revenue", value: `$${formatNumber(walkingGross, 2)}` },
            { label: "Total gross", value: `$${formatNumber(totalGross, 2)}` },
            { label: "Rover fee (20%)", value: `-$${formatNumber(roverFee, 2)}` },
            { label: "Supply costs (est.)", value: `-$${formatNumber(suppliesEstimate, 2)}` },
            { label: "Net before tax", value: `$${formatNumber(netAfterSupplies, 2)}` },
            { label: "SE + income tax", value: `-$${formatNumber(seTax + incomeTax, 2)}` },
            { label: "Monthly net take-home", value: `$${formatNumber(netAfterTax, 2)}` },
            { label: "Annual net income", value: `$${formatNumber(annualNet, 0)}` },
          ],
          note: "Rover's 20% fee is taken automatically before payment. Repeat clients can be moved to direct booking platforms (Time To Pet, etc.) to avoid fees after building trust.",
        };
      },
    },
  ],
  relatedSlugs: ["taskrabbit-pricing-calculator", "gig-worker-hourly-rate-calculator", "gig-worker-quarterly-tax-calculator"],
  faq: [
    {
      question: "How much does Rover take from pet sitters?",
      answer:
        "Rover charges pet sitters a 20% service fee on all bookings. If a client pays $50 for boarding, Rover keeps $10 and you receive $40. New sitters sometimes offer promotional rates to build reviews, accepting the lower net initially.",
    },
    {
      question: "How much can you make on Rover?",
      answer:
        "Active Rover sitters in urban areas earn $1,000–$3,000/month. Top sitters with 100+ reviews who board 2–3 dogs simultaneously can earn $4,000–$6,000/month. Dog boarding at $40–$60/night is the highest-income activity on the platform.",
    },
    {
      question: "Is Rover worth it compared to direct clients?",
      answer:
        "Rover is worth it for acquiring new clients and handling insurance/payment processing. Once you have trusted clients, consider moving some to direct booking to keep the 20% fee. Many established pet sitters use Rover for 30% of bookings (new clients) and direct booking for 70% (regulars).",
    },
  ],
  formula: "Net Monthly = (Boarding + Walking Revenue) × 80% (after Rover fee) − Supplies − Taxes",
};
