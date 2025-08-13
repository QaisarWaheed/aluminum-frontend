import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface ProductItem {
  id: number;
  quantity: string | number; // can be "" initially
  productName: string;
  rate: string | number;
  amount: string | number;
}

export interface BillFormData {
  invoiceNo: string | number;
  customerName: string;
  date: string;
  companyName: string;
  city: string;
  products: ProductItem[];
  previousAmount: string | number;
  aluminumTotal: string | number;
  totalAmount: string | number;
  receivedAmount: string | number;
  grandTotal: string | number;
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
    grandTotal: number;
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
      id: 0,
      quantity: "",
      rate: "",
      productName: "",
      amount: "",
    },
  ],
  previousAmount: "",
  aluminumTotal: "",
  totalAmount: "",
  receivedAmount: "",
  grandTotal: "",
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
              : 1,
          productName: "",
          quantity: "",
          rate: "",
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

  const updateItem = (id: number, field: keyof ProductItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
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
    const total =
      formData.products.reduce((acc, item) => {
        const qty = Number(item.quantity) || 0;
        const rate = Number(item.rate) || 0;
        return acc + qty * rate;
      }, 0) +
      (Number(formData.previousAmount) || 0) +
      (Number(formData.aluminumTotal) || 0);

    const grandTotal = total - (Number(formData.receivedAmount) || 0);

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
