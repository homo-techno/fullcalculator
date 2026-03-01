import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rescisaoCalculatorBrazilCalculator: CalculatorDefinition = {
  slug: "rescisao-calculator-brazil",
  title: "Rescisao Calculator Brazil",
  description: "Calculate the termination pay (rescisao) owed to a Brazilian CLT employee upon dismissal.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["rescisao calculator", "termination pay brazil", "severance calculator brazil"],
  variants: [{
    id: "standard",
    name: "Rescisao Brazil",
    description: "Calculate the termination pay (rescisao) owed to a Brazilian CLT employee upon dismissal",
    fields: [
      { name: "monthlySalary", label: "Monthly Gross Salary", type: "number", prefix: "R$", min: 1000, max: 200000, step: 500, defaultValue: 5000 },
      { name: "monthsWorked", label: "Total Months Worked", type: "number", suffix: "months", min: 1, max: 480, defaultValue: 24 },
      { name: "terminationType", label: "Termination Type", type: "select", options: [{value:"without_cause",label:"Without Cause (Sem Justa Causa)"},{value:"with_cause",label:"With Cause (Justa Causa)"},{value:"resignation",label:"Resignation (Pedido de Demissao)"}], defaultValue: "without_cause" },
      { name: "unusedVacationDays", label: "Unused Vacation Days", type: "number", suffix: "days", min: 0, max: 60, defaultValue: 15 },
    ],
    calculate: (inputs) => {
      const salary = inputs.monthlySalary as number;
      const months = inputs.monthsWorked as number;
      const type = inputs.terminationType as string;
      const vacDays = inputs.unusedVacationDays as number;
      if (!salary || !months || salary <= 0) return null;
      const dailyRate = salary / 30;
      const proportional13th = salary * ((months % 12) / 12);
      const vacationPay = dailyRate * (vacDays || 0);
      const vacationBonus = vacationPay / 3;
      let fgtsBalance = salary * 0.08 * months;
      let fgtsFine = 0;
      let noticePay = 0;
      if (type === "without_cause") {
        fgtsFine = fgtsBalance * 0.40;
        noticePay = salary + Math.min(Math.floor(months / 12), 20) * (salary / 30) * 3;
      } else if (type === "resignation") {
        fgtsFine = 0;
        noticePay = 0;
      } else {
        fgtsFine = 0;
        noticePay = 0;
        fgtsBalance = 0;
      }
      const total = proportional13th + vacationPay + vacationBonus + fgtsFine + noticePay;
      return {
        primary: { label: "Estimated Rescisao Total", value: "R$ " + formatNumber(Math.round(total)) },
        details: [
          { label: "Proportional 13th Salary", value: "R$ " + formatNumber(Math.round(proportional13th)) },
          { label: "Vacation Pay + 1/3 Bonus", value: "R$ " + formatNumber(Math.round(vacationPay + vacationBonus)) },
          { label: "FGTS Fine (40%)", value: "R$ " + formatNumber(Math.round(fgtsFine)) },
        ],
      };
    },
  }],
  relatedSlugs: ["fgts-calculator-brazil", "decimo-terceiro-calculator"],
  faq: [
    { question: "What is included in a rescisao for dismissal without cause?", answer: "Dismissal without cause entitles the employee to notice pay (or worked notice), proportional 13th salary, unused vacation plus one-third bonus, FGTS balance withdrawal, and a 40 percent fine on the FGTS balance." },
    { question: "Does resignation affect the rescisao amount?", answer: "Yes. When an employee resigns, they forfeit the 40 percent FGTS fine, cannot withdraw the FGTS balance immediately, and may owe the employer 30 days of notice if not served." },
  ],
  formula: "Rescisao = Proportional 13th + Vacation Pay + Vacation Bonus + FGTS Fine + Notice Pay",
};
