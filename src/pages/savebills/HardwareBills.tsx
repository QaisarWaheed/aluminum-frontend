import { useEffect, useState } from "react";
import {
  Table,
  Loader,
  Center,
  Group,
  Button,
  Stack,
  Paper,
  ScrollArea,
  Text,
  TextInput,
} from "@mantine/core";
import axios from "axios";
import { IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import type { ProductItem } from "../context/HardwareContext";
import { generateInvoicePdf } from "../pdf/test";

export interface Invoice {
  _id: string;
  invoiceNo: number;
  date: string;
  customerName: string;
  products: ProductItem[];
  totalAmount: number;
  previousAmount: number;
  receivedAmount: number;
  grandTotal: number;
  pdfUrl?: string;
}

function transformInvoiceForPdf(inv: Invoice) {
  const productRows = inv.products.map((prod) => ({
    quantity: prod.quantity,
    productName: prod.productName,
    rate: prod.rate,
    amount: prod.amount,
  }));

  return {
    invoiceNo: inv.invoiceNo,
    date: inv.date,
    customerName: inv.customerName,
    products: productRows,
    totalAmount: inv.totalAmount,
    previousAmount: inv.previousAmount,
    receivedAmount: inv.receivedAmount,
    grandTotal: inv.grandTotal,
  };
}

export default function HardwareBills() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchInvoiceNo, setSearchInvoiceNo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/hardware/allInvoices`
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

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/find-invoice/${searchInvoiceNo}`
      );
      setInvoices([res.data]);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invoice not found");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" variant="bars" />
      </Center>
    );
  }

  return (
    <Stack p="md" gap="xl">
      <Group justify="center" gap="sm">
        {/* navigation buttons */}
        <Button
          variant="subtle"
          c="dark"
          size="xs"
          onClick={() => navigate("/")}
        >
          A Billing
        </Button>
        <Button
          variant="subtle"
          c="dark"
          size="xs"
          onClick={() => navigate("/hardware")}
        >
          H Billing
        </Button>
        <Button
          variant="subtle"
          c="dark"
          size="xs"
          onClick={() => navigate("/aluminum-bills")}
        >
          A-Bill Save
        </Button>
      </Group>

      <Group mb="md">
        <TextInput
          placeholder="Search invoice no..."
          leftSection={<IconSearch size={16} />}
          radius="md"
          value={searchInvoiceNo}
          onChange={(e) => setSearchInvoiceNo(e.currentTarget.value)}
          type="number"
          style={{ maxWidth: 250 }}
        />
        <Button onClick={handleSearch} disabled={!searchInvoiceNo}>
          Search
        </Button>
      </Group>

      <ScrollArea style={{ maxHeight: "70vh" }}>
        {invoices.length === 0 && (
          <Text ta="center" color="red">
            No invoices found.
          </Text>
        )}

        {invoices.map((inv) => (
          <Paper
            key={inv._id}
            shadow="sm"
            radius="md"
            p="md"
            mb="xl"
            withBorder
            style={{ width: "100%" }}
          >
            <Group justify="apart" mb="sm">
              <Text fw={600} size="md">
                Invoice #{inv.invoiceNo} - {inv.customerName}
              </Text>
              <Button
                size="xs"
                variant="light"
                onClick={() => generateInvoicePdf(transformInvoiceForPdf(inv))}
              >
                Download PDF
              </Button>
            </Group>

            <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ textAlign: "center" }}>Quantity</Table.Th>
                  <Table.Th style={{ textAlign: "center" }}>
                    Product Name
                  </Table.Th>
                  <Table.Th style={{ textAlign: "center" }}>Rate</Table.Th>
                  <Table.Th style={{ textAlign: "center" }}>Amount</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {inv.products.map((prod, i) => (
                  <Table.Tr key={i}>
                    <Table.Td style={{ textAlign: "center" }}>
                      {prod.quantity}
                    </Table.Td>
                    <Table.Td style={{ textAlign: "center" }}>
                      {prod.productName}
                    </Table.Td>
                    <Table.Td style={{ textAlign: "center" }}>
                      {prod.rate}
                    </Table.Td>
                    <Table.Td style={{ textAlign: "center" }}>
                      {prod.amount}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <Group justify="right" mt="md" gap="md">
              <Text>Total: {inv.totalAmount}</Text>
              <Text>Previous: {inv.previousAmount}</Text>
              <Text>Received: {inv.receivedAmount}</Text>
              <Text>
                Grand Total: <strong>{inv.grandTotal}</strong>
              </Text>
            </Group>
          </Paper>
        ))}
      </ScrollArea>
    </Stack>
  );
}
