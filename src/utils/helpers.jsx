// Helper function to convert minutes to hours and minutes
export const convertMinutesToHourMinuteFormat = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours > 0 ? `${hours}h` : ""} ${
    minutes > 0 ? `${minutes}min` : ""
  }`.trim();
};

// Utility function to format ISO date to "yyyy-MM-dd"
export const formatDateForInput = (isoDateString) => {
  return new Date(isoDateString).toISOString().split("T")[0];
};

// Utility function to extract numeric values from strings (e.g., "30 min" -> 30)
export const extractNumericValue = (value) => {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const numericValue = value.match(/\d+/);
    return numericValue ? parseFloat(numericValue[0]) : 0;
  }
  return 0;
};
