// CALCULATE WORK TIME
const calculateWorkTime = (checkin, checkout) => {
  const checkinParts = checkin.split(":");
  const checkoutParts = checkout.split(":");
  const checkInDate = new Date();
  checkInDate.setHours(parseInt(checkinParts[0], 10));
  checkInDate.setMinutes(parseInt(checkinParts[1], 10));

  const checkOutDate = new Date();
  checkOutDate.setHours(parseInt(checkoutParts[0], 10));
  checkOutDate.setMinutes(parseInt(checkoutParts[1], 10));

  const diff = checkOutDate - checkInDate;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
};

const calculateActualWorkHours = (hours) => {
  // Extract integer and decimal parts
  const integerPart = Math.floor(hours);
  const decimalPart = Math.round((hours - integerPart) * 60);

  // Format hour and minute strings
  const hourString = integerPart.toString().padStart(2, "0");
  const minuteString = decimalPart.toString().padStart(2, "0");

  // Return the result string
  return `${hourString}:${minuteString}`;
};
module.exports = { calculateWorkTime, calculateActualWorkHours };
