import React, { forwardRef, useEffect, useState } from 'react';
import './index1.css';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAddRemoveProductHook } from '../../utility/hooks/addRemovProductHook';
import AddProductToCartModel from '../../utility/Models/AddProductToCartModel';
import { useSelector } from 'react-redux';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ProductListing1 = forwardRef(({ loading = false, data = [] }, ref) => {
  const { t, i18n } = useTranslation();
  const [openCartModel, setOpenCartModel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const skeletonArray = Array.from({ length: 8 });
  const products = Array.isArray(data) ? data : [];
  const { isProductInCart } = useAddRemoveProductHook();
  const cartProducts = useSelector(state => state.cart.cartState.products);

  const navigate = useNavigate();

  const handleNavigate = (product) => {
    navigate(
      `/product/${product._id}`,
      { state: { product } }
    );
  }

  // Helper to get localized value
  const getLocalized = (en, hi) => i18n.language === 'hi' && hi ? hi : en;

  return (
    <div className="product-listing-grid" ref={loading ? null : ref}>
      {loading
        ? skeletonArray.map((_, idx) => (
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
          </div>
        ))
        : products.map(product => (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate(product)
            }}
            key={product._id || product.id}
            className="product-card"
            style={{ position: 'relative' }}
          >
            <div className="productImageContainer">
              <img
                loading='lazy'
                alt={getLocalized(product.name, product.nameHindi)}
                className="product-image"
                src={
                  Array.isArray(product.images) && product.images.length > 0
                    ? product.images[0]
                    : product.logoImage || product.image || ''
                }
              />
            </div>

            <div className="product-details">
              <h3 className="product-title">{getLocalized(product.name, product.nameHindi)}</h3>
              <p className="product-desc-home">
                {(() => {
                  const desc = getLocalized(product.description, product.descriptionHindi) || '';
                  const words = desc.split(' ');
                  return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : desc;
                })()}
              </p>
              {Array.isArray(product.colors) && product.colors.length > 0 && (
                <div className="product-colors-row">
                  <span className='product-color-label'>
                    {t('Color')}:
                  </span>
                  {product.colors.map((color, idx) => (
                    <span
                      key={color.code || idx}
                      className="product-color-dot"
                      style={{
                        background: color.code,
                        display: 'inline-block',
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        marginRight: 2,
                        marginLeft: 2,
                        border: '0.5px solid #e5e7eb',
                        verticalAlign: 'middle'
                      }}
                    ></span>
                  ))}
                </div>
              )}
              <div className="product-action-row">
                <p className="product-price">
                  {product?.minPrice == product?.maxPrice
                    ? `₹${product?.minPrice ? product?.minPrice : "--"}`
                    : `₹${product?.minPrice}-₹${product?.maxPrice}`}
                </p>
                <p className="product-price-MRP">
                  MRP: {product?.minMrp == product?.maxMrp
                    ? `₹${product?.minMrp ? product?.minMrp : "--"}`
                    : `₹${product?.minMrp}-₹${product?.maxMrp}`}
                </p>
                <p className="product-price-MRP" style={{ color: 'rgb(135 2 2)', fontWeight: 600,fontSize:'1em' }}>
                  {(() => {
                    const minMargin = product?.minMrp && product?.minPrice ? ((product.minMrp - product.minPrice) / product.minMrp) * 100 : null;
                    const maxMargin = product?.maxMrp && product?.maxPrice ? ((product.maxMrp - product.maxPrice) / product.maxMrp) * 100 : null;
                    if (minMargin !== null && maxMargin !== null) {
                      return minMargin === maxMargin
                        ? `Margin: ${minMargin.toFixed(1)}%`
                        : `Margin: ${minMargin.toFixed(1)}% - ${maxMargin.toFixed(1)}%`;
                    } else {
                      return "Margin: --";
                    }
                  })()}
                </p>
                <div className="product-qty" >
                  {isProductInCart(product._id || product.id) == 0 ? (
                    <button className="buy-now-btn" onClick={(e) => {
                      // e.stopPropagation();
                      
                      // setOpenCartModel(true);
                      // setSelectedProduct(product);
                    }}>
                      {t('Buy Now')}
                    </button>
                  ) : (
                     <button className="edit-now-btn" onClick={(e) => {
                      // e.stopPropagation();
                      
                      // setOpenCartModel(true);
                      // setSelectedProduct(product);
                    }}>
                      {t('Change Quantity')}
                    </button>
                  )}
                </div>
              </div>
            </div>
            {isProductInCart(product._id || product.id) ? (
              <div className="product-listing1-cart-indicator">
                <CheckCircleIcon fontSize="small" />
                <span style={{ marginLeft: 4, fontSize: '0.75em', fontWeight: 500 }}>
                  {i18n.language === 'hi'
                    ? 'कार्ट में जोड़ा गया'
                    : 'Added to cart'}
                </span>
              </div>
            ) : null}
          </div>
        ))}
      <AddProductToCartModel
        open={openCartModel}
        onClose={() => setOpenCartModel(false)}
        product={selectedProduct}
      />
    </div>
  );
})

export default ProductListing1;
