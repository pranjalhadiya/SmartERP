import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Invoice() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  const getInvoice = async () => {
    const res = await api.get(`/vouchers/invoice/${id}`);
    setInvoice(res.data);
  };

  const downloadPDF = async () => {
    const res = await api.get(`/vouchers/invoice/${id}/pdf`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", `invoice_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  useEffect(() => {
    getInvoice();
  }, []);

  if (!invoice) {
    return <h1 className="p-10">Loading...</h1>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded shadow">
        <h1 className="text-3xl font-bold text-center mb-8">
          TAX INVOICE
        </h1>

        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold">{invoice.company.name}</h2>
            <p>{invoice.company.address}</p>
            <p>GSTIN: {invoice.company.gst_number}</p>
            <p>State: {invoice.company.state}</p>
          </div>

          <div>
            <p><strong>Invoice No:</strong> {invoice.invoice_no}</p>
          </div>
        </div>

        <hr className="mb-6" />

        <div className="mb-6">
          <h3 className="font-bold mb-2">Bill To:</h3>
          <p>{invoice.customer.name}</p>
          <p>{invoice.customer.address}</p>
          <p>{invoice.customer.phone}</p>
        </div>

        <table className="w-full border mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3">Item</th>
              <th className="border p-3">HSN</th>
              <th className="border p-3">Qty</th>
              <th className="border p-3">Rate</th>
              <th className="border p-3">GST</th>
              <th className="border p-3">Total</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border p-3">{invoice.item}</td>
              <td className="border p-3">{invoice.hsn_code}</td>
              <td className="border p-3">{invoice.quantity}</td>
              <td className="border p-3">₹{invoice.rate}</td>
              <td className="border p-3">{invoice.gst_percent}%</td>
              <td className="border p-3">₹{invoice.total}</td>
            </tr>
          </tbody>
        </table>

        <div className="text-right text-lg">
          <p>Amount: ₹{invoice.amount}</p>
          <p>GST Amount: ₹{invoice.gst_amount}</p>
          <h2 className="text-2xl font-bold mt-3">
            Grand Total: ₹{invoice.total}
          </h2>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-5 py-3 rounded"
          >
            Print Invoice
          </button>

          <button
            onClick={downloadPDF}
            className="bg-green-600 text-white px-5 py-3 rounded"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default Invoice;