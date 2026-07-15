export default function PackingItem({
  item,
  checked,
  onToggle,
  onDelete
}) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-700/50 border border-slate-700/30 transition duration-300"
    >
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-cyan-500 cursor-pointer focus:ring-0"
        />

        <div>
          <h3
            className={`font-semibold text-sm md:text-base ${
              checked
                ? "line-through text-slate-500"
                : "text-white"
            }`}
          >
            {item.item}
          </h3>

          <p className="text-xs text-cyan-400 mt-0.5">
            {item.category}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xl">
          {checked ? "✅" : "🎒"}
        </span>
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-red-400 hover:text-red-300 text-sm transition p-1"
            title="Delete Item"
          >
            🗑
          </button>
        )}
      </div>
    </div>
  );
}