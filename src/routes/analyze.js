const express = require("express");
const router = express.Router();

const { parseLogFile } = require("../parser/logParser");
const { detectBruteForce } = require("../detectors/bruteForceDetector");
const {
  detectSensitiveEndpointScanning,
} = require("../detectors/endpointScanner");
const {
  detectHighRequestRate,
  detectRepeated404,
} = require("../detectors/anomalyDetector");
const { generateReport } = require("../reports/reportGenerator");
const { monitorLogFile } = require("../services/realtimeMonitor");

function runAnalysis(logEntries) {
  const detectionResults = [
    ...detectBruteForce(logEntries),
    ...detectSensitiveEndpointScanning(logEntries),
    ...detectHighRequestRate(logEntries),
    ...detectRepeated404(logEntries),
  ];

  return generateReport(logEntries, detectionResults);
}

router.get("/", (req, res) => {
  try {
    const filePath = req.query.file || "sample-logs/access.log";
    const realtime = req.query.realtime === "true";

    if (!realtime) {
      const logEntries = parseLogFile(filePath);
      const report = runAnalysis(logEntries);

      return res.json({
        mode: "single-run",
        file: filePath,
        report,
      });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const watcher = monitorLogFile(filePath, (payload) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    });

    req.on("close", () => {
      watcher.close();
      res.end();
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to analyze log file",
      details: error.message,
    });
  }
});

module.exports = router;