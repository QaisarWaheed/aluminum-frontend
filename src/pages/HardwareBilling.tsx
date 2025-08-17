import {
  Box,
  Button,
  Group,
  Stack,
  Table,
  TextInput,
  Text,
  Title,
  Flex,
  ScrollArea,
} from "@mantine/core";
import { useHardwareBilling } from "./context/HardwareContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../App.css";

export default function HardwareBilling() {
  const navigate = useNavigate();
  const { formData, addItem, removeItem, updateItem, updateCustomerInfo } =
    useHardwareBilling();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        event.preventDefault();
        addItem();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addItem]);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number | null = value;
    if (type === "number") newValue = value === "" ? "" : Number(value);
    updateCustomerInfo(name as any, newValue);
  };

  const handleItemChange = (
    id: number,
    field: keyof (typeof formData.products)[number],
    value: string | number
  ) => updateItem(id, field, value);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/hardware/next-invoice-id`)
      .then((res) => res.json())
      .then((data) => (formData.invoiceNo = data.nextId));
  }, []);

  useEffect(() => {
    const fetchLatestInvoiceNo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/hardware/latest-invoice-no`
        );
        updateCustomerInfo("invoiceNo", res.data.latestInvoiceNo + 1);
      } catch (error) {
        console.error("Error fetching latest invoice number:", error);
      }
    };
    fetchLatestInvoiceNo();
  }, []);

  const submitBill = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/hardware/add-hardware`,
        formData
      );
      alert("Bill saved!");
      if (typeof response.data.invoiceNo === "number") {
        updateCustomerInfo("invoiceNo", response.data.invoiceNo);
      }
      window.location.reload();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        alert(
          "Error saving bill: " +
            (error.response?.data?.message || error.message)
        );
      } else {
        alert("Error saving bill: " + error.message);
      }
    }
  };

  const totalAmount = formData.products.reduce((acc, item) => {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const prevAmount = Number(formData.previousAmount) || 0;
    const aluminumTotal = Number(formData.aluminumTotal) || 0;
    return acc + quantity * rate + prevAmount + aluminumTotal;
  }, 0);

  const grandTotal = totalAmount - Number(formData.receivedAmount);

  return (
    <Box p="md">
      <Stack gap="md">
        <Box
          id="bill-content"
          bg="white"
          p="lg"
          style={{ borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
        >
          {/* HEADER */}
          <Box mb="lg" style={{ borderBottom: "1px solid #ddd", paddingBottom: "1rem" }}>
            <Flex justify="space-between" align="flex-start" wrap="wrap" gap="lg">
              <Stack gap={2} align="flex-start" flex={1}>
                <Title order={1} style={{ fontSize: "20px", letterSpacing: 2 }} mr={25} mb={3}>
                  Wahid Sons
                </Title>
                <Text size="xs" c="gray" style={{ marginTop: -6, wordSpacing: 18 }}>
                  Aluminum Hardware Store
                </Text>
                <Stack gap={2} mt={6}>
                  <Group gap="xs">
                    <Text size="xs" fw={500}>Haji Umer Akram:</Text>
                    <Text size="xs" c="gray">0300-6341646</Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="xs" fw={500}>Haji Mak'ki Umer:</Text>
                    <Text size="xs" c="gray">0300-0793062</Text>
                  </Group>
                </Stack>
              </Stack>

              <Stack>
                <img src="/Logo.jpg" alt="Company Logo" style={{ width: 150, height: 100, objectFit: "cover", borderRadius: 8 }} />
              </Stack>

              <Stack gap={2} align="end" mt={20} flex={1}>
                <Title order={4} style={{ marginBottom: -4 }}>Address</Title>
                <Text size="xs" c="gray" ta="center">Badozai Street, Outside Bohar Gate, Multan, Pakistan</Text>
                <Text size="xs" c="gray" ta="center">Saturday–Thursday | 09 AM – 08 PM</Text>
              </Stack>
            </Flex>
          </Box>

          {/* CUSTOMER INFO */}
          <Flex wrap="wrap" gap="md">
            <TextInput type="number" label="Invoice No" name="invoiceNo" disabled value={formData.invoiceNo || 1} onChange={handleCustomerChange} style={{ flex: "1 1 150px" }} />
            <TextInput label="Customer Name" size="xs" name="customerName" value={formData.customerName} onChange={handleCustomerChange} style={{ flex: "1 1 200px" }} />
            <TextInput type="date" size="xs" label="Date" name="date" value={formData.date} onChange={handleCustomerChange} style={{ flex: "1 1 200px" }} />
            <TextInput size="xs" label="City" value="Multan" readOnly style={{ flex: "1 1 150px" }} />
          </Flex>

          {/* PRODUCTS TABLE */}
          <ScrollArea mt="md" style={{ overflowX: "auto" }}>
            <Table withTableBorder highlightOnHover style={{ minWidth: 700 }}>
              <thead>
                <tr>
                  <th>S/No</th>
                  <th>Quantity</th>
                  <th>Product Name</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {formData.products.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td><TextInput type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", Number(e.currentTarget.value))} /></td>
                    <td><TextInput value={item.productName} onChange={(e) => handleItemChange(item.id, "productName", e.currentTarget.value)} /></td>
                    <td><TextInput type="number" value={item.rate} onChange={(e) => handleItemChange(item.id, "rate", Number(e.currentTarget.value))} /></td>
                    <td>{((Number(item.quantity) || 0) * (Number(item.rate) || 0)).toFixed(2)}</td>
                    <td><Button color="red" size="xs" onClick={() => removeItem(item.id)}>Remove</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea>

          {/* TOTALS ROW */}
          <Flex wrap="wrap" gap="md" mt="md" justify="flex-end">
            <TextInput size="xs" label="Previous Amount" type="number" name="previousAmount" value={formData.previousAmount} onChange={handleCustomerChange} style={{ flex: "1 1 150px" }} />
            <TextInput size="xs" label="Aluminum Amount" type="number" name="aluminumTotal" value={formData.aluminumTotal} onChange={handleCustomerChange} style={{ flex: "1 1 150px" }} />
            <Text fw={500} style={{ flex: "1 1 150px", marginTop: 28 }}>Total Amount: Rs. {totalAmount.toFixed(2)}</Text>
            <TextInput size="xs" label="Received Amount" type="number" name="receivedAmount" value={formData.receivedAmount} onChange={handleCustomerChange} style={{ flex: "1 1 150px" }} />
            <Text fw={700} style={{ flex: "1 1 150px", marginTop: 28 }}>Grand Total: Rs. {grandTotal}</Text>
          </Flex>
        </Box>

        {/* BUTTONS */}
        <Stack mt="xl" w="100%">
          <Group justify="center" gap="sm" wrap="wrap">
            <Button size="xs" onClick={() => addItem()}>Add Item</Button>
            <Button size="xs" onClick={submitBill}>Save Bill</Button>
            <Button size="xs" onClick={() => window.print()}>Print Bill</Button>
          </Group>
          <Group justify="center" gap={20} wrap="wrap" mt="xl">
            <Button p={11} onClick={() => navigate("/")}>A-Bills</Button>
            <Button onClick={() => navigate("/aluminum-bills")} p={4}>A-Bill Save</Button>
            <Button onClick={() => navigate("/hardware-bills")} p={3}>H-Bill Save</Button>
          </Group>
        </Stack>
      </Stack>
    </Box>
  );
}
