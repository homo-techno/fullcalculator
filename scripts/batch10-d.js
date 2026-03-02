add(
  "tattoo-cost-calculator",
  "Tattoo Cost Calculator",
  "Estimate tattoo price based on size, detail level, and artist rate.",
  "Finance",
  "finance",
  "$",
  ["tattoo cost", "tattoo price", "tattoo estimate", "ink cost"],
  [
    '{ name: "size", label: "Tattoo Size (sq in)", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "detail", label: "Detail Level", type: "select", options: [{ value: "1", label: "Simple" }, { value: "2", label: "Moderate" }, { value: "3", label: "High Detail" }] }',
    '{ name: "hourlyRate", label: "Artist Hourly Rate ($)", type: "number", min: 50, max: 500, defaultValue: 150 }',
    '{ name: "colorWork", label: "Color Work", type: "select", options: [{ value: "0", label: "Black and Grey" }, { value: "1", label: "Full Color" }] }'
  ],
  `(inputs) => {
    const size = inputs.size as number;
    const detail = parseInt(inputs.detail as string);
    const hourlyRate = inputs.hourlyRate as number;
    const colorWork = parseInt(inputs.colorWork as string);
    const hoursEstimate = (size * detail * 0.15) + (colorWork * size * 0.05);
    const totalCost = Math.max(hoursEstimate * hourlyRate, 80);
    const sessionCount = Math.ceil(hoursEstimate / 3);
    return {
      primary: { label: "Estimated Tattoo Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Estimated Hours", value: formatNumber(hoursEstimate) },
        { label: "Sessions Needed", value: formatNumber(sessionCount) },
        { label: "Cost Per Session", value: "$" + formatNumber(totalCost / Math.max(sessionCount, 1)) }
      ]
    };
  }`,
  [
    { q: "How much does a tattoo cost on average?", a: "Small tattoos start around $80 to $200. Larger pieces can cost thousands." },
    { q: "Does color cost more than black and grey?", a: "Yes, color work typically adds 20 to 40 percent more time and cost." },
    { q: "Should I tip my tattoo artist?", a: "A tip of 15 to 25 percent is customary for tattoo artists." }
  ],
  "Total Cost = max(Hours Estimate x Hourly Rate, Minimum Charge)",
  ["tattoo-tip-calculator", "tattoo-removal-cost-calculator"]
);

add(
  "tattoo-removal-cost-calculator",
  "Tattoo Removal Cost Calculator",
  "Calculate laser tattoo removal sessions and total cost.",
  "Finance",
  "finance",
  "$",
  ["tattoo removal", "laser removal", "tattoo removal cost"],
  [
    '{ name: "size", label: "Tattoo Size (sq in)", type: "number", min: 1, max: 200, defaultValue: 10 }',
    '{ name: "colors", label: "Number of Colors", type: "number", min: 1, max: 10, defaultValue: 2 }',
    '{ name: "costPerSession", label: "Cost Per Session ($)", type: "number", min: 100, max: 1000, defaultValue: 300 }',
    '{ name: "skinTone", label: "Skin Tone", type: "select", options: [{ value: "1", label: "Light" }, { value: "1.3", label: "Medium" }, { value: "1.6", label: "Dark" }] }'
  ],
  `(inputs) => {
    const size = inputs.size as number;
    const colors = inputs.colors as number;
    const costPerSession = inputs.costPerSession as number;
    const skinTone = parseFloat(inputs.skinTone as string);
    const baseSessions = Math.ceil((size * 0.3 + colors * 1.2) * skinTone);
    const sessions = Math.max(baseSessions, 3);
    const totalCost = sessions * costPerSession;
    return {
      primary: { label: "Total Removal Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Sessions Needed", value: formatNumber(sessions) },
        { label: "Cost Per Session", value: "$" + formatNumber(costPerSession) },
        { label: "Treatment Duration", value: formatNumber(sessions * 6) + " weeks minimum" }
      ]
    };
  }`,
  [
    { q: "How many sessions does tattoo removal take?", a: "Most tattoos require 6 to 12 sessions spaced 6 to 8 weeks apart." },
    { q: "Does tattoo removal hurt?", a: "It can be uncomfortable. Many clinics offer numbing cream or cooling." },
    { q: "Can all tattoo colors be removed?", a: "Black responds best. Greens and blues can be more difficult to remove." }
  ],
  "Sessions = max((Size x 0.3 + Colors x 1.2) x Skin Tone Factor, 3)",
  ["tattoo-cost-calculator", "tattoo-tip-calculator"]
);

add(
  "tattoo-tip-calculator",
  "Tattoo Tip Calculator",
  "Calculate an appropriate tip amount for your tattoo artist.",
  "Finance",
  "finance",
  "$",
  ["tattoo tip", "tip tattoo artist", "tattoo gratuity"],
  [
    '{ name: "tattooCost", label: "Tattoo Cost ($)", type: "number", min: 50, max: 10000, defaultValue: 300 }',
    '{ name: "tipPercent", label: "Tip Percentage", type: "select", options: [{ value: "15", label: "15%" }, { value: "20", label: "20%" }, { value: "25", label: "25%" }, { value: "30", label: "30%" }] }',
    '{ name: "sessions", label: "Number of Sessions", type: "number", min: 1, max: 20, defaultValue: 1 }'
  ],
  `(inputs) => {
    const tattooCost = inputs.tattooCost as number;
    const tipPercent = parseInt(inputs.tipPercent as string);
    const sessions = inputs.sessions as number;
    const tipAmount = tattooCost * (tipPercent / 100);
    const tipPerSession = tipAmount / sessions;
    const totalWithTip = tattooCost + tipAmount;
    return {
      primary: { label: "Total Tip Amount", value: "$" + formatNumber(tipAmount) },
      details: [
        { label: "Tip Per Session", value: "$" + formatNumber(tipPerSession) },
        { label: "Total With Tip", value: "$" + formatNumber(totalWithTip) },
        { label: "Tip Percentage", value: formatNumber(tipPercent) + "%" }
      ]
    };
  }`,
  [
    { q: "How much should you tip a tattoo artist?", a: "15 to 25 percent is standard. Tip more for exceptional work or long sessions." },
    { q: "Do you tip on the full tattoo price?", a: "Yes, tip on the total cost of the tattoo service before any discounts." },
    { q: "Should you tip per session or at the end?", a: "Tipping after each session is preferred by most tattoo artists." }
  ],
  "Tip Amount = Tattoo Cost x (Tip Percentage / 100)",
  ["tattoo-cost-calculator", "tattoo-removal-cost-calculator"]
);

add(
  "hair-color-cost-calculator",
  "Hair Color Cost Calculator",
  "Estimate total cost for hair coloring services at a salon.",
  "Finance",
  "finance",
  "$",
  ["hair color cost", "hair dye price", "salon color cost"],
  [
    '{ name: "serviceType", label: "Color Service", type: "select", options: [{ value: "75", label: "Single Process" }, { value: "150", label: "Highlights" }, { value: "200", label: "Balayage" }, { value: "250", label: "Full Color Correction" }] }',
    '{ name: "hairLength", label: "Hair Length", type: "select", options: [{ value: "1", label: "Short" }, { value: "1.2", label: "Medium" }, { value: "1.5", label: "Long" }] }',
    '{ name: "toner", label: "Toner Add-On ($)", type: "number", min: 0, max: 100, defaultValue: 30 }',
    '{ name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const serviceType = parseInt(inputs.serviceType as string);
    const hairLength = parseFloat(inputs.hairLength as string);
    const toner = inputs.toner as number;
    const tip = inputs.tip as number;
    const serviceTotal = serviceType * hairLength + toner;
    const tipAmount = serviceTotal * (tip / 100);
    const grandTotal = serviceTotal + tipAmount;
    return {
      primary: { label: "Total Hair Color Cost", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Service Cost", value: "$" + formatNumber(serviceType * hairLength) },
        { label: "Toner Add-On", value: "$" + formatNumber(toner) },
        { label: "Tip Amount", value: "$" + formatNumber(tipAmount) }
      ]
    };
  }`,
  [
    { q: "How much does hair coloring cost at a salon?", a: "Prices range from $75 for single process to $300 or more for balayage." },
    { q: "Does hair length affect the price?", a: "Yes, longer hair requires more product and time, increasing the cost." },
    { q: "How often should you color your hair?", a: "Most color services need a touch-up every 4 to 8 weeks." }
  ],
  "Total = (Service Base x Length Multiplier + Toner) x (1 + Tip%)",
  ["haircut-frequency-calculator", "hair-extension-cost-calculator"]
);

add(
  "haircut-frequency-calculator",
  "Haircut Frequency Calculator",
  "Determine your haircut schedule and estimate annual cost.",
  "Finance",
  "finance",
  "$",
  ["haircut frequency", "haircut schedule", "annual haircut cost"],
  [
    '{ name: "hairGrowthRate", label: "Growth Rate", type: "select", options: [{ value: "4", label: "Slow (4 weeks)" }, { value: "6", label: "Average (6 weeks)" }, { value: "8", label: "Fast (8 weeks)" }] }',
    '{ name: "haircutCost", label: "Haircut Cost ($)", type: "number", min: 10, max: 200, defaultValue: 40 }',
    '{ name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 }',
    '{ name: "products", label: "Product Purchase Per Visit ($)", type: "number", min: 0, max: 100, defaultValue: 0 }'
  ],
  `(inputs) => {
    const weeks = parseInt(inputs.hairGrowthRate as string);
    const haircutCost = inputs.haircutCost as number;
    const tip = inputs.tip as number;
    const products = inputs.products as number;
    const visitsPerYear = Math.round(52 / weeks);
    const costPerVisit = haircutCost + haircutCost * (tip / 100) + products;
    const annualCost = visitsPerYear * costPerVisit;
    return {
      primary: { label: "Annual Haircut Cost", value: "$" + formatNumber(annualCost) },
      details: [
        { label: "Visits Per Year", value: formatNumber(visitsPerYear) },
        { label: "Cost Per Visit", value: "$" + formatNumber(costPerVisit) },
        { label: "Weeks Between Cuts", value: formatNumber(weeks) }
      ]
    };
  }`,
  [
    { q: "How often should you get a haircut?", a: "Every 4 to 8 weeks depending on hair type and desired style." },
    { q: "How much does the average haircut cost?", a: "Average men haircuts cost $20 to $40. Women haircuts cost $40 to $80." },
    { q: "Does frequent cutting make hair grow faster?", a: "No, cutting does not affect growth rate. It does prevent split ends." }
  ],
  "Annual Cost = (52 / Weeks Between Cuts) x Cost Per Visit",
  ["hair-color-cost-calculator", "hair-extension-cost-calculator"]
);

add(
  "hair-extension-cost-calculator",
  "Hair Extension Cost Calculator",
  "Calculate the cost of hair extension installation and upkeep.",
  "Finance",
  "finance",
  "$",
  ["hair extension cost", "extension price", "hair extension pricing"],
  [
    '{ name: "method", label: "Extension Method", type: "select", options: [{ value: "200", label: "Clip-In" }, { value: "600", label: "Tape-In" }, { value: "1000", label: "Fusion/Bonded" }, { value: "1500", label: "Hand-Tied Weft" }] }',
    '{ name: "packs", label: "Number of Packs", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "installFee", label: "Installation Fee ($)", type: "number", min: 0, max: 500, defaultValue: 150 }',
    '{ name: "maintenanceVisits", label: "Maintenance Visits Per Year", type: "number", min: 0, max: 12, defaultValue: 4 }',
    '{ name: "maintenanceCost", label: "Maintenance Cost Per Visit ($)", type: "number", min: 0, max: 300, defaultValue: 100 }'
  ],
  `(inputs) => {
    const method = parseInt(inputs.method as string);
    const packs = inputs.packs as number;
    const installFee = inputs.installFee as number;
    const maintenanceVisits = inputs.maintenanceVisits as number;
    const maintenanceCost = inputs.maintenanceCost as number;
    const hairCost = method * packs;
    const initialTotal = hairCost + installFee;
    const annualMaintenance = maintenanceVisits * maintenanceCost;
    const firstYearTotal = initialTotal + annualMaintenance;
    return {
      primary: { label: "First Year Total Cost", value: "$" + formatNumber(firstYearTotal) },
      details: [
        { label: "Hair Cost", value: "$" + formatNumber(hairCost) },
        { label: "Installation Fee", value: "$" + formatNumber(installFee) },
        { label: "Annual Maintenance", value: "$" + formatNumber(annualMaintenance) }
      ]
    };
  }`,
  [
    { q: "How much do hair extensions cost?", a: "Clip-ins start at $200. Professional methods range from $600 to $2000." },
    { q: "How long do hair extensions last?", a: "Clip-ins last 6 to 12 months. Bonded extensions last 3 to 6 months." },
    { q: "Do extensions damage natural hair?", a: "Proper installation and maintenance minimize damage to natural hair." }
  ],
  "First Year = (Method Price x Packs) + Install Fee + (Visits x Maintenance Cost)",
  ["hair-color-cost-calculator", "haircut-frequency-calculator"]
);

add(
  "nail-salon-cost-calculator",
  "Nail Salon Cost Calculator",
  "Estimate manicure and pedicure service costs at a salon.",
  "Finance",
  "finance",
  "$",
  ["nail salon cost", "manicure cost", "pedicure cost", "nail pricing"],
  [
    '{ name: "serviceType", label: "Service Type", type: "select", options: [{ value: "25", label: "Basic Manicure" }, { value: "40", label: "Gel Manicure" }, { value: "35", label: "Basic Pedicure" }, { value: "55", label: "Gel Pedicure" }, { value: "70", label: "Mani + Pedi Combo" }] }',
    '{ name: "nailArt", label: "Nail Art Add-On ($)", type: "number", min: 0, max: 100, defaultValue: 0 }',
    '{ name: "frequency", label: "Visits Per Month", type: "number", min: 1, max: 4, defaultValue: 2 }',
    '{ name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const serviceType = parseInt(inputs.serviceType as string);
    const nailArt = inputs.nailArt as number;
    const frequency = inputs.frequency as number;
    const tip = inputs.tip as number;
    const perVisit = serviceType + nailArt;
    const tipAmount = perVisit * (tip / 100);
    const totalPerVisit = perVisit + tipAmount;
    const monthlyCost = totalPerVisit * frequency;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Monthly Nail Cost", value: "$" + formatNumber(monthlyCost) },
      details: [
        { label: "Cost Per Visit", value: "$" + formatNumber(totalPerVisit) },
        { label: "Tip Per Visit", value: "$" + formatNumber(tipAmount) },
        { label: "Annual Cost", value: "$" + formatNumber(annualCost) }
      ]
    };
  }`,
  [
    { q: "How much does a manicure cost?", a: "Basic manicures cost $20 to $30. Gel manicures cost $35 to $60." },
    { q: "How often should you get your nails done?", a: "Gel nails last 2 to 3 weeks. Regular polish lasts about 1 week." },
    { q: "Is gel or acrylic more expensive?", a: "Acrylic nails typically cost more due to additional application time." }
  ],
  "Monthly Cost = (Service + Art + Tip) x Visits Per Month",
  ["eyelash-extension-cost-calculator", "spa-day-cost-calculator"]
);

add(
  "eyelash-extension-cost-calculator",
  "Eyelash Extension Cost Calculator",
  "Calculate lash extension pricing including fills and upkeep.",
  "Finance",
  "finance",
  "$",
  ["eyelash extension cost", "lash extension price", "lash fill cost"],
  [
    '{ name: "fullSetCost", label: "Full Set Cost ($)", type: "number", min: 100, max: 500, defaultValue: 200 }',
    '{ name: "fillCost", label: "Fill Cost ($)", type: "number", min: 50, max: 200, defaultValue: 75 }',
    '{ name: "fillFrequency", label: "Fills Per Month", type: "number", min: 1, max: 4, defaultValue: 2 }',
    '{ name: "fullSetFrequency", label: "Full Sets Per Year", type: "number", min: 1, max: 6, defaultValue: 3 }',
    '{ name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const fullSetCost = inputs.fullSetCost as number;
    const fillCost = inputs.fillCost as number;
    const fillFrequency = inputs.fillFrequency as number;
    const fullSetFrequency = inputs.fullSetFrequency as number;
    const tip = inputs.tip as number;
    const annualFills = fillFrequency * 12 - fullSetFrequency;
    const subtotal = (fullSetCost * fullSetFrequency) + (fillCost * annualFills);
    const tipTotal = subtotal * (tip / 100);
    const annualTotal = subtotal + tipTotal;
    return {
      primary: { label: "Annual Lash Cost", value: "$" + formatNumber(annualTotal) },
      details: [
        { label: "Full Sets Per Year", value: formatNumber(fullSetFrequency) },
        { label: "Fill Appointments Per Year", value: formatNumber(annualFills) },
        { label: "Monthly Average", value: "$" + formatNumber(annualTotal / 12) }
      ]
    };
  }`,
  [
    { q: "How much do eyelash extensions cost?", a: "Full sets range from $150 to $400. Fills cost $50 to $150 each." },
    { q: "How often do lash extensions need fills?", a: "Fills are needed every 2 to 3 weeks to maintain fullness." },
    { q: "Do lash extensions damage natural lashes?", a: "Properly applied extensions should not damage natural lashes." }
  ],
  "Annual = (Full Set Cost x Sets) + (Fill Cost x Fills) + Tips",
  ["nail-salon-cost-calculator", "facial-treatment-cost-calculator"]
);

add(
  "facial-treatment-cost-calculator",
  "Facial Treatment Cost Calculator",
  "Estimate the cost of professional facial treatments.",
  "Finance",
  "finance",
  "$",
  ["facial cost", "facial treatment price", "skin treatment cost"],
  [
    '{ name: "facialType", label: "Facial Type", type: "select", options: [{ value: "80", label: "Basic Facial" }, { value: "150", label: "HydraFacial" }, { value: "200", label: "LED Light Therapy" }, { value: "250", label: "Microcurrent Facial" }] }',
    '{ name: "addOns", label: "Add-On Treatments ($)", type: "number", min: 0, max: 200, defaultValue: 0 }',
    '{ name: "visitsPerYear", label: "Visits Per Year", type: "number", min: 1, max: 24, defaultValue: 6 }',
    '{ name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const facialType = parseInt(inputs.facialType as string);
    const addOns = inputs.addOns as number;
    const visitsPerYear = inputs.visitsPerYear as number;
    const tip = inputs.tip as number;
    const perVisit = facialType + addOns;
    const tipAmount = perVisit * (tip / 100);
    const totalPerVisit = perVisit + tipAmount;
    const annualCost = totalPerVisit * visitsPerYear;
    return {
      primary: { label: "Annual Facial Cost", value: "$" + formatNumber(annualCost) },
      details: [
        { label: "Cost Per Visit", value: "$" + formatNumber(totalPerVisit) },
        { label: "Tip Per Visit", value: "$" + formatNumber(tipAmount) },
        { label: "Monthly Average", value: "$" + formatNumber(annualCost / 12) }
      ]
    };
  }`,
  [
    { q: "How much does a facial cost?", a: "Basic facials cost $60 to $100. Specialized facials cost $150 to $300." },
    { q: "How often should you get a facial?", a: "Every 4 to 6 weeks is recommended for most skin types." },
    { q: "Are expensive facials worth it?", a: "Advanced treatments offer deeper results but basic facials also benefit skin." }
  ],
  "Annual Cost = (Facial Price + Add-Ons) x (1 + Tip%) x Visits",
  ["spa-day-cost-calculator", "chemical-peel-cost-calculator"]
);

add(
  "spa-day-cost-calculator",
  "Spa Day Cost Calculator",
  "Calculate the total cost of a full spa day package.",
  "Finance",
  "finance",
  "$",
  ["spa day cost", "spa package price", "spa visit cost"],
  [
    '{ name: "massage", label: "Massage ($)", type: "number", min: 0, max: 500, defaultValue: 120 }',
    '{ name: "facial", label: "Facial ($)", type: "number", min: 0, max: 400, defaultValue: 100 }',
    '{ name: "bodyTreatment", label: "Body Treatment ($)", type: "number", min: 0, max: 300, defaultValue: 80 }',
    '{ name: "nailService", label: "Nail Service ($)", type: "number", min: 0, max: 200, defaultValue: 60 }',
    '{ name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 }',
    '{ name: "guests", label: "Number of Guests", type: "number", min: 1, max: 10, defaultValue: 1 }'
  ],
  `(inputs) => {
    const massage = inputs.massage as number;
    const facial = inputs.facial as number;
    const bodyTreatment = inputs.bodyTreatment as number;
    const nailService = inputs.nailService as number;
    const tip = inputs.tip as number;
    const guests = inputs.guests as number;
    const perPersonSubtotal = massage + facial + bodyTreatment + nailService;
    const tipAmount = perPersonSubtotal * (tip / 100);
    const perPersonTotal = perPersonSubtotal + tipAmount;
    const grandTotal = perPersonTotal * guests;
    return {
      primary: { label: "Total Spa Day Cost", value: "$" + formatNumber(grandTotal) },
      details: [
        { label: "Per Person Subtotal", value: "$" + formatNumber(perPersonSubtotal) },
        { label: "Tip Per Person", value: "$" + formatNumber(tipAmount) },
        { label: "Per Person Total", value: "$" + formatNumber(perPersonTotal) }
      ]
    };
  }`,
  [
    { q: "How much does a spa day cost?", a: "A full spa day typically costs $200 to $500 per person." },
    { q: "What is included in a spa day?", a: "Packages usually include a massage, facial, and access to amenities." },
    { q: "How much should you tip at a spa?", a: "15 to 20 percent per service is customary at most spas." }
  ],
  "Total = (Massage + Facial + Body + Nails) x (1 + Tip%) x Guests",
  ["massage-cost-calculator", "facial-treatment-cost-calculator"]
);

add(
  "massage-cost-calculator",
  "Massage Cost Calculator",
  "Estimate massage session cost based on type and duration.",
  "Finance",
  "finance",
  "$",
  ["massage cost", "massage price", "massage session cost"],
  [
    '{ name: "massageType", label: "Massage Type", type: "select", options: [{ value: "80", label: "Swedish" }, { value: "100", label: "Deep Tissue" }, { value: "120", label: "Hot Stone" }, { value: "140", label: "Sports Massage" }] }',
    '{ name: "duration", label: "Duration", type: "select", options: [{ value: "0.75", label: "30 Minutes" }, { value: "1", label: "60 Minutes" }, { value: "1.4", label: "90 Minutes" }, { value: "1.75", label: "120 Minutes" }] }',
    '{ name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 }',
    '{ name: "visitsPerMonth", label: "Visits Per Month", type: "number", min: 1, max: 8, defaultValue: 2 }'
  ],
  `(inputs) => {
    const massageType = parseInt(inputs.massageType as string);
    const duration = parseFloat(inputs.duration as string);
    const tip = inputs.tip as number;
    const visitsPerMonth = inputs.visitsPerMonth as number;
    const sessionCost = massageType * duration;
    const tipAmount = sessionCost * (tip / 100);
    const totalPerVisit = sessionCost + tipAmount;
    const monthlyCost = totalPerVisit * visitsPerMonth;
    return {
      primary: { label: "Monthly Massage Cost", value: "$" + formatNumber(monthlyCost) },
      details: [
        { label: "Per Session", value: "$" + formatNumber(sessionCost) },
        { label: "Tip Per Session", value: "$" + formatNumber(tipAmount) },
        { label: "Annual Cost", value: "$" + formatNumber(monthlyCost * 12) }
      ]
    };
  }`,
  [
    { q: "How much does a massage cost?", a: "A 60-minute massage typically costs $60 to $120 depending on type." },
    { q: "How often should you get a massage?", a: "Once or twice per month is beneficial for stress relief and recovery." },
    { q: "Is deep tissue more expensive?", a: "Deep tissue massages usually cost $10 to $30 more than Swedish massage." }
  ],
  "Monthly = (Type Base x Duration Multiplier) x (1 + Tip%) x Visits",
  ["spa-day-cost-calculator", "waxing-cost-calculator"]
);

add(
  "waxing-cost-calculator",
  "Waxing Cost Calculator",
  "Calculate waxing service pricing for various body areas.",
  "Finance",
  "finance",
  "$",
  ["waxing cost", "wax service price", "body waxing cost"],
  [
    '{ name: "area", label: "Body Area", type: "select", options: [{ value: "15", label: "Eyebrow" }, { value: "25", label: "Upper Lip" }, { value: "50", label: "Underarm" }, { value: "65", label: "Half Leg" }, { value: "90", label: "Full Leg" }, { value: "70", label: "Brazilian" }] }',
    '{ name: "additionalAreas", label: "Additional Areas ($)", type: "number", min: 0, max: 300, defaultValue: 0 }',
    '{ name: "frequency", label: "Visits Per Year", type: "number", min: 1, max: 24, defaultValue: 8 }',
    '{ name: "tip", label: "Tip Percentage (%)", type: "number", min: 0, max: 40, defaultValue: 20 }'
  ],
  `(inputs) => {
    const area = parseInt(inputs.area as string);
    const additionalAreas = inputs.additionalAreas as number;
    const frequency = inputs.frequency as number;
    const tip = inputs.tip as number;
    const perVisit = area + additionalAreas;
    const tipAmount = perVisit * (tip / 100);
    const totalPerVisit = perVisit + tipAmount;
    const annualCost = totalPerVisit * frequency;
    return {
      primary: { label: "Annual Waxing Cost", value: "$" + formatNumber(annualCost) },
      details: [
        { label: "Cost Per Visit", value: "$" + formatNumber(totalPerVisit) },
        { label: "Tip Per Visit", value: "$" + formatNumber(tipAmount) },
        { label: "Monthly Average", value: "$" + formatNumber(annualCost / 12) }
      ]
    };
  }`,
  [
    { q: "How much does a Brazilian wax cost?", a: "Brazilian waxing typically costs $50 to $80 per session." },
    { q: "How often should you get waxed?", a: "Every 4 to 6 weeks is recommended for most body areas." },
    { q: "Is waxing cheaper than laser hair removal?", a: "Per session waxing is cheaper, but laser saves money long term." }
  ],
  "Annual = (Area Cost + Additional Areas) x (1 + Tip%) x Frequency",
  ["laser-hair-removal-calculator", "spa-day-cost-calculator"]
);

add(
  "botox-cost-calculator",
  "Botox Cost Calculator",
  "Estimate Botox treatment cost based on units needed.",
  "Finance",
  "finance",
  "$",
  ["botox cost", "botox price", "botox units cost"],
  [
    '{ name: "area", label: "Treatment Area", type: "select", options: [{ value: "20", label: "Forehead (20 units)" }, { value: "24", label: "Crow Feet (24 units)" }, { value: "20", label: "Frown Lines (20 units)" }, { value: "40", label: "Multiple Areas (40 units)" }] }',
    '{ name: "costPerUnit", label: "Cost Per Unit ($)", type: "number", min: 8, max: 25, defaultValue: 14 }',
    '{ name: "treatmentsPerYear", label: "Treatments Per Year", type: "number", min: 1, max: 6, defaultValue: 3 }'
  ],
  `(inputs) => {
    const units = parseInt(inputs.area as string);
    const costPerUnit = inputs.costPerUnit as number;
    const treatmentsPerYear = inputs.treatmentsPerYear as number;
    const perTreatment = units * costPerUnit;
    const annualCost = perTreatment * treatmentsPerYear;
    return {
      primary: { label: "Cost Per Treatment", value: "$" + formatNumber(perTreatment) },
      details: [
        { label: "Units Per Treatment", value: formatNumber(units) },
        { label: "Cost Per Unit", value: "$" + formatNumber(costPerUnit) },
        { label: "Annual Cost", value: "$" + formatNumber(annualCost) }
      ]
    };
  }`,
  [
    { q: "How much does Botox cost?", a: "Botox costs $10 to $20 per unit, with treatments using 20 to 60 units." },
    { q: "How often do you need Botox?", a: "Results last 3 to 4 months, so most people need 3 to 4 treatments per year." },
    { q: "How many units of Botox do I need?", a: "Forehead lines need about 20 units. Full treatment may require 40 to 60." }
  ],
  "Treatment Cost = Units x Cost Per Unit",
  ["dermal-filler-cost-calculator", "cosmetic-surgery-cost-calculator"]
);

add(
  "dermal-filler-cost-calculator",
  "Dermal Filler Cost Calculator",
  "Calculate dermal filler cost based on syringes and area.",
  "Finance",
  "finance",
  "$",
  ["dermal filler cost", "filler price", "lip filler cost"],
  [
    '{ name: "area", label: "Treatment Area", type: "select", options: [{ value: "1", label: "Lips (1 syringe)" }, { value: "2", label: "Cheeks (2 syringes)" }, { value: "1", label: "Nasolabial Folds (1 syringe)" }, { value: "3", label: "Full Face (3 syringes)" }] }',
    '{ name: "costPerSyringe", label: "Cost Per Syringe ($)", type: "number", min: 400, max: 1200, defaultValue: 650 }',
    '{ name: "touchUps", label: "Touch-Ups Per Year", type: "number", min: 0, max: 4, defaultValue: 1 }',
    '{ name: "touchUpSyringes", label: "Syringes Per Touch-Up", type: "number", min: 1, max: 4, defaultValue: 1 }'
  ],
  `(inputs) => {
    const syringes = parseInt(inputs.area as string);
    const costPerSyringe = inputs.costPerSyringe as number;
    const touchUps = inputs.touchUps as number;
    const touchUpSyringes = inputs.touchUpSyringes as number;
    const initialCost = syringes * costPerSyringe;
    const touchUpCost = touchUps * touchUpSyringes * costPerSyringe;
    const annualCost = initialCost + touchUpCost;
    return {
      primary: { label: "Initial Treatment Cost", value: "$" + formatNumber(initialCost) },
      details: [
        { label: "Syringes Needed", value: formatNumber(syringes) },
        { label: "Touch-Up Cost", value: "$" + formatNumber(touchUpCost) },
        { label: "Annual Total", value: "$" + formatNumber(annualCost) }
      ]
    };
  }`,
  [
    { q: "How much do dermal fillers cost?", a: "Fillers cost $500 to $1000 per syringe depending on the brand and area." },
    { q: "How long do fillers last?", a: "Most fillers last 6 to 18 months depending on the type and location." },
    { q: "How many syringes of filler do I need?", a: "Lips need 1 syringe. Cheeks need 1 to 2 syringes per side." }
  ],
  "Annual = (Initial Syringes x Cost) + (Touch-Ups x Syringes x Cost)",
  ["botox-cost-calculator", "cosmetic-surgery-cost-calculator"]
);

add(
  "microblading-cost-calculator",
  "Microblading Cost Calculator",
  "Estimate microblading eyebrow procedure cost and touch-ups.",
  "Finance",
  "finance",
  "$",
  ["microblading cost", "eyebrow microblading price", "brow tattoo cost"],
  [
    '{ name: "initialCost", label: "Initial Procedure Cost ($)", type: "number", min: 200, max: 1000, defaultValue: 450 }',
    '{ name: "touchUpCost", label: "Touch-Up Cost ($)", type: "number", min: 100, max: 500, defaultValue: 150 }',
    '{ name: "touchUpsFirstYear", label: "Touch-Ups in First Year", type: "number", min: 0, max: 3, defaultValue: 1 }',
    '{ name: "yearsToMaintain", label: "Years to Maintain", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "annualTouchUps", label: "Annual Touch-Ups After Year 1", type: "number", min: 0, max: 2, defaultValue: 1 }'
  ],
  `(inputs) => {
    const initialCost = inputs.initialCost as number;
    const touchUpCost = inputs.touchUpCost as number;
    const touchUpsFirstYear = inputs.touchUpsFirstYear as number;
    const yearsToMaintain = inputs.yearsToMaintain as number;
    const annualTouchUps = inputs.annualTouchUps as number;
    const firstYearCost = initialCost + (touchUpsFirstYear * touchUpCost);
    const subsequentYearsCost = (yearsToMaintain - 1) * annualTouchUps * touchUpCost;
    const totalCost = firstYearCost + subsequentYearsCost;
    const costPerYear = totalCost / yearsToMaintain;
    return {
      primary: { label: "Total Microblading Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "First Year Cost", value: "$" + formatNumber(firstYearCost) },
        { label: "Subsequent Years Cost", value: "$" + formatNumber(subsequentYearsCost) },
        { label: "Average Cost Per Year", value: "$" + formatNumber(costPerYear) }
      ]
    };
  }`,
  [
    { q: "How much does microblading cost?", a: "Initial microblading costs $300 to $800 depending on the artist and location." },
    { q: "How long does microblading last?", a: "Results last 1 to 3 years with periodic touch-ups to maintain shape." },
    { q: "Does microblading need touch-ups?", a: "Yes, a touch-up 6 to 8 weeks after the initial session is recommended." }
  ],
  "Total = Initial Cost + (First Year Touch-Ups x Cost) + (Years - 1) x Annual Touch-Ups x Cost",
  ["botox-cost-calculator", "eyelash-extension-cost-calculator"]
);

add(
  "chemical-peel-cost-calculator",
  "Chemical Peel Cost Calculator",
  "Calculate chemical peel treatment cost and series pricing.",
  "Finance",
  "finance",
  "$",
  ["chemical peel cost", "skin peel price", "chemical peel pricing"],
  [
    '{ name: "peelType", label: "Peel Type", type: "select", options: [{ value: "100", label: "Light/Superficial" }, { value: "250", label: "Medium Depth" }, { value: "500", label: "Deep Peel" }] }',
    '{ name: "sessionsInSeries", label: "Sessions in Series", type: "number", min: 1, max: 10, defaultValue: 3 }',
    '{ name: "seriesDiscount", label: "Series Discount (%)", type: "number", min: 0, max: 30, defaultValue: 10 }',
    '{ name: "consultFee", label: "Consultation Fee ($)", type: "number", min: 0, max: 200, defaultValue: 50 }'
  ],
  `(inputs) => {
    const peelType = parseInt(inputs.peelType as string);
    const sessionsInSeries = inputs.sessionsInSeries as number;
    const seriesDiscount = inputs.seriesDiscount as number;
    const consultFee = inputs.consultFee as number;
    const fullPrice = peelType * sessionsInSeries;
    const discountAmount = fullPrice * (seriesDiscount / 100);
    const seriesPrice = fullPrice - discountAmount + consultFee;
    const perSession = (seriesPrice - consultFee) / sessionsInSeries;
    return {
      primary: { label: "Total Series Cost", value: "$" + formatNumber(seriesPrice) },
      details: [
        { label: "Full Price Before Discount", value: "$" + formatNumber(fullPrice) },
        { label: "Discount Savings", value: "$" + formatNumber(discountAmount) },
        { label: "Effective Cost Per Session", value: "$" + formatNumber(perSession) }
      ]
    };
  }`,
  [
    { q: "How much does a chemical peel cost?", a: "Light peels cost $100 to $200. Deep peels can cost $500 or more." },
    { q: "How many chemical peels do I need?", a: "A series of 3 to 6 light peels is common. Deep peels may need only one." },
    { q: "How often can you get a chemical peel?", a: "Light peels every 2 to 4 weeks. Deep peels only once every few years." }
  ],
  "Series Cost = (Peel Price x Sessions) x (1 - Discount%) + Consultation Fee",
  ["facial-treatment-cost-calculator", "laser-hair-removal-calculator"]
);

add(
  "laser-hair-removal-calculator",
  "Laser Hair Removal Calculator",
  "Estimate laser hair removal sessions and total cost.",
  "Finance",
  "finance",
  "$",
  ["laser hair removal cost", "laser hair removal sessions", "permanent hair removal cost"],
  [
    '{ name: "bodyArea", label: "Body Area", type: "select", options: [{ value: "75", label: "Upper Lip" }, { value: "100", label: "Underarms" }, { value: "150", label: "Bikini" }, { value: "250", label: "Half Legs" }, { value: "400", label: "Full Legs" }, { value: "300", label: "Full Back" }] }',
    '{ name: "sessions", label: "Sessions Needed", type: "number", min: 4, max: 12, defaultValue: 6 }',
    '{ name: "packageDiscount", label: "Package Discount (%)", type: "number", min: 0, max: 30, defaultValue: 15 }',
    '{ name: "maintenanceSessions", label: "Annual Maintenance Sessions", type: "number", min: 0, max: 4, defaultValue: 1 }'
  ],
  `(inputs) => {
    const bodyArea = parseInt(inputs.bodyArea as string);
    const sessions = inputs.sessions as number;
    const packageDiscount = inputs.packageDiscount as number;
    const maintenanceSessions = inputs.maintenanceSessions as number;
    const fullPrice = bodyArea * sessions;
    const discount = fullPrice * (packageDiscount / 100);
    const packagePrice = fullPrice - discount;
    const maintenanceCost = bodyArea * maintenanceSessions;
    const firstYearTotal = packagePrice + maintenanceCost;
    return {
      primary: { label: "Treatment Package Cost", value: "$" + formatNumber(packagePrice) },
      details: [
        { label: "Per Session (Full Price)", value: "$" + formatNumber(bodyArea) },
        { label: "Package Savings", value: "$" + formatNumber(discount) },
        { label: "Annual Maintenance", value: "$" + formatNumber(maintenanceCost) }
      ]
    };
  }`,
  [
    { q: "How many laser hair removal sessions are needed?", a: "Most areas need 6 to 8 sessions spaced 4 to 8 weeks apart." },
    { q: "Is laser hair removal permanent?", a: "It provides permanent reduction. Some maintenance sessions may be needed." },
    { q: "Does skin tone affect laser hair removal?", a: "Modern lasers work on most skin tones but results vary by hair color." }
  ],
  "Package Cost = (Area Price x Sessions) x (1 - Discount%)",
  ["waxing-cost-calculator", "chemical-peel-cost-calculator"]
);

add(
  "teeth-straightening-cost-calculator",
  "Teeth Straightening Cost Calculator",
  "Compare aligner and braces costs for teeth straightening.",
  "Finance",
  "finance",
  "$",
  ["teeth straightening cost", "braces cost", "aligner cost", "invisalign cost"],
  [
    '{ name: "method", label: "Treatment Method", type: "select", options: [{ value: "5000", label: "Metal Braces" }, { value: "6000", label: "Ceramic Braces" }, { value: "5500", label: "Clear Aligners" }, { value: "7000", label: "Lingual Braces" }] }',
    '{ name: "duration", label: "Treatment Duration (months)", type: "number", min: 6, max: 36, defaultValue: 18 }',
    '{ name: "insurance", label: "Insurance Coverage ($)", type: "number", min: 0, max: 3000, defaultValue: 1500 }',
    '{ name: "retainerCost", label: "Retainer Cost ($)", type: "number", min: 100, max: 1000, defaultValue: 300 }'
  ],
  `(inputs) => {
    const method = parseInt(inputs.method as string);
    const duration = inputs.duration as number;
    const insurance = inputs.insurance as number;
    const retainerCost = inputs.retainerCost as number;
    const totalTreatment = method + retainerCost;
    const outOfPocket = Math.max(totalTreatment - insurance, 0);
    const monthlyCost = outOfPocket / duration;
    return {
      primary: { label: "Out of Pocket Cost", value: "$" + formatNumber(outOfPocket) },
      details: [
        { label: "Total Treatment Cost", value: "$" + formatNumber(totalTreatment) },
        { label: "Insurance Coverage", value: "$" + formatNumber(insurance) },
        { label: "Monthly Payment", value: "$" + formatNumber(monthlyCost) }
      ]
    };
  }`,
  [
    { q: "How much do braces cost?", a: "Metal braces cost $3000 to $7000. Clear aligners cost $3000 to $8000." },
    { q: "Are clear aligners cheaper than braces?", a: "They are similar in cost, though complex cases may cost more with aligners." },
    { q: "Does insurance cover teeth straightening?", a: "Many dental plans cover $1000 to $2000 for orthodontic treatment." }
  ],
  "Out of Pocket = (Treatment Cost + Retainer) - Insurance Coverage",
  ["cosmetic-surgery-cost-calculator", "botox-cost-calculator"]
);

add(
  "cosmetic-surgery-cost-calculator",
  "Cosmetic Surgery Cost Calculator",
  "Estimate cosmetic surgery procedure costs and fees.",
  "Finance",
  "finance",
  "$",
  ["cosmetic surgery cost", "plastic surgery cost", "procedure cost estimate"],
  [
    '{ name: "procedure", label: "Procedure", type: "select", options: [{ value: "6000", label: "Rhinoplasty" }, { value: "8000", label: "Breast Augmentation" }, { value: "7000", label: "Liposuction" }, { value: "10000", label: "Facelift" }, { value: "5000", label: "Eyelid Surgery" }] }',
    '{ name: "anesthesia", label: "Anesthesia Fee ($)", type: "number", min: 500, max: 3000, defaultValue: 1000 }',
    '{ name: "facilityFee", label: "Facility Fee ($)", type: "number", min: 500, max: 3000, defaultValue: 1500 }',
    '{ name: "aftercare", label: "Post-Op Care Cost ($)", type: "number", min: 0, max: 2000, defaultValue: 500 }'
  ],
  `(inputs) => {
    const procedure = parseInt(inputs.procedure as string);
    const anesthesia = inputs.anesthesia as number;
    const facilityFee = inputs.facilityFee as number;
    const aftercare = inputs.aftercare as number;
    const totalCost = procedure + anesthesia + facilityFee + aftercare;
    const surgeonFeePercent = (procedure / totalCost) * 100;
    return {
      primary: { label: "Total Procedure Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Surgeon Fee", value: "$" + formatNumber(procedure) },
        { label: "Anesthesia + Facility", value: "$" + formatNumber(anesthesia + facilityFee) },
        { label: "Post-Op Care", value: "$" + formatNumber(aftercare) }
      ]
    };
  }`,
  [
    { q: "What is included in cosmetic surgery cost?", a: "Total cost includes surgeon fee, anesthesia, facility fee, and aftercare." },
    { q: "Does insurance cover cosmetic surgery?", a: "Most cosmetic procedures are not covered unless deemed medically necessary." },
    { q: "Can you finance cosmetic surgery?", a: "Many practices offer payment plans or medical financing options." }
  ],
  "Total = Surgeon Fee + Anesthesia + Facility Fee + Post-Op Care",
  ["botox-cost-calculator", "dermal-filler-cost-calculator"]
);

add(
  "skincare-routine-cost-calculator",
  "Skincare Routine Cost Calculator",
  "Calculate your monthly and annual skincare product budget.",
  "Finance",
  "finance",
  "$",
  ["skincare cost", "skincare budget", "beauty routine cost"],
  [
    '{ name: "cleanser", label: "Cleanser Cost ($)", type: "number", min: 5, max: 100, defaultValue: 15 }',
    '{ name: "moisturizer", label: "Moisturizer Cost ($)", type: "number", min: 5, max: 150, defaultValue: 25 }',
    '{ name: "serum", label: "Serum Cost ($)", type: "number", min: 0, max: 200, defaultValue: 35 }',
    '{ name: "sunscreen", label: "Sunscreen Cost ($)", type: "number", min: 5, max: 60, defaultValue: 15 }',
    '{ name: "extras", label: "Extra Products Cost ($)", type: "number", min: 0, max: 200, defaultValue: 20 }',
    '{ name: "productLifespan", label: "Product Lifespan (months)", type: "number", min: 1, max: 6, defaultValue: 2 }'
  ],
  `(inputs) => {
    const cleanser = inputs.cleanser as number;
    const moisturizer = inputs.moisturizer as number;
    const serum = inputs.serum as number;
    const sunscreen = inputs.sunscreen as number;
    const extras = inputs.extras as number;
    const productLifespan = inputs.productLifespan as number;
    const totalProductCost = cleanser + moisturizer + serum + sunscreen + extras;
    const monthlyCost = totalProductCost / productLifespan;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Monthly Skincare Cost", value: "$" + formatNumber(monthlyCost) },
      details: [
        { label: "Total Product Cost", value: "$" + formatNumber(totalProductCost) },
        { label: "Product Lifespan", value: formatNumber(productLifespan) + " months" },
        { label: "Annual Cost", value: "$" + formatNumber(annualCost) }
      ]
    };
  }`,
  [
    { q: "How much should you spend on skincare?", a: "A basic routine costs $30 to $80 per month. Premium products cost more." },
    { q: "What are the essential skincare products?", a: "Cleanser, moisturizer, and sunscreen are the three essential products." },
    { q: "How long do skincare products last?", a: "Most products last 2 to 3 months with daily use." }
  ],
  "Monthly Cost = (Cleanser + Moisturizer + Serum + Sunscreen + Extras) / Lifespan",
  ["perfume-cost-per-wear-calculator", "facial-treatment-cost-calculator"]
);

add(
  "perfume-cost-per-wear-calculator",
  "Perfume Cost Per Wear Calculator",
  "Calculate the cost per use of your fragrance collection.",
  "Finance",
  "finance",
  "$",
  ["perfume cost per wear", "fragrance cost", "perfume value"],
  [
    '{ name: "bottlePrice", label: "Bottle Price ($)", type: "number", min: 10, max: 1000, defaultValue: 120 }',
    '{ name: "bottleSize", label: "Bottle Size (ml)", type: "number", min: 10, max: 200, defaultValue: 100 }',
    '{ name: "spraysPerUse", label: "Sprays Per Use", type: "number", min: 1, max: 10, defaultValue: 4 }',
    '{ name: "usesPerWeek", label: "Uses Per Week", type: "number", min: 1, max: 7, defaultValue: 5 }'
  ],
  `(inputs) => {
    const bottlePrice = inputs.bottlePrice as number;
    const bottleSize = inputs.bottleSize as number;
    const spraysPerUse = inputs.spraysPerUse as number;
    const usesPerWeek = inputs.usesPerWeek as number;
    const mlPerSpray = 0.1;
    const totalSprays = bottleSize / mlPerSpray;
    const totalUses = totalSprays / spraysPerUse;
    const costPerWear = bottlePrice / totalUses;
    const weeksToFinish = totalUses / usesPerWeek;
    return {
      primary: { label: "Cost Per Wear", value: "$" + formatNumber(costPerWear) },
      details: [
        { label: "Total Uses", value: formatNumber(totalUses) },
        { label: "Weeks to Finish", value: formatNumber(weeksToFinish) },
        { label: "Cost Per Month", value: "$" + formatNumber(costPerWear * usesPerWeek * 4.33) }
      ]
    };
  }`,
  [
    { q: "How many sprays are in a perfume bottle?", a: "A 100ml bottle contains about 1000 sprays at 0.1ml per spray." },
    { q: "How many sprays of perfume should you use?", a: "3 to 5 sprays is typical. More may be needed for lighter scents." },
    { q: "Is expensive perfume worth it?", a: "Higher-priced perfumes often have better longevity and lower cost per wear." }
  ],
  "Cost Per Wear = Bottle Price / (Total Sprays / Sprays Per Use)",
  ["skincare-routine-cost-calculator", "makeup-expiration-calculator"]
);

add(
  "makeup-expiration-calculator",
  "Makeup Expiration Calculator",
  "Track makeup product lifespan and replacement schedule.",
  "Everyday",
  "everyday",
  "~",
  ["makeup expiration", "makeup shelf life", "cosmetic expiration"],
  [
    '{ name: "productType", label: "Product Type", type: "select", options: [{ value: "3", label: "Mascara (3 months)" }, { value: "6", label: "Liquid Foundation (6 months)" }, { value: "12", label: "Lipstick (12 months)" }, { value: "24", label: "Powder Products (24 months)" }, { value: "18", label: "Cream Blush (18 months)" }] }',
    '{ name: "openedDate", label: "Months Since Opened", type: "number", min: 0, max: 36, defaultValue: 3 }',
    '{ name: "productCost", label: "Product Cost ($)", type: "number", min: 1, max: 200, defaultValue: 25 }',
    '{ name: "totalProducts", label: "Total Products to Track", type: "number", min: 1, max: 50, defaultValue: 10 }'
  ],
  `(inputs) => {
    const shelfLife = parseInt(inputs.productType as string);
    const openedDate = inputs.openedDate as number;
    const productCost = inputs.productCost as number;
    const totalProducts = inputs.totalProducts as number;
    const remainingMonths = Math.max(shelfLife - openedDate, 0);
    const isExpired = openedDate >= shelfLife;
    const annualReplacementCost = productCost * (12 / shelfLife);
    const totalAnnualCost = annualReplacementCost * totalProducts;
    return {
      primary: { label: "Product Status", value: isExpired ? "Expired - Replace Now" : formatNumber(remainingMonths) + " months remaining" },
      details: [
        { label: "Shelf Life", value: formatNumber(shelfLife) + " months" },
        { label: "Replacement Cost Per Year", value: "$" + formatNumber(annualReplacementCost) },
        { label: "Total Annual Replacement Cost", value: "$" + formatNumber(totalAnnualCost) }
      ]
    };
  }`,
  [
    { q: "How long does mascara last?", a: "Mascara should be replaced every 3 months to prevent bacterial growth." },
    { q: "When should you throw away makeup?", a: "Follow the PAO symbol on packaging, which shows months after opening." },
    { q: "Can expired makeup cause problems?", a: "Yes, expired makeup can cause skin irritation, breakouts, and infections." }
  ],
  "Remaining Life = Shelf Life (months) - Months Since Opened",
  ["skincare-routine-cost-calculator", "perfume-cost-per-wear-calculator"]
);

add(
  "sunscreen-usage-calculator",
  "Sunscreen Usage Calculator",
  "Calculate the amount of sunscreen needed for proper protection.",
  "Health",
  "health",
  "H",
  ["sunscreen amount", "sunscreen usage", "spf coverage", "sun protection"],
  [
    '{ name: "bodyAreas", label: "Coverage Area", type: "select", options: [{ value: "1", label: "Face Only" }, { value: "3", label: "Face and Arms" }, { value: "5", label: "Upper Body" }, { value: "9", label: "Full Body" }] }',
    '{ name: "hoursOutdoors", label: "Hours Outdoors", type: "number", min: 1, max: 12, defaultValue: 4 }',
    '{ name: "bottleSize", label: "Bottle Size (oz)", type: "number", min: 1, max: 16, defaultValue: 6 }',
    '{ name: "bottleCost", label: "Bottle Cost ($)", type: "number", min: 5, max: 50, defaultValue: 12 }'
  ],
  `(inputs) => {
    const bodyAreas = parseInt(inputs.bodyAreas as string);
    const hoursOutdoors = inputs.hoursOutdoors as number;
    const bottleSize = inputs.bottleSize as number;
    const bottleCost = inputs.bottleCost as number;
    const ozPerApplication = bodyAreas * 0.11;
    const reapplications = Math.ceil(hoursOutdoors / 2);
    const dailyUsage = ozPerApplication * reapplications;
    const daysPerBottle = bottleSize / dailyUsage;
    const costPerDay = bottleCost / daysPerBottle;
    return {
      primary: { label: "Daily Sunscreen Needed", value: formatNumber(dailyUsage) + " oz" },
      details: [
        { label: "Applications Per Day", value: formatNumber(reapplications) },
        { label: "Days Per Bottle", value: formatNumber(daysPerBottle) },
        { label: "Cost Per Day", value: "$" + formatNumber(costPerDay) }
      ]
    };
  }`,
  [
    { q: "How much sunscreen should I apply?", a: "Use about 1 ounce (a shot glass full) for full body coverage." },
    { q: "How often should you reapply sunscreen?", a: "Reapply every 2 hours, or immediately after swimming or sweating." },
    { q: "Does higher SPF mean better protection?", a: "SPF 30 blocks 97 percent of UVB rays. SPF 50 blocks about 98 percent." }
  ],
  "Daily Usage = (Body Areas x 0.11 oz) x (Hours / 2 reapplications)",
  ["skin-type-hydration-calculator", "skincare-routine-cost-calculator"]
);

add(
  "hair-growth-calculator",
  "Hair Growth Calculator",
  "Estimate hair growth timeline to reach your desired length.",
  "Health",
  "health",
  "H",
  ["hair growth rate", "hair growth timeline", "hair length calculator"],
  [
    '{ name: "currentLength", label: "Current Length (inches)", type: "number", min: 0, max: 40, defaultValue: 6 }',
    '{ name: "desiredLength", label: "Desired Length (inches)", type: "number", min: 1, max: 48, defaultValue: 18 }',
    '{ name: "growthRate", label: "Growth Rate", type: "select", options: [{ value: "0.4", label: "Slow (0.4 in/month)" }, { value: "0.5", label: "Average (0.5 in/month)" }, { value: "0.7", label: "Fast (0.7 in/month)" }] }',
    '{ name: "trimFrequency", label: "Trim Frequency (months)", type: "number", min: 0, max: 12, defaultValue: 3 }',
    '{ name: "trimAmount", label: "Trim Amount (inches)", type: "number", min: 0, max: 2, defaultValue: 0.5 }'
  ],
  `(inputs) => {
    const currentLength = inputs.currentLength as number;
    const desiredLength = inputs.desiredLength as number;
    const growthRate = parseFloat(inputs.growthRate as string);
    const trimFrequency = inputs.trimFrequency as number;
    const trimAmount = inputs.trimAmount as number;
    if (desiredLength <= currentLength) return null;
    const trimPerMonth = trimFrequency > 0 ? trimAmount / trimFrequency : 0;
    const netGrowthPerMonth = growthRate - trimPerMonth;
    if (netGrowthPerMonth <= 0) return null;
    const growthNeeded = desiredLength - currentLength;
    const monthsNeeded = Math.ceil(growthNeeded / netGrowthPerMonth);
    const yearsMonths = Math.floor(monthsNeeded / 12) + " years " + (monthsNeeded % 12) + " months";
    return {
      primary: { label: "Time to Goal", value: yearsMonths },
      details: [
        { label: "Growth Needed", value: formatNumber(growthNeeded) + " inches" },
        { label: "Net Growth Per Month", value: formatNumber(netGrowthPerMonth) + " inches" },
        { label: "Total Months", value: formatNumber(monthsNeeded) }
      ]
    };
  }`,
  [
    { q: "How fast does hair grow?", a: "Hair grows about 0.5 inches per month or 6 inches per year on average." },
    { q: "Does trimming make hair grow faster?", a: "No, trimming prevents split ends but does not affect growth rate." },
    { q: "What helps hair grow faster?", a: "Good nutrition, reduced heat styling, and gentle care support healthy growth." }
  ],
  "Months = Growth Needed / (Growth Rate - Trim Loss Per Month)",
  ["haircut-frequency-calculator", "skin-type-hydration-calculator"]
);

add(
  "skin-type-hydration-calculator",
  "Skin Type Hydration Calculator",
  "Calculate daily water intake recommendation for your skin type.",
  "Health",
  "health",
  "H",
  ["skin hydration", "water for skin", "skin type water intake"],
  [
    '{ name: "skinType", label: "Skin Type", type: "select", options: [{ value: "1", label: "Oily" }, { value: "1.1", label: "Normal" }, { value: "1.2", label: "Combination" }, { value: "1.3", label: "Dry" }, { value: "1.4", label: "Very Dry" }] }',
    '{ name: "bodyWeight", label: "Body Weight (lbs)", type: "number", min: 80, max: 400, defaultValue: 150 }',
    '{ name: "climate", label: "Climate", type: "select", options: [{ value: "1", label: "Humid" }, { value: "1.1", label: "Temperate" }, { value: "1.2", label: "Dry/Arid" }] }',
    '{ name: "activityLevel", label: "Activity Level", type: "select", options: [{ value: "1", label: "Sedentary" }, { value: "1.15", label: "Moderate" }, { value: "1.3", label: "Active" }] }'
  ],
  `(inputs) => {
    const skinType = parseFloat(inputs.skinType as string);
    const bodyWeight = inputs.bodyWeight as number;
    const climate = parseFloat(inputs.climate as string);
    const activityLevel = parseFloat(inputs.activityLevel as string);
    const baseOz = bodyWeight * 0.5;
    const adjustedOz = baseOz * skinType * climate * activityLevel;
    const liters = adjustedOz * 0.0296;
    const glasses = Math.ceil(adjustedOz / 8);
    return {
      primary: { label: "Daily Water Intake", value: formatNumber(adjustedOz) + " oz (" + formatNumber(liters) + " L)" },
      details: [
        { label: "Glasses of Water (8 oz)", value: formatNumber(glasses) },
        { label: "Skin Type Adjustment", value: "x" + formatNumber(skinType) },
        { label: "Climate Adjustment", value: "x" + formatNumber(climate) }
      ]
    };
  }`,
  [
    { q: "How much water should I drink for good skin?", a: "About half your body weight in ounces daily, adjusted for skin type." },
    { q: "Does drinking water improve skin?", a: "Adequate hydration supports skin elasticity and reduces dryness." },
    { q: "Does dry skin need more water?", a: "Dry skin types benefit from increased water intake and topical hydration." }
  ],
  "Daily Oz = (Body Weight x 0.5) x Skin Type Factor x Climate Factor x Activity Factor",
  ["sunscreen-usage-calculator", "hair-growth-calculator"]
);
