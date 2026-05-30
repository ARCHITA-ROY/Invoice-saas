import express from "express";

import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  markInvoicePaid,
  getDashboardStats,
} from "../controllers/invoice.controller";

const router = express.Router();

router.get("/stats", getDashboardStats);

router.get("/", getInvoices);

router.get("/:id", getInvoiceById);

router.post("/", createInvoice);

router.put("/:id", updateInvoice);

router.patch("/:id/pay", markInvoicePaid);

router.delete("/:id", deleteInvoice);

export default router;