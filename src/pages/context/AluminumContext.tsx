import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface ProductItem {
  id: number;
  section: string | number;
  size: string | number;
  quantity: string | number;
  gaje: string;
  color: string;
  rate: string | number;
  discount: string | number;
  amount: string | number;
}

export interface BillFormData {
  invoiceNo: string | number;
  customerName: string;
  date: string;
  companyName: string;
  city: string;
  products: ProductItem[];
  discountedAmount: string | number;
  totalAmount: string | number;
  previousAmount: string | number;
  hardwareAmount: string | number;
  receivedAmount: string | number;
  grandTotal: string | number;
}

interface BillingContextType {
  formData: BillFormData;
  addItem: () => void;
  removeItem: (id: number) => void;
  updateItem: (
    id: number,
    field: keyof ProductItem,
    value: string | number
  ) => void;
  updateCustomerInfo: (
    field: keyof Omit<BillFormData, "items">,
    value: string | number
  ) => void;
  calculateTotal: () => {
    total: number;
    grandTotal: number;
    discountedAmount: number;
  };
}

const defaultFormData: BillFormData = {
  invoiceNo: "",
  customerName: "",
  date: new Date().toISOString().split("T")[0],
  companyName: "",
  city: "Multan",
  products: [
    {
      id: 1,
      section: "",
      size: "",
      quantity: "",
      gaje: "",
      color: "",
      rate: "",
      discount: "",
      amount: "",
    },
  ],
  discountedAmount: "",
  totalAmount: "",
  previousAmount: "",
  hardwareAmount: "",
  receivedAmount: "",
  grandTotal: "",
};

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<BillFormData>(defaultFormData);

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: Date.now(),
          section: "",
          size: "",
          quantity: "",
          gaje: "",
          color: "",
          rate: "",
          discount: "",
          amount: "",
        },
      ],
    }));
  };

  const removeItem = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((item) => item.id !== id),
    }));
  };

  const updateItem = (
    id: number,
    field: keyof ProductItem,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((item) =>
        item.id === id
          ? (() => {
              const updatedItem = { ...item, [field]: value };

              const size = Number(updatedItem.size) || 0;
              const quantity = Number(updatedItem.quantity) || 0;
              const rate = Number(updatedItem.rate) || 0;
              const discount = Number(updatedItem.discount) || 0;

              const baseAmount = size * quantity * rate;
              const discountAmount = (baseAmount * discount) / 100;
              const finalAmount = baseAmount - discountAmount;
              updatedItem.amount = finalAmount
                ? Number(finalAmount.toFixed(2))
                : "";

              return updatedItem;
            })()
          : item
      ),
    }));
  };

  const updateCustomerInfo = (
    field: keyof Omit<BillFormData, "items">,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateTotal = () => {
    let discountedAmount = 0;

    const productsTotal = formData.products.reduce((acc, item) => {
      const size = Number(item.size) || 0;
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const discount = Number(item.discount) || 0;

      const baseAmount = size * quantity * rate;
      discountedAmount += (baseAmount * discount) / 100;

      return acc + baseAmount;
    }, 0);

    // Total Amount (without received amount effect)
    const total =
      productsTotal +
      (Number(formData.previousAmount) || 0) +
      (Number(formData.hardwareAmount) || 0) -
      discountedAmount;

    // Grand Total (with received amount deducted)
    const grandTotal = total - (Number(formData.receivedAmount) || 0);

    // Round all values to 2 decimal places
    return {
      total: Number(total.toFixed(2)),
      discountedAmount: Number(discountedAmount.toFixed(2)),
      grandTotal: Number(grandTotal.toFixed(2)),
    };
  };

  return (
    <BillingContext.Provider
      value={{
        formData,
        addItem,
        removeItem,
        updateItem,
        updateCustomerInfo,
        calculateTotal,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error("useBilling must be used within a BillingProvider");
  }
  return context;
};
