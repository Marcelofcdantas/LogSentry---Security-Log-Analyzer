const fs = require("fs");
const path = require("path");

function generateReport(logEntries, detectionResults) {
  const uniqueIps = new Set(logEntries.map((entry) => entry.ip));
  const suspiciousIpSet = new Set(detectionResults.map((item) => item.ip));

  return {
    summary: {
      total_requests: logEntries.length,
      unique_ips: uniqueIps.size,
      suspicious_ips: suspiciousIpSet.size,
      suspicious_events: detectionResults.length,
    },
    suspicious_activity: detectionResults,
  };
}

function saveReportToFile(report, outputPath = "report.json") {
  const resolvedPath = path.resolve(outputPath);
  fs.writeFileSync(resolvedPath, JSON.stringify(report, null, 2), "utf-8");
  return resolvedPath;
}

module.exports = {
  generateReport,
  saveReportToFile,
};