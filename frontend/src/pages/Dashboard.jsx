import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const navigate = useNavigate();

    const getDashboard = async () => {
        const res = await api.get("/dashboard/");
        setDashboard(res.data);
    };

    useEffect(() => {
        getDashboard();
    }, []);

    if (!dashboard) {
        return <h1 className="p-10">Loading...</h1>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <h1 className="text-3xl font-bold mb-2">Gateway of SmartERP</h1>
            <h2 className="text-xl mb-8">{dashboard.company}</h2>

            <div className="grid grid-cols-3 gap-5 mb-8">
                <div className="bg-white p-5 rounded shadow">Customers: {dashboard.customers}</div>
                <div className="bg-white p-5 rounded shadow">Suppliers: {dashboard.suppliers}</div>
                <div className="bg-white p-5 rounded shadow">Items: {dashboard.items}</div>
                <div className="bg-white p-5 rounded shadow">Sales: {dashboard.sales}</div>
                <div className="bg-white p-5 rounded shadow">Purchases: {dashboard.purchases}</div>
            </div>

            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-xl font-semibold mb-4">Modules</h3>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate("/ledgers")}
                        className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700 text-left"
                    >
                        <h4 className="text-lg font-semibold">Ledger Management</h4>
                        <p className="text-sm">Customers, suppliers, cash and bank ledgers</p>
                    </button>

                    <button
                        onClick={() => navigate("/groups")}
                        className="bg-indigo-600 text-white p-6 rounded-lg shadow hover:bg-indigo-700 text-left"
                    >
                        <h4 className="text-lg font-semibold">Group Management</h4>
                        <p className="text-sm">Assets, liabilities, income and expenses</p>
                    </button>

                    <button
                        onClick={() => navigate("/items")}
                        className="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700 text-left"
                    >
                        <h4 className="text-lg font-semibold">Inventory</h4>
                        <p className="text-sm">Stock items and quantity management</p>
                    </button>

                    <button
                        onClick={() => navigate("/vouchers")}
                        className="bg-purple-600 text-white p-6 rounded-lg shadow hover:bg-purple-700 text-left"
                    >
                        <h4 className="text-lg font-semibold">
                            Vouchers
                        </h4>

                        <p className="text-sm">
                            Purchase, Sales, Receipt and Payment vouchers
                        </p>
                    </button>

                    <button
                        onClick={() => navigate("/reports")}
                        className="bg-orange-600 text-white p-6 rounded-lg shadow hover:bg-orange-700 text-left"
                    >
                        <h4 className="text-lg font-semibold">Reports</h4>
                        <p className="text-sm">Sales, purchase, stock and outstanding reports</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;