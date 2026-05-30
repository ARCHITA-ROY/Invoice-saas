import { Request, Response } from "express";
import prisma from "../config/prisma";

export const globalSearch = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || "";

    if (!q) return res.json([]);

    const invoices = await prisma.invoice.findMany({
      where: {
        OR: [
          {
            invoiceNumber: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            customer: {
              name: {
                contains: q,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        customer: true,
      },
      take: 10,
    });

    const customers = await prisma.customer.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      take: 10,
    });

    const results = [
      ...invoices.map((i) => ({
        id: i.id,
        type: "invoice" as const,
        label: i.invoiceNumber,   // ✅ FIXED
      })),

      ...customers.map((c) => ({
        id: c.id,
        type: "customer" as const,
        label: c.name,            // ✅ FIXED
      })),
    ];

    return res.json(results);
  } catch (error: any) {
    return res.status(500).json({
      message: "Search failed",
      error: error?.message,
    });
  }
};