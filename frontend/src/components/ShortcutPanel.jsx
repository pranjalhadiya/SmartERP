import { useState } from "react";

function ShortcutPanel() {
  const [open, setOpen] = useState(false);

  const shortcuts = [
    ["F1", "Company"],
    ["Esc", "Back"],
    ["Ctrl + H", "Dashboard"],
    ["Ctrl + Q", "Logout"],
    ["Alt + L", "Ledgers"],
    ["Alt + G", "Groups"],
    ["Alt + S", "Stock"],
    ["F8", "Sales"],
    ["F9", "Purchase"],
    ["Ctrl + R", "Reports"],
    ["Ctrl + B", "Vouchers"],
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 w-72 rounded-xl bg-white shadow-xl border p-4">
          <h2 className="text-lg font-bold mb-3">Keyboard Shortcuts</h2>

          <div className="space-y-2">
            {shortcuts.map(([key, action]) => (
              <div
                key={key}
                className="flex justify-between text-sm border-b pb-1"
              >
                <span className="font-semibold bg-gray-100 px-2 py-1 rounded">
                  {key}
                </span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg"
      >
        Shortcuts
      </button>
    </div>
  );
}

export default ShortcutPanel;