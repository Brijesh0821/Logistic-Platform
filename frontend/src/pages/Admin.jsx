import { useEffect, useState } from "react";
import { FiAlertTriangle, FiImage, FiRefreshCw, FiTruck } from "react-icons/fi";
import axios from "../utils/axiosConfig";
import Button from "../components/ui/Button";
import Card, { CardBody, CardHeader } from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import { inputClass } from "../components/ui/FormField";
import StatusBadge from "../components/ui/StatusBadge";

const place = (booking, type) =>
  booking[type] || booking[`${type}Address`] || (type === "from" ? booking.pickup : booking.drop) || "Not available";

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [driverInputs, setDriverInputs] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/booking/all");
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/booking/${id}`, { status });
      fetchBookings();
    } catch (err) {
      console.log(err);
    }
  };

  const assignDriver = async (id) => {
    const driverId = driverInputs[id];
    if (!driverId) return;

    try {
      await axios.put(`/booking/assign/${id}`, { driverId });
      setDriverInputs((current) => ({ ...current, [id]: "" }));
      fetchBookings();
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    { key: "trackingId", header: "Tracking ID", accessor: (row) => row.trackingId || row._id?.slice(-8) || "-" },
    { key: "from", header: "Pickup", accessor: (row) => place(row, "from") },
    { key: "to", header: "Delivery", accessor: (row) => place(row, "to") },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "risk",
      header: "Weight Check",
      accessor: (row) => row.weightAnalysis?.mismatch ? "Mismatch" : "Verified",
      render: (row) => row.weightAnalysis?.mismatch
        ? <span className="inline-flex items-center gap-1 font-semibold text-amber-700"><FiAlertTriangle /> {row.weightAnalysis.discrepancyPercent}% mismatch</span>
        : <span className="font-semibold text-emerald-700">Verified</span>,
    },
    {
      key: "images",
      header: "Parcel Proof",
      sortable: false,
      render: (row) => row.parcelImages?.length
        ? <div className="flex gap-1">{row.parcelImages.slice(0, 3).map((image, index) => <a key={`${row._id}-${index}`} href={image} target="_blank" rel="noreferrer"><img src={image} alt={`Parcel ${index + 1}`} className="h-10 w-10 rounded-md border border-slate-200 object-cover transition hover:scale-110" /></a>)}</div>
        : <span className="inline-flex items-center gap-1 text-slate-400"><FiImage /> None</span>,
    },
    {
      key: "statusUpdate",
      header: "Update",
      sortable: false,
      render: (row) => (
        <select value={row.status || "Pending"} onChange={(e) => updateStatus(row._id, e.target.value)} className={`${inputClass} min-w-36 py-2`}>
          <option>Pending</option>
          <option>Assigned</option>
          <option>In Transit</option>
          <option>Delivered</option>
          <option>Failed</option>
          <option>Returned</option>
        </select>
      ),
    },
    {
      key: "driver",
      header: "Driver",
      accessor: (row) => row.driver || "Not assigned",
      render: (row) => <span className="text-slate-600">{row.driver || "Not assigned"}</span>,
    },
    {
      key: "assign",
      header: "Assign",
      sortable: false,
      render: (row) => (
        <div className="flex min-w-72 items-center gap-2">
          <input
            value={driverInputs[row._id] || ""}
            placeholder="Driver ID"
            className={`${inputClass} py-2`}
            onChange={(e) => setDriverInputs((current) => ({ ...current, [row._id]: e.target.value }))}
          />
          <Button className="px-3 py-2" onClick={() => assignDriver(row._id)} disabled={!driverInputs[row._id]}>
            <FiTruck /> Assign
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader
        title="Shipment Operations"
        subtitle="Review every order, update movement status, and assign drivers"
        action={
          <Button variant="secondary" onClick={fetchBookings}>
            <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
          </Button>
        }
      />
      <CardBody className="p-0">
        {loading ? (
          <div className="h-96 animate-pulse bg-white" />
        ) : (
          <DataTable
            columns={columns}
            data={bookings}
            emptyTitle="No shipments found"
            emptyMessage="Bookings will appear here after customers create shipments."
          />
        )}
      </CardBody>
    </Card>
  );
}
