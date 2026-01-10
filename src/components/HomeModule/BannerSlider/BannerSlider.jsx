import { useMediaQuery, useTheme, Skeleton } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";

const optimizeCloudinary = (url, width) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace(
    '/upload/',
    `/upload/w_${width},c_limit,f_auto,q_auto:good/`
  );
};

const BannerSlider = ({ dots, data, aspectRatio, styleObj, loading = false }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "ease-in-out",
    pauseOnHover: true,
  };

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const bannerWidth = isMobile ? 480 : isTablet ? 900 : 1400;

  if (loading || !data || data.length === 0) {
    return (
      <div style={{ width: '100%', padding: '0.5em', boxSizing: 'border-box' }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{ aspectRatio: aspectRatio || '16/8', borderRadius: 2 }}
        />
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <Slider {...settings}>
        {data.map((item, index) => (
          <div key={index}>
            <img
              loading="lazy"
              style={{ aspectRatio, width: '100%' }}
              src={optimizeCloudinary(item?.image, bannerWidth)}
              alt=""
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;
