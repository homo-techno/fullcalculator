import type { CalculatorDefinition } from "./types";

export const chineseGenderCalculator: CalculatorDefinition = {
  slug: "chinese-gender-calculator",
  title: "Chinese Gender Predictor Calculator",
  description:
    "Free Chinese gender predictor calculator. Use the traditional Chinese lunar calendar method to predict your baby's gender based on mother's age and conception month.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "chinese gender predictor",
    "chinese gender calculator",
    "baby gender prediction",
    "lunar calendar gender",
    "chinese baby calendar",
  ],
  variants: [
    {
      id: "chinese-gender",
      name: "Chinese Gender Prediction",
      description: "Predict baby gender using the Chinese lunar calendar chart",
      fields: [
        {
          name: "motherAge",
          label: "Mother's Age at Conception",
          type: "number",
          placeholder: "e.g. 28",
          min: 18,
          max: 45,
        },
        {
          name: "conceptionMonth",
          label: "Conception Month",
          type: "select",
          options: [
            { label: "January", value: "1" },
            { label: "February", value: "2" },
            { label: "March", value: "3" },
            { label: "April", value: "4" },
            { label: "May", value: "5" },
            { label: "June", value: "6" },
            { label: "July", value: "7" },
            { label: "August", value: "8" },
            { label: "September", value: "9" },
            { label: "October", value: "10" },
            { label: "November", value: "11" },
            { label: "December", value: "12" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = inputs.motherAge as number;
        const month = parseInt(inputs.conceptionMonth as string);
        if (!age || !month) return null;

        // Traditional Chinese gender chart (simplified lunar approximation)
        // Based on the widely-published Chinese Gender Chart
        const chart: Record<string, string> = {
          "18-1": "F", "18-2": "M", "18-3": "F", "18-4": "M", "18-5": "M", "18-6": "M",
          "18-7": "M", "18-8": "M", "18-9": "M", "18-10": "M", "18-11": "M", "18-12": "M",
          "19-1": "M", "19-2": "F", "19-3": "M", "19-4": "F", "19-5": "F", "19-6": "M",
          "19-7": "M", "19-8": "M", "19-9": "M", "19-10": "F", "19-11": "M", "19-12": "F",
          "20-1": "F", "20-2": "M", "20-3": "F", "20-4": "M", "20-5": "M", "20-6": "M",
          "20-7": "M", "20-8": "M", "20-9": "F", "20-10": "M", "20-11": "M", "20-12": "M",
          "21-1": "M", "21-2": "F", "21-3": "F", "21-4": "F", "21-5": "F", "21-6": "F",
          "21-7": "F", "21-8": "F", "21-9": "F", "21-10": "F", "21-11": "F", "21-12": "F",
          "22-1": "F", "22-2": "M", "22-3": "M", "22-4": "F", "22-5": "M", "22-6": "F",
          "22-7": "F", "22-8": "M", "22-9": "F", "22-10": "F", "22-11": "F", "22-12": "F",
          "23-1": "M", "23-2": "M", "23-3": "F", "23-4": "M", "23-5": "M", "23-6": "F",
          "23-7": "F", "23-8": "F", "23-9": "F", "23-10": "M", "23-11": "M", "23-12": "F",
          "24-1": "M", "24-2": "F", "24-3": "M", "24-4": "M", "24-5": "F", "24-6": "M",
          "24-7": "M", "24-8": "F", "24-9": "F", "24-10": "F", "24-11": "F", "24-12": "F",
          "25-1": "F", "25-2": "M", "25-3": "M", "25-4": "F", "25-5": "F", "25-6": "M",
          "25-7": "F", "25-8": "M", "25-9": "M", "25-10": "M", "25-11": "M", "25-12": "M",
          "26-1": "M", "26-2": "F", "26-3": "M", "26-4": "F", "26-5": "F", "26-6": "M",
          "26-7": "F", "26-8": "M", "26-9": "F", "26-10": "F", "26-11": "F", "26-12": "F",
          "27-1": "F", "27-2": "M", "27-3": "F", "27-4": "M", "27-5": "F", "27-6": "F",
          "27-7": "M", "27-8": "M", "27-9": "M", "27-10": "M", "27-11": "F", "27-12": "M",
          "28-1": "M", "28-2": "F", "28-3": "M", "28-4": "F", "28-5": "F", "28-6": "M",
          "28-7": "F", "28-8": "M", "28-9": "F", "28-10": "F", "28-11": "M", "28-12": "F",
          "29-1": "F", "29-2": "M", "29-3": "F", "29-4": "F", "29-5": "M", "29-6": "M",
          "29-7": "F", "29-8": "M", "29-9": "F", "29-10": "M", "29-11": "F", "29-12": "F",
          "30-1": "M", "30-2": "F", "30-3": "F", "30-4": "F", "30-5": "F", "30-6": "F",
          "30-7": "F", "30-8": "F", "30-9": "M", "30-10": "F", "30-11": "F", "30-12": "M",
          "31-1": "M", "31-2": "F", "31-3": "M", "31-4": "F", "31-5": "F", "31-6": "F",
          "31-7": "F", "31-8": "F", "31-9": "F", "31-10": "F", "31-11": "M", "31-12": "M",
          "32-1": "M", "32-2": "F", "32-3": "F", "32-4": "M", "32-5": "F", "32-6": "F",
          "32-7": "F", "32-8": "F", "32-9": "F", "32-10": "F", "32-11": "F", "32-12": "M",
          "33-1": "F", "33-2": "M", "33-3": "F", "33-4": "M", "33-5": "F", "33-6": "F",
          "33-7": "F", "33-8": "M", "33-9": "F", "33-10": "F", "33-11": "M", "33-12": "F",
          "34-1": "M", "34-2": "F", "34-3": "M", "34-4": "F", "34-5": "M", "34-6": "F",
          "34-7": "F", "34-8": "M", "34-9": "F", "34-10": "F", "34-11": "F", "34-12": "M",
          "35-1": "M", "35-2": "M", "35-3": "F", "35-4": "M", "35-5": "F", "35-6": "M",
          "35-7": "F", "35-8": "M", "35-9": "F", "35-10": "M", "35-11": "F", "35-12": "M",
          "36-1": "F", "36-2": "M", "36-3": "M", "36-4": "F", "36-5": "M", "36-6": "F",
          "36-7": "F", "36-8": "M", "36-9": "F", "36-10": "M", "36-11": "M", "36-12": "M",
          "37-1": "M", "37-2": "F", "37-3": "M", "37-4": "M", "37-5": "F", "37-6": "M",
          "37-7": "F", "37-8": "M", "37-9": "F", "37-10": "M", "37-11": "F", "37-12": "M",
          "38-1": "F", "38-2": "M", "38-3": "F", "38-4": "M", "38-5": "M", "38-6": "F",
          "38-7": "M", "38-8": "F", "38-9": "M", "38-10": "F", "38-11": "M", "38-12": "F",
          "39-1": "M", "39-2": "F", "39-3": "M", "39-4": "M", "39-5": "M", "39-6": "F",
          "39-7": "F", "39-8": "M", "39-9": "F", "39-10": "F", "39-11": "F", "39-12": "M",
          "40-1": "F", "40-2": "M", "40-3": "F", "40-4": "M", "40-5": "F", "40-6": "M",
          "40-7": "M", "40-8": "F", "40-9": "M", "40-10": "F", "40-11": "M", "40-12": "F",
          "41-1": "M", "41-2": "F", "41-3": "M", "41-4": "F", "41-5": "M", "41-6": "F",
          "41-7": "M", "41-8": "M", "41-9": "F", "41-10": "M", "41-11": "F", "41-12": "M",
          "42-1": "F", "42-2": "M", "42-3": "F", "42-4": "M", "42-5": "F", "42-6": "M",
          "42-7": "F", "42-8": "M", "42-9": "M", "42-10": "F", "42-11": "M", "42-12": "F",
          "43-1": "M", "43-2": "F", "43-3": "M", "43-4": "F", "43-5": "M", "43-6": "F",
          "43-7": "M", "43-8": "F", "43-9": "M", "43-10": "M", "43-11": "F", "43-12": "M",
          "44-1": "F", "44-2": "M", "44-3": "M", "44-4": "F", "44-5": "M", "44-6": "M",
          "44-7": "F", "44-8": "M", "44-9": "F", "44-10": "M", "44-11": "F", "44-12": "M",
          "45-1": "M", "45-2": "F", "45-3": "M", "45-4": "F", "45-5": "F", "45-6": "M",
          "45-7": "F", "45-8": "M", "45-9": "M", "45-10": "F", "45-11": "M", "45-12": "F",
        };

        const key = `${age}-${month}`;
        const result = chart[key];
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];

        // Chinese lunar age is typically +1 year
        const lunarAge = age + 1;

        if (!result) {
          return {
            primary: { label: "Prediction", value: "Age out of chart range (18-45)" },
            details: [],
            note: "The Chinese Gender Chart covers maternal ages 18-45.",
          };
        }

        const prediction = result === "M" ? "Boy" : "Girl";

        return {
          primary: {
            label: "Chinese Gender Prediction",
            value: prediction,
          },
          details: [
            { label: "Mother's Age at Conception", value: `${age} years` },
            { label: "Lunar Age (Chinese)", value: `${lunarAge} years` },
            { label: "Conception Month", value: monthNames[month - 1] },
            { label: "Chart Accuracy (claimed)", value: "~50% (not scientifically proven)" },
            { label: "Method", value: "Traditional Chinese Lunar Calendar Chart" },
          ],
          note: "The Chinese Gender Predictor Chart is a traditional folk method, NOT a scientific tool. It has approximately 50% accuracy (same as random chance). Use ultrasound or NIPT blood tests for reliable gender determination.",
        };
      },
    },
  ],
  relatedSlugs: ["pregnancy-calculator", "baby-gender-calculator", "conception-calculator"],
  faq: [
    {
      question: "How accurate is the Chinese Gender Predictor?",
      answer:
        "Despite claims of 90%+ accuracy, scientific studies have shown the Chinese Gender Predictor Chart is about 50% accurate, which is no better than random chance. It should be used for entertainment purposes only.",
    },
    {
      question: "How does the Chinese Gender Chart work?",
      answer:
        "The Chinese Gender Chart (also called the Chinese Birth Chart) uses the mother's lunar age at conception and the lunar month of conception to predict the baby's sex. It supposedly originated from a chart found in a royal tomb over 700 years ago.",
    },
    {
      question: "When can I find out my baby's gender reliably?",
      answer:
        "Reliable methods include NIPT blood test (as early as 10 weeks), CVS (10-13 weeks), amniocentesis (15-20 weeks), and ultrasound (typically 18-22 weeks anatomy scan, sometimes as early as 14 weeks).",
    },
  ],
  formula:
    "Prediction = ChineseChart[Mother's Age at Conception][Lunar Conception Month] | Lunar Age = Age + 1 year",
};
