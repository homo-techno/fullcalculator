import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const selfStorageCostCalculator: CalculatorDefinition = {
  slug: "self-storage-cost",
  title: "Self-Storage Unit Cost Estimator",
  description:
    "Estimate self-storage unit costs by size, climate control, and location to find the right storage solution for your budget.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "self storage",
    "storage unit",
    "storage cost",
    "storage rental",
    "climate control",
    "moving storage",
    "warehouse",
  ],
  variants: [
    {
      slug: "self-storage-cost",
      title: "Storage Unit Cost Estimator",
      description:
        "Estimate monthly storage costs based on your needs and location.",
      fields: [
        {
          name: "unitSize",
          label: "Unit Size",
          type: "select",
          defaultValue: "10x10",
          options: [
            { label: "5x5 (25 sq ft) - Closet", value: "5x5" },
            { label: "5x10 (50 sq ft) - Walk-in Closet", value: "5x10" },
            { label: "10x10 (100 sq ft) - Half Garage", value: "10x10" },
            { label: "10x15 (150 sq ft) - 3/4 Garage", value: "10x15" },
            { label: "10x20 (200 sq ft) - Full Garage", value: "10x20" },
            { label: "10x30 (300 sq ft) - Oversized", value: "10x30" },
          ],
        },
        {
          name: "climateControl",
          label: "Climate Control",
          type: "select",
          defaultValue: "no",
          options: [
            { label: "No - Standard", value: "no" },
            { label: "Yes - Climate Controlled", value: "yes" },
          ],
        },
        {
          name: "locationTier",
          label: "Location Type",
          type: "select",
          defaultValue: "suburban",
          options: [
            { label: "Rural", value: "rural" },
            { label: "Suburban", value: "suburban" },
            { label: "Urban", value: "urban" },
          ],
        },
        {
          name: "rentalDuration",
          label: "Rental Duration (months)",
          type: "number",
          defaultValue: "6",
        },
        {
          name: "insuranceMonthly",
          label: "Monthly Insurance ($)",
          type: "number",
          defaultValue: "12",
        },
        {
          name: "needsLock",
          label: "Need Lock?",
          type: "select",
          defaultValue: "yes",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No (have own)", value: "no" },
          ],
        },
      ],
      calculate(inputs) {
        const size = inputs.unitSize as string;
        const climate = inputs.climateControl as string;
        const location = inputs.locationTier as string;
        const months = parseFloat(inputs.rentalDuration as string);
        const insurance = parseFloat(inputs.insuranceMonthly as string);
        const needsLock = inputs.needsLock as string;

        const basePrices: Record<string, number> = {
          "5x5": 55,
          "5x10": 85,
          "10x10": 130,
          "10x15": 175,
          "10x20": 220,
          "10x30": 310,
        };

        const locationMultiplier =
          location === "rural" ? 0.7 : location === "suburban" ? 1.0 : 1.45;
        const climateMultiplier = climate === "yes" ? 1.35 : 1.0;

        const basePrice = basePrices[size] || 130;
        const monthlyRate = basePrice * locationMultiplier * climateMultiplier;
        const adminFee = 25;
        const lockCost = needsLock === "yes" ? 15 : 0;
        const monthlyInsurance = insurance;
        const monthlyTotal = monthlyRate + monthlyInsurance;
        const firstMonthTotal = monthlyTotal + adminFee + lockCost;
        const totalCost = firstMonthTotal + monthlyTotal * (months - 1);
        const costPerSqFt = monthlyRate / parseInt(size.split("x").reduce((a, b) => String(parseInt(a) * parseInt(b))));
        const annualCost = monthlyTotal * 12;

        return {
          "Monthly Base Rate": `$${formatNumber(monthlyRate)}`,
          "Monthly Insurance": `$${formatNumber(monthlyInsurance)}`,
          "Monthly Total": `$${formatNumber(monthlyTotal)}`,
          "Admin Fee (one-time)": `$${formatNumber(adminFee)}`,
          "Lock Cost": `$${formatNumber(lockCost)}`,
          "First Month Total": `$${formatNumber(firstMonthTotal)}`,
          "Total Cost ({months} months)": `$${formatNumber(totalCost)}`,
          "Cost Per Sq Ft/Month": `$${formatNumber(costPerSqFt)}`,
          "Annual Cost": `$${formatNumber(annualCost)}`,
        };
      },
    },
  ],
  relatedSlugs: [
    "rental-arbitrage",
    "popup-shop-cost",
    "business-insurance-cost",
  ],
  faq: [
    {
      question: "What size storage unit do I need?",
      answer:
        "5x5 fits boxes and small items (closet-sized). 5x10 fits a studio apartment or small office. 10x10 fits a one-bedroom apartment. 10x15 fits a two-bedroom apartment. 10x20 fits a three-bedroom house or a car. 10x30 fits a large house or multiple vehicles.",
    },
    {
      question: "Is climate-controlled storage worth it?",
      answer:
        "Climate-controlled units cost 25-50% more but are recommended for electronics, wood furniture, musical instruments, artwork, documents, photos, and anything sensitive to temperature extremes or humidity. Standard units are fine for durable items, tools, and outdoor equipment.",
    },
    {
      question: "How can I save money on self-storage?",
      answer:
        "Tips to save: look for first-month-free promotions, choose a slightly larger unit to avoid needing two, avoid peak moving season (May-September), compare multiple facilities, ask about long-term discounts, and consider units further from city center.",
    },
  ],
  formula:
    "Monthly Rate = Base Price x Location Multiplier x Climate Multiplier. First Month = Monthly Rate + Insurance + Admin Fee + Lock. Total Cost = First Month + (Monthly Total x (Duration - 1)).",
};
