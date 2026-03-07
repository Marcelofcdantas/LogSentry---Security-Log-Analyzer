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
const {
  generateReport,
  saveReportToFile,
} = require("../reports/reportGenerator");

router.get("/", (req, res) => {
  try {
    const filePath = req.query.file || "sample-logs/access.log";
    const saveToFile = req.query.save === "true";

    const logEntries = parseLogFile(filePath);

    const detectionResults = [
      ...detectBruteForce(logEntries),
      ...detectSensitiveEndpointScanning(logEntries),
      ...detectHighRequestRate(logEntries),
      ...detectRepeated404(logEntries),
    ];

    const report = generateReport(logEntries, detectionResults);

    if (saveToFile) {
      const savedPath = saveReportToFile(report, "report.json");
      return res.json({
        message: "Analysis complete and report saved successfully.",
        saved_to: savedPath,
        report,
      });
    }

    return res.json(report);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to analyze log file.",
      details: error.message,
    });
  }
});

module.exports = router;