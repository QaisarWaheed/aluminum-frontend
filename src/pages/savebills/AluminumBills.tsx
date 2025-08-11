import { useEffect, useState } from "react";
import { Table, Loader, Center } from "@mantine/core";
import axios from "axios";

interface Invoice {
  _id: string;
  invoiceNo: number;
  date: string;
  customerName: string;
  totalAmount: number;
  pdfUrl?: string; // URL to the saved PDF in backend
}

export default function AluminumBills() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/aluminum/allInvoices"
        );
        setInvoices(res.data);
      } catch (err) {
        console.error("Error fetching invoices", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const downloadInvoice = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/aluminum/download/${id}`,
        {
          method: "GET",
        }
      );
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${id}.pdf`; // or .jpg
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading invoice:", err);
    }
  };

  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Total</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((inv) => (
          <tr key={inv._id}>
            <td>{inv.invoiceNo}</td>
            <td>{new Date(inv.date).toLocaleDateString()}</td>
            <td>{inv.totalAmount}</td>
            <td>
              <button onClick={() => downloadInvoice(inv._id)}>Download</button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
