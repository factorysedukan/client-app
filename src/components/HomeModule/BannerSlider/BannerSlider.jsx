import { useMediaQuery, useTheme } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import { Skeleton } from '@mui/material';

const BannerSlider = ({ dots, data, aspectRatio, styleObj, loading = false }) => {
  var settings = {
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
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  if (loading || !data || data.length === 0) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0.5em 0.5em',boxSizing: 'border-box' }}>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%"
          sx={{ 
            aspectRatio: aspectRatio || '16/8',
            borderRadius: 2,
            animation: 'pulse 1.5s infinite'
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0em 0em' }}>
      <Slider {...settings}>
        {data?.map((item, index) => (
          <div id={index + 1} key={index} >
            <img 
              style={{ aspectRatio: aspectRatio, width: '100%' }} 
              src={item?.image} 
              alt="" 
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default BannerSlider
