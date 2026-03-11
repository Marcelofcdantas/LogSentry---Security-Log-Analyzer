const express = require("express");
const analyzeRoute = require("./routes/analyze");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/analyze", analyzeRoute);

app.get("/", (req, res) => {
  res.send("LogSentry API is running.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});