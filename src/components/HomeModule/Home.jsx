import { Card, CardActionArea, CardContent, Skeleton, Typography } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import BannerSlider from './BannerSlider/BannerSlider';
import ProductListing1 from './ProductListing/ProductListing1';
import ProductListing2 from './ProductListing/ProductListing2';
import { useGetHomePageTemplateApiQuery } from '../../redux/Apis/HomePageTemplateApi';
import Cards1 from './Cards/Cards1';
import { NavigationLinksCards1 } from '../utility/config/HomepageConstants';
import { useListProductsApiPaginatedMutation, useListProductsApiPaginatedQQuery } from '../../redux/Apis/ProductApi';
import SearchBar from './SearchBar/SearchBar';
import ProductListing3 from './ProductListing/ProductListing3';
import { useMediaQuery, useTheme } from '@mui/material';
import { useGetAllFactoriesQuery } from '../../redux/Apis/FactoryApi';
import FactoryListing from './FactoryListing/FactoryListing';
import { useTranslation } from 'react-i18next';
// import ProductListingLandscape from './ProductListing/ProductListingLandscape';
import './index.css';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetHomePageTemplateApiQuery();
  
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

  const { data: productData, isLoading: productDataLoading,isFetching } = useListProductsApiPaginatedQQuery({ page, limit: 10 });

  const { data: factoriesData, isLoading: factoriesLoading, error: factoriesError } = useGetAllFactoriesQuery();

  // useEffect(() => {

  //   getProducts({ page, limit: 10 })
  //     .unwrap()
  //     .then(res => {
  //       if (page === 1) {
  //         setProducts(res.data || []);
  //       } else {
  //         setProducts(prev => [...prev, ...(res.data || [])]);
  //       }
  //       setHasMore((res.data?.length || 0) === 10);
  //     });
  //   // eslint-disable-next-line
  // }, [page]);

  useEffect(() => {
    if (factoriesData) {
      console.log('All Factories:', factoriesData);
      // You can set state or use factoriesData as needed
    }
  }, [factoriesData]);

  // const handleScroll = () => {

  //   if (!hasMore || productDataLoading) return;
  //   console.log('running')
  //   console.log('Scroll event triggered', ref.current.clientHeight, ref.current.scrollTop, ref.current.scrollHeight);
  //   if (

  //     ref.current.clientHeight + ref.current.scrollTop >= ref.current.scrollHeight - 200
  //   ) {

  //     setPage(prev => prev + 1);
  //   }
  // };



  // useEffect(() => {

  //   if (ref.current) {
  //     ref.current.addEventListener('scroll', handleScroll);
  //   }

  //   return () => {
  //     if (ref.current) {
  //       ref.current.removeEventListener('scroll', handleScroll);
  //     }
  //   }
  // }, [handleScroll, ref]);







  // const { data, isFetching } =
  //   useListProductsApiPaginatedQQuery();

  const observerRef = useRef(null);
  const lastItemRef = useRef(null);

  useEffect(() => {
    if (!productData?.data) return;
    if(productData?.pagination?.page<page){
      return
    }
    setProducts(prev =>
      page === 1 ? productData.data : [...prev, ...productData.data]
    );

    setHasMore(productData.data.length === 10);
  }, [productData, page]);

  const observeLastItem = useCallback(
    node => {
      console.log('hasMore',hasMore,page)
      if (isFetching || !hasMore) {
        observerRef.current.disconnect();
        return
      };

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            observerRef.current.disconnect(); 
            setPage(prev => prev + 1);
          }
        },
        {
          root: null,
          rootMargin: isSmallScreen ? '300px' : '700px', // desktop/tablet safe
          threshold: 0.01,
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [isFetching, hasMore, isSmallScreen]
  );

  useEffect(() => {
    if (lastItemRef.current && hasMore) {
      observeLastItem(lastItemRef.current);
    }
  }, [products, observeLastItem,hasMore]);
  return (
    <div ref={ref} style={{ height: '100%', display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'flex-start', overflowX: 'hidden', overflowY: 'scroll' }}>
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

      <BannerSlider
        data={data?.data?.sliders}
        aspectRatio={isSmallScreen ? '16/8' : '4/1'}
        loading={isLoading}
      />

      <h2 className='heading'>{t('Top Factories')}</h2>
      <FactoryListing loading={factoriesLoading} data={factoriesData?.data} />

      <h2 className='heading'>{t('Top Products')}</h2>

      <ProductListing1 loading={isLoading} data={data?.data?.PrimaryData} />
      <Cards1 data={NavigationLinksCards1} />

      {/* <ProductListing2 loading={isLoading} data={data?.data?.SmallSlider}/> */}
      <h2 className='heading'>{t('All Products')}</h2>

      {/* <ProductListing1 loading={productDataLoading && page == 1} data={products} /> */}
      <ProductListing1
        data={products}
        loading={page === 1 && isFetching}
        paginationLoading={page > 1 && isFetching}
        lastItemRef={lastItemRef} // 👈 PASS REF
      />
      {productDataLoading && page > 1 && (
        <div className="product-listing-grid" >
          {skeletonArray.map((_, idx) => (
            <div key={idx} className="product-card">
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