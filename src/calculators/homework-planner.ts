import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeworkPlannerCalculator: CalculatorDefinition = {
  slug: "homework-planner-calculator",
  title: "Homework Time Planner Calculator",
  description:
    "Free homework time planner. Estimate how long your homework will take, plan your study schedule, and balance multiple assignments across subjects.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "homework planner calculator",
    "homework time calculator",
    "study schedule planner",
    "assignment time estimator",
    "homework time management",
  ],
  variants: [
    {
      id: "singleAssignment",
      name: "Single Assignment Time Estimator",
      description: "Estimate how long a homework assignment will take",
      fields: [
        {
          name: "assignmentType",
          label: "Assignment Type",
          type: "select",
          options: [
            { label: "Reading assignment", value: "reading" },
            { label: "Math problem set", value: "math" },
            { label: "Essay / writing", value: "essay" },
            { label: "Science lab report", value: "lab" },
            { label: "Study for quiz", value: "quiz_study" },
            { label: "Study for exam", value: "exam_study" },
            { label: "Research project", value: "research" },
            { label: "Programming assignment", value: "programming" },
          ],
        },
        { name: "quantity", label: "Quantity (pages/problems/words)", type: "number", placeholder: "e.g. 20" },
        {
          name: "difficulty",
          label: "Difficulty Level",
          type: "select",
          options: [
            { label: "Easy (familiar material)", value: "easy" },
            { label: "Medium (some new concepts)", value: "medium" },
            { label: "Hard (mostly new material)", value: "hard" },
          ],
        },
      ],
      calculate: (inputs) => {
        const type = inputs.assignmentType as string;
        const quantity = inputs.quantity as number;
        const difficulty = inputs.difficulty as string;
        if (!type || !quantity || !difficulty) return null;

        // Minutes per unit by type
        const minutesPerUnit: Record<string, number> = {
          reading: 4,       // 4 min per page (careful reading)
          math: 8,          // 8 min per problem
          essay: 0.075,     // per word: ~75 min per 1000 words for writing (with thinking)
          lab: 15,          // 15 min per page
          quiz_study: 3,    // 3 min per concept/flashcard
          exam_study: 4,    // 4 min per concept
          research: 20,     // 20 min per page of research output
          programming: 10,  // 10 min per problem/function
        };

        // Difficulty multiplier
        const difficultyMult: Record<string, number> = {
          easy: 0.75,
          medium: 1.0,
          hard: 1.5,
        };

        const baseMinutes = quantity * (minutesPerUnit[type] || 5);
        const adjustedMinutes = baseMinutes * (difficultyMult[difficulty] || 1.0);

        const hours = Math.floor(adjustedMinutes / 60);
        const mins = Math.round(adjustedMinutes % 60);

        // Break recommendations
        const breaks = Math.floor(adjustedMinutes / 45); // break every 45 min
        const totalWithBreaks = adjustedMinutes + breaks * 10; // 10-min breaks

        const unitLabels: Record<string, string> = {
          reading: "pages", math: "problems", essay: "words",
          lab: "pages", quiz_study: "concepts", exam_study: "concepts",
          research: "pages", programming: "problems",
        };

        return {
          primary: { label: "Estimated Time", value: hours > 0 ? `${hours}h ${mins}m` : `${mins} min` },
          details: [
            { label: "Assignment type", value: type.replace("_", " ") },
            { label: "Quantity", value: `${formatNumber(quantity, 0)} ${unitLabels[type] || "units"}` },
            { label: "Difficulty adjustment", value: difficulty },
            { label: "Pure work time", value: `${formatNumber(adjustedMinutes, 0)} min` },
            { label: "Recommended breaks", value: `${breaks} breaks (10 min each)` },
            { label: "Total session time", value: `${formatNumber(totalWithBreaks, 0)} min` },
          ],
          note: "Take a 10-minute break every 45 minutes for optimal focus and productivity.",
        };
      },
    },
    {
      id: "weeklyPlan",
      name: "Weekly Homework Schedule",
      description: "Plan your weekly homework across multiple subjects",
      fields: [
        { name: "subject1Hours", label: "Subject 1 Hours Needed", type: "number", placeholder: "e.g. 3" },
        { name: "subject2Hours", label: "Subject 2 Hours Needed", type: "number", placeholder: "e.g. 2" },
        { name: "subject3Hours", label: "Subject 3 Hours Needed", type: "number", placeholder: "e.g. 4" },
        { name: "subject4Hours", label: "Subject 4 Hours Needed", type: "number", placeholder: "e.g. 2" },
        { name: "subject5Hours", label: "Subject 5 Hours Needed", type: "number", placeholder: "optional" },
        { name: "availableDays", label: "Days Available to Study", type: "number", placeholder: "e.g. 5", min: 1, max: 7 },
        { name: "maxHoursPerDay", label: "Max Study Hours Per Day", type: "number", placeholder: "e.g. 4" },
      ],
      calculate: (inputs) => {
        let totalHours = 0;
        let subjectCount = 0;

        for (let i = 1; i <= 5; i++) {
          const hours = inputs[`subject${i}Hours`] as number;
          if (hours && hours > 0) {
            totalHours += hours;
            subjectCount++;
          }
        }

        const days = inputs.availableDays as number;
        const maxPerDay = inputs.maxHoursPerDay as number;
        if (!days || !maxPerDay || subjectCount === 0) return null;

        const hoursPerDay = totalHours / days;
        const totalCapacity = days * maxPerDay;
        const utilizationRate = (totalHours / totalCapacity) * 100;
        const feasible = hoursPerDay <= maxPerDay;

        // With breaks (10 min per 45 min of study)
        const breakRatio = 10 / 45;
        const totalWithBreaks = totalHours * (1 + breakRatio);
        const sessionsPerDay = Math.ceil(hoursPerDay / 1.5); // 1.5 hour sessions

        return {
          primary: { label: "Hours Per Day", value: `${formatNumber(hoursPerDay, 1)} hrs` },
          details: [
            { label: "Total weekly homework", value: `${formatNumber(totalHours, 1)} hrs` },
            { label: "Subjects", value: `${subjectCount}` },
            { label: "Study days", value: `${days}` },
            { label: "Max capacity", value: `${formatNumber(totalCapacity, 0)} hrs` },
            { label: "Schedule utilization", value: `${formatNumber(utilizationRate, 0)}%` },
            { label: "Study sessions per day", value: `${sessionsPerDay} (1.5 hrs each)` },
            { label: "Feasible", value: feasible ? "Yes" : "No - reduce load or add study days" },
            { label: "Total time with breaks", value: `${formatNumber(totalWithBreaks, 1)} hrs` },
          ],
          note: !feasible ? "Your daily homework load exceeds your available time. Consider spreading work over more days or prioritizing assignments." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["study-time-calculator", "flashcard-study-calculator", "semester-hours-calculator"],
  faq: [
    {
      question: "How long should homework take per night?",
      answer:
        "The general guideline is 10 minutes per grade level per night (e.g., 6th grader = 60 min, 10th grader = 100 min). For college students, expect 2-3 hours of study per credit hour per week, so a 15-credit load means 30-45 hours/week of class + study combined.",
    },
    {
      question: "How can I manage homework time better?",
      answer:
        "Use the Pomodoro technique (25 min work, 5 min break), start with the hardest subject when your energy is highest, break large assignments into smaller tasks, eliminate distractions, and set specific goals for each study session.",
    },
    {
      question: "How do I estimate how long an assignment will take?",
      answer:
        "Track your time on a few assignments to build personal benchmarks. General estimates: reading = 4-6 min/page, math problems = 5-15 min each, essay writing = 1-2 hours per page (including research), lab reports = 2-4 hours.",
    },
  ],
  formula: "Study Hours/Day = Total Weekly Homework Hours / Available Study Days",
};
