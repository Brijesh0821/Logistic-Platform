const styles = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Assigned: "bg-blue-50 text-blue-700 ring-blue-200",
  "In Transit": "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Failed: "bg-rose-50 text-rose-700 ring-rose-200",
  Returned: "bg-orange-50 text-orange-700 ring-orange-200",
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function StatusBadge({ status = "Pending" }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
}
