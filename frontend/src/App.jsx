import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import CompanySelection from "./pages/CompanySelection";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/companies" element={<CompanySelection />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;