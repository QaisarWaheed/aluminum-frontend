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
// import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function AluminumBilling() {
  const navigate = useNavigate();
  let invoiceNumber = 1;

  const {
    formData,
    addItem,
    removeItem,
    updateItem,
    updateCustomerInfo,
    calculateTotal,
  } = useBilling();

  const submitBill = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/aluminum/add-aluminum-bill",
        formData
      );

      console.log("Bill submitted successfully:", response.data);
      alert("Bill saved!");
    } catch (error: any) {
      console.error("Error submitting bill:", error);
      alert("Error saving bill");
    }
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateCustomerInfo(name as any, value);
  };

  const handleItemChange = (
    id: number,
    field: string,
    value: string | number
  ) => {
    updateItem(id, field as any, value);
  };

  const { total, discountedAmount } = calculateTotal();

  return (
    <Box p="md">
      <Stack gap="md">
        {/* BILL CONTENT STARTS HERE */}
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
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </Stack>

              <Stack gap={2} align="center">
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
              type="text"
              value={invoiceNumber}
              disabled
              w={200}
              mt={20}
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
              name="date"
              value={formData.date}
              onChange={handleCustomerChange}
              w={260}
              mt={20}
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
                  <td>{item.amount.toFixed(2)}</td>
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
                <div
                  style={{
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #eee",
                    padding: "5px",
                  }}
                >
                  <strong>Total Amount:</strong> Rs. {total.toFixed(2)}
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
