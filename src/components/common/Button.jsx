export default function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-700 ${className}`}
    >
      {children}
    </button>
  );
}