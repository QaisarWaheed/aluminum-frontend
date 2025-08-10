import { BrowserRouter, Routes, Route } from "react-router-dom";
import AluminumBilling from "./pages/AluminumBilling";
import HardwareBilling from "./pages/HardwareBilling";
import { BillingProvider } from "./pages/context/AluminumContext";
import AluminumBills from "./pages/savebills/AluminumBills";
import HardwareBills from "./pages/savebills/HardwareBills";
import { HardwareBillingProvider } from "./pages/context/HardwareContext";

export default function App() {
  return (
    <BrowserRouter>
      <BillingProvider>
        <HardwareBillingProvider>
          <Routes>
            <Route path="/" element={<AluminumBilling />} />
            <Route path="/hardware" element={<HardwareBilling />} />
            <Route path="/aluminum-bills" element={<AluminumBills />} />
            <Route path="/hardware-bills" element={<HardwareBills />} />
          </Routes>
        </HardwareBillingProvider>
      </BillingProvider>
    </BrowserRouter>
  );
}
