// Outputs: Sat Apr 12 2025 18:12:31 GMT+0530 (India Standard Time)
function convertToDate(timestamp: any): Date {
  const milliseconds =
    timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6);
  return new Date(milliseconds);
}

export default convertToDate;
