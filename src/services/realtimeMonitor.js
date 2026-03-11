const fs = require("fs");
const { readNewLogEntries, resolveLogPath } = require("../parser/logParser");
const { detectBruteForce } = require("../detectors/bruteForceDetector");
const { detectSensitiveEndpointScanning } = require("../detectors/endpointScanner");
const {
  detectHighRequestRate,
  detectRepeated404,
} = require("../detectors/anomalyDetector");
const { generateReport } = require("../reports/reportGenerator");

function analyzeEntries(logEntries) {
  const detectionResults = [
    ...detectBruteForce(logEntries),
    ...detectSensitiveEndpointScanning(logEntries),
    ...detectHighRequestRate(logEntries),
    ...detectRepeated404(logEntries),
  ];

  return generateReport(logEntries, detectionResults);
}

function monitorLogFile(filePath, onUpdate) {
  const resolvedPath = resolveLogPath(filePath);
  let currentPosition = 0;
  let allEntries = [];

  const initialRead = readNewLogEntries(resolvedPath, currentPosition);
  allEntries = [...initialRead.entries];
  currentPosition = initialRead.newPosition;

  onUpdate({
    type: "initial",
    report: analyzeEntries(allEntries),
  });

  const watcher = fs.watch(resolvedPath, (eventType) => {
    if (eventType !== "change") {
      return;
    }

    try {
      const result = readNewLogEntries(resolvedPath, currentPosition);

      if (result.entries.length > 0) {
        allEntries = [...allEntries, ...result.entries];
        currentPosition = result.newPosition;

        onUpdate({
          type: "update",
          newEntries: result.entries,
          report: analyzeEntries(allEntries),
        });
      }
    } catch (error) {
      onUpdate({
        type: "error",
        error: error.message,
      });
    }
  });

  return watcher;
}

module.exports = {
  monitorLogFile,
};