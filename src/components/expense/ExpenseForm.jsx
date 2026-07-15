import { useState } from "react";

export default function ExpenseForm({ onAdd }) {
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    onAdd({
      category,
      amount: Number(amount),
      note,
    });

    setCategory("Food");
    setAmount("");
    setNote("");
  }

  return (
    <div className="glass rounded-3xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        💰 Add Expense
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 rounded-xl bg-slate-800 text-white"
        >
          <option>Food</option>
          <option>Hotel</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Tickets</option>
          <option>Other</option>
        </select>

        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded-xl bg-slate-800 text-white"
        />

        <input
          type="text"
          placeholder="Note (Optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-3 rounded-xl bg-slate-800 text-white"
        />

        <button
          type="submit"
          className="primary-btn w-full"
        >
          ➕ Add Expense
        </button>

      </form>

    </div>
  );
}