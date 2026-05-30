import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller";

const router = express.Router();

router.post("/", createCustomer);
router.get("/", getCustomers);
router.get("/:id", getCustomerById);

// ✅ THIS IS REQUIRED FOR SAVE BUTTON
router.put("/:id", updateCustomer);

// optional
router.delete("/:id", deleteCustomer);

export default router;