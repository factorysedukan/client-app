import React, { useRef, useState } from 'react';
import './factory.css';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LazyImage from '../../Common/LazyImage';

const optimizeCloudinary = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace(
    '/upload/',
    '/upload/w_150,c_limit,f_auto,q_auto:eco/'
  );
};

const FactoryListing = ({ loading = false, data = [] }) => {
  const skeletonArray = Array.from({ length: 6 });

  const factories = Array.isArray(data)
    ? [...data].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
    : [];

  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);

  const handleNavigate = (factory) => {
    navigate(`/CategoryPages?type=factory&&id=${factory._id}`);
  };

  const handleData = (data) => (
    <div className="card-listing2-flex-factory">
      {loading
        ? skeletonArray.map((_, idx) => (
            <div key={idx} className="card-listing2-card wide-card-2">
              <Skeleton
                variant="rectangular"
                width={70}
                height={70}
                className="card-listing2-img"
                style={{ borderRadius: 12, margin: '8px 0' }}
              />
            </div>
          ))
        : data.map(card => (
            <div
              key={card._id || card.id}
              onClick={() => handleNavigate(card)}
              className="card-listing2-card wide-card-2"
            >
              <LazyImage
                className="card-listing2-img-factoy"
                src={optimizeCloudinary(card.logo || 'assets/CardLogos/default.png')}
              />
            </div>
          ))}
    </div>
  );

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 200;
    scrollRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    setScrollPos(scrollRef.current.scrollLeft);
  };

  return (
    <div className="factory-collage-bg" style={{ position: 'relative' }}>
      <div className="card-listing2-scroll" ref={scrollRef} style={{ scrollBehavior: 'smooth' }}>
        {factories.length > 6 && (
          <>
            {scrollPos > 0 && (
              <button
                className="factory-scroll-btn left"
                onClick={() => handleScroll('left')}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  background: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  padding: 4,
                }}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </button>
            )}

            <button
              className="factory-scroll-btn right"
              onClick={() => handleScroll('right')}
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                background: '#fff',
                border: 'none',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                padding: 4,
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </button>
          </>
        )}

        {handleData(factories.slice(0, factories.length / 2))}
        {handleData(factories.slice(factories.length / 2))}
      </div>
    </div>
  );
};

export default FactoryListing;
