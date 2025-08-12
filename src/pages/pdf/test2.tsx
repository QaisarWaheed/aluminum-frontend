import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface AluminumInvoiceData {
  invoiceNo: number;
  date: string;
  customerName: string;
  products: {
    quantity: number;
    section: number;
    size: number;
    gaje: string;
    color: string;
    rate: number;
    discount: number;
    amount: number;
  }[];
  totalAmount: number;
  previousAmount: number;
  receivedAmount: number;
  grandTotal: number;
}

export function generateAluminumInvoicePdf(
  data: AluminumInvoiceData,
  fileName = "aluminum-invoice.pdf"
) {
  const doc = new jsPDF();

  // Title and header
  doc.setFontSize(18);
  doc.text(`Aluminum Invoice #${data.invoiceNo}`, 14, 20);

  doc.setFontSize(12);
  doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, 14, 30);
  doc.text(`Customer: ${data.customerName}`, 14, 38);

  // Table headers for aluminum products
  const headers = [
    "Quantity",
    "Section",
    "Size",
    "Gaje",
    "Color",
    "Rate",
    "Discount",
    "Amount",
  ];

  // Map products to rows
  const rows = data.products.map((p) => [
    p.quantity.toString(),
    p.section.toString(),
    p.size.toString(),
    p.gaje,
    p.color,
    p.rate.toFixed(2),
    p.discount.toFixed(2),
    p.amount.toFixed(2),
  ]);

  // Generate table of products
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
