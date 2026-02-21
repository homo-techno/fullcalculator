import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyMilestoneCalculator: CalculatorDefinition = {
  slug: "baby-milestone-calculator",
  title: "Baby Milestone Tracker Calculator",
  description:
    "Free baby milestone tracker calculator. See expected developmental milestones for your baby's age including motor, language, social, and cognitive skills.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby milestones",
    "baby milestone chart",
    "developmental milestones",
    "baby milestone tracker",
    "when do babies crawl walk talk",
  ],
  variants: [
    {
      id: "milestones",
      name: "Milestones by Age",
      description: "See expected milestones for your baby's age",
      fields: [
        {
          name: "ageMonths",
          label: "Baby's Age (months)",
          type: "number",
          placeholder: "e.g. 9",
          min: 0,
          max: 36,
        },
      ],
      calculate: (inputs) => {
        const ageMonths = inputs.ageMonths as number;
        if (ageMonths === undefined || ageMonths === null) return null;

        interface MilestoneSet {
          ageLabel: string;
          gross: string;
          fine: string;
          language: string;
          social: string;
          cognitive: string;
          nextMilestone: string;
        }

        const milestones: Record<number, MilestoneSet> = {
          0: {
            ageLabel: "Newborn (0-1 month)",
            gross: "Lifts head briefly when on tummy, strong reflexes (grasp, root, suck)",
            fine: "Hands mostly fisted, reflexive grasp",
            language: "Cries to communicate, startles at loud sounds",
            social: "Focuses on faces 8-12 inches away, prefers human faces",
            cognitive: "Recognizes mother's voice and smell",
            nextMilestone: "2 months: social smile, better head control",
          },
          2: {
            ageLabel: "2 months",
            gross: "Lifts head 45° during tummy time, less jerky movements",
            fine: "Opens and closes hands, brings hands to mouth",
            language: "Coos and makes gurgling sounds",
            social: "Social smile, begins to follow faces with eyes",
            cognitive: "Pays attention to faces, begins to track objects",
            nextMilestone: "4 months: rolls over, laughs, reaches for objects",
          },
          4: {
            ageLabel: "4 months",
            gross: "Holds head steady, pushes up on elbows, may roll front to back",
            fine: "Reaches for and grasps toys, brings objects to mouth",
            language: "Babbles (ba-ba), laughs, imitates sounds",
            social: "Laughs out loud, enjoys playing with people",
            cognitive: "Explores toys with hands and mouth, watches faces intently",
            nextMilestone: "6 months: sits without support, begins solid food readiness",
          },
          6: {
            ageLabel: "6 months",
            gross: "Sits without support, rolls both ways, bears weight on legs",
            fine: "Transfers objects between hands, raking grasp",
            language: "Babbles consonant sounds, responds to own name",
            social: "Recognizes familiar faces, stranger anxiety begins",
            cognitive: "Looks for dropped toys, explores objects by mouthing and banging",
            nextMilestone: "9 months: crawling, pulls to stand, pincer grasp",
          },
          9: {
            ageLabel: "9 months",
            gross: "Crawls, pulls to stand, cruises along furniture",
            fine: "Pincer grasp (thumb and finger), pokes with index finger",
            language: "Says 'mama' and 'dada' (may not be specific), understands 'no'",
            social: "Clings to familiar adults, waves bye-bye",
            cognitive: "Object permanence developing, finds hidden objects",
            nextMilestone: "12 months: first steps, first real words, more independence",
          },
          12: {
            ageLabel: "12 months",
            gross: "Stands alone, may take first steps, sits down from standing",
            fine: "Puts objects in containers, turns pages of a book",
            language: "1-3 words besides mama/dada, follows simple instructions",
            social: "Shows affection, has favorite people and toys",
            cognitive: "Imitates actions, explores objects in different ways",
            nextMilestone: "18 months: walks well, 10-20 words, more pretend play",
          },
          18: {
            ageLabel: "18 months",
            gross: "Walks well, begins to run, climbs stairs with help",
            fine: "Scribbles, stacks 2-4 blocks, uses spoon (messy)",
            language: "10-20 words, points to show things, follows 1-step directions",
            social: "Pretend play begins, shows defiance, tantrums may start",
            cognitive: "Points to body parts when named, identifies common objects",
            nextMilestone: "24 months: 2-word phrases, runs, kicks ball",
          },
          24: {
            ageLabel: "24 months (2 years)",
            gross: "Runs well, kicks a ball, walks up stairs with help",
            fine: "Stacks 6+ blocks, turns door handles, begins to dress self",
            language: "50+ words, 2-word phrases, names common objects",
            social: "Parallel play with other children, more independence",
            cognitive: "Sorts shapes and colors, follows 2-step instructions",
            nextMilestone: "36 months: rides tricycle, 3-word sentences, potty training",
          },
          36: {
            ageLabel: "36 months (3 years)",
            gross: "Rides tricycle, climbs well, runs easily",
            fine: "Draws a circle, turns book pages one at a time, uses scissors",
            language: "3-4 word sentences, uses pronouns (I, you, me), asks 'why'",
            social: "Takes turns, shows concern for crying friend, imaginative play",
            cognitive: "Counts to 3, knows some colors, understands 'same' and 'different'",
            nextMilestone: "Continue monitoring at well-child visits",
          },
        };

        // Find closest milestone age
        const keys = Object.keys(milestones).map(Number).sort((a, b) => a - b);
        let closest = keys[0];
        for (const k of keys) {
          if (Math.abs(k - ageMonths) <= Math.abs(closest - ageMonths)) closest = k;
        }

        const m = milestones[closest];

        return {
          primary: {
            label: "Developmental Stage",
            value: m.ageLabel,
          },
          details: [
            { label: "Gross Motor", value: m.gross },
            { label: "Fine Motor", value: m.fine },
            { label: "Language", value: m.language },
            { label: "Social/Emotional", value: m.social },
            { label: "Cognitive", value: m.cognitive },
            { label: "Coming Up Next", value: m.nextMilestone },
          ],
          note: "Milestones are approximate - there is a wide range of normal. Many children reach milestones earlier or later than listed. Talk to your pediatrician if you have concerns about your child's development. Early intervention services are available if needed.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-growth-calculator", "baby-sleep-schedule-calculator", "baby-feeding-schedule-calculator"],
  faq: [
    {
      question: "When should I be concerned about developmental milestones?",
      answer:
        "Talk to your pediatrician if your child: doesn't smile by 3 months, doesn't babble by 9 months, doesn't use any words by 16 months, doesn't walk by 18 months, loses previously acquired skills at any age, or if you have any concerns. Early intervention can make a significant difference.",
    },
    {
      question: "Do premature babies reach milestones later?",
      answer:
        "Yes. For premature babies, use their 'adjusted age' (actual age minus weeks premature) when tracking milestones for the first 2 years. A baby born 2 months early should be expected to reach 6-month milestones at 8 months actual age.",
    },
    {
      question: "What are the most important milestones to track?",
      answer:
        "Key milestones that pediatricians monitor closely include: social smile (2 months), sitting independently (6 months), babbling (9 months), first words (12 months), walking (12-15 months), 2-word phrases (24 months), and following 2-step instructions (24 months).",
    },
  ],
  formula:
    "Milestones based on CDC and AAP developmental guidelines across five domains: gross motor, fine motor, language, social/emotional, and cognitive development. Age ranges represent typical achievement windows.",
};
