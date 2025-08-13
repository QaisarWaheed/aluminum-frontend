import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface InvoiceData {
  invoiceNo: number;
  date: string;
  customerName: string;
  products: {
    quantity: number;
    productName: string;
    rate: number;
    amount: number;
  }[];
  totalAmount: number;
  previousAmount: number;
  receivedAmount: number;
  grandTotal: number;
}

export function generateInvoicePdf(
  data: InvoiceData,
  fileName = "invoice.pdf"
) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(`Invoice #${data.invoiceNo}`, 14, 20);

  doc.setFontSize(12);
  doc.text(`Date: ${data.date}`, 14, 30);
  doc.text(`Customer: ${data.customerName}`, 14, 38);

  const headers = ["Quantity", "Product Name", "Rate", "Amount"];

  const rows = data.products.map((product) => [
    product.quantity.toString(),
    product.productName,
    product.rate.toFixed(2),
    product.amount.toFixed(2),
  ]);

  // Add products table
  autoTable(doc, {
    startY: 45,
    head: [headers],
    body: rows,
    headStyles: { fillColor: [230, 230, 230] },
    styles: { halign: "center" },
    theme: "grid",
  });

  // Add totals below the table
  const finalY = (doc as any).lastAutoTable.finalY || 45;

  doc.setFontSize(12);
  doc.text(`Total Amount: ${data.totalAmount.toFixed(2)}`, 14, finalY + 15);
  doc.text(
    `Previous Amount: ${data.previousAmount.toFixed(2)}`,
    14,
    finalY + 25
  );
  doc.text(
    `Received Amount: ${data.receivedAmount.toFixed(2)}`,
    14,
    finalY + 35
  );
  doc.text(`Grand Total: ${data.grandTotal.toFixed(2)}`, 14, finalY + 45);

  doc.save(fileName);
}
