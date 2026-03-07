const { parseLogLine } = require("../src/parser/logParser");

test("should parse a valid log line", () => {
  const line =
    '192.168.1.10 - - [07/Mar/2026:10:32:15] "GET /admin HTTP/1.1" 401';

  const result = parseLogLine(line);

  expect(result).toEqual({
    ip: "192.168.1.10",
    timestamp: "07/Mar/2026:10:32:15",
    method: "GET",
    endpoint: "/admin",
    status: 401,
  });
});

test("should return null for invalid log line", () => {
  const line = "invalid log line";
  const result = parseLogLine(line);
  expect(result).toBeNull();
});