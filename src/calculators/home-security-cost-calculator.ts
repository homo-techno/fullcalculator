import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeSecurityCostCalculator: CalculatorDefinition = {
  slug: "home-security-cost-calculator",
  title: "Home Security Cost Calculator",
  description: "Estimate the cost of a home security system including equipment, installation, and monitoring.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["home security cost", "security system cost", "home alarm cost"],
  variants: [{
    id: "standard",
    name: "Home Security Cost",
    description: "Estimate the cost of a home security system including equipment, installation, and monitoring",
    fields: [
      { name: "type", label: "System Type", type: "select", options: [{value:"diy",label:"DIY Wireless"},{value:"professional",label:"Professional Install"},{value:"smart",label:"Smart Home Integrated"}], defaultValue: "professional" },
      { name: "cameras", label: "Number of Cameras", type: "number", suffix: "cameras", min: 0, max: 20, defaultValue: 4 },
      { name: "sensors", label: "Door/Window Sensors", type: "number", suffix: "sensors", min: 2, max: 30, defaultValue: 8 },
      { name: "monitoring", label: "Monitoring Plan", type: "select", options: [{value:"self",label:"Self-Monitoring"},{value:"basic",label:"Basic ($20/mo)"},{value:"premium",label:"Premium ($40/mo)"}], defaultValue: "basic" },
    ],
    calculate: (inputs) => {
      const type = inputs.type as string;
      const cameras = inputs.cameras as number;
      const sensors = inputs.sensors as number;
      const monitoring = inputs.monitoring as string;
      if (sensors < 0 || cameras < 0) return null;
      const panelCost: Record<string, number> = { diy: 200, professional: 400, smart: 600 };
      const cameraRate: Record<string, number> = { diy: 80, professional: 150, smart: 200 };
      const sensorRate: Record<string, number> = { diy: 20, professional: 30, smart: 40 };
      const installCost: Record<string, number> = { diy: 0, professional: 200, smart: 300 };
      const monthlyRate: Record<string, number> = { self: 0, basic: 20, premium: 40 };
      const panel = panelCost[type] || 400;
      const cams = cameras * (cameraRate[type] || 150);
      const sens = sensors * (sensorRate[type] || 30);
      const install = installCost[type] || 200;
      const monthly = monthlyRate[monitoring] || 20;
      const annual = monthly * 12;
      const upfront = panel + cams + sens + install;
      const threeYear = upfront + (annual * 3);
      return {
        primary: { label: "Upfront Equipment Cost", value: "$" + formatNumber(upfront) },
        details: [
          { label: "Control Panel", value: "$" + formatNumber(panel) },
          { label: "Cameras (" + cameras + ")", value: "$" + formatNumber(cams) },
          { label: "Sensors (" + sensors + ")", value: "$" + formatNumber(sens) },
          { label: "Installation", value: "$" + formatNumber(install) },
          { label: "Monthly Monitoring", value: "$" + formatNumber(monthly) + "/mo" },
          { label: "3-Year Total Cost", value: "$" + formatNumber(threeYear) },
        ],
      };
    },
  }],
  relatedSlugs: ["carport-cost-calculator", "sunroom-cost-calculator"],
  faq: [
    { question: "How much does a home security system cost?", answer: "A DIY system costs $200 to $600 upfront. Professional systems cost $500 to $1,500 plus $20 to $50 per month for monitoring. Smart integrated systems cost $800 to $2,500." },
    { question: "Is professional monitoring worth it?", answer: "Professional monitoring provides 24/7 dispatch services and can lower homeowner insurance premiums by 5 to 20 percent, which can offset the monthly cost over time." },
  ],
  formula: "Upfront = Panel + (Cameras x Rate) + (Sensors x Rate) + Installation; 3-Year = Upfront + (Monthly x 36)",
};
