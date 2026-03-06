import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eReaderBatteryCalculator: CalculatorDefinition = {
  slug: "e-reader-battery-calculator",
  title: "E-Reader Battery Life Calculator",
  description: "Estimate how long your e-reader battery will last based on reading habits, screen type, backlight usage, and Wi-Fi connectivity.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["e-reader battery life","kindle battery calculator","e-ink battery","ebook reader battery","reading device battery"],
  variants: [{
    id: "standard",
    name: "E-Reader Battery Life",
    description: "Estimate how long your e-reader battery will last based on reading habits, screen type, backlight usage, and Wi-Fi connectivity.",
    fields: [
      { name: "batteryMah", label: "Battery Capacity (mAh)", type: "number", min: 500, max: 5000, defaultValue: 1700 },
      { name: "readingHoursPerDay", label: "Reading Hours Per Day", type: "number", min: 0.5, max: 12, defaultValue: 2 },
      { name: "pagesPerHour", label: "Page Turns Per Hour", type: "number", min: 10, max: 120, defaultValue: 40 },
      { name: "backlightLevel", label: "Backlight Level", type: "select", options: [{ value: "0", label: "Off" }, { value: "1", label: "Low" }, { value: "2", label: "Medium" }, { value: "3", label: "High" }], defaultValue: "1" },
      { name: "wifiOn", label: "Wi-Fi", type: "select", options: [{ value: "0", label: "Off" }, { value: "1", label: "On" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
    const battery = inputs.batteryMah as number;
    const hoursPerDay = inputs.readingHoursPerDay as number;
    const pagesPerHour = inputs.pagesPerHour as number;
    const backlight = parseInt(inputs.backlightLevel as string);
    const wifi = parseInt(inputs.wifiOn as string);
    const baseDraw = 0.01;
    const pageRefreshDraw = pagesPerHour * 0.0003;
    const backlightDraw = { 0: 0, 1: 0.02, 2: 0.05, 3: 0.10 };
    const wifiDraw = wifi === 1 ? 0.04 : 0;
    const totalDrawMa = (baseDraw + pageRefreshDraw + (backlightDraw[backlight] || 0) + wifiDraw) * 1000;
    const totalReadingHours = battery / totalDrawMa;
    const daysOfReading = totalReadingHours / hoursPerDay;
    const weeksOfReading = daysOfReading / 7;
    const totalPages = Math.round(totalReadingHours * pagesPerHour);
    return {
      primary: { label: "Battery Life", value: formatNumber(Math.round(daysOfReading)) + " days" },
      details: [
        { label: "Total Reading Hours", value: formatNumber(Math.round(totalReadingHours)) + " hours" },
        { label: "Weeks of Reading", value: formatNumber(Math.round(weeksOfReading * 10) / 10) },
        { label: "Pages Before Recharge", value: formatNumber(totalPages) },
        { label: "Power Draw", value: formatNumber(Math.round(totalDrawMa * 10) / 10) + " mA" }
      ]
    };
  },
  }],
  relatedSlugs: ["phone-battery-health-calculator","wireless-charger-efficiency-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total Draw = Base + Page Refresh + Backlight + Wi-Fi (in mA); Reading Hours = Battery (mAh) / Total Draw (mA); Days = Reading Hours / Daily Reading Hours",
};
