import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface ProductItem {
  id: number;
  quantity: number;
  productName: string;
  rate: number;
  amount: number;
}

export interface BillFormData {
  invoiceNo: number;
  customerName: string;
  date: string;
  companyName: string;
  city: string;
  products: ProductItem[];
  previousAmount: number;
  aluminumTotal: number;
  totalAmount: number;
  receivedAmount: number;
  grandTotal: number;
}

interface BillingContextType {
  formData: BillFormData;
  addItem: () => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, field: keyof ProductItem, value: any) => void;
  updateCustomerInfo: (
    field: keyof Omit<BillFormData, "products">,
    value: any
  ) => void;
  calculateTotal: () => {
    total: number;
  };
}

const defaultFormData: BillFormData = {
  invoiceNo: 0,
  customerName: "",
  date: new Date().toISOString().split("T")[0],
  companyName: "",
  city: "Multan",
  products: [
    {
      id: 0,
      quantity: 0,
      rate: 0,
      productName: "",
      amount: 0,
    },
  ],
  previousAmount: 0,
  aluminumTotal: 0,
  totalAmount: 0,
  receivedAmount: 0,
  grandTotal: 0,
};

const HardwareBillingContext = createContext<BillingContextType | undefined>(
  undefined
);

export const HardwareBillingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [formData, setFormData] = useState<BillFormData>(defaultFormData);

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id:
            prev.products.length > 0
              ? Math.max(...prev.products.map((p) => p.id)) + 1
              : 1, // incrementing IDs
          productName: "",
          quantity: 0,
          rate: 0,
          amount: 0,
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

  const updateItem = (id: number, field: keyof ProductItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const updateCustomerInfo = (
    field: keyof Omit<BillFormData, "products">,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateTotal = () => {
    const total = formData.products.reduce(
      (acc, item) =>
        acc +
        item.quantity * item.rate +
        formData.previousAmount +
        formData.aluminumTotal,
      0
    );

    const grandTotal = total - formData.receivedAmount;

    return { total, grandTotal };
  };

  return (
    <HardwareBillingContext.Provider
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
    </HardwareBillingContext.Provider>
  );
};

export const useHardwareBilling = () => {
  const context = useContext(HardwareBillingContext);
  if (!context) {
    throw new Error("useBilling must be used within a BillingProvider");
  }
  return context;
};
