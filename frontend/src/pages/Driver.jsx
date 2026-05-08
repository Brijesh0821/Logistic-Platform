import { useEffect, useState } from "react";
import { FiNavigation, FiStopCircle } from "react-icons/fi";
import io from "socket.io-client";
import axios from "../utils/axiosConfig";
import Button from "../components/ui/Button";
import Card, { CardBody, CardHeader } from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import StatusBadge from "../components/ui/StatusBadge";

const socket = io("http://localhost:5000");

const place = (booking, type) =>
  booking[type] || booking[`${type}Address`] || (type === "from" ? booking.pickup : booking.drop) || "Not available";

export default function Driver() {
  const [bookings, setBookings] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/booking/driver");
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchBookings, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!activeBooking) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        socket.emit("send-location", {
          bookingId: activeBooking.trackingId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        alert("Location permission denied");
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [activeBooking]);

  return (
    <div className="space-y-6">
      {activeBooking && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardBody>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Live tracking active</p>
                <h2 className="mt-1 text-xl font-semibold text-emerald-950">{activeBooking.trackingId}</h2>
              </div>
              <Button variant="danger" onClick={() => setActiveBooking(null)}>
                <FiStopCircle /> Stop Tracking
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader title="Assigned Shipments" subtitle="Start GPS tracking when you begin a delivery trip" />
        <CardBody>
          {bookings.length === 0 ? (
            <EmptyState title="No assigned shipments" message="Assigned orders will appear here when dispatch allocates them to you." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {bookings.map((booking) => (
                <div key={booking._id} className="rounded-xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tracking ID</p>
                      <p className="mt-1 font-semibold text-slate-950">{booking.trackingId || booking._id?.slice(-8)}</p>
                    </div>
                    <StatusBadge status={booking.status || "Pending"} />
                  </div>
                  <p className="text-sm text-slate-600">From: {place(booking, "from")}</p>
                  <p className="mt-1 text-sm text-slate-600">To: {place(booking, "to")}</p>
                  <Button
                    className="mt-4 w-full"
                    variant={activeBooking?._id === booking._id ? "success" : "primary"}
                    onClick={() => setActiveBooking(booking)}
                  >
                    <FiNavigation /> {activeBooking?._id === booking._id ? "Tracking Active" : "Start Tracking"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
