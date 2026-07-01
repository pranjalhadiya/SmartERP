import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CompanySelection from "./pages/CompanySelection";
import CreateCompany from "./pages/CreateCompany";
import Dashboard from "./pages/Dashboard";
import Ledgers from "./pages/Ledgers";
import Groups from "./pages/Groups";
import Items from "./pages/Items";
import Vouchers from "./pages/Vouchers";
import PurchaseVoucher from "./pages/PurchaseVoucher";
import SalesVoucher from "./pages/SalesVoucher";
import Invoice from "./pages/Invoice";
import Reports from "./pages/Reports";
import KeyboardShortcuts from "./components/KeyboardShortcuts";

function App() {
  return (
    <>
      <KeyboardShortcuts />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/companies" element={<CompanySelection />} />
        <Route path="/companies/create" element={<CreateCompany />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ledgers" element={<Ledgers />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/items" element={<Items />} />
        <Route path="/vouchers" element={<Vouchers />} />
        <Route path="/purchase" element={<PurchaseVoucher />} />
        <Route path="/sales" element={<SalesVoucher />} />
        <Route path="/invoice/:id" element={<Invoice />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </>
  );
}

export default App;