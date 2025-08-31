import React from 'react'
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";

const BannerSlider = ({ dots, data,aspectRatio,styleObj}) => {
  var settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    cssEase: "ease-in-out",
    pauseOnHover: true,
  };
  console.log('data:', data,aspectRatio,styleObj);
  const navigate = useNavigate();

  return (
    // <div style={{ width: '100%', height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0em 0em' }}>
    <div style={{ width: '100%', height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0em 0em' }}>

      <Slider {...settings}>
        {data?.map((item,index) => (
          <div id={index+1} key={index} >
            <img 
            onClick={() => { navigate(`/CategoryPages?type=${item?.value}&&id=${import.meta.env.VITE_APP_JIO_CATEGORY_ID}`) } }
            style={{ aspectRatio: aspectRatio, width: '100%' }} src={item?.image} alt="" />
          </div>
        ))}
         {/* <img style={{ aspectRatio: '16/7', width: '100%' }} src={'https://res.cloudinary.com/dd57quwk7/image/upload/v1752317190/factorySeDukanSlider/ChatGPT_Image_Jul_12_2025_04_10_40_PM_bpttih.png'} alt="" /> */}
{/* 
        <div style={{ width: '100%', height: 'auto' }}>
          <img style={{ aspectRatio: '16/7', width: '100%' }} src={'https://res.cloudinary.com/dd57quwk7/image/upload/v1752318632/factorySeDukanSlider/ChatGPT_Image_Jul_12_2025_04_31_32_PM_bs1anm.png'} alt="" />
        </div> */}
      </Slider>
    </div>
  );
}

export default BannerSlider
