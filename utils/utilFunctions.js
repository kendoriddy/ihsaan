// Utility function to validate and normalize URLs
const normalizeUrl = (string) => {
  if (!string || typeof string !== "string" || string.trim() === "") {
    return null;
  }

  const trimmedString = string.trim();

  // If it already has a protocol, return as is
  if (
    trimmedString.startsWith("http://") ||
    trimmedString.startsWith("https://")
  ) {
    try {
      new URL(trimmedString);
      return trimmedString;
    } catch (_) {
      return null;
    }
  }

  // If it doesn't have a protocol, try adding https://
  const urlWithProtocol = `https://${trimmedString}`;
  try {
    new URL(urlWithProtocol);
    return urlWithProtocol;
  } catch (_) {
    return null;
  }
};

// Format date to be displayed on the UI
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
    timeZone: "UTC",
  });

  return formattedDate;
};

// Format date to be sent to the server
const serverDateFormat = (date) => {
  let d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

// Log user out
const logout = () => {
  localStorage.removeItem("loggedInTime");
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("email");
  localStorage.removeItem("first_name");
  window.location.href = "/login";
};

// Log out after 6 hours of logging in
const logoutAfterSixHours = () => {
  // Retrieve loginTime from localStorage
  const loginTimeString = localStorage.getItem("loggedInTime");
  if (loginTimeString) {
    // Convert the string back to a Date object
    const loginTime = new Date(Date.parse(loginTimeString));
    // Get the current time
    const currentTime = new Date();
    // Calculate the difference in milliseconds
    const timeDifference = currentTime - loginTime;
    // Convert the difference to hours
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    // Check if the difference is greater than 6 hours
    if (hoursDifference > 6) {
      logout();
    }
  }
};

// Is the user logged in?
const isLoggedIn = () => {
  const loggedInTime =
    typeof window !== "undefined" ? localStorage.getItem("loggedInTime") : null;
  if (loggedInTime) {
    return true;
  } else {
    return false;
  }
};

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return (
    <div className="font-bold text-red-600">
      {minutes}:{seconds < 10 ? "0" : ""}
      {seconds}
    </div>
  );
};
// Helper function to extract video duration from file
const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("video/")) {
      reject(new Error("Invalid video file"));
      return;
    }

    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      resolve(duration);
    };

    video.onerror = () => {
      window.URL.revokeObjectURL(video.src);
      reject(new Error("Failed to load video metadata"));
    };

    video.src = URL.createObjectURL(file);
  });
};

// Helper function to format duration from seconds to readable format
const formatDurationFromSeconds = (seconds) => {
  if (!seconds || isNaN(seconds)) return "00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  } else {
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
};

// Helper function to convert duration to seconds
const convertDurationToSeconds = (duration) => {
  if (!duration) return 0; // Handle empty or null input

  const parts = duration.split(":").map(Number);

  if (parts.length === 3) {
    // Format: hh:mm:ss
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // Format: mm:ss
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1 && !isNaN(parts[0])) {
    // Single number (assume it's in minutes)
    return parts[0] * 60;
  }

  return 0; // Default to 0 if the format is invalid
};

const countryNames = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia (Czech Republic)",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const allPossibleQualifications = [
  "High School Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate (PhD)",
  "Professional Certificate",
  "Vocational Training",
  "Diploma",
  "Postgraduate Certificate",
  "Postgraduate Diploma",
  "Fellowship",
  "Residency",
  "Apprenticeship",
  "Trade Certification",
  "Continuing Education",
  "Executive Education",
  "Online Course Certification",
  "Industry Certification",
  "Licensure",
  "Specialization Certificate",
];

const countriesList = countryNames.map((country) => {
  return { key: country, value: country.toLowerCase().replace(/\s+/g, "-") };
});
const qualificationsList = allPossibleQualifications.map((qualification) => {
  return {
    key: qualification,
    value: qualification.toLowerCase().replace(/\s+/g, "-"),
  };
});
// Create an array of numbers from 1 to 100
const yearsOfExperienceOptions = Array.from({ length: 100 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} year${i + 1 > 1 ? "s" : ""}`,
}));
const gender = [
  { key: "Male", value: "male" },
  { key: "Female", value: "female" },
];
const menteeGender = [
  { key: "Male", value: "male" },
  { key: "Female", value: "female" },
  { key: "Both", value: "both" },
];

const religion = [
  { key: "Islam", value: "islam" },
  { key: "Christanity", value: "christain" },
  { key: "Others", value: "others" },
];
const maritalStatus = [
  { key: "Single", value: "single" },
  { key: "Married", value: "married" },
  { key: "Others", value: "others" },
];

// utils/utilFunctions.js
export function formatQualification(qualification) {
  if (!qualification) return "N/A"; // Handle null or undefined

  return qualification
    .split("-") // Split the string by hyphens
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join the words back together with spaces
}

function getFileType(mimeType) {
  if (mimeType.startsWith("video/")) return "VIDEO";
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType === "application/pdf") return "DOCUMENT";
  if (
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "DOCUMENT";
  return "OTHERS";
}

const timeStringToMs = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return ((hours * 60 + minutes) * 60 + seconds) * 1000;
};

const formatDuration = (duration) => {
  if (!duration) return null;
  const [hh, mm, ss] = duration.split(":");
  const h = parseInt(hh);
  const m = parseInt(mm);
  if (h) return `${h}h ${m}m`;
  return `${m} minutes`;
};

// Convert decimal to fraction
export const decimalToFraction = (decimal) => {
  if (decimal === 0) return "0";
  if (decimal === 1) return "1";

  // Handle common fractions
  const commonFractions = {
    0.25: "1/4",
    0.5: "1/2",
    0.75: "3/4",
    0.33: "1/3",
    0.67: "2/3",
    0.2: "1/5",
    0.4: "2/5",
    0.6: "3/5",
    0.8: "4/5",
  };

  // Check if it's a common fraction
  const rounded = Math.round(decimal * 100) / 100;
  if (commonFractions[rounded]) {
    return commonFractions[rounded];
  }

  // For other decimals, convert to fraction
  const tolerance = 0.0001;
  let numerator = 1;
  let denominator = 1;
  let fraction = numerator / denominator;

  while (Math.abs(fraction - decimal) > tolerance) {
    if (fraction < decimal) {
      numerator++;
    } else {
      denominator++;
    }
    fraction = numerator / denominator;
  }

  // Simplify the fraction
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const divisor = gcd(numerator, denominator);
  numerator = Math.round(numerator / divisor);
  denominator = Math.round(denominator / divisor);

  return `${numerator}/${denominator}`;
};

export {
  normalizeUrl,
  formatDate,
  serverDateFormat,
  logout,
  logoutAfterSixHours,
  isLoggedIn,
  convertDurationToSeconds,
  getVideoDuration,
  formatDurationFromSeconds,
  countryNames,
  allPossibleQualifications,
  countriesList,
  qualificationsList,
  yearsOfExperienceOptions,
  gender,
  menteeGender,
  religion,
  maritalStatus,
  formatTime,
  getFileType,
  timeStringToMs,
  formatDuration,
};
