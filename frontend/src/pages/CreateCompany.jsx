import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateCompany() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [state, setState] = useState("");

  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      await api.post("/companies/", {
        name,
        address,
        gst_number: gstNumber,
        state,
      });

      alert("Company Created");
      navigate("/companies");
    } catch (error) {
      alert("Failed to create company");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[500px] p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">
          Create Company
        </h1>

        <input
          type="text"
          placeholder="Company Name"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Address"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          type="text"
          placeholder="GST Number"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) => setGstNumber(e.target.value)}
        />

        <input
          type="text"
          placeholder="State"
          className="w-full border p-3 rounded mb-6"
          onChange={(e) => setState(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          Create Company
        </button>
      </div>
    </div>
  );
}

export default CreateCompany;