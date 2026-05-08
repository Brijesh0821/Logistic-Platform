import { useEffect, useMemo, useState } from "react";
import { FiBox, FiCheckCircle, FiClock, FiDollarSign } from "react-icons/fi";
import axios from "../utils/axiosConfig";
import Card, { CardBody, CardHeader } from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const place = (booking, type) =>
  booking[type] || booking[`${type}Address`] || (type === "from" ? booking.pickup : booking.drop) || "Not available";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/booking");
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const revenue = bookings.reduce((sum, booking) => sum + Number(booking.price || 0), 0);
    const delivered = bookings.filter((booking) => booking.status === "Delivered").length;
    const active = bookings.filter((booking) => booking.status !== "Delivered").length;
    return { revenue, delivered, active };
  }, [bookings]);

  const columns = [
    { key: "trackingId", header: "Tracking ID", accessor: (row) => row.trackingId || row._id?.slice(-8) || "-" },
    { key: "from", header: "From", accessor: (row) => place(row, "from") },
    { key: "to", header: "To", accessor: (row) => place(row, "to") },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { key: "price", header: "Price", accessor: (row) => Number(row.price || 0), render: (row) => inr.format(row.price || 0) },
  ];

  if (loading) {
    return (
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-xl bg-white" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-xl bg-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FiBox} label="Total Bookings" value={bookings.length} helper="All shipment orders" />
        <StatCard icon={FiDollarSign} label="Revenue" value={inr.format(stats.revenue)} tone="green" helper="Booked shipment value" />
        <StatCard icon={FiClock} label="Active Shipments" value={stats.active} tone="amber" helper="Pending or in transit" />
        <StatCard icon={FiCheckCircle} label="Delivered" value={stats.delivered} tone="green" helper="Completed shipments" />
      </div>

      <Card>
        <CardHeader title="Recent Bookings" subtitle="Sortable booking history with shipment status" />
        <CardBody className="p-0">
          <DataTable
            columns={columns}
            data={bookings}
            emptyTitle="No bookings yet"
            emptyMessage="Create your first shipment to start tracking logistics activity."
          />
        </CardBody>
      </Card>
    </div>
  );
}
