import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import invoiceRoutes from "./routes/invoice.routes";
//import authRoutes from "./routes/auth.routes";
import customerRoutes from "./routes/customer.routes";
import pdfRoutes from "./routes/pdf.routes";
import searchRoutes from "./routes/search.routes"; 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
//app.use("/api/auth", authRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/search", searchRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Invoice SaaS API Running",
    timestamp: new Date(),
  });
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});