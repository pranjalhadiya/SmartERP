import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CompanySelection() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getCompanies = async () => {
    try {
      const res = await api.get("/companies/");
      setCompanies(res.data);
    } catch (error) {
      alert("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const selectCompany = async (companyId) => {
    try {
      await api.post(`/dashboard/select-company/${companyId}`);
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to select company");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  useEffect(() => {
    getCompanies();
  }, []);

  if (loading) {
    return <h1 className="p-10 text-xl">Loading companies...</h1>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto">
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
          <div className="grid gap-4">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => selectCompany(company.id)}
                className="bg-white p-5 rounded shadow text-left hover:bg-blue-50"
              >
                <h2 className="text-xl font-semibold">{company.name}</h2>
                <p className="text-gray-600">{company.address}</p>
                <p className="text-gray-600">{company.state}</p>
                <p className="text-sm text-gray-500 mt-2">
                  GST: {company.gst_number}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanySelection;