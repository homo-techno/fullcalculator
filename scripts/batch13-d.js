add(
  "roche-limit-calculator",
  "Roche Limit Calculator",
  "Calculate the Roche limit distance at which a celestial body held together only by gravity will be torn apart by tidal forces from a larger body.",
  "Science",
  "science",
  "A",
  ["roche limit", "tidal disruption", "satellite breakup", "gravitational limit"],
  [
    '{ name: "primaryRadius", label: "Primary Body Radius (km)", type: "number", min: 1, max: 1000000, defaultValue: 6371 }',
    '{ name: "primaryDensity", label: "Primary Body Density (kg/m3)", type: "number", min: 100, max: 30000, defaultValue: 5514 }',
    '{ name: "secondaryDensity", label: "Secondary Body Density (kg/m3)", type: "number", min: 100, max: 30000, defaultValue: 3346 }'
  ],
  `(inputs) => {
    const R = inputs.primaryRadius as number;
    const rhoP = inputs.primaryDensity as number;
    const rhoS = inputs.secondaryDensity as number;
    const rocheRigid = R * 1.26 * Math.pow(rhoP / rhoS, 1 / 3);
    const rocheFluid = R * 2.44 * Math.pow(rhoP / rhoS, 1 / 3);
    const ratio = rhoP / rhoS;
    return {
      primary: { label: "Roche Limit (Rigid Body)", value: formatNumber(Math.round(rocheRigid)) + " km" },
      details: [
        { label: "Roche Limit (Fluid Body)", value: formatNumber(Math.round(rocheFluid)) + " km" },
        { label: "Density Ratio", value: formatNumber(Math.round(ratio * 1000) / 1000) },
        { label: "Primary Radius", value: formatNumber(R) + " km" }
      ]
    };
  }`,
  [
    { q: "What is the Roche limit?", a: "The Roche limit is the minimum distance at which a smaller body can orbit a larger one without being torn apart by tidal forces. Inside this limit, gravitational tides exceed the self-gravity holding the smaller body together." },
    { q: "Why are there rigid and fluid Roche limits?", a: "A rigid body resists deformation and can survive closer to the primary. A fluid body deforms easily and is disrupted at a greater distance. Real bodies fall somewhere between these two extremes." },
    { q: "How do planetary rings relate to the Roche limit?", a: "Planetary rings like those of Saturn exist within the Roche limit of their planet. Material inside the Roche limit cannot coalesce into a moon and instead remains as a ring of small particles." }
  ],
  `Roche Limit (rigid) = R x 1.26 x (rho_primary / rho_secondary)^(1/3)
Roche Limit (fluid) = R x 2.44 x (rho_primary / rho_secondary)^(1/3)`,
  ["orbital-velocity-calculator", "planetary-weight-calculator"]
);

add(
  "lagrange-point-calculator",
  "Lagrange Point Calculator",
  "Calculate the distances to L1, L2, and L3 Lagrange points for a two-body gravitational system such as the Sun-Earth or Earth-Moon system.",
  "Science",
  "science",
  "A",
  ["lagrange point", "L1 L2 L3", "gravitational equilibrium", "orbital mechanics"],
  [
    '{ name: "massPrimary", label: "Primary Mass (kg, e.g. Sun)", type: "number", min: 1e10, max: 1e35, defaultValue: 1.989e30 }',
    '{ name: "massSecondary", label: "Secondary Mass (kg, e.g. Earth)", type: "number", min: 1, max: 1e30, defaultValue: 5.972e24 }',
    '{ name: "distance", label: "Orbital Distance (km)", type: "number", min: 1000, max: 1e12, defaultValue: 149597870 }'
  ],
  `(inputs) => {
    const M = inputs.massPrimary as number;
    const m = inputs.massSecondary as number;
    const d = inputs.distance as number;
    const ratio = m / (3 * M);
    const hillRadius = d * Math.pow(ratio, 1 / 3);
    const L1 = d - hillRadius;
    const L2 = d + hillRadius;
    const L3 = d * (1 + 5 * m / (12 * M));
    return {
      primary: { label: "L1 Distance from Primary", value: formatNumber(Math.round(L1)) + " km" },
      details: [
        { label: "L2 Distance from Primary", value: formatNumber(Math.round(L2)) + " km" },
        { label: "L3 Distance from Primary", value: formatNumber(Math.round(L3)) + " km" },
        { label: "Hill Sphere Radius", value: formatNumber(Math.round(hillRadius)) + " km" }
      ]
    };
  }`,
  [
    { q: "What are Lagrange points?", a: "Lagrange points are five positions in space where the gravitational pull of two large bodies and the centrifugal force balance, allowing a small object to remain relatively stationary with respect to the two larger bodies." },
    { q: "Which Lagrange point is the James Webb Space Telescope at?", a: "The James Webb Space Telescope orbits the Sun-Earth L2 point, about 1.5 million km from Earth on the side away from the Sun." },
    { q: "Are Lagrange points truly stable?", a: "Only L4 and L5 are naturally stable. L1, L2, and L3 are unstable and require station-keeping maneuvers to maintain a spacecraft in their vicinity." }
  ],
  `Hill Radius = d x (m / 3M)^(1/3)
L1 = d - Hill Radius
L2 = d + Hill Radius`,
  ["orbital-velocity-calculator", "roche-limit-calculator"]
);

add(
  "tidal-force-calculator",
  "Tidal Force Calculator",
  "Calculate the differential gravitational (tidal) force exerted by a massive body on a smaller object at a given distance.",
  "Science",
  "science",
  "A",
  ["tidal force", "differential gravity", "tidal acceleration", "tidal bulge"],
  [
    '{ name: "massPrimary", label: "Primary Body Mass (kg)", type: "number", min: 1e10, max: 1e35, defaultValue: 7.342e22 }',
    '{ name: "distance", label: "Distance Between Centers (m)", type: "number", min: 1000, max: 1e15, defaultValue: 384400000 }',
    '{ name: "objectSize", label: "Size of Affected Object (m)", type: "number", min: 0.1, max: 1e8, defaultValue: 12742000 }'
  ],
  `(inputs) => {
    const M = inputs.massPrimary as number;
    const d = inputs.distance as number;
    const r = inputs.objectSize as number;
    const G = 6.674e-11;
    const tidalAccel = 2 * G * M * r / (d * d * d);
    const tidalForcePerKg = tidalAccel;
    const tidalForce100kg = tidalAccel * 100;
    return {
      primary: { label: "Tidal Acceleration", value: formatNumber(tidalAccel) + " m/s2" },
      details: [
        { label: "Tidal Force per kg", value: formatNumber(tidalForcePerKg) + " N/kg" },
        { label: "Tidal Force on 100 kg", value: formatNumber(tidalForce100kg) + " N" },
        { label: "Distance", value: formatNumber(d / 1000) + " km" }
      ]
    };
  }`,
  [
    { q: "What causes tidal forces?", a: "Tidal forces arise from the difference in gravitational pull across the extent of an object. The near side of the object is pulled more strongly than the far side, creating a stretching effect." },
    { q: "How do tidal forces affect the Earth?", a: "The Moon and Sun exert tidal forces that cause ocean tides. They also slowly transfer angular momentum, causing the Moon to recede from Earth by about 3.8 cm per year." },
    { q: "Can tidal forces destroy objects?", a: "Yes. If a body ventures inside the Roche limit, tidal forces can exceed its self-gravity and tear it apart. This is how some comets are destroyed when they pass too close to planets." }
  ],
  `Tidal Acceleration = 2GM x r / d^3
where G = 6.674 x 10^-11, M = primary mass, r = object size, d = distance`,
  ["roche-limit-calculator", "orbital-velocity-calculator"]
);

add(
  "stellar-parallax-calculator",
  "Stellar Parallax Calculator",
  "Calculate the distance to a star using its observed parallax angle, converting between parallax in arcseconds, parsecs, and light years.",
  "Science",
  "science",
  "A",
  ["stellar parallax", "parallax angle", "star distance", "astrometry"],
  [
    '{ name: "parallaxArcsec", label: "Parallax Angle (arcseconds)", type: "number", min: 0.00001, max: 1, defaultValue: 0.01 }',
  ],
  `(inputs) => {
    const p = inputs.parallaxArcsec as number;
    const distanceParsecs = 1 / p;
    const distanceLY = distanceParsecs * 3.2616;
    const distanceKm = distanceParsecs * 3.086e13;
    const distanceAU = distanceParsecs * 206265;
    return {
      primary: { label: "Distance", value: formatNumber(Math.round(distanceParsecs * 100) / 100) + " parsecs" },
      details: [
        { label: "Distance in Light Years", value: formatNumber(Math.round(distanceLY * 100) / 100) + " ly" },
        { label: "Distance in AU", value: formatNumber(Math.round(distanceAU)) + " AU" },
        { label: "Parallax Angle", value: formatNumber(p) + " arcsec" }
      ]
    };
  }`,
  [
    { q: "What is stellar parallax?", a: "Stellar parallax is the apparent shift in position of a nearby star against the background of distant stars as Earth orbits the Sun. The shift is measured as an angle in arcseconds." },
    { q: "How is one parsec defined?", a: "A parsec is the distance at which a star would have a parallax angle of exactly one arcsecond, equivalent to about 3.26 light years or 206,265 astronomical units." },
    { q: "What are the limits of parallax measurements?", a: "Ground-based telescopes can measure parallax down to about 0.01 arcseconds. The Gaia spacecraft can measure parallax as small as 0.00001 arcseconds, allowing distance measurements up to tens of thousands of parsecs." }
  ],
  `Distance (parsecs) = 1 / Parallax (arcseconds)
Distance (ly) = Distance (pc) x 3.2616`,
  ["star-magnitude-calculator", "light-year-distance-calculator"]
);

add(
  "synodic-period-calculator",
  "Synodic Period Calculator",
  "Calculate the synodic period between two orbiting bodies, giving the time between successive alignments as seen from the reference body.",
  "Science",
  "science",
  "A",
  ["synodic period", "orbital alignment", "conjunction cycle", "planet opposition"],
  [
    '{ name: "periodInner", label: "Inner Orbit Period (days)", type: "number", min: 1, max: 100000, defaultValue: 365.25 }',
    '{ name: "periodOuter", label: "Outer Orbit Period (days)", type: "number", min: 1, max: 200000, defaultValue: 687 }'
  ],
  `(inputs) => {
    const pInner = inputs.periodInner as number;
    const pOuter = inputs.periodOuter as number;
    const inner = Math.min(pInner, pOuter);
    const outer = Math.max(pInner, pOuter);
    const synodic = 1 / Math.abs(1 / inner - 1 / outer);
    const synodicYears = synodic / 365.25;
    const freqPerYear = 365.25 / synodic;
    return {
      primary: { label: "Synodic Period", value: formatNumber(Math.round(synodic * 100) / 100) + " days" },
      details: [
        { label: "Synodic Period in Years", value: formatNumber(Math.round(synodicYears * 1000) / 1000) + " years" },
        { label: "Alignments per Year", value: formatNumber(Math.round(freqPerYear * 1000) / 1000) },
        { label: "Inner Period", value: formatNumber(inner) + " days" }
      ]
    };
  }`,
  [
    { q: "What is a synodic period?", a: "A synodic period is the time it takes for a planet to return to the same position relative to another body, typically as seen from Earth. For example, the synodic period of Mars is about 780 days between oppositions." },
    { q: "How does the synodic period differ from the sidereal period?", a: "The sidereal period is the true orbital period around the Sun. The synodic period accounts for the observer also moving, so it is the interval between repeated configurations like conjunctions or oppositions." },
    { q: "Why is the synodic period important?", a: "It determines how often planetary alignments, oppositions, and optimal launch windows occur. Mars launch windows repeat roughly every 26 months because of the Earth-Mars synodic period." }
  ],
  `1 / P_synodic = |1 / P_inner - 1 / P_outer|
P_synodic in years = P_synodic (days) / 365.25`,
  ["orbital-velocity-calculator", "lagrange-point-calculator"]
);

add(
  "hill-sphere-calculator",
  "Hill Sphere Calculator",
  "Calculate the Hill sphere radius of a body orbiting a more massive primary, defining the region where the body can gravitationally retain satellites.",
  "Science",
  "science",
  "A",
  ["hill sphere", "gravitational influence", "sphere of influence", "satellite retention"],
  [
    '{ name: "semiMajorAxis", label: "Semi-Major Axis (km)", type: "number", min: 1000, max: 1e12, defaultValue: 149597870 }',
    '{ name: "massBody", label: "Orbiting Body Mass (kg)", type: "number", min: 1e10, max: 1e30, defaultValue: 5.972e24 }',
    '{ name: "massPrimary", label: "Primary Body Mass (kg)", type: "number", min: 1e15, max: 1e35, defaultValue: 1.989e30 }',
    '{ name: "eccentricity", label: "Orbital Eccentricity", type: "number", min: 0, max: 0.99, defaultValue: 0.0167 }'
  ],
  `(inputs) => {
    const a = inputs.semiMajorAxis as number;
    const m = inputs.massBody as number;
    const M = inputs.massPrimary as number;
    const e = inputs.eccentricity as number;
    const hillRadius = a * (1 - e) * Math.pow(m / (3 * M), 1 / 3);
    const hillRadiusAU = hillRadius / 149597870.7;
    const hillRadiusBodyRadii = hillRadius / 6371;
    return {
      primary: { label: "Hill Sphere Radius", value: formatNumber(Math.round(hillRadius)) + " km" },
      details: [
        { label: "Hill Sphere in AU", value: formatNumber(Math.round(hillRadiusAU * 10000) / 10000) + " AU" },
        { label: "In Earth Radii", value: formatNumber(Math.round(hillRadiusBodyRadii * 10) / 10) },
        { label: "Orbital Eccentricity", value: formatNumber(e) }
      ]
    };
  }`,
  [
    { q: "What is the Hill sphere?", a: "The Hill sphere is the region around a body where its gravity dominates over the gravitational influence of the larger body it orbits. Moons must orbit within the Hill sphere of their planet to remain captured." },
    { q: "How large is the Hill sphere of Earth?", a: "The Hill sphere of Earth extends about 1.5 million km from Earth, roughly four times the Earth-Moon distance. The Moon orbits well within this boundary." },
    { q: "Can objects orbit at the edge of the Hill sphere?", a: "In practice, stable orbits require being well inside the Hill sphere. Orbits beyond roughly one-third to one-half of the Hill sphere radius tend to be unstable due to perturbations from the primary body." }
  ],
  `Hill Radius = a x (1 - e) x (m / 3M)^(1/3)
where a = semi-major axis, e = eccentricity, m = body mass, M = primary mass`,
  ["lagrange-point-calculator", "roche-limit-calculator"]
);

add(
  "jeans-mass-calculator",
  "Jeans Mass Calculator",
  "Calculate the minimum mass a gas cloud must have to undergo gravitational collapse and form a star, based on temperature and density.",
  "Science",
  "science",
  "A",
  ["jeans mass", "gravitational collapse", "star formation", "molecular cloud"],
  [
    '{ name: "temperature", label: "Gas Temperature (K)", type: "number", min: 1, max: 100000, defaultValue: 10 }',
    '{ name: "density", label: "Gas Density (kg/m3)", type: "number", min: 1e-25, max: 1e-10, defaultValue: 1e-18 }',
    '{ name: "meanMolWeight", label: "Mean Molecular Weight (amu)", type: "number", min: 1, max: 10, defaultValue: 2.33 }'
  ],
  `(inputs) => {
    const T = inputs.temperature as number;
    const rho = inputs.density as number;
    const mu = inputs.meanMolWeight as number;
    const kB = 1.381e-23;
    const G = 6.674e-11;
    const mH = 1.673e-27;
    const cs = Math.sqrt(kB * T / (mu * mH));
    const jeansLength = cs * Math.sqrt(Math.PI / (G * rho));
    const jeansMass = (Math.PI / 6) * rho * Math.pow(jeansLength, 3);
    const solarMasses = jeansMass / 1.989e30;
    return {
      primary: { label: "Jeans Mass", value: formatNumber(Math.round(solarMasses * 100) / 100) + " solar masses" },
      details: [
        { label: "Jeans Mass (kg)", value: formatNumber(jeansMass) + " kg" },
        { label: "Jeans Length", value: formatNumber(jeansLength / 3.086e16) + " pc" },
        { label: "Sound Speed", value: formatNumber(Math.round(cs)) + " m/s" }
      ]
    };
  }`,
  [
    { q: "What is the Jeans mass?", a: "The Jeans mass is the minimum mass a cloud of gas must have so that its gravitational self-attraction overcomes the internal pressure trying to expand it. Clouds exceeding this mass can collapse to form stars." },
    { q: "What determines the Jeans mass?", a: "The Jeans mass depends on temperature, density, and composition of the gas. Colder, denser clouds have a lower Jeans mass and can collapse more easily." },
    { q: "How does this relate to star formation?", a: "Molecular clouds in galaxies are much more massive than the Jeans mass and fragment into smaller clumps during collapse. Each fragment can form an individual star or a small stellar system." }
  ],
  `Jeans Length = cs x sqrt(pi / (G x rho))
Jeans Mass = (pi / 6) x rho x Jeans_Length^3
cs = sqrt(kB x T / (mu x mH))`,
  ["stellar-parallax-calculator", "star-magnitude-calculator"]
);

add(
  "bolometric-magnitude-calculator",
  "Bolometric Magnitude Calculator",
  "Calculate the bolometric magnitude of a star from its visual magnitude and bolometric correction, giving total luminosity across all wavelengths.",
  "Science",
  "science",
  "A",
  ["bolometric magnitude", "bolometric correction", "total luminosity", "stellar brightness"],
  [
    '{ name: "visualMag", label: "Visual Magnitude", type: "number", min: -30, max: 30, defaultValue: 4.83 }',
    '{ name: "bolCorrection", label: "Bolometric Correction", type: "number", min: -10, max: 0, defaultValue: -0.07 }',
    '{ name: "distancePc", label: "Distance (parsecs)", type: "number", min: 0.001, max: 1000000, defaultValue: 10 }'
  ],
  `(inputs) => {
    const mv = inputs.visualMag as number;
    const bc = inputs.bolCorrection as number;
    const d = inputs.distancePc as number;
    const mBol = mv + bc;
    const MBol = mBol - 5 * Math.log10(d / 10);
    const luminosityRatio = Math.pow(10, (4.74 - MBol) / 2.5);
    return {
      primary: { label: "Bolometric Magnitude (apparent)", value: formatNumber(Math.round(mBol * 1000) / 1000) },
      details: [
        { label: "Absolute Bolometric Magnitude", value: formatNumber(Math.round(MBol * 1000) / 1000) },
        { label: "Luminosity (solar units)", value: formatNumber(Math.round(luminosityRatio * 100) / 100) + " L_sun" },
        { label: "Bolometric Correction", value: formatNumber(bc) }
      ]
    };
  }`,
  [
    { q: "What is bolometric magnitude?", a: "Bolometric magnitude measures the total energy output of a star across all wavelengths of light, not just the visible portion. It gives a more complete picture of a star total luminosity." },
    { q: "What is the bolometric correction?", a: "The bolometric correction is the difference between visual magnitude and bolometric magnitude. It accounts for light emitted outside the visible spectrum, such as ultraviolet and infrared radiation." },
    { q: "Why is the bolometric correction always negative or zero?", a: "By convention, the bolometric correction is defined so that bolometric magnitude is always brighter (lower number) than visual magnitude, since total flux across all wavelengths cannot be less than just the visible flux." }
  ],
  `m_bol = m_v + BC
M_bol = m_bol - 5 x log10(d / 10)
L / L_sun = 10^((4.74 - M_bol) / 2.5)`,
  ["star-magnitude-calculator", "stellar-parallax-calculator"]
);

add(
  "hohmann-transfer-calculator",
  "Hohmann Transfer Orbit Calculator",
  "Calculate the delta-v requirements and transfer time for a Hohmann transfer orbit between two circular orbits around the same central body.",
  "Science",
  "science",
  "A",
  ["hohmann transfer", "orbital maneuver", "delta-v budget", "orbit transfer"],
  [
    '{ name: "innerRadius", label: "Inner Orbit Radius (km)", type: "number", min: 100, max: 1e9, defaultValue: 6771 }',
    '{ name: "outerRadius", label: "Outer Orbit Radius (km)", type: "number", min: 200, max: 1e9, defaultValue: 42164 }',
    '{ name: "centralMass", label: "Central Body Mass (kg)", type: "number", min: 1e15, max: 1e35, defaultValue: 5.972e24 }'
  ],
  `(inputs) => {
    const r1 = inputs.innerRadius as number * 1000;
    const r2 = inputs.outerRadius as number * 1000;
    const M = inputs.centralMass as number;
    const G = 6.674e-11;
    const mu = G * M;
    const v1 = Math.sqrt(mu / r1);
    const v2 = Math.sqrt(mu / r2);
    const aTransfer = (r1 + r2) / 2;
    const vPeri = Math.sqrt(mu * (2 / r1 - 1 / aTransfer));
    const vApo = Math.sqrt(mu * (2 / r2 - 1 / aTransfer));
    const dv1 = Math.abs(vPeri - v1);
    const dv2 = Math.abs(v2 - vApo);
    const totalDv = dv1 + dv2;
    const transferTime = Math.PI * Math.sqrt(Math.pow(aTransfer, 3) / mu);
    const transferHours = transferTime / 3600;
    return {
      primary: { label: "Total Delta-V", value: formatNumber(Math.round(totalDv * 10) / 10) + " m/s" },
      details: [
        { label: "First Burn Delta-V", value: formatNumber(Math.round(dv1 * 10) / 10) + " m/s" },
        { label: "Second Burn Delta-V", value: formatNumber(Math.round(dv2 * 10) / 10) + " m/s" },
        { label: "Transfer Time", value: formatNumber(Math.round(transferHours * 100) / 100) + " hours" }
      ]
    };
  }`,
  [
    { q: "What is a Hohmann transfer orbit?", a: "A Hohmann transfer is the most fuel-efficient two-burn orbital maneuver to move between two circular orbits. It uses an elliptical transfer orbit that is tangent to both the initial and final circular orbits." },
    { q: "When is a Hohmann transfer not optimal?", a: "For very large orbit changes where the ratio of outer to inner radius exceeds about 11.94, a bi-elliptic transfer can be more efficient. For time-critical missions, higher-energy transfers are used despite greater fuel cost." },
    { q: "How long does a Hohmann transfer to geostationary orbit take?", a: "A Hohmann transfer from low Earth orbit at 400 km altitude to geostationary orbit at 35,786 km takes about 5.25 hours for the half-orbit coast phase." }
  ],
  `Delta-V1 = sqrt(mu(2/r1 - 1/a)) - sqrt(mu/r1)
Delta-V2 = sqrt(mu/r2) - sqrt(mu(2/r2 - 1/a))
Transfer Time = pi x sqrt(a^3 / mu), where a = (r1 + r2) / 2`,
  ["orbital-velocity-calculator", "lagrange-point-calculator"]
);

add(
  "gravitational-lensing-calculator",
  "Gravitational Lensing Calculator",
  "Calculate the Einstein ring radius and deflection angle for gravitational lensing caused by a massive foreground object bending light from a distant source.",
  "Science",
  "science",
  "A",
  ["gravitational lensing", "einstein ring", "light bending", "gravitational deflection"],
  [
    '{ name: "lensMass", label: "Lens Mass (solar masses)", type: "number", min: 0.01, max: 1e15, defaultValue: 1e12 }',
    '{ name: "lensDistance", label: "Distance to Lens (Mpc)", type: "number", min: 0.001, max: 10000, defaultValue: 500 }',
    '{ name: "sourceDistance", label: "Distance to Source (Mpc)", type: "number", min: 0.001, max: 20000, defaultValue: 1500 }'
  ],
  `(inputs) => {
    const Msun = inputs.lensMass as number;
    const Dl = inputs.lensDistance as number;
    const Ds = inputs.sourceDistance as number;
    const Dls = Ds - Dl;
    if (Dls <= 0) {
      return { primary: { label: "Error", value: "Source must be farther than lens" } };
    }
    const G = 6.674e-11;
    const c = 3e8;
    const Mkg = Msun * 1.989e30;
    const DlM = Dl * 3.086e22;
    const DsM = Ds * 3.086e22;
    const DlsM = Dls * 3.086e22;
    const thetaE = Math.sqrt(4 * G * Mkg * DlsM / (c * c * DlM * DsM));
    const thetaArcsec = thetaE * 206265;
    const schwarzschild = 2 * G * Mkg / (c * c);
    const deflectionAngle = 4 * G * Mkg / (c * c * DlM * thetaE);
    const deflArcsec = deflectionAngle * 206265;
    return {
      primary: { label: "Einstein Ring Radius", value: formatNumber(Math.round(thetaArcsec * 10000) / 10000) + " arcsec" },
      details: [
        { label: "Deflection Angle", value: formatNumber(Math.round(deflArcsec * 10000) / 10000) + " arcsec" },
        { label: "Schwarzschild Radius of Lens", value: formatNumber(schwarzschild / 1000) + " km" },
        { label: "Lens-Source Separation", value: formatNumber(Dls) + " Mpc" }
      ]
    };
  }`,
  [
    { q: "What is gravitational lensing?", a: "Gravitational lensing occurs when the gravity of a massive foreground object bends and magnifies light from a more distant background source, as predicted by general relativity." },
    { q: "What is an Einstein ring?", a: "An Einstein ring appears when the source, lens, and observer are perfectly aligned. The light from the source is bent equally in all directions around the lens, forming a complete ring." },
    { q: "What can gravitational lensing reveal?", a: "Gravitational lensing is used to measure the mass of galaxy clusters, detect dark matter, discover distant galaxies, and even find exoplanets through microlensing events." }
  ],
  `Einstein Ring Radius = sqrt(4GM x Dls / (c^2 x Dl x Ds))
Deflection Angle = 4GM / (c^2 x b)`,
  ["star-magnitude-calculator", "roche-limit-calculator"]
);

add(
  "cosmic-redshift-distance-calculator",
  "Cosmic Redshift Distance Calculator",
  "Estimate the comoving distance, lookback time, and recession velocity of a distant object from its observed cosmological redshift.",
  "Science",
  "science",
  "A",
  ["cosmological redshift", "comoving distance", "lookback time", "recession velocity"],
  [
    '{ name: "redshift", label: "Observed Redshift (z)", type: "number", min: 0.001, max: 20, defaultValue: 1 }',
    '{ name: "hubbleConstant", label: "Hubble Constant (km/s/Mpc)", type: "number", min: 50, max: 100, defaultValue: 70 }'
  ],
  `(inputs) => {
    const z = inputs.redshift as number;
    const H0 = inputs.hubbleConstant as number;
    const c = 299792.458;
    const dH = c / H0;
    const comovingApprox = dH * (z + z * z / (2 * (1 + z)));
    const lookbackFraction = 1 - 1 / Math.sqrt(1 + z);
    const hubbleTimeSec = 1 / (H0 / 3.086e19);
    const hubbleTimeGyr = hubbleTimeSec / (365.25 * 24 * 3600 * 1e9);
    const lookbackTime = lookbackFraction * hubbleTimeGyr * 2;
    const recessionVelocity = H0 * comovingApprox;
    return {
      primary: { label: "Comoving Distance", value: formatNumber(Math.round(comovingApprox)) + " Mpc" },
      details: [
        { label: "Lookback Time", value: formatNumber(Math.round(lookbackTime * 100) / 100) + " Gyr" },
        { label: "Recession Velocity", value: formatNumber(Math.round(recessionVelocity)) + " km/s" },
        { label: "Redshift (z)", value: formatNumber(z) }
      ]
    };
  }`,
  [
    { q: "What does cosmological redshift mean?", a: "Cosmological redshift is the stretching of light wavelengths caused by the expansion of the universe. A higher redshift means the light has traveled through more expanding space and the object is farther away." },
    { q: "Can recession velocity exceed the speed of light?", a: "Yes. Hubble law velocity can exceed the speed of light for very distant objects because it measures the rate of expansion of space itself, not the motion of objects through space. This does not violate relativity." },
    { q: "What is the highest redshift ever observed?", a: "Galaxies have been observed at redshifts above z = 13, corresponding to when the universe was only a few hundred million years old. The cosmic microwave background has a redshift of about z = 1100." }
  ],
  `Comoving Distance (approx) = c/H0 x (z + z^2 / (2(1+z)))
Recession Velocity = H0 x Comoving Distance
Lookback Time = f(z) x Hubble Time`,
  ["light-year-distance-calculator", "stellar-parallax-calculator"]
);

add(
  "airy-disk-calculator",
  "Airy Disk Calculator",
  "Calculate the angular resolution and Airy disk radius for a circular aperture, determining the diffraction limit of a telescope or camera lens.",
  "Science",
  "science",
  "A",
  ["airy disk", "diffraction limit", "angular resolution", "telescope resolving power"],
  [
    '{ name: "aperture", label: "Aperture Diameter (mm)", type: "number", min: 1, max: 20000, defaultValue: 200 }',
    '{ name: "wavelength", label: "Wavelength of Light (nm)", type: "number", min: 100, max: 10000, defaultValue: 550 }',
    '{ name: "focalLength", label: "Focal Length (mm)", type: "number", min: 10, max: 100000, defaultValue: 2000 }'
  ],
  `(inputs) => {
    const D = inputs.aperture as number / 1000;
    const lambda = inputs.wavelength as number * 1e-9;
    const focalLength = inputs.focalLength as number / 1000;
    const angularRes = 1.22 * lambda / D;
    const angularResArcsec = angularRes * 206265;
    const airyRadius = 1.22 * lambda * focalLength / D;
    const airyRadiusMicrons = airyRadius * 1e6;
    const dawesLimit = 116 / (inputs.aperture as number);
    return {
      primary: { label: "Angular Resolution", value: formatNumber(Math.round(angularResArcsec * 1000) / 1000) + " arcsec" },
      details: [
        { label: "Airy Disk Radius", value: formatNumber(Math.round(airyRadiusMicrons * 100) / 100) + " microns" },
        { label: "Dawes Limit", value: formatNumber(Math.round(dawesLimit * 100) / 100) + " arcsec" },
        { label: "f-ratio", value: "f/" + formatNumber(Math.round(focalLength / D * 10) / 10) }
      ]
    };
  }`,
  [
    { q: "What is the Airy disk?", a: "The Airy disk is the central bright spot in the diffraction pattern produced by a circular aperture. It represents the smallest point to which a perfect optical system can focus light." },
    { q: "What is the Dawes limit?", a: "The Dawes limit is an empirical formula for the angular resolution of a telescope: 116 divided by the aperture in millimeters, giving the result in arcseconds. It is slightly more optimistic than the Rayleigh criterion." },
    { q: "How does aperture affect resolution?", a: "Larger apertures produce smaller Airy disks and better angular resolution. Doubling the aperture diameter halves the minimum resolvable angle, allowing you to see finer details." }
  ],
  `Angular Resolution = 1.22 x lambda / D (radians)
Airy Disk Radius = 1.22 x lambda x f / D
Dawes Limit = 116 / D(mm) arcseconds`,
  ["telescope-magnification-calculator", "telescope-fov-calculator"]
);

add(
  "schwarzschild-radius-advanced-calculator",
  "Black Hole Properties Calculator",
  "Calculate key properties of a non-rotating black hole including Schwarzschild radius, event horizon area, Hawking temperature, and evaporation time.",
  "Science",
  "science",
  "A",
  ["black hole", "schwarzschild radius", "hawking radiation", "event horizon"],
  [
    '{ name: "mass", label: "Black Hole Mass (solar masses)", type: "number", min: 0.0001, max: 1e15, defaultValue: 10 }'
  ],
  `(inputs) => {
    const Msun = inputs.mass as number;
    const M = Msun * 1.989e30;
    const G = 6.674e-11;
    const c = 3e8;
    const hbar = 1.055e-34;
    const kB = 1.381e-23;
    const Rs = 2 * G * M / (c * c);
    const area = 4 * Math.PI * Rs * Rs;
    const hawkingTemp = hbar * c * c * c / (8 * Math.PI * G * M * kB);
    const evapTime = 5120 * Math.PI * G * G * M * M * M / (hbar * c * c * c * c);
    const evapYears = evapTime / (365.25 * 24 * 3600);
    return {
      primary: { label: "Schwarzschild Radius", value: formatNumber(Math.round(Rs * 1000) / 1000) + " m" },
      details: [
        { label: "Event Horizon Area", value: formatNumber(area) + " m2" },
        { label: "Hawking Temperature", value: formatNumber(hawkingTemp) + " K" },
        { label: "Evaporation Time", value: formatNumber(evapYears) + " years" }
      ]
    };
  }`,
  [
    { q: "What is the Schwarzschild radius?", a: "The Schwarzschild radius is the radius of the event horizon of a non-rotating black hole. Any object compressed within its Schwarzschild radius becomes a black hole from which nothing can escape." },
    { q: "What is Hawking radiation?", a: "Hawking radiation is the theoretical thermal radiation emitted by black holes due to quantum effects near the event horizon. It causes black holes to slowly lose mass and eventually evaporate." },
    { q: "How long would a solar-mass black hole take to evaporate?", a: "A black hole of one solar mass would take approximately 2 x 10^67 years to evaporate through Hawking radiation, vastly longer than the current age of the universe." }
  ],
  `Rs = 2GM / c^2
Hawking Temperature = hbar x c^3 / (8 x pi x G x M x kB)
Evaporation Time = 5120 x pi x G^2 x M^3 / (hbar x c^4)`,
  ["roche-limit-calculator", "gravitational-lensing-calculator"]
);

add(
  "spectral-class-temperature-calculator",
  "Spectral Class Temperature Calculator",
  "Estimate the surface temperature, color, and luminosity class of a star based on its spectral classification or convert a known temperature to spectral type.",
  "Science",
  "science",
  "A",
  ["spectral class", "stellar temperature", "star color", "hertzsprung-russell"],
  [
    '{ name: "spectralType", label: "Spectral Type", type: "select", options: [{ value: "1", label: "O - Blue" }, { value: "2", label: "B - Blue-White" }, { value: "3", label: "A - White" }, { value: "4", label: "F - Yellow-White" }, { value: "5", label: "G - Yellow (Sun)" }, { value: "6", label: "K - Orange" }, { value: "7", label: "M - Red" }], defaultValue: "5" }',
    '{ name: "subclass", label: "Subclass (0-9)", type: "number", min: 0, max: 9, defaultValue: 2 }'
  ],
  `(inputs) => {
    const sType = parseInt(inputs.spectralType as string);
    const sub = inputs.subclass as number;
    const tempRanges = { 1: [30000, 50000], 2: [10000, 30000], 3: [7500, 10000], 4: [6000, 7500], 5: [5200, 6000], 6: [3700, 5200], 7: [2400, 3700] };
    const names = { 1: "O", 2: "B", 3: "A", 4: "F", 5: "G", 6: "K", 7: "M" };
    const colors = { 1: "Blue", 2: "Blue-White", 3: "White", 4: "Yellow-White", 5: "Yellow", 6: "Orange", 7: "Red" };
    const range = tempRanges[sType] || [5200, 6000];
    const temp = Math.round(range[1] - (sub / 10) * (range[1] - range[0]));
    const peakWavelength = Math.round(2897771 / temp);
    const luminosityRatio = Math.pow(temp / 5778, 4);
    const spectralName = (names[sType] || "G") + sub;
    return {
      primary: { label: "Surface Temperature", value: formatNumber(temp) + " K" },
      details: [
        { label: "Spectral Type", value: spectralName },
        { label: "Star Color", value: colors[sType] || "Yellow" },
        { label: "Peak Wavelength", value: formatNumber(peakWavelength) + " nm" }
      ]
    };
  }`,
  [
    { q: "What are stellar spectral classes?", a: "Stars are classified by spectral type using the sequence O, B, A, F, G, K, M from hottest to coolest. Each type is subdivided into subclasses 0-9, with 0 being the hottest within each class." },
    { q: "What spectral class is the Sun?", a: "The Sun is a G2V star with a surface temperature of about 5,778 K. The G means it is a yellow main-sequence star and the V indicates it is on the main sequence." },
    { q: "How does spectral class relate to luminosity?", a: "Hotter spectral classes are generally more luminous. An O-type star can be millions of times more luminous than the Sun, while an M-type red dwarf may be less than one-thousandth as luminous." }
  ],
  `Temperature = interpolation within spectral class range
Peak Wavelength = 2,897,771 / Temperature (Wien law)`,
  ["star-magnitude-calculator", "bolometric-magnitude-calculator"]
);

add(
  "binary-star-mass-calculator",
  "Binary Star Mass Calculator",
  "Calculate the total and individual masses of a binary star system from the orbital period and separation using Kepler third law.",
  "Science",
  "science",
  "A",
  ["binary star", "double star", "stellar mass", "binary orbit"],
  [
    '{ name: "orbitalPeriod", label: "Orbital Period (years)", type: "number", min: 0.001, max: 10000, defaultValue: 50 }',
    '{ name: "separation", label: "Semi-Major Axis (AU)", type: "number", min: 0.01, max: 100000, defaultValue: 20 }',
    '{ name: "massRatio", label: "Mass Ratio (M2/M1)", type: "number", min: 0.01, max: 1, defaultValue: 0.5 }'
  ],
  `(inputs) => {
    const P = inputs.orbitalPeriod as number;
    const a = inputs.separation as number;
    const q = inputs.massRatio as number;
    const totalMass = Math.pow(a, 3) / Math.pow(P, 2);
    const m1 = totalMass / (1 + q);
    const m2 = totalMass * q / (1 + q);
    const barycenter = a * q / (1 + q);
    return {
      primary: { label: "Total System Mass", value: formatNumber(Math.round(totalMass * 1000) / 1000) + " solar masses" },
      details: [
        { label: "Primary Star Mass", value: formatNumber(Math.round(m1 * 1000) / 1000) + " solar masses" },
        { label: "Secondary Star Mass", value: formatNumber(Math.round(m2 * 1000) / 1000) + " solar masses" },
        { label: "Barycenter from Primary", value: formatNumber(Math.round(barycenter * 1000) / 1000) + " AU" }
      ]
    };
  }`,
  [
    { q: "How do we measure binary star masses?", a: "For visual binaries with known orbital period and separation, Kepler third law gives the total mass. Radial velocity measurements and the mass ratio allow determination of individual masses." },
    { q: "What fraction of stars are in binary systems?", a: "Roughly half of all Sun-like stars exist in binary or multiple star systems. The fraction is higher for more massive stars and lower for red dwarfs." },
    { q: "What is the mass ratio?", a: "The mass ratio q is the mass of the secondary (less massive) star divided by the mass of the primary. It ranges from 0 to 1, with 1 meaning both stars have equal mass." }
  ],
  `Total Mass (solar) = a^3 / P^2 (Kepler third law in solar units)
M1 = Total / (1 + q), M2 = Total x q / (1 + q)`,
  ["star-magnitude-calculator", "spectral-class-temperature-calculator"]
);

add(
  "exoplanet-transit-depth-calculator",
  "Exoplanet Transit Depth Calculator",
  "Calculate the expected transit depth, duration, and probability for an exoplanet transiting its host star based on planetary and stellar radii and orbital distance.",
  "Science",
  "science",
  "A",
  ["exoplanet transit", "transit depth", "transit method", "planet detection"],
  [
    '{ name: "planetRadius", label: "Planet Radius (Earth radii)", type: "number", min: 0.1, max: 50, defaultValue: 1 }',
    '{ name: "starRadius", label: "Star Radius (solar radii)", type: "number", min: 0.1, max: 100, defaultValue: 1 }',
    '{ name: "orbitalDistance", label: "Orbital Distance (AU)", type: "number", min: 0.01, max: 100, defaultValue: 1 }',
    '{ name: "orbitalPeriod", label: "Orbital Period (days)", type: "number", min: 0.1, max: 100000, defaultValue: 365 }'
  ],
  `(inputs) => {
    const Rp = inputs.planetRadius as number * 6371;
    const Rs = inputs.starRadius as number * 696340;
    const a = inputs.orbitalDistance as number * 1.496e8;
    const P = inputs.orbitalPeriod as number;
    const transitDepth = Math.pow(Rp / Rs, 2) * 100;
    const transitDuration = P / Math.PI * (Rs / a) * 24;
    const transitProb = Rs / a * 100;
    return {
      primary: { label: "Transit Depth", value: formatNumber(Math.round(transitDepth * 10000) / 10000) + "%" },
      details: [
        { label: "Transit Duration", value: formatNumber(Math.round(transitDuration * 100) / 100) + " hours" },
        { label: "Transit Probability", value: formatNumber(Math.round(transitProb * 100) / 100) + "%" },
        { label: "Planet/Star Radius Ratio", value: formatNumber(Math.round(Rp / Rs * 10000) / 10000) }
      ]
    };
  }`,
  [
    { q: "What is transit depth?", a: "Transit depth is the fractional decrease in observed starlight when a planet passes in front of its host star. It equals the square of the ratio of the planet radius to the star radius." },
    { q: "How much does Earth dim the Sun during transit?", a: "Earth would cause a transit depth of about 0.0084 percent, dimming the Sun by 84 parts per million. This is detectable by space telescopes like Kepler and TESS but very challenging from the ground." },
    { q: "What determines the transit probability?", a: "The geometric transit probability is approximately the ratio of the star radius to the orbital distance. For Earth-like planets around Sun-like stars, the probability is only about 0.47 percent." }
  ],
  `Transit Depth = (Rp / Rs)^2
Transit Duration = (P / pi) x (Rs / a)
Transit Probability = Rs / a`,
  ["stellar-parallax-calculator", "binary-star-mass-calculator"]
);

add(
  "space-travel-time-calculator",
  "Space Travel Time Calculator",
  "Estimate travel time to destinations in the solar system and beyond at various speeds, from conventional rockets to hypothetical fraction-of-light-speed propulsion.",
  "Science",
  "science",
  "A",
  ["space travel time", "interstellar travel", "space mission duration", "light speed travel"],
  [
    '{ name: "distance", label: "Distance (AU)", type: "number", min: 0.001, max: 300000, defaultValue: 1 }',
    '{ name: "speed", label: "Travel Speed (km/s)", type: "number", min: 1, max: 299792, defaultValue: 30 }'
  ],
  `(inputs) => {
    const distAU = inputs.distance as number;
    const speed = inputs.speed as number;
    const distKm = distAU * 1.496e8;
    const timeSec = distKm / speed;
    const timeHours = timeSec / 3600;
    const timeDays = timeHours / 24;
    const timeYears = timeDays / 365.25;
    const fractionC = speed / 299792.458;
    var display = "";
    if (timeYears > 1) { display = formatNumber(Math.round(timeYears * 100) / 100) + " years"; }
    else if (timeDays > 1) { display = formatNumber(Math.round(timeDays * 100) / 100) + " days"; }
    else { display = formatNumber(Math.round(timeHours * 100) / 100) + " hours"; }
    return {
      primary: { label: "Travel Time", value: display },
      details: [
        { label: "Distance", value: formatNumber(Math.round(distKm)) + " km" },
        { label: "Speed as Fraction of c", value: formatNumber(Math.round(fractionC * 100000) / 100000) + " c" },
        { label: "Travel Time (days)", value: formatNumber(Math.round(timeDays * 100) / 100) + " days" }
      ]
    };
  }`,
  [
    { q: "How long would it take to reach Mars?", a: "At typical interplanetary transfer speeds of around 30 km/s, Mars at closest approach (about 0.37 AU) would take roughly 7 months via a Hohmann transfer orbit." },
    { q: "Could we reach another star in a human lifetime?", a: "Alpha Centauri is about 4.37 light years away. At 10 percent of light speed, the trip would take about 44 years. Current spacecraft travel far slower, making interstellar travel impractical with existing technology." },
    { q: "What is the fastest spacecraft ever launched?", a: "The Parker Solar Probe reached speeds exceeding 190 km/s relative to the Sun. At that speed, reaching Alpha Centauri would still take over 6,000 years." }
  ],
  `Travel Time = Distance / Speed
Distance (km) = Distance (AU) x 1.496 x 10^8
Fraction of c = Speed / 299,792.458`,
  ["hohmann-transfer-calculator", "orbital-velocity-calculator"]
);

add(
  "atmospheric-scale-height-calculator",
  "Atmospheric Scale Height Calculator",
  "Calculate how atmospheric pressure decreases with altitude using the barometric formula and scale height for any planetary atmosphere.",
  "Science",
  "science",
  "A",
  ["scale height", "atmospheric pressure altitude", "barometric formula", "atmospheric density"],
  [
    '{ name: "altitude", label: "Altitude (km)", type: "number", min: 0, max: 500, defaultValue: 10 }',
    '{ name: "surfacePressure", label: "Surface Pressure (atm)", type: "number", min: 0.001, max: 1000, defaultValue: 1 }',
    '{ name: "surfaceTemp", label: "Surface Temperature (K)", type: "number", min: 50, max: 2000, defaultValue: 288 }',
    '{ name: "meanMolWeight", label: "Mean Molecular Weight (g/mol)", type: "number", min: 1, max: 100, defaultValue: 28.97 }',
    '{ name: "surfaceGravity", label: "Surface Gravity (m/s2)", type: "number", min: 0.1, max: 100, defaultValue: 9.81 }'
  ],
  `(inputs) => {
    const h = inputs.altitude as number * 1000;
    const P0 = inputs.surfacePressure as number;
    const T = inputs.surfaceTemp as number;
    const M = inputs.meanMolWeight as number / 1000;
    const g = inputs.surfaceGravity as number;
    const R = 8.314;
    const H = R * T / (M * g);
    const pressure = P0 * Math.exp(-h / H);
    const densityRatio = Math.exp(-h / H);
    return {
      primary: { label: "Pressure at Altitude", value: formatNumber(Math.round(pressure * 100000) / 100000) + " atm" },
      details: [
        { label: "Scale Height", value: formatNumber(Math.round(H / 100) / 10) + " km" },
        { label: "Density Ratio", value: formatNumber(Math.round(densityRatio * 100000) / 100000) },
        { label: "Pressure (Pa)", value: formatNumber(Math.round(pressure * 101325 * 100) / 100) + " Pa" }
      ]
    };
  }`,
  [
    { q: "What is atmospheric scale height?", a: "The scale height is the altitude increase needed for atmospheric pressure to decrease by a factor of e (about 2.718). For Earth, the scale height is approximately 8.5 km." },
    { q: "How does pressure change with altitude on Earth?", a: "At sea level pressure of 1 atm, pressure drops to about 0.37 atm at one scale height (8.5 km), 0.14 atm at two scale heights, and so on exponentially." },
    { q: "Do other planets have different scale heights?", a: "Yes. Mars has a scale height of about 11 km despite lower gravity because of its thin CO2 atmosphere. Venus has a scale height of about 15 km. Jupiter has about 27 km." }
  ],
  `Scale Height H = RT / (Mg)
Pressure = P0 x exp(-h / H)
where R = 8.314 J/(mol K), M = molar mass, g = gravity`,
  ["orbital-velocity-calculator", "planetary-weight-calculator"]
);

add(
  "solar-luminosity-calculator",
  "Solar Panel in Space Calculator",
  "Calculate the solar radiation intensity and power output of a solar panel at any distance from the Sun, accounting for the inverse square law.",
  "Science",
  "science",
  "A",
  ["solar intensity", "inverse square law", "solar constant", "space solar power"],
  [
    '{ name: "distanceAU", label: "Distance from Sun (AU)", type: "number", min: 0.1, max: 100, defaultValue: 1 }',
    '{ name: "panelArea", label: "Solar Panel Area (m2)", type: "number", min: 0.01, max: 1000, defaultValue: 10 }',
    '{ name: "efficiency", label: "Panel Efficiency (%)", type: "number", min: 1, max: 50, defaultValue: 20 }'
  ],
  `(inputs) => {
    const d = inputs.distanceAU as number;
    const area = inputs.panelArea as number;
    const eff = inputs.efficiency as number / 100;
    const solarConstant = 1361;
    const intensity = solarConstant / (d * d);
    const powerTotal = intensity * area;
    const powerElectric = powerTotal * eff;
    return {
      primary: { label: "Solar Intensity", value: formatNumber(Math.round(intensity * 100) / 100) + " W/m2" },
      details: [
        { label: "Total Solar Power on Panel", value: formatNumber(Math.round(powerTotal * 100) / 100) + " W" },
        { label: "Electrical Output", value: formatNumber(Math.round(powerElectric * 100) / 100) + " W" },
        { label: "Intensity vs Earth", value: formatNumber(Math.round(1 / (d * d) * 10000) / 100) + "%" }
      ]
    };
  }`,
  [
    { q: "What is the solar constant?", a: "The solar constant is approximately 1,361 W/m2, the average solar radiation intensity at Earth distance (1 AU) from the Sun." },
    { q: "How does solar intensity change with distance?", a: "Solar intensity follows the inverse square law. At 2 AU, intensity is only one-quarter of what it is at 1 AU. At Jupiter (5.2 AU), it is only about 3.7 percent of Earth levels." },
    { q: "Can solar panels work in the outer solar system?", a: "Solar panels become impractical beyond Jupiter due to low light levels. The Juno spacecraft at Jupiter uses very large panels, while missions to Saturn and beyond typically rely on nuclear power sources." }
  ],
  `Solar Intensity = 1361 / d^2 (W/m2)
Power = Intensity x Panel Area x Efficiency`,
  ["space-travel-time-calculator", "hohmann-transfer-calculator"]
);

add(
  "gravitational-wave-strain-calculator",
  "Gravitational Wave Strain Calculator",
  "Estimate the gravitational wave strain amplitude from a binary system based on masses, orbital frequency, and distance to the source.",
  "Science",
  "science",
  "A",
  ["gravitational wave", "strain amplitude", "LIGO", "binary merger"],
  [
    '{ name: "mass1", label: "Mass 1 (solar masses)", type: "number", min: 0.1, max: 1000, defaultValue: 30 }',
    '{ name: "mass2", label: "Mass 2 (solar masses)", type: "number", min: 0.1, max: 1000, defaultValue: 30 }',
    '{ name: "frequency", label: "GW Frequency (Hz)", type: "number", min: 0.001, max: 10000, defaultValue: 100 }',
    '{ name: "distanceMpc", label: "Distance (Mpc)", type: "number", min: 0.01, max: 10000, defaultValue: 400 }'
  ],
  `(inputs) => {
    const m1 = inputs.mass1 as number * 1.989e30;
    const m2 = inputs.mass2 as number * 1.989e30;
    const f = inputs.frequency as number;
    const D = inputs.distanceMpc as number * 3.086e22;
    const G = 6.674e-11;
    const c = 3e8;
    const chirpMass = Math.pow(m1 * m2, 3 / 5) / Math.pow(m1 + m2, 1 / 5);
    const chirpSolar = chirpMass / 1.989e30;
    const strain = (4 / D) * Math.pow(G * chirpMass / (c * c), 5 / 3) * Math.pow(Math.PI * f / c, 2 / 3);
    const orbFreq = f / 2;
    return {
      primary: { label: "Strain Amplitude (h)", value: formatNumber(strain) },
      details: [
        { label: "Chirp Mass", value: formatNumber(Math.round(chirpSolar * 100) / 100) + " solar masses" },
        { label: "Orbital Frequency", value: formatNumber(orbFreq) + " Hz" },
        { label: "Distance", value: formatNumber(inputs.distanceMpc as number) + " Mpc" }
      ]
    };
  }`,
  [
    { q: "What is gravitational wave strain?", a: "Strain is the dimensionless amplitude of a gravitational wave, measuring the fractional change in distance between two points as the wave passes. LIGO detects strains as small as 10^-21." },
    { q: "What is chirp mass?", a: "Chirp mass is a specific combination of the two component masses that determines the gravitational wave amplitude and frequency evolution of a binary system. It is the most accurately measured parameter in a detection." },
    { q: "What generates detectable gravitational waves?", a: "The strongest sources are merging compact binaries: pairs of black holes, neutron stars, or mixed systems. The first detection by LIGO in 2015 was from two black holes of about 30 solar masses each merging at about 400 Mpc distance." }
  ],
  `h = (4/D) x (G x M_chirp / c^2)^(5/3) x (pi x f / c)^(2/3)
Chirp Mass = (m1 x m2)^(3/5) / (m1 + m2)^(1/5)`,
  ["schwarzschild-radius-advanced-calculator", "binary-star-mass-calculator"]
);

add(
  "orbital-decay-calculator",
  "Orbital Decay Calculator",
  "Calculate the rate of orbital decay for a satellite in low Earth orbit due to atmospheric drag, estimating the remaining orbital lifetime.",
  "Science",
  "science",
  "A",
  ["orbital decay", "satellite lifetime", "atmospheric drag", "orbit degradation"],
  [
    '{ name: "altitude", label: "Orbital Altitude (km)", type: "number", min: 100, max: 2000, defaultValue: 400 }',
    '{ name: "mass", label: "Satellite Mass (kg)", type: "number", min: 0.1, max: 100000, defaultValue: 1000 }',
    '{ name: "area", label: "Cross-Section Area (m2)", type: "number", min: 0.01, max: 1000, defaultValue: 10 }',
    '{ name: "dragCoeff", label: "Drag Coefficient", type: "number", min: 1, max: 4, defaultValue: 2.2 }'
  ],
  `(inputs) => {
    const h = inputs.altitude as number;
    const m = inputs.mass as number;
    const A = inputs.area as number;
    const Cd = inputs.dragCoeff as number;
    const rho0 = 1.225;
    const H = 8500;
    const rho = rho0 * Math.exp(-(h * 1000) / H);
    const earthRadius = 6371;
    const r = (earthRadius + h) * 1000;
    const mu = 3.986e14;
    const v = Math.sqrt(mu / r);
    const ballisticCoeff = m / (Cd * A);
    const decayRate = -0.5 * rho * v * v * Cd * A / m;
    const periodSec = 2 * Math.PI * r / v;
    const decayPerOrbit = Math.abs(decayRate) * periodSec;
    const roughLifeDays = (h * 1000) / (decayPerOrbit > 0 ? decayPerOrbit : 0.001) / 86400 * periodSec;
    var lifeDisplay = "";
    if (roughLifeDays > 365) { lifeDisplay = formatNumber(Math.round(roughLifeDays / 365 * 10) / 10) + " years"; }
    else { lifeDisplay = formatNumber(Math.round(roughLifeDays)) + " days"; }
    return {
      primary: { label: "Ballistic Coefficient", value: formatNumber(Math.round(ballisticCoeff * 10) / 10) + " kg/m2" },
      details: [
        { label: "Atmospheric Density", value: formatNumber(rho) + " kg/m3" },
        { label: "Orbital Velocity", value: formatNumber(Math.round(v / 1000 * 100) / 100) + " km/s" },
        { label: "Estimated Lifetime", value: lifeDisplay }
      ]
    };
  }`,
  [
    { q: "What causes orbital decay?", a: "Low Earth orbit satellites experience drag from the thin upper atmosphere. This drag removes kinetic energy, causing the orbit to gradually lower until the satellite reenters the atmosphere." },
    { q: "How does altitude affect orbital lifetime?", a: "Atmospheric density drops exponentially with altitude. A satellite at 200 km may last only days, while at 600 km it can last decades. Above about 1000 km, decay takes centuries." },
    { q: "What is the ballistic coefficient?", a: "The ballistic coefficient is the ratio of satellite mass to the product of drag coefficient and cross-sectional area. Higher values mean the satellite is less affected by drag and decays more slowly." }
  ],
  `Ballistic Coefficient = m / (Cd x A)
Atmospheric Density = rho0 x exp(-h / H)
Drag Deceleration = 0.5 x rho x v^2 x Cd x A / m`,
  ["orbital-velocity-calculator", "hohmann-transfer-calculator"]
);

add(
  "planet-surface-gravity-calculator",
  "Planet Surface Gravity Calculator",
  "Calculate the surface gravity of a celestial body from its mass and radius, comparing it to Earth gravity and calculating free-fall acceleration.",
  "Science",
  "science",
  "A",
  ["surface gravity", "gravitational acceleration", "planet gravity", "g force planet"],
  [
    '{ name: "mass", label: "Body Mass (Earth masses)", type: "number", min: 0.0001, max: 100000, defaultValue: 1 }',
    '{ name: "radius", label: "Body Radius (Earth radii)", type: "number", min: 0.01, max: 1000, defaultValue: 1 }'
  ],
  `(inputs) => {
    const massEarth = inputs.mass as number;
    const radiusEarth = inputs.radius as number;
    const gSurface = 9.81 * massEarth / (radiusEarth * radiusEarth);
    const gRatio = gSurface / 9.81;
    const escVel = 11.186 * Math.sqrt(massEarth / radiusEarth);
    const freeFallHeight = 10;
    const fallTime = Math.sqrt(2 * freeFallHeight / gSurface);
    return {
      primary: { label: "Surface Gravity", value: formatNumber(Math.round(gSurface * 1000) / 1000) + " m/s2" },
      details: [
        { label: "Relative to Earth", value: formatNumber(Math.round(gRatio * 1000) / 1000) + " g" },
        { label: "Escape Velocity", value: formatNumber(Math.round(escVel * 100) / 100) + " km/s" },
        { label: "Free-Fall Time (10m)", value: formatNumber(Math.round(fallTime * 1000) / 1000) + " sec" }
      ]
    };
  }`,
  [
    { q: "How is surface gravity calculated?", a: "Surface gravity is proportional to mass and inversely proportional to the square of the radius. A planet twice Earth mass but the same radius would have twice the surface gravity." },
    { q: "Which planet has the strongest surface gravity?", a: "Jupiter has the strongest surface gravity in our solar system at about 2.53 g. Among rocky bodies, Earth has the highest at 1 g, followed closely by Venus at 0.9 g." },
    { q: "How does surface gravity affect human activity?", a: "Humans can adapt to moderate gravity changes, but prolonged exposure to very different gravity levels affects bone density, muscle mass, and cardiovascular function. Long-duration space missions study these effects." }
  ],
  `g = G x M / R^2 = 9.81 x (M/M_Earth) / (R/R_Earth)^2
Escape Velocity = 11.186 x sqrt(M/M_Earth / R/R_Earth) km/s`,
  ["planetary-weight-calculator", "atmospheric-scale-height-calculator"]
);

add(
  "time-dilation-calculator",
  "Relativistic Time Dilation Calculator",
  "Calculate the time dilation effects from special and gravitational relativity for objects traveling at high speeds or near massive bodies.",
  "Science",
  "science",
  "A",
  ["time dilation", "special relativity", "lorentz factor", "twin paradox"],
  [
    '{ name: "velocity", label: "Travel Velocity (% of c)", type: "number", min: 0.01, max: 99.9999, defaultValue: 90 }',
    '{ name: "properTime", label: "Proper Time (years)", type: "number", min: 0.01, max: 10000, defaultValue: 10 }'
  ],
  `(inputs) => {
    const vPercent = inputs.velocity as number;
    const tau = inputs.properTime as number;
    const beta = vPercent / 100;
    const gamma = 1 / Math.sqrt(1 - beta * beta);
    const earthTime = tau * gamma;
    const lengthContract = 1 / gamma;
    const distanceLY = beta * earthTime;
    return {
      primary: { label: "Earth Time Elapsed", value: formatNumber(Math.round(earthTime * 1000) / 1000) + " years" },
      details: [
        { label: "Lorentz Factor", value: formatNumber(Math.round(gamma * 10000) / 10000) },
        { label: "Length Contraction", value: formatNumber(Math.round(lengthContract * 10000) / 10000) },
        { label: "Distance Traveled", value: formatNumber(Math.round(distanceLY * 100) / 100) + " light years" }
      ]
    };
  }`,
  [
    { q: "What is time dilation?", a: "Time dilation is the effect where time passes more slowly for an object moving at high speed relative to a stationary observer. At 90 percent of light speed, 10 years of traveler time corresponds to about 22.9 years on Earth." },
    { q: "Has time dilation been proven?", a: "Yes. Time dilation has been confirmed by many experiments, including muon decay observations, atomic clocks on aircraft, and GPS satellites which must account for both velocity and gravitational time dilation." },
    { q: "What is the twin paradox?", a: "The twin paradox describes how one twin traveling at high speed would age less than the twin who stayed on Earth. It is not actually a paradox since the traveling twin experiences acceleration, breaking the symmetry." }
  ],
  `Lorentz Factor: gamma = 1 / sqrt(1 - v^2/c^2)
Earth Time = Proper Time x gamma
Length Contraction = 1 / gamma`,
  ["space-travel-time-calculator", "cosmic-redshift-distance-calculator"]
);

add(
  "chandrasekhar-limit-calculator",
  "Chandrasekhar Limit Calculator",
  "Calculate the maximum mass of a stable white dwarf star based on composition, and determine whether a remnant will become a white dwarf, neutron star, or black hole.",
  "Science",
  "science",
  "A",
  ["chandrasekhar limit", "white dwarf mass", "stellar remnant", "electron degeneracy"],
  [
    '{ name: "remnantMass", label: "Stellar Remnant Mass (solar masses)", type: "number", min: 0.1, max: 100, defaultValue: 1.2 }',
    '{ name: "electronFraction", label: "Electron Fraction (Ye)", type: "number", min: 0.3, max: 0.6, defaultValue: 0.5 }'
  ],
  `(inputs) => {
    const mass = inputs.remnantMass as number;
    const Ye = inputs.electronFraction as number;
    const chandraLimit = 1.44 * Math.pow(Ye / 0.5, 2);
    const tolmanLimit = 2.16;
    var remnantType = "";
    if (mass < chandraLimit) { remnantType = "White Dwarf"; }
    else if (mass < tolmanLimit) { remnantType = "Neutron Star"; }
    else { remnantType = "Black Hole"; }
    const radius = mass < chandraLimit ? 0.01 * Math.pow(chandraLimit / mass, 1 / 3) : (mass < tolmanLimit ? 10 / 696340 : 0);
    const radiusKm = radius * 696340;
    return {
      primary: { label: "Remnant Type", value: remnantType },
      details: [
        { label: "Chandrasekhar Limit", value: formatNumber(Math.round(chandraLimit * 1000) / 1000) + " solar masses" },
        { label: "Remnant Mass", value: formatNumber(mass) + " solar masses" },
        { label: "Estimated Radius", value: formatNumber(Math.round(radiusKm)) + " km" }
      ]
    };
  }`,
  [
    { q: "What is the Chandrasekhar limit?", a: "The Chandrasekhar limit is approximately 1.44 solar masses, the maximum mass a white dwarf can have before electron degeneracy pressure can no longer support it against gravitational collapse." },
    { q: "What happens above the Chandrasekhar limit?", a: "A remnant above the Chandrasekhar limit but below about 2-3 solar masses becomes a neutron star, supported by neutron degeneracy pressure. Above that, it collapses into a black hole." },
    { q: "Why is the electron fraction important?", a: "The electron fraction Ye determines the number of electrons per baryon. The Chandrasekhar limit scales as Ye squared, so composition affects the exact mass threshold." }
  ],
  `Chandrasekhar Limit = 1.44 x (Ye / 0.5)^2 solar masses
White Dwarf: M < Chandrasekhar Limit
Neutron Star: Chandrasekhar Limit < M < ~2.16 solar masses
Black Hole: M > ~2.16 solar masses`,
  ["schwarzschild-radius-advanced-calculator", "binary-star-mass-calculator"]
);

add(
  "keplers-equation-solver",
  "Kepler Equation Solver",
  "Solve Kepler equation to find the position of an orbiting body at any time, converting mean anomaly to true anomaly via eccentric anomaly.",
  "Science",
  "science",
  "A",
  ["kepler equation", "mean anomaly", "eccentric anomaly", "true anomaly", "orbital position"],
  [
    '{ name: "meanAnomaly", label: "Mean Anomaly (degrees)", type: "number", min: 0, max: 360, defaultValue: 90 }',
    '{ name: "eccentricity", label: "Orbital Eccentricity", type: "number", min: 0, max: 0.99, defaultValue: 0.2 }',
    '{ name: "semiMajorAxis", label: "Semi-Major Axis (AU)", type: "number", min: 0.01, max: 100000, defaultValue: 1 }'
  ],
  `(inputs) => {
    const Mdeg = inputs.meanAnomaly as number;
    const e = inputs.eccentricity as number;
    const a = inputs.semiMajorAxis as number;
    const Mrad = Mdeg * Math.PI / 180;
    var E = Mrad;
    for (var i = 0; i < 100; i++) {
      var dE = (E - e * Math.sin(E) - Mrad) / (1 - e * Math.cos(E));
      E = E - dE;
      if (Math.abs(dE) < 1e-12) break;
    }
    var Edeg = E * 180 / Math.PI;
    var nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
    var nuDeg = nu * 180 / Math.PI;
    if (nuDeg < 0) nuDeg += 360;
    var r = a * (1 - e * Math.cos(E));
    return {
      primary: { label: "True Anomaly", value: formatNumber(Math.round(nuDeg * 1000) / 1000) + " degrees" },
      details: [
        { label: "Eccentric Anomaly", value: formatNumber(Math.round(Edeg * 1000) / 1000) + " degrees" },
        { label: "Orbital Radius", value: formatNumber(Math.round(r * 10000) / 10000) + " AU" },
        { label: "Mean Anomaly", value: formatNumber(Mdeg) + " degrees" }
      ]
    };
  }`,
  [
    { q: "What is Kepler equation?", a: "Kepler equation relates the mean anomaly M to the eccentric anomaly E through M = E - e sin(E). It must be solved iteratively because E cannot be expressed as a simple function of M." },
    { q: "What is the true anomaly?", a: "The true anomaly is the actual angular position of the orbiting body measured from the closest approach point (periapsis). It describes where the body is in its orbit at a given time." },
    { q: "Why does eccentricity matter?", a: "For circular orbits (e = 0) the true anomaly equals the mean anomaly. For highly elliptical orbits, the body spends more time near apoapsis and moves quickly through periapsis, making the anomalies very different." }
  ],
  `M = E - e sin(E) (Kepler equation, solve iteratively for E)
True Anomaly: nu = 2 x atan2(sqrt(1+e) x sin(E/2), sqrt(1-e) x cos(E/2))
Radius = a x (1 - e x cos(E))`,
  ["synodic-period-calculator", "hohmann-transfer-calculator"]
);
