import { Request, Response } from "express";
import prisma from "../config/prisma";

// CREATE
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, gstNumber } = req.body;

    const customer = await prisma.customer.create({
      data: { name, email, phone, address, gstNumber },
    });

    return res.status(201).json({
      success: true,
      customer,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to create customer",
      error: error?.message,
    });
  }
};

// GET ALL
export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, customers });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
};

// GET ONE
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: { invoices: true },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.json({ success: true, customer });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
    });
  }
};

// UPDATE (FIXED — ONLY ONE VERSION)
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: req.body,
    });

    return res.json({
      success: true,
      customer,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to update customer",
    });
  }
};

// DELETE
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    await prisma.customer.delete({
      where: { id: req.params.id },
    });

    return res.json({
      success: true,
      message: "Customer deleted",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete customer",
    });
  }
};