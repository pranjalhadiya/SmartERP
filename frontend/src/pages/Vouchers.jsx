import { useNavigate } from "react-router-dom";

function Vouchers() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">
        Voucher Management
      </h1>

      <div className="grid grid-cols-2 gap-5">

        <button
          onClick={() => navigate("/purchase")}
          className="bg-blue-600 text-white p-8 rounded-lg shadow hover:bg-blue-700 text-left"
        >
          <h2 className="text-2xl font-semibold">
            Purchase Voucher
          </h2>

          <p className="mt-2">
            Purchase entries and stock increase
          </p>
        </button>

        <button
          onClick={() => navigate("/sales")}
          className="bg-green-600 text-white p-8 rounded-lg shadow hover:bg-green-700 text-left"
        >
          <h2 className="text-2xl font-semibold">
            Sales Voucher
          </h2>

          <p className="mt-2">
            Sales entries and stock deduction
          </p>
        </button>

      </div>
    </div>
  );
}

export default Vouchers;