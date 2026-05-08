import { useEffect } from "react";
import { FiCreditCard } from "react-icons/fi";
import Button from "../components/ui/Button";
import Card, { CardBody } from "../components/ui/Card";

export default function Payment() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: 50000,
      currency: "INR",
      name: "SwiftLogix",
      description: "Booking Payment",
      handler: function (response) {
        alert("Payment Successful: " + response.razorpay_payment_id);
      },
      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <Card className="max-w-lg">
      <CardBody>
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-700">
            <FiCreditCard className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Complete Payment</h2>
            <p className="text-sm text-slate-500">Secure checkout powered by Razorpay.</p>
          </div>
        </div>

        <div className="mb-5 rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Amount payable</span>
            <span className="text-2xl font-bold text-slate-950">Rs. 500</span>
          </div>
        </div>

        <Button onClick={handlePayment} className="w-full">
          Pay with Razorpay
        </Button>
      </CardBody>
    </Card>
  );
}
