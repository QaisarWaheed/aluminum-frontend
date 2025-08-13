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
import type { ProductItem } from "../context/AluminumContext"; // If aluminum products differ, create new type accordingly
import { generateAluminumInvoicePdf } from "../pdf/test2";

export interface AluminumInvoice {
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

function transformAluminumInvoiceForPdf(inv: AluminumInvoice) {
  const productRows = inv.products.map((prod) => ({
    id: prod.id,
    quantity: prod.quantity,
    rate: prod.rate,
    amount: prod.amount,
    size: prod.size,
    section: prod.section,
    gaje: prod.gaje,
    color: prod.color,
    discount: prod.discount,
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

export default function AluminumBills() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<AluminumInvoice[]>([]);
  const [searchInvoiceNo, setSearchInvoiceNo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/aluminum/allInvoices`
        );
        setInvoices(res.data);
      } catch (err) {
        console.error("Error fetching aluminum invoices", err);
        setError("Failed to fetch invoices");
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
        `${
          import.meta.env.VITE_API_URL
        }/aluminum/find-invoice/${searchInvoiceNo}`
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
          onClick={() => navigate("/hardware-bills")}
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

      <ScrollArea>
        {error && (
          <Text ta="center" c="red" mb="md">
            {error}
          </Text>
        )}

        {invoices.length === 0 && !error && (
          <Text ta="center" c="red">
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
                onClick={() =>
                  generateAluminumInvoicePdf(
                    transformAluminumInvoiceForPdf(inv)
                  )
                }
              >
                Download PDF
              </Button>
            </Group>

            <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ textAlign: "center" }}>Quantity</Table.Th>
                  <Table.Th style={{ textAlign: "center" }}>Section</Table.Th>
                  <Table.Th style={{ textAlign: "center" }}>size</Table.Th>
                  <Table.Th style={{ textAlign: "center" }}>Discount</Table.Th>

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
                      {prod.section}
                    </Table.Td>

                    <Table.Td style={{ textAlign: "center" }}>
                      {prod.size}
                    </Table.Td>

                    <Table.Td style={{ textAlign: "center" }}>
                      {prod.discount}
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
