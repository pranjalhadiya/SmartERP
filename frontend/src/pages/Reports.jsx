import { useState } from "react";
import api from "../services/api";

function Reports() {
    const [reportType, setReportType] = useState("");
    const [data, setData] = useState(null);

    const loadReport = async (type) => {
        setReportType(type);
        setData(null);

        let endpoint = "";

        if (type === "stock") endpoint = "/reports/stock-summary";
        if (type === "sales") endpoint = "/reports/sales";
        if (type === "purchase") endpoint = "/reports/purchase";
        if (type === "outstanding") endpoint = "/reports/outstanding";

        try {
            const res = await api.get(endpoint);
            setData(res.data);
        } catch (error) {
            alert("Failed to load report");
            setData(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">Reports</h1>

            <div className="grid grid-cols-4 gap-4 mb-8">
                <button
                    onClick={() => loadReport("stock")}
                    className="bg-blue-600 text-white p-5 rounded shadow"
                >
                    Stock Summary
                </button>

                <button
                    onClick={() => loadReport("sales")}
                    className="bg-green-600 text-white p-5 rounded shadow"
                >
                    Sales Report
                </button>

                <button
                    onClick={() => loadReport("purchase")}
                    className="bg-purple-600 text-white p-5 rounded shadow"
                >
                    Purchase Report
                </button>

                <button
                    onClick={() => loadReport("outstanding")}
                    className="bg-orange-600 text-white p-5 rounded shadow"
                >
                    Outstanding Report
                </button>
            </div>

            {!data && reportType === "" && (
                <p className="text-gray-600">Select a report to view data.</p>
            )}

            {!data && reportType !== "" && (
                <p className="text-gray-600">Loading report...</p>
            )}

            {reportType === "stock" && data && (
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Stock Summary</h2>

                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-3">Item</th>
                                <th className="border p-3">SKU</th>
                                <th className="border p-3">Qty</th>
                                <th className="border p-3">Purchase Price</th>
                                <th className="border p-3">Stock Value</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td className="border p-3">{item.name}</td>
                                    <td className="border p-3">{item.sku}</td>
                                    <td className="border p-3">{item.quantity}</td>
                                    <td className="border p-3">₹{item.purchase_price}</td>
                                    <td className="border p-3">₹{item.stock_value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {reportType === "sales" && data && (
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Sales Report</h2>

                    <p className="mb-4 font-bold">Total Sales: ₹{data.total_sales}</p>

                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-3">Voucher ID</th>
                                <th className="border p-3">Customer</th>
                                <th className="border p-3">Item ID</th>
                                <th className="border p-3">Qty</th>
                                <th className="border p-3">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.sales.map((sale) => (
                                <tr key={sale.id}>
                                    <td className="border p-3">{sale.id}</td>
                                    <td className="border p-3">{sale.customer}</td>
                                    <td className="border p-3">{sale.item_id}</td>
                                    <td className="border p-3">{sale.quantity}</td>
                                    <td className="border p-3">₹{sale.total_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {reportType === "purchase" && data && (
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Purchase Report</h2>

                    <p className="mb-4 font-bold">
                        Total Purchase: ₹{data.total_purchase}
                    </p>

                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-3">Voucher ID</th>
                                <th className="border p-3">Supplier</th>
                                <th className="border p-3">Item ID</th>
                                <th className="border p-3">Qty</th>
                                <th className="border p-3">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.purchases.map((purchase) => (
                                <tr key={purchase.id}>
                                    <td className="border p-3">{purchase.id}</td>
                                    <td className="border p-3">{purchase.supplier}</td>
                                    <td className="border p-3">{purchase.item_id}</td>
                                    <td className="border p-3">{purchase.quantity}</td>
                                    <td className="border p-3">₹{purchase.total_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {reportType === "outstanding" && data && (
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Outstanding Report</h2>

                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-3">Ledger</th>
                                <th className="border p-3">Type</th>
                                <th className="border p-3">Balance</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((ledger) => (
                                <tr key={ledger.id}>
                                    <td className="border p-3">{ledger.name}</td>
                                    <td className="border p-3">{ledger.ledger_type}</td>
                                    <td className="border p-3">₹{ledger.balance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Reports;