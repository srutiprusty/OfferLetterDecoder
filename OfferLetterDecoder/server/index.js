import "dotenv/config";

import express from "express";
import cors from "cors";

import offerRoutes from "./routes/offerRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  }),
);

app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "OfferLens API is running.",
  });
});
app.get("/test-controller", async (req, res) => {
  const { calculateSalary } = await import("./utils/salaryCalculation.js");

  const testData = {
    salary: {
      ctcAnnual: 362928,
      fixedPayAnnual: 290340,
      variablePayAnnual: 27600,
      cityAllowanceAnnual: 2400,
      employeePFAnnual: null,
      employerPFAnnual: 21600,
      gratuityAnnual: 8658,
    },
  };

  return res.json({
    test: "NEW SERVER CODE",
    salaryAnalysis: calculateSalary(testData),
  });
});
// Offer routes
app.use("/api/offers", offerRoutes);

// Global error handler
app.use((err, req, res, next) => {
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "PDF must be smaller than 10 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err.message);

  return res.status(500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
});
/* 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`OfferLens server running on port ${PORT}`);
});
 */
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`OfferLens server running on port ${PORT}`);
});

server.on("close", () => {
  console.log("HTTP server was closed!");
});

server.on("error", (error) => {
  console.error("Server error:", error);
});
