import React, { useEffect, useState } from 'react';
import BannerSlider from '../../HomeModule/BannerSlider/BannerSlider';
import ProductListing2 from '../../HomeModule/ProductListing/ProductListing2';
import AddProductToCartModel from '../../utility/Models/AddProductToCartModel';
import { useAddRemoveProductHook } from '../../utility/hooks/addRemovProductHook';
import './ProductPageStyles.css';
import { useLocation, useParams } from 'react-router-dom';
import { useGetProductByIDMutation } from '../../../redux/Apis/ProductApi';
import { useGetHomePageTemplateApiQuery } from '../../../redux/Apis/HomePageTemplateApi';
import Skeleton from '@mui/material/Skeleton';
import { useTranslation } from 'react-i18next';
import BannerSlider2 from '../../HomeModule/BannerSlider/BannerSlider2';

const ProductPage = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const params = useParams();
  const productId = params.id;
  const stateProduct = location.state?.product;

  const [getProductById, { data, isLoading }] = useGetProductByIDMutation();
  const [product, setProduct] = useState(stateProduct || null);

  // Cart modal state
  const [openCartModel, setOpenCartModel] = useState(false);
  const { getProductQuantity } = useAddRemoveProductHook();

  // Fetch homepage template for other products
  const { data: homeTemplateData, isLoading: isHomeLoading } = useGetHomePageTemplateApiQuery();

  useEffect(() => {
    if (!product && productId) {
      getProductById(productId)
        .unwrap()
        .then(res => setProduct(res.data))
        .catch(() => setProduct(null));
    }
  }, [product, productId, getProductById]);

  // Helper to get name/description based on language
  const getLocalized = (en, hi) => i18n.language === 'hi' && hi ? hi : en;

  // Loader skeleton
  if (isLoading || !product) {
    return (
      <div className="productpage-bg">
        <div className="productpage-slider-wrap">
          <Skeleton variant="rectangular" width="100%" height={320} style={{ borderRadius: 24 }} />
        </div>
        <div className="productpage-details">
          <Skeleton variant="text" width="60%" height={32} style={{ margin: '16px 0' }} />
          <Skeleton variant="text" width="80%" height={20} style={{ margin: '8px 0' }} />
          <Skeleton variant="rectangular" width="100%" height={120} style={{ borderRadius: 16, margin: '24px 0' }} />
        </div>
      </div>
    );
  }
  console.log('aaa',product)
  return (
    <div className="productpage-bg">
      <div className="productpage-slider-wrap">
        <BannerSlider2 images={[product?.logoImage,...product?.images]|| []} dots={true} aspectRatio={'16/9'} styleObj={{ width: '100%', height: 'auto'}}/>
      </div>
      <div className="productpage-details">
        <h1 className="productpage-title">
          {getLocalized(product.name, product.nameHindi)}
        </h1>
        <p className="productpage-desc">
          {getLocalized(product.description, product.descriptionHindi)}
        </p>
        <div className="productpage-price-row">
          <p className="productpage-price">
            ₹{product.sellingPrice ?? product.price ?? '--'}
          </p>
        </div>
        <div className="productpage-section">
          <h2 className="productpage-section-title">{t('Color')}</h2>
          <div className="productpage-color-row">
            {(product.colors || []).map((color, idx) => (
              <span
                key={color.code || idx}
                className="productpage-color-dot"
                style={{
                  background: color.code,
                  display: 'inline-block',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  marginRight: 6,
                  border: '1px solid #e5e7eb',
                  verticalAlign: 'middle'
                }}
              ></span>
            ))}
          </div>
        </div>
        <div className="productpage-section">
          <h2 className="productpage-section-title">{t('Size')}</h2>
          <div className="productpage-size-row">
            {(product.sizes || []).map((size, idx) => (
              <span
                key={size.label || size || idx}
                className="productpage-size-dot"
                style={{
                  display: 'inline-block',
                  padding: '6px 16px',
                  marginRight: 8,
                  background: '#f3f4f6',
                  borderRadius: 8,
                  fontWeight: 500,
                  fontSize: 15,
                  border: '1px solid #e5e7eb'
                }}
              >
                {size.label || size}
              </span>
            ))}
          </div>
          {(product.description || product.descriptionHindi) && (
            <p className="productpage-size-desc">
              {getLocalized(product.description, product.descriptionHindi)}
            </p>
          )}
        </div>
        {/* Buy Now and Qty/Edit */}
        <div className="productpage-section">
          {getProductQuantity(product._id || product.id) === 0 ? (
            <button
              className="buy-now-btn"
              onClick={() => setOpenCartModel(true)}
              style={{ marginTop: 12 }}
            >
              {t('Buy Now')}
            </button>
          ) : (
            <div className="qty-value" style={{ marginTop: 12 }}>
              {t('Qty Added')}: {getProductQuantity(product._id || product.id) || 0}
              <button
                className="edit-qty-btn"
                onClick={() => setOpenCartModel(true)}
                style={{ marginLeft: 8 }}
              >
                {t('Edit')}
              </button>
            </div>
          )}
        </div>
        <div className="productpage-section">
          <h2 className="productpage-section-title">{t('Other Products')}</h2>
          <ProductListing2
            loading={isHomeLoading}
            data={homeTemplateData?.data?.[0]?.SmallSlider}
          />
        </div>
      </div>
      <AddProductToCartModel
        open={openCartModel}
        onClose={() => setOpenCartModel(false)}
        product={product}
      />
    </div>
  );
};

export default ProductPage;
