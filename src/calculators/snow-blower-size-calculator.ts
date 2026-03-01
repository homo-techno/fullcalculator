import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const snowBlowerSizeCalculator: CalculatorDefinition = {
  slug: "snow-blower-size-calculator",
  title: "Snow Blower Size Calculator",
  description: "Determine the right snow blower size and type based on driveway dimensions and snowfall amounts.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["snow blower size", "snowblower sizing", "snow thrower selection"],
  variants: [{
    id: "standard",
    name: "Snow Blower Size",
    description: "Determine the right snow blower size and type based on driveway dimensions and snowfall amounts",
    fields: [
      { name: "drivewayLength", label: "Driveway Length", type: "number", suffix: "feet", min: 10, max: 500, defaultValue: 50 },
      { name: "drivewayWidth", label: "Driveway Width", type: "number", suffix: "feet", min: 5, max: 100, defaultValue: 20 },
      { name: "avgSnowfall", label: "Average Snowfall per Event", type: "number", suffix: "inches", min: 1, max: 36, defaultValue: 8 },
      { name: "surface", label: "Surface Type", type: "select", options: [{value:"paved",label:"Paved/Concrete"},{value:"gravel",label:"Gravel"},{value:"mixed",label:"Mixed"}], defaultValue: "paved" },
    ],
    calculate: (inputs) => {
      const length = inputs.drivewayLength as number;
      const width = inputs.drivewayWidth as number;
      const snow = inputs.avgSnowfall as number;
      const surface = inputs.surface as string;
      if (!length || !width || !snow) return null;
      const area = length * width;
      let type = "Single-Stage Electric";
      let clearWidth = 18;
      let priceRange = "$150-$300";
      if (area > 4000 || snow > 12) {
        type = "Three-Stage Gas";
        clearWidth = 30;
        priceRange = "$1,200-$2,500";
      } else if (area > 2000 || snow > 8) {
        type = "Two-Stage Gas";
        clearWidth = 26;
        priceRange = "$600-$1,500";
      } else if (area > 800 || snow > 6) {
        type = "Single-Stage Gas";
        clearWidth = 22;
        priceRange = "$300-$600";
      }
      if (surface === "gravel") type += " (with skid shoes)";
      const passes = Math.ceil(width / (clearWidth / 12));
      return {
        primary: { label: "Recommended Type", value: type },
        details: [
          { label: "Clearing Width", value: clearWidth + " inches" },
          { label: "Passes Needed", value: String(passes) },
          { label: "Price Range", value: priceRange },
        ],
      };
    },
  }],
  relatedSlugs: ["snow-load-roof-calculator", "ice-dam-prevention-calculator"],
  faq: [
    { question: "What size snow blower do I need?", answer: "For small driveways with light snow, a single-stage electric is sufficient. Large driveways with heavy snowfall need a two-stage or three-stage gas model." },
    { question: "Can I use a snow blower on gravel?", answer: "Two-stage snow blowers work on gravel because the auger does not touch the ground. Single-stage models can pick up rocks and should be avoided on gravel." },
  ],
  formula: "Type = Based on Driveway Area and Average Snowfall Depth",
};
