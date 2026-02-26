import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bloodOxygenCalculator: CalculatorDefinition = {
  slug: "blood-oxygen-calculator",
  title: "Blood Oxygen / SpO2 Calculator",
  description:
    "Assess blood oxygen saturation (SpO2) levels. Understand pulse oximetry readings, determine severity of hypoxemia, and get guidance on oxygen supplementation.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "blood oxygen calculator",
    "SpO2 calculator",
    "pulse oximetry",
    "oxygen saturation",
    "hypoxemia",
    "oxygen levels",
    "O2 sat assessment",
  ],
  variants: [
    {
      id: "spo2-assessment",
      name: "SpO2 Level Assessment",
      description: "Assess your pulse oximetry reading and understand what it means",
      fields: [
        {
          name: "spo2",
          label: "SpO2 Reading",
          type: "number",
          placeholder: "e.g. 97",
          suffix: "%",
          min: 50,
          max: 100,
          step: 1,
        },
        {
          name: "heartRate",
          label: "Heart Rate (optional)",
          type: "number",
          placeholder: "e.g. 72",
          suffix: "bpm",
          min: 30,
          max: 220,
          step: 1,
        },
        {
          name: "condition",
          label: "Relevant Condition",
          type: "select",
          options: [
            { label: "None / Healthy Individual", value: "healthy" },
            { label: "COPD / Chronic Lung Disease", value: "copd" },
            { label: "Asthma", value: "asthma" },
            { label: "Heart Failure", value: "heartfailure" },
            { label: "COVID-19 / Pneumonia", value: "pneumonia" },
            { label: "High Altitude", value: "altitude" },
          ],
        },
      ],
      calculate: (inputs) => {
        const spo2 = parseFloat(inputs.spo2 as string);
        const heartRate = parseFloat(inputs.heartRate as string);
        const condition = inputs.condition as string;

        if (isNaN(spo2)) return null;

        let severity: string;
        let action: string;
        let normalRange: string;

        if (condition === "copd") {
          normalRange = "88-92% (COPD target to avoid CO2 retention)";
          if (spo2 >= 88 && spo2 <= 92) {
            severity = "Within COPD target range";
            action = "Maintain current management. Monitor regularly.";
          } else if (spo2 > 92) {
            severity = "Above COPD target";
            action = "If on supplemental O2, may need adjustment. Over-oxygenation can suppress respiratory drive in COPD.";
          } else if (spo2 >= 85) {
            severity = "Below COPD target — mild hypoxemia";
            action = "Increase supplemental oxygen. Contact healthcare provider.";
          } else {
            severity = "Severe hypoxemia";
            action = "Seek emergency medical attention immediately.";
          }
        } else {
          normalRange = "95-100% for healthy individuals";
          if (spo2 >= 95) {
            severity = "Normal";
            action = "No intervention needed. Levels are within healthy range.";
          } else if (spo2 >= 91) {
            severity = "Mild hypoxemia";
            action = "Monitor closely. If symptoms present (shortness of breath, confusion), contact your doctor.";
          } else if (spo2 >= 86) {
            severity = "Moderate hypoxemia";
            action = "Seek medical attention. Supplemental oxygen likely needed.";
          } else if (spo2 >= 80) {
            severity = "Severe hypoxemia";
            action = "Seek emergency care immediately. This level can cause organ damage.";
          } else {
            severity = "Critical / Life-threatening hypoxemia";
            action = "CALL 911 immediately. This is a medical emergency.";
          }
        }

        // Estimate PaO2 from SpO2 (rough approximation from oxygen-hemoglobin dissociation curve)
        let estimatedPaO2: number;
        if (spo2 >= 97) estimatedPaO2 = 90 + (spo2 - 97) * 10;
        else if (spo2 >= 90) estimatedPaO2 = 60 + (spo2 - 90) * (30 / 7);
        else if (spo2 >= 75) estimatedPaO2 = 40 + (spo2 - 75) * (20 / 15);
        else estimatedPaO2 = 27 + (spo2 - 50) * (13 / 25);

        const details: { label: string; value: string }[] = [
          { label: "SpO2", value: `${formatNumber(spo2, 0)}%` },
          { label: "Severity", value: severity },
          { label: "Expected Normal", value: normalRange },
          { label: "Estimated PaO2", value: `~${formatNumber(estimatedPaO2, 0)} mmHg` },
          { label: "Recommendation", value: action },
        ];

        if (!isNaN(heartRate)) {
          let hrAssessment: string;
          if (heartRate < 60) hrAssessment = "Bradycardia — below normal resting rate";
          else if (heartRate <= 100) hrAssessment = "Normal resting heart rate";
          else hrAssessment = "Tachycardia — elevated heart rate (may indicate respiratory distress)";
          details.push({ label: "Heart Rate", value: `${formatNumber(heartRate, 0)} bpm — ${hrAssessment}` });
        }

        return {
          primary: { label: "SpO2 Assessment", value: `${formatNumber(spo2, 0)}% — ${severity}` },
          details,
          note: "Pulse oximeters may be less accurate in dark skin tones, cold extremities, poor perfusion, nail polish, or ambient light. If readings seem inaccurate or you have symptoms, seek medical evaluation regardless of the number.",
        };
      },
    },
    {
      id: "oxygen-needs",
      name: "Supplemental Oxygen Estimator",
      description: "Estimate supplemental oxygen flow rate to achieve target SpO2",
      fields: [
        {
          name: "currentSpo2",
          label: "Current SpO2 (on room air)",
          type: "number",
          placeholder: "e.g. 88",
          suffix: "%",
          min: 50,
          max: 100,
          step: 1,
        },
        {
          name: "targetSpo2",
          label: "Target SpO2",
          type: "select",
          options: [
            { label: "94-98% (standard target)", value: "96" },
            { label: "88-92% (COPD target)", value: "90" },
          ],
        },
        {
          name: "deliveryDevice",
          label: "Oxygen Delivery Device",
          type: "select",
          options: [
            { label: "Nasal Cannula (1-6 L/min)", value: "nasal" },
            { label: "Simple Face Mask (5-10 L/min)", value: "mask" },
            { label: "Non-Rebreather Mask (10-15 L/min)", value: "nrb" },
          ],
        },
      ],
      calculate: (inputs) => {
        const currentSpo2 = parseFloat(inputs.currentSpo2 as string);
        const targetSpo2 = parseFloat(inputs.targetSpo2 as string);
        const deliveryDevice = inputs.deliveryDevice as string;

        if (isNaN(currentSpo2) || isNaN(targetSpo2) || !deliveryDevice) return null;

        const spo2Deficit = targetSpo2 - currentSpo2;

        // Approximate FiO2 increases per L/min for nasal cannula: ~4% per L/min
        // Each ~3-4% increase in FiO2 raises SpO2 by roughly 1-2% in mild-moderate hypoxemia
        let estimatedFlow: number;
        let fio2: number;
        let deviceInfo: string;

        if (deliveryDevice === "nasal") {
          estimatedFlow = Math.min(Math.max(Math.ceil(spo2Deficit / 2), 1), 6);
          fio2 = 21 + estimatedFlow * 4;
          deviceInfo = "Nasal Cannula: 1-6 L/min, FiO2 24-44%";
        } else if (deliveryDevice === "mask") {
          estimatedFlow = Math.min(Math.max(Math.ceil(spo2Deficit / 1.5) + 4, 5), 10);
          fio2 = 35 + (estimatedFlow - 5) * 5;
          deviceInfo = "Simple Face Mask: 5-10 L/min, FiO2 35-55%";
        } else {
          estimatedFlow = Math.min(Math.max(10, Math.ceil(spo2Deficit / 1) + 9), 15);
          fio2 = 60 + (estimatedFlow - 10) * 8;
          deviceInfo = "Non-Rebreather: 10-15 L/min, FiO2 60-100%";
        }

        fio2 = Math.min(fio2, 100);

        const alreadyAtTarget = currentSpo2 >= targetSpo2;

        return {
          primary: { label: "Estimated O2 Flow Rate", value: alreadyAtTarget ? "None needed" : `${formatNumber(estimatedFlow, 0)} L/min` },
          details: [
            { label: "Current SpO2", value: `${formatNumber(currentSpo2, 0)}%` },
            { label: "Target SpO2", value: `${formatNumber(targetSpo2, 0)}%` },
            { label: "SpO2 Deficit", value: alreadyAtTarget ? "Already at target" : `${formatNumber(spo2Deficit, 0)}%` },
            { label: "Estimated FiO2", value: `~${formatNumber(fio2, 0)}%` },
            { label: "Device", value: deviceInfo },
          ],
          note: "This is a rough estimation only. Actual oxygen requirements depend on many factors including underlying pathology, ventilation status, and hemoglobin levels. Oxygen therapy must be prescribed and titrated by a healthcare provider.",
        };
      },
    },
  ],
  relatedSlugs: ["cha2ds2-vasc-calculator", "hearing-loss-calculator", "concussion-assessment-calculator"],
  faq: [
    {
      question: "What is a normal blood oxygen level?",
      answer:
        "Normal SpO2 for healthy individuals is 95-100%. Levels of 90-94% indicate mild hypoxemia. Below 90% is considered significant hypoxemia requiring medical attention. For COPD patients, a target of 88-92% is often recommended.",
    },
    {
      question: "How accurate are home pulse oximeters?",
      answer:
        "FDA-cleared home pulse oximeters are typically accurate within +/- 2% for readings above 80%. Accuracy can be affected by dark skin pigmentation, cold or poor circulation, nail polish, artificial nails, and excessive movement. Always consider symptoms alongside readings.",
    },
    {
      question: "When should I go to the ER based on my oxygen level?",
      answer:
        "Seek emergency care if SpO2 is below 90% (or below 85% for COPD patients), or if you have difficulty breathing, chest pain, confusion, or bluish lips/fingertips regardless of the oximeter reading. Trust your symptoms over the device reading.",
    },
  ],
  formula:
    "Normal SpO2: 95-100% | Mild Hypoxemia: 91-94% | Moderate: 86-90% | Severe: <86% | COPD Target: 88-92% | Nasal Cannula FiO2 = 21% + (4% x flow rate L/min)",
};
