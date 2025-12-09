import React, { useState, useEffect, useRef } from 'react';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useSwipeable } from 'react-swipeable';
import './BannerSlider2Styles.css';

const BannerSlider2 = ({
  images = [],
  aspectRatio = '1/1',
  styleObj,
  autoplaySpeed = 3000,
  autoplay = false,
  current,
  onSlideChange
}) => {
  const [internalCurrent, setInternalCurrent] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [modalImg, setModalImg] = useState(null);
  const [slideDirection, setSlideDirection] = useState(''); // for animation
  const timerRef = useRef();

  // Use controlled or uncontrolled current index
  const activeIndex = typeof current === 'number' ? current : internalCurrent;

  useEffect(() => {
    if (autoplay) {
      timerRef.current = setInterval(() => {
        handleSlideChange((activeIndex + 1) % images.length, 'right');
      }, autoplaySpeed);
      return () => clearInterval(timerRef.current);
    }
    return () => {};
    // eslint-disable-next-line
  }, [images.length, autoplaySpeed, autoplay, activeIndex, onSlideChange]);

  const handleSlideChange = (idx, direction = 'right') => {
    setSlideDirection(direction);
    setTimeout(() => setSlideDirection(''), 400); // match CSS duration
    if (onSlideChange) {
      onSlideChange(idx);
    } else {
      setInternalCurrent(idx);
    }
  };

  const goToSlide = idx => {
    const direction = idx > activeIndex ? 'right' : 'left';
    handleSlideChange(idx, direction);
  };

  const goToPrev = () => {
    const prev = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    handleSlideChange(prev, 'left');
  };

  const goToNext = () => {
    
    const next = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    handleSlideChange(next, 'right');
  };

  const handleOpenModal = (img) => {
    setModalImg(img);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalImg(null);
  };

  // Add swipe handlers (disable swipe if at start/end)
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeIndex < images.length - 1) handleSlideChange(activeIndex + 1, 'right');
    },
    onSwipedRight: () => {
      if (activeIndex > 0) handleSlideChange(activeIndex - 1, 'left');
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  return (
    <div
      className="banner-slider2-root"
      style={styleObj}
    >
      <div
        className="banner-slider2-image-container"
        style={{ aspectRatio }}
        {...swipeHandlers}
      >
        {/* Left Arrow */}
        <div
          className={`banner-slider2-arrow banner-slider2-arrow-left${activeIndex === 0 ? ' disabled' : ''}`}
          onClick={activeIndex === 0 ? undefined : goToPrev}
          tabIndex={0}
          role="button"
          aria-label="Previous"
          aria-disabled={activeIndex === 0}
          style={activeIndex === 0 ? { pointerEvents: 'none', opacity: 0.4 } : {}}
        >
          <ArrowBackIosNewIcon fontSize="medium" />
        </div>
        {/* Image with animation */}
        <img
          src={images[activeIndex]}
          alt={`product-image-${activeIndex}`}
          className={`banner-slider2-img${slideDirection ? ` slide-${slideDirection}` : ''}`}
          style={{ aspectRatio }}
          onClick={() => handleOpenModal(images[activeIndex])}
        />
        <IconButton
          onClick={() => handleOpenModal(images[activeIndex])}
          className="banner-slider2-eye-btn"
        >
          <VisibilityIcon />
        </IconButton>
        {/* Right Arrow */}
        <div
          className={`banner-slider2-arrow banner-slider2-arrow-right${activeIndex === images.length - 1 ? ' disabled' : ''}`}
          onClick={activeIndex === images.length - 1 ? undefined : goToNext}
          tabIndex={0}
          role="button"
          aria-label="Next"
          aria-disabled={activeIndex === images.length - 1}
          style={activeIndex === images.length - 1 ? { pointerEvents: 'none', opacity: 0.4 } : {}}
        >
          <ArrowForwardIosIcon fontSize="medium" />
        </div>
      </div>
      <div className="banner-slider2-dots">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`banner-slider2-dot${idx === activeIndex ? ' active' : ''}`}
            onClick={() => goToSlide(idx)}
          />
        ))}
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div className="banner-slider2-modal">
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(255,255,255,0.8)',
              zIndex: 2
            }}
          >
            <CloseIcon />
          </IconButton>
          {modalImg && (
            <img
              src={modalImg}
              alt="zoomed-product"
              className="banner-slider2-modal-img"
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BannerSlider2;
