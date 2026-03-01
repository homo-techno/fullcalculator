import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeElevatorCostCalculator: CalculatorDefinition = {
  slug: "home-elevator-cost-calculator",
  title: "Home Elevator Cost Calculator",
  description: "Estimate the cost of installing a residential elevator including the unit, shaft construction, and permits.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["home elevator cost", "residential elevator cost", "house elevator cost"],
  variants: [{
    id: "standard",
    name: "Home Elevator Cost",
    description: "Estimate the cost of installing a residential elevator including the unit, shaft construction, and permits",
    fields: [
      { name: "type", label: "Elevator Type", type: "select", options: [{value:"hydraulic",label:"Hydraulic"},{value:"traction",label:"Traction/Cable"},{value:"pneumatic",label:"Pneumatic (Vacuum)"}], defaultValue: "hydraulic" },
      { name: "floors", label: "Number of Floors", type: "select", options: [{value:"2",label:"2 Floors"},{value:"3",label:"3 Floors"},{value:"4",label:"4 Floors"}], defaultValue: "2" },
      { name: "finish", label: "Cab Finish", type: "select", options: [{value:"standard",label:"Standard"},{value:"custom",label:"Custom Wood"},{value:"luxury",label:"Luxury (glass/steel)"}], defaultValue: "standard" },
    ],
    calculate: (inputs) => {
      const type = inputs.type as string;
      const floors = parseInt(inputs.floors as string) || 2;
      const finish = inputs.finish as string;
      const unitCost: Record<string, number> = { hydraulic: 30000, traction: 25000, pneumatic: 35000 };
      const floorAdd: Record<string, number> = { hydraulic: 10000, traction: 8000, pneumatic: 12000 };
      const finishCost: Record<string, number> = { standard: 0, custom: 5000, luxury: 15000 };
      const base = unitCost[type] || 30000;
      const extraFloors = (floors - 2) * (floorAdd[type] || 10000);
      const cab = finishCost[finish] || 0;
      const shaft = floors * 8000;
      const electrical = 3000;
      const permits = 2000;
      const total = base + extraFloors + cab + shaft + electrical + permits;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Elevator Unit", value: "$" + formatNumber(base + extraFloors) },
          { label: "Cab Finish Upgrade", value: "$" + formatNumber(cab) },
          { label: "Shaft Construction", value: "$" + formatNumber(shaft) },
          { label: "Electrical Work", value: "$" + formatNumber(electrical) },
          { label: "Permits and Inspection", value: "$" + formatNumber(permits) },
        ],
      };
    },
  }],
  relatedSlugs: ["sunroom-cost-calculator", "carport-cost-calculator"],
  faq: [
    { question: "How much does a home elevator cost?", answer: "A residential elevator typically costs $30,000 to $70,000 installed. Pneumatic vacuum elevators cost $35,000 to $60,000. Luxury custom elevators can exceed $100,000." },
    { question: "Does a home elevator add property value?", answer: "A home elevator can increase property value by 10 percent and makes the home accessible to aging-in-place residents and buyers with mobility needs." },
  ],
  formula: "Total = Elevator Unit + Extra Floors + Cab Finish + Shaft + Electrical + Permits",
};
