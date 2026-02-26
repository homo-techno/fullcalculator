import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mapBloodPressureCalculator: CalculatorDefinition = {
  slug: "map-blood-pressure",
  title: "Mean Arterial Pressure (MAP) Calculator",
  description:
    "Free online Mean Arterial Pressure calculator from systolic and diastolic blood pressure readings.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "mean arterial pressure",
    "MAP",
    "blood pressure",
    "systolic",
    "diastolic",
    "hemodynamics",
    "perfusion pressure",
  ],
  variants: [
    {
      id: "map-calc",
      name: "Calculate MAP",
      description:
        "Calculate Mean Arterial Pressure from systolic and diastolic blood pressure.",
      fields: [
        {
          name: "systolic",
          label: "Systolic Blood Pressure",
          type: "number",
          placeholder: "e.g. 120",
          suffix: "mmHg",
        },
        {
          name: "diastolic",
          label: "Diastolic Blood Pressure",
          type: "number",
          placeholder: "e.g. 80",
          suffix: "mmHg",
        },
      ],
      calculate: (inputs) => {
        const sbp = parseFloat(inputs.systolic as string) || 0;
        const dbp = parseFloat(inputs.diastolic as string) || 0;

        if (sbp <= 0 || dbp <= 0) return null;

        // MAP = DBP + 1/3(SBP - DBP) = (SBP + 2×DBP) / 3
        const map = (sbp + 2 * dbp) / 3;
        const pulsePressure = sbp - dbp;

        let mapAssessment: string;
        if (map < 60) mapAssessment = "Critically low - risk of organ hypoperfusion";
        else if (map < 70) mapAssessment = "Low - may be inadequate for organ perfusion";
        else if (map <= 100) mapAssessment = "Normal range (70-100 mmHg)";
        else if (map <= 110) mapAssessment = "Mildly elevated";
        else mapAssessment = "Elevated - risk of end-organ damage";

        let bpCategory: string;
        if (sbp < 90 && dbp < 60) bpCategory = "Hypotension";
        else if (sbp < 120 && dbp < 80) bpCategory = "Normal";
        else if (sbp < 130 && dbp < 80) bpCategory = "Elevated";
        else if (sbp < 140 || dbp < 90) bpCategory = "Stage 1 Hypertension";
        else if (sbp >= 140 || dbp >= 90) bpCategory = "Stage 2 Hypertension";
        else bpCategory = "Normal";

        if (sbp >= 180 || dbp >= 120) bpCategory = "Hypertensive Crisis";

        let ppAssessment: string;
        if (pulsePressure < 25) ppAssessment = "Narrow (may indicate low cardiac output)";
        else if (pulsePressure <= 50) ppAssessment = "Normal (25-50 mmHg)";
        else ppAssessment = "Wide (may indicate aortic regurgitation, arteriosclerosis, or sepsis)";

        return {
          primary: {
            label: "Mean Arterial Pressure",
            value: formatNumber(map),
            suffix: "mmHg",
          },
          details: [
            { label: "MAP Assessment", value: mapAssessment },
            { label: "BP Category (AHA/ACC)", value: bpCategory },
            { label: "Pulse Pressure", value: formatNumber(pulsePressure) + " mmHg" },
            { label: "Pulse Pressure Assessment", value: ppAssessment },
            { label: "Systolic BP", value: formatNumber(sbp) + " mmHg" },
            { label: "Diastolic BP", value: formatNumber(dbp) + " mmHg" },
          ],
          note: "MAP above 65 mmHg is generally required for adequate organ perfusion. Target MAP in sepsis is >= 65 mmHg. Normal MAP is 70-100 mmHg.",
        };
      },
    },
    {
      id: "perfusion-pressure",
      name: "Cerebral Perfusion Pressure",
      description:
        "Calculate cerebral perfusion pressure (CPP) from MAP and intracranial pressure.",
      fields: [
        {
          name: "systolic",
          label: "Systolic Blood Pressure",
          type: "number",
          placeholder: "e.g. 120",
          suffix: "mmHg",
        },
        {
          name: "diastolic",
          label: "Diastolic Blood Pressure",
          type: "number",
          placeholder: "e.g. 80",
          suffix: "mmHg",
        },
        {
          name: "icp",
          label: "Intracranial Pressure (ICP)",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "mmHg",
        },
      ],
      calculate: (inputs) => {
        const sbp = parseFloat(inputs.systolic as string) || 0;
        const dbp = parseFloat(inputs.diastolic as string) || 0;
        const icp = parseFloat(inputs.icp as string) || 0;

        if (sbp <= 0 || dbp <= 0) return null;

        const map = (sbp + 2 * dbp) / 3;
        const cpp = map - icp;

        let cppAssessment: string;
        if (cpp < 50) cppAssessment = "Critically low - high risk of cerebral ischemia";
        else if (cpp < 60) cppAssessment = "Low - cerebral ischemia risk";
        else if (cpp <= 70) cppAssessment = "Target range for TBI (60-70 mmHg)";
        else if (cpp <= 90) cppAssessment = "Normal range";
        else cppAssessment = "Elevated - risk of cerebral edema";

        let icpAssessment: string;
        if (icp <= 10) icpAssessment = "Normal (< 10 mmHg)";
        else if (icp <= 20) icpAssessment = "Mildly elevated (10-20 mmHg)";
        else if (icp <= 30) icpAssessment = "Moderately elevated - treatment indicated";
        else icpAssessment = "Severely elevated - emergency";

        return {
          primary: {
            label: "Cerebral Perfusion Pressure",
            value: formatNumber(cpp),
            suffix: "mmHg",
          },
          details: [
            { label: "CPP Assessment", value: cppAssessment },
            { label: "MAP", value: formatNumber(map) + " mmHg" },
            { label: "ICP", value: formatNumber(icp) + " mmHg" },
            { label: "ICP Assessment", value: icpAssessment },
          ],
          note: "Target CPP in traumatic brain injury is 60-70 mmHg (BTF guidelines). CPP > 70 may increase risk of ARDS. CPP < 50 is associated with cerebral ischemia.",
        };
      },
    },
  ],
  relatedSlugs: ["cardiac-output", "ascvd-risk", "qtc-calculator"],
  faq: [
    {
      question: "What is Mean Arterial Pressure (MAP)?",
      answer:
        "MAP is the average blood pressure throughout one cardiac cycle. It represents the driving pressure for blood flow to organs. MAP is weighted toward diastolic pressure because the heart spends about 2/3 of the cycle in diastole: MAP = DBP + 1/3(SBP - DBP).",
    },
    {
      question: "Why is MAP important?",
      answer:
        "MAP is a better indicator of tissue perfusion than systolic or diastolic pressure alone. A MAP of at least 60-65 mmHg is considered necessary for adequate perfusion of vital organs (brain, kidneys, heart). In critical care, MAP is the primary hemodynamic target.",
    },
    {
      question: "What is cerebral perfusion pressure?",
      answer:
        "Cerebral perfusion pressure (CPP) is the net pressure gradient that drives blood flow to the brain. It equals MAP minus intracranial pressure (ICP). In traumatic brain injury, maintaining CPP between 60-70 mmHg is a key treatment goal.",
    },
  ],
  formula:
    "MAP = (SBP + 2 × DBP) / 3 = DBP + 1/3(SBP - DBP). Pulse Pressure = SBP - DBP. Cerebral Perfusion Pressure (CPP) = MAP - ICP.",
};
