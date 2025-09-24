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
  Flex,
  ScrollArea,
} from "@mantine/core";
import axios from "axios";
import { useBilling } from "./context/AluminumContext";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        event.preventDefault();
        addItem();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addItem]);

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
      alert("Bill saved!");
      if (typeof response.data.invoiceNo === "number") {
        updateCustomerInfo("invoiceNo", response.data.invoiceNo);
      }
      window.location.reload();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(
          "Error saving bill: " +
            (error.response?.data?.message || error.message)
        );
      } else if (error instanceof Error) {
        alert("Error saving bill: " + error.message);
      } else {
        alert("Error saving bill: An unknown error occurred.");
      }
    }
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number = value;
    if (type === "number") newValue = value === "" ? "" : Number(value);
    updateCustomerInfo(name as keyof typeof formData, newValue);
  };

  type ItemField =
    | "section"
    | "size"
    | "quantity"
    | "gaje"
    | "color"
    | "rate"
    | "discount"
    | "amount";

  const handleItemChange = (
    id: number,
    field: ItemField,
    value: string | number
  ) => {
    updateItem(id, field, value);
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
            <Flex
              justify="space-between"
              align="flex-start"
              wrap="wrap"
              gap="lg"
            >
              <Stack gap={2} align="flex-start" flex={1}>
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

              <Stack gap={2} align="end" mt={20} flex={1}>
                <Title order={4} style={{ marginBottom: -4 }}>
                  Address
                </Title>
                <Text size="xs" c="gray" ta="center">
                  Badozai Street, Outside Bohar Gate, Multan, Pakistan
                </Text>
                <Text size="xs" c="gray" ta="center">
                  Saturday–Thursday | 09 AM – 08 PM
                </Text>
              </Stack>
            </Flex>
          </Box>

          {/* Customer Info */}
          <Flex wrap="wrap" gap="md">
            <TextInput
              type="number"
              label="Invoice No"
              name="invoiceNo"
              value={formData.invoiceNo || ""}
              onChange={handleCustomerChange}
              disabled
              style={{ flex: "1 1 150px" }}
            />
            <TextInput
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleCustomerChange}
              style={{ flex: "1 1 200px" }}
            />
            <TextInput
              type="date"
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleCustomerChange}
              style={{ flex: "1 1 200px" }}
            />
            <TextInput
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleCustomerChange}
              style={{ flex: "1 1 200px" }}
            />
            <TextInput
              label="City"
              defaultValue={"Multan"}
              style={{ flex: "1 1 150px" }}
            />
          </Flex>

          {/* Items Table */}
          <ScrollArea mt={20} style={{ overflowX: "auto" }}>
            <div id="print-area">
              <Table withTableBorder highlightOnHover style={{ minWidth: 900 }}>
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
                <tbody style={{ textAlign: "center" }}>
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
                            handleItemChange(
                              item.id,
                              "size",
                              e.currentTarget.value
                            )
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
                          data={[
                            "CH",
                            "BLM",
                            "WT",
                            "SL",
                            "WOOD",
                            "SAHARA",
                            "MALTI",
                          ]}
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
            </div>
          </ScrollArea>

          {/* Totals Row */}
          <Flex wrap="wrap" gap="md" mt="md">
            <Box
              p="md"
              style={{
                backgroundColor: "#f9f9f9",
                borderRadius: 8,
                border: "1px solid #eee",
                flex: "1 1 100%",
              }}
            >
              <Flex
                wrap="wrap"
                gap="md"
                style={{ justifyContent: "space-between" }}
              >
                <div
                  style={{
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #eee",
                    padding: "5px",
                    flex: "1 1 120px",
                    minWidth: 120,
                  }}
                >
                  <strong>Discounted Amount:</strong> Rs.{" "}
                  {discountedAmount.toFixed(2)}
                </div>
                <TextInput
                  label="Previous Amount"
                  type="number"
                  value={formData.previousAmount}
                  onChange={handleCustomerChange}
                  name="previousAmount"
                  bg={"#f9f9f9"}
                  placeholder="0.00"
                  style={{ flex: "1 1 120px", minWidth: 120 }}
                />
                <TextInput
                  label="Hardware Total"
                  type="number"
                  name="hardwareAmount"
                  value={formData.hardwareAmount}
                  onChange={handleCustomerChange}
                  bg={"#f9f9f9"}
                  placeholder="0.00"
                  style={{ flex: "1 1 120px", minWidth: 120 }}
                />
                <div
                  style={{
                    backgroundColor: "green",
                    border: "1px solid #eee",
                    padding: "5px",
                    flex: "1 1 120px",
                    minWidth: 120,
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
                  style={{ flex: "1 1 120px", minWidth: 120 }}
                />
                <div
                  style={{
                    backgroundColor: "yellow",
                    border: "1px solid #eee",
                    padding: "5px",
                    flex: "1 1 120px",
                    minWidth: 100,
                  }}
                >
                  <strong>Grand Amount:</strong> Rs. {grandTotal.toFixed(2)}
                </div>
              </Flex>
            </Box>
          </Flex>
        </Box>

        {/* Buttons */}
        <Flex wrap="wrap" justify="center" gap="md" mt="xl">
          <Button onClick={addItem}>Add Item</Button>
          <Button onClick={submitBill}>Save Bill</Button>
          <Button onClick={() => window.print()}>Print Bill</Button>
        </Flex>

        <Flex wrap="wrap" justify="center" gap="md" mt="xl">
          <Button onClick={() => navigate("/hardware")}>H Billing</Button>
          <Button onClick={() => navigate("/aluminum-bills")} p={10}>
            A-Bill Save
          </Button>
          <Button onClick={() => navigate("/hardware-bills")} p={10}>
            H-Bill Save
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
}
