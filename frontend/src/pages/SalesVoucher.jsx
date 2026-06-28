import { useEffect, useState } from "react";
import api from "../services/api";

function SalesVoucher() {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [sales, setSales] = useState([]);

  const [form, setForm] = useState({
    party_id: "",
    item_id: "",
    quantity: 1,
    rate: 0,
    gst_percent: 18,
  });

  const getCustomers = async () => {
    const res = await api.get("/ledgers/");
    setCustomers(res.data.filter((ledger) => ledger.ledger_type === "customer"));
  };

  const getItems = async () => {
    const res = await api.get("/items/");
    setItems(res.data);
  };

  const getSales = async () => {
    const res = await api.get("/vouchers/sales");
    setSales(res.data);
  };

  const saveSales = async () => {
    try {
      await api.post("/vouchers/sales", {
        party_id: Number(form.party_id),
        item_id: Number(form.item_id),
        quantity: Number(form.quantity),
        rate: Number(form.rate),
        gst_percent: Number(form.gst_percent),
      });

      alert("Sales voucher created");

      setForm({
        party_id: "",
        item_id: "",
        quantity: 1,
        rate: 0,
        gst_percent: 18,
      });

      getSales();
      getItems();
    } catch (error) {
      alert(error.response?.data?.detail || "Error creating sales voucher");
    }
  };

  useEffect(() => {
    getCustomers();
    getItems();
    getSales();
  }, []);

  const amount = Number(form.quantity) * Number(form.rate);
  const gst = (amount * Number(form.gst_percent)) / 100;
  const total = amount + gst;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Sales Voucher</h1>

      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Create Sales Voucher</h2>

        <select
          className="border p-3 rounded w-full mb-3"
          value={form.party_id}
          onChange={(e) => setForm({ ...form, party_id: e.target.value })}
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>

        <select
          className="border p-3 rounded w-full mb-3"
          value={form.item_id}
          onChange={(e) => setForm({ ...form, item_id: e.target.value })}
        >
          <option value="">Select Item</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} — Stock: {item.quantity}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="border p-3 rounded w-full mb-3"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />

        <input
          type="number"
          className="border p-3 rounded w-full mb-3"
          placeholder="Rate"
          value={form.rate}
          onChange={(e) => setForm({ ...form, rate: e.target.value })}
        />

        <input
          type="number"
          className="border p-3 rounded w-full mb-4"
          placeholder="GST %"
          value={form.gst_percent}
          onChange={(e) => setForm({ ...form, gst_percent: e.target.value })}
        />

        <div className="bg-gray-100 p-4 rounded mb-4">
          <p>Amount: ₹{amount}</p>
          <p>GST: ₹{gst}</p>
          <p className="font-bold">Total: ₹{total}</p>
        </div>

        <button
          onClick={saveSales}
          className="bg-purple-600 text-white px-5 py-3 rounded"
        >
          Save Sales
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Sales History</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3">ID</th>
              <th className="border p-3">Item ID</th>
              <th className="border p-3">Qty</th>
              <th className="border p-3">Rate</th>
              <th className="border p-3">Total</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td className="border p-3">{sale.id}</td>
                <td className="border p-3">{sale.item_id}</td>
                <td className="border p-3">{sale.quantity}</td>
                <td className="border p-3">₹{sale.rate}</td>
                <td className="border p-3">₹{sale.total_amount}</td>
              </tr>
            ))}

            {sales.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-5">
                  No sales vouchers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesVoucher;