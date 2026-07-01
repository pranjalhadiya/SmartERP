import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CompanySelection() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const companyRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    gst_number: "",
    state: "",
  });

  const navigate = useNavigate();

  const getCompanies = async () => {
    try {
      const res = await api.get("/companies/");
      setCompanies(res.data);
    } catch {
      alert("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const selectCompany = async (companyId) => {
    try {
      await api.post(`/dashboard/select-company/${companyId}`);
      navigate("/dashboard");
    } catch {
      alert("Failed to select company");
    }
  };

  const editCompany = (company) => {
    setEditingId(company.id);
    setForm({
      name: company.name,
      address: company.address,
      gst_number: company.gst_number,
      state: company.state,
    });
  };

  const updateCompany = async () => {
    try {
      await api.put(`/companies/${editingId}`, form);
      alert("Company updated");
      setEditingId(null);
      setForm({
        name: "",
        address: "",
        gst_number: "",
        state: "",
      });
      getCompanies();
    } catch {
      alert("Failed to update company");
    }
  };

  const deleteCompany = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    try {
      await api.delete(`/companies/${companyId}`);
      alert("Company deleted");
      getCompanies();
    } catch {
      alert("Failed to delete company");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      name: "",
      address: "",
      gst_number: "",
      state: "",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  useEffect(() => {
    getCompanies();

    setTimeout(() => {
      companyRef.current?.focus();
    }, 100);
  }, []);

  const handleCompanyKeyDown = (e) => {
    if (companies.length === 0 || editingId) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < companies.length - 1 ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : prev
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();
      selectCompany(companies[selectedIndex].id);
    }
  };

  if (loading) {
    return <h1 className="p-10 text-xl">Loading companies...</h1>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Select Company</h1>
            <p className="text-gray-600 mt-1">
              Choose a company to open Gateway of SmartERP
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {editingId && (
          <div className="bg-white p-6 rounded shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">Update Company</h2>

            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="Company Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <input
              className="border p-3 rounded w-full mb-3"
              placeholder="GST Number"
              value={form.gst_number}
              onChange={(e) =>
                setForm({ ...form, gst_number: e.target.value })
              }
            />

            <input
              className="border p-3 rounded w-full mb-4"
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />

            <div className="flex gap-3">
              <button
                onClick={updateCompany}
                className="bg-blue-600 text-white px-5 py-3 rounded"
              >
                Update Company
              </button>

              <button
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-5 py-3 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate("/companies/create")}
          className="bg-green-600 text-white px-5 py-3 rounded mb-6"
        >
          + Create Company
        </button>

        {companies.length === 0 ? (
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-700 mb-4">
              No company found. Please create your first company.
            </p>

            <button
              onClick={() => navigate("/companies/create")}
              className="bg-blue-600 text-white px-5 py-3 rounded"
            >
              Create Company
            </button>
          </div>
        ) : (
          <div
            ref={companyRef}
            tabIndex={0}
            onKeyDown={handleCompanyKeyDown}
            className="grid gap-4 outline-none"
          >
            {companies.map((company, index) => (
              <div
                key={company.id}
                className={`p-5 rounded shadow hover:bg-blue-50 ${selectedIndex === index
                  ? "bg-blue-100 border-2 border-blue-500"
                  : "bg-white border-2 border-transparent"
                  }`}
              >
                <div
                  onClick={() => selectCompany(company.id)}
                  className="cursor-pointer"
                >
                  <h2 className="text-xl font-semibold">{company.name}</h2>
                  <p className="text-gray-600">{company.address}</p>
                  <p className="text-gray-600">{company.state}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    GST: {company.gst_number}
                  </p>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => editCompany(company)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCompany(company.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanySelection;