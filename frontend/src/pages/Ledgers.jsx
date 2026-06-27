import { useEffect, useState } from "react";
import api from "../services/api";

function Ledgers() {
  const [ledgers, setLedgers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    ledger_type: "customer",
    phone: "",
    address: "",
    opening_balance: 0,
  });

  const getLedgers = async () => {
    const res = await api.get("/ledgers/");
    setLedgers(res.data);
  };

  const resetForm = () => {
    setForm({
      name: "",
      ledger_type: "customer",
      phone: "",
      address: "",
      opening_balance: 0,
    });
    setEditingId(null);
  };

  const saveLedger = async () => {
    try {
      if (editingId) {
        await api.put(`/ledgers/${editingId}`, form);
        alert("Ledger updated");
      } else {
        await api.post("/ledgers/", form);
        alert("Ledger created");
      }

      resetForm();
      getLedgers();
    } catch (error) {
      alert("Failed to save ledger");
    }
  };

  const editLedger = (ledger) => {
    setEditingId(ledger.id);
    setForm({
      name: ledger.name,
      ledger_type: ledger.ledger_type,
      phone: ledger.phone || "",
      address: ledger.address || "",
      opening_balance: ledger.opening_balance || 0,
    });
  };

  const deleteLedger = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this ledger?");

    if (!confirmDelete) return;

    await api.delete(`/ledgers/${id}`);
    getLedgers();
  };

  useEffect(() => {
    getLedgers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Ledger Management</h1>

      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Update Ledger" : "Create Ledger"}
        </h2>

        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="Ledger Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <select
          className="border p-3 rounded w-full mb-3"
          value={form.ledger_type}
          onChange={(e) => setForm({ ...form, ledger_type: e.target.value })}
        >
          <option value="customer">Customer</option>
          <option value="supplier">Supplier</option>
          <option value="cash">Cash</option>
          <option value="bank">Bank</option>
        </select>

        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <input
          type="number"
          className="border p-3 rounded w-full mb-4"
          placeholder="Opening Balance"
          value={form.opening_balance}
          onChange={(e) =>
            setForm({ ...form, opening_balance: Number(e.target.value) })
          }
        />

        <div className="flex gap-3">
          <button
            onClick={saveLedger}
            className="bg-blue-600 text-white px-5 py-3 rounded"
          >
            {editingId ? "Update Ledger" : "Create Ledger"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="bg-gray-500 text-white px-5 py-3 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Ledgers</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3">Name</th>
              <th className="border p-3">Type</th>
              <th className="border p-3">Phone</th>
              <th className="border p-3">Opening Balance</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {ledgers.map((ledger) => (
              <tr key={ledger.id}>
                <td className="border p-3">{ledger.name}</td>
                <td className="border p-3">{ledger.ledger_type}</td>
                <td className="border p-3">{ledger.phone}</td>
                <td className="border p-3">₹{ledger.opening_balance}</td>
                <td className="border p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => editLedger(ledger)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteLedger(ledger.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {ledgers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-5">
                  No ledgers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Ledgers;