export default function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}