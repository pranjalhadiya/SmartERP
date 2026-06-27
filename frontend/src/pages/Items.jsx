import { useEffect, useState } from "react";
import api from "../services/api";

function Items() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    hsn_code: "",
    quantity: 0,
    purchase_price: 0,
    selling_price: 0,
    gst_percent: 0,
  });

  const getItems = async () => {
    const res = await api.get("/items/");
    setItems(res.data);
  };

  const resetForm = () => {
    setForm({
      name: "",
      sku: "",
      hsn_code: "",
      quantity: 0,
      purchase_price: 0,
      selling_price: 0,
      gst_percent: 0,
    });
    setEditingId(null);
  };

  const saveItem = async () => {
    try {
      if (editingId) {
        await api.put(`/items/${editingId}`, form);
        alert("Item updated");
      } else {
        await api.post("/items/", form);
        alert("Item created");
      }

      resetForm();
      getItems();
    } catch {
      alert("Failed to save item");
    }
  };

  const editItem = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      sku: item.sku,
      hsn_code: item.hsn_code,
      quantity: item.quantity,
      purchase_price: item.purchase_price,
      selling_price: item.selling_price,
      gst_percent: item.gst_percent,
    });
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    await api.delete(`/items/${id}`);
    getItems();
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Inventory / Stock Items</h1>

      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Update Item" : "Create Item"}
        </h2>

        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="Item Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="SKU"
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
        />

        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="HSN Code"
          value={form.hsn_code}
          onChange={(e) => setForm({ ...form, hsn_code: e.target.value })}
        />

        <input
          type="number"
          className="border p-3 rounded w-full mb-3"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
        />

        <input
          type="number"
          className="border p-3 rounded w-full mb-3"
          placeholder="Purchase Price"
          value={form.purchase_price}
          onChange={(e) =>
            setForm({ ...form, purchase_price: Number(e.target.value) })
          }
        />

        <input
          type="number"
          className="border p-3 rounded w-full mb-3"
          placeholder="Selling Price"
          value={form.selling_price}
          onChange={(e) =>
            setForm({ ...form, selling_price: Number(e.target.value) })
          }
        />

        <input
          type="number"
          className="border p-3 rounded w-full mb-4"
          placeholder="GST %"
          value={form.gst_percent}
          onChange={(e) =>
            setForm({ ...form, gst_percent: Number(e.target.value) })
          }
        />

        <div className="flex gap-3">
          <button
            onClick={saveItem}
            className="bg-blue-600 text-white px-5 py-3 rounded"
          >
            {editingId ? "Update Item" : "Create Item"}
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

      <div className="bg-white p-6 rounded shadow overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Stock Items</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3">Name</th>
              <th className="border p-3">SKU</th>
              <th className="border p-3">HSN</th>
              <th className="border p-3">Qty</th>
              <th className="border p-3">Purchase</th>
              <th className="border p-3">Selling</th>
              <th className="border p-3">GST</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border p-3">{item.name}</td>
                <td className="border p-3">{item.sku}</td>
                <td className="border p-3">{item.hsn_code}</td>
                <td className="border p-3">{item.quantity}</td>
                <td className="border p-3">₹{item.purchase_price}</td>
                <td className="border p-3">₹{item.selling_price}</td>
                <td className="border p-3">{item.gst_percent}%</td>
                <td className="border p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => editItem(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-5">
                  No stock items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Items;