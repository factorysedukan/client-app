import React, { useEffect, useState, useRef } from 'react';
import BannerSlider2 from '../../HomeModule/BannerSlider/BannerSlider2';
import ProductListing2 from '../../HomeModule/ProductListing/ProductListing2';
import AddProductToCartModel from '../../utility/Models/AddProductToCartModel';
import { useAddRemoveProductHook } from '../../utility/hooks/addRemovProductHook';
import { useParams } from 'react-router-dom';
import { useGetProductByIDMutation } from '../../../redux/Apis/ProductApi';
import { useGetHomePageTemplateApiQuery } from '../../../redux/Apis/HomePageTemplateApi';
import Skeleton from '@mui/material/Skeleton';
import { useTranslation } from 'react-i18next';
import './index.css';

const ProductPageV2 = () => {
    const { t, i18n } = useTranslation();
    const params = useParams();
    const productId = params.id;
    const [getProductById, { isLoading }] = useGetProductByIDMutation();
    const [product, setProduct] = useState(null);
    const [currentArticle, setCurrentArticle] = useState(0);
    const [openCartModel, setOpenCartModel] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [article, setArticle] = useState({});
    const { getProductQuantity, addToCart, removeFromCart } = useAddRemoveProductHook();
    const { data: homeTemplateData, isLoading: isHomeLoading } = useGetHomePageTemplateApiQuery();
    const sliderRef = useRef(null);

    // Fetch product data
    useEffect(() => {
        getProductById(productId)
            .unwrap()
            .then(res => setProduct(res.data))
            .catch(() => setProduct(null));
    }, [productId, getProductById]);

    // Helper to get localized text
    const getLocalized = (en, hi) => i18n.language === 'hi' && hi ? hi : en;

    // Handle slider change
    const handleSlideChange = idx => setCurrentArticle(idx);

    // Handle quantity change for article
    const handleQtyChange = (articleId, delta) => {
        const article = product.articles.find(a => a._id === articleId);
        const minUnits = article?.minUnits || 1;
        let qty = getProductQuantity(articleId) || minUnits;
        qty += delta * minUnits;
        if (qty < minUnits) qty = minUnits;
        if (qty === 0) {
            removeFromCart(articleId);
        } else {
            addToCart({
                _id: articleId,
                sizes: article.sizes,
                selectedColors: article.colors,
                quantity: qty,
            });
        }
    };

    // Handle quantity change for size
    const handleQtyChangeForSize = (articleId, size, delta) => {
        const article = product.articles.find(a => a._id === articleId);
        const minUnits = article?.minUnits || 1;
        let qty = getProductQuantity(articleId) || 0;
        qty += delta * minUnits;
        if (qty < 0) qty = 0;
        if (qty === 0) {
            removeFromCart(articleId);
        } else {
            addToCart({
                _id: articleId,
                sizes: article.sizes,
                selectedColors: article.colors,
                quantity: qty,
            });
        }
    };



    const getProductQuantityForSize = (articleId, size) => {
        // Implement logic to get qty for this size from cart
        return 0; // Replace with actual logic
    };


    const [articles, setArticles] = useState(product?.articles || []);

    useEffect(() => {
        if (product) {
            setArticles(product?.articles || []);
        }
    }, [product]);

    useEffect(() => {
        if (articles.length > 0 && currentArticle < articles.length) {
            setArticle(articles[currentArticle])
        }
    }, [currentArticle, articles])

    console.log(currentArticle, articles, article);

    // Scroll to slider and set current article
    const handleCollageImageClick = idx => {
        setCurrentArticle(idx);
        if (sliderRef.current) {
            sliderRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        (isLoading || !product) ?
            (<div className="productpage-bg">
                <div className="productpage-slider-wrap">
                    <Skeleton variant="rectangular" width="100%" height={320} style={{ borderRadius: 24 }} />
                </div>
                <div className="productpage-details">
                    <Skeleton variant="text" width="60%" height={32} style={{ margin: '16px 0' }} />
                    <Skeleton variant="text" width="80%" height={20} style={{ margin: '8px 0' }} />
                    <Skeleton variant="rectangular" width="100%" height={120} style={{ borderRadius: 16, margin: '24px 0' }} />
                </div>
            </div>) :
            (<div className="productpage-bg">
                {/* Header with logo and name */}
                <div className="productpage-header">
                    <img
                        src={product.logoImage}
                        alt={getLocalized(product.name, product.nameHindi)}
                        className="productpage-header-logo"
                    />
                    <h1 className="productpage-title">
                        {getLocalized(product.name, product.nameHindi)}
                    </h1>
                </div>

                {/* Instruction text */}
                {/* <div className="productpage-instruction">
  <span className="productpage-instruction-rotating">
    <span>Swipe slides to see the products and click on available sizes to add it to cart</span>
    <span>स्लाइड्स को स्वाइप करें और उपलब्ध साइज पर क्लिक करके कार्ट में जोड़ें</span>
  </span>
</div> */}

                {/* Article slider */}
                <div
                    className="productpage-slider-wrap productpage-slider-wrap-v2"
                    ref={sliderRef}
                >
                    <div className="productpage-slider-inner" style={{marginBottom:'1em'}}>
                        <BannerSlider2
                            images={articles.map(a => a.image)}
                            aspectRatio={'16/9'}
                            styleObj={{ width: '100%', height: 'auto' }}
                            autoplay={false}
                            autoplaySpeed={5000}
                            dots={true}
                            current={currentArticle}
                            onSlideChange={handleSlideChange}
                        />
                    </div>
                </div>

                {/* Article details and qty controls */}
                <div className=" productpage-details-v2">
                    <div className="productpage-article-details">
                        <h2 className="productpage-article-title">
                            {getLocalized(article.name, article.nameHindi)}
                        </h2>
                        <div className="productpage-article-row">
                            <span className="productpage-label">{t('Price')}: ₹{article.sellingPrice}</span>
                            <span className="productpage-label-mrp">{t('MRP')}: ₹{article.mrp}</span>

                        </div>
                        <div className="productpage-article-row">
                            <span className="productpage-label-generic">{t('Min Set size')}:  {article.minUnits}</span>
                        </div>
                        <div className="productpage-article-row">
                            {/* <span className="productpage-label">{t('Color')}:</span> */}
                            {/* {Array.isArray(article.colors) && article.colors.length > 0 && (
                            article.colors.map((color, idx) => (
                                <span
                                    key={color._id || idx}
                                    className="productpage-color-dot"
                                    style={{ background: color.code }}
                                    title={color.name}
                                ></span>
                            ))
                        )} */}
                        </div>
                    </div>

                    <div className="productpage-article-sizes">
                        <span className="productpage-article-title">{t('Available Sizes')}:</span>
                        {Array.isArray(article.sizes) && article.sizes.length > 0 && (
                            article.sizes.map((sizeArr, idx) => (
                                <div key={idx} className="productpage-size-qty-row">
                                    <div style={{width:'50%'}}>
                                        <span className="productpage-size-dot">
                                        {Array.isArray(sizeArr) ? sizeArr.join(', ') : sizeArr}
                                    </span></div>
                                    
                                    <div style={{width:'30%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                        <button
                                        className="qty-btn"
                                        onClick={() => handleQtyChangeForSize(article._id, sizeArr, -1)}
                                    >-</button>
                                    <span className="qty-value">
                                        {getProductQuantityForSize(article._id, sizeArr) || 0}
                                    </span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => handleQtyChangeForSize(article._id, sizeArr, 1)}
                                    >+</button>
                                        </div>
                                </div>
                            ))
                        )}
                    </div>
                    {/* Qty controls */}
                    {/* <div className="productpage-qty-row">
                        <button
                            className="qty-btn"
                            onClick={() => handleQtyChange(article._id, -1)}
                        >-</button>
                        <span className="qty-value">
                            {getProductQuantity(article._id) || article.minUnits}
                        </span>
                        <button
                            className="qty-btn"
                            onClick={() => handleQtyChange(article._id, 1)}
                        >+</button>
                    </div> */}
                </div>

                {/* Footer: product description and other products */}
                <div className="productpage-footer productpage-footer-v2">
                    <h3 className='product-desc-heading'>{t('Description')}</h3>
                    <p className='product-desc'>{getLocalized(product.description, product.descriptionHindi)}</p>
                    
                    <div className="productpage-collage">
                        {Array.isArray(articles) && articles.length > 0 && (
                            <div className="productpage-collage-grid">
                                {articles.map((art, idx) => (
                                    <div
                                        className="productpage-collage-item"
                                        key={idx}
                                        onClick={() => handleCollageImageClick(idx)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src={art.image}
                                            alt={getLocalized(art.name, art.nameHindi)}
                                            className="productpage-collage-img"
                                        />
                                    </div>
                                ))}
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
                    product={selectedArticle}
                />
            </div>)

    );
};

export default ProductPageV2;
