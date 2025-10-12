import React, { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import { useSelector } from "react-redux";
import { Offers } from "../constants";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const getEligibleOffer = (totalCartValue) => {
  if (totalCartValue >= 50000) return Offers[2];
  if (totalCartValue >= 25000) return Offers[1];
  if (totalCartValue >= 2000) return Offers[0];
  return null;
};

export const useOfferConfettiNotification = () => {
  const totalCartValue = useSelector(state => state.cart.cartState.totalCartValue);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  const prevOfferRef = useRef(null);
  const prevValue = useRef(0);

  useEffect(() => {
    const offer = getEligibleOffer(totalCartValue);
    // Only show confetti if user crosses into a new offer and value is increasing
    if (offer && prevOfferRef.current !== offer.name && totalCartValue > prevValue.current) {
      setCurrentOffer(offer);
      setShowConfetti(true);
      setShowCoupon(true);
      prevOfferRef.current = offer.name;
      // Hide confetti after 3 seconds, coupon after 6 seconds
      setTimeout(() => setShowConfetti(false), 3000);
      setTimeout(() => setShowCoupon(false), 6000);
    }
    // If cart value drops below all offers, reset
    if (!offer) {
      prevOfferRef.current = null;
      setShowCoupon(false);
    }
    prevValue.current = totalCartValue;
  }, [totalCartValue]);

  // Coupon UI with golden flashing background and animated tick
  const CouponJSX = showCoupon && currentOffer ? (
    <div
      style={{
        position: "fixed",
        top: "45dvh",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 99999,
        minWidth: 260,
        maxWidth: 340,
        background: 'linear-gradient(90deg, #fffbe6 60%, #ffe0b2 100%)',
        border: '2px dashed #e4572e',
        borderRadius: 18,
        boxShadow: "0 4px 24px rgba(228,87,46,0.18)",
        padding: "20px 24px 16px 24px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        animation: "goldFlash 1s infinite alternate"
      }}
    >
      <style>
        {`
        @keyframes goldFlash {
          0% { box-shadow: 0 0 24px 8px #ffd70055; }
          100% { box-shadow: 0 0 32px 12px #ffd700cc; }
        }
        @keyframes tickPop {
          0% { transform: scale(0.2) rotate(-30deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(10deg); opacity: 1; }
          80% { transform: scale(0.95) rotate(-5deg);}
          100% { transform: scale(1) rotate(0deg);}
        }
        `}
      </style>
      <CheckCircleIcon
        style={{
          color: "#22c55e",
          fontSize: 38,
          animation: "tickPop 0.7s cubic-bezier(.68,-0.55,.27,1.55)"
        }}
      />
      <img
        src={currentOffer.image}
        alt={currentOffer.name}
        style={{ width: 54, height: 54, objectFit: "contain", marginRight: 8 }}
      />
      <div>
        <div style={{ fontWeight: 700, color: "#b8860b", fontSize: "1.1em" }}>
          {currentOffer.name}
        </div>
        <div style={{ color: "#333", fontSize: "0.95em" }}>
          {currentOffer.nameHindi}
        </div>
      </div>
    </div>
  ) : null;

  // Confetti UI
  const ConfettiJSX = showConfetti ? (
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      numberOfPieces={250}
      recycle={false}
      gravity={0.25}
      style={{ zIndex: 99998, pointerEvents: "none" }}
    />
  ) : null;

  // Return both
  return { ConfettiJSX, CouponJSX };
};