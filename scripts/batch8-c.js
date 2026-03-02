add(
  "aircraft-weight-balance-calculator",
  "Aircraft Weight Balance Calculator",
  "Calculate aircraft center of gravity from weight and arm data.",
  "Science",
  "science",
  "A",
  ["aircraft", "weight", "balance", "CG"],
  [
    '{ name: "emptyWeight", label: "Empty Weight (lbs)", type: "number", min: 500, max: 50000, defaultValue: 1500 }',
    '{ name: "emptyArm", label: "Empty Weight Arm (in)", type: "number", min: 10, max: 300, defaultValue: 82 }',
    '{ name: "fuelWeight", label: "Fuel Weight (lbs)", type: "number", min: 0, max: 5000, defaultValue: 300 }',
    '{ name: "fuelArm", label: "Fuel Arm (in)", type: "number", min: 10, max: 300, defaultValue: 95 }',
    '{ name: "payloadWeight", label: "Payload Weight (lbs)", type: "number", min: 0, max: 5000, defaultValue: 400 }',
    '{ name: "payloadArm", label: "Payload Arm (in)", type: "number", min: 10, max: 300, defaultValue: 73 }',
  ],
  `(inputs) => {
    const emptyWeight = inputs.emptyWeight as number;
    const emptyArm = inputs.emptyArm as number;
    const fuelWeight = inputs.fuelWeight as number;
    const fuelArm = inputs.fuelArm as number;
    const payloadWeight = inputs.payloadWeight as number;
    const payloadArm = inputs.payloadArm as number;
    const totalWeight = emptyWeight + fuelWeight + payloadWeight;
    const totalMoment = emptyWeight * emptyArm + fuelWeight * fuelArm + payloadWeight * payloadArm;
    const cg = totalMoment / totalWeight;
    return {
      primary: { label: "Center of Gravity", value: formatNumber(cg) + " in aft of datum" },
      details: [
        { label: "Total Weight", value: formatNumber(totalWeight) + " lbs" },
        { label: "Total Moment", value: formatNumber(totalMoment) + " lb-in" }
      ]
    };
  }`,
  [
    { q: "What is center of gravity in aviation?", a: "It is the point where the aircraft balances longitudinally." },
    { q: "Why does CG matter for flight?", a: "An out of range CG makes the aircraft unstable or uncontrollable." }
  ],
  "CG = Total Moment / Total Weight; Moment = Weight x Arm",
  ["fuel-burn-rate-calculator", "true-airspeed-calculator"]
);

add(
  "fuel-burn-rate-calculator",
  "Fuel Burn Rate Calculator",
  "Estimate aircraft fuel consumption over a flight leg.",
  "Science",
  "science",
  "A",
  ["fuel", "burn", "rate", "aircraft"],
  [
    '{ name: "fuelOnboard", label: "Fuel On Board (gal)", type: "number", min: 1, max: 5000, defaultValue: 50 }',
    '{ name: "burnRate", label: "Burn Rate (gal/hr)", type: "number", min: 1, max: 500, defaultValue: 10 }',
    '{ name: "flightTime", label: "Flight Time (hours)", type: "number", min: 0.1, max: 24, defaultValue: 2.5 }',
  ],
  `(inputs) => {
    const fuelOnboard = inputs.fuelOnboard as number;
    const burnRate = inputs.burnRate as number;
    const flightTime = inputs.flightTime as number;
    const fuelUsed = burnRate * flightTime;
    const fuelRemaining = fuelOnboard - fuelUsed;
    const endurance = fuelOnboard / burnRate;
    return {
      primary: { label: "Fuel Remaining", value: formatNumber(fuelRemaining) + " gal" },
      details: [
        { label: "Fuel Used", value: formatNumber(fuelUsed) + " gal" },
        { label: "Total Endurance", value: formatNumber(endurance) + " hours" }
      ]
    };
  }`,
  [
    { q: "What is a typical fuel burn for a small airplane?", a: "A small piston aircraft burns about 8 to 15 gallons per hour." },
    { q: "How much fuel reserve is required?", a: "VFR flights require at least 30 minutes of fuel reserve." }
  ],
  "Fuel Used = Burn Rate x Flight Time; Remaining = On Board - Used",
  ["aircraft-weight-balance-calculator", "flight-time-calculator"]
);

add(
  "crosswind-component-calculator",
  "Crosswind Component Calculator",
  "Calculate crosswind and headwind from wind angle and speed.",
  "Science",
  "science",
  "A",
  ["crosswind", "headwind", "runway", "wind"],
  [
    '{ name: "windSpeed", label: "Wind Speed (kts)", type: "number", min: 0, max: 100, defaultValue: 20 }',
    '{ name: "windAngle", label: "Wind Angle Off Runway (deg)", type: "number", min: 0, max: 90, defaultValue: 30 }',
  ],
  `(inputs) => {
    const windSpeed = inputs.windSpeed as number;
    const windAngle = inputs.windAngle as number;
    const rad = windAngle * Math.PI / 180;
    const crosswind = windSpeed * Math.sin(rad);
    const headwind = windSpeed * Math.cos(rad);
    return {
      primary: { label: "Crosswind Component", value: formatNumber(crosswind) + " kts" },
      details: [
        { label: "Headwind Component", value: formatNumber(headwind) + " kts" },
        { label: "Wind Angle", value: formatNumber(windAngle) + " degrees" }
      ]
    };
  }`,
  [
    { q: "How do you calculate crosswind?", a: "Multiply wind speed by the sine of the angle off the runway." },
    { q: "What is a safe crosswind limit?", a: "Most small aircraft have a limit of 15 to 20 knots crosswind." }
  ],
  "Crosswind = Wind Speed x sin(Angle); Headwind = Wind Speed x cos(Angle)",
  ["density-altitude-calculator", "true-airspeed-calculator"]
);

add(
  "density-altitude-calculator",
  "Density Altitude Calculator",
  "Calculate density altitude from elevation and temperature.",
  "Science",
  "science",
  "A",
  ["density", "altitude", "pressure", "temperature"],
  [
    '{ name: "fieldElev", label: "Field Elevation (ft)", type: "number", min: 0, max: 15000, defaultValue: 5000 }',
    '{ name: "altimeter", label: "Altimeter Setting (inHg)", type: "number", min: 28, max: 31, defaultValue: 29.92 }',
    '{ name: "oat", label: "Outside Air Temp (C)", type: "number", min: -40, max: 50, defaultValue: 25 }',
  ],
  `(inputs) => {
    const fieldElev = inputs.fieldElev as number;
    const altimeter = inputs.altimeter as number;
    const oat = inputs.oat as number;
    const pressAlt = fieldElev + (29.92 - altimeter) * 1000;
    const stdTemp = 15 - (pressAlt / 1000) * 2;
    const tempDev = oat - stdTemp;
    const densityAlt = pressAlt + 120 * tempDev;
    return {
      primary: { label: "Density Altitude", value: formatNumber(densityAlt) + " ft" },
      details: [
        { label: "Pressure Altitude", value: formatNumber(pressAlt) + " ft" },
        { label: "Standard Temp at Altitude", value: formatNumber(stdTemp) + " C" },
        { label: "Temp Deviation", value: formatNumber(tempDev) + " C" }
      ]
    };
  }`,
  [
    { q: "What is density altitude?", a: "It is pressure altitude corrected for nonstandard temperature." },
    { q: "Why does density altitude matter?", a: "Higher density altitude reduces engine power and lift." }
  ],
  "Pressure Alt = Elev + (29.92 - Altimeter) x 1000; DA = PA + 120 x Temp Dev",
  ["crosswind-component-calculator", "true-airspeed-calculator"]
);

add(
  "true-airspeed-calculator",
  "True Airspeed Calculator",
  "Calculate true airspeed from indicated airspeed and altitude.",
  "Science",
  "science",
  "A",
  ["true", "airspeed", "TAS", "IAS"],
  [
    '{ name: "ias", label: "Indicated Airspeed (kts)", type: "number", min: 40, max: 500, defaultValue: 120 }',
    '{ name: "pressAlt", label: "Pressure Altitude (ft)", type: "number", min: 0, max: 45000, defaultValue: 8000 }',
    '{ name: "oat", label: "Outside Air Temp (C)", type: "number", min: -60, max: 50, defaultValue: 5 }',
  ],
  `(inputs) => {
    const ias = inputs.ias as number;
    const pressAlt = inputs.pressAlt as number;
    const oat = inputs.oat as number;
    const stdTemp = 15 - (pressAlt / 1000) * 2;
    const tempRatio = (oat + 273.15) / (stdTemp + 273.15);
    const densityRatio = Math.pow(1 - pressAlt / 145442, 4.256);
    const tas = ias / Math.sqrt(densityRatio / tempRatio);
    return {
      primary: { label: "True Airspeed", value: formatNumber(tas) + " kts" },
      details: [
        { label: "Indicated Airspeed", value: formatNumber(ias) + " kts" },
        { label: "Standard Temp", value: formatNumber(stdTemp) + " C" },
        { label: "TAS Increase", value: formatNumber(tas - ias) + " kts" }
      ]
    };
  }`,
  [
    { q: "What is true airspeed?", a: "TAS is the actual speed of the aircraft through the air mass." },
    { q: "How does altitude affect TAS?", a: "TAS increases about 2 percent per 1000 feet of altitude." }
  ],
  "TAS = IAS / sqrt(Density Ratio / Temp Ratio)",
  ["density-altitude-calculator", "flight-time-calculator"]
);

add(
  "flight-time-calculator",
  "Flight Time Calculator",
  "Estimate flight duration from distance and groundspeed.",
  "Science",
  "science",
  "A",
  ["flight", "time", "distance", "groundspeed"],
  [
    '{ name: "distance", label: "Distance (NM)", type: "number", min: 1, max: 15000, defaultValue: 250 }',
    '{ name: "groundspeed", label: "Groundspeed (kts)", type: "number", min: 30, max: 600, defaultValue: 130 }',
  ],
  `(inputs) => {
    const distance = inputs.distance as number;
    const groundspeed = inputs.groundspeed as number;
    const timeHours = distance / groundspeed;
    const hours = Math.floor(timeHours);
    const minutes = Math.round((timeHours - hours) * 60);
    return {
      primary: { label: "Flight Time", value: hours + " hr " + minutes + " min" },
      details: [
        { label: "Decimal Hours", value: formatNumber(timeHours) + " hrs" },
        { label: "Distance", value: formatNumber(distance) + " NM" },
        { label: "Groundspeed", value: formatNumber(groundspeed) + " kts" }
      ]
    };
  }`,
  [
    { q: "What is groundspeed?", a: "Groundspeed is the speed of the aircraft relative to the ground." },
    { q: "How is flight time calculated?", a: "Divide the distance in nautical miles by groundspeed in knots." }
  ],
  "Flight Time = Distance / Groundspeed",
  ["fuel-burn-rate-calculator", "true-airspeed-calculator"]
);

add(
  "runway-length-calculator",
  "Runway Length Calculator",
  "Estimate required runway length for takeoff.",
  "Science",
  "science",
  "A",
  ["runway", "takeoff", "distance", "aircraft"],
  [
    '{ name: "grossWeight", label: "Gross Weight (lbs)", type: "number", min: 1000, max: 100000, defaultValue: 2500 }',
    '{ name: "densityAlt", label: "Density Altitude (ft)", type: "number", min: 0, max: 15000, defaultValue: 3000 }',
    '{ name: "baseRun", label: "Sea Level Takeoff Roll (ft)", type: "number", min: 200, max: 10000, defaultValue: 1200 }',
  ],
  `(inputs) => {
    const grossWeight = inputs.grossWeight as number;
    const densityAlt = inputs.densityAlt as number;
    const baseRun = inputs.baseRun as number;
    const altFactor = 1 + densityAlt / 1000 * 0.10;
    const weightFactor = grossWeight / 2500;
    const requiredRun = baseRun * altFactor * weightFactor;
    const safetyMargin = requiredRun * 1.5;
    return {
      primary: { label: "Required Runway", value: formatNumber(requiredRun) + " ft" },
      details: [
        { label: "With 50% Safety Margin", value: formatNumber(safetyMargin) + " ft" },
        { label: "Altitude Factor", value: formatNumber(altFactor) },
        { label: "Weight Factor", value: formatNumber(weightFactor) }
      ]
    };
  }`,
  [
    { q: "How does altitude affect takeoff distance?", a: "Takeoff distance increases about 10 percent per 1000 feet." },
    { q: "What safety margin should I use?", a: "Add at least 50 percent to calculated takeoff distance." }
  ],
  "Required = Base Roll x Altitude Factor x Weight Factor",
  ["density-altitude-calculator", "aircraft-weight-balance-calculator"]
);

add(
  "nautical-mile-converter-calculator",
  "Nautical Mile Converter Calculator",
  "Convert nautical miles to kilometers and statute miles.",
  "Conversion",
  "conversion",
  "R",
  ["nautical", "mile", "kilometer", "conversion"],
  [
    '{ name: "nauticalMiles", label: "Nautical Miles", type: "number", min: 0, max: 100000, defaultValue: 100 }',
  ],
  `(inputs) => {
    const nauticalMiles = inputs.nauticalMiles as number;
    const km = nauticalMiles * 1.852;
    const statuteMiles = nauticalMiles * 1.15078;
    const meters = km * 1000;
    return {
      primary: { label: "Kilometers", value: formatNumber(km) + " km" },
      details: [
        { label: "Statute Miles", value: formatNumber(statuteMiles) + " mi" },
        { label: "Meters", value: formatNumber(meters) + " m" },
        { label: "Nautical Miles", value: formatNumber(nauticalMiles) + " NM" }
      ]
    };
  }`,
  [
    { q: "How long is a nautical mile?", a: "One nautical mile equals 1.852 kilometers or 1.15078 statute miles." },
    { q: "Why do sailors use nautical miles?", a: "A nautical mile equals one minute of latitude on a chart." }
  ],
  "Kilometers = NM x 1.852; Statute Miles = NM x 1.15078",
  ["chart-distance-calculator", "light-year-distance-calculator"]
);

add(
  "true-wind-calculator",
  "True Wind Calculator",
  "Calculate true wind speed and direction from apparent wind.",
  "Science",
  "science",
  "A",
  ["true", "wind", "apparent", "sailing"],
  [
    '{ name: "apparentSpeed", label: "Apparent Wind Speed (kts)", type: "number", min: 0, max: 100, defaultValue: 18 }',
    '{ name: "apparentAngle", label: "Apparent Wind Angle (deg)", type: "number", min: 0, max: 180, defaultValue: 45 }',
    '{ name: "boatSpeed", label: "Boat Speed (kts)", type: "number", min: 0, max: 40, defaultValue: 6 }',
  ],
  `(inputs) => {
    const apparentSpeed = inputs.apparentSpeed as number;
    const apparentAngle = inputs.apparentAngle as number;
    const boatSpeed = inputs.boatSpeed as number;
    const rad = apparentAngle * Math.PI / 180;
    const twx = apparentSpeed * Math.sin(rad);
    const twy = apparentSpeed * Math.cos(rad) - boatSpeed;
    const trueSpeed = Math.sqrt(twx * twx + twy * twy);
    const trueAngle = Math.atan2(twx, twy) * 180 / Math.PI;
    return {
      primary: { label: "True Wind Speed", value: formatNumber(trueSpeed) + " kts" },
      details: [
        { label: "True Wind Angle", value: formatNumber(trueAngle) + " degrees" },
        { label: "Apparent Wind Speed", value: formatNumber(apparentSpeed) + " kts" },
        { label: "Boat Speed", value: formatNumber(boatSpeed) + " kts" }
      ]
    };
  }`,
  [
    { q: "What is apparent wind?", a: "Apparent wind is the wind felt on a moving vessel." },
    { q: "Why is true wind important for sailing?", a: "True wind determines sail trim and optimal course heading." }
  ],
  "True Wind = vector difference of Apparent Wind and Boat Speed",
  ["crosswind-component-calculator", "tidal-range-calculator"]
);

add(
  "tidal-range-calculator",
  "Tidal Range Calculator",
  "Estimate tide height at a given time between high and low.",
  "Science",
  "science",
  "A",
  ["tidal", "range", "tide", "height"],
  [
    '{ name: "highTide", label: "High Tide Height (ft)", type: "number", min: 0, max: 30, defaultValue: 8 }',
    '{ name: "lowTide", label: "Low Tide Height (ft)", type: "number", min: -5, max: 20, defaultValue: 2 }',
    '{ name: "hoursAfterHigh", label: "Hours After High Tide", type: "number", min: 0, max: 12, defaultValue: 3 }',
    '{ name: "tidalPeriod", label: "Tidal Period (hours)", type: "number", min: 6, max: 13, defaultValue: 12.42 }',
  ],
  `(inputs) => {
    const highTide = inputs.highTide as number;
    const lowTide = inputs.lowTide as number;
    const hoursAfterHigh = inputs.hoursAfterHigh as number;
    const tidalPeriod = inputs.tidalPeriod as number;
    const range = highTide - lowTide;
    const midLevel = (highTide + lowTide) / 2;
    const angle = (2 * Math.PI * hoursAfterHigh) / tidalPeriod;
    const currentHeight = midLevel + (range / 2) * Math.cos(angle);
    return {
      primary: { label: "Current Tide Height", value: formatNumber(currentHeight) + " ft" },
      details: [
        { label: "Tidal Range", value: formatNumber(range) + " ft" },
        { label: "Mid Tide Level", value: formatNumber(midLevel) + " ft" },
        { label: "Hours After High", value: formatNumber(hoursAfterHigh) + " hrs" }
      ]
    };
  }`,
  [
    { q: "How long is a tidal cycle?", a: "A typical semidiurnal tidal cycle is about 12 hours 25 minutes." },
    { q: "What is tidal range?", a: "Tidal range is the height difference between high and low tide." }
  ],
  "Height = MidLevel + (Range / 2) x cos(2 x pi x Hours / Period)",
  ["true-wind-calculator", "chart-distance-calculator"]
);

add(
  "chart-distance-calculator",
  "Chart Distance Calculator",
  "Calculate nautical distance from chart measurements.",
  "Science",
  "science",
  "A",
  ["chart", "distance", "nautical", "navigation"],
  [
    '{ name: "chartDist", label: "Chart Distance (cm)", type: "number", min: 0.1, max: 100, defaultValue: 5 }',
    '{ name: "scale", label: "Chart Scale (1:N)", type: "number", min: 1000, max: 10000000, defaultValue: 50000 }',
  ],
  `(inputs) => {
    const chartDist = inputs.chartDist as number;
    const scale = inputs.scale as number;
    const realCm = chartDist * scale;
    const realKm = realCm / 100000;
    const nauticalMiles = realKm / 1.852;
    return {
      primary: { label: "Nautical Miles", value: formatNumber(nauticalMiles) + " NM" },
      details: [
        { label: "Real Distance", value: formatNumber(realKm) + " km" },
        { label: "Chart Scale", value: "1:" + formatNumber(scale) },
        { label: "Chart Measurement", value: formatNumber(chartDist) + " cm" }
      ]
    };
  }`,
  [
    { q: "How do I measure distance on a nautical chart?", a: "Measure with dividers and compare to the latitude scale." },
    { q: "What scale are most coastal charts?", a: "Coastal charts are typically 1:40000 to 1:80000 scale." }
  ],
  "Real Distance = Chart Distance x Scale; NM = km / 1.852",
  ["nautical-mile-converter-calculator", "tidal-range-calculator"]
);

add(
  "fuel-range-calculator",
  "Fuel Range Calculator",
  "Estimate how far a boat can travel on available fuel.",
  "Science",
  "science",
  "A",
  ["fuel", "range", "boat", "marine"],
  [
    '{ name: "fuelCapacity", label: "Fuel Capacity (gal)", type: "number", min: 1, max: 10000, defaultValue: 150 }',
    '{ name: "burnRate", label: "Fuel Burn Rate (gal/hr)", type: "number", min: 0.5, max: 500, defaultValue: 12 }',
    '{ name: "cruiseSpeed", label: "Cruise Speed (kts)", type: "number", min: 1, max: 50, defaultValue: 18 }',
    '{ name: "reserve", label: "Reserve Fuel (%)", type: "number", min: 0, max: 50, defaultValue: 10 }',
  ],
  `(inputs) => {
    const fuelCapacity = inputs.fuelCapacity as number;
    const burnRate = inputs.burnRate as number;
    const cruiseSpeed = inputs.cruiseSpeed as number;
    const reserve = inputs.reserve as number;
    const usableFuel = fuelCapacity * (1 - reserve / 100);
    const endurance = usableFuel / burnRate;
    const rangeNM = endurance * cruiseSpeed;
    return {
      primary: { label: "Maximum Range", value: formatNumber(rangeNM) + " NM" },
      details: [
        { label: "Usable Fuel", value: formatNumber(usableFuel) + " gal" },
        { label: "Endurance", value: formatNumber(endurance) + " hours" },
        { label: "Reserve Fuel", value: formatNumber(fuelCapacity - usableFuel) + " gal" }
      ]
    };
  }`,
  [
    { q: "How much fuel reserve should a boat carry?", a: "The rule of thirds says one third for out, one third back, one third reserve." },
    { q: "How is boat range calculated?", a: "Range equals endurance hours multiplied by cruise speed." }
  ],
  "Usable = Capacity x (1 - Reserve%); Range = (Usable / Burn Rate) x Speed",
  ["fuel-burn-rate-calculator", "nautical-mile-converter-calculator"]
);

add(
  "wind-chill-calculator",
  "Wind Chill Calculator",
  "Calculate wind chill temperature from air temp and wind speed.",
  "Science",
  "science",
  "A",
  ["wind", "chill", "temperature", "weather"],
  [
    '{ name: "temp", label: "Air Temperature (F)", type: "number", min: -50, max: 50, defaultValue: 20 }',
    '{ name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 3, max: 100, defaultValue: 15 }',
  ],
  `(inputs) => {
    const temp = inputs.temp as number;
    const windSpeed = inputs.windSpeed as number;
    const wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(windSpeed, 0.16) + 0.4275 * temp * Math.pow(windSpeed, 0.16);
    const frostbiteMin = windSpeed > 30 && temp < 0 ? 10 : windSpeed > 15 && temp < 0 ? 30 : 0;
    return {
      primary: { label: "Wind Chill", value: formatNumber(wc) + " F" },
      details: [
        { label: "Actual Temperature", value: formatNumber(temp) + " F" },
        { label: "Wind Speed", value: formatNumber(windSpeed) + " mph" },
        { label: "Frostbite Risk (min)", value: frostbiteMin > 0 ? formatNumber(frostbiteMin) + " min" : "Low risk" }
      ]
    };
  }`,
  [
    { q: "When does wind chill apply?", a: "Wind chill applies when temperature is below 50 F and wind exceeds 3 mph." },
    { q: "At what wind chill is frostbite a risk?", a: "Frostbite can occur in 30 minutes at wind chill below minus 18 F." }
  ],
  "WC = 35.74 + 0.6215T - 35.75V^0.16 + 0.4275TV^0.16",
  ["heat-index-calculator", "dew-point-calculator"]
);

add(
  "heat-index-calculator",
  "Heat Index Calculator",
  "Calculate the heat index from temperature and humidity.",
  "Science",
  "science",
  "A",
  ["heat", "index", "humidity", "temperature"],
  [
    '{ name: "temp", label: "Air Temperature (F)", type: "number", min: 75, max: 130, defaultValue: 90 }',
    '{ name: "humidity", label: "Relative Humidity (%)", type: "number", min: 10, max: 100, defaultValue: 60 }',
  ],
  `(inputs) => {
    const temp = inputs.temp as number;
    const humidity = inputs.humidity as number;
    const hi = -42.379 + 2.04901523 * temp + 10.14333127 * humidity - 0.22475541 * temp * humidity - 0.00683783 * temp * temp - 0.05481717 * humidity * humidity + 0.00122874 * temp * temp * humidity + 0.00085282 * temp * humidity * humidity - 0.00000199 * temp * temp * humidity * humidity;
    const danger = hi >= 130 ? "Extreme Danger" : hi >= 105 ? "Danger" : hi >= 90 ? "Extreme Caution" : "Caution";
    return {
      primary: { label: "Heat Index", value: formatNumber(hi) + " F" },
      details: [
        { label: "Danger Level", value: danger },
        { label: "Air Temperature", value: formatNumber(temp) + " F" },
        { label: "Relative Humidity", value: formatNumber(humidity) + "%" }
      ]
    };
  }`,
  [
    { q: "What is the heat index?", a: "It is the perceived temperature combining heat and humidity." },
    { q: "When is heat index dangerous?", a: "A heat index above 105 F poses danger of heat exhaustion." }
  ],
  "Rothfusz regression equation for heat index",
  ["wind-chill-calculator", "dew-point-calculator"]
);

add(
  "dew-point-calculator",
  "Dew Point Calculator",
  "Calculate the dew point from temperature and humidity.",
  "Science",
  "science",
  "A",
  ["dew", "point", "humidity", "condensation"],
  [
    '{ name: "temp", label: "Air Temperature (C)", type: "number", min: -20, max: 50, defaultValue: 25 }',
    '{ name: "humidity", label: "Relative Humidity (%)", type: "number", min: 5, max: 100, defaultValue: 60 }',
  ],
  `(inputs) => {
    const temp = inputs.temp as number;
    const humidity = inputs.humidity as number;
    const a = 17.27;
    const b = 237.7;
    const gamma = (a * temp) / (b + temp) + Math.log(humidity / 100);
    const dewPoint = (b * gamma) / (a - gamma);
    const spread = temp - dewPoint;
    return {
      primary: { label: "Dew Point", value: formatNumber(dewPoint) + " C" },
      details: [
        { label: "Temperature", value: formatNumber(temp) + " C" },
        { label: "Relative Humidity", value: formatNumber(humidity) + "%" },
        { label: "Temp-Dew Spread", value: formatNumber(spread) + " C" }
      ]
    };
  }`,
  [
    { q: "What is the dew point?", a: "It is the temperature at which air becomes saturated and dew forms." },
    { q: "What dew point is comfortable?", a: "A dew point below 15 C (60 F) feels comfortable to most people." }
  ],
  "Dew Point = 237.7 x gamma / (17.27 - gamma); Magnus formula",
  ["heat-index-calculator", "wind-chill-calculator"]
);

add(
  "barometric-pressure-altitude-calculator",
  "Barometric Pressure Altitude Calculator",
  "Estimate atmospheric pressure at a given altitude.",
  "Science",
  "science",
  "A",
  ["barometric", "pressure", "altitude", "atmosphere"],
  [
    '{ name: "altitude", label: "Altitude (ft)", type: "number", min: 0, max: 60000, defaultValue: 5000 }',
    '{ name: "seaLevelPressure", label: "Sea Level Pressure (inHg)", type: "number", min: 28, max: 31, defaultValue: 29.92 }',
  ],
  `(inputs) => {
    const altitude = inputs.altitude as number;
    const seaLevelPressure = inputs.seaLevelPressure as number;
    const pressureRatio = Math.pow(1 - altitude / 145442, 5.2559);
    const pressure = seaLevelPressure * pressureRatio;
    const pressureMb = pressure * 33.8639;
    return {
      primary: { label: "Pressure at Altitude", value: formatNumber(pressure) + " inHg" },
      details: [
        { label: "Pressure in Millibars", value: formatNumber(pressureMb) + " mb" },
        { label: "Altitude", value: formatNumber(altitude) + " ft" },
        { label: "Sea Level Pressure", value: formatNumber(seaLevelPressure) + " inHg" }
      ]
    };
  }`,
  [
    { q: "How does pressure change with altitude?", a: "Pressure decreases about 1 inHg per 1000 feet near sea level." },
    { q: "What is standard sea level pressure?", a: "Standard sea level pressure is 29.92 inHg or 1013.25 mb." }
  ],
  "Pressure = Sea Level x (1 - Altitude / 145442)^5.2559",
  ["density-altitude-calculator", "dew-point-calculator"]
);

add(
  "uv-exposure-calculator",
  "UV Exposure Calculator",
  "Estimate safe sun exposure time based on UV index and skin type.",
  "Health",
  "health",
  "H",
  ["UV", "exposure", "sunburn", "skin"],
  [
    '{ name: "uvIndex", label: "UV Index", type: "number", min: 1, max: 15, defaultValue: 7 }',
    '{ name: "skinType", label: "Skin Type", type: "select", options: [{ value: "1", label: "Very Fair" }, { value: "2", label: "Fair" }, { value: "3", label: "Medium" }, { value: "4", label: "Olive" }, { value: "5", label: "Brown" }, { value: "6", label: "Dark" }], defaultValue: "2" }',
    '{ name: "spf", label: "Sunscreen SPF", type: "number", min: 0, max: 100, defaultValue: 30 }',
  ],
  `(inputs) => {
    const uvIndex = inputs.uvIndex as number;
    const skinType = inputs.skinType as number;
    const spf = inputs.spf as number;
    const baseMED = { 1: 15, 2: 25, 3: 35, 4: 45, 5: 60, 6: 90 };
    const baseMinutes = (baseMED[skinType] || 25) * 10 / uvIndex;
    const protectedMinutes = spf > 0 ? baseMinutes * spf : baseMinutes;
    const cappedProtected = Math.min(protectedMinutes, 480);
    return {
      primary: { label: "Safe Exposure (No SPF)", value: formatNumber(baseMinutes) + " min" },
      details: [
        { label: "With SPF " + spf, value: formatNumber(cappedProtected) + " min" },
        { label: "UV Index", value: formatNumber(uvIndex) },
        { label: "Skin Type", value: formatNumber(skinType) }
      ]
    };
  }`,
  [
    { q: "What UV index requires sunscreen?", a: "Apply sunscreen when the UV index is 3 or higher." },
    { q: "How does SPF extend safe exposure?", a: "SPF 30 means you can stay 30 times longer than without it." }
  ],
  "Base Minutes = Skin MED x 10 / UV Index; Protected = Base x SPF",
  ["heat-index-calculator", "wind-chill-calculator"]
);

add(
  "rainfall-intensity-calculator",
  "Rainfall Intensity Calculator",
  "Calculate rainfall rate from total amount and duration.",
  "Science",
  "science",
  "A",
  ["rainfall", "intensity", "precipitation", "rate"],
  [
    '{ name: "totalRain", label: "Total Rainfall (inches)", type: "number", min: 0.01, max: 30, defaultValue: 1.5 }',
    '{ name: "duration", label: "Duration (hours)", type: "number", min: 0.1, max: 72, defaultValue: 3 }',
  ],
  `(inputs) => {
    const totalRain = inputs.totalRain as number;
    const duration = inputs.duration as number;
    const ratePerHour = totalRain / duration;
    const rateMm = ratePerHour * 25.4;
    const category = ratePerHour >= 2 ? "Violent" : ratePerHour >= 0.3 ? "Heavy" : ratePerHour >= 0.1 ? "Moderate" : "Light";
    return {
      primary: { label: "Rainfall Rate", value: formatNumber(ratePerHour) + " in/hr" },
      details: [
        { label: "Rate in mm/hr", value: formatNumber(rateMm) + " mm/hr" },
        { label: "Intensity Category", value: category },
        { label: "Total Rainfall", value: formatNumber(totalRain) + " in" }
      ]
    };
  }`,
  [
    { q: "What is heavy rainfall?", a: "Heavy rainfall is generally above 0.3 inches per hour." },
    { q: "How is rainfall measured?", a: "Rainfall is measured in inches or millimeters of accumulated water." }
  ],
  "Rate = Total Rainfall / Duration",
  ["dew-point-calculator", "snow-load-calculator"]
);

add(
  "snow-load-calculator",
  "Snow Load Calculator",
  "Estimate the weight of snow on a roof surface.",
  "Science",
  "science",
  "A",
  ["snow", "load", "roof", "weight"],
  [
    '{ name: "roofArea", label: "Roof Area (sq ft)", type: "number", min: 100, max: 10000, defaultValue: 1500 }',
    '{ name: "snowDepth", label: "Snow Depth (inches)", type: "number", min: 1, max: 72, defaultValue: 12 }',
    '{ name: "snowType", label: "Snow Type", type: "select", options: [{ value: "1", label: "Fresh (light)" }, { value: "2", label: "Packed" }, { value: "3", label: "Wet / Heavy" }], defaultValue: "2" }',
  ],
  `(inputs) => {
    const roofArea = inputs.roofArea as number;
    const snowDepth = inputs.snowDepth as number;
    const snowType = inputs.snowType as number;
    const densityPSF = { 1: 1.25, 2: 3.0, 3: 5.2 };
    const psfPerInch = densityPSF[snowType] || 3.0;
    const loadPSF = psfPerInch * snowDepth;
    const totalWeight = loadPSF * roofArea;
    return {
      primary: { label: "Snow Load", value: formatNumber(loadPSF) + " psf" },
      details: [
        { label: "Total Roof Weight", value: formatNumber(totalWeight) + " lbs" },
        { label: "Roof Area", value: formatNumber(roofArea) + " sq ft" },
        { label: "Snow Depth", value: formatNumber(snowDepth) + " in" }
      ]
    };
  }`,
  [
    { q: "How heavy is snow on a roof?", a: "Fresh snow weighs about 1.25 psf per inch of depth." },
    { q: "When should I remove roof snow?", a: "Consider removal when snow load exceeds 20 to 25 psf." }
  ],
  "Load (psf) = Density per Inch x Snow Depth; Total = Load x Roof Area",
  ["rainfall-intensity-calculator", "wind-chill-calculator"]
);

add(
  "telescope-magnification-calculator",
  "Telescope Magnification Calculator",
  "Calculate telescope magnification from focal lengths.",
  "Science",
  "science",
  "A",
  ["telescope", "magnification", "focal", "eyepiece"],
  [
    '{ name: "focalLengthScope", label: "Telescope Focal Length (mm)", type: "number", min: 100, max: 10000, defaultValue: 1200 }',
    '{ name: "focalLengthEyepiece", label: "Eyepiece Focal Length (mm)", type: "number", min: 2, max: 60, defaultValue: 25 }',
    '{ name: "aperture", label: "Aperture (mm)", type: "number", min: 25, max: 500, defaultValue: 150 }',
  ],
  `(inputs) => {
    const focalLengthScope = inputs.focalLengthScope as number;
    const focalLengthEyepiece = inputs.focalLengthEyepiece as number;
    const aperture = inputs.aperture as number;
    const magnification = focalLengthScope / focalLengthEyepiece;
    const maxUsable = aperture * 2;
    const exitPupil = aperture / magnification;
    return {
      primary: { label: "Magnification", value: formatNumber(magnification) + "x" },
      details: [
        { label: "Max Usable Magnification", value: formatNumber(maxUsable) + "x" },
        { label: "Exit Pupil", value: formatNumber(exitPupil) + " mm" },
        { label: "Focal Ratio", value: "f/" + formatNumber(focalLengthScope / aperture) }
      ]
    };
  }`,
  [
    { q: "How is telescope magnification calculated?", a: "Divide telescope focal length by eyepiece focal length." },
    { q: "What is maximum useful magnification?", a: "Maximum useful magnification is about 2 times the aperture in mm." }
  ],
  "Magnification = Telescope Focal Length / Eyepiece Focal Length",
  ["telescope-fov-calculator", "star-magnitude-calculator"]
);

add(
  "telescope-fov-calculator",
  "Telescope FOV Calculator",
  "Calculate the field of view for a telescope and eyepiece.",
  "Science",
  "science",
  "A",
  ["telescope", "field", "view", "eyepiece"],
  [
    '{ name: "eyepieceFOV", label: "Eyepiece Apparent FOV (deg)", type: "number", min: 20, max: 120, defaultValue: 52 }',
    '{ name: "focalLengthScope", label: "Telescope Focal Length (mm)", type: "number", min: 100, max: 10000, defaultValue: 1200 }',
    '{ name: "focalLengthEyepiece", label: "Eyepiece Focal Length (mm)", type: "number", min: 2, max: 60, defaultValue: 25 }',
  ],
  `(inputs) => {
    const eyepieceFOV = inputs.eyepieceFOV as number;
    const focalLengthScope = inputs.focalLengthScope as number;
    const focalLengthEyepiece = inputs.focalLengthEyepiece as number;
    const magnification = focalLengthScope / focalLengthEyepiece;
    const trueFOV = eyepieceFOV / magnification;
    const arcminutes = trueFOV * 60;
    return {
      primary: { label: "True Field of View", value: formatNumber(trueFOV) + " degrees" },
      details: [
        { label: "True FOV in Arcminutes", value: formatNumber(arcminutes) + " arcmin" },
        { label: "Magnification", value: formatNumber(magnification) + "x" },
        { label: "Apparent FOV", value: formatNumber(eyepieceFOV) + " degrees" }
      ]
    };
  }`,
  [
    { q: "What is true field of view?", a: "True FOV is the actual sky area visible through the telescope." },
    { q: "How does magnification affect FOV?", a: "Higher magnification reduces the field of view proportionally." }
  ],
  "True FOV = Apparent FOV / Magnification",
  ["telescope-magnification-calculator", "star-magnitude-calculator"]
);

add(
  "star-magnitude-calculator",
  "Star Magnitude Calculator",
  "Convert between apparent and absolute stellar magnitudes.",
  "Science",
  "science",
  "A",
  ["star", "magnitude", "distance", "brightness"],
  [
    '{ name: "apparentMag", label: "Apparent Magnitude", type: "number", min: -30, max: 30, defaultValue: 1.5 }',
    '{ name: "distanceParsecs", label: "Distance (parsecs)", type: "number", min: 0.1, max: 100000, defaultValue: 100 }',
  ],
  `(inputs) => {
    const apparentMag = inputs.apparentMag as number;
    const distanceParsecs = inputs.distanceParsecs as number;
    const absoluteMag = apparentMag - 5 * Math.log10(distanceParsecs / 10);
    const distanceLY = distanceParsecs * 3.2616;
    const brightnessRatio = Math.pow(10, (apparentMag - absoluteMag) / -2.5);
    return {
      primary: { label: "Absolute Magnitude", value: formatNumber(absoluteMag) },
      details: [
        { label: "Apparent Magnitude", value: formatNumber(apparentMag) },
        { label: "Distance", value: formatNumber(distanceLY) + " light years" },
        { label: "Brightness Ratio", value: formatNumber(brightnessRatio) }
      ]
    };
  }`,
  [
    { q: "What is absolute magnitude?", a: "It is a star brightness measured as if it were 10 parsecs away." },
    { q: "What is a parsec?", a: "A parsec is about 3.26 light years or 3.09 x 10^13 km." }
  ],
  "M = m - 5 x log10(d / 10); distance modulus formula",
  ["telescope-magnification-calculator", "light-year-distance-calculator"]
);

add(
  "orbital-velocity-calculator",
  "Orbital Velocity Calculator",
  "Calculate orbital speed at a given altitude above Earth.",
  "Science",
  "science",
  "A",
  ["orbital", "velocity", "satellite", "space"],
  [
    '{ name: "altitude", label: "Orbital Altitude (km)", type: "number", min: 100, max: 100000, defaultValue: 400 }',
  ],
  `(inputs) => {
    const altitude = inputs.altitude as number;
    const earthRadius = 6371;
    const mu = 398600.4418;
    const r = earthRadius + altitude;
    const velocity = Math.sqrt(mu / r);
    const periodSeconds = 2 * Math.PI * r / velocity;
    const periodMinutes = periodSeconds / 60;
    return {
      primary: { label: "Orbital Velocity", value: formatNumber(velocity) + " km/s" },
      details: [
        { label: "Orbital Radius", value: formatNumber(r) + " km" },
        { label: "Orbital Period", value: formatNumber(periodMinutes) + " min" },
        { label: "Altitude", value: formatNumber(altitude) + " km" }
      ]
    };
  }`,
  [
    { q: "What is orbital velocity?", a: "It is the speed needed to maintain a stable orbit at a given altitude." },
    { q: "What is the ISS orbital speed?", a: "The ISS orbits at about 7.66 km/s at 400 km altitude." }
  ],
  "v = sqrt(GM / r); Period = 2 x pi x r / v",
  ["planetary-weight-calculator", "light-year-distance-calculator"]
);

add(
  "light-year-distance-calculator",
  "Light Year Distance Calculator",
  "Convert light years to kilometers and other distance units.",
  "Conversion",
  "conversion",
  "R",
  ["light", "year", "distance", "astronomy"],
  [
    '{ name: "lightYears", label: "Light Years", type: "number", min: 0.001, max: 100000, defaultValue: 4.24 }',
  ],
  `(inputs) => {
    const lightYears = inputs.lightYears as number;
    const km = lightYears * 9.461e12;
    const au = lightYears * 63241.1;
    const parsecs = lightYears / 3.2616;
    return {
      primary: { label: "Distance in km", value: formatNumber(km) + " km" },
      details: [
        { label: "Astronomical Units", value: formatNumber(au) + " AU" },
        { label: "Parsecs", value: formatNumber(parsecs) + " pc" },
        { label: "Light Years", value: formatNumber(lightYears) + " ly" }
      ]
    };
  }`,
  [
    { q: "How far is one light year?", a: "One light year is about 9.461 trillion kilometers." },
    { q: "What is the nearest star?", a: "Proxima Centauri is about 4.24 light years from Earth." }
  ],
  "km = Light Years x 9.461 x 10^12; AU = Light Years x 63241.1",
  ["star-magnitude-calculator", "orbital-velocity-calculator"]
);

add(
  "planetary-weight-calculator",
  "Planetary Weight Calculator",
  "Calculate your weight on other planets in the solar system.",
  "Science",
  "science",
  "A",
  ["planetary", "weight", "gravity", "planets"],
  [
    '{ name: "earthWeight", label: "Earth Weight (lbs)", type: "number", min: 1, max: 1000, defaultValue: 150 }',
    '{ name: "planet", label: "Planet", type: "select", options: [{ value: "1", label: "Mercury" }, { value: "2", label: "Venus" }, { value: "3", label: "Mars" }, { value: "4", label: "Jupiter" }, { value: "5", label: "Saturn" }, { value: "6", label: "Uranus" }, { value: "7", label: "Neptune" }, { value: "8", label: "Moon" }], defaultValue: "3" }',
  ],
  `(inputs) => {
    const earthWeight = inputs.earthWeight as number;
    const planet = inputs.planet as number;
    const gravity = { 1: 0.378, 2: 0.907, 3: 0.377, 4: 2.36, 5: 0.916, 6: 0.889, 7: 1.12, 8: 0.166 };
    const names = { 1: "Mercury", 2: "Venus", 3: "Mars", 4: "Jupiter", 5: "Saturn", 6: "Uranus", 7: "Neptune", 8: "Moon" };
    const g = gravity[planet] || 1;
    const planetName = names[planet] || "Unknown";
    const newWeight = earthWeight * g;
    const mass = earthWeight / 32.174;
    return {
      primary: { label: "Weight on " + planetName, value: formatNumber(newWeight) + " lbs" },
      details: [
        { label: "Earth Weight", value: formatNumber(earthWeight) + " lbs" },
        { label: "Surface Gravity Factor", value: formatNumber(g) },
        { label: "Your Mass", value: formatNumber(mass) + " slugs" }
      ]
    };
  }`,
  [
    { q: "Where would I weigh the most?", a: "You would weigh the most on Jupiter at 2.36 times Earth weight." },
    { q: "Does your mass change on other planets?", a: "No. Mass stays the same but weight changes with gravity." }
  ],
  "Weight on Planet = Earth Weight x Surface Gravity Factor",
  ["orbital-velocity-calculator", "light-year-distance-calculator"]
);
