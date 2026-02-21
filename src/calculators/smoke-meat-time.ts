import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const smokeMeatTimeCalculator: CalculatorDefinition = {
  slug: "smoke-meat-time-calculator",
  title: "Smoking Meat Time & Temperature Calculator",
  description:
    "Free smoking meat calculator. Calculate smoking time, smoker temperature, and internal temperature for brisket, pork butt, ribs, chicken, salmon, and more.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "smoking meat calculator",
    "smoke time calculator",
    "brisket smoking time",
    "pork butt smoking time",
    "smoker temperature guide",
    "how long to smoke meat",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Smoking Time",
      fields: [
        {
          name: "meat",
          label: "Type of Meat",
          type: "select",
          options: [
            { label: "Beef Brisket (whole packer)", value: "brisket" },
            { label: "Pork Butt / Shoulder", value: "pork_butt" },
            { label: "Pork Spare Ribs", value: "spare_ribs" },
            { label: "Baby Back Ribs", value: "baby_back" },
            { label: "Whole Chicken", value: "chicken" },
            { label: "Turkey Breast", value: "turkey_breast" },
            { label: "Whole Turkey", value: "turkey_whole" },
            { label: "Salmon Fillet", value: "salmon" },
            { label: "Chuck Roast", value: "chuck" },
            { label: "Beef Short Ribs", value: "short_ribs" },
            { label: "Pork Loin", value: "pork_loin" },
            { label: "Sausage / Bratwurst", value: "sausage" },
          ],
        },
        {
          name: "weight",
          label: "Weight (lbs)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "smokerTemp",
          label: "Smoker Temperature",
          type: "select",
          options: [
            { label: "225\u00B0F (Low & Slow - Traditional)", value: "225" },
            { label: "250\u00B0F (Standard)", value: "250" },
            { label: "275\u00B0F (Hot & Fast)", value: "275" },
          ],
        },
      ],
      calculate: (inputs) => {
        const meat = inputs.meat as string;
        const weight = inputs.weight as number;
        const smokerTemp = parseFloat(inputs.smokerTemp as string) || 225;
        if (!meat || !weight) return null;

        interface SmokeData {
          minPerLb: number;
          internalTemp: number;
          restTime: string;
          wood: string;
          tips: string;
          wrapTemp?: number;
        }

        // Minutes per pound at 225F
        const smokeGuide: Record<string, SmokeData> = {
          brisket: {
            minPerLb: 75,
            internalTemp: 203,
            restTime: "1-2 hours (cooler)",
            wood: "Oak, Hickory, Mesquite, Post Oak",
            tips: "Wrap in butcher paper at 165\u00B0F (Texas Crutch) to push through the stall.",
            wrapTemp: 165,
          },
          pork_butt: {
            minPerLb: 90,
            internalTemp: 205,
            restTime: "1-2 hours (cooler)",
            wood: "Apple, Cherry, Hickory",
            tips: "Wrap at 160\u00B0F to push through stall. Pull at 205\u00B0F when probe slides in like butter.",
            wrapTemp: 160,
          },
          spare_ribs: {
            minPerLb: 60,
            internalTemp: 195,
            restTime: "15-30 min",
            wood: "Apple, Cherry, Hickory",
            tips: "3-2-1 method: 3 hrs smoke, 2 hrs wrapped, 1 hr unwrapped with sauce.",
          },
          baby_back: {
            minPerLb: 50,
            internalTemp: 195,
            restTime: "15-30 min",
            wood: "Apple, Cherry, Pecan",
            tips: "2-2-1 method for baby backs. They cook faster than spare ribs.",
          },
          chicken: {
            minPerLb: 45,
            internalTemp: 165,
            restTime: "15 min",
            wood: "Apple, Cherry, Pecan",
            tips: "Spatchcock for even cooking. Crisp skin by finishing at 350\u00B0F for 10 min.",
          },
          turkey_breast: {
            minPerLb: 35,
            internalTemp: 165,
            restTime: "20-30 min",
            wood: "Apple, Cherry, Maple",
            tips: "Brine 12-24 hours before smoking for juicier results.",
          },
          turkey_whole: {
            minPerLb: 30,
            internalTemp: 165,
            restTime: "30-45 min",
            wood: "Apple, Cherry, Pecan, Maple",
            tips: "Spatchcock for even cooking. Never stuff a smoked turkey.",
          },
          salmon: {
            minPerLb: 45,
            internalTemp: 145,
            restTime: "5-10 min",
            wood: "Alder, Apple, Cedar",
            tips: "Brine 4-8 hours. Low temp (180-225\u00B0F). Remove at 140\u00B0F (carryover will finish it).",
          },
          chuck: {
            minPerLb: 90,
            internalTemp: 200,
            restTime: "30-60 min",
            wood: "Oak, Hickory",
            tips: "Treat like a small brisket. Wrap at 165\u00B0F. Pull or slice at 200\u00B0F.",
            wrapTemp: 165,
          },
          short_ribs: {
            minPerLb: 60,
            internalTemp: 203,
            restTime: "30-45 min",
            wood: "Oak, Hickory, Cherry",
            tips: "Smoke unwrapped for 4-5 hours. Probe tender at 203\u00B0F.",
          },
          pork_loin: {
            minPerLb: 40,
            internalTemp: 145,
            restTime: "10-15 min",
            wood: "Apple, Cherry, Maple",
            tips: "Don't overcook - pork loin dries out quickly. Remove at 140\u00B0F.",
          },
          sausage: {
            minPerLb: 60,
            internalTemp: 165,
            restTime: "5 min",
            wood: "Hickory, Apple, Pecan",
            tips: "Start at lower temp (180\u00B0F) for more smoke, then raise to finish.",
          },
        };

        const data = smokeGuide[meat];
        if (!data) return null;

        // Adjust time based on smoker temp (higher temp = less time)
        let tempMultiplier = 1;
        if (smokerTemp === 250) tempMultiplier = 0.82;
        else if (smokerTemp === 275) tempMultiplier = 0.67;

        const totalMinutes = data.minPerLb * weight * tempMultiplier;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        const timeStr = hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

        // Time range (+/- 15%)
        const lowMin = totalMinutes * 0.85;
        const highMin = totalMinutes * 1.15;
        const lowHr = Math.floor(lowMin / 60);
        const lowRem = Math.round(lowMin % 60);
        const highHr = Math.floor(highMin / 60);
        const highRem = Math.round(highMin % 60);
        const rangeStr = `${lowHr}:${String(lowRem).padStart(2, "0")} - ${highHr}:${String(highRem).padStart(2, "0")}`;

        const meatNames: Record<string, string> = {
          brisket: "Beef Brisket",
          pork_butt: "Pork Butt/Shoulder",
          spare_ribs: "Spare Ribs",
          baby_back: "Baby Back Ribs",
          chicken: "Whole Chicken",
          turkey_breast: "Turkey Breast",
          turkey_whole: "Whole Turkey",
          salmon: "Salmon",
          chuck: "Chuck Roast",
          short_ribs: "Beef Short Ribs",
          pork_loin: "Pork Loin",
          sausage: "Sausage",
        };

        const details = [
          { label: "Meat", value: meatNames[meat] + " (" + weight + " lbs)" },
          { label: "Estimated Time", value: timeStr },
          { label: "Time Range", value: rangeStr },
          { label: "Smoker Temp", value: smokerTemp + "\u00B0F" },
          { label: "Target Internal Temp", value: data.internalTemp + "\u00B0F" },
        ];

        if (data.wrapTemp) {
          details.push({ label: "Wrap Temperature", value: data.wrapTemp + "\u00B0F (optional Texas Crutch)" });
        }

        details.push({ label: "Rest Time", value: data.restTime });
        details.push({ label: "Recommended Wood", value: data.wood });
        details.push({ label: "Tips", value: data.tips });

        return {
          primary: {
            label: "Estimated Smoking Time",
            value: timeStr,
          },
          details,
          note: "Smoking times are estimates. Always cook to internal temperature, not time. The 'stall' (meat temp plateaus around 150-170\u00B0F) is normal for large cuts.",
        };
      },
    },
  ],
  relatedSlugs: ["meat-cooking-time-calculator", "grill-temperature-calculator", "turkey-cooking-time-calculator"],
  faq: [
    {
      question: "How long does it take to smoke a brisket?",
      answer:
        "At 225\u00B0F, plan for about 1 to 1.25 hours per pound. A 12-pound whole packer brisket takes approximately 12-16 hours. The key is cooking to internal temperature (203\u00B0F), not time. Every brisket is different.",
    },
    {
      question: "What is the stall in smoking?",
      answer:
        "The 'stall' occurs when the meat's internal temperature plateaus around 150-170\u00B0F, sometimes for hours. This happens because moisture evaporating from the surface cools the meat. Wrapping in foil or butcher paper (Texas Crutch) helps push through it.",
    },
    {
      question: "What temperature should my smoker be?",
      answer:
        "225\u00B0F is the traditional 'low and slow' temperature and produces the most smoke flavor. 250\u00B0F is a good standard that reduces cooking time. 275\u00B0F is 'hot and fast' which saves time but still produces excellent results. Stay consistent.",
    },
    {
      question: "Which wood should I use for smoking?",
      answer:
        "Fruit woods (apple, cherry) are mild and great for poultry and pork. Hickory is medium-strong and versatile. Oak is the classic choice for brisket. Mesquite is very strong and best for short cooks. Never use pine, cedar (interior), or treated wood.",
    },
  ],
  formula:
    "Smoking Time = Weight (lbs) x Minutes per Pound x Temperature Multiplier. At 225\u00B0F: Brisket 75 min/lb, Pork Butt 90 min/lb, Ribs 50-60 min/lb, Chicken 45 min/lb. At 250\u00B0F multiply by 0.82, at 275\u00B0F multiply by 0.67. Always cook to internal temperature.",
};
