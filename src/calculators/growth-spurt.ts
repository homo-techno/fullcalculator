import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const growthSpurtCalculator: CalculatorDefinition = {
  slug: "growth-spurt-calculator",
  title: "Growth Spurt Predictor Calculator",
  description:
    "Free growth spurt predictor calculator. Predict when your baby's next growth spurt will happen based on age and see what to expect during each growth spurt.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "growth spurt calculator",
    "baby growth spurt",
    "when do growth spurts happen",
    "growth spurt ages",
    "growth spurt signs",
  ],
  variants: [
    {
      id: "growth-spurt",
      name: "Predict Growth Spurts",
      description: "See upcoming growth spurts for your baby",
      fields: [
        {
          name: "ageWeeks",
          label: "Baby's Age (weeks)",
          type: "number",
          placeholder: "e.g. 8",
          min: 0,
          max: 104,
        },
      ],
      calculate: (inputs) => {
        const ageWeeks = inputs.ageWeeks as number;
        if (ageWeeks === undefined || ageWeeks === null) return null;

        // Known growth spurt windows (in weeks)
        const spurts = [
          { week: 1, label: "1-2 weeks", duration: "2-3 days", details: "Increased feeding (every 1-2 hours), fussiness, extra sleep between feeds. Baby is adjusting to life outside the womb." },
          { week: 3, label: "3 weeks", duration: "2-3 days", details: "Cluster feeding, increased hunger signals. Baby may want to feed every hour. Weight gain accelerates." },
          { week: 6, label: "6 weeks", duration: "2-4 days", details: "Major growth period. Increased appetite, fussiness, disrupted sleep. Baby may gain up to 2 lbs in a week." },
          { week: 12, label: "3 months", duration: "3-7 days", details: "Significant growth in length and head circumference. Increased feeding and possible sleep regression. Often coincides with developmental leap." },
          { week: 16, label: "4 months", duration: "3-7 days", details: "Major developmental and physical growth. Often accompanied by the 4-month sleep regression. Baby may seem extra hungry and cranky." },
          { week: 26, label: "6 months", duration: "3-7 days", details: "Growth spurt often coincides with readiness for solid foods. Increased appetite, disrupted sleep, and clinginess common." },
          { week: 36, label: "9 months", duration: "3-7 days", details: "Increased hunger, clinginess, and sleep disruption. Often coincides with new mobility skills (crawling, pulling to stand)." },
          { week: 52, label: "12 months", duration: "3-7 days", details: "First birthday growth spurt. Growth rate slows after this. Appetite changes, sleep disruption, and new skill development." },
          { week: 78, label: "18 months", duration: "5-7 days", details: "Toddler growth spurt. Increased appetite, possible sleep changes. Language development often accelerates around this time." },
          { week: 104, label: "24 months", duration: "5-7 days", details: "Last major infant/toddler growth spurt. Growth rate continues to slow. Height gain averages 3-4 inches per year after this." },
        ];

        // Find current/recent/upcoming spurts
        let currentSpurt: typeof spurts[0] | null = null;
        let nextSpurt: typeof spurts[0] | null = null;
        let lastSpurt: typeof spurts[0] | null = null;

        for (let i = 0; i < spurts.length; i++) {
          const s = spurts[i];
          if (Math.abs(ageWeeks - s.week) <= 1) {
            currentSpurt = s;
          } else if (s.week > ageWeeks && !nextSpurt) {
            nextSpurt = s;
          }
          if (s.week <= ageWeeks) {
            lastSpurt = s;
          }
        }

        const weeksUntilNext = nextSpurt ? nextSpurt.week - ageWeeks : null;
        const ageMonths = formatNumber(ageWeeks / 4.33, 1);

        let status: string;
        if (currentSpurt) {
          status = `Currently in or near the ${currentSpurt.label} growth spurt`;
        } else if (nextSpurt) {
          status = `Next growth spurt expected around ${nextSpurt.label}`;
        } else {
          status = "Past the major infant growth spurt periods";
        }

        const details = [];
        details.push({ label: "Baby's Age", value: `${ageWeeks} weeks (~${ageMonths} months)` });
        details.push({ label: "Status", value: status });

        if (currentSpurt) {
          details.push({ label: "Current Spurt", value: `${currentSpurt.label} (lasts ${currentSpurt.duration})` });
          details.push({ label: "What to Expect", value: currentSpurt.details });
        }

        if (nextSpurt && weeksUntilNext !== null) {
          details.push({ label: "Next Growth Spurt", value: `${nextSpurt.label} (in ~${weeksUntilNext} weeks)` });
          details.push({ label: "Next Spurt Details", value: nextSpurt.details });
        }

        if (lastSpurt && lastSpurt !== currentSpurt) {
          details.push({ label: "Last Growth Spurt", value: `${lastSpurt.label} (${ageWeeks - lastSpurt.week} weeks ago)` });
        }

        return {
          primary: {
            label: "Growth Spurt Status",
            value: currentSpurt ? `In ${currentSpurt.label} spurt now` : nextSpurt ? `Next: ${nextSpurt.label}` : "Past major spurts",
          },
          details,
          note: "Growth spurts typically last 2-7 days. Signs include: increased hunger/feeding frequency, fussiness, disrupted sleep, and clinginess. During growth spurts, feed on demand and offer extra comfort. Growth spurts are normal and temporary. Timing varies by child - these are approximate windows.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-growth-calculator", "baby-milestone-calculator", "baby-sleep-schedule-calculator"],
  faq: [
    {
      question: "When do babies have growth spurts?",
      answer:
        "Common growth spurt times are: 1-2 weeks, 3 weeks, 6 weeks, 3 months, 4 months, 6 months, 9 months, 12 months, 18 months, and 24 months. Each baby is different - spurts may happen slightly earlier or later. They typically last 2-7 days.",
    },
    {
      question: "What are the signs of a growth spurt?",
      answer:
        "Key signs include: suddenly increased hunger (wanting to feed much more often), fussiness and irritability, disrupted sleep (waking more at night or napping differently), clinginess, and seeming unsatisfied after normal feeding amounts. These signs usually resolve within a few days.",
    },
    {
      question: "Should I feed more during a growth spurt?",
      answer:
        "Yes, feed on demand during growth spurts. For breastfed babies, the increased nursing helps boost your milk supply to match the baby's growing needs. For formula-fed babies, offer additional formula. Do not restrict feeding during a growth spurt. The increased appetite is temporary and necessary.",
    },
  ],
  formula:
    "Growth spurts predicted at standard developmental windows: 1-2 weeks, 3 weeks, 6 weeks, 3 months, 4 months, 6 months, 9 months, 12 months, 18 months, 24 months. Duration: 2-7 days each. Timing varies ±1 week per child.",
};
