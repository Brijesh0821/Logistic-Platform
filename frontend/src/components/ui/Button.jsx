const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200",
  secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-200",
  danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-200",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-200",
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
