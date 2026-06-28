import { useEffect, useState } from "react";
import api from "../services/api";

function PurchaseVoucher() {
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const [form, setForm] = useState({
    party_id: "",
    item_id: "",
    quantity: 1,
    rate: 0,
    gst_percent: 18,
  });

  const getSuppliers = async () => {
    const res = await api.get("/ledgers/");
    const supplierList = res.data.filter(
      (ledger) => ledger.ledger_type === "supplier"
    );
    setSuppliers(supplierList);
  };

  const getItems = async () => {
    const res = await api.get("/items/");
    setItems(res.data);
  };

  const getPurchases = async () => {
    const res = await api.get("/vouchers/purchase");
    setPurchases(res.data);
  };

  const savePurchase = async () => {
    try {
      await api.post("/vouchers/purchase", {
        party_id: Number(form.party_id),
        item_id: Number(form.item_id),
        quantity: Number(form.quantity),
        rate: Number(form.rate),
        gst_percent: Number(form.gst_percent),
      });

      alert("Purchase voucher created");

      setForm({
        party_id: "",
        item_id: "",
        quantity: 1,
        rate: 0,
        gst_percent: 18,
      });

      getPurchases();
      getItems();
    } catch (error) {
      alert(error.response?.data?.detail || "Error");
    }
  };

  useEffect(() => {
    getSuppliers();
    getItems();
    getPurchases();
  }, []);

  const amount = form.quantity * form.rate;
  const gst = amount * form.gst_percent / 100;
  const total = amount + gst;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">
        Purchase Voucher
      </h1>

      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Create Purchase Voucher
        </h2>

        <select
          className="border p-3 rounded w-full mb-3"
          value={form.party_id}
          onChange={(e) =>
            setForm({ ...form, party_id: e.target.value })
          }
        >
          <option value="">Select Supplier</option>

          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>

        <select
          className="border p-3 rounded w-full mb-3"
          value={form.item_id}
          onChange={(e) =>
            setForm({ ...form, item_id: e.target.value })
          }
        >
          <option value="">Select Item</option>

          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="border p-3 rounded w-full mb-3"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) =>
            setForm({ ...form, quantity: e.target.value })
          }
        />

        <input
          type="number"
          className="border p-3 rounded w-full mb-3"
          placeholder="Rate"
          value={form.rate}
          onChange={(e) =>
            setForm({ ...form, rate: e.target.value })
          }
        />

        <input
          type="number"
          className="border p-3 rounded w-full mb-4"
          placeholder="GST %"
          value={form.gst_percent}
          onChange={(e) =>
            setForm({
              ...form,
              gst_percent: e.target.value,
            })
          }
        />

        <div className="bg-gray-100 p-4 rounded mb-4">
          <p>Amount: ₹{amount}</p>
          <p>GST: ₹{gst}</p>
          <p className="font-bold">
            Total: ₹{total}
          </p>
        </div>

        <button
          onClick={savePurchase}
          className="bg-blue-600 text-white px-5 py-3 rounded"
        >
          Save Purchase
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          Purchase History
        </h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3">ID</th>
              <th className="border p-3">Item</th>
              <th className="border p-3">Qty</th>
              <th className="border p-3">Rate</th>
              <th className="border p-3">Total</th>
            </tr>
          </thead>

          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.id}>
                <td className="border p-3">
                  {purchase.id}
                </td>
                <td className="border p-3">
                  {purchase.item_id}
                </td>
                <td className="border p-3">
                  {purchase.quantity}
                </td>
                <td className="border p-3">
                  ₹{purchase.rate}
                </td>
                <td className="border p-3">
                  ₹{purchase.total_amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PurchaseVoucher;