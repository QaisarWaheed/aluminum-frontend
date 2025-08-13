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
import "../App.css";

export default function HardwareBilling() {
  const navigate = useNavigate();
  const { formData, addItem, removeItem, updateItem, updateCustomerInfo } =
    useHardwareBilling();

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    let newValue: string | number | null = value;

    if (type === "number") {
      newValue = value === "" ? "" : Number(value);
    }

    updateCustomerInfo(name as any, newValue);
  };

  const handleItemChange = (
    id: number,
    field: keyof (typeof formData.products)[number],
    value: string | number
  ) => {
    updateItem(id, field, value);
  };

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
        `${import.meta.env.VITE_API_URL}/hardware/add-hardware`,
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
  const totalAmount = formData.products.reduce((acc, item) => {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const prevAmount = Number(formData.previousAmount) || 0;
    const aluminumTotal = Number(formData.aluminumTotal) || 0;

    return acc + quantity * rate + prevAmount + aluminumTotal;
  }, 0);

  const grandTotal = totalAmount - Number(formData.receivedAmount);

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
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Stack gap={2} align="flex-end">
                <Title
                  order={1}
                  style={{ fontSize: "20px", letterSpacing: 2 }}
                  mr={25}
                  mb={3}
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

              <Stack>
                <img
                  src="/Logo.jpg"
                  alt="Company Logo"
                  style={{
                    width: 150,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </Stack>

              <Stack gap={2} align="center" mt={20}>
                <Title order={4} style={{ marginBottom: -4 }}>
                  Address
                </Title>
                <Text size="xs" c="gray">
                  Badozai Street, Outside Bohar Gate, Multan, Pakistan
                </Text>
                <Text size="xs" c="gray">
                  Saturday–Thursday | 09 AM – 08 PM
                </Text>
              </Stack>
            </Group>
          </Box>

          {/* BILL INFO */}
          <Group justify="space-between" wrap="wrap" gap="sm" mt={10}>
            <TextInput
              type="number"
              label="Invoice No"
              name="invoiceNo"
              disabled
              value={formData.invoiceNo || 1}
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
                    <td>
                      {(
                        (Number(item.quantity) || 0) * (Number(item.rate) || 0)
                      ).toFixed(2)}
                    </td>
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
            <Group mt="md">
              <Box
                p="md"
                style={{
                  fontSize: "12px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: 8,
                  border: "1px solid #eee",
                }}
              >
                <div style={{ display: "flex", gap: "20px" }}>
                  <TextInput
                    size="xs"
                    label="Previous Amount"
                    type="number"
                    name="previousAmount"
                    value={formData.previousAmount}
                    onChange={handleCustomerChange}
                    mt="xs"
                  />
                  <TextInput
                    size="xs"
                    label="Aluminum Amount"
                    type="number"
                    name="aluminumTotal"
                    value={formData.aluminumTotal}
                    onChange={handleCustomerChange}
                    mt="xs"
                  />

                  <div style={{ marginTop: "28px" }}>
                    <strong>Total Amount:</strong> Rs. {totalAmount.toFixed(2)}
                  </div>

                  <TextInput
                    size="xs"
                    label="Received Amount"
                    type="number"
                    name="receivedAmount"
                    value={formData.receivedAmount}
                    onChange={handleCustomerChange}
                    mt="xs"
                  />
                  <div style={{ marginTop: "28px" }}>
                    <strong>Grand Total:</strong> Rs. {grandTotal}
                  </div>
                </div>
              </Box>
            </Group>
          </Box>
        </Box>

        <Stack mt="xl" maw={900} mx={500}>
          <Group maw={900} justify="space-between">
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
          <Group mt="xl" justify="space-between">
            <Button p={11} onClick={() => navigate("/")}>
              A-Bills
            </Button>
            <Button onClick={() => navigate("/aluminum-bills")} p={4}>
              A-Bill Save
            </Button>
            <Button onClick={() => navigate("/hardware-bills")} p={3}>
              A-Bill save
            </Button>
          </Group>
        </Stack>
      </Stack>
    </Box>
  );
}
