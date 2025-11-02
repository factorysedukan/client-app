import React from 'react';
import { Offers } from '../../services/constants';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // <-- Import tick icon



function getOfferCounts(totalPrice) {
  let offers = [];
  // Bag: One for each order above 2500
  if (totalPrice >= 5000) {
    offers.push({ ...Offers[0], qty: 1,});
  }
  // Speaker: One for order above 25000 up to 50000
  if (totalPrice >= 25000 && totalPrice < 50000) {
    offers.push({ ...Offers[1], qty: 1,});
  }
  // Watch: One for order above 50000
  if (totalPrice >= 50000) {
    offers.push({ ...Offers[2], qty: 1 });
  }
  return offers;
}

const OffersCoupon = ({ totalPrice, i18n }) => {
  const offers = getOfferCounts(totalPrice);

  if (offers.length === 0) return null;

  // Heading based on language
  const heading = i18n?.language === 'hi'
    ? 'इस ऑर्डर के साथ फ्री आइटम'
    : 'Free items with this order';

  return (
    <>
      <div
        style={{
          fontWeight: 700,
          fontSize: '1.2em',
          color: '#e4572e',
          textAlign: 'start',
          marginBottom: 8,
          marginTop: 8
        }}
      >
        {heading}
      </div>
      <div style={{
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        // margin: '16px 0',
        justifyContent: 'center',
        padding: '0em 1em'
      }}>
        {offers.map((offer, idx) => (
          <div
            key={idx}
            style={{
              background: 'linear-gradient(90deg, #fffbe6 60%, #ffe0b2 100%)',
              border: '2px dashed #e4572e',
              borderRadius: 18,
              boxShadow: '0 2px 8px rgba(228,87,46,0.07)',
              padding: '5px 24px',
              minWidth: 180,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              position: 'relative',
              width: '100%'
            }}
          >
            {/* Added tick icon above the coupon */}
            <CheckCircleIcon
              style={{
                color: '#22c55e',
                position: 'absolute',
                top: -18,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#fff',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                fontSize: 32,
                zIndex: 2
              }}
            />
            <img
              src={offer.image}
              alt={offer.name}
              style={{ width: 48, height: 48, objectFit: 'contain', marginRight: 8 }}
            />
            <div>
              <div style={{ fontWeight: 700, color: '#e4572e', fontSize: '0.8em' }}>
                {offer.name}
              </div>
              <div style={{ color: '#333', fontSize: '0.8em' }}>
                {offer.nameHindi}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OffersCoupon;