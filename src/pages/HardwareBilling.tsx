import {
  Box,
  Button,
  Group,
  Stack,
  Table,
  TextInput,
  Text,
  Title,
} from "@mantine/core";
import { useHardwareBilling } from "./context/HardwareContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function HardwareBilling() {
  const navigate = useNavigate();
  const { formData, addItem, removeItem, updateItem, updateCustomerInfo } =
    useHardwareBilling();

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateCustomerInfo(name as any, value);
  };

  const handleItemChange = (
    id: number,
    field: keyof (typeof formData.products)[number],
    value: string | number
  ) => {
    updateItem(id, field, value);
  };

  useEffect(() => {
    fetch("http://localhost:3000/hardware/next-invoice-id")
      .then((res) => res.json())
      .then((data) => (formData.invoiceNo = data.nextId));
  }, []);

  useEffect(() => {
    const fetchLatestInvoiceNo = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/hardware/latest-invoice-no"
        );
        updateCustomerInfo("invoiceNo", res.data.latestInvoiceNo + 1); // next available number
      } catch (error) {
        console.error("Error fetching latest invoice number:", error);
      }
    };

    fetchLatestInvoiceNo();
  }, []);

  const submitBill = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/hardware/add-hardware",
        formData
      );

      console.log("Bill submitted successfully:", response.data);
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
  const totalAmount = formData.products.reduce(
    (acc, item) => acc + item.quantity * item.rate,
    0
  );
  const grandTotal = totalAmount + Number(formData.previousAmount);

  return (
    <Box p="md" style={{ fontSize: "12px" }}>
      <Stack gap="md">
        <Box
          id="bill-content"
          bg="white"
          p="lg"
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            fontSize: "12px",
          }}
        >
          {/* HEADER */}
          <Box
            mb="lg"
            style={{ borderBottom: "1px solid #ddd", paddingBottom: "1rem" }}
          >
            <Group justify="space-between" align="flex-start" wrap="wrap">
              {/* Logo */}
              <Stack gap={4} align="flex-start" miw={150}>
                <img
                  src="/Logo.png"
                  alt="Company Logo"
                  style={{
                    width: 140,
                    height: 60,
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                />
                <Text size="xs" c="dimmed" style={{ fontStyle: "italic" }}>
                  Aluminum Hardware Store
                </Text>
              </Stack>

              {/* Address */}
              <Stack
                gap={2}
                align="center"
                style={{ flexGrow: 1, minWidth: 200 }}
              >
                <Title order={4} style={{ marginBottom: -4 }}>
                  Address
                </Title>
                <Text size="xs" c="gray">
                  Badozai Street, Outside Bohar Gate, Multan, Pakistan
                </Text>
                <Text size="xs" c="gray">
                  Monday–Saturday | 10 AM – 10 PM
                </Text>
              </Stack>

              {/* Contact */}
              <Stack gap={2} align="flex-end" miw={150}>
                <Title
                  order={2}
                  style={{ fontSize: "18px", margin: 0, letterSpacing: 2 }}
                >
                  Wahid Sons
                </Title>
                <Text
                  size="xs"
                  c="gray"
                  style={{ marginTop: -6, wordSpacing: 18 }}
                >
                  Aluminum Hardware Store
                </Text>

                <Stack gap={2} mt={6}>
                  <Group gap="xs">
                    <Text size="xs" fw={500}>
                      Haji Umer Akram:
                    </Text>
                    <Text size="xs" c="gray">
                      0300-6341646
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="xs" fw={500}>
                      Haji Mak'ki Umer:
                    </Text>
                    <Text size="xs" c="gray">
                      0300-0793062
                    </Text>
                  </Group>
                </Stack>
              </Stack>
            </Group>
          </Box>

          {/* BILL INFO */}
          <Group justify="space-between" wrap="wrap" gap="sm" mt={10}>
            <TextInput
              type="number"
              label="Invoice No"
              name="invoiceNo"
              value={formData.invoiceNo || ""}
              onChange={handleCustomerChange}
              w={{ base: "100%", sm: 250 }}
            />
            <TextInput
              label="Customer Name"
              size="xs"
              name="customerName"
              value={formData.customerName}
              onChange={handleCustomerChange}
              w={{ base: "100%", sm: 250 }}
            />
            <TextInput
              type="date"
              size="xs"
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleCustomerChange}
              w={{ base: "100%", sm: 250 }}
            />
            <TextInput
              size="xs"
              label="City"
              value="Multan"
              readOnly
              w={{ base: "100%", sm: 250 }}
            />
          </Group>

          {/* PRODUCTS TABLE */}
          <Box maw={900} mx="auto" mt="md">
            <Table withTableBorder highlightOnHover mt={20}>
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
                    <td>
                      <TextInput
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "quantity",
                            Number(e.currentTarget.value)
                          )
                        }
                      />
                    </td>
                    <td>
                      <TextInput
                        value={item.productName}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "productName",
                            e.currentTarget.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <TextInput
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "rate",
                            Number(e.currentTarget.value)
                          )
                        }
                      />
                    </td>
                    <td>{(item.quantity * item.rate).toFixed(2)}</td>
                    <td>
                      <Button
                        color="red"
                        size="xs"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* TOTALS */}
            <Group justify="end" mt="md" wrap="wrap">
              <Box
                p="md"
                style={{
                  fontSize: "12px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: 8,
                  border: "1px solid #eee",
                  minWidth: 250,
                }}
              >
                <div>
                  <strong>Total Amount:</strong> Rs. {totalAmount.toFixed(2)}
                </div>
                <TextInput
                  size="xs"
                  label="Previous Amount"
                  type="number"
                  name="previousAmount"
                  value={formData.previousAmount}
                  onChange={handleCustomerChange}
                  mt="xs"
                />
                <div style={{ marginTop: 8 }}>
                  <strong>Grand Total:</strong> Rs. {grandTotal}
                </div>
              </Box>
            </Group>
          </Box>
        </Box>

        <Group justify="space-between" mt="xl" maw={900} mx="auto" wrap="wrap">
          <Button size="xs" onClick={() => addItem()}>
            Add Item
          </Button>
          <Button size="xs" onClick={submitBill}>
            Save Bill
          </Button>
          <Button size="xs" onClick={() => window.print()}>
            Print Bill
          </Button>
        </Group>
        <Group justify="space-between" mt="xl">
          <Button onClick={() => navigate("/hardware")}>H Billing</Button>
          <Button onClick={() => navigate("/aluminum-bills")} p={10}>
            A-Bill Save
          </Button>
          <Button onClick={() => navigate("/hardware-bills")} p={10}>
            H-Bill Save
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
