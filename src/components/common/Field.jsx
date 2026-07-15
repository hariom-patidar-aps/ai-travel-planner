export default function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-slate-600">{label}</span>
      {children}
    </label>
  );
}