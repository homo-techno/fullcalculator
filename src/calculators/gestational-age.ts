import type { CalculatorDefinition } from "./types";

export const gestationalAgeCalculator: CalculatorDefinition = {
  slug: "gestational-age-calculator",
  title: "Gestational Age Calculator",
  description:
    "Free gestational age calculator. Calculate how many weeks and days pregnant you are based on your last menstrual period or ultrasound measurements.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "gestational age",
    "weeks pregnant",
    "how far along",
    "pregnancy weeks",
    "gestational age calculator",
  ],
  variants: [
    {
      id: "lmp",
      name: "From Last Menstrual Period",
      description: "Calculate gestational age from your LMP date",
      fields: [
        {
          name: "lmpYear",
          label: "LMP Year",
          type: "number",
          placeholder: "e.g. 2026",
          min: 2024,
          max: 2028,
        },
        {
          name: "lmpMonth",
          label: "LMP Month",
          type: "number",
          placeholder: "1-12",
          min: 1,
          max: 12,
        },
        {
          name: "lmpDay",
          label: "LMP Day",
          type: "number",
          placeholder: "1-31",
          min: 1,
          max: 31,
        },
      ],
      calculate: (inputs) => {
        const y = inputs.lmpYear as number;
        const m = inputs.lmpMonth as number;
        const d = inputs.lmpDay as number;
        if (!y || !m || !d) return null;

        const lmpDate = new Date(y, m - 1, d);
        const today = new Date();
        const diffMs = today.getTime() - lmpDate.getTime();
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (totalDays < 0) return null;

        const weeks = Math.floor(totalDays / 7);
        const days = totalDays % 7;

        // Trimester
        let trimester = "";
        if (weeks < 13) trimester = "First Trimester (weeks 1-12)";
        else if (weeks < 27) trimester = "Second Trimester (weeks 13-26)";
        else if (weeks <= 42) trimester = "Third Trimester (weeks 27-40)";
        else trimester = "Past due date";

        // Due date
        const dueDate = new Date(lmpDate);
        dueDate.setDate(dueDate.getDate() + 280);

        const daysRemaining = Math.max(0, 280 - totalDays);
        const weeksRemaining = Math.floor(daysRemaining / 7);
        const daysRemainingExtra = daysRemaining % 7;

        // Baby size comparison
        const sizeByWeek: Record<number, string> = {
          4: "Poppy seed", 5: "Sesame seed", 6: "Lentil", 7: "Blueberry",
          8: "Raspberry", 9: "Cherry", 10: "Strawberry", 11: "Lime",
          12: "Plum", 13: "Lemon", 14: "Nectarine", 15: "Orange",
          16: "Avocado", 17: "Pear", 18: "Sweet potato", 19: "Mango",
          20: "Banana", 22: "Papaya", 24: "Corn on the cob",
          26: "Zucchini", 28: "Eggplant", 30: "Cabbage",
          32: "Squash", 34: "Pineapple", 36: "Honeydew melon",
          38: "Watermelon", 40: "Small pumpkin",
        };

        const sizeKeys = Object.keys(sizeByWeek).map(Number).sort((a, b) => a - b);
        let babySize = "Too early to compare";
        for (const key of sizeKeys) {
          if (weeks >= key) babySize = sizeByWeek[key];
        }

        const months = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December",
        ];
        const formatDate = (dt: Date) =>
          `${months[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;

        const percentComplete = Math.min(100, ((totalDays / 280) * 100)).toFixed(1);

        return {
          primary: {
            label: "Gestational Age",
            value: `${weeks} weeks, ${days} days`,
          },
          details: [
            { label: "Trimester", value: trimester },
            { label: "Due date", value: formatDate(dueDate) },
            {
              label: "Time remaining",
              value: `${weeksRemaining} weeks, ${daysRemainingExtra} days`,
            },
            { label: "Progress", value: `${percentComplete}%` },
            { label: "Baby size comparison", value: babySize },
            { label: "Total days pregnant", value: `${totalDays} days` },
          ],
          note: "Gestational age is calculated from the first day of the last menstrual period. Actual fetal age is about 2 weeks less.",
        };
      },
    },
    {
      id: "ultrasound",
      name: "From Ultrasound Measurement",
      description: "Calculate gestational age from crown-rump length (CRL)",
      fields: [
        {
          name: "crlMm",
          label: "Crown-Rump Length (mm)",
          type: "number",
          placeholder: "e.g. 45",
          min: 2,
          max: 85,
        },
      ],
      calculate: (inputs) => {
        const crl = inputs.crlMm as number;
        if (!crl) return null;

        // Robinson formula: GA (days) = 8.052 * sqrt(CRL * 1.037) + 23.73
        const gaDays = 8.052 * Math.sqrt(crl * 1.037) + 23.73;
        const gaWeeks = Math.floor(gaDays / 7);
        const gaDaysRemainder = Math.round(gaDays % 7);

        const crlCm = (crl / 10).toFixed(1);
        const crlIn = (crl / 25.4).toFixed(2);

        let trimester = "";
        if (gaWeeks < 13) trimester = "First Trimester";
        else if (gaWeeks < 27) trimester = "Second Trimester";
        else trimester = "Third Trimester";

        return {
          primary: {
            label: "Estimated Gestational Age",
            value: `${gaWeeks} weeks, ${gaDaysRemainder} days`,
          },
          details: [
            { label: "Crown-rump length", value: `${crl} mm (${crlCm} cm / ${crlIn} in)` },
            { label: "Trimester", value: trimester },
            { label: "Total days", value: `~${Math.round(gaDays)} days` },
            { label: "Method", value: "Robinson formula (CRL-based)" },
          ],
          note: "CRL measurements are most accurate for dating in the first trimester (6-13 weeks). After 13 weeks, other measurements are used.",
        };
      },
    },
  ],
  relatedSlugs: ["pregnancy-due-date-calculator", "fetal-weight-calculator"],
  faq: [
    {
      question: "What is gestational age vs. fetal age?",
      answer:
        "Gestational age is counted from the first day of the last menstrual period (LMP) and is the standard way pregnancy is dated. Fetal age (conceptional age) starts from actual conception, which is about 2 weeks later. When your doctor says you're 8 weeks pregnant, the fetus is actually about 6 weeks old.",
    },
    {
      question: "How accurate is gestational age from ultrasound?",
      answer:
        "First trimester ultrasound (using crown-rump length) is the most accurate dating method, within ±3-5 days. After the first trimester, accuracy decreases. If ultrasound and LMP dates differ by more than 7 days, the ultrasound date is usually preferred.",
    },
  ],
  formula:
    "LMP method: Gestational age = today - LMP date. Robinson formula (ultrasound): GA days = 8.052 * sqrt(CRL mm * 1.037) + 23.73.",
};
