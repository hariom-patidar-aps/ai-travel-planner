import { useEffect, useState, useMemo } from "react";
import useAuth from "../../hooks/useAuth";

import {
  addExpense,
  getExpenses,
  deleteExpense,
  calculateTotal
} from "../../services/expenseService";

export default function ExpenseTracker({
  destination,
  budget,
  expenses = [],
  setExpenses,
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Splitwise State
  const [participants, setParticipants] = useState(() => {
    const cached = localStorage.getItem(`participants_${destination}`);
    return cached ? JSON.parse(cached) : ["Me", "Friend 1", "Friend 2"];
  });
  const [newParticipant, setNewParticipant] = useState("");
  const [activeSettle, setActiveSettle] = useState(null); // { debtor, creditor, amount }
  const [recipientUpi, setRecipientUpi] = useState("friend@upi");

  // Currency Converter State
  const [inrAmount, setInrAmount] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [rates, setRates] = useState({ USD: 0.012, EUR: 0.011, GBP: 0.0095, AED: 0.044 });

  // Form State
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [paidBy, setPaidBy] = useState("Me");
  const [splitWith, setSplitWith] = useState(participants);

  // Fetch live exchange rates on mount
  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/INR");
        if (res.ok) {
          const data = await res.json();
          setRates({
            USD: data.rates.USD || 0.012,
            EUR: data.rates.EUR || 0.011,
            GBP: data.rates.GBP || 0.0095,
            AED: data.rates.AED || 0.044
          });
        }
      } catch (err) {
        console.warn("Currency Converter: Offline or rates fetch failed. Using cached rates.", err);
      }
    }
    fetchRates();
  }, []);

  // Sync converted currency
  useEffect(() => {
    if (!inrAmount || isNaN(inrAmount)) {
      setConvertedAmount(0);
      return;
    }
    setConvertedAmount(Number((Number(inrAmount) * rates[targetCurrency]).toFixed(2)));
  }, [inrAmount, targetCurrency, rates]);

  // Load expenses
  async function loadExpenses() {
    if (!user || !destination) return;
    setLoading(true);
    try {
      const data = await getExpenses(destination, user);
      setExpenses(data);
    } catch (err) {
      console.error("Load Expenses Error:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadExpenses();
  }, [destination, user]);

  // Sync participants to LocalStorage
  useEffect(() => {
    localStorage.setItem(`participants_${destination}`, JSON.stringify(participants));
    // Keep split list in sync with participants
    setSplitWith(participants);
  }, [participants, destination]);

  // Add/Remove participant
  const handleAddParticipant = () => {
    const name = newParticipant.trim();
    if (!name) return;
    if (participants.includes(name)) {
      alert("Name already exists.");
      return;
    }
    setParticipants([...participants, name]);
    setNewParticipant("");
  };

  const handleRemoveParticipant = (name) => {
    if (participants.length <= 1) {
      alert("You need at least one participant.");
      return;
    }
    setParticipants(participants.filter(p => p !== name));
    if (paidBy === name) setPaidBy(participants[0]);
  };

  // Add Expense
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (splitWith.length === 0) {
      alert("Please select at least one participant to split with.");
      return;
    }

    const newExpense = {
      category,
      amount: Number(amount),
      note: note.trim() || `${category} Expense`,
      paidBy,
      splitWith,
      createdAt: new Date().toISOString()
    };

    if (!user) {
      alert("Please login first.");
      return;
    }

    try {
      await addExpense(destination, user, newExpense);
      setAmount("");
      setNote("");
      loadExpenses();
    } catch (err) {
      console.error(err);
      alert("Failed to save expense.");
    }
  };

  // Delete Expense
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await deleteExpense(id);
      loadExpenses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete expense.");
    }
  };

  // Checkbox toggle for splitting
  const toggleSplitParticipant = (name) => {
    if (splitWith.includes(name)) {
      setSplitWith(splitWith.filter(p => p !== name));
    } else {
      setSplitWith([...splitWith, name]);
    }
  };

  // ==========================================
  // SPLITWISE BALANCE ALGORITHM
  // ==========================================
  const settlements = useMemo(() => {
    const balances = {};
    participants.forEach(p => { balances[p] = 0; });

    expenses.forEach(exp => {
      const payers = exp.paidBy || "Me";
      const shares = exp.splitWith || participants;
      const amt = Number(exp.amount || 0);

      // Add what they paid
      if (balances[payers] !== undefined) {
        balances[payers] += amt;
      }

      // Subtract their split share
      const shareCost = amt / shares.length;
      shares.forEach(person => {
        if (balances[person] !== undefined) {
          balances[person] -= shareCost;
        }
      });
    });

    // Simplify debts
    const creditors = [];
    const debtors = [];

    Object.keys(balances).forEach(person => {
      const bal = Number(balances[person].toFixed(2));
      if (bal > 0.05) {
        creditors.push({ name: person, amount: bal });
      } else if (bal < -0.05) {
        debtors.push({ name: person, amount: Math.abs(bal) });
      }
    });

    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    const list = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const minAmt = Math.min(debtor.amount, creditor.amount);
      list.push({
        debtor: debtor.name,
        creditor: creditor.name,
        amount: Math.round(minAmt)
      });

      debtor.amount -= minAmt;
      creditor.amount -= minAmt;

      if (debtor.amount < 0.05) i++;
      if (creditor.amount < 0.05) j++;
    }

    return list;
  }, [expenses, participants]);

  const totalSpent = calculateTotal(expenses);
  const remaining = budget - totalSpent;

  // UPI URL Builder
  const upiQrUrl = useMemo(() => {
    if (!activeSettle) return "";
    const upiUrl = `upi://pay?pa=${encodeURIComponent(recipientUpi)}&pn=${encodeURIComponent(activeSettle.creditor)}&am=${activeSettle.amount}&cu=INR`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUrl)}`;
  }, [activeSettle, recipientUpi]);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Currency Converter & Participant Management */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Currency Converter */}
        <div className="glass rounded-3xl p-6 border border-slate-700/35">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            💱 Currency Desk
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Amount in Indian Rupees (INR)</label>
              <input
                type="number"
                placeholder="Enter amount (₹)"
                value={inrAmount}
                onChange={(e) => setInrAmount(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-800/80 text-white border border-slate-700/40 text-sm focus:border-cyan-500 outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Convert To</label>
                <select
                  value={targetCurrency}
                  onChange={(e) => setTargetCurrency(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700/40 text-sm focus:border-cyan-500 outline-none"
                >
                  <option value="USD">🇺🇸 USD ($)</option>
                  <option value="EUR">🇪🇺 EUR (€)</option>
                  <option value="GBP">🇬🇧 GBP (£)</option>
                  <option value="AED">🇦🇪 AED (Dh)</option>
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <span className="text-xs text-slate-400 block mb-1">Converted Total</span>
                <div className="p-3 bg-slate-900/60 border border-slate-700/40 rounded-xl text-cyan-400 font-bold text-center text-sm">
                  {convertedAmount} {targetCurrency}
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 italic">
              Live Exchange Rates applied: 1 INR = {(rates[targetCurrency] || 0).toFixed(5)} {targetCurrency}
            </p>
          </div>
        </div>

        {/* Participants Registry */}
        <div className="glass rounded-3xl p-6 border border-slate-700/35">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            👥 Co-Travelers
          </h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter traveler name..."
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddParticipant()}
                className="flex-1 p-3 rounded-xl bg-slate-800/80 text-white border border-slate-700/40 text-sm outline-none"
              />
              <button
                onClick={handleAddParticipant}
                className="primary-btn px-4 py-2 border-none"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
              {participants.map((person) => (
                <span
                  key={person}
                  className="bg-slate-800 text-slate-200 border border-slate-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-2"
                >
                  {person}
                  {person !== "Me" && (
                    <button
                      onClick={() => handleRemoveParticipant(person)}
                      className="text-red-400 hover:text-red-300 font-semibold"
                    >
                      ✕
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 2. Log Expense Form & Ledgers */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Log Form */}
        <div className="glass rounded-3xl p-6 border border-slate-700/35">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            💸 Log Split Expense
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700/40 text-sm outline-none"
                >
                  <option>Food</option>
                  <option>Hotel</option>
                  <option>Transport</option>
                  <option>Shopping</option>
                  <option>Tickets</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="₹ Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800/80 text-white border border-slate-700/40 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Paid By</label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700/40 text-sm outline-none"
              >
                {participants.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Split With (Participating)</label>
              <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                {participants.map(person => (
                  <label key={person} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={splitWith.includes(person)}
                      onChange={() => toggleSplitParticipant(person)}
                      className="rounded border-slate-700 bg-slate-800 text-cyan-500 outline-none focus:ring-0"
                    />
                    {person}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Note (Optional)</label>
              <input
                type="text"
                placeholder="Dinner, Train fare, Tickets..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-800/80 text-white border border-slate-700/40 text-sm outline-none"
              />
            </div>

            <button type="submit" className="primary-btn w-full mt-4">
              ➕ Add Split Expense
            </button>
          </form>
        </div>

        {/* Ledger & Debts */}
        <div className="glass rounded-3xl p-6 border border-slate-700/35 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              💳 Shared Expenses Log
            </h2>

            {loading ? (
              <p className="text-slate-400 text-center py-6 text-sm">Loading expenses...</p>
            ) : expenses.length === 0 ? (
              <p className="text-slate-400 text-center py-6 text-sm">No expenses logged for this trip yet.</p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {expenses.map((expense) => {
                  const payers = expense.paidBy || "Me";
                  const shareList = expense.splitWith || participants;
                  return (
                    <div
                      key={expense.id}
                      className="flex justify-between items-center bg-slate-800/60 border border-slate-700/30 rounded-xl p-3.5"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white truncate">{expense.note}</h4>
                          <span className="text-[10px] bg-slate-900 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                            {expense.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Paid by <strong className="text-slate-300">{payers}</strong>, split with {shareList.length} travelers
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-cyan-400 font-bold text-sm block">₹{expense.amount}</span>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-[10px] text-red-400 hover:text-red-300 mt-1"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Budget Overview */}
          <div className="mt-6 border-t border-slate-800 pt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Total Budget</span>
              <strong className="text-white text-sm">₹{budget}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Total Spent</span>
              <strong className="text-red-400 text-sm">₹{totalSpent}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Remaining</span>
              <strong className={`text-sm ${remaining >= 0 ? "text-green-400" : "text-red-400"}`}>
                ₹{remaining}
              </strong>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Debt Settlements & Simplify balances */}
      <div className="glass rounded-3xl p-6 border border-slate-700/35">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          🤝 Simplified Settlement Ledger
        </h3>
        
        {settlements.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">
            Everything is balanced! No outstanding dues.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settlements.map((settle, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>DEBTOR</span>
                    <span>CREDITOR</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold mt-1">
                    <span className="text-red-400">{settle.debtor}</span>
                    <span className="text-slate-400">➜</span>
                    <span className="text-green-400">{settle.creditor}</span>
                  </div>
                  <div className="text-center mt-3 font-bold text-white text-lg">
                    ₹{settle.amount}
                  </div>
                </div>
                
                <button
                  onClick={() => setActiveSettle(settle)}
                  className="primary-btn w-full py-1.5 text-xs font-bold border-none"
                >
                  ⚡ Settle Up (UPI QR)
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Settle Up UPI QR Modal */}
      {activeSettle && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-6 border border-cyan-500/20 max-w-sm w-full bg-slate-900/90 shadow-2xl text-center relative animate-scale-up">
            
            <button 
              onClick={() => setActiveSettle(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-white mb-2">⚡ Instant UPI Settlement</h3>
            <p className="text-xs text-slate-400 px-4">
              Scan with GPay, PhonePe, or Paytm to pay <strong>{activeSettle.creditor}</strong>.
            </p>

            {/* Recipient UPI ID customizer */}
            <div className="mt-4 mb-5 text-left max-w-[240px] mx-auto">
              <label className="text-[10px] text-slate-400 block mb-1">{activeSettle.creditor}'s UPI ID</label>
              <input
                type="text"
                value={recipientUpi}
                onChange={(e) => setRecipientUpi(e.target.value)}
                placeholder="recipient@upi"
                className="w-full p-2 bg-slate-800 text-white rounded-lg text-xs border border-slate-700 outline-none text-center"
              />
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mx-auto">
              <img 
                src={upiQrUrl} 
                alt="UPI Payment QR Code"
                className="w-48 h-48 block" 
              />
            </div>

            <div className="mt-5 space-y-2">
              <p className="text-sm font-semibold text-white">
                Amount: <span className="text-cyan-400 text-lg font-bold">₹{activeSettle.amount}</span>
              </p>
              <p className="text-[10px] text-slate-400 italic">
                From: {activeSettle.debtor} ➜ To: {activeSettle.creditor}
              </p>
            </div>

            <button
              onClick={() => {
                alert(`Mock settlement of ₹${activeSettle.amount} confirmed!`);
                setActiveSettle(null);
              }}
              className="primary-btn w-full mt-6 py-2.5 text-xs font-bold border-none"
            >
              ✓ Confirm Payment Settled
            </button>

          </div>
        </div>
      )}

    </div>
  );
}