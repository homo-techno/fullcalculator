import type { CalculatorDefinition } from "./types";

export const postpartumDepressionCalculator: CalculatorDefinition = {
  slug: "postpartum-depression-screener",
  title: "Postpartum Depression Screener",
  description:
    "Free postpartum depression screening tool based on the Edinburgh Postnatal Depression Scale (EPDS). This is a screening tool, not a diagnosis.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "postpartum depression",
    "PPD screening",
    "Edinburgh scale",
    "postnatal depression",
    "baby blues",
  ],
  variants: [
    {
      id: "epds",
      name: "Edinburgh Postnatal Depression Scale (Simplified)",
      description:
        "Answer questions about how you have felt in the past 7 days",
      fields: [
        {
          name: "enjoyment",
          label: "I have been able to laugh and see the funny side of things",
          type: "select",
          options: [
            { label: "As much as I always could", value: "0" },
            { label: "Not quite so much now", value: "1" },
            { label: "Definitely not so much now", value: "2" },
            { label: "Not at all", value: "3" },
          ],
        },
        {
          name: "lookForward",
          label: "I have looked forward with enjoyment to things",
          type: "select",
          options: [
            { label: "As much as I ever did", value: "0" },
            { label: "Rather less than I used to", value: "1" },
            { label: "Definitely less than I used to", value: "2" },
            { label: "Hardly at all", value: "3" },
          ],
        },
        {
          name: "blame",
          label: "I have blamed myself unnecessarily when things went wrong",
          type: "select",
          options: [
            { label: "No, never", value: "0" },
            { label: "Not very often", value: "1" },
            { label: "Yes, some of the time", value: "2" },
            { label: "Yes, most of the time", value: "3" },
          ],
        },
        {
          name: "anxiety",
          label: "I have been anxious or worried for no good reason",
          type: "select",
          options: [
            { label: "No, not at all", value: "0" },
            { label: "Hardly ever", value: "1" },
            { label: "Yes, sometimes", value: "2" },
            { label: "Yes, very often", value: "3" },
          ],
        },
        {
          name: "scared",
          label: "I have felt scared or panicky for no very good reason",
          type: "select",
          options: [
            { label: "No, not at all", value: "0" },
            { label: "No, not much", value: "1" },
            { label: "Yes, sometimes", value: "2" },
            { label: "Yes, quite a lot", value: "3" },
          ],
        },
        {
          name: "overwhelmed",
          label: "Things have been getting on top of me",
          type: "select",
          options: [
            { label: "No, I have been coping well", value: "0" },
            { label: "No, most of the time I cope well", value: "1" },
            { label: "Yes, sometimes I haven't been coping", value: "2" },
            { label: "Yes, most of the time I haven't been coping", value: "3" },
          ],
        },
        {
          name: "sleepDifficulty",
          label: "I have been so unhappy that I have had difficulty sleeping",
          type: "select",
          options: [
            { label: "No, not at all", value: "0" },
            { label: "Not very often", value: "1" },
            { label: "Yes, sometimes", value: "2" },
            { label: "Yes, most of the time", value: "3" },
          ],
        },
        {
          name: "sadness",
          label: "I have felt sad or miserable",
          type: "select",
          options: [
            { label: "No, not at all", value: "0" },
            { label: "Not very often", value: "1" },
            { label: "Yes, quite often", value: "2" },
            { label: "Yes, most of the time", value: "3" },
          ],
        },
        {
          name: "crying",
          label: "I have been so unhappy that I have been crying",
          type: "select",
          options: [
            { label: "No, never", value: "0" },
            { label: "Only occasionally", value: "1" },
            { label: "Yes, quite often", value: "2" },
            { label: "Yes, most of the time", value: "3" },
          ],
        },
      ],
      calculate: (inputs) => {
        const scores = [
          parseInt(inputs.enjoyment as string),
          parseInt(inputs.lookForward as string),
          parseInt(inputs.blame as string),
          parseInt(inputs.anxiety as string),
          parseInt(inputs.scared as string),
          parseInt(inputs.overwhelmed as string),
          parseInt(inputs.sleepDifficulty as string),
          parseInt(inputs.sadness as string),
          parseInt(inputs.crying as string),
        ];

        if (scores.some(isNaN)) return null;

        const total = scores.reduce((a, b) => a + b, 0);

        let risk = "";
        let recommendation = "";

        if (total <= 8) {
          risk = "Low Risk";
          recommendation =
            "Your score suggests low risk for postpartum depression. Continue to monitor your mood and reach out if things change.";
        } else if (total <= 12) {
          risk = "Possible Depression";
          recommendation =
            "Your score suggests possible depression. Please talk to your healthcare provider about how you are feeling. Early support makes a big difference.";
        } else {
          risk = "Likely Depression";
          recommendation =
            "Your score suggests likely depression. Please contact your healthcare provider as soon as possible. Postpartum depression is treatable and you deserve support.";
        }

        return {
          primary: { label: "Screening Result", value: `Score: ${total}/27 - ${risk}` },
          details: [
            { label: "Recommendation", value: recommendation },
            { label: "Score range", value: "0-8: Low risk | 9-12: Possible | 13+: Likely" },
            {
              label: "Important",
              value: "This is a screening tool, NOT a diagnosis. Only a healthcare provider can diagnose PPD.",
            },
            {
              label: "Crisis resources",
              value: "Postpartum Support International: 1-800-944-4773 | Crisis Text Line: Text HOME to 741741",
            },
            {
              label: "Baby blues vs PPD",
              value: "Baby blues (1-2 weeks postpartum) are normal. If symptoms last beyond 2 weeks, talk to your provider.",
            },
          ],
          note: "This is a simplified screening tool based on the Edinburgh Postnatal Depression Scale. It is NOT a substitute for professional evaluation. If you are having thoughts of harming yourself or your baby, call 988 (Suicide & Crisis Lifeline) immediately.",
        };
      },
    },
  ],
  relatedSlugs: ["postpartum-recovery-calculator", "pregnancy-due-date-calculator"],
  faq: [
    {
      question: "What is the Edinburgh Postnatal Depression Scale?",
      answer:
        "The EPDS is a 10-question screening tool used worldwide to identify women at risk for postpartum depression. A score of 10 or higher suggests possible depression. It's a screening tool, not a diagnostic test.",
    },
    {
      question: "What is the difference between baby blues and postpartum depression?",
      answer:
        "Baby blues affect up to 80% of new mothers and involve mood swings, tearfulness, and anxiety in the first 1-2 weeks after birth. They resolve on their own. Postpartum depression is more severe, lasts longer (beyond 2 weeks), and may require treatment. Symptoms include persistent sadness, difficulty bonding, withdrawal, and changes in eating/sleeping.",
    },
  ],
  formula:
    "Edinburgh Postnatal Depression Scale (simplified): 9 questions scored 0-3. Total 0-27. Low risk: 0-8. Possible depression: 9-12. Likely depression: 13+.",
};
