import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import Button from "./ui/Button";
import { inputClass } from "./ui/FormField";

export default function Footer() {
  return (
    <footer className="border-t border-white/80 bg-[linear-gradient(135deg,#f8fbff,#f1f7ff_55%,#fff5fb)] pt-14 pb-6 text-slate-600">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <h2 className="mb-4 text-2xl font-bold text-slate-950">
            Swift<span className="text-blue-600">Logix</span>
          </h2>
          <p className="text-sm leading-6">
            Smart logistics platform for booking, tracking, driver assignment, and shipment operations across India.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-slate-950">Services</h3>
          <ul className="space-y-2 text-sm">
            {["Truck Booking", "Live Tracking", "Route Optimization", "Fleet Management", "Warehouse Support"].map((item) => (
              <li key={item} className="cursor-pointer hover:text-blue-700">{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-slate-950">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {["Home", "Book", "Track", "Dashboard", "Contact"].map((item) => (
              <li key={item} className="cursor-pointer hover:text-blue-700">{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-slate-950">Contact</h3>
          <p className="text-sm">Delhi, India</p>
          <p className="text-sm">+91 9876543210</p>
          <p className="mb-4 text-sm">support@swiftlogix.com</p>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-xs font-medium text-slate-500">Subscribe for updates</p>
            <input type="email" placeholder="Enter email" className={`${inputClass} mb-2 bg-white`} />
            <Button className="w-full py-2">Subscribe</Button>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-6 text-xl text-slate-500">
        {[FaFacebook, FaInstagram, FaTwitter, FaLinkedin].map((Icon, index) => (
          <Icon key={index} className="cursor-pointer transition hover:text-blue-700" />
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-slate-400">© 2026 SwiftLogix. All rights reserved.</div>
    </footer>
  );
}
