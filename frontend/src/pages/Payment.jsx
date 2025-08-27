import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { paymentAPI } from "../lib/api";
import { toast } from "react-hot-toast";
import { Wallet, CreditCard, Banknote, Coins, ArrowLeft } from "lucide-react";
import { dateFormat } from "../lib/dateFormat";

const paymentMethods = [
  { value: "CASH", label: "Cash at counter", icon: <Coins size={22} /> },
  {
    value: "CREDIT_CARD",
    label: "Credit/Debit Card",
    icon: <CreditCard size={22} />,
  },
  {
    value: "BANK_TRANSFER",
    label: "Bank Transfer",
    icon: <Banknote size={22} />,
  },
  { value: "E_WALLET", label: "E-Wallet", icon: <Wallet size={22} /> },
];

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    scheduleId,
    seatCodes,
    totalPrice,
    ticketIds,
    movie,
    room,
    showTime,
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].value);
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
    if (!paymentMethod || !ticketIds?.length) {
      toast.error("No tickets found to proceed payment!");
      return;
    }
    setIsLoading(true);
    try {
      await paymentAPI.create({
        ticketIds,
        method: paymentMethod,
      });
      toast.success("Payment successful!");
      navigate("/my-bookings");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Payment failed!");
    }
    setIsLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center py-12 mt-20 background-color">
      <button
        onClick={() => navigate(-1)}
        className="absolute flex top-20 left-20 ml-4 mt-4 items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>
      <div className="w-full max-w-md bg-primary/8 border border-primary/20 rounded-3xl shadow-2xl p-8 mr-12 flex flex-col gap-4 backdrop-blur-lg">
        <h2 className="text-2xl font-extrabold mb-2 text-white drop-shadow tracking-wide">
          🎫 Booking Details
        </h2>
        <div className="flex items-center gap-5 mb-4">
          <img
            src={movie?.posterUrl}
            alt={movie?.title}
            className="w-28 h-40 object-cover rounded-2xl shadow-lg border-2 border-primary/40"
          />
          <div>
            <div className="font-bold text-xl mb-1">
              {movie?.title || "Movie Title"}
            </div>
            <div className="text-base text-[#bbb9e6]">{room?.name}</div>
            <div className="text-sm text-gray-300 mt-2">
              <span className="text-gray-400">Showtime:</span>{" "}
              <b>{dateFormat(showTime)}</b>
            </div>
            <div className="text-sm text-gray-300 mt-1">
              <span className="text-gray-400">Seats:</span>{" "}
              <b>{seatCodes?.join(", ")}</b>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-sm text-[#e2deff]">
          <span>
            <span className="text-gray-400">Cinema:</span>{" "}
            <span className="font-semibold">{room?.cinema?.name}</span>
          </span>
          <span>
            <span className="text-gray-400">Address:</span>{" "}
            <span className="font-semibold text-white">
              {room?.cinema?.location}
            </span>
          </span>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xl text-white font-bold">Total Amount</span>
          <span className="text-3xl font-extrabold drop-shadow-glow">
            {totalPrice?.toLocaleString()}₫
          </span>
        </div>
      </div>

      <div className="w-full max-w-md bg-primary/8 border border-primary/20 rounded-3xl shadow-2xl p-8 flex flex-col gap-5 backdrop-blur-lg">
        <h2 className="text-2xl font-extrabold mb-2 text-white tracking-wide drop-shadow">
          💳 Payment
        </h2>
        <label className="block text-base font-semibold mb-3 text-white">
          Select your payment method:
        </label>
        <div className="flex flex-col gap-4 mb-4">
          {paymentMethods.map((pm) => (
            <label
              key={pm.value}
              className={`
                flex items-center gap-3 px-5 py-3 rounded-xl font-semibold cursor-pointer border-2 transition
                shadow-lg backdrop-blur
                ${
                  paymentMethod === pm.value
                    ? "bg-gradient-to-r from-[#f84565] to-[#d63854] text-white border-primary/20 scale-105"
                    : "bg-primary/8 border-primary/20 text-white hover:bg-primary/50"
                }
              `}
            >
              <input
                type="radio"
                className="accent-primary scale-125 mr-2"
                name="paymentMethod"
                value={pm.value}
                checked={paymentMethod === pm.value}
                onChange={() => setPaymentMethod(pm.value)}
              />
              <span className="flex items-center gap-2">
                {pm.icon}
                {pm.label}
              </span>
            </label>
          ))}
        </div>
        <button
          onClick={handlePay}
          disabled={isLoading || !ticketIds?.length}
          className={`
            w-full py-4 mt-3 rounded-xl font-extrabold text-xl shadow-xl
            bg-gradient-to-r from-[#f84565] via-[#ff5e62] to-[#d63854]
            text-white hover:brightness-110 active:scale-95 transition
            border-2 border-[#f84565]/50
            ${isLoading ? "opacity-60 pointer-events-none" : ""}
          `}
        >
          {isLoading ? "Processing payment..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
