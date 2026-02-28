import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cronExpressionGeneratorCalculator: CalculatorDefinition = {
  slug: "cron-expression-generator",
  title: "Cron Expression Generator",
  description: "Free cron expression builder and parser. Generate cron syntax for scheduling tasks with human-readable descriptions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cron expression generator", "cron job generator", "crontab generator online"],
  variants: [{
    id: "standard",
    name: "Cron Expression",
    description: "Free cron expression builder and parser",
    fields: [
      { name: "minute", label: "Minute (0-59)", type: "number", min: 0, max: 59, defaultValue: 0 },
      { name: "hour", label: "Hour (0-23)", type: "number", min: 0, max: 23, defaultValue: 0 },
      { name: "frequency", label: "Frequency", type: "select", options: [{ label: "Every minute", value: "everymin" }, { label: "Hourly", value: "hourly" }, { label: "Daily", value: "daily" }, { label: "Weekly (Monday)", value: "weekly" }, { label: "Monthly (1st)", value: "monthly" }], defaultValue: "daily" },
    ],
    calculate: (inputs) => {
      const min = inputs.minute as number;
      const hour = inputs.hour as number;
      const freq = inputs.frequency as string;
      let cron = "", desc = "";
      if (freq === "everymin") { cron = "* * * * *"; desc = "Every minute"; }
      else if (freq === "hourly") { cron = min + " * * * *"; desc = "Every hour at :" + String(min).padStart(2, "0"); }
      else if (freq === "daily") { cron = min + " " + hour + " * * *"; desc = "Daily at " + hour + ":" + String(min).padStart(2, "0"); }
      else if (freq === "weekly") { cron = min + " " + hour + " * * 1"; desc = "Every Monday at " + hour + ":" + String(min).padStart(2, "0"); }
      else { cron = min + " " + hour + " 1 * *"; desc = "1st of every month at " + hour + ":" + String(min).padStart(2, "0"); }
      return {
        primary: { label: "Cron Expression", value: cron },
        details: [
          { label: "Description", value: desc },
          { label: "Format", value: "min hour day month weekday" },
          { label: "Special", value: "* (any), */5 (every 5), 1-5 (range), 1,3,5 (list)" },
        ],
        note: "Standard 5-field cron: minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-7, 0/7=Sun).",
      };
    },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is a cron expression?", answer: "A 5-field time format (minute, hour, day, month, weekday) used to schedule recurring tasks on Unix/Linux systems. Example: 0 9 * * 1 = every Monday at 9:00 AM." },
    { question: "What does * mean in cron?", answer: "Asterisk (*) means every value. * in the hour field means every hour. */5 means every 5 units." },
  ],
  formula: "Cron: minute(0-59) hour(0-23) day(1-31) month(1-12) weekday(0-7)",
};
