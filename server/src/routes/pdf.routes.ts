import express from "express";
import prisma from "../config/prisma";
import { generateInvoicePDF } from "../utils/pdf";

const router = express.Router();

router.get("/invoice/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    generateInvoicePDF(invoice, res);
  } catch (err) {
    res.status(500).json({ message: "PDF error", err });
  }
});

export default router;