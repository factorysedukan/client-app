import { Card, CardActionArea, CardContent, Skeleton, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import BannerSlider from './BannerSlider/BannerSlider';
import ProductListing1 from './ProductListing/ProductListing1';
import ProductListing2 from './ProductListing/ProductListing2';
import { useGetHomePageTemplateApiQuery } from '../../redux/Apis/HomePageTemplateApi';
import Cards1 from './Cards/Cards1';
import { NavigationLinksCards1 } from '../utility/config/HomepageConstants';
import { useListProductsApiPaginatedMutation } from '../../redux/Apis/ProductApi';
import SearchBar from './SearchBar/SearchBar';
import ProductListing3 from './ProductListing/ProductListing3';
import { useMediaQuery, useTheme } from '@mui/material';
import { useGetAllFactoriesQuery } from '../../redux/Apis/FactoryApi';
import FactoryListing from './FactoryListing/FactoryListing';


const Home = () => {
    const navigate = useNavigate();
    const { data, error, isLoading } = useGetHomePageTemplateApiQuery();
const [getProducts, { data:productData, isLoading : productDataLoading}] = useListProductsApiPaginatedMutation();
    // Get cart products and calculate total price
    const cartProducts = useSelector(state => state.cart.cartState.products);
    const formatPrice = (price) => price.toLocaleString('en-IN');
    const totalPrice = cartProducts.reduce((sum, product) => (
        sum +
        (product.articles || []).reduce(
            (aSum, article) => aSum + (article.sellingPrice || 0) * (article.qty || 0),
            0
        )
    ), 0);
  const theme = useTheme();
const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));



    console.log('HomePageTemplateData', data?.data?.sliders);

      const ref = useRef(null)
const skeletonArray = Array.from({ length: 2 });
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

    const images=[
        'https://res.cloudinary.com/dd57quwk7/image/upload/v1752317190/factorySeDukanSlider/ChatGPT_Image_Jul_12_2025_04_10_40_PM_bpttih.png',
        'https://res.cloudinary.com/dd57quwk7/image/upload/v1752318632/factorySeDukanSlider/ChatGPT_Image_Jul_12_2025_04_31_32_PM_bs1anm.png'
    ]

const { data: factoriesData, isLoading: factoriesLoading, error: factoriesError } = useGetAllFactoriesQuery();

     useEffect(() => {
 
        getProducts({page, limit: 10 })
          .unwrap()
          .then(res => {
            if (page === 1) {
              setProducts(res.data || []);
            } else {
              setProducts(prev => [...prev, ...(res.data || [])]);
            }
            setHasMore((res.data?.length || 0) === 10);
          });
        // eslint-disable-next-line
      }, [page]);

useEffect(() => {
  if (factoriesData) {
    console.log('All Factories:', factoriesData);
    // You can set state or use factoriesData as needed
  }
}, [factoriesData]);

      const handleScroll = () => {
        
          if (!hasMore || productDataLoading) return;
          console.log('running')
          console.log('Scroll event triggered', ref.current.clientHeight, ref.current.scrollTop, ref.current.scrollHeight);
          if (
      
            ref.current.clientHeight + ref.current.scrollTop >= ref.current.scrollHeight - 200
          ) {
      
            setPage(prev => prev + 1);
          }
        };
      
      
      
        useEffect(() => {
        
          if (ref.current) {
            ref.current.addEventListener('scroll', handleScroll);
          }
      
          return () => {
            if (ref.current) {
              ref.current.removeEventListener('scroll', handleScroll);
            }
          }
        }, [handleScroll, ref]);
    return (
        <div ref={ref} style={{height:'100%',display:'flex',width:'100%',flexDirection:'column',justifyContent:'flex-start',overflowX:'hidden',overflowY:'scroll'}}>
            {/* Total Price Row */}
            {/* <div
                style={{
                    position: 'sticky',
                    top: '95%',
                    right: 16,
                    background: 'rgba(228,87,46,0.08)',
                    color: '#e4572e',
                    borderRadius: 14,
                    padding: '8px 20px',
                    fontWeight: 700,
                    fontSize: '1.1em',
                    boxShadow: '0 2px 8px rgba(228,87,46,0.07)',
                    zIndex: 10,
                    backdropFilter: 'blur(2px)'
                }}
            >
                Total: <span style={{ color: '#22c55e', marginLeft: 4 }}>₹{formatPrice(totalPrice)}</span>
            </div> */}
           
            <BannerSlider data={data?.data?.sliders} aspectRatio={isSmallScreen ? '16/7':'4/1'}/>
            <Cards1 data={NavigationLinksCards1}/>
            <FactoryListing loading={factoriesLoading} data={factoriesData?.data}/>
             {/* <ProductListing3 loading={productDataLoading && page==1} data={data?.data?.SixCrossSix}/> */}
            <ProductListing1 loading={isLoading} data={data?.data?.PrimaryData}/>
           

            {/* <ProductListing2 loading={isLoading} data={data?.data?.SmallSlider}/> */}

            <ProductListing1 loading={productDataLoading && page==1} data={products}/>

             {productDataLoading && page > 1 && (
                    <div className="product-listing-grid" >
                     {skeletonArray.map((_, idx) => (
                    <div key={idx}  className="product-card">
                      <Skeleton variant="rectangular" width="100%" height={120} className="product-image" style={{ borderRadius: 12 }} />
                      <div className="product-details">
                        <Skeleton variant="text" width="70%" height={24} className="product-title" style={{ margin: '8px 0 0 0' }} />
                        <Skeleton variant="text" width="90%" height={18} className="product-desc-home" style={{ margin: '6px 0 0 0' }} />
                        <Skeleton variant="text" width="40%" height={16} className="product-size" style={{ margin: '8px 0 0 0' }} />
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 8, justifyContent: 'space-between', width: '100%' }}>
                          <Skeleton variant="text" width={60} height={20} />
                          <Skeleton variant="rectangular" width={60} height={28} style={{ borderRadius: 6 }} />
                        </div>
                      </div>
                    </div>))}
                    </div>
                  )}

        </div>
    )
}

export default Home
