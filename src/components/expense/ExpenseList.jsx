import { calculateTotal } from "../../services/expenseService";

export default function ExpenseList({
  expenses,
  budget,
  onDelete,
}) {
  const totalSpent = calculateTotal(expenses);
  const remaining = budget - totalSpent;

  return (
    <div className="glass rounded-3xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        💳 Expense History
      </h2>

      {expenses.length === 0 ? (
        <p className="text-slate-300">
          No expenses added yet.
        </p>
      ) : (
        <div className="space-y-4">

          {expenses.map((expense) => (

            <div
              key={expense.id}
              className="flex justify-between items-center bg-slate-800 rounded-xl p-4"
            >

              <div>

                <h3 className="text-lg font-semibold text-white">
                  {expense.category}
                </h3>

                <p className="text-slate-300">
                  {expense.note || "No note"}
                </p>

              </div>

              <div className="text-right">

                <p className="text-cyan-400 font-bold text-lg">
                  ₹{expense.amount}
                </p>

                <button
                  onClick={() => onDelete(expense.id)}
                  className="text-red-400 hover:text-red-300 mt-2"
                >
                  🗑 Delete
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

      <div className="mt-8 border-t border-slate-600 pt-6 space-y-3">

        <div className="flex justify-between">

          <span className="text-slate-300">
            Total Budget
          </span>

          <span className="font-bold text-white">
            ₹{budget}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-300">
            Total Spent
          </span>

          <span className="font-bold text-red-400">
            ₹{totalSpent}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-slate-300">
            Remaining
          </span>

          <span
            className={`font-bold ${
              remaining >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            ₹{remaining}
          </span>

        </div>

      </div>

    </div>
  );
}