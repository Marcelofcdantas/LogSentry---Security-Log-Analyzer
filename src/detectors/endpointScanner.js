function detectSensitiveEndpointScanning(logEntries, threshold = 3) {
  const sensitiveEndpoints = ["/admin", "/login", "/wp-admin", "/config"];
  const accessCountByIp = {};

  for (const entry of logEntries) {
    const isSensitive = sensitiveEndpoints.some((endpoint) =>
      entry.endpoint.startsWith(endpoint)
    );

    if (isSensitive) {
      accessCountByIp[entry.ip] = (accessCountByIp[entry.ip] || 0) + 1;
    }
  }

  return Object.entries(accessCountByIp)
    .filter(([, requests]) => requests >= threshold)
    .map(([ip, requests]) => ({
      ip,
      type: "sensitive_endpoint_scanning",
      requests,
    }));
}

module.exports = {
  detectSensitiveEndpointScanning,
};