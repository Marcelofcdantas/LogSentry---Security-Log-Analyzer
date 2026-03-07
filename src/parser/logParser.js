const fs = require("fs");
const path = require("path");

function parseLogLine(line) {
  const regex =
    /^(\d+\.\d+\.\d+\.\d+)\s-\s-\s\[(.*?)\]\s"(\w+)\s(.*?)\sHTTP\/[\d.]+"\s(\d{3})$/;

  const match = line.trim().match(regex);

  if (!match) {
    return null;
  }

  return {
    ip: match[1],
    timestamp: match[2],
    method: match[3],
    endpoint: match[4],
    status: Number(match[5]),
  };
}

function parseLogFile(filePath) {
  const resolvedPath = path.resolve(filePath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Log file not found: ${resolvedPath}`);
  }

  const content = fs.readFileSync(resolvedPath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim() !== "");

  return lines.map(parseLogLine).filter(Boolean);
}

module.exports = {
  parseLogLine,
  parseLogFile,
};