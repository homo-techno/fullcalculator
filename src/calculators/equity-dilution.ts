import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const equityDilutionCalculator: CalculatorDefinition = {
  slug: "equity-dilution",
  title: "Founder Equity Dilution Calculator",
  description:
    "Calculate founder equity dilution across multiple funding rounds, including pre-seed, seed, Series A, and beyond, with option pool impact.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "equity dilution",
    "founder dilution",
    "startup dilution",
    "funding rounds",
    "cap table",
    "equity calculator",
    "venture capital dilution",
    "ownership percentage",
  ],
  variants: [
    {
      slug: "equity-dilution",
      title: "Single Round Dilution Calculator",
      description:
        "Calculate founder dilution from a single funding round.",
      fields: [
        {
          id: "founderOwnership",
          label: "Current Founder Ownership (%)",
          type: "number",
          defaultValue: 100,
        },
        {
          id: "preMoneyValuation",
          label: "Pre-Money Valuation ($)",
          type: "number",
          defaultValue: 5000000,
        },
        {
          id: "investmentAmount",
          label: "Investment Amount ($)",
          type: "number",
          defaultValue: 1500000,
        },
        {
          id: "optionPoolPercent",
          label: "Option Pool (% of post-money)",
          type: "number",
          defaultValue: 10,
        },
        {
          id: "numberOfFounders",
          label: "Number of Founders",
          type: "number",
          defaultValue: 2,
        },
      ],
      calculate(inputs) {
        const founderOwnership =
          parseFloat(inputs.founderOwnership as string) / 100;
        const preMoneyValuation = parseFloat(
          inputs.preMoneyValuation as string
        );
        const investmentAmount = parseFloat(inputs.investmentAmount as string);
        const optionPoolPercent =
          parseFloat(inputs.optionPoolPercent as string) / 100;
        const numberOfFounders = parseFloat(inputs.numberOfFounders as string);

        const postMoneyValuation = preMoneyValuation + investmentAmount;
        const investorOwnership = investmentAmount / postMoneyValuation;
        const remainingAfterInvestor = 1 - investorOwnership;
        const optionPoolFromRemaining = optionPoolPercent;
        const founderPostRound =
          founderOwnership *
          remainingAfterInvestor *
          (1 - optionPoolFromRemaining);

        const perFounderPost = founderPostRound / numberOfFounders;
        const dilutionPercent =
          ((founderOwnership - founderPostRound) / founderOwnership) * 100;

        const founderShareValue =
          founderPostRound * postMoneyValuation;
        const perFounderValue = founderShareValue / numberOfFounders;

        return {
          "Post-Money Valuation": "$" + formatNumber(postMoneyValuation),
          "Investor Ownership": formatNumber(investorOwnership * 100) + "%",
          "Option Pool": formatNumber(optionPoolPercent * 100) + "%",
          "Total Founder Ownership (post)":
            formatNumber(founderPostRound * 100) + "%",
          "Per Founder Ownership":
            formatNumber(perFounderPost * 100) + "%",
          "Dilution from Round": formatNumber(dilutionPercent) + "%",
          "Total Founder Equity Value":
            "$" + formatNumber(founderShareValue),
          "Per Founder Equity Value":
            "$" + formatNumber(perFounderValue),
        };
      },
    },
    {
      slug: "equity-dilution-multi-round",
      title: "Multi-Round Dilution Calculator",
      description:
        "Project founder dilution across multiple funding rounds from pre-seed to Series B.",
      fields: [
        {
          id: "preSeedRaise",
          label: "Pre-Seed Raise ($)",
          type: "number",
          defaultValue: 500000,
        },
        {
          id: "preSeedValuation",
          label: "Pre-Seed Pre-Money Valuation ($)",
          type: "number",
          defaultValue: 2000000,
        },
        {
          id: "seedRaise",
          label: "Seed Raise ($)",
          type: "number",
          defaultValue: 2000000,
        },
        {
          id: "seedValuation",
          label: "Seed Pre-Money Valuation ($)",
          type: "number",
          defaultValue: 8000000,
        },
        {
          id: "seriesARaise",
          label: "Series A Raise ($)",
          type: "number",
          defaultValue: 10000000,
        },
        {
          id: "seriesAValuation",
          label: "Series A Pre-Money Valuation ($)",
          type: "number",
          defaultValue: 40000000,
        },
        {
          id: "optionPoolEachRound",
          label: "Option Pool Increase per Round (%)",
          type: "number",
          defaultValue: 10,
        },
      ],
      calculate(inputs) {
        const preSeedRaise = parseFloat(inputs.preSeedRaise as string);
        const preSeedValuation = parseFloat(inputs.preSeedValuation as string);
        const seedRaise = parseFloat(inputs.seedRaise as string);
        const seedValuation = parseFloat(inputs.seedValuation as string);
        const seriesARaise = parseFloat(inputs.seriesARaise as string);
        const seriesAValuation = parseFloat(inputs.seriesAValuation as string);
        const optionPool =
          parseFloat(inputs.optionPoolEachRound as string) / 100;

        // Pre-Seed
        let founderOwnership = 1.0;
        let postMoney = preSeedValuation + preSeedRaise;
        let investorPct = preSeedRaise / postMoney;
        founderOwnership = founderOwnership * (1 - investorPct) * (1 - optionPool);
        const afterPreSeed = founderOwnership;

        // Seed
        postMoney = seedValuation + seedRaise;
        investorPct = seedRaise / postMoney;
        founderOwnership = founderOwnership * (1 - investorPct) * (1 - optionPool);
        const afterSeed = founderOwnership;

        // Series A
        postMoney = seriesAValuation + seriesARaise;
        investorPct = seriesARaise / postMoney;
        founderOwnership = founderOwnership * (1 - investorPct) * (1 - optionPool);
        const afterSeriesA = founderOwnership;

        const seriesAPostMoney = seriesAValuation + seriesARaise;
        const founderValue = afterSeriesA * seriesAPostMoney;

        return {
          "After Pre-Seed Ownership":
            formatNumber(afterPreSeed * 100) + "%",
          "After Seed Ownership": formatNumber(afterSeed * 100) + "%",
          "After Series A Ownership":
            formatNumber(afterSeriesA * 100) + "%",
          "Total Dilution":
            formatNumber((1 - afterSeriesA) * 100) + "%",
          "Series A Post-Money": "$" + formatNumber(seriesAPostMoney),
          "Founder Equity Value": "$" + formatNumber(founderValue),
          "Total Raised":
            "$" +
            formatNumber(preSeedRaise + seedRaise + seriesARaise),
        };
      },
    },
  ],
  relatedSlugs: [
    "stock-option-value",
    "startup-runway",
    "saas-metrics",
    "app-revenue",
  ],
  faq: [
    {
      question: "How much equity do founders typically give up in each round?",
      answer:
        "Founders typically give up 15-25% per funding round. Pre-seed rounds dilute 10-20%, seed rounds 15-25%, and Series A rounds 15-25%. Including option pool expansion, total dilution per round is often 25-35%. After three rounds, founders typically retain 20-40% ownership collectively.",
    },
    {
      question: "What is an option pool and how does it affect dilution?",
      answer:
        "An option pool is a block of shares reserved for employee compensation, typically 10-20% of the company. Investors usually require the option pool be created from the founders' shares before investment (pre-money), increasing effective founder dilution beyond just the investment percentage.",
    },
    {
      question: "How can founders minimize equity dilution?",
      answer:
        "Founders can minimize dilution by bootstrapping longer before raising, negotiating higher valuations, raising smaller rounds, using revenue-based financing, negotiating post-money option pool creation, and demonstrating strong traction to command premium valuations.",
    },
  ],
  formula:
    "Post-Money Valuation = Pre-Money + Investment. Investor Ownership = Investment / Post-Money. Founder Post-Round = Current Ownership x (1 - Investor %) x (1 - Option Pool %). Dilution compounds across rounds.",
};
