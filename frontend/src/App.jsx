import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CompanySelection from "./pages/CompanySelection";
import CreateCompany from "./pages/CreateCompany";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/companies" element={<CompanySelection />} />
      <Route path="/companies/create" element={<CreateCompany />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;