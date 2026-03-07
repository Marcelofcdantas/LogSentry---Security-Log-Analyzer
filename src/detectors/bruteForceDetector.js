function detectBruteForce(logEntries, threshold = 5) {
  const failedAttemptsByIp = {};

  for (const entry of logEntries) {
    const isLoginEndpoint =
      entry.endpoint.includes("/login") || entry.endpoint.includes("/admin");
    const isFailed = entry.status === 401 || entry.status === 403;

    if (isLoginEndpoint && isFailed) {
      failedAttemptsByIp[entry.ip] = (failedAttemptsByIp[entry.ip] || 0) + 1;
    }
  }

  return Object.entries(failedAttemptsByIp)
    .filter(([, attempts]) => attempts >= threshold)
    .map(([ip, attempts]) => ({
      ip,
      type: "brute_force",
      attempts,
    }));
}

module.exports = {
  detectBruteForce,
};