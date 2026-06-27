import { useEffect, useState } from "react";
import api from "../services/api";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    group_type: "Assets",
  });

  const getGroups = async () => {
    const res = await api.get("/groups/");
    setGroups(res.data);
  };

  const resetForm = () => {
    setForm({
      name: "",
      group_type: "Assets",
    });
    setEditingId(null);
  };

  const saveGroup = async () => {
    try {
      if (editingId) {
        await api.put(`/groups/${editingId}`, form);
        alert("Group updated");
      } else {
        await api.post("/groups/", form);
        alert("Group created");
      }

      resetForm();
      getGroups();
    } catch {
      alert("Failed to save group");
    }
  };

  const editGroup = (group) => {
    setEditingId(group.id);
    setForm({
      name: group.name,
      group_type: group.group_type,
    });
  };

  const deleteGroup = async (id) => {
    if (!window.confirm("Delete this group?")) return;

    await api.delete(`/groups/${id}`);
    getGroups();
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Group Management</h1>

      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Update Group" : "Create Group"}
        </h2>

        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="Group Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <select
          className="border p-3 rounded w-full mb-4"
          value={form.group_type}
          onChange={(e) => setForm({ ...form, group_type: e.target.value })}
        >
          <option value="Assets">Assets</option>
          <option value="Liabilities">Liabilities</option>
          <option value="Income">Income</option>
          <option value="Expenses">Expenses</option>
        </select>

        <div className="flex gap-3">
          <button
            onClick={saveGroup}
            className="bg-blue-600 text-white px-5 py-3 rounded"
          >
            {editingId ? "Update Group" : "Create Group"}
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
        <h2 className="text-xl font-semibold mb-4">Groups</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3">Name</th>
              <th className="border p-3">Type</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td className="border p-3">{group.name}</td>
                <td className="border p-3">{group.group_type}</td>
                <td className="border p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => editGroup(group)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteGroup(group.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {groups.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-5">
                  No groups found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Groups;