import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        email,
        password,
      });

      alert("Registration Successful");
      navigate("/");
    } catch (error) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-96 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          SmartERP Register
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white p-3 rounded"
        >
          Register
        </button>

        <p className="text-center mt-4">
          Already have an account?
          <Link to="/" className="text-blue-600 ml-2">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;