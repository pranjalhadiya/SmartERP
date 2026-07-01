import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function KeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      // Prevent shortcuts while typing
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "SELECT"
      ) {
        return;
      }

      // Global Shortcuts
      if (e.key === "F1") {
        e.preventDefault();
        navigate("/companies");
      }

      if (e.key === "Escape") {
        e.preventDefault();
        navigate(-1);
      }

      if (e.ctrlKey && key === "h") {
        e.preventDefault();
        navigate("/dashboard");
      }

      if (e.ctrlKey && key === "q") {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        navigate("/");
      }

      // Masters
      if (e.altKey && key === "l") {
        e.preventDefault();
        navigate("/ledgers");
      }

      if (e.altKey && key === "g") {
        e.preventDefault();
        navigate("/groups");
      }

      if (e.altKey && key === "s") {
        e.preventDefault();
        navigate("/items");
      }

      // Vouchers
      if (e.key === "F8") {
        e.preventDefault();
        navigate("/sales");
      }

      if (e.key === "F9") {
        e.preventDefault();
        navigate("/purchase");
      }

      // Inventory
      if (e.ctrlKey && key === "i") {
        e.preventDefault();
        navigate("/items");
      }

      // Reports
      if (e.ctrlKey && key === "r") {
        e.preventDefault();
        navigate("/reports");
      }

      // Billing / Voucher area
      if (e.ctrlKey && key === "b") {
        e.preventDefault();
        navigate("/vouchers");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return null;
}

export default KeyboardShortcuts;