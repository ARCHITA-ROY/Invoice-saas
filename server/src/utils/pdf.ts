import PDFDocument from "pdfkit";

export const generateInvoicePDF = (invoice: any, res: any) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${invoice.invoiceNumber}.pdf`
  );

  doc.pipe(res);

  // ================= HEADER =================
  doc.fontSize(22).text("INVOICE", { align: "center" });
  doc.moveDown(1);

  doc.fontSize(12);
  doc.text(`Invoice No: ${invoice.invoiceNumber}`);
  doc.text(`Date: ${new Date(invoice.invoiceDate).toDateString()}`);
  doc.text(`Status: ${invoice.paymentStatus || "PENDING"}`);

  doc.moveDown();

  // ================= CUSTOMER =================
  doc.fontSize(14).text("BILL TO:", { underline: true });
  doc.fontSize(12);
  doc.text(invoice.customer.name);
  doc.text(invoice.customer.email || "-");
  doc.text(invoice.customer.phone || "-");

  doc.moveDown();

  // ================= TABLE HEADER =================
  doc.fontSize(12);
  doc.text("Description", 50, doc.y, { continued: false });
  doc.text("Qty", 250, doc.y, { width: 50 });
  doc.text("Price", 300, doc.y, { width: 80 });
  doc.text("Total", 400, doc.y);

  doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();

  doc.moveDown(0.5);

  // ================= ITEMS =================
  invoice.items.forEach((item: any) => {
    doc.text(item.description, 50);
    doc.text(String(item.quantity), 250);
    doc.text(`₹${item.price}`, 300);
    doc.text(`₹${item.total}`, 400);
  });

  doc.moveDown();

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

  doc.moveDown();

  // ================= TOTALS =================
  doc.fontSize(12);

  doc.text(`Subtotal: ₹${invoice.subtotal}`, { align: "right" });
  doc.text(`CGST: ₹${invoice.cgst}`, { align: "right" });
  doc.text(`SGST: ₹${invoice.sgst}`, { align: "right" });

  doc.moveDown(0.5);

  doc.fontSize(14).text(`TOTAL: ₹${invoice.total}`, {
    align: "right",
    underline: true,
  });

  doc.moveDown(2);

  // ================= FOOTER =================
  doc.fontSize(10).text("Thank you for your business!", {
    align: "center",
  });

  doc.end();
};