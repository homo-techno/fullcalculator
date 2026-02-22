import type { CalculatorDefinition } from "./types";

export const postpartumRecoveryCalculator: CalculatorDefinition = {
  slug: "postpartum-recovery-calculator",
  title: "Postpartum Recovery Timeline Calculator",
  description:
    "Free postpartum recovery timeline calculator. Get an estimated recovery timeline based on your delivery type and understand what to expect during the postpartum period.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "postpartum recovery",
    "recovery after birth",
    "postpartum timeline",
    "c-section recovery",
    "after birth recovery",
  ],
  variants: [
    {
      id: "postpartum-timeline",
      name: "Postpartum Recovery Timeline",
      description: "Estimate recovery milestones after delivery",
      fields: [
        {
          name: "deliveryType",
          label: "Delivery Type",
          type: "select",
          options: [
            { label: "Vaginal Delivery (no tears)", value: "vaginal-none" },
            { label: "Vaginal Delivery (with tearing/episiotomy)", value: "vaginal-tear" },
            { label: "C-Section (planned)", value: "csection-planned" },
            { label: "C-Section (emergency)", value: "csection-emergency" },
          ],
          defaultValue: "vaginal-none",
        },
        {
          name: "weeksPostpartum",
          label: "Weeks Since Delivery",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
          max: 52,
          defaultValue: 0,
        },
        {
          name: "breastfeeding",
          label: "Breastfeeding Status",
          type: "select",
          options: [
            { label: "Exclusively Breastfeeding", value: "exclusive" },
            { label: "Combination Feeding", value: "combo" },
            { label: "Formula Only", value: "formula" },
          ],
          defaultValue: "exclusive",
        },
        {
          name: "complications",
          label: "Any Complications?",
          type: "select",
          options: [
            { label: "No Complications", value: "none" },
            { label: "Minor Complications", value: "minor" },
            { label: "Major Complications", value: "major" },
          ],
          defaultValue: "none",
        },
      ],
      calculate: (inputs) => {
        const delivery = inputs.deliveryType as string;
        const weeks = (inputs.weeksPostpartum as number) || 0;
        const breastfeeding = inputs.breastfeeding as string;
        const complications = inputs.complications as string;

        let fullRecoveryWeeks: number;
        let exerciseClearance: string;
        let intimacyClearance: string;
        let drivingClearance: string;
        let liftingRestriction: string;

        if (delivery.startsWith("vaginal")) {
          fullRecoveryWeeks = delivery === "vaginal-tear" ? 8 : 6;
          exerciseClearance = "Light walking immediately; moderate exercise at 4-6 weeks (after provider clearance)";
          intimacyClearance = "Typically 4-6 weeks postpartum (after provider clearance)";
          drivingClearance = "Usually within 1-2 weeks";
          liftingRestriction = "Avoid heavy lifting (>20 lbs) for 2-4 weeks";
        } else {
          fullRecoveryWeeks = delivery === "csection-emergency" ? 12 : 10;
          exerciseClearance = "Light walking at 1-2 weeks; moderate exercise at 6-8 weeks (after provider clearance)";
          intimacyClearance = "Typically 6-8 weeks postpartum (after provider clearance)";
          drivingClearance = "Usually 2-4 weeks (once off narcotic pain medication)";
          liftingRestriction = "Avoid lifting anything heavier than baby for 6-8 weeks";
        }

        // Adjust for complications
        if (complications === "minor") {
          fullRecoveryWeeks += 2;
        } else if (complications === "major") {
          fullRecoveryWeeks += 6;
        }

        const percentRecovered = Math.min(100, Math.round((weeks / fullRecoveryWeeks) * 100));

        // Period return estimate
        let periodReturn: string;
        if (breastfeeding === "exclusive") {
          periodReturn = "6-18 months (delayed by breastfeeding)";
        } else if (breastfeeding === "combo") {
          periodReturn = "3-6 months";
        } else {
          periodReturn = "6-8 weeks";
        }

        // Milestones
        const milestones: { label: string; value: string }[] = [
          { label: "Recovery Progress", value: `~${percentRecovered}% (Week ${weeks} of ~${fullRecoveryWeeks})` },
          { label: "Full Physical Recovery", value: `~${fullRecoveryWeeks} weeks` },
          { label: "Exercise Clearance", value: exerciseClearance },
          { label: "Intimacy Clearance", value: intimacyClearance },
          { label: "Driving Clearance", value: drivingClearance },
          { label: "Lifting Restriction", value: liftingRestriction },
          { label: "Period Return (estimated)", value: periodReturn },
          { label: "6-Week Checkup", value: "Schedule postpartum visit at 6 weeks" },
        ];

        return {
          primary: {
            label: "Recovery Progress",
            value: `${percentRecovered}%`,
          },
          details: milestones,
          note: "Every recovery is unique. This timeline provides general estimates only. Contact your healthcare provider immediately if you experience heavy bleeding, fever, signs of infection, severe pain, or mood changes. Postpartum depression affects 1 in 7 women and is treatable.",
        };
      },
    },
  ],
  relatedSlugs: ["postpartum-exercise-calculator", "pregnancy-calculator", "breastfeeding-calorie-calculator"],
  faq: [
    {
      question: "How long does postpartum recovery take?",
      answer:
        "Full physical recovery typically takes 6-8 weeks for vaginal delivery and 10-12 weeks for C-section. However, complete recovery including hormonal normalization, pelvic floor strength, and emotional adjustment can take 6-12 months or longer.",
    },
    {
      question: "When should I see a doctor after delivery?",
      answer:
        "The standard postpartum checkup is at 6 weeks, but ACOG recommends initial contact within 3 weeks. Seek immediate care for: heavy bleeding (soaking a pad per hour), fever above 100.4F, foul-smelling discharge, severe headache, vision changes, calf pain, or thoughts of harming yourself or baby.",
    },
    {
      question: "What is postpartum depression and when does it start?",
      answer:
        "Postpartum depression (PPD) affects about 1 in 7 women and can start anytime in the first year after birth, most commonly within the first 3 months. Symptoms include persistent sadness, anxiety, difficulty bonding with baby, withdrawal, and changes in sleep/appetite. It differs from 'baby blues' (2-3 weeks of mild mood swings) in severity and duration. PPD is treatable with therapy and/or medication.",
    },
  ],
  formula:
    "Recovery Timeline = Based on delivery type + complications | Progress = (Current Weeks / Total Recovery Weeks) x 100",
};
