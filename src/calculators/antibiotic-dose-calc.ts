import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const antibioticDoseCalculator: CalculatorDefinition = {
  slug: "antibiotic-dose-calculator",
  title: "Common Antibiotic Dosing Calculator",
  description:
    "Reference guide for common antibiotic dosing by weight and indication. Calculate pediatric and adult doses for frequently prescribed antibiotics including amoxicillin, azithromycin, and more.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "antibiotic dosing calculator",
    "amoxicillin dose",
    "azithromycin dosing",
    "pediatric antibiotic dose",
    "antibiotic dose by weight",
    "augmentin dosing",
    "antibiotic calculator",
  ],
  variants: [
    {
      id: "pediatric-antibiotic",
      name: "Pediatric Antibiotic Dosing",
      description: "Calculate pediatric antibiotic doses by weight for common infections",
      fields: [
        {
          name: "antibiotic",
          label: "Antibiotic",
          type: "select",
          options: [
            { label: "Amoxicillin", value: "amoxicillin" },
            { label: "Amoxicillin-Clavulanate (Augmentin)", value: "augmentin" },
            { label: "Azithromycin (Zithromax)", value: "azithromycin" },
            { label: "Cephalexin (Keflex)", value: "cephalexin" },
            { label: "Cefdinir (Omnicef)", value: "cefdinir" },
            { label: "Sulfamethoxazole-Trimethoprim (Bactrim)", value: "bactrim" },
          ],
        },
        {
          name: "weight",
          label: "Child's Weight",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "kg",
          min: 3,
          max: 100,
          step: 0.5,
        },
        {
          name: "indication",
          label: "Indication",
          type: "select",
          options: [
            { label: "Ear Infection (Otitis Media)", value: "ear" },
            { label: "Strep Throat (Pharyngitis)", value: "strep" },
            { label: "Sinus Infection (Sinusitis)", value: "sinus" },
            { label: "Skin/Soft Tissue Infection", value: "skin" },
            { label: "Urinary Tract Infection", value: "uti" },
            { label: "Pneumonia (Community-Acquired)", value: "pneumonia" },
          ],
        },
      ],
      calculate: (inputs) => {
        const antibiotic = inputs.antibiotic as string;
        const weight = parseFloat(inputs.weight as string);
        const indication = inputs.indication as string;

        if (!antibiotic || isNaN(weight) || !indication) return null;

        // Dosing data: {dosePerKg, frequency, maxDose, duration, notes}
        interface DosingInfo {
          dosePerKg: number;
          frequency: string;
          maxSingle: number;
          duration: string;
          suspension: string;
          notes: string;
        }

        const dosingData: Record<string, Record<string, DosingInfo>> = {
          amoxicillin: {
            ear: { dosePerKg: 45, frequency: "BID (twice daily)", maxSingle: 1000, duration: "10 days (5-7 if age >2 & mild)", suspension: "250mg/5mL or 400mg/5mL", notes: "High-dose 90 mg/kg/day for resistant cases" },
            strep: { dosePerKg: 25, frequency: "BID (twice daily)", maxSingle: 500, duration: "10 days", suspension: "250mg/5mL or 400mg/5mL", notes: "Standard dose for GAS pharyngitis" },
            sinus: { dosePerKg: 45, frequency: "BID (twice daily)", maxSingle: 1000, duration: "10-14 days", suspension: "250mg/5mL or 400mg/5mL", notes: "First-line for acute bacterial sinusitis" },
            skin: { dosePerKg: 25, frequency: "TID (three times daily)", maxSingle: 500, duration: "7-10 days", suspension: "250mg/5mL", notes: "For mild skin infections" },
            uti: { dosePerKg: 25, frequency: "TID (three times daily)", maxSingle: 500, duration: "7-10 days", suspension: "250mg/5mL", notes: "Check local resistance patterns" },
            pneumonia: { dosePerKg: 45, frequency: "BID (twice daily)", maxSingle: 1000, duration: "7-10 days", suspension: "400mg/5mL", notes: "High-dose for community-acquired pneumonia" },
          },
          augmentin: {
            ear: { dosePerKg: 45, frequency: "BID (twice daily)", maxSingle: 875, duration: "10 days", suspension: "400mg/5mL (amoxicillin component)", notes: "Use high-dose (90 mg/kg/day) for resistant cases" },
            strep: { dosePerKg: 25, frequency: "BID (twice daily)", maxSingle: 500, duration: "10 days", suspension: "250mg/5mL", notes: "Usually not first-line for strep" },
            sinus: { dosePerKg: 45, frequency: "BID (twice daily)", maxSingle: 875, duration: "10-14 days", suspension: "400mg/5mL", notes: "For treatment failure or beta-lactamase producers" },
            skin: { dosePerKg: 25, frequency: "BID (twice daily)", maxSingle: 875, duration: "7-10 days", suspension: "250mg/5mL", notes: "Good for bite wounds and mixed infections" },
            uti: { dosePerKg: 25, frequency: "BID (twice daily)", maxSingle: 500, duration: "7-10 days", suspension: "250mg/5mL", notes: "Second-line for UTI" },
            pneumonia: { dosePerKg: 45, frequency: "BID (twice daily)", maxSingle: 875, duration: "10 days", suspension: "400mg/5mL", notes: "For suspected resistant organisms" },
          },
          azithromycin: {
            ear: { dosePerKg: 10, frequency: "Once daily (day 1: 10mg/kg, then 5mg/kg days 2-5)", maxSingle: 500, duration: "5 days", suspension: "200mg/5mL", notes: "Day 1 loading dose, then half dose" },
            strep: { dosePerKg: 12, frequency: "Once daily", maxSingle: 500, duration: "5 days (12mg/kg day 1, then 6mg/kg)", suspension: "200mg/5mL", notes: "Second-line for penicillin-allergic patients" },
            sinus: { dosePerKg: 10, frequency: "Once daily", maxSingle: 500, duration: "3 days (or 5-day regimen)", suspension: "200mg/5mL", notes: "Not first-line; consider resistance patterns" },
            skin: { dosePerKg: 10, frequency: "Once daily", maxSingle: 500, duration: "5 days", suspension: "200mg/5mL", notes: "Loading dose day 1, then maintenance" },
            uti: { dosePerKg: 10, frequency: "Once daily", maxSingle: 500, duration: "3 days", suspension: "200mg/5mL", notes: "Not typical first-line for UTI" },
            pneumonia: { dosePerKg: 10, frequency: "Once daily", maxSingle: 500, duration: "5 days", suspension: "200mg/5mL", notes: "For atypical pneumonia coverage (Mycoplasma)" },
          },
          cephalexin: {
            ear: { dosePerKg: 25, frequency: "BID (twice daily)", maxSingle: 500, duration: "10 days", suspension: "250mg/5mL", notes: "Second-line for otitis media" },
            strep: { dosePerKg: 20, frequency: "BID (twice daily)", maxSingle: 500, duration: "10 days", suspension: "250mg/5mL", notes: "Alternative for penicillin-allergic (non-anaphylaxis)" },
            sinus: { dosePerKg: 25, frequency: "BID (twice daily)", maxSingle: 500, duration: "10 days", suspension: "250mg/5mL", notes: "Second-line option" },
            skin: { dosePerKg: 25, frequency: "QID or BID", maxSingle: 500, duration: "7-10 days", suspension: "250mg/5mL", notes: "Excellent for skin/soft tissue infections" },
            uti: { dosePerKg: 25, frequency: "BID (twice daily)", maxSingle: 500, duration: "7-10 days", suspension: "250mg/5mL", notes: "Good first-line for uncomplicated UTI" },
            pneumonia: { dosePerKg: 25, frequency: "BID (twice daily)", maxSingle: 500, duration: "7-10 days", suspension: "250mg/5mL", notes: "For mild community-acquired pneumonia" },
          },
          cefdinir: {
            ear: { dosePerKg: 7, frequency: "BID (or 14mg/kg once daily)", maxSingle: 300, duration: "10 days (or 5 days)", suspension: "125mg/5mL", notes: "Good palatability; once or twice daily dosing" },
            strep: { dosePerKg: 7, frequency: "BID (twice daily)", maxSingle: 300, duration: "10 days", suspension: "125mg/5mL", notes: "Alternative for penicillin allergy" },
            sinus: { dosePerKg: 7, frequency: "BID (twice daily)", maxSingle: 300, duration: "10 days", suspension: "125mg/5mL", notes: "Second-line for sinusitis" },
            skin: { dosePerKg: 7, frequency: "BID (twice daily)", maxSingle: 300, duration: "10 days", suspension: "125mg/5mL", notes: "For uncomplicated skin infections" },
            uti: { dosePerKg: 7, frequency: "BID (twice daily)", maxSingle: 300, duration: "7-10 days", suspension: "125mg/5mL", notes: "Alternative for UTI" },
            pneumonia: { dosePerKg: 7, frequency: "BID (twice daily)", maxSingle: 300, duration: "10 days", suspension: "125mg/5mL", notes: "For mild pneumonia" },
          },
          bactrim: {
            ear: { dosePerKg: 4, frequency: "BID (TMP component: 4mg/kg)", maxSingle: 160, duration: "10 days", suspension: "40mg TMP/5mL", notes: "Based on TMP component; not first-line for AOM" },
            strep: { dosePerKg: 4, frequency: "BID (twice daily)", maxSingle: 160, duration: "10 days", suspension: "40mg TMP/5mL", notes: "Not effective against Group A Strep" },
            sinus: { dosePerKg: 4, frequency: "BID (twice daily)", maxSingle: 160, duration: "10 days", suspension: "40mg TMP/5mL", notes: "Based on TMP component" },
            skin: { dosePerKg: 4, frequency: "BID (twice daily)", maxSingle: 160, duration: "7-10 days", suspension: "40mg TMP/5mL", notes: "Good for MRSA skin infections" },
            uti: { dosePerKg: 4, frequency: "BID (twice daily)", maxSingle: 160, duration: "7-10 days", suspension: "40mg TMP/5mL", notes: "First-line for uncomplicated UTI in many areas" },
            pneumonia: { dosePerKg: 4, frequency: "BID (twice daily)", maxSingle: 160, duration: "10 days", suspension: "40mg TMP/5mL", notes: "Not typical first-line for CAP" },
          },
        };

        const dosing = dosingData[antibiotic]?.[indication];
        if (!dosing) return null;

        const dosePerAdmin = Math.min(dosing.dosePerKg * weight, dosing.maxSingle);
        const dailyDose = dosing.frequency.includes("BID") ? dosePerAdmin * 2 :
                          dosing.frequency.includes("TID") ? dosePerAdmin * 3 :
                          dosing.frequency.includes("QID") ? dosePerAdmin * 4 : dosePerAdmin;

        // Calculate suspension volume
        let suspConcentration: number;
        const suspMatch = dosing.suspension.match(/(\d+)mg/);
        if (suspMatch) {
          suspConcentration = parseFloat(suspMatch[1]) / 5; // mg per mL
        } else {
          suspConcentration = 50; // default
        }
        const mlPerDose = dosePerAdmin / suspConcentration;

        const antibioticNames: Record<string, string> = {
          amoxicillin: "Amoxicillin",
          augmentin: "Amoxicillin-Clavulanate (Augmentin)",
          azithromycin: "Azithromycin (Zithromax/Z-Pack)",
          cephalexin: "Cephalexin (Keflex)",
          cefdinir: "Cefdinir (Omnicef)",
          bactrim: "TMP-SMX (Bactrim)",
        };

        return {
          primary: { label: "Dose Per Administration", value: `${formatNumber(dosePerAdmin, 0)} mg` },
          details: [
            { label: "Antibiotic", value: antibioticNames[antibiotic] || antibiotic },
            { label: "Weight", value: `${formatNumber(weight, 1)} kg (${formatNumber(weight * 2.205, 1)} lbs)` },
            { label: "Dose", value: `${formatNumber(dosePerAdmin, 0)} mg ${dosing.frequency}` },
            { label: "Daily Total", value: `${formatNumber(dailyDose, 0)} mg/day` },
            { label: "Suspension Volume", value: `${formatNumber(mlPerDose, 1)} mL per dose (${dosing.suspension})` },
            { label: "Duration", value: dosing.duration },
            { label: "Max Single Dose", value: `${formatNumber(dosing.maxSingle, 0)} mg` },
            { label: "Clinical Note", value: dosing.notes },
          ],
          note: "This is a reference guide — NOT a prescription. Antibiotic selection and dosing must be determined by a healthcare provider based on the specific infection, local resistance patterns, patient allergies, and clinical context. Complete the full course as prescribed.",
        };
      },
    },
    {
      id: "adult-antibiotic",
      name: "Adult Antibiotic Quick Reference",
      description: "Standard adult doses for common antibiotics by indication",
      fields: [
        {
          name: "antibiotic",
          label: "Antibiotic",
          type: "select",
          options: [
            { label: "Amoxicillin", value: "amoxicillin" },
            { label: "Amoxicillin-Clavulanate (Augmentin)", value: "augmentin" },
            { label: "Azithromycin (Z-Pack)", value: "azithromycin" },
            { label: "Ciprofloxacin", value: "cipro" },
            { label: "Doxycycline", value: "doxycycline" },
            { label: "Cephalexin (Keflex)", value: "cephalexin" },
          ],
        },
        {
          name: "indication",
          label: "Indication",
          type: "select",
          options: [
            { label: "Upper Respiratory / Sinusitis", value: "uri" },
            { label: "Strep Pharyngitis", value: "strep" },
            { label: "Skin / Soft Tissue Infection", value: "skin" },
            { label: "Urinary Tract Infection", value: "uti" },
            { label: "Community-Acquired Pneumonia", value: "pneumonia" },
          ],
        },
        {
          name: "renalFunction",
          label: "Kidney Function",
          type: "select",
          options: [
            { label: "Normal (CrCl > 60 mL/min)", value: "normal" },
            { label: "Mild Impairment (CrCl 30-60)", value: "mild" },
            { label: "Moderate Impairment (CrCl 15-30)", value: "moderate" },
          ],
        },
      ],
      calculate: (inputs) => {
        const antibiotic = inputs.antibiotic as string;
        const indication = inputs.indication as string;
        const renal = inputs.renalFunction as string;

        if (!antibiotic || !indication || !renal) return null;

        interface AdultDosing {
          dose: string;
          frequency: string;
          duration: string;
          notes: string;
        }

        const adultDoses: Record<string, Record<string, AdultDosing>> = {
          amoxicillin: {
            uri: { dose: "500mg", frequency: "TID or 875mg BID", duration: "10 days", notes: "First-line for acute sinusitis" },
            strep: { dose: "500mg", frequency: "BID", duration: "10 days", notes: "First-line for GAS pharyngitis" },
            skin: { dose: "500mg", frequency: "TID", duration: "7-10 days", notes: "For mild cellulitis (strep coverage)" },
            uti: { dose: "500mg", frequency: "TID", duration: "3-7 days", notes: "Not typical first-line for adult UTI" },
            pneumonia: { dose: "1000mg", frequency: "TID", duration: "7 days", notes: "High-dose for CAP; often combined with macrolide" },
          },
          augmentin: {
            uri: { dose: "875/125mg", frequency: "BID", duration: "10-14 days", notes: "For treatment failure or beta-lactamase producers" },
            strep: { dose: "875/125mg", frequency: "BID", duration: "10 days", notes: "Usually not first-line for strep" },
            skin: { dose: "875/125mg", frequency: "BID", duration: "7-10 days", notes: "Good for bite wounds and polymicrobial skin infections" },
            uti: { dose: "500/125mg", frequency: "BID", duration: "7 days", notes: "Second-line option for UTI" },
            pneumonia: { dose: "875/125mg", frequency: "BID", duration: "7-10 days", notes: "For suspected resistant organisms" },
          },
          azithromycin: {
            uri: { dose: "500mg day 1, 250mg", frequency: "daily days 2-5", duration: "5 days", notes: "Not first-line for sinusitis due to resistance" },
            strep: { dose: "500mg day 1, 250mg", frequency: "daily days 2-5", duration: "5 days", notes: "For penicillin-allergic patients" },
            skin: { dose: "500mg day 1, 250mg", frequency: "daily days 2-5", duration: "5 days", notes: "Alternative for mild skin infections" },
            uti: { dose: "Not recommended", frequency: "N/A", duration: "N/A", notes: "Azithromycin is not used for UTIs" },
            pneumonia: { dose: "500mg day 1, 250mg", frequency: "daily days 2-5", duration: "5 days", notes: "Covers atypicals (Mycoplasma, Chlamydophila)" },
          },
          cipro: {
            uri: { dose: "500mg", frequency: "BID", duration: "10 days", notes: "Reserve for penicillin/cephalosporin allergy" },
            strep: { dose: "Not recommended", frequency: "N/A", duration: "N/A", notes: "Fluoroquinolones not indicated for strep" },
            skin: { dose: "500mg", frequency: "BID", duration: "7-14 days", notes: "For gram-negative skin infections" },
            uti: { dose: "250-500mg", frequency: "BID", duration: "3 days (uncomplicated), 7-14 (complicated)", notes: "Effective but reserve due to resistance concerns" },
            pneumonia: { dose: "Not first-line", frequency: "N/A", duration: "N/A", notes: "Levofloxacin 750mg daily preferred as respiratory fluoroquinolone" },
          },
          doxycycline: {
            uri: { dose: "100mg", frequency: "BID", duration: "10 days", notes: "Alternative for sinusitis in beta-lactam allergy" },
            strep: { dose: "Not recommended", frequency: "N/A", duration: "N/A", notes: "Not reliable for GAS pharyngitis" },
            skin: { dose: "100mg", frequency: "BID", duration: "7-10 days", notes: "Excellent for MRSA skin infections" },
            uti: { dose: "Not recommended", frequency: "N/A", duration: "N/A", notes: "Not typically used for UTI" },
            pneumonia: { dose: "100mg", frequency: "BID", duration: "7 days", notes: "Covers atypicals; good alternative to macrolides" },
          },
          cephalexin: {
            uri: { dose: "500mg", frequency: "BID", duration: "10 days", notes: "Second-line for sinusitis" },
            strep: { dose: "500mg", frequency: "BID", duration: "10 days", notes: "Alternative for non-severe penicillin allergy" },
            skin: { dose: "500mg", frequency: "QID", duration: "7-10 days", notes: "First-line for non-purulent cellulitis" },
            uti: { dose: "500mg", frequency: "BID", duration: "7 days", notes: "Good option for uncomplicated cystitis" },
            pneumonia: { dose: "500mg", frequency: "QID", duration: "7 days", notes: "For mild CAP only" },
          },
        };

        const dosing = adultDoses[antibiotic]?.[indication];
        if (!dosing) return null;

        let renalNote = "";
        if (renal !== "normal") {
          renalNote = "Dose adjustment may be needed for renal impairment. Consult prescribing information or pharmacist.";
          if (antibiotic === "cipro" && renal === "moderate") {
            renalNote = "Ciprofloxacin: reduce to 250-500mg BID for CrCl 15-30 mL/min.";
          }
          if (antibiotic === "augmentin" && renal === "moderate") {
            renalNote = "Augmentin: avoid 875mg formulation if CrCl < 30. Use 500mg BID or 250mg BID.";
          }
        }

        const antibioticNames: Record<string, string> = {
          amoxicillin: "Amoxicillin",
          augmentin: "Amoxicillin-Clavulanate (Augmentin)",
          azithromycin: "Azithromycin (Z-Pack)",
          cipro: "Ciprofloxacin (Cipro)",
          doxycycline: "Doxycycline",
          cephalexin: "Cephalexin (Keflex)",
        };

        return {
          primary: { label: "Standard Adult Dose", value: dosing.dose },
          details: [
            { label: "Antibiotic", value: antibioticNames[antibiotic] || antibiotic },
            { label: "Dose", value: dosing.dose },
            { label: "Frequency", value: dosing.frequency },
            { label: "Duration", value: dosing.duration },
            { label: "Clinical Note", value: dosing.notes },
            ...(renalNote ? [{ label: "Renal Adjustment", value: renalNote }] : []),
          ],
          note: "These are standard adult doses for general reference. Actual prescribing depends on local resistance patterns, allergies, drug interactions, and clinical judgment. Always take the full course as prescribed. This is NOT a prescription.",
        };
      },
    },
  ],
  relatedSlugs: ["ibuprofen-dosage-calculator", "levothyroxine-dose-calculator", "adderall-dosage-calculator"],
  faq: [
    {
      question: "Why is it important to finish the full antibiotic course?",
      answer:
        "Completing the full course ensures all bacteria are killed, reducing the risk of antibiotic resistance. Stopping early when you feel better may leave resistant bacteria alive, making future infections harder to treat. However, recent evidence suggests shorter courses may be adequate for some infections — follow your doctor's instructions.",
    },
    {
      question: "What is the difference between narrow and broad-spectrum antibiotics?",
      answer:
        "Narrow-spectrum antibiotics (like penicillin) target specific bacteria, while broad-spectrum ones (like amoxicillin-clavulanate, fluoroquinolones) target many types. Narrow-spectrum is preferred when the causative bacteria is known, to minimize disruption to normal gut flora and reduce resistance development.",
    },
    {
      question: "Can I drink alcohol while taking antibiotics?",
      answer:
        "It depends on the antibiotic. Metronidazole (Flagyl) and tinidazole cause severe nausea with alcohol. Most other antibiotics don't have a direct interaction, but alcohol can impair immune function and hydration. It's generally best to avoid alcohol until you've recovered and completed treatment.",
    },
  ],
  formula:
    "Pediatric Dose = Weight(kg) x mg/kg/dose | Max capped at adult single dose | Daily Dose = Single Dose x Frequency | Suspension Volume = Dose(mg) / Concentration(mg/mL)",
};
