import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const childSupportCalculator: CalculatorDefinition = {
  slug: "child-support-calculator",
  title: "Child Support Calculator",
  description: "Free child support calculator. Estimate child support payments based on income, custody arrangement, and number of children. Actual amounts vary by state.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["child support calculator", "child support payment", "child support estimator", "custody calculator", "child support obligation"],
  variants: [
    {
      id: "income-shares",
      name: "Income Shares Model",
      description: "Estimate child support using the income shares model (used by most US states)",
      fields: [
        { name: "parentAIncome", label: "Parent A Gross Monthly Income", type: "number", placeholder: "e.g. 5000", prefix: "$" },
        { name: "parentBIncome", label: "Parent B Gross Monthly Income", type: "number", placeholder: "e.g. 3000", prefix: "$" },
        { name: "children", label: "Number of Children", type: "select", options: [
          { label: "1 Child", value: "1" },
          { label: "2 Children", value: "2" },
          { label: "3 Children", value: "3" },
          { label: "4 Children", value: "4" },
          { label: "5 Children", value: "5" },
        ], defaultValue: "1" },
        { name: "custodyPercent", label: "Parent A Custody (%)", type: "number", placeholder: "e.g. 70", suffix: "%", min: 0, max: 100 },
        { name: "healthInsurance", label: "Monthly Health Insurance for Children", type: "number", placeholder: "e.g. 200", prefix: "$", defaultValue: 0 },
        { name: "childcare", label: "Monthly Childcare Costs", type: "number", placeholder: "e.g. 500", prefix: "$", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const parentAIncome = inputs.parentAIncome as number;
        const parentBIncome = inputs.parentBIncome as number;
        const children = parseInt(inputs.children as string) || 1;
        const custodyPercent = inputs.custodyPercent as number;
        const healthInsurance = (inputs.healthInsurance as number) || 0;
        const childcare = (inputs.childcare as number) || 0;

        if (!parentAIncome || !parentBIncome || custodyPercent === undefined) return null;

        const combinedIncome = parentAIncome + parentBIncome;
        const percentageRates: Record<number, number> = { 1: 0.17, 2: 0.25, 3: 0.29, 4: 0.31, 5: 0.35 };
        const rate = percentageRates[children] || 0.17;

        const basicObligation = combinedIncome * rate;
        const totalObligation = basicObligation + healthInsurance + childcare;

        const parentAShare = parentAIncome / combinedIncome;
        const parentBShare = parentBIncome / combinedIncome;

        const parentAObligation = totalObligation * parentAShare;
        const parentBObligation = totalObligation * parentBShare;

        const custodyAdj = custodyPercent / 100;
        let payment: number;
        let payer: string;

        if (custodyAdj >= 0.5) {
          payment = parentBObligation * (1 - (1 - custodyAdj) * 2);
          payer = "Parent B pays Parent A";
        } else {
          payment = parentAObligation * (1 - custodyAdj * 2);
          payer = "Parent A pays Parent B";
        }

        payment = Math.max(0, payment);

        return {
          primary: { label: "Estimated Monthly Child Support", value: `$${formatNumber(payment)}` },
          details: [
            { label: "Direction", value: payer },
            { label: "Combined monthly income", value: `$${formatNumber(combinedIncome)}` },
            { label: "Basic support obligation", value: `$${formatNumber(basicObligation)}` },
            { label: "Total obligation (with add-ons)", value: `$${formatNumber(totalObligation)}` },
            { label: "Parent A income share", value: `${formatNumber(parentAShare * 100)}%` },
            { label: "Parent B income share", value: `${formatNumber(parentBShare * 100)}%` },
            { label: "Annual estimated support", value: `$${formatNumber(payment * 12)}` },
          ],
          note: "This is a general estimate only. Child support formulas vary significantly by state. Consult your state's child support guidelines or a family law attorney for accurate calculations.",
        };
      },
    },
  ],
  relatedSlugs: ["alimony-calculator", "tax-calculator", "paycheck-calculator"],
  faq: [
    { question: "How is child support calculated?", answer: "Most US states use the 'income shares' model, which considers both parents' incomes, number of children, custody arrangement, and additional expenses like healthcare and childcare. The goal is to give children the same proportion of parental income they would have received if the parents lived together." },
    { question: "Can child support be modified?", answer: "Yes. Either parent can request a modification if there is a significant change in circumstances, such as a major income change, change in custody, or change in the child's needs. Most states allow modifications every 2-3 years or when income changes by 15-20%." },
    { question: "Until what age is child support paid?", answer: "In most states, child support continues until the child turns 18 or graduates high school (whichever is later). Some states extend support to age 19 or 21, especially if the child is in college." },
  ],
  formula: "Child Support = (Combined Income × Child Rate) × Non-Custodial Parent's Income Share, adjusted for custody percentage. Typical rates: 1 child = 17%, 2 = 25%, 3 = 29%, 4 = 31%, 5 = 35%.",
};
