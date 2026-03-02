import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const classroomSizeCalculator: CalculatorDefinition = {
  slug: "classroom-size-calculator",
  title: "Classroom Size Calculator",
  description: "Calculate the student to teacher ratio and ideal class capacity.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["classroom","size","ratio","students","teacher"],
  variants: [{
    id: "standard",
    name: "Classroom Size",
    description: "Calculate the student to teacher ratio and ideal class capacity.",
    fields: [
      { name: "numStudents", label: "Total Number of Students", type: "number", min: 10, max: 500, step: 1, defaultValue: 120 },
      { name: "numTeachers", label: "Number of Teachers", type: "number", min: 1, max: 30, step: 1, defaultValue: 5 },
      { name: "numAides", label: "Number of Aides", type: "number", min: 0, max: 20, step: 1, defaultValue: 2 },
      { name: "roomCapacity", label: "Room Capacity (sq ft)", type: "number", min: 200, max: 5000, step: 50, defaultValue: 900 },
    ],
    calculate: (inputs) => {
    const numStudents = inputs.numStudents as number;
    const numTeachers = inputs.numTeachers as number;
    const numAides = inputs.numAides as number;
    const roomCapacity = inputs.roomCapacity as number;
    const studentTeacherRatio = numStudents / numTeachers;
    const totalStaff = numTeachers + numAides;
    const studentStaffRatio = numStudents / totalStaff;
    const studentsPerClass = numStudents / numTeachers;
    const sqFtPerStudent = roomCapacity / studentsPerClass;
    return {
      primary: { label: "Student to Teacher Ratio", value: formatNumber(studentTeacherRatio) + ":1" },
      details: [
        { label: "Students Per Class", value: formatNumber(studentsPerClass) },
        { label: "Student to Staff Ratio", value: formatNumber(studentStaffRatio) + ":1" },
        { label: "Sq Ft Per Student", value: formatNumber(sqFtPerStudent) + " sq ft" },
        { label: "Total Staff", value: formatNumber(totalStaff) }
      ]
    };
  },
  }],
  relatedSlugs: ["school-bus-route-calculator","school-fundraiser-calculator","study-hours-calculator"],
  faq: [
    { question: "What is the ideal student to teacher ratio?", answer: "Research suggests a ratio of 15:1 to 20:1 is ideal for effective learning." },
    { question: "How much space does each student need?", answer: "The recommended minimum is 28 to 36 square feet per student in a classroom." },
  ],
  formula: "Student to Teacher Ratio = Total Students / Number of Teachers",
};
