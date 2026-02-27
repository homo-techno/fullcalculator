import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airbnbOccupancyRateCalculator: CalculatorDefinition = {
  slug: "airbnb-occupancy-rate",
  title: "Airbnb Occupancy Rate & Revenue Estimator",
  description:
    "Estimate Airbnb rental revenue and occupancy metrics. Calculate gross revenue, net income after expenses, and compare against long-term rental income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Airbnb",
    "occupancy rate",
    "revenue",
    "short-term rental",
    "STR",
    "vacation rental",
    "VRBO",
    "host",
    "rental income",
    "investment property",
  ],
  variants: [
    {
      slug: "revenue-estimate",
      title: "Revenue & Occupancy Estimate",
      fields: [
        {
          name: "nightlyRate",
          label: "Average Nightly Rate ($)",
          type: "number",
        },
        {
          name: "occupancyRate",
          label: "Expected Occupancy Rate (%)",
          type: "number",
        },
        {
          name: "cleaningFee",
          label: "Cleaning Fee per Stay ($)",
          type: "number",
        },
        {
          name: "avgStayLength",
          label: "Average Stay Length (nights)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const nightly = parseFloat(inputs.nightlyRate as string);
        const occupancy = parseFloat(inputs.occupancyRate as string);
        const cleaningFee = parseFloat(inputs.cleaningFee as string);
        const stayLength = parseFloat(inputs.avgStayLength as string);
        if (isNaN(nightly) || isNaN(occupancy) || isNaN(cleaningFee) || isNaN(stayLength))
          return { error: "Please enter all values." };

        const bookedNightsMonth = 30 * (occupancy / 100);
        const bookedNightsYear = 365 * (occupancy / 100);
        const staysPerMonth = bookedNightsMonth / stayLength;
        const monthlyNightlyRev = bookedNightsMonth * nightly;
        const monthlyCleaningRev = staysPerMonth * cleaningFee;
        const monthlyGross = monthlyNightlyRev + monthlyCleaningRev;
        const airbnbFee = monthlyGross * 0.03;
        const monthlyAfterFees = monthlyGross - airbnbFee;
        const annualGross = monthlyGross * 12;
        const annualAfterFees = monthlyAfterFees * 12;

        return {
          results: [
            { label: "Booked Nights/Month", value: formatNumber(bookedNightsMonth) },
            { label: "Stays per Month", value: formatNumber(staysPerMonth) },
            { label: "Monthly Gross Revenue", value: `$${formatNumber(monthlyGross)}` },
            { label: "Airbnb Host Fee (3%)", value: `$${formatNumber(airbnbFee)}/mo` },
            { label: "Monthly After Platform Fees", value: `$${formatNumber(monthlyAfterFees)}` },
            { label: "Annual Gross Revenue", value: `$${formatNumber(annualGross)}` },
            { label: "Annual After Platform Fees", value: `$${formatNumber(annualAfterFees)}` },
          ],
        };
      },
    },
    {
      slug: "net-income",
      title: "Net Income After Expenses",
      fields: [
        {
          name: "monthlyRevenue",
          label: "Monthly Gross Revenue ($)",
          type: "number",
        },
        {
          name: "mortgage",
          label: "Monthly Mortgage/Rent ($)",
          type: "number",
        },
        {
          name: "utilities",
          label: "Monthly Utilities ($)",
          type: "number",
        },
        {
          name: "cleaningCost",
          label: "Monthly Cleaning Costs ($)",
          type: "number",
        },
        {
          name: "supplies",
          label: "Monthly Supplies & Amenities ($)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const revenue = parseFloat(inputs.monthlyRevenue as string);
        const mortgage = parseFloat(inputs.mortgage as string);
        const utilities = parseFloat(inputs.utilities as string);
        const cleaning = parseFloat(inputs.cleaningCost as string);
        const supplies = parseFloat(inputs.supplies as string);
        if (isNaN(revenue) || isNaN(mortgage) || isNaN(utilities) || isNaN(cleaning) || isNaN(supplies))
          return { error: "Please enter all values." };

        const platformFee = revenue * 0.03;
        const insurance = 150;
        const maintenance = revenue * 0.05;
        const totalExpenses = mortgage + utilities + cleaning + supplies + platformFee + insurance + maintenance;
        const netIncome = revenue - totalExpenses;
        const annualNet = netIncome * 12;
        const profitMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0;

        return {
          results: [
            { label: "Monthly Gross Revenue", value: `$${formatNumber(revenue)}` },
            { label: "Mortgage/Rent", value: `$${formatNumber(mortgage)}` },
            { label: "Utilities", value: `$${formatNumber(utilities)}` },
            { label: "Cleaning", value: `$${formatNumber(cleaning)}` },
            { label: "Supplies & Amenities", value: `$${formatNumber(supplies)}` },
            { label: "Platform Fee + Insurance + Maintenance", value: `$${formatNumber(platformFee + insurance + maintenance)}` },
            { label: "Total Monthly Expenses", value: `$${formatNumber(totalExpenses)}` },
            { label: "Monthly Net Income", value: `$${formatNumber(netIncome)}` },
            { label: "Annual Net Income", value: `$${formatNumber(annualNet)}` },
            { label: "Profit Margin", value: `${formatNumber(profitMargin)}%` },
          ],
        };
      },
    },
    {
      slug: "str-vs-ltr",
      title: "Short-Term vs. Long-Term Rental",
      fields: [
        {
          name: "nightlyRate",
          label: "Airbnb Nightly Rate ($)",
          type: "number",
        },
        {
          name: "occupancyRate",
          label: "Expected Occupancy (%)",
          type: "number",
        },
        {
          name: "longTermRent",
          label: "Potential Long-Term Rent ($/mo)",
          type: "number",
        },
        {
          name: "strExpenses",
          label: "STR Monthly Expenses ($)",
          type: "number",
        },
        {
          name: "ltrExpenses",
          label: "LTR Monthly Expenses ($)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const nightly = parseFloat(inputs.nightlyRate as string);
        const occupancy = parseFloat(inputs.occupancyRate as string);
        const ltrRent = parseFloat(inputs.longTermRent as string);
        const strExp = parseFloat(inputs.strExpenses as string);
        const ltrExp = parseFloat(inputs.ltrExpenses as string);
        if (isNaN(nightly) || isNaN(occupancy) || isNaN(ltrRent) || isNaN(strExp) || isNaN(ltrExp))
          return { error: "Please enter all values." };

        const strMonthlyGross = nightly * 30 * (occupancy / 100);
        const strNet = strMonthlyGross - strExp;
        const ltrNet = ltrRent - ltrExp;
        const difference = strNet - ltrNet;
        const breakEvenOccupancy = ltrRent > 0 ? ((ltrNet + strExp) / (nightly * 30)) * 100 : 0;

        const recommendation =
          strNet > ltrNet * 1.3
            ? "Short-term rental significantly more profitable"
            : strNet > ltrNet
            ? "Short-term slightly better but consider the extra effort"
            : "Long-term rental recommended - less work, similar income";

        return {
          results: [
            { label: "STR Monthly Gross", value: `$${formatNumber(strMonthlyGross)}` },
            { label: "STR Monthly Net", value: `$${formatNumber(strNet)}` },
            { label: "LTR Monthly Net", value: `$${formatNumber(ltrNet)}` },
            { label: "Monthly Difference (STR - LTR)", value: `$${formatNumber(difference)}` },
            { label: "Annual Difference", value: `$${formatNumber(difference * 12)}` },
            { label: "Break-Even Occupancy for STR", value: `${formatNumber(breakEvenOccupancy)}%` },
            { label: "Recommendation", value: recommendation },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["turo-profit", "adu-cost", "rent-to-income"],
  faq: [
    {
      question: "What is a good Airbnb occupancy rate?",
      answer:
        "A good Airbnb occupancy rate varies by market but generally 50-65% is average, 65-80% is good, and 80%+ is excellent. Seasonal markets may see 90%+ in peak months and 20-30% in off-season. Urban markets tend to have more consistent occupancy year-round.",
    },
    {
      question: "How much does Airbnb take from hosts?",
      answer:
        "Airbnb charges hosts a service fee of approximately 3% per booking under the split-fee structure (where guests also pay a service fee). Some hosts opt for the host-only fee structure at approximately 14-16% where guests see no separate service fee.",
    },
    {
      question: "Is Airbnb more profitable than long-term renting?",
      answer:
        "Airbnb can gross 2-3x more than long-term rent in popular markets, but higher expenses (cleaning, furnishing, utilities, management, turnover) reduce the gap. Net income is often 20-50% more than long-term renting. However, STR requires more active management and faces regulatory risks.",
    },
  ],
  formula:
    "Monthly Revenue = Nightly Rate x 30 x (Occupancy% / 100) + Cleaning Fees | Net = Revenue - Platform Fees - Expenses | Break-Even Occupancy = (LTR Net + STR Expenses) / (Nightly x 30) x 100",
};
