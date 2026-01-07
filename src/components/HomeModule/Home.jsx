import {
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import BannerSlider from './BannerSlider/BannerSlider';
import ProductListing1 from './ProductListing/ProductListing1';
import Cards1 from './Cards/Cards1';
import { NavigationLinksCards1 } from '../utility/config/HomepageConstants';
import { useGetHomePageTemplateApiQuery } from '../../redux/Apis/HomePageTemplateApi';
import { useListProductsApiPaginatedQQuery } from '../../redux/Apis/ProductApi';
import { useGetAllFactoriesQuery } from '../../redux/Apis/FactoryApi';
import FactoryListing from './FactoryListing/FactoryListing';
import { useTranslation } from 'react-i18next';

import './index.css';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { data, isLoading } = useGetHomePageTemplateApiQuery();

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: productData,
    isLoading: productDataLoading,
    isFetching
  } = useListProductsApiPaginatedQQuery({ page, limit: 10 });

  const { data: factoriesData, isLoading: factoriesLoading } =
    useGetAllFactoriesQuery();

  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const lastElementRef = useRef(null);

  const skeletonArray = Array.from({ length: 2 });

  useEffect(() => {
    if (!productData?.data) return;

    if (page === 1) {
      setProducts(productData.data);
    } else if (productData?.pagination?.page === page) {
      setProducts(prev => [...prev, ...productData.data]);
    }

    setHasMore(productData.data.length === 10);
  }, [productData, page]);

  useEffect(() => {
    if (productDataLoading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !productDataLoading) {
          setPage(prev => prev + 1);
        }
      },
      {
        root: containerRef.current,
        rootMargin: '200px',
        threshold: 0
      }
    );

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [productDataLoading, hasMore]);
  console.log('page',productDataLoading,page)
  return (
    <div
      ref={containerRef}
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      <BannerSlider
        data={data?.data?.sliders}
        aspectRatio={isSmallScreen ? '16/8' : '4/1'}
        loading={isLoading}
      />

      <h2 className="heading">{t('Top Factories')}</h2>
      <FactoryListing
        loading={factoriesLoading}
        data={factoriesData?.data}
      />

      <h2 className="heading">{t('Top Products')}</h2>
      <ProductListing1
        loading={isLoading}
        data={data?.data?.PrimaryData}

      />

      <Cards1 data={NavigationLinksCards1} />

      <h2 className="heading">{t('All Products')}</h2>
      <ProductListing1
        loading={productDataLoading && page === 1}
        data={products}
        paginationLoading={productDataLoading || isFetching}
      />

      <div ref={lastElementRef} style={{ height: 1 }} />

      {/* {(productDataLoading || isFetching) && page > 1 && (
        <div className="product-listing-grid">
          {skeletonArray.map((_, idx) => (
            <div key={idx} className="product-card">
              <Skeleton
                variant="rectangular"
                width="100%"
                height={120}
                style={{ borderRadius: 12 }}
              />
              <div className="product-details">
                <Skeleton variant="text" width="70%" height={24} />
                <Skeleton variant="text" width="90%" height={18} />
                <Skeleton variant="text" width="40%" height={16} />
              </div>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default Home;
