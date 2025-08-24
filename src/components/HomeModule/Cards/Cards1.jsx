import React from 'react';
import './cards1.css';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Cards1 = ({ loading = false, data = [] }) => {
  const { i18n } = useTranslation();
  const skeletonArray = Array.from({ length: 10 });

  // Use data from props if available, otherwise fallback to empty array
  const cards = Array.isArray(data) ? data : [];
  const navigate = useNavigate();

  const handleNavigate = (card) => {
    navigate(`${card.navigateParams}`,
      { state: { card } }
    );
  };

  // Helper to get localized value
  const getLocalized = (en, hi) => i18n.language === 'hi' && hi ? hi : en;

  return (
    <div className="card-listing2-bg" >
      <div className="card-listing2-scroll">
        <div className="card-listing2-flex">
          {loading
            ? skeletonArray.map((_, idx) => (
                <div key={idx} className="card-listing2-card wide-card">
                  <Skeleton
                    variant="rectangular"
                    width={64}
                    height={64}
                    className="card-listing2-img"
                    style={{ borderRadius: 12, marginTop: 8 }}
                  />
                  <div className="card-listing2-info">
                    <Skeleton
                      variant="text"
                      width={60}
                      height={18}
                      className="card-listing2-title"
                      style={{ margin: '8px auto 0 auto' }}
                    />
                    <Skeleton
                      variant="text"
                      width={40}
                      height={16}
                      className="card-listing2-price"
                      style={{ margin: '4px auto 0 auto' }}
                    />
                  </div>
                </div>
              ))
            : cards.map(card => (
                <div onClick={() => { handleNavigate(card) }} key={card._id || card.id} className="card-listing2-card wide-card" style={{background:'#ffefd0'}}>
                  <img
                    alt={getLocalized(card.name, card.nameHindi)}
                    className="card-listing2-img"
                    src={
                      card.image || 'assets/CardLogos/default.png'
                    }
                  />
                  <div className="card-listing2-info">
                    <h3 className="card-listing2-title one-line">{getLocalized(card.name, card.nameHindi)}</h3>
                  
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Cards1;
