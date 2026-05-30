import { Request, Response } from "express";
import prisma from "../config/prisma";

const generateInvoiceNumber = async (): Promise<string> => {
  const lastInvoice = await prisma.invoice.findFirst({
    orderBy: { createdAt: "desc" },
  });

  let nextNumber = 1;

  if (lastInvoice?.invoiceNumber) {
    const match = lastInvoice.invoiceNumber.match(/\d+$/);
    if (match) {
      nextNumber = Number(match[0]) + 1;
    }
  }

  return `INV-${String(nextNumber).padStart(5, "0")}`;
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const {
      customerId,
      items,
      cgst = 0,
      sgst = 0,
      notes,
      paymentStatus = "PENDING",
      invoiceDate,
      dueDate,
    } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: "customerId required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items required" });
    }

    let subtotal = 0;

    const formattedItems = items.map((item: any) => {
      const quantity = Number(item.quantity || 0);
      const price = Number(item.price || 0);
      const total = quantity * price;

      subtotal += total;

      return {
        description: item.description || "",
        quantity,
        price,
        gst: Number(item.gst || 0),
        total,
      };
    });

    const cgstAmount = (subtotal * Number(cgst)) / 100;
    const sgstAmount = (subtotal * Number(sgst)) / 100;
    const total = subtotal + cgstAmount + sgstAmount;

    const invoiceNumber = await generateInvoiceNumber();

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,

        invoiceDate: invoiceDate ? new Date(invoiceDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,

        subtotal,
        cgst: cgstAmount,
        sgst: sgstAmount,
        total,

        paymentStatus,
        notes,
        customerId,

        items: {
          create: formattedItems,
        },
      },

      include: {
        customer: true,
        items: true,
      },
    });

    return res.status(201).json(invoice);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating invoice",
      error: error?.message,
    });
  }
};

export const getInvoices = async (_req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        customer: true,
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(invoices);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error fetching invoices",
      error: error?.message,
    });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        items: true,
        payments: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.json(invoice);
  } catch (error: any) {
    return res.status(500).json({
      message: "Error fetching invoice",
      error: error?.message,
    });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: req.body,
    });

    return res.json(invoice);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to update invoice",
      error: error?.message,
    });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: id },
    });

    await prisma.payment.deleteMany({
      where: { invoiceId: id },
    });

    await prisma.invoice.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: "Invoice deleted",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Delete failed",
      error: error?.message,
    });
  }
};

export const markInvoicePaid = async (req: Request, res: Response) => {
  try {
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: { paymentStatus: "PAID" },
    });

    return res.json(invoice);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to update payment status",
      error: error?.message,
    });
  }
};

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany();

    const customerCount = await prisma.customer.count();

    const revenue = invoices.reduce(
      (sum, invoice) => sum + Number(invoice.total),
      0
    );

    const pending = invoices.filter(
      (invoice) => invoice.paymentStatus !== "PAID"
    ).length;

    res.json({
      invoices: invoices.length,
      customers: customerCount,
      revenue,
      pending,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed loading stats",
      error: error?.message,
    });
  }
};