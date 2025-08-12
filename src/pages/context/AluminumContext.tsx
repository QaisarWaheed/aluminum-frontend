import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface ProductItem {
  id: number;
  section: number;
  size: number;
  quantity: number;
  gaje: string;
  color: string;
  rate: number;
  discount: number;
  amount: number;
}

export interface BillFormData {
  invoiceNo: number;
  customerName: string;
  date: string;
  companyName: string;
  city: string;
  products: ProductItem[];
  discountedAmount: number;
  totalAmount: number;
  previousAmount: number;
  hardwareAmount: number;
  receivedAmount: number;
  grandTotal: number;
}

interface BillingContextType {
  formData: BillFormData;
  addItem: () => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, field: keyof ProductItem, value: any) => void;
  updateCustomerInfo: (
    field: keyof Omit<BillFormData, "items">,
    value: any
  ) => void;
  calculateTotal: () => {
    total: number;
    grandTotal: number;
    discountedAmount: number;
  };
}

const defaultFormData: BillFormData = {
  invoiceNo: 1,
  customerName: "",
  date: new Date().toISOString().split("T")[0],

  companyName: "",
  city: "Multan",
  products: [
    {
      id: 1,
      section: 0,
      size: 0,
      quantity: 0,
      gaje: "",
      color: "",
      rate: 0,
      discount: 0,
      amount: 0,
    },
  ],
  discountedAmount: 0,
  totalAmount: 0,
  previousAmount: 0,
  hardwareAmount: 0,
  receivedAmount: 0,
  grandTotal: 0,
};

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<BillFormData>(defaultFormData);
  let totalItems = 1;
  const addItem = () => {
    totalItems += 1;
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: Date.now(),
          section: 0,
          size: 0,
          quantity: 0,
          gaje: "",
          color: "",
          rate: 0,
          discount: 0,
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
      products: prev.products.map((item) =>
        item.id === id
          ? (() => {
              const updatedItem = { ...item, [field]: value };

              const baseAmount =
                Number(updatedItem.size) *
                Number(updatedItem.quantity) *
                Number(updatedItem.rate);

              const discountAmount =
                (baseAmount * Number(updatedItem.discount)) / 100;
              updatedItem.amount = baseAmount - discountAmount;

              return updatedItem;
            })()
          : item
      ),
    }));
  };

  const updateCustomerInfo = (
    field: keyof Omit<BillFormData, "items">,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  let discountedAmount = 0;
  const calculateTotal = () => {
    const total = formData.products.reduce(
      (acc, item) =>
        acc +
        item.size * item.quantity * item.rate +
        formData.previousAmount +
        formData.hardwareAmount -
        discountedAmount,
      0
    );

    discountedAmount = formData.products.reduce((acc, item) => {
      const baseAmount = item.size * item.quantity * item.rate;
      return acc + (baseAmount * (item.discount || 0)) / 100;
    }, 0);
    console.log(discountedAmount);

    const discountedTotal = total - discountedAmount;

    const grandTotal = total - formData.receivedAmount;

    return { total, discountedAmount, discountedTotal, grandTotal };
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
