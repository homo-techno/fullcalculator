add(
  "exposure-triangle-calculator",
  "Exposure Triangle Calculator",
  "Calculate the relationship between aperture, shutter speed, and ISO to achieve correct exposure for any lighting scenario.",
  "Science",
  "science",
  "A",
  ["exposure triangle", "photography exposure", "aperture shutter speed ISO", "camera exposure calculator"],
  [
    '{ name: "aperture", label: "Aperture (f-stop)", type: "number", min: 1, max: 64, defaultValue: 5.6 }',
    '{ name: "shutterSpeed", label: "Shutter Speed (1/x sec)", type: "number", min: 1, max: 8000, defaultValue: 125 }',
    '{ name: "iso", label: "ISO", type: "number", min: 50, max: 102400, defaultValue: 100 }',
    '{ name: "targetEv", label: "Target EV (Exposure Value)", type: "number", min: -6, max: 20, defaultValue: 12 }'
  ],
  `(inputs) => {
    const aperture = inputs.aperture as number;
    const shutter = inputs.shutterSpeed as number;
    const iso = inputs.iso as number;
    const targetEv = inputs.targetEv as number;
    const ev = Math.log2(aperture * aperture * shutter) - Math.log2(iso / 100);
    const evRounded = Math.round(ev * 100) / 100;
    const diff = evRounded - targetEv;
    const stopsOff = Math.round(diff * 10) / 10;
    const suggestion = diff > 0.5 ? "Overexposed — increase shutter speed or close aperture" : diff < -0.5 ? "Underexposed — decrease shutter speed or open aperture" : "Exposure is within acceptable range";
    return {
      primary: { label: "Current EV", value: formatNumber(evRounded) },
      details: [
        { label: "Target EV", value: formatNumber(targetEv) },
        { label: "Stops Off Target", value: (stopsOff > 0 ? "+" : "") + formatNumber(stopsOff) },
        { label: "Assessment", value: suggestion }
      ]
    };
  }`,
  [
    { q: "What is the exposure triangle?", a: "The exposure triangle describes the relationship between aperture, shutter speed, and ISO. Changing one setting requires adjusting another to maintain the same exposure." },
    { q: "What EV value represents daylight?", a: "Bright daylight is typically around EV 14-15, overcast days around EV 12, and indoor lighting around EV 5-8." },
    { q: "How does ISO affect image quality?", a: "Higher ISO values increase sensor sensitivity but also introduce more digital noise. Use the lowest ISO that still allows proper exposure." }
  ],
  `EV = log2(aperture^2 x shutter_speed) - log2(ISO / 100)
Stops Off = Current EV - Target EV`,
  ["depth-of-field-calculator", "camera-sensor-crop-factor-calculator"]
);

add(
  "camera-sensor-crop-factor-calculator",
  "Camera Sensor Crop Factor Calculator",
  "Calculate equivalent focal length and field of view based on your camera sensor size and crop factor.",
  "Science",
  "science",
  "A",
  ["crop factor", "sensor crop", "equivalent focal length", "camera sensor size", "APS-C crop factor"],
  [
    '{ name: "focalLength", label: "Lens Focal Length (mm)", type: "number", min: 1, max: 2000, defaultValue: 50 }',
    '{ name: "sensorType", label: "Sensor Type", type: "select", options: [{ value: "1", label: "Full Frame (1.0x)" }, { value: "2", label: "APS-C Canon (1.6x)" }, { value: "3", label: "APS-C Nikon/Sony (1.5x)" }, { value: "4", label: "Micro Four Thirds (2.0x)" }, { value: "5", label: "1-inch (2.7x)" }], defaultValue: "3" }',
    '{ name: "aperture", label: "Lens Aperture (f-stop)", type: "number", min: 0.7, max: 64, defaultValue: 1.8 }'
  ],
  `(inputs) => {
    const fl = inputs.focalLength as number;
    const sensorType = parseInt(inputs.sensorType as string);
    const aperture = inputs.aperture as number;
    const cropFactors = [0, 1.0, 1.6, 1.5, 2.0, 2.7];
    const crop = cropFactors[sensorType];
    const eqFocal = Math.round(fl * crop * 10) / 10;
    const eqAperture = Math.round(aperture * crop * 10) / 10;
    const fovFull = 2 * Math.atan(36 / (2 * fl)) * (180 / Math.PI);
    const fovCropped = 2 * Math.atan(36 / (2 * eqFocal)) * (180 / Math.PI);
    return {
      primary: { label: "Equivalent Focal Length", value: formatNumber(eqFocal) + " mm" },
      details: [
        { label: "Crop Factor", value: formatNumber(crop) + "x" },
        { label: "Equivalent Aperture (DOF)", value: "f/" + formatNumber(eqAperture) },
        { label: "Field of View (Full Frame)", value: formatNumber(Math.round(fovFull * 10) / 10) + "°" },
        { label: "Field of View (Cropped)", value: formatNumber(Math.round(fovCropped * 10) / 10) + "°" }
      ]
    };
  }`,
  [
    { q: "What is crop factor?", a: "Crop factor is the ratio of a full frame sensor diagonal to your camera sensor diagonal. It multiplies the effective focal length of any lens mounted on that camera." },
    { q: "Does crop factor affect aperture?", a: "Crop factor does not change the actual light-gathering ability of a lens, but it does affect the equivalent depth of field. A 50mm f/1.8 on APS-C gives DOF similar to a 75mm f/2.7 on full frame." },
    { q: "Is a higher crop factor better or worse?", a: "Neither. A higher crop factor gives more reach (useful for wildlife and sports) but a narrower field of view (disadvantage for landscapes and architecture)." }
  ],
  `Equivalent Focal Length = Actual Focal Length x Crop Factor
Equivalent Aperture (DOF) = Actual Aperture x Crop Factor
Field of View = 2 x atan(sensor_width / (2 x focal_length))`,
  ["depth-of-field-calculator", "lens-focal-length-calculator"]
);

add(
  "hyperfocal-distance-calculator",
  "Hyperfocal Distance Calculator",
  "Calculate the hyperfocal distance for maximum depth of field in landscape and street photography.",
  "Science",
  "science",
  "A",
  ["hyperfocal distance", "landscape focus", "maximum depth of field", "infinity focus"],
  [
    '{ name: "focalLength", label: "Focal Length (mm)", type: "number", min: 1, max: 1200, defaultValue: 35 }',
    '{ name: "aperture", label: "Aperture (f-stop)", type: "number", min: 1, max: 64, defaultValue: 11 }',
    '{ name: "sensorType", label: "Sensor Type", type: "select", options: [{ value: "1", label: "Full Frame" }, { value: "2", label: "APS-C" }, { value: "3", label: "Micro Four Thirds" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const fl = inputs.focalLength as number;
    const ap = inputs.aperture as number;
    const sensorType = parseInt(inputs.sensorType as string);
    const cocValues = [0, 0.03, 0.02, 0.015];
    const coc = cocValues[sensorType];
    const hyperfocalMm = (fl * fl) / (ap * coc) + fl;
    const hyperfocalM = Math.round(hyperfocalMm / 1000 * 100) / 100;
    const nearLimitM = Math.round(hyperfocalM / 2 * 100) / 100;
    const hyperfocalFt = Math.round(hyperfocalM * 3.281 * 100) / 100;
    return {
      primary: { label: "Hyperfocal Distance", value: formatNumber(hyperfocalM) + " m" },
      details: [
        { label: "Hyperfocal Distance (ft)", value: formatNumber(hyperfocalFt) + " ft" },
        { label: "Near Sharp Limit", value: formatNumber(nearLimitM) + " m" },
        { label: "Far Sharp Limit", value: "Infinity" },
        { label: "Circle of Confusion", value: formatNumber(coc) + " mm" }
      ]
    };
  }`,
  [
    { q: "What is hyperfocal distance?", a: "Hyperfocal distance is the closest focusing distance at which everything from half that distance to infinity appears acceptably sharp. It maximizes depth of field." },
    { q: "When should I use hyperfocal distance?", a: "Hyperfocal focusing is ideal for landscape, street, and architectural photography where you want maximum sharpness from foreground to background." },
    { q: "Does sensor size affect hyperfocal distance?", a: "Yes. Smaller sensors have a smaller circle of confusion, which results in a shorter hyperfocal distance for the same focal length and aperture." }
  ],
  `Hyperfocal Distance = (focal_length^2) / (aperture x CoC) + focal_length
Near Limit = Hyperfocal / 2`,
  ["depth-of-field-calculator", "camera-sensor-crop-factor-calculator"]
);

add(
  "flash-guide-number-calculator",
  "Flash Guide Number Calculator",
  "Calculate flash exposure distance, required power, and guide number relationships for speedlight and studio flash photography.",
  "Science",
  "science",
  "A",
  ["flash guide number", "speedlight calculator", "flash distance", "flash power", "GN calculator"],
  [
    '{ name: "guideNumber", label: "Flash Guide Number (m at ISO 100)", type: "number", min: 5, max: 200, defaultValue: 36 }',
    '{ name: "aperture", label: "Aperture (f-stop)", type: "number", min: 1, max: 64, defaultValue: 5.6 }',
    '{ name: "iso", label: "ISO", type: "number", min: 50, max: 12800, defaultValue: 100 }',
    '{ name: "powerLevel", label: "Flash Power", type: "select", options: [{ value: "1", label: "1/1 (Full)" }, { value: "2", label: "1/2" }, { value: "4", label: "1/4" }, { value: "8", label: "1/8" }, { value: "16", label: "1/16" }, { value: "32", label: "1/32" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const gn = inputs.guideNumber as number;
    const aperture = inputs.aperture as number;
    const iso = inputs.iso as number;
    const power = parseInt(inputs.powerLevel as string);
    const isoFactor = Math.sqrt(iso / 100);
    const powerFactor = Math.sqrt(1 / power);
    const effectiveGN = gn * isoFactor * powerFactor;
    const maxDist = Math.round(effectiveGN / aperture * 100) / 100;
    const maxDistFt = Math.round(maxDist * 3.281 * 100) / 100;
    return {
      primary: { label: "Maximum Flash Distance", value: formatNumber(maxDist) + " m" },
      details: [
        { label: "Distance (ft)", value: formatNumber(maxDistFt) + " ft" },
        { label: "Effective Guide Number", value: formatNumber(Math.round(effectiveGN * 10) / 10) },
        { label: "ISO Factor", value: formatNumber(Math.round(isoFactor * 100) / 100) + "x" },
        { label: "Power Factor", value: formatNumber(Math.round(powerFactor * 100) / 100) + "x" }
      ]
    };
  }`,
  [
    { q: "What is a flash guide number?", a: "The guide number (GN) indicates flash power. It equals the product of flash-to-subject distance and aperture at ISO 100. Higher GN means more powerful flash." },
    { q: "How does ISO affect flash distance?", a: "Doubling ISO increases effective flash distance by about 1.4x (square root of 2). Going from ISO 100 to 400 doubles the effective distance." },
    { q: "What guide number do I need?", a: "For indoor events, GN 36-58 is typical. Outdoor or large venue photography may require GN 58 or higher, or multiple flashes." }
  ],
  `Effective GN = Base GN x sqrt(ISO / 100) x sqrt(1 / power)
Max Distance = Effective GN / Aperture`,
  ["exposure-triangle-calculator", "lighting-setup-cost-calculator"]
);

add(
  "time-lapse-interval-calculator",
  "Time-Lapse Interval Calculator",
  "Calculate optimal interval, total shots, and storage requirements for time-lapse photography and video.",
  "Everyday",
  "everyday",
  "~",
  ["time-lapse calculator", "timelapse interval", "intervalometer", "time lapse shooting"],
  [
    '{ name: "eventDuration", label: "Event Duration (minutes)", type: "number", min: 1, max: 14400, defaultValue: 60 }',
    '{ name: "outputLength", label: "Desired Output Length (seconds)", type: "number", min: 1, max: 600, defaultValue: 30 }',
    '{ name: "fps", label: "Output Frame Rate (fps)", type: "select", options: [{ value: "24", label: "24 fps (Cinema)" }, { value: "25", label: "25 fps (PAL)" }, { value: "30", label: "30 fps (NTSC)" }, { value: "60", label: "60 fps (Smooth)" }], defaultValue: "24" }',
    '{ name: "fileSizeMB", label: "Avg Photo Size (MB)", type: "number", min: 1, max: 100, defaultValue: 25 }'
  ],
  `(inputs) => {
    const duration = inputs.eventDuration as number;
    const outputLen = inputs.outputLength as number;
    const fps = parseInt(inputs.fps as string);
    const fileSize = inputs.fileSizeMB as number;
    const totalFrames = outputLen * fps;
    const intervalSec = (duration * 60) / totalFrames;
    const storageGB = Math.round(totalFrames * fileSize / 1024 * 100) / 100;
    const intervalRounded = Math.round(intervalSec * 10) / 10;
    return {
      primary: { label: "Shooting Interval", value: formatNumber(intervalRounded) + " seconds" },
      details: [
        { label: "Total Frames Needed", value: formatNumber(totalFrames) },
        { label: "Storage Required", value: formatNumber(storageGB) + " GB" },
        { label: "Output Duration", value: formatNumber(outputLen) + " sec at " + formatNumber(fps) + " fps" },
        { label: "Event Duration", value: formatNumber(duration) + " minutes" }
      ]
    };
  }`,
  [
    { q: "What interval should I use for time-lapse?", a: "It depends on the subject. Clouds typically use 3-5 second intervals, sunsets 5-10 seconds, stars 20-30 seconds, and construction projects 5-15 minutes." },
    { q: "How many photos do I need for a time-lapse?", a: "At 24 fps, you need 720 photos for a 30-second video. At 30 fps, you need 900 photos for the same duration." },
    { q: "What frame rate should I use for time-lapse?", a: "24 fps gives a cinematic look, 30 fps is standard for web video, and 25 fps is used for PAL broadcast." }
  ],
  `Interval = (Event Duration in seconds) / (Output Length x FPS)
Total Frames = Output Length x FPS
Storage = Total Frames x File Size`,
  ["video-bitrate-estimator", "video-storage-estimator"]
);

add(
  "video-bitrate-estimator",
  "Video Bitrate Calculator",
  "Calculate recommended video bitrate and file size based on resolution, frame rate, codec, and content type.",
  "Everyday",
  "everyday",
  "~",
  ["video bitrate", "video file size calculator", "encoding bitrate", "streaming bitrate"],
  [
    '{ name: "resolution", label: "Resolution", type: "select", options: [{ value: "1", label: "720p (1280x720)" }, { value: "2", label: "1080p (1920x1080)" }, { value: "3", label: "1440p (2560x1440)" }, { value: "4", label: "4K (3840x2160)" }, { value: "5", label: "8K (7680x4320)" }], defaultValue: "2" }',
    '{ name: "fps", label: "Frame Rate", type: "select", options: [{ value: "24", label: "24 fps" }, { value: "30", label: "30 fps" }, { value: "60", label: "60 fps" }, { value: "120", label: "120 fps" }], defaultValue: "30" }',
    '{ name: "codec", label: "Codec", type: "select", options: [{ value: "1", label: "H.264 (AVC)" }, { value: "2", label: "H.265 (HEVC)" }, { value: "3", label: "ProRes 422" }, { value: "4", label: "AV1" }], defaultValue: "1" }',
    '{ name: "duration", label: "Duration (minutes)", type: "number", min: 1, max: 600, defaultValue: 10 }'
  ],
  `(inputs) => {
    const res = parseInt(inputs.resolution as string);
    const fps = parseInt(inputs.fps as string);
    const codec = parseInt(inputs.codec as string);
    const duration = inputs.duration as number;
    const baseRates = [0, 5, 10, 20, 45, 150];
    const baseMbps = baseRates[res];
    const fpsMultiplier = fps / 30;
    const codecMultiplier = codec === 1 ? 1.0 : codec === 2 ? 0.6 : codec === 3 ? 4.0 : 0.55;
    const bitrate = Math.round(baseMbps * fpsMultiplier * codecMultiplier * 10) / 10;
    const fileSizeGB = Math.round(bitrate * duration * 60 / 8 / 1024 * 100) / 100;
    const fileSizeMB = Math.round(bitrate * duration * 60 / 8);
    return {
      primary: { label: "Recommended Bitrate", value: formatNumber(bitrate) + " Mbps" },
      details: [
        { label: "File Size", value: fileSizeGB >= 1 ? formatNumber(fileSizeGB) + " GB" : formatNumber(fileSizeMB) + " MB" },
        { label: "Duration", value: formatNumber(duration) + " minutes" },
        { label: "FPS Multiplier", value: formatNumber(Math.round(fpsMultiplier * 100) / 100) + "x" },
        { label: "Codec Efficiency", value: formatNumber(codecMultiplier) + "x" }
      ]
    };
  }`,
  [
    { q: "What bitrate should I use for YouTube uploads?", a: "YouTube recommends 8 Mbps for 1080p at 30fps with H.264, 12 Mbps for 1080p at 60fps, and 35-45 Mbps for 4K at 30fps." },
    { q: "Is H.265 better than H.264?", a: "H.265 (HEVC) achieves roughly the same quality at 40-50% lower bitrate compared to H.264, but encoding is slower and not all devices support it." },
    { q: "What is ProRes used for?", a: "ProRes is an editing codec used in professional post-production. It has high bitrates but is optimized for editing performance rather than delivery." }
  ],
  `Bitrate = Base Rate x (FPS / 30) x Codec Multiplier
File Size (GB) = Bitrate (Mbps) x Duration (sec) / 8 / 1024`,
  ["video-storage-estimator", "video-render-time-estimator"]
);

add(
  "film-budget-estimator",
  "Film Budget Estimator",
  "Estimate total production budget for short films, music videos, and independent productions based on crew, equipment, and shooting days.",
  "Finance",
  "finance",
  "$",
  ["film budget", "video production cost", "movie budget calculator", "film production budget"],
  [
    '{ name: "shootDays", label: "Number of Shooting Days", type: "number", min: 1, max: 120, defaultValue: 5 }',
    '{ name: "crewSize", label: "Crew Size", type: "number", min: 1, max: 200, defaultValue: 10 }',
    '{ name: "avgDayRate", label: "Avg Crew Day Rate ($)", type: "number", min: 50, max: 5000, defaultValue: 350 }',
    '{ name: "equipmentPerDay", label: "Equipment Rental per Day ($)", type: "number", min: 0, max: 50000, defaultValue: 1500 }',
    '{ name: "locationPerDay", label: "Location Cost per Day ($)", type: "number", min: 0, max: 20000, defaultValue: 500 }',
    '{ name: "postDays", label: "Post-Production Days", type: "number", min: 0, max: 180, defaultValue: 10 }'
  ],
  `(inputs) => {
    const shootDays = inputs.shootDays as number;
    const crewSize = inputs.crewSize as number;
    const dayRate = inputs.avgDayRate as number;
    const equipment = inputs.equipmentPerDay as number;
    const location = inputs.locationPerDay as number;
    const postDays = inputs.postDays as number;
    const crewCost = crewSize * dayRate * shootDays;
    const equipCost = equipment * shootDays;
    const locCost = location * shootDays;
    const postCost = postDays * 500;
    const contingency = Math.round((crewCost + equipCost + locCost + postCost) * 0.1);
    const total = crewCost + equipCost + locCost + postCost + contingency;
    return {
      primary: { label: "Estimated Total Budget", value: "$" + formatNumber(total) },
      details: [
        { label: "Crew Costs", value: "$" + formatNumber(crewCost) },
        { label: "Equipment Costs", value: "$" + formatNumber(equipCost) },
        { label: "Location Costs", value: "$" + formatNumber(locCost) },
        { label: "Post-Production", value: "$" + formatNumber(postCost) },
        { label: "Contingency (10%)", value: "$" + formatNumber(contingency) }
      ]
    };
  }`,
  [
    { q: "What percentage of a film budget goes to crew?", a: "Crew costs typically represent 40-60% of an independent film budget, including above-the-line talent (director, producer, lead actors) and below-the-line crew." },
    { q: "How much contingency should I budget?", a: "Industry standard is 10-15% contingency for independent productions. Studio films may allocate 5-10% because of more detailed planning." },
    { q: "What does post-production cost?", a: "Post-production typically costs 15-30% of the overall budget. This includes editing, color grading, sound design, music licensing, and visual effects." }
  ],
  `Total Budget = Crew Costs + Equipment + Location + Post-Production + Contingency (10%)
Crew Costs = Crew Size x Day Rate x Shooting Days`,
  ["film-crew-size-estimator", "wedding-videography-cost-calculator"]
);

add(
  "golden-ratio-composition-calculator",
  "Golden Ratio Composition Calculator",
  "Calculate golden ratio guide points, phi grid lines, and golden spiral placement for photographic and artistic composition.",
  "Math",
  "math",
  "+",
  ["golden ratio composition", "phi grid photography", "golden spiral", "rule of thirds alternative"],
  [
    '{ name: "imageWidth", label: "Image Width (px)", type: "number", min: 100, max: 20000, defaultValue: 1920 }',
    '{ name: "imageHeight", label: "Image Height (px)", type: "number", min: 100, max: 20000, defaultValue: 1080 }',
    '{ name: "orientation", label: "Orientation", type: "select", options: [{ value: "1", label: "Landscape" }, { value: "2", label: "Portrait" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const w = inputs.imageWidth as number;
    const h = inputs.imageHeight as number;
    const orientation = parseInt(inputs.orientation as string);
    const phi = 1.618;
    const effW = orientation === 1 ? w : h;
    const effH = orientation === 1 ? h : w;
    const vLine1 = Math.round(effW / phi);
    const vLine2 = Math.round(effW - effW / phi);
    const hLine1 = Math.round(effH / phi);
    const hLine2 = Math.round(effH - effH / phi);
    const powerPoint1X = vLine2;
    const powerPoint1Y = hLine2;
    const powerPoint2X = vLine1;
    const powerPoint2Y = hLine1;
    return {
      primary: { label: "Primary Power Point", value: formatNumber(powerPoint1X) + ", " + formatNumber(powerPoint1Y) + " px" },
      details: [
        { label: "Secondary Power Point", value: formatNumber(powerPoint2X) + ", " + formatNumber(powerPoint2Y) + " px" },
        { label: "Vertical Phi Lines", value: formatNumber(vLine2) + " px & " + formatNumber(vLine1) + " px" },
        { label: "Horizontal Phi Lines", value: formatNumber(hLine2) + " px & " + formatNumber(hLine1) + " px" },
        { label: "Image Dimensions", value: formatNumber(effW) + " x " + formatNumber(effH) + " px" }
      ]
    };
  }`,
  [
    { q: "What is the golden ratio in photography?", a: "The golden ratio (1.618) creates a compositional grid similar to the rule of thirds but with more mathematically harmonious proportions. It places key elements at natural focal points." },
    { q: "How is the phi grid different from rule of thirds?", a: "The phi grid places lines at approximately 38% and 62% rather than at 33% and 66%. This subtle shift creates compositions that many find more naturally balanced." },
    { q: "Where should I place my subject?", a: "Place your primary subject at one of the power points — the intersections of the phi grid lines. These points naturally attract the viewer's eye." }
  ],
  `Phi Grid Vertical Lines: W / 1.618 and W - W / 1.618
Phi Grid Horizontal Lines: H / 1.618 and H - H / 1.618
Power Points: intersections of phi grid lines`,
  ["golden-ratio-crop-calculator", "print-resolution-calculator"]
);

add(
  "video-storage-estimator",
  "Video Storage Estimator",
  "Calculate total storage needed for video projects based on resolution, codec, frame rate, and shooting duration.",
  "Everyday",
  "everyday",
  "~",
  ["video storage", "camera card size", "memory card calculator", "video footage storage"],
  [
    '{ name: "resolution", label: "Resolution", type: "select", options: [{ value: "1", label: "1080p" }, { value: "2", label: "4K" }, { value: "3", label: "6K" }, { value: "4", label: "8K" }], defaultValue: "2" }',
    '{ name: "codec", label: "Recording Codec", type: "select", options: [{ value: "1", label: "H.264 (Compressed)" }, { value: "2", label: "H.265 (HEVC)" }, { value: "3", label: "ProRes 422" }, { value: "4", label: "RAW" }], defaultValue: "1" }',
    '{ name: "fps", label: "Frame Rate (fps)", type: "number", min: 24, max: 240, defaultValue: 30 }',
    '{ name: "duration", label: "Total Recording Time (hours)", type: "number", min: 0.1, max: 100, defaultValue: 2 }'
  ],
  `(inputs) => {
    const res = parseInt(inputs.resolution as string);
    const codec = parseInt(inputs.codec as string);
    const fps = inputs.fps as number;
    const hours = inputs.duration as number;
    const baseGBperHour = [0, 15, 45, 90, 180];
    const codecMultiplier = codec === 1 ? 1.0 : codec === 2 ? 0.6 : codec === 3 ? 4.5 : codec === 4 ? 8.0 : 1.0;
    const fpsMultiplier = fps / 30;
    const storageGB = Math.round(baseGBperHour[res] * codecMultiplier * fpsMultiplier * hours * 10) / 10;
    const storageTB = Math.round(storageGB / 1024 * 100) / 100;
    const cardsNeeded = Math.ceil(storageGB / 128);
    return {
      primary: { label: "Total Storage Needed", value: storageGB >= 1024 ? formatNumber(storageTB) + " TB" : formatNumber(storageGB) + " GB" },
      details: [
        { label: "Storage (GB)", value: formatNumber(storageGB) + " GB" },
        { label: "128GB Cards Needed", value: formatNumber(cardsNeeded) },
        { label: "Data Rate", value: formatNumber(Math.round(storageGB / hours / 3.6 * 10) / 10) + " MB/s" },
        { label: "Recording Duration", value: formatNumber(hours) + " hours" }
      ]
    };
  }`,
  [
    { q: "How much storage does 4K video use?", a: "4K H.264 at 30fps uses approximately 45 GB per hour. RAW 4K can use 300-400 GB per hour depending on the camera." },
    { q: "What size memory card do I need for video?", a: "For a full day of 4K shooting (6-8 hours), plan for at least 256-512 GB in H.264, or several terabytes for RAW formats." },
    { q: "What card speed do I need for 4K?", a: "4K recording typically requires write speeds of at least 60-100 MB/s. RAW recording may need 300 MB/s or faster." }
  ],
  `Storage (GB) = Base Rate x Codec Multiplier x (FPS / 30) x Hours
Base Rates: 1080p = 15 GB/hr, 4K = 45 GB/hr, 6K = 90 GB/hr, 8K = 180 GB/hr (H.264)`,
  ["video-bitrate-estimator", "photo-backup-storage-calculator"]
);

add(
  "green-screen-distance-calculator",
  "Green Screen Distance Calculator",
  "Calculate optimal distances between subject, green screen, and lights to minimize spill and achieve clean keying.",
  "Everyday",
  "everyday",
  "~",
  ["green screen distance", "chroma key setup", "green screen lighting", "chromakey calculator"],
  [
    '{ name: "screenWidth", label: "Green Screen Width (ft)", type: "number", min: 4, max: 60, defaultValue: 12 }',
    '{ name: "screenHeight", label: "Green Screen Height (ft)", type: "number", min: 4, max: 30, defaultValue: 9 }',
    '{ name: "subjectCount", label: "Number of Subjects", type: "number", min: 1, max: 10, defaultValue: 1 }',
    '{ name: "lensFL", label: "Lens Focal Length (mm)", type: "number", min: 16, max: 200, defaultValue: 50 }'
  ],
  `(inputs) => {
    const screenW = inputs.screenWidth as number;
    const screenH = inputs.screenHeight as number;
    const subjects = inputs.subjectCount as number;
    const fl = inputs.lensFL as number;
    const subjectToScreen = Math.max(6, Math.round(screenW * 0.5));
    const minSpillDist = 6 + (subjects - 1) * 2;
    const subjectDist = Math.max(subjectToScreen, minSpillDist);
    const cameraToSubject = Math.round(fl / 10 * subjects * 1.5);
    const totalDepth = subjectDist + cameraToSubject;
    const lightToScreen = Math.round(screenW * 0.6);
    return {
      primary: { label: "Subject to Screen Distance", value: formatNumber(subjectDist) + " ft" },
      details: [
        { label: "Camera to Subject", value: formatNumber(cameraToSubject) + " ft" },
        { label: "Total Room Depth Needed", value: formatNumber(totalDepth) + " ft" },
        { label: "Screen Lights Distance", value: formatNumber(lightToScreen) + " ft from screen" },
        { label: "Min Screen Coverage", value: formatNumber(screenW) + " x " + formatNumber(screenH) + " ft" }
      ]
    };
  }`,
  [
    { q: "How far should the subject be from the green screen?", a: "At minimum 6-8 feet to avoid green spill on the subject. More distance gives cleaner results but requires a larger screen." },
    { q: "What color green screen is best?", a: "Chroma key green (Pantone 354C) is the most common. Blue screens are preferred for scenes with green elements or for digital skin tone preservation." },
    { q: "How do I light a green screen?", a: "Light the screen evenly and separately from your subject. Place lights 4-6 feet from the screen at 45 degree angles to minimize hot spots." }
  ],
  `Subject Distance = max(6 ft, Screen Width x 0.5)
Camera Distance = Focal Length / 10 x Subjects x 1.5
Total Depth = Subject Distance + Camera Distance`,
  ["lighting-setup-cost-calculator", "film-budget-estimator"]
);

add(
  "color-temperature-converter-calculator",
  "Color Temperature Converter",
  "Convert between color temperatures in Kelvin, mired values, and CRI ratings for photography and videography white balance.",
  "Conversion",
  "conversion",
  "R",
  ["color temperature", "kelvin to mired", "white balance", "CTO CTO gel", "color temperature converter"],
  [
    '{ name: "kelvin", label: "Color Temperature (Kelvin)", type: "number", min: 1000, max: 20000, defaultValue: 5600 }',
    '{ name: "targetKelvin", label: "Target Temperature (Kelvin)", type: "number", min: 1000, max: 20000, defaultValue: 3200 }',
    '{ name: "lightSource", label: "Light Source Reference", type: "select", options: [{ value: "1", label: "Daylight (5600K)" }, { value: "2", label: "Tungsten (3200K)" }, { value: "3", label: "Fluorescent (4000K)" }, { value: "4", label: "LED Panel (5000K)" }, { value: "5", label: "Candlelight (1900K)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const kelvin = inputs.kelvin as number;
    const target = inputs.targetKelvin as number;
    const source = parseInt(inputs.lightSource as string);
    const mired = Math.round(1000000 / kelvin);
    const targetMired = Math.round(1000000 / target);
    const miredShift = targetMired - mired;
    const gelNeeded = Math.abs(miredShift) > 100 ? "Full CTO/CTB" : Math.abs(miredShift) > 50 ? "1/2 CTO/CTB" : Math.abs(miredShift) > 25 ? "1/4 CTO/CTB" : "None or 1/8 gel";
    const direction = miredShift > 0 ? "Warming (CTO)" : miredShift < 0 ? "Cooling (CTB)" : "No shift needed";
    return {
      primary: { label: "Mired Shift Required", value: formatNumber(miredShift) + " mired" },
      details: [
        { label: "Source Mired Value", value: formatNumber(mired) },
        { label: "Target Mired Value", value: formatNumber(targetMired) },
        { label: "Gel Recommendation", value: gelNeeded },
        { label: "Direction", value: direction }
      ]
    };
  }`,
  [
    { q: "What is mired value?", a: "Mired (micro reciprocal degree) equals 1,000,000 divided by the color temperature in Kelvin. Mired shifts are more perceptually uniform than Kelvin differences." },
    { q: "What is the difference between CTO and CTB gels?", a: "CTO (Color Temperature Orange) warms light, shifting it toward tungsten. CTB (Color Temperature Blue) cools light, shifting it toward daylight." },
    { q: "What white balance should I set for mixed lighting?", a: "Set your camera to match the dominant light source, then use gels on secondary lights to match. Or shoot RAW and adjust in post-production." }
  ],
  `Mired = 1,000,000 / Kelvin
Mired Shift = Target Mired - Source Mired
Positive shift = warming, Negative shift = cooling`,
  ["exposure-triangle-calculator", "lighting-setup-cost-calculator"]
);

add(
  "photo-print-cost-calculator",
  "Photo Print Cost Per Unit Calculator",
  "Calculate cost per print, profit margins, and break-even pricing for photography print sales and lab orders.",
  "Finance",
  "finance",
  "$",
  ["photo print cost", "photography pricing", "print profit calculator", "photo lab cost"],
  [
    '{ name: "labCost", label: "Lab Cost Per Print ($)", type: "number", min: 0.1, max: 500, defaultValue: 2.5 }',
    '{ name: "shippingCost", label: "Shipping Cost Per Order ($)", type: "number", min: 0, max: 50, defaultValue: 5 }',
    '{ name: "printsPerOrder", label: "Avg Prints Per Order", type: "number", min: 1, max: 100, defaultValue: 10 }',
    '{ name: "sellingPrice", label: "Selling Price Per Print ($)", type: "number", min: 0.5, max: 1000, defaultValue: 15 }',
    '{ name: "monthlyOrders", label: "Estimated Monthly Orders", type: "number", min: 1, max: 1000, defaultValue: 20 }'
  ],
  `(inputs) => {
    const labCost = inputs.labCost as number;
    const shipping = inputs.shippingCost as number;
    const perOrder = inputs.printsPerOrder as number;
    const price = inputs.sellingPrice as number;
    const orders = inputs.monthlyOrders as number;
    const costPerPrint = labCost + shipping / perOrder;
    const profitPerPrint = price - costPerPrint;
    const marginPct = Math.round(profitPerPrint / price * 100 * 10) / 10;
    const monthlyRevenue = price * perOrder * orders;
    const monthlyCost = costPerPrint * perOrder * orders;
    const monthlyProfit = monthlyRevenue - monthlyCost;
    return {
      primary: { label: "Profit Per Print", value: "$" + formatNumber(Math.round(profitPerPrint * 100) / 100) },
      details: [
        { label: "Total Cost Per Print", value: "$" + formatNumber(Math.round(costPerPrint * 100) / 100) },
        { label: "Profit Margin", value: formatNumber(marginPct) + "%" },
        { label: "Monthly Revenue", value: "$" + formatNumber(Math.round(monthlyRevenue)) },
        { label: "Monthly Profit", value: "$" + formatNumber(Math.round(monthlyProfit)) }
      ]
    };
  }`,
  [
    { q: "What is a good profit margin for photo prints?", a: "Professional photographers typically aim for 60-80% margins on prints. This accounts for shooting time, editing, and business overhead beyond just the print cost." },
    { q: "How much should I charge for prints?", a: "Price prints at 2.5 to 4 times your cost of goods. A print costing $5 to produce should sell for $12.50 to $20 minimum." },
    { q: "Should I offer different print sizes?", a: "Yes. Larger prints have higher perceived value and profit margins. Many photographers make most print revenue from 11x14 and larger sizes." }
  ],
  `Cost Per Print = Lab Cost + (Shipping / Prints Per Order)
Profit Per Print = Selling Price - Cost Per Print
Margin = Profit / Selling Price x 100`,
  ["film-budget-estimator", "wedding-videography-cost-calculator"]
);

add(
  "video-render-time-estimator",
  "Video Render Time Estimator",
  "Estimate video rendering and export time based on project settings, hardware, and complexity.",
  "Everyday",
  "everyday",
  "~",
  ["video render time", "export time calculator", "rendering speed", "video encoding time"],
  [
    '{ name: "duration", label: "Project Duration (minutes)", type: "number", min: 1, max: 300, defaultValue: 10 }',
    '{ name: "resolution", label: "Output Resolution", type: "select", options: [{ value: "1", label: "1080p" }, { value: "2", label: "4K" }, { value: "3", label: "6K" }, { value: "4", label: "8K" }], defaultValue: "2" }',
    '{ name: "complexity", label: "Project Complexity", type: "select", options: [{ value: "1", label: "Simple (cuts only)" }, { value: "2", label: "Moderate (color + transitions)" }, { value: "3", label: "Complex (VFX + compositing)" }, { value: "4", label: "Heavy VFX (3D + particles)" }], defaultValue: "2" }',
    '{ name: "hardware", label: "Hardware Tier", type: "select", options: [{ value: "1", label: "Entry (integrated GPU)" }, { value: "2", label: "Mid-range (dedicated GPU)" }, { value: "3", label: "High-end (RTX 4080+)" }, { value: "4", label: "Workstation (multi-GPU)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const duration = inputs.duration as number;
    const res = parseInt(inputs.resolution as string);
    const complexity = parseInt(inputs.complexity as string);
    const hardware = parseInt(inputs.hardware as string);
    const resMultiplier = [0, 1, 3, 6, 12][res];
    const complexMultiplier = [0, 1, 2.5, 5, 10][complexity];
    const hwSpeed = [0, 0.3, 1, 2.5, 5][hardware];
    const renderMinutes = Math.round(duration * resMultiplier * complexMultiplier / hwSpeed);
    const renderHours = Math.floor(renderMinutes / 60);
    const renderMins = renderMinutes % 60;
    const renderTimeStr = renderHours > 0 ? renderHours + "h " + renderMins + "m" : renderMins + " minutes";
    const ratio = Math.round(renderMinutes / duration * 10) / 10;
    return {
      primary: { label: "Estimated Render Time", value: renderTimeStr },
      details: [
        { label: "Render Time (minutes)", value: formatNumber(renderMinutes) },
        { label: "Render-to-Real Ratio", value: formatNumber(ratio) + ":1" },
        { label: "Project Duration", value: formatNumber(duration) + " min" },
        { label: "Effective Speed", value: ratio <= 1 ? "Faster than real-time" : formatNumber(ratio) + "x slower than real-time" }
      ]
    };
  }`,
  [
    { q: "Why does rendering take so long?", a: "Rendering processes every frame individually, applying effects, color grading, and compression. A 10-minute 4K video at 30fps has 18,000 frames to process." },
    { q: "Does GPU matter for video rendering?", a: "Yes, significantly. A dedicated GPU can speed up rendering by 3-10x compared to CPU-only rendering, especially for effects-heavy projects." },
    { q: "How can I speed up rendering?", a: "Use proxy editing, enable GPU acceleration, render at lower resolution for previews, and close other applications during export." }
  ],
  `Render Time = Duration x Resolution Multiplier x Complexity Multiplier / Hardware Speed
Render Ratio = Render Time / Project Duration`,
  ["video-bitrate-estimator", "video-storage-estimator"]
);

add(
  "drone-flight-time-calculator",
  "Drone Flight Time Calculator",
  "Calculate effective filming time, battery requirements, and coverage area for aerial photography and videography drone missions.",
  "Everyday",
  "everyday",
  "~",
  ["drone flight time", "drone battery calculator", "aerial photography time", "drone filming duration"],
  [
    '{ name: "batteryCapacity", label: "Battery Capacity (mAh)", type: "number", min: 1000, max: 30000, defaultValue: 5000 }',
    '{ name: "maxFlightTime", label: "Rated Max Flight Time (min)", type: "number", min: 5, max: 60, defaultValue: 30 }',
    '{ name: "batteries", label: "Number of Batteries", type: "number", min: 1, max: 20, defaultValue: 3 }',
    '{ name: "windCondition", label: "Wind Conditions", type: "select", options: [{ value: "1", label: "Calm (< 5 mph)" }, { value: "2", label: "Light (5-15 mph)" }, { value: "3", label: "Moderate (15-25 mph)" }], defaultValue: "1" }',
    '{ name: "payload", label: "Extra Payload", type: "select", options: [{ value: "1", label: "None (stock camera)" }, { value: "2", label: "Light (< 200g)" }, { value: "3", label: "Heavy (200g+)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const capacity = inputs.batteryCapacity as number;
    const maxTime = inputs.maxFlightTime as number;
    const batteries = inputs.batteries as number;
    const wind = parseInt(inputs.windCondition as string);
    const payload = parseInt(inputs.payload as string);
    const windReduction = [0, 1.0, 0.8, 0.6][wind];
    const payloadReduction = [0, 1.0, 0.9, 0.75][payload];
    const safetyMargin = 0.8;
    const effectivePerBattery = Math.round(maxTime * windReduction * payloadReduction * safetyMargin * 10) / 10;
    const totalFlightMin = Math.round(effectivePerBattery * batteries * 10) / 10;
    const filmableMin = Math.round(totalFlightMin * 0.7 * 10) / 10;
    const swapTime = (batteries - 1) * 3;
    const totalSessionMin = Math.round(totalFlightMin + swapTime);
    return {
      primary: { label: "Total Flight Time", value: formatNumber(totalFlightMin) + " min" },
      details: [
        { label: "Per Battery (effective)", value: formatNumber(effectivePerBattery) + " min" },
        { label: "Usable Filming Time", value: formatNumber(filmableMin) + " min" },
        { label: "Total Session (with swaps)", value: formatNumber(totalSessionMin) + " min" },
        { label: "Battery Swaps", value: formatNumber(batteries - 1) }
      ]
    };
  }`,
  [
    { q: "How long can a drone fly on one battery?", a: "Consumer drones typically fly 20-40 minutes per battery. Wind, payload, cold temperatures, and aggressive flying reduce this significantly." },
    { q: "How many batteries should I bring for a shoot?", a: "For professional shoots, bring at least 3-4 fully charged batteries. Plan for 60-70% of rated flight time as actual filming time." },
    { q: "Does wind really affect battery life that much?", a: "Yes. Moderate winds (15-25 mph) can reduce flight time by 30-40% as the drone constantly fights to maintain position." }
  ],
  `Effective Time = Max Time x Wind Factor x Payload Factor x 0.8 (safety)
Total Flight = Effective Time Per Battery x Number of Batteries
Filmable Time = Total Flight x 0.7 (transit/setup overhead)`,
  ["time-lapse-interval-calculator", "video-storage-estimator"]
);

add(
  "photo-backup-storage-calculator",
  "Photo Backup Storage Calculator",
  "Calculate total backup storage needs and costs for photographers based on shooting volume, file types, and backup strategy.",
  "Everyday",
  "everyday",
  "~",
  ["photo backup storage", "photographer storage", "photo archive calculator", "backup drive size"],
  [
    '{ name: "shootsPerMonth", label: "Shoots Per Month", type: "number", min: 1, max: 60, defaultValue: 8 }',
    '{ name: "photosPerShoot", label: "Photos Per Shoot", type: "number", min: 10, max: 5000, defaultValue: 500 }',
    '{ name: "avgFileSizeMB", label: "Avg RAW File Size (MB)", type: "number", min: 5, max: 150, defaultValue: 30 }',
    '{ name: "keepRate", label: "Keep Rate (%)", type: "number", min: 5, max: 100, defaultValue: 30 }',
    '{ name: "backupCopies", label: "Number of Backup Copies", type: "select", options: [{ value: "1", label: "1 copy (no redundancy)" }, { value: "2", label: "2 copies (3-2-1 basic)" }, { value: "3", label: "3 copies (3-2-1 full)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const shoots = inputs.shootsPerMonth as number;
    const photosPerShoot = inputs.photosPerShoot as number;
    const fileSize = inputs.avgFileSizeMB as number;
    const keepRate = inputs.keepRate as number;
    const copies = parseInt(inputs.backupCopies as string);
    const monthlyPhotos = shoots * photosPerShoot;
    const keptPhotos = Math.round(monthlyPhotos * keepRate / 100);
    const monthlyGB = Math.round(keptPhotos * fileSize / 1024 * 10) / 10;
    const yearlyGB = Math.round(monthlyGB * 12 * 10) / 10;
    const yearlyTB = Math.round(yearlyGB / 1024 * 100) / 100;
    const totalWithBackups = Math.round(yearlyGB * copies * 10) / 10;
    const totalTB = Math.round(totalWithBackups / 1024 * 100) / 100;
    const costEstimate = Math.round(totalTB * 25 * 100) / 100;
    return {
      primary: { label: "Annual Storage Needed", value: yearlyTB >= 1 ? formatNumber(yearlyTB) + " TB" : formatNumber(yearlyGB) + " GB" },
      details: [
        { label: "Monthly New Data", value: formatNumber(monthlyGB) + " GB" },
        { label: "Photos Kept Per Month", value: formatNumber(keptPhotos) },
        { label: "Total With Backups", value: totalTB >= 1 ? formatNumber(totalTB) + " TB" : formatNumber(totalWithBackups) + " GB" },
        { label: "Est. HDD Cost/Year", value: "$" + formatNumber(costEstimate) + " (at ~$25/TB)" }
      ]
    };
  }`,
  [
    { q: "What is the 3-2-1 backup rule?", a: "Keep 3 copies of your data on 2 different types of media with 1 copy stored offsite. This protects against hardware failure, theft, and natural disasters." },
    { q: "How much storage does a professional photographer need?", a: "A busy wedding or event photographer may generate 2-5 TB per year. Commercial and studio photographers often need less, around 500 GB to 2 TB." },
    { q: "Should I keep all RAW files?", a: "Many professionals keep all RAW files from delivered shoots permanently. Storage is cheaper than reshooting. Budget for long-term archival storage." }
  ],
  `Monthly Data = Shoots x Photos x Keep Rate x File Size
Annual Storage = Monthly Data x 12
Total = Annual Storage x Number of Backup Copies`,
  ["video-storage-estimator", "photo-print-cost-calculator"]
);

add(
  "wedding-videography-cost-calculator",
  "Wedding Videography Cost Calculator",
  "Estimate wedding videography pricing based on coverage hours, crew size, deliverables, and add-on services.",
  "Finance",
  "finance",
  "$",
  ["wedding videography cost", "wedding video pricing", "videographer rates", "wedding film cost"],
  [
    '{ name: "hours", label: "Coverage Hours", type: "number", min: 1, max: 16, defaultValue: 8 }',
    '{ name: "videographers", label: "Number of Videographers", type: "number", min: 1, max: 4, defaultValue: 2 }',
    '{ name: "deliverables", label: "Deliverables", type: "select", options: [{ value: "1", label: "Highlight Film Only" }, { value: "2", label: "Highlight + Ceremony" }, { value: "3", label: "Full Coverage Edit" }, { value: "4", label: "Full + Same-Day Edit" }], defaultValue: "2" }',
    '{ name: "region", label: "Market Region", type: "select", options: [{ value: "1", label: "Budget Market" }, { value: "2", label: "Average Market" }, { value: "3", label: "Premium Market" }, { value: "4", label: "Luxury Market" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const hours = inputs.hours as number;
    const videographers = inputs.videographers as number;
    const deliverables = parseInt(inputs.deliverables as string);
    const region = parseInt(inputs.region as string);
    const regionMultiplier = [0, 0.6, 1.0, 1.8, 3.0][region];
    const deliverableBase = [0, 1200, 1800, 2800, 4000][deliverables];
    const hourlyRate = 150 * regionMultiplier;
    const coverageCost = Math.round(hours * hourlyRate * videographers);
    const deliverableCost = Math.round(deliverableBase * regionMultiplier);
    const editingHours = deliverables === 1 ? 15 : deliverables === 2 ? 25 : deliverables === 3 ? 40 : 55;
    const total = coverageCost + deliverableCost;
    return {
      primary: { label: "Estimated Package Price", value: "$" + formatNumber(total) },
      details: [
        { label: "Coverage Cost", value: "$" + formatNumber(coverageCost) },
        { label: "Deliverable Cost", value: "$" + formatNumber(deliverableCost) },
        { label: "Estimated Editing Hours", value: formatNumber(editingHours) + " hours" },
        { label: "Effective Hourly Rate", value: "$" + formatNumber(Math.round(total / (hours + editingHours))) + "/hr" }
      ]
    };
  }`,
  [
    { q: "How much does wedding videography cost?", a: "Average wedding videography costs range from $1,500 to $3,500 in average markets. Luxury markets and premium deliverables can run $5,000 to $15,000 or more." },
    { q: "Do I need two videographers?", a: "A second videographer captures additional angles during the ceremony and reception. They are highly recommended for coverage of events with 100+ guests." },
    { q: "How long does editing take?", a: "A highlight film typically takes 15-25 hours to edit. Full ceremony and reception coverage can take 40-60 hours of post-production work." }
  ],
  `Package Price = Coverage Cost + Deliverable Cost
Coverage Cost = Hours x Hourly Rate x Videographers
Hourly Rate = $150 x Region Multiplier`,
  ["film-budget-estimator", "photo-print-cost-calculator"]
);

add(
  "film-crew-size-estimator",
  "Film Crew Size Estimator",
  "Estimate the ideal crew size and key positions needed based on project type, budget level, and production complexity.",
  "Everyday",
  "everyday",
  "~",
  ["film crew size", "production crew calculator", "video crew", "crew positions needed"],
  [
    '{ name: "projectType", label: "Project Type", type: "select", options: [{ value: "1", label: "Social Media / YouTube" }, { value: "2", label: "Corporate Video" }, { value: "3", label: "Music Video" }, { value: "4", label: "Short Film" }, { value: "5", label: "Feature Film" }], defaultValue: "3" }',
    '{ name: "budgetLevel", label: "Budget Level", type: "select", options: [{ value: "1", label: "Micro (< $5K)" }, { value: "2", label: "Low ($5K-$25K)" }, { value: "3", label: "Mid ($25K-$100K)" }, { value: "4", label: "High ($100K+)" }], defaultValue: "2" }',
    '{ name: "shootDays", label: "Shooting Days", type: "number", min: 1, max: 60, defaultValue: 3 }',
    '{ name: "locations", label: "Number of Locations", type: "number", min: 1, max: 20, defaultValue: 2 }'
  ],
  `(inputs) => {
    const project = parseInt(inputs.projectType as string);
    const budget = parseInt(inputs.budgetLevel as string);
    const shootDays = inputs.shootDays as number;
    const locations = inputs.locations as number;
    const baseCrews = [[0,0,0,0,0,0],[0,1,3,5,8,15],[0,2,5,8,12,20],[0,3,8,12,18,30],[0,5,12,18,25,50]];
    const baseCrew = baseCrews[budget][project];
    const locationAdj = locations > 3 ? Math.ceil((locations - 3) * 0.5) : 0;
    const totalCrew = baseCrew + locationAdj;
    const dayRateAvg = budget === 1 ? 150 : budget === 2 ? 300 : budget === 3 ? 500 : 750;
    const crewBudget = totalCrew * dayRateAvg * shootDays;
    const keyPositions = totalCrew <= 3 ? "Director, DP, Sound" : totalCrew <= 8 ? "Director, DP, AC, Gaffer, Sound, PA" : totalCrew <= 15 ? "Director, AD, DP, AC, Gaffer, Grip, Sound, HMU, PA x2" : "Full department heads + support crew";
    return {
      primary: { label: "Recommended Crew Size", value: formatNumber(totalCrew) + " people" },
      details: [
        { label: "Key Positions", value: keyPositions },
        { label: "Estimated Crew Budget", value: "$" + formatNumber(crewBudget) },
        { label: "Avg Day Rate", value: "$" + formatNumber(dayRateAvg) + "/person" },
        { label: "Total Crew Days", value: formatNumber(totalCrew * shootDays) }
      ]
    };
  }`,
  [
    { q: "What is the minimum crew for a professional video?", a: "A skeleton crew of 2-3 people (director/DP, sound, and PA) can produce quality content. Music videos and short films typically need 5-12 people." },
    { q: "What positions should I hire first?", a: "After the director, prioritize a director of photography, sound recordist, and one production assistant. These cover the most critical production needs." },
    { q: "How much should I budget for crew?", a: "Crew typically represents 40-60% of production budget. Day rates vary widely: $150-300 for PAs, $500-1500 for department heads." }
  ],
  `Base Crew = Project Type x Budget Matrix
Location Adjustment = (Locations - 3) x 0.5 if > 3 locations
Crew Budget = Total Crew x Avg Day Rate x Shoot Days`,
  ["film-budget-estimator", "lighting-setup-cost-calculator"]
);

add(
  "motion-blur-shutter-speed-calculator",
  "Motion Blur Shutter Speed Calculator",
  "Calculate the ideal shutter speed for creative motion blur or sharp action freeze based on subject speed and distance.",
  "Science",
  "science",
  "A",
  ["motion blur", "shutter speed", "action freeze", "camera motion blur", "panning speed"],
  [
    '{ name: "subjectSpeed", label: "Subject Speed", type: "number", min: 1, max: 1000, defaultValue: 30 }',
    '{ name: "speedUnit", label: "Speed Unit", type: "select", options: [{ value: "1", label: "mph" }, { value: "2", label: "km/h" }, { value: "3", label: "ft/s" }], defaultValue: "1" }',
    '{ name: "distance", label: "Subject Distance (ft)", type: "number", min: 1, max: 5000, defaultValue: 50 }',
    '{ name: "focalLength", label: "Focal Length (mm)", type: "number", min: 10, max: 600, defaultValue: 100 }',
    '{ name: "intent", label: "Creative Intent", type: "select", options: [{ value: "1", label: "Freeze Action (sharp)" }, { value: "2", label: "Slight Motion Blur" }, { value: "3", label: "Creative Motion Blur" }, { value: "4", label: "Panning (background blur)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const speed = inputs.subjectSpeed as number;
    const unit = parseInt(inputs.speedUnit as string);
    const dist = inputs.distance as number;
    const fl = inputs.focalLength as number;
    const intent = parseInt(inputs.intent as string);
    const speedFtPerSec = unit === 1 ? speed * 1.467 : unit === 2 ? speed * 0.911 : speed;
    const angularSpeed = (speedFtPerSec / dist) * (180 / Math.PI);
    const blurPx = angularSpeed * fl / 50;
    const freezeShutter = Math.ceil(blurPx * 50);
    const intentMultiplier = [0, 1.0, 0.3, 0.1, 0.15][intent];
    const targetShutter = Math.max(1, Math.round(freezeShutter * intentMultiplier));
    const shutterStr = "1/" + targetShutter;
    const actualBlurPx = Math.round(blurPx / targetShutter * 50 * 10) / 10;
    return {
      primary: { label: "Recommended Shutter Speed", value: shutterStr + " sec" },
      details: [
        { label: "Subject Angular Speed", value: formatNumber(Math.round(angularSpeed * 100) / 100) + " deg/s" },
        { label: "Estimated Blur", value: formatNumber(actualBlurPx) + " pixels" },
        { label: "Subject Speed", value: formatNumber(Math.round(speedFtPerSec * 10) / 10) + " ft/s" },
        { label: "Freeze Shutter", value: "1/" + formatNumber(freezeShutter) + " sec" }
      ]
    };
  }`,
  [
    { q: "What shutter speed freezes action?", a: "To freeze fast action like sports, use 1/500 or faster. For birds in flight use 1/1000 to 1/2000. Cars and motorcycles may need 1/2000 or faster." },
    { q: "How do I create intentional motion blur?", a: "Use a slower shutter speed relative to the subject motion. For waterfalls, try 1/4 to 2 seconds. For light trails, use 5-30 seconds." },
    { q: "What is panning?", a: "Panning means moving the camera to follow a moving subject while using a slower shutter speed. This keeps the subject relatively sharp while blurring the background to convey speed." }
  ],
  `Angular Speed = (Speed / Distance) x (180 / PI)
Freeze Shutter = Angular Speed x Focal Length / 50 x 50
Target Shutter = Freeze Shutter x Intent Multiplier`,
  ["exposure-triangle-calculator", "hyperfocal-distance-calculator"]
);

add(
  "aspect-ratio-resize-calculator",
  "Aspect Ratio Resize Calculator",
  "Calculate new dimensions when resizing images or video while maintaining or converting between aspect ratios.",
  "Conversion",
  "conversion",
  "R",
  ["aspect ratio resize", "image resize calculator", "video aspect ratio", "resolution converter"],
  [
    '{ name: "sourceWidth", label: "Source Width (px)", type: "number", min: 1, max: 15360, defaultValue: 1920 }',
    '{ name: "sourceHeight", label: "Source Height (px)", type: "number", min: 1, max: 8640, defaultValue: 1080 }',
    '{ name: "targetRatio", label: "Target Aspect Ratio", type: "select", options: [{ value: "1", label: "16:9 (Widescreen)" }, { value: "2", label: "4:3 (Standard)" }, { value: "3", label: "1:1 (Square)" }, { value: "4", label: "9:16 (Vertical/TikTok)" }, { value: "5", label: "21:9 (Ultrawide)" }, { value: "6", label: "Keep Original" }], defaultValue: "1" }',
    '{ name: "targetWidth", label: "Target Width (px, 0=auto)", type: "number", min: 0, max: 15360, defaultValue: 0 }'
  ],
  `(inputs) => {
    const sw = inputs.sourceWidth as number;
    const sh = inputs.sourceHeight as number;
    const ratio = parseInt(inputs.targetRatio as string);
    const tw = inputs.targetWidth as number;
    const sourceRatio = sw / sh;
    const sourceGCD = (a, b) => b === 0 ? a : sourceGCD(b, a % b);
    const ratios = [0, 16/9, 4/3, 1, 9/16, 21/9, sourceRatio];
    const targetAR = ratios[ratio];
    const ratioLabels = ["", "16:9", "4:3", "1:1", "9:16", "21:9", Math.round(sourceRatio * 100) / 100 + ":1"];
    let finalW, finalH;
    if (tw > 0) {
      finalW = tw;
      finalH = Math.round(tw / targetAR);
    } else {
      finalW = sw;
      finalH = Math.round(sw / targetAR);
    }
    const cropW = Math.min(sw, Math.round(sh * targetAR));
    const cropH = Math.min(sh, Math.round(sw / targetAR));
    const megapixels = Math.round(finalW * finalH / 1000000 * 10) / 10;
    return {
      primary: { label: "Output Dimensions", value: formatNumber(finalW) + " x " + formatNumber(finalH) + " px" },
      details: [
        { label: "Target Aspect Ratio", value: ratioLabels[ratio] },
        { label: "Source Aspect Ratio", value: formatNumber(Math.round(sourceRatio * 100) / 100) + ":1" },
        { label: "Crop Region", value: formatNumber(cropW) + " x " + formatNumber(cropH) + " px" },
        { label: "Output Megapixels", value: formatNumber(megapixels) + " MP" }
      ]
    };
  }`,
  [
    { q: "What aspect ratio is best for social media?", a: "Instagram feeds use 1:1 or 4:5, Stories and Reels use 9:16, YouTube uses 16:9, and TikTok uses 9:16. Each platform has its preferred ratio." },
    { q: "What happens when I change aspect ratio?", a: "Changing aspect ratio requires either cropping (cutting parts of the image), letterboxing (adding black bars), or stretching (distorting the image). Cropping is usually preferred." },
    { q: "What is the most common video aspect ratio?", a: "16:9 is the standard for most video content including TV, YouTube, and streaming. Cinema uses wider ratios like 2.39:1 or 21:9." }
  ],
  `Output Height = Width / Aspect Ratio
Crop Width = min(Source Width, Source Height x Aspect Ratio)
Crop Height = min(Source Height, Source Width / Aspect Ratio)`,
  ["golden-ratio-composition-calculator", "print-resolution-calculator"]
);

add(
  "film-grain-iso-calculator",
  "Film Grain ISO Equivalent Calculator",
  "Convert between analog film grain sizes and digital ISO equivalents, and estimate visible noise levels for film simulation.",
  "Conversion",
  "conversion",
  "R",
  ["film grain", "ISO equivalent", "analog film digital", "film stock ISO", "grain size"],
  [
    '{ name: "filmStock", label: "Film Stock Type", type: "select", options: [{ value: "1", label: "Kodak Portra 160" }, { value: "2", label: "Kodak Portra 400" }, { value: "3", label: "Kodak Portra 800" }, { value: "4", label: "Fuji Superia 400" }, { value: "5", label: "Ilford HP5 Plus 400" }, { value: "6", label: "Kodak Tri-X 400" }, { value: "7", label: "Ilford Delta 3200" }], defaultValue: "2" }',
    '{ name: "pushStops", label: "Push/Pull (stops)", type: "number", min: -2, max: 3, defaultValue: 0 }',
    '{ name: "scanResolution", label: "Scan Resolution (DPI)", type: "number", min: 300, max: 10000, defaultValue: 4000 }',
    '{ name: "format", label: "Film Format", type: "select", options: [{ value: "1", label: "35mm" }, { value: "2", label: "Medium Format (120)" }, { value: "3", label: "Large Format (4x5)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const stock = parseInt(inputs.filmStock as string);
    const push = inputs.pushStops as number;
    const scanDPI = inputs.scanResolution as number;
    const format = parseInt(inputs.format as string);
    const baseISOs = [0, 160, 400, 800, 400, 400, 400, 3200];
    const grainSizes = [0, 6, 8, 11, 9, 10, 10, 16];
    const baseISO = baseISOs[stock];
    const effectiveISO = Math.round(baseISO * Math.pow(2, push));
    const grainSize = grainSizes[stock] + push * 2;
    const formatGrainReduction = [0, 1.0, 0.5, 0.25][format];
    const visibleGrain = Math.round(grainSize * formatGrainReduction * 10) / 10;
    const digitalEquivISO = Math.round(effectiveISO * formatGrainReduction);
    const grainChar = visibleGrain < 6 ? "Very Fine" : visibleGrain < 9 ? "Fine" : visibleGrain < 12 ? "Moderate" : "Coarse";
    const megapixels35 = Math.round(scanDPI * 1.42 * scanDPI * 0.94 / 1000000 * 10) / 10;
    return {
      primary: { label: "Effective ISO", value: formatNumber(effectiveISO) },
      details: [
        { label: "Digital Noise Equivalent", value: "~ISO " + formatNumber(digitalEquivISO) },
        { label: "Grain Character", value: grainChar + " (" + formatNumber(visibleGrain) + "/20)" },
        { label: "Scan Resolution", value: formatNumber(megapixels35) + " MP equivalent" },
        { label: "Push/Pull", value: push >= 0 ? "+" + formatNumber(push) + " stops" : formatNumber(push) + " stops" }
      ]
    };
  }`,
  [
    { q: "Does pushing film increase grain?", a: "Yes. Pushing film (underexposing and overdeveloping) increases grain noticeably. Each stop of push increases visible grain. Pulling film reduces grain slightly." },
    { q: "How does film format affect grain?", a: "Larger film formats show less visible grain when printed at the same size because less enlargement is needed. Medium format shows about half the grain of 35mm." },
    { q: "What film stock has the finest grain?", a: "Among common stocks, Kodak Portra 160 and Fuji Velvia 50 have extremely fine grain. For black and white, Ilford Delta 100 and Kodak T-Max 100 are very fine-grained." }
  ],
  `Effective ISO = Base ISO x 2^(push stops)
Visible Grain = Base Grain + (Push x 2) x Format Reduction
Digital Equiv = Effective ISO x Format Grain Reduction`,
  ["exposure-triangle-calculator", "camera-sensor-crop-factor-calculator"]
);

add(
  "lighting-setup-cost-calculator",
  "Lighting Setup Cost Calculator",
  "Estimate the cost of photography and video lighting equipment packages for different production levels.",
  "Finance",
  "finance",
  "$",
  ["lighting equipment cost", "studio lighting budget", "video light setup", "photography lighting kit"],
  [
    '{ name: "setupType", label: "Setup Type", type: "select", options: [{ value: "1", label: "Beginner YouTube" }, { value: "2", label: "Portrait Studio" }, { value: "3", label: "Product Photography" }, { value: "4", label: "Video Production" }, { value: "5", label: "Film Set" }], defaultValue: "2" }',
    '{ name: "quality", label: "Equipment Tier", type: "select", options: [{ value: "1", label: "Budget" }, { value: "2", label: "Mid-Range" }, { value: "3", label: "Professional" }], defaultValue: "2" }',
    '{ name: "lightsCount", label: "Number of Lights", type: "number", min: 1, max: 20, defaultValue: 3 }',
    '{ name: "includeModifiers", label: "Include Modifiers", type: "select", options: [{ value: "1", label: "Basic (reflectors)" }, { value: "2", label: "Standard (softboxes + reflectors)" }, { value: "3", label: "Full (soft boxes, scrims, flags, gels)" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const setup = parseInt(inputs.setupType as string);
    const quality = parseInt(inputs.quality as string);
    const lights = inputs.lightsCount as number;
    const modifiers = parseInt(inputs.includeModifiers as string);
    const perLightCost = [0, [0, 50, 200, 600], [0, 100, 350, 900], [0, 80, 300, 800], [0, 150, 500, 1200], [0, 300, 800, 2000]][setup][quality];
    const modCost = [0, 30, 100, 300][modifiers] * lights;
    const standsCost = lights * [0, 25, 60, 150][quality];
    const accessoryCost = [0, 50, 150, 400][quality];
    const lightsCost = perLightCost * lights;
    const total = lightsCost + modCost + standsCost + accessoryCost;
    return {
      primary: { label: "Total Lighting Setup Cost", value: "$" + formatNumber(total) },
      details: [
        { label: "Lights Cost", value: "$" + formatNumber(lightsCost) + " (" + formatNumber(lights) + " lights)" },
        { label: "Modifiers", value: "$" + formatNumber(modCost) },
        { label: "Stands & Mounts", value: "$" + formatNumber(standsCost) },
        { label: "Accessories", value: "$" + formatNumber(accessoryCost) }
      ]
    };
  }`,
  [
    { q: "How many lights do I need for portraits?", a: "A classic portrait setup uses 2-3 lights: a key light, fill light, and optional hair/rim light. One-light setups with a reflector can also produce excellent results." },
    { q: "Are LED lights better than strobes?", a: "LEDs offer continuous light (great for video and beginners) and lower heat. Strobes provide more power per dollar and freeze motion. Many studios use both." },
    { q: "What light modifiers should I start with?", a: "Start with a large softbox or umbrella for your key light and a reflector for fill. Add a strip box for rim light as your second modifier." }
  ],
  `Total = (Light Cost x Count) + (Modifier Cost x Count) + Stands + Accessories
Costs vary by equipment tier and setup type`,
  ["film-budget-estimator", "green-screen-distance-calculator"]
);

add(
  "video-360-stitching-time-calculator",
  "360 Video Stitching Time Calculator",
  "Estimate processing time for stitching 360-degree video from multi-camera rigs based on resolution and hardware.",
  "Everyday",
  "everyday",
  "~",
  ["360 video stitching", "VR video processing", "360 camera stitching time", "panoramic video"],
  [
    '{ name: "duration", label: "Video Duration (minutes)", type: "number", min: 1, max: 120, defaultValue: 10 }',
    '{ name: "cameras", label: "Number of Cameras/Lenses", type: "number", min: 2, max: 24, defaultValue: 6 }',
    '{ name: "outputRes", label: "Output Resolution", type: "select", options: [{ value: "1", label: "4K (3840x1920)" }, { value: "2", label: "5.7K (5760x2880)" }, { value: "3", label: "8K (7680x3840)" }, { value: "4", label: "12K (11520x5760)" }], defaultValue: "2" }',
    '{ name: "hardware", label: "Processing Hardware", type: "select", options: [{ value: "1", label: "Laptop (integrated)" }, { value: "2", label: "Desktop (dedicated GPU)" }, { value: "3", label: "Workstation (high-end GPU)" }, { value: "4", label: "Cloud Rendering" }], defaultValue: "2" }'
  ],
  `(inputs) => {
    const duration = inputs.duration as number;
    const cameras = inputs.cameras as number;
    const outputRes = parseInt(inputs.outputRes as string);
    const hardware = parseInt(inputs.hardware as string);
    const resMultiplier = [0, 1, 2, 5, 12][outputRes];
    const cameraMultiplier = cameras / 6;
    const hwSpeed = [0, 0.2, 1, 3, 6][hardware];
    const stitchMinutes = Math.round(duration * resMultiplier * cameraMultiplier * 8 / hwSpeed);
    const stitchHours = Math.floor(stitchMinutes / 60);
    const stitchMins = stitchMinutes % 60;
    const timeStr = stitchHours > 0 ? stitchHours + "h " + stitchMins + "m" : stitchMins + " minutes";
    const ratio = Math.round(stitchMinutes / duration * 10) / 10;
    const storageGB = Math.round(duration * resMultiplier * cameras * 0.5 * 10) / 10;
    return {
      primary: { label: "Estimated Stitching Time", value: timeStr },
      details: [
        { label: "Processing Ratio", value: formatNumber(ratio) + ":1 (process:real)" },
        { label: "Source Footage", value: formatNumber(cameras) + " streams x " + formatNumber(duration) + " min" },
        { label: "Estimated Source Storage", value: formatNumber(storageGB) + " GB" },
        { label: "Stitching Minutes", value: formatNumber(stitchMinutes) }
      ]
    };
  }`,
  [
    { q: "How long does 360 video stitching take?", a: "Stitching time depends heavily on resolution and hardware. A 10-minute 5.7K clip can take 20-60 minutes on a desktop with a dedicated GPU." },
    { q: "Can I stitch 360 video in real time?", a: "Real-time stitching is possible for 4K output with hardware encoders and optimized rigs, but quality is lower than offline stitching." },
    { q: "What software is used for 360 stitching?", a: "Popular options include Insta360 Studio, Mistika VR, AutoPano Video Pro, and PTGui Pro. Some cameras like Insta360 and GoPro MAX include proprietary software." }
  ],
  `Stitch Time = Duration x Resolution Multiplier x (Cameras / 6) x 8 / Hardware Speed
Source Storage = Duration x Resolution x Cameras x 0.5 GB`,
  ["video-render-time-estimator", "video-storage-estimator"]
);

add(
  "lens-compression-distance-calculator",
  "Lens Compression Distance Calculator",
  "Calculate the apparent background compression effect at different focal lengths and subject distances for portrait photography.",
  "Science",
  "science",
  "A",
  ["lens compression", "focal length compression", "portrait lens distance", "background compression"],
  [
    '{ name: "focalLength", label: "Focal Length (mm)", type: "number", min: 14, max: 600, defaultValue: 85 }',
    '{ name: "subjectDist", label: "Subject Distance (ft)", type: "number", min: 1, max: 200, defaultValue: 10 }',
    '{ name: "bgDist", label: "Background Distance (ft)", type: "number", min: 2, max: 2000, defaultValue: 50 }',
    '{ name: "sensorType", label: "Sensor Type", type: "select", options: [{ value: "1", label: "Full Frame" }, { value: "2", label: "APS-C (1.5x)" }, { value: "3", label: "Micro Four Thirds (2.0x)" }], defaultValue: "1" }'
  ],
  `(inputs) => {
    const fl = inputs.focalLength as number;
    const subDist = inputs.subjectDist as number;
    const bgDist = inputs.bgDist as number;
    const sensor = parseInt(inputs.sensorType as string);
    const cropFactor = [0, 1.0, 1.5, 2.0][sensor];
    const eqFL = fl * cropFactor;
    const compressionRatio = Math.round(bgDist / subDist * 100) / 100;
    const bgMagnification = Math.round(fl / 50 * 100) / 100;
    const fov = 2 * Math.atan(36 / (2 * eqFL)) * (180 / Math.PI);
    const bgApparentSize = Math.round(bgMagnification * 100);
    const perspective = eqFL < 35 ? "Wide — exaggerated perspective, distant background" : eqFL < 70 ? "Normal — natural perspective" : eqFL < 135 ? "Telephoto — compressed, flattering portraits" : "Super telephoto — extreme compression";
    return {
      primary: { label: "Background Magnification", value: formatNumber(bgMagnification) + "x vs 50mm" },
      details: [
        { label: "Compression Ratio", value: formatNumber(compressionRatio) + ":1" },
        { label: "Equivalent Focal Length", value: formatNumber(Math.round(eqFL)) + " mm" },
        { label: "Field of View", value: formatNumber(Math.round(fov * 10) / 10) + "°" },
        { label: "Perspective Character", value: perspective }
      ]
    };
  }`,
  [
    { q: "What is lens compression?", a: "Lens compression is the apparent flattening of depth when using longer focal lengths from farther away. The background appears larger and closer relative to the subject." },
    { q: "What focal length is best for portraits?", a: "85mm to 135mm (full frame equivalent) is ideal for portraits. These focal lengths provide flattering perspective and pleasant background compression." },
    { q: "Does crop factor affect compression?", a: "Crop factor changes the effective field of view but not the actual perspective. A 50mm on APS-C frames like a 75mm on full frame, but the perspective compression is determined by the subject distance, not the focal length itself." }
  ],
  `Background Magnification = Focal Length / 50
Compression Ratio = Background Distance / Subject Distance
Field of View = 2 x atan(36 / (2 x Equivalent FL))`,
  ["camera-sensor-crop-factor-calculator", "depth-of-field-calculator"]
);

add(
  "pixel-density-ppi-calculator",
  "Pixel Density PPI Calculator",
  "Calculate pixels per inch (PPI) for displays and prints to determine sharpness and optimal viewing distance for photography.",
  "Conversion",
  "conversion",
  "R",
  ["pixel density", "PPI calculator", "pixels per inch", "screen resolution density", "retina display"],
  [
    '{ name: "widthPx", label: "Width (pixels)", type: "number", min: 1, max: 15360, defaultValue: 3840 }',
    '{ name: "heightPx", label: "Height (pixels)", type: "number", min: 1, max: 8640, defaultValue: 2160 }',
    '{ name: "diagonal", label: "Diagonal Size (inches)", type: "number", min: 1, max: 120, defaultValue: 27 }'
  ],
  `(inputs) => {
    const w = inputs.widthPx as number;
    const h = inputs.heightPx as number;
    const diag = inputs.diagonal as number;
    const diagPx = Math.sqrt(w * w + h * h);
    const ppi = Math.round(diagPx / diag * 10) / 10;
    const optimalViewDist = Math.round(3438 / ppi * 10) / 10;
    const isRetina = ppi > 200 ? "Yes (> 200 PPI)" : ppi > 150 ? "Borderline" : "No (< 150 PPI)";
    const totalPixels = w * h;
    const megapixels = Math.round(totalPixels / 1000000 * 10) / 10;
    const dotPitch = Math.round(25.4 / ppi * 1000) / 1000;
    return {
      primary: { label: "Pixel Density", value: formatNumber(ppi) + " PPI" },
      details: [
        { label: "Retina Quality", value: isRetina },
        { label: "Optimal Viewing Distance", value: formatNumber(optimalViewDist) + " inches" },
        { label: "Dot Pitch", value: formatNumber(dotPitch) + " mm" },
        { label: "Total Pixels", value: formatNumber(megapixels) + " MP (" + formatNumber(totalPixels) + ")" }
      ]
    };
  }`,
  [
    { q: "What PPI is considered 'retina' quality?", a: "Apple defines retina as when pixels are indistinguishable at normal viewing distance — roughly 220+ PPI for phones held at 10 inches, and 110+ PPI for monitors at 20 inches." },
    { q: "What PPI should I use for photo prints?", a: "300 PPI is the standard for high-quality photo prints. 150 PPI is acceptable for large prints viewed from a distance. Billboards can use 10-30 PPI." },
    { q: "Does higher PPI always mean better?", a: "Above a certain PPI, the human eye cannot distinguish individual pixels. For desktop monitors at typical viewing distance, 110-140 PPI is standard and 200+ is excellent." }
  ],
  `PPI = sqrt(Width^2 + Height^2) / Diagonal Size
Optimal Viewing Distance = 3438 / PPI (in inches)
Dot Pitch = 25.4 / PPI (in mm)`,
  ["print-resolution-calculator", "aspect-ratio-resize-calculator", "nd-filter-exposure-calculator"]
);

add(
  "nd-filter-exposure-calculator",
  "ND Filter Exposure Calculator",
  "Calculate adjusted exposure settings when using neutral density filters for long exposure photography.",
  "Science",
  "science",
  "A",
  ["ND filter", "neutral density filter", "long exposure calculator", "ND stops", "ND filter exposure"],
  [
    '{ name: "baseShutter", label: "Base Shutter Speed (1/x sec)", type: "number", min: 1, max: 8000, defaultValue: 125 }',
    '{ name: "ndStops", label: "ND Filter Strength (stops)", type: "select", options: [{ value: "1", label: "1 stop (ND2)" }, { value: "2", label: "2 stops (ND4)" }, { value: "3", label: "3 stops (ND8)" }, { value: "6", label: "6 stops (ND64)" }, { value: "10", label: "10 stops (ND1000)" }, { value: "15", label: "15 stops (ND32768)" }], defaultValue: "6" }',
    '{ name: "aperture", label: "Aperture (f-stop)", type: "number", min: 1, max: 64, defaultValue: 11 }',
    '{ name: "iso", label: "ISO", type: "number", min: 50, max: 12800, defaultValue: 100 }'
  ],
  `(inputs) => {
    const baseShutter = inputs.baseShutter as number;
    const ndStops = parseInt(inputs.ndStops as string);
    const aperture = inputs.aperture as number;
    const iso = inputs.iso as number;
    const baseSeconds = 1 / baseShutter;
    const newSeconds = baseSeconds * Math.pow(2, ndStops);
    const ndFactor = Math.pow(2, ndStops);
    let shutterStr;
    if (newSeconds < 1) {
      shutterStr = "1/" + Math.round(1 / newSeconds) + " sec";
    } else if (newSeconds < 60) {
      shutterStr = Math.round(newSeconds * 10) / 10 + " seconds";
    } else {
      const mins = Math.floor(newSeconds / 60);
      const secs = Math.round(newSeconds % 60);
      shutterStr = mins + "m " + secs + "s";
    }
    return {
      primary: { label: "New Shutter Speed", value: shutterStr },
      details: [
        { label: "Base Shutter", value: "1/" + formatNumber(baseShutter) + " sec" },
        { label: "ND Factor", value: formatNumber(ndFactor) + "x (ND" + formatNumber(ndFactor) + ")" },
        { label: "Stops of Reduction", value: formatNumber(ndStops) + " stops" },
        { label: "New Exposure Time", value: formatNumber(Math.round(newSeconds * 100) / 100) + " sec" }
      ]
    };
  }`,
  [
    { q: "What ND filter should I buy first?", a: "A 6-stop (ND64) is the most versatile choice. It allows long exposures in daylight for smooth water and cloud effects while still being usable in lower light." },
    { q: "Can I stack ND filters?", a: "Yes, stacking filters adds their stop values together. A 3-stop and 6-stop stacked equals 9 stops. However, stacking can introduce vignetting and reduce image quality." },
    { q: "What is a 10-stop ND filter used for?", a: "A 10-stop ND filter is used for extreme long exposures in bright daylight — turning a 1/125 second exposure into about 8 seconds, creating smooth water and streaked clouds." }
  ],
  `New Shutter Speed = Base Shutter Speed x 2^(ND stops)
ND Factor = 2^(stops)
Example: ND64 = 6 stops = 64x light reduction`,
  ["exposure-triangle-calculator", "motion-blur-shutter-speed-calculator"]
);
