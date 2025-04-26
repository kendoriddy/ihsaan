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

export {
  formatDate,
  serverDateFormat,
  logout,
  logoutAfterSixHours,
  isLoggedIn,
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
};
