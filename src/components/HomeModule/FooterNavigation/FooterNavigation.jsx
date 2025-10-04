import React, { useEffect } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import StrollerIcon from '@mui/icons-material/Stroller';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Skeleton from '@mui/material/Skeleton';
import './index.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetFeatureCategoriesMutation } from '../../../redux/Apis/FeatureCategoryApi';
import { useSelector } from 'react-redux';
import ChildCareIcon from '@mui/icons-material/ChildCare';
const FooterNavigation = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const cartProducts = useSelector(state => state.cart.cartState.products);
  const path = useLocation();
  // Call getFeatureCategories API on mount
  const [getFeatureCategories, { data, isLoading, error }] = useGetFeatureCategoriesMutation();

  useEffect(() => {
    getFeatureCategories();
  }, [getFeatureCategories]);

  // Loader skeleton for footer nav
  if (isLoading) {
    return (
      <footer className="footer-nav">
        <div className="footer-nav-container">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="footer-link-skeleton">
              <Skeleton variant="circular" width={28} height={28} />
              <Skeleton variant="text" width={40} height={12} style={{ marginTop: 4 }} />
            </div>
          ))}
        </div>
      </footer>
    );
  }

  console.log('path:', useLocation())

  const navItems = [
    { label: t('Home'), icon: <HomeIcon />, cta: () => { navigate('/') }, path: '/' },
    { label: t('Men'), icon: <ManIcon />, cta: () => { navigate(`/CategoryPages?type=Men&&id=${import.meta.env.VITE_APP_JIO_CATEGORY_ID}`) }, path: '/categorypages?type=Men' },
    { label: t('Ladies'), icon: <WomanIcon />, cta: () => { navigate(`/CategoryPages?type=ladies&&id=${import.meta.env.VITE_APP_JIO_CATEGORY_ID}`) }, path: '/categorypages?type=ladies' },
    { label: t('Kids'), icon: <ChildCareIcon />, cta: () => { navigate(`/CategoryPages?type=kids&&id=${import.meta.env.VITE_APP_JIO_CATEGORY_ID}`) }, path: '/categorypages?type=kids' },
    { label: t('Orders'), icon: <ReceiptLongIcon />, cta: () => { navigate('/pastOrders') }, path: '/pastorders' },
  ];

  const hasCartProducts = cartProducts && cartProducts.length > 0;

  return (
    <footer className={`footer-nav${hasCartProducts ? ' cart-active' : ''}`}>
      <div className={`footer-nav-container${hasCartProducts ? ' nav-shift' : ''}`}>
        {navItems.map((item) => {
          // Check if current path matches nav item path (case-insensitive, partial match for query params)
          let isActive;
          const currentPath = (path?.pathname + path?.search).toLowerCase();
          if (item.path === '/') {
            isActive = currentPath === '/';
          } else {
            isActive = currentPath.startsWith(item.path.toLowerCase());
          }
          return (
            <button
              key={item.label}
              onClick={item.cta}
              className={`footer-link${isActive ? ' active' : ''}`}
            >
              <span className="footer-icon">{item.icon}</span>
              <span className="footer-label">{item.label}</span>
            </button>
          );
        })}
      </div>
      {hasCartProducts && (path.pathname.toLowerCase() !== '/cart') && (
        <button
          className="footer-place-order-btn"
          onClick={() => navigate('/Cart')}
        >
          {t('Place Order')}
        </button>
      )}
    </footer>
  )
};

export default FooterNavigation;
