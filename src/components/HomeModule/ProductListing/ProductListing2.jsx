import React from 'react';
import './index2.css';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAddRemoveProductHook } from '../../utility/hooks/addRemovProductHook';

const ProductListing2 = ({ loading = false, data = [] }) => {
  const { i18n, t } = useTranslation();
  const skeletonArray = Array.from({ length: 10 });
  const products = Array.isArray(data) ? data : [];
  const navigate = useNavigate();

  const { isProductInCart } = useAddRemoveProductHook();

  const handleNavigate = (product) => {
    navigate(`/product/${product._id}`,
      { state: { product } }
    );
  };

  // Helper to get localized value
  const getLocalized = (en, hi) => i18n.language === 'hi' && hi ? hi : en;

  return (
    <div className="product-listing2-bg">
      <div className="product-listing2-scroll">
        <div className="product-listing2-flex">
          {loading
            ? skeletonArray.map((_, idx) => (
                <div key={idx} className="product-listing2-card wide-card">
                  <Skeleton
                    variant="rectangular"
                    width={64}
                    height={64}
                    className="product-listing2-img"
                    style={{ borderRadius: 12, marginTop: 8 }}
                  />
                  <div className="product-listing2-info">
                    <Skeleton
                      variant="text"
                      width={60}
                      height={18}
                      className="product-listing2-title"
                      style={{ margin: '8px auto 0 auto' }}
                    />
                    <Skeleton
                      variant="text"
                      width={40}
                      height={16}
                      className="product-listing2-price"
                      style={{ margin: '4px auto 0 auto' }}
                    />
                  </div>
                </div>
              ))
            : products.map(product => (
                <div
                  onClick={() => { handleNavigate(product) }}
                  key={product._id || product.id}
                  className="product-listing2-card wide-card"
                  style={{ position: 'relative' }}
                >
                  <img
                    alt={getLocalized(product.name, product.nameHindi)}
                    className="product-listing2-img"
                    src={
                      Array.isArray(product.images) && product.images.length > 0
                        ? product.images[0]
                        : product.logoImage || product.image || ''
                    }
                  />
                  <div className="product-listing2-info">
                    <h3 className="product-listing2-title one-line">{getLocalized(product.name, product.nameHindi)}</h3>
                    <p className="product-listing2-price">
                     {product?.minPrice==product?.maxPrice ? `₹${product?.minPrice ? product?.minPrice :"--"}` : `₹${product?.minPrice}-₹${product?.maxPrice}`}
                    </p>
                  </div>
                  {isProductInCart(product._id) && (
                    <div className="product-listing2-cart-indicator">
                      <CheckCircleIcon fontSize="small" />
                      <span style={{ marginLeft: 4, fontSize: '0.75em', fontWeight: 500 }}>
                        {i18n.language === 'hi'
                          ? 'कार्ट में जोड़ा गया'
                          : 'Added to cart'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListing2;
