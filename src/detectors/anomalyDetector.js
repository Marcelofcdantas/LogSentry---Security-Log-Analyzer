function detectHighRequestRate(logEntries, threshold = 20) {
  const requestCountByIp = {};

  for (const entry of logEntries) {
    requestCountByIp[entry.ip] = (requestCountByIp[entry.ip] || 0) + 1;
  }

  return Object.entries(requestCountByIp)
    .filter(([, requests]) => requests >= threshold)
    .map(([ip, requests]) => ({
      ip,
      type: "high_request_rate",
      requests,
    }));
}

function detectRepeated404(logEntries, threshold = 3) {
  const errorsByIp = {};

  for (const entry of logEntries) {
    if (entry.status === 404) {
      errorsByIp[entry.ip] = (errorsByIp[entry.ip] || 0) + 1;
    }
  }

  return Object.entries(errorsByIp)
    .filter(([, count]) => count >= threshold)
    .map(([ip, count]) => ({
      ip,
      type: "repeated_404_errors",
      count,
    }));
}

module.exports = {
  detectHighRequestRate,
  detectRepeated404,
};