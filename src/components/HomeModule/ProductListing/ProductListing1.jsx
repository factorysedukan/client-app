import React, { forwardRef, useState } from 'react';
import './index1.css';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAddRemoveProductHook } from '../../utility/hooks/addRemovProductHook';
import AddProductToCartModel from '../../utility/Models/AddProductToCartModel';
import { useSelector } from 'react-redux';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ProductListing1 = forwardRef(
  (
    {
      loading = false,
      data = [],
      paginationLoading = false,
      lastItemRef, // 👈 NEW
    },
    _
  ) => {
    const { t, i18n } = useTranslation();
    const [openCartModel, setOpenCartModel] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const skeletonArray = Array.from({ length: 8 });
    const skeletonArray2 = Array.from({ length: 2 });

    const products = Array.isArray(data) ? data : [];
    const { isProductInCart } = useAddRemoveProductHook();
    const cartProducts = useSelector(state => state.cart.cartState.products);

    const navigate = useNavigate();

    const handleNavigate = product => {
      navigate(`/product/${product._id}`, { state: { product } });
    };

    const getLocalized = (en, hi) =>
      i18n.language === 'hi' && hi ? hi : en;

    const getOptimizedImage = url => {
      if (!url || !url.includes('cloudinary.com')) return url;
      const w =
        window.innerWidth <= 600
          ? 400
          : window.innerWidth <= 1024
          ? 700
          : 1200;

      return url.replace('/upload/', `/upload/w_${w},c_limit,f_auto,q_auto/`);
    };

    return (
      <div className="product-listing-grid">
        {loading
          ? skeletonArray.map((_, idx) => (
              <div key={idx} className="product-card">
                <Skeleton variant="rectangular" width="100%" height={120} />
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="90%" />
              </div>
            ))
          : products.map((product, idx) => {
              const isLast = idx === products.length - 1;

              return (
                <div
                  ref={isLast ? lastItemRef : null} // 👈 OBSERVE LAST ITEM
                  // key={product._id || product.id}
                  className="product-card"
                  onClick={e => {
                    e.stopPropagation();
                    handleNavigate(product);
                  }}
                  style={{ position: 'relative' }}
                >
                  <div className="productImageContainer">
                    <img
                      loading="lazy"
                      alt={getLocalized(product.name, product.nameHindi)}
                      className="product-image"
                      src={getOptimizedImage(
                        product.images?.[0] ||
                          product.logoImage ||
                          product.image ||
                          ''
                      )}
                    />
                  </div>

                  <div className="product-details">
                    <h3 className="product-title">
                      {getLocalized(product.name, product.nameHindi)}
                    </h3>

                    <p className="product-desc-home">
                      {(() => {
                        const d =
                          getLocalized(
                            product.description,
                            product.descriptionHindi
                          ) || '';
                        const w = d.split(' ');
                        return w.length > 5
                          ? w.slice(0, 5).join(' ') + '...'
                          : d;
                      })()}
                    </p>

                    <div className="product-action-row">
                      <p className="product-price">
                        {product.minPrice === product.maxPrice
                          ? `₹${product.minPrice ?? '--'}`
                          : `₹${product.minPrice}-₹${product.maxPrice}`}
                      </p>

                      <p className="product-price-MRP">
                        MRP:{' '}
                        {product.minMrp === product.maxMrp
                          ? `₹${product.minMrp ?? '--'}`
                          : `₹${product.minMrp}-₹${product.maxMrp}`}
                      </p>
                    </div>
                  </div>

                  {isProductInCart(product._id || product.id) ? (
                    <div className="product-listing1-cart-indicator">
                      <CheckCircleIcon fontSize="small" />
                      <span style={{ marginLeft: 4, fontSize: '0.75em' }}>
                        {i18n.language === 'hi'
                          ? 'कार्ट में जोड़ा गया'
                          : 'Added to cart'}
                      </span>
                    </div>
                  ) : null}
                </div>
              );
            })}

        {paginationLoading &&
          skeletonArray2.map((_, idx) => (
            <div key={idx} className="product-card">
              <Skeleton variant="rectangular" width="100%" height={120} />
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="90%" />
            </div>
          ))}

        <AddProductToCartModel
          open={openCartModel}
          onClose={() => setOpenCartModel(false)}
          product={selectedProduct}
        />
      </div>
    );
  }
);

export default ProductListing1;
