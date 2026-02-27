import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const movingTimelineCalculator: CalculatorDefinition = {
  slug: "moving-timeline",
  title: "Moving Timeline & Task Planner",
  description:
    "Plan your move with estimated timelines and cost calculations based on distance, home size, and moving method. Get a task breakdown for a stress-free move.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "moving",
    "relocation",
    "timeline",
    "moving cost",
    "packing",
    "movers",
    "truck rental",
    "cross-country",
    "local move",
    "planner",
  ],
  variants: [
    {
      slug: "cost-estimate",
      title: "Moving Cost Estimate",
      fields: [
        {
          name: "homeSize",
          label: "Home Size",
          type: "select",
          options: [
            { label: "Studio/1-Bedroom", value: "1" },
            { label: "2-Bedroom", value: "2" },
            { label: "3-Bedroom", value: "3" },
            { label: "4-Bedroom", value: "4" },
            { label: "5+ Bedroom", value: "5" },
          ],
        },
        {
          name: "distance",
          label: "Moving Distance (miles)",
          type: "number",
        },
        {
          name: "method",
          label: "Moving Method",
          type: "select",
          options: [
            { label: "Full-Service Movers", value: "full" },
            { label: "DIY Truck Rental", value: "diy" },
            { label: "Portable Container (PODS)", value: "container" },
          ],
        },
      ],
      calculate(inputs) {
        const bedrooms = parseFloat(inputs.homeSize as string);
        const distance = parseFloat(inputs.distance as string);
        const method = inputs.method as string;
        if (isNaN(bedrooms) || isNaN(distance))
          return { error: "Please enter valid inputs." };

        const isLocal = distance <= 100;
        const baseWeight = bedrooms * 2000;

        let cost: number;
        let packingCost: number;
        let insuranceCost: number;

        if (method === "full") {
          if (isLocal) {
            cost = bedrooms * 600 + 400;
          } else {
            cost = baseWeight * 0.5 + distance * 0.5 * bedrooms;
          }
          packingCost = bedrooms * 350;
          insuranceCost = cost * 0.03;
        } else if (method === "diy") {
          const truckCost = isLocal ? 50 + bedrooms * 20 : 800 + distance * 0.7;
          const fuelCost = (distance / 8) * 4;
          cost = truckCost + fuelCost;
          packingCost = bedrooms * 80;
          insuranceCost = 50;
        } else {
          cost = isLocal ? bedrooms * 300 + 200 : bedrooms * 500 + distance * 1.2;
          packingCost = bedrooms * 100;
          insuranceCost = cost * 0.02;
        }

        const tippingCost = method === "full" ? cost * 0.15 : 0;
        const totalCost = cost + packingCost + insuranceCost + tippingCost;

        const daysToMove = isLocal ? 1 : distance <= 500 ? 2 : distance <= 1500 ? 4 : 7;
        const weeksToPrep = bedrooms <= 2 ? 4 : bedrooms <= 3 ? 6 : 8;

        return {
          results: [
            { label: "Base Moving Cost", value: `$${formatNumber(cost)}` },
            { label: "Packing Materials/Service", value: `$${formatNumber(packingCost)}` },
            { label: "Insurance", value: `$${formatNumber(insuranceCost)}` },
            { label: "Tip (full-service only)", value: `$${formatNumber(tippingCost)}` },
            { label: "Total Estimated Cost", value: `$${formatNumber(totalCost)}` },
            { label: "Estimated Transit Days", value: formatNumber(daysToMove) },
            { label: "Recommended Prep Time", value: `${formatNumber(weeksToPrep)} weeks` },
          ],
        };
      },
    },
    {
      slug: "timeline-planner",
      title: "Moving Timeline Planner",
      fields: [
        {
          name: "weeksOut",
          label: "Weeks Until Move",
          type: "number",
        },
        {
          name: "homeSize",
          label: "Home Size",
          type: "select",
          options: [
            { label: "Small (Studio-2BR)", value: "small" },
            { label: "Medium (3BR)", value: "medium" },
            { label: "Large (4+ BR)", value: "large" },
          ],
        },
      ],
      calculate(inputs) {
        const weeks = parseFloat(inputs.weeksOut as string);
        const size = inputs.homeSize as string;
        if (isNaN(weeks)) return { error: "Please enter weeks until move." };

        const packingDays = size === "small" ? 3 : size === "medium" ? 7 : 14;
        const declutterDays = size === "small" ? 2 : size === "medium" ? 5 : 10;
        const idealPrepWeeks = size === "small" ? 4 : size === "medium" ? 6 : 8;
        const onTrack = weeks >= idealPrepWeeks ? "Yes - you have enough time" : "Tight - start immediately on key tasks";
        const urgency = weeks < 2 ? "Critical" : weeks < 4 ? "High" : weeks < 6 ? "Moderate" : "Comfortable";

        return {
          results: [
            { label: "Weeks Until Move", value: formatNumber(weeks) },
            { label: "Ideal Prep Time", value: `${formatNumber(idealPrepWeeks)} weeks` },
            { label: "On Track?", value: onTrack },
            { label: "Urgency Level", value: urgency },
            { label: "Packing Time Needed", value: `${formatNumber(packingDays)} days` },
            { label: "Decluttering Time", value: `${formatNumber(declutterDays)} days` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rent-to-income", "home-appraisal-value", "passport-renewal-time"],
  faq: [
    {
      question: "How much does a local move cost?",
      answer:
        "A local move (under 100 miles) with full-service movers typically costs $800-$2,500 for a 2-bedroom and $1,500-$4,000 for a 4-bedroom. DIY truck rental runs $100-$500. Costs depend on the volume of belongings, stairs, and additional services like packing.",
    },
    {
      question: "How far in advance should I plan a move?",
      answer:
        "For a local move, start planning 4-6 weeks ahead. For a long-distance move, begin 8-12 weeks in advance. Book movers at least 4-6 weeks ahead for local and 8+ weeks for long-distance, especially during peak summer season (May-September).",
    },
    {
      question: "What is the cheapest way to move long distance?",
      answer:
        "DIY truck rental is usually cheapest ($1,000-$3,000 cross-country), followed by portable containers like PODS ($2,000-$5,000), then full-service movers ($3,000-$10,000+). Shipping belongings via freight and driving yourself is another budget option.",
    },
  ],
  formula:
    "Full-Service (local) = Bedrooms x $600 + $400 | Full-Service (long) = Weight x $0.50 + Distance x $0.50 x Bedrooms | DIY = Truck Rental + Fuel (distance/8 mpg x $4/gal) | Packing + Insurance + Tips = Total",
};
