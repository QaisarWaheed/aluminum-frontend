import {
  Box,
  Button,
  Group,
  Stack,
  Table,
  TextInput,
  Title,
  Text,
  Select,
} from "@mantine/core";
import axios from "axios";
import { useBilling } from "./context/AluminumContext";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../App.css";
export default function AluminumBilling() {
  const {
    formData,
    addItem,
    removeItem,
    updateItem,
    updateCustomerInfo,
    calculateTotal,
  } = useBilling();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/aluminum/next-invoice-id`)
      .then((res) => res.json())
      .then((data) => (formData.invoiceNo = data.nextId));
  }, []);

  useEffect(() => {
    const fetchLatestInvoiceNo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/aluminum/latest-invoice-no`
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
        `${import.meta.env.VITE_API_URL}/aluminum/add-aluminum-bill`,
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

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    let newValue: string | number = value;

    if (type === "number") {
      newValue = value === "" ? "" : Number(value);
    }

    updateCustomerInfo(name as any, newValue);
  };

  const handleItemChange = (
    id: number,
    field: string,
    value: string | number
  ) => {
    updateItem(id, field as any, value);
  };

  const { total, discountedAmount, grandTotal } = calculateTotal();

  return (
    <Box p="md">
      <Stack gap="md">
        <Box
          id="bill-content"
          bg="white"
          p="lg"
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
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

          {/* Customer Info */}
          <Group justify="space-between">
            <TextInput
              type="number"
              label="Invoice No"
              name="invoiceNo"
              value={formData.invoiceNo || ""}
              onChange={handleCustomerChange}
              disabled
              w={200}
            />
            <TextInput
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleCustomerChange}
              w={260}
            />
            <TextInput
              type="date"
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleCustomerChange}
              w={260}
            />
            <TextInput
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleCustomerChange}
              w={250}
            />
            <TextInput label="City" w={260} defaultValue={"Multan"} />
          </Group>

          {/* Items Table */}
          <Table withTableBorder highlightOnHover mt={20}>
            <thead>
              <tr>
                <th>S/No</th>
                <th>Section</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Gaje</th>
                <th>Color</th>
                <th>Rate</th>
                <th>Discount %</th>
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
                      value={item.section}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "section",
                          e.currentTarget.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <TextInput
                      value={item.size}
                      onChange={(e) =>
                        handleItemChange(item.id, "size", e.currentTarget.value)
                      }
                    />
                  </td>
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
                    <Select
                      data={["0.9", "1.1", "1.2", "1.4", "1.6", "2.0"]}
                      value={item.gaje}
                      onChange={(value) =>
                        handleItemChange(item.id, "gaje", value || "")
                      }
                      checkIconPosition="right"
                    />
                  </td>
                  <td>
                    <Select
                      data={["CH", "BLM", "WT", "SL"]}
                      value={item.color}
                      onChange={(value) =>
                        handleItemChange(item.id, "color", value || "")
                      }
                      checkIconPosition="right"
                      allowDeselect
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
                    <TextInput
                      type="number"
                      value={item.discount}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "discount",
                          Number(e.currentTarget.value)
                        )
                      }
                    />
                  </td>
                  <td>{Number(item.amount)}</td>
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

          {/* Totals */}

          <Group mt="md">
            <Box
              p="md"
              style={{
                backgroundColor: "#f9f9f9",
                borderRadius: 8,
                border: "1px solid #eee",
                gap: "20px",
              }}
            >
              <div style={{ display: "flex", gap: "20px" }}>
                <div
                  style={{
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #eee",
                    padding: "5px",
                  }}
                >
                  <strong>Discounted Amount:</strong> Rs.{" "}
                  {discountedAmount.toFixed(2)}
                </div>

                <TextInput
                  label="Previous Amount"
                  type="number"
                  value={formData.previousAmount || 0}
                  onChange={handleCustomerChange}
                  name="previousAmount"
                  bg={"#f9f9f9"}
                  placeholder="0.00"
                />
                <TextInput
                  label="Hardware Total"
                  type="number"
                  name="hardwareAmount"
                  value={formData.hardwareAmount}
                  onChange={handleCustomerChange}
                  bg={"#f9f9f9"}
                  placeholder="0.00"
                />
                <div
                  style={{
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #eee",
                    padding: "5px",
                  }}
                >
                  <strong>Total Amount:</strong> Rs. {total.toFixed(2)}
                </div>
                <TextInput
                  label="Received Amount"
                  placeholder="0.00"
                  type="number"
                  name="receivedAmount"
                  value={formData.receivedAmount}
                  onChange={handleCustomerChange}
                  bg={"#f9f9f9"}
                />
                <div
                  style={{
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #eee",
                    padding: "5px",
                  }}
                >
                  <strong>Grand Amount:</strong> Rs. {grandTotal.toFixed(2)}
                </div>
              </div>
            </Box>
          </Group>
        </Box>

        {/* Action Buttons */}

        <Group justify="space-between" mt="xl">
          <Button onClick={addItem}>Add Item</Button>
          <Button onClick={submitBill}>Save Bill</Button>
          <Button onClick={() => window.print()}>Print Bill</Button>
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
