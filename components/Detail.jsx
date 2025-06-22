export const Detail = ({ label, value, full = false }) => (
  <div className={`flex flex-col ${full ? "sm:col-span-2" : ""}`}>
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-base text-gray-800 font-medium">
      {typeof value === "string" && value.length > 0
        ? value.charAt(0).toUpperCase() + value.slice(1)
        : value}
    </span>
  </div>
);
