import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import { FiMapPin, FiSearch } from "react-icons/fi";
import io from "socket.io-client";
import axios from "../utils/axiosConfig";
import Button from "../components/ui/Button";
import Card, { CardBody, CardHeader } from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import { inputClass } from "../components/ui/FormField";
import StatusBadge from "../components/ui/StatusBadge";

const socket = io("http://localhost:5000");
const steps = ["Pending", "Assigned", "In Transit", "Delivered"];

export default function Tracking() {
  const [trackingId, setTrackingId] = useState("");
  const [data, setData] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      setError("Enter a tracking ID to continue.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`/booking/track/${trackingId}`);
      setData(res.data);

      if (res.data.currentLocation) {
        setLiveLocation([res.data.currentLocation.lat, res.data.currentLocation.lng]);
      }

      socket.emit("join-booking", trackingId);
    } catch {
      setData(null);
      setError("Tracking ID not found. Check the ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.on("receive-location", (loc) => {
      setLiveLocation([loc.lat, loc.lng]);
    });

    return () => socket.off("receive-location");
  }, []);

  const currentIndex = data ? steps.indexOf(data.status) : -1;

  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <label>
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Tracking ID</span>
              <input
                value={trackingId}
                placeholder="Example: TRK123456"
                className={inputClass}
                onChange={(e) => {
                  setTrackingId(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTrack();
                }}
              />
              {error && <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span>}
            </label>
            <Button onClick={handleTrack} disabled={loading} className="h-11">
              <FiSearch /> {loading ? "Tracking..." : "Track Shipment"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {!data ? (
        <EmptyState
          title="Ready to track"
          message="Enter a tracking ID to view status, shipment path, and live driver movement."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <Card>
            <CardHeader title="Shipment Progress" subtitle={data.trackingId || trackingId} />
            <CardBody>
              <div className="mb-5 rounded-lg bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Current status</span>
                  <StatusBadge status={data.status} />
                </div>
                <p className="text-sm text-slate-600">From: {data.from || data.pickupAddress || data.pickup || "Not available"}</p>
                <p className="mt-1 text-sm text-slate-600">To: {data.to || data.dropAddress || data.drop || "Not available"}</p>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => {
                  const active = currentIndex >= index;
                  return (
                    <div key={step} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className={`h-4 w-4 rounded-full ring-4 ${active ? "bg-emerald-500 ring-emerald-100" : "bg-slate-300 ring-slate-100"}`} />
                        {index < steps.length - 1 && <span className={`mt-1 h-9 w-px ${active ? "bg-emerald-200" : "bg-slate-200"}`} />}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${active ? "text-slate-950" : "text-slate-400"}`}>{step}</p>
                        <p className="text-xs text-slate-500">{active ? "Updated" : "Awaiting update"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Live Route" subtitle="Map updates when driver location is shared" />
            <CardBody>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <MapContainer
                  center={liveLocation || [data.origin?.lat || 28.6, data.origin?.lng || 77.2]}
                  zoom={5}
                  className="h-[420px] w-full"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {data.origin && (
                    <Marker position={[data.origin.lat, data.origin.lng]}>
                      <Popup>Pickup</Popup>
                    </Marker>
                  )}
                  {data.destination && (
                    <Marker position={[data.destination.lat, data.destination.lng]}>
                      <Popup>Drop</Popup>
                    </Marker>
                  )}
                  {liveLocation && (
                    <Marker position={liveLocation}>
                      <Popup>Driver live location</Popup>
                    </Marker>
                  )}
                  {data.origin && data.destination && (
                    <Polyline positions={[[data.origin.lat, data.origin.lng], [data.destination.lat, data.destination.lng]]} />
                  )}
                </MapContainer>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <FiMapPin className="h-4 w-4 text-blue-600" />
                Live map depends on driver location sharing.
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
