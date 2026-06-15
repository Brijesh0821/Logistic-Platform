import { useEffect, useState } from "react";
import { FiAlertTriangle, FiBarChart2, FiBox, FiCheckCircle, FiDollarSign, FiTarget, FiTrendingUp } from "react-icons/fi";
import axios from "../utils/axiosConfig";
import Card, { CardBody, CardHeader } from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const place = (booking, type) => booking[type] || booking[`${type}Address`] || "Not available";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axios.get("/booking"), axios.get("/analytics/dashboard")])
      .then(([bookingResponse, analyticsResponse]) => {
        setBookings(Array.isArray(bookingResponse.data) ? bookingResponse.data : []);
        setAnalytics(analyticsResponse.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="grid gap-5"><div className="grid gap-4 md:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-32 animate-pulse rounded-xl bg-white" />)}</div><div className="h-96 animate-pulse rounded-xl bg-white" /></div>;

  const summary = analytics?.summary || {};
  const columns = [
    { key: "trackingId", header: "Tracking ID", accessor: (row) => row.trackingId || "-" },
    { key: "route", header: "Route", accessor: (row) => `${place(row, "from")} to ${place(row, "to")}` },
    { key: "courier", header: "Courier", accessor: (row) => row.selectedCourier || "Unassigned" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "delay", header: "On-time", accessor: (row) => row.delayPrediction?.onTimeProbability || 0, render: (row) => <span className="font-semibold text-emerald-700">{row.delayPrediction?.onTimeProbability ?? "-"}%</span> },
    { key: "price", header: "Revenue", accessor: (row) => row.price || 0, render: (row) => inr.format(row.price || 0) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FiBox} label="Total Shipments" value={summary.totalShipments || 0} helper="All logistics orders" />
        <StatCard icon={FiDollarSign} label="Revenue" value={inr.format(summary.revenue || 0)} tone="green" helper={`${summary.monthlyGrowth || 0}% monthly growth`} />
        <StatCard icon={FiCheckCircle} label="Delivered" value={summary.deliveredShipments || 0} tone="green" helper={`${summary.deliverySuccessRate || 0}% success rate`} />
        <StatCard icon={FiTarget} label="Pending" value={summary.pendingShipments || 0} tone="amber" helper="Needs active monitoring" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader title="Revenue Analytics" subtitle="Monthly booked shipment value" action={<span className="flex items-center gap-1 text-sm font-semibold text-emerald-700"><FiTrendingUp /> {summary.monthlyGrowth || 0}% growth</span>} />
          <CardBody><BarChart data={analytics?.monthlyRevenue || []} /></CardBody>
        </Card>
        <Card>
          <CardHeader title="Business Insights" subtitle="Actionable signals from logistics data" />
          <CardBody className="space-y-3">
            {(analytics?.insights || []).map((item, index) => <div key={item} className="flex gap-3 rounded-lg bg-slate-50 p-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-blue-700">{index + 1}</span><p className="text-sm font-medium text-slate-700">{item}</p></div>)}
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <RankCard title="Courier Performance" data={analytics?.courierPerformance || []} />
        <RankCard title="Top Delivery Cities" data={analytics?.topCities || []} />
        <Card>
          <CardHeader title="Customer Risk Score" subtitle="Based on mismatches, failed, and returned orders" />
          <CardBody>
            <div className={`rounded-lg p-5 ${analytics?.risk?.level === "High" ? "bg-rose-50 text-rose-700" : analytics?.risk?.level === "Medium" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
              <p className="flex items-center gap-2 text-sm font-semibold"><FiAlertTriangle /> {analytics?.risk?.level || "Low"} risk</p>
              <p className="mt-2 text-4xl font-bold">{analytics?.risk?.score || 0}<span className="text-base">/100</span></p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><RiskItem label="Mismatch" value={analytics?.risk?.mismatches} /><RiskItem label="Failed" value={analytics?.risk?.failed} /><RiskItem label="Returned" value={analytics?.risk?.returned} /></div>
          </CardBody>
        </Card>
      </div>

      <Card><CardHeader title="Unified Shipment View" subtitle="Courier, delay probability, revenue, and live status in one place" /><CardBody className="p-0"><DataTable columns={columns} data={bookings} emptyTitle="No bookings yet" emptyMessage="Create your first smart shipment to generate analytics." /></CardBody></Card>
    </div>
  );
}

function BarChart({ data }) {
  const chartData = data.length ? data : [{ label: "No data", value: 0 }];
  const max = Math.max(...chartData.map((item) => item.value), 1);
  return <div className="flex h-56 items-end gap-3 rounded-lg bg-slate-50 p-4">{chartData.map((item) => <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-2"><div title={inr.format(item.value)} className="min-h-1 rounded-t-md bg-blue-600 transition hover:bg-blue-700" style={{ height: `${Math.max(3, (item.value / max) * 100)}%` }} /><p className="text-center text-xs font-semibold text-slate-500">{item.label}</p></div>)}</div>;
}

function RankCard({ title, data }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return <Card><CardHeader title={title} /><CardBody className="space-y-4">{data.length ? data.slice(0, 5).map((item) => <div key={item.name}><div className="mb-1 flex justify-between text-sm"><span className="flex items-center gap-2 font-medium text-slate-700"><FiBarChart2 className="text-blue-600" />{item.name}</span><strong>{item.value}</strong></div><div className="h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500" style={{ width: `${(item.value / max) * 100}%` }} /></div></div>) : <p className="text-sm text-slate-500">Data will appear after bookings.</p>}</CardBody></Card>;
}

function RiskItem({ label, value = 0 }) {
  return <div className="rounded-lg bg-slate-50 p-2"><strong className="block text-base text-slate-900">{value || 0}</strong><span className="text-slate-500">{label}</span></div>;
}
