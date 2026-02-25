import type { CalculatorDefinition } from "./types";

export const pregnancyDueDateIvfCalculator: CalculatorDefinition = {
  slug: "ivf-due-date-calculator",
  title: "IVF Due Date Calculator",
  description:
    "Free IVF due date calculator. Calculate your estimated due date based on embryo transfer date, egg retrieval date, or IUI date for fertility treatments.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "ivf due date",
    "embryo transfer due date",
    "ivf calculator",
    "iui due date",
    "fertility treatment due date",
  ],
  variants: [
    {
      id: "transfer",
      name: "By Embryo Transfer Date",
      description: "Calculate due date from your embryo transfer date",
      fields: [
        {
          name: "transferYear",
          label: "Transfer Year",
          type: "number",
          placeholder: "e.g. 2026",
          min: 2024,
          max: 2028,
        },
        {
          name: "transferMonth",
          label: "Transfer Month",
          type: "number",
          placeholder: "1-12",
          min: 1,
          max: 12,
        },
        {
          name: "transferDay",
          label: "Transfer Day",
          type: "number",
          placeholder: "1-31",
          min: 1,
          max: 31,
        },
        {
          name: "embryoType",
          label: "Embryo Type",
          type: "select",
          options: [
            { label: "Day 3 Embryo", value: "day3" },
            { label: "Day 5 Embryo (Blastocyst)", value: "day5" },
          ],
        },
      ],
      calculate: (inputs) => {
        const y = inputs.transferYear as number;
        const m = inputs.transferMonth as number;
        const d = inputs.transferDay as number;
        const embryoType = inputs.embryoType as string;
        if (!y || !m || !d || !embryoType) return null;

        const transferDate = new Date(y, m - 1, d);

        // IVF due date calculation:
        // Day 3 embryo: due date = transfer date + 263 days (280 - 17)
        // Day 5 embryo: due date = transfer date + 261 days (280 - 19)
        const daysToAdd = embryoType === "day3" ? 263 : 261;

        const dueDate = new Date(transferDate);
        dueDate.setDate(dueDate.getDate() + daysToAdd);

        // Calculate equivalent LMP date
        const lmpDate = new Date(transferDate);
        if (embryoType === "day3") {
          lmpDate.setDate(lmpDate.getDate() - 17);
        } else {
          lmpDate.setDate(lmpDate.getDate() - 19);
        }

        // Current gestational age
        const today = new Date();
        const daysSinceLMP = Math.floor(
          (today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const weeksPregnant = Math.floor(daysSinceLMP / 7);
        const daysExtra = daysSinceLMP % 7;

        // Key milestones
        const viabilityDate = new Date(lmpDate);
        viabilityDate.setDate(viabilityDate.getDate() + 168); // 24 weeks

        const termDate = new Date(lmpDate);
        termDate.setDate(termDate.getDate() + 259); // 37 weeks

        const months = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December",
        ];
        const formatDate = (dt: Date) =>
          `${months[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;

        return {
          primary: { label: "Estimated Due Date", value: formatDate(dueDate) },
          details: [
            {
              label: "Current gestational age",
              value:
                daysSinceLMP >= 0
                  ? `${weeksPregnant} weeks, ${daysExtra} days`
                  : "Not yet started",
            },
            { label: "Equivalent LMP date", value: formatDate(lmpDate) },
            { label: "Transfer date", value: formatDate(transferDate) },
            {
              label: "Embryo type",
              value: embryoType === "day3" ? "Day 3 Embryo" : "Day 5 Blastocyst",
            },
            { label: "Viability milestone (24 wks)", value: formatDate(viabilityDate) },
            { label: "Early term (37 wks)", value: formatDate(termDate) },
          ],
          note: "IVF due dates are often more accurate than LMP-based dates since the exact fertilization timing is known. Your RE may adjust based on early ultrasound.",
        };
      },
    },
    {
      id: "retrieval",
      name: "By Egg Retrieval / IUI Date",
      description: "Calculate due date from egg retrieval or IUI procedure date",
      fields: [
        {
          name: "procYear",
          label: "Procedure Year",
          type: "number",
          placeholder: "e.g. 2026",
          min: 2024,
          max: 2028,
        },
        {
          name: "procMonth",
          label: "Procedure Month",
          type: "number",
          placeholder: "1-12",
          min: 1,
          max: 12,
        },
        {
          name: "procDay",
          label: "Procedure Day",
          type: "number",
          placeholder: "1-31",
          min: 1,
          max: 31,
        },
        {
          name: "procType",
          label: "Procedure Type",
          type: "select",
          options: [
            { label: "Egg Retrieval", value: "retrieval" },
            { label: "IUI (Intrauterine Insemination)", value: "iui" },
          ],
        },
      ],
      calculate: (inputs) => {
        const y = inputs.procYear as number;
        const m = inputs.procMonth as number;
        const d = inputs.procDay as number;
        const procType = inputs.procType as string;
        if (!y || !m || !d || !procType) return null;

        const procDate = new Date(y, m - 1, d);

        // Egg retrieval = day 0 of fertilization, so LMP = retrieval - 14 days
        // IUI = ~day 0 of fertilization, so LMP = IUI - 14 days
        const lmpDate = new Date(procDate);
        lmpDate.setDate(lmpDate.getDate() - 14);

        const dueDate = new Date(lmpDate);
        dueDate.setDate(dueDate.getDate() + 280);

        const months = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December",
        ];
        const formatDate = (dt: Date) =>
          `${months[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;

        const today = new Date();
        const daysSinceLMP = Math.floor(
          (today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const weeksPregnant = Math.floor(daysSinceLMP / 7);
        const daysExtra = daysSinceLMP % 7;

        return {
          primary: { label: "Estimated Due Date", value: formatDate(dueDate) },
          details: [
            {
              label: "Current gestational age",
              value:
                daysSinceLMP >= 0
                  ? `${weeksPregnant} weeks, ${daysExtra} days`
                  : "Not yet started",
            },
            { label: "Equivalent LMP date", value: formatDate(lmpDate) },
            {
              label: "Procedure type",
              value:
                procType === "retrieval"
                  ? "Egg Retrieval"
                  : "IUI",
            },
            { label: "Procedure date", value: formatDate(procDate) },
          ],
          note: "Due dates from fertility procedures are typically more accurate. Your reproductive endocrinologist may adjust based on ultrasound measurements.",
        };
      },
    },
  ],
  relatedSlugs: ["pregnancy-due-date-calculator", "gestational-age-calculator"],
  faq: [
    {
      question: "How is an IVF due date different from a regular due date?",
      answer:
        "IVF due dates are calculated from the embryo transfer date rather than the last menstrual period. For a Day 5 blastocyst transfer, subtract 19 days to get the equivalent LMP, then add 280 days. This is often more accurate because the exact timing of fertilization is known.",
    },
    {
      question: "Are IVF due dates more accurate?",
      answer:
        "Yes, IVF due dates are generally more accurate because the exact date of fertilization and embryo development stage are known. With natural conception, the exact ovulation and fertilization date are estimated.",
    },
  ],
  formula:
    "Day 5 transfer: Due date = transfer + 261 days. Day 3 transfer: Due date = transfer + 263 days. Egg retrieval/IUI: LMP = procedure date - 14 days, due date = LMP + 280 days.",
};
