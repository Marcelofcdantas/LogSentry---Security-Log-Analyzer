const express = require("express");
const analyzeRoute = require("./routes/analyze");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "LogSentry API is running.",
    endpoints: {
      analyze_default: "GET /analyze",
      analyze_custom_file: "GET /analyze?file=sample-logs/access.log",
      analyze_and_save: "GET /analyze?file=sample-logs/access.log&save=true"
    }
  });
});

app.use("/analyze", analyzeRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});