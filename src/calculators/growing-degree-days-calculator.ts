import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const growingDegreeDaysCalculator: CalculatorDefinition = {
  slug: "growing-degree-days-calculator",
  title: "Growing Degree Days Calculator",
  description: "Calculate accumulated growing degree days for crop planning based on daily temperatures and base temperature for your crop type.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["growing degree days","gdd calculator","crop heat units","planting calculator","agriculture degree days"],
  variants: [{
    id: "standard",
    name: "Growing Degree Days",
    description: "Calculate accumulated growing degree days for crop planning based on daily temperatures and base temperature for your crop type.",
    fields: [
      { name: "avgHighTemp", label: "Average Daily High (°F)", type: "number", min: 30, max: 120, defaultValue: 78 },
      { name: "avgLowTemp", label: "Average Daily Low (°F)", type: "number", min: 10, max: 90, defaultValue: 55 },
      { name: "baseTemp", label: "Base Temperature (°F)", type: "number", min: 32, max: 65, defaultValue: 50 },
      { name: "daysInPeriod", label: "Growing Period (days)", type: "number", min: 1, max: 365, defaultValue: 120 },
    ],
    calculate: (inputs) => {
    const avgHighTemp = inputs.avgHighTemp as number;
    const avgLowTemp = inputs.avgLowTemp as number;
    const baseTemp = inputs.baseTemp as number;
    const daysInPeriod = inputs.daysInPeriod as number;
    const dailyAvg = (avgHighTemp + avgLowTemp) / 2;
    const dailyGDD = Math.max(dailyAvg - baseTemp, 0);
    const totalGDD = dailyGDD * daysInPeriod;
    const cornMaturity = 2700;
    const tomatoMaturity = 1400;
    const wheatMaturity = 2000;
    const cornDays = dailyGDD > 0 ? Math.round(cornMaturity / dailyGDD) : 0;
    const tomatoDays = dailyGDD > 0 ? Math.round(tomatoMaturity / dailyGDD) : 0;
    const wheatDays = dailyGDD > 0 ? Math.round(wheatMaturity / dailyGDD) : 0;
    return {
      primary: { label: "Total GDD Accumulated", value: formatNumber(Math.round(totalGDD)) + " GDD" },
      details: [
        { label: "Daily GDD", value: formatNumber(Math.round(dailyGDD * 10) / 10) },
        { label: "Daily Average Temperature", value: formatNumber(Math.round(dailyAvg * 10) / 10) + " °F" },
        { label: "Corn Maturity (2700 GDD)", value: cornDays > 0 ? formatNumber(cornDays) + " days" : "Insufficient heat" },
        { label: "Tomato Maturity (1400 GDD)", value: tomatoDays > 0 ? formatNumber(tomatoDays) + " days" : "Insufficient heat" },
        { label: "Wheat Maturity (2000 GDD)", value: wheatDays > 0 ? formatNumber(wheatDays) + " days" : "Insufficient heat" }
      ]
    };
  },
  }],
  relatedSlugs: ["drought-severity-index-calculator","evapotranspiration-rate-calculator","frost-depth-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Daily GDD = max((High + Low) / 2 - Base Temp, 0)
Total GDD = Daily GDD x Number of Days
Days to Maturity = Required GDD / Daily GDD",
};
