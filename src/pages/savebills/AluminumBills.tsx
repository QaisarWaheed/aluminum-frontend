import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Loader, Center, Title } from "@mantine/core";

interface Invoice {
  _id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  totalAmount: number;
  previousAmount: number;
  section: number;
  size: number;
  quantity: number;
  gaje: string;
  color: string;
  rate: number;
  discount: number;
  amount: number;
}

export default function AluminumBills() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/aluminum/allInvoices")
      .then((res) => {
        setInvoices(res.data);
      })
      .catch((err) => {
        console.error("Error fetching invoices:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Title order={2} mb="md">
        All Aluminum Bills
      </Title>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Invoice No.</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Total Amount</Table.Th>
            <Table.Th>Invoice No.</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Total Amount</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Total Amount</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {invoices.map((inv) => (
            <Table.Tr key={inv._id}>
              <Table.Td>{inv.invoiceNumber}</Table.Td>
              <Table.Td>{new Date(inv.date).toLocaleDateString()}</Table.Td>
              <Table.Td>{inv.customerName}</Table.Td>
              <Table.Td>{inv.totalAmount}</Table.Td>
              <Table.Td>{inv.previousAmount}</Table.Td>
              <Table.Td>{inv.section}</Table.Td>
              <Table.Td>{inv.size}</Table.Td>
              <Table.Td>{inv.quantity}</Table.Td>
              <Table.Td>{inv.discount}</Table.Td>
              <Table.Td>{inv.amount}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}
