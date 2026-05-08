import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import Button from "../components/ui/Button";
import Card, { CardBody } from "../components/ui/Card";
import { inputClass } from "../components/ui/FormField";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError("Enter the OTP sent to your email.");
      return;
    }

    try {
      await axios.post("/auth/verify-otp", { otp });
      navigate("/login");
    } catch {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-16">
      <Card className="w-full max-w-md">
        <CardBody>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-950">Verify OTP</h1>
            <p className="mt-2 text-sm text-slate-500">Enter the verification code to activate your account.</p>
          </div>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            className={inputClass}
            onChange={(e) => {
              setOtp(e.target.value);
              setError("");
            }}
          />

          {error && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-600">{error}</p>}

          <Button onClick={handleVerify} className="mt-5 w-full">
            Verify
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
