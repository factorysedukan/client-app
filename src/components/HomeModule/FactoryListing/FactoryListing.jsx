import React, { useRef, useState } from 'react';
import './factory.css';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const FactoryListing = ({ loading = false, data = [] }) => {
  const skeletonArray = Array.from({ length: 6 });
  const factories = Array.isArray(data) ? data : [];
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const handleNavigate = (factory) => {
    navigate(`/CategoryPages?type=factory&&id=${factory._id}`);
  };

  console.log('Factories in FactoryListing:', factories);
  const handleData = (data) => {
    return (
      <div className="card-listing2-flex-factory">
        {loading
          ? skeletonArray.map((_, idx) => (
            <div key={idx} className="card-listing2-card wide-card">
              <Skeleton
                variant="rectangular"
                width={100}
                height={100}
                className="card-listing2-img"
                style={{ borderRadius: 12, marginTop: 8, marginBottom: 8 }}
              />

            </div>
          ))
          : data.map(card => (
            <>
              <div onClick={() => { handleNavigate(card) }} key={card._id || card.id} className="card-listing2-card wide-card" >
                <img
                  // alt={getLocalized(card.name, card.nameHindi)}
                  className="card-listing2-img-factoy"
                  src={
                    card.logo || 'assets/CardLogos/default.png'
                  }
                />

              </div>

            </>
          ))}
      </div>
    )
  }

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 200;
    if (direction === 'left') {
      scrollRef.current.scrollLeft -= scrollAmount;
      setScrollPos(scrollRef.current.scrollLeft - scrollAmount);
    } else {
      scrollRef.current.scrollLeft += scrollAmount;
      setScrollPos(scrollRef.current.scrollLeft + scrollAmount);
    }
  };
  return (
    <div className="factory-collage-bg" style={{ position: 'relative' }}>
      <div className="card-listing2-scroll" ref={scrollRef} style={{ scrollBehavior: 'smooth' }} >
        {factories.length > 6 && (<>
            {scrollPos>0 &&(  <button
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
              cursor: 'pointer',
              padding: 4,
              display: scrollRef.current && scrollRef.current.scrollLeft > 0 ? 'block' : 'none'
            }}
            aria-label="Scroll Left"
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
              cursor: 'pointer',
              padding: 4
            }}
            aria-label="Scroll Right"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </button>
        </>)}

        {handleData(factories.slice(0, factories.length / 2))}
        {handleData(factories.slice(factories.length / 2, factories.length))}

      </div>
    </div>
  );
};

export default FactoryListing;