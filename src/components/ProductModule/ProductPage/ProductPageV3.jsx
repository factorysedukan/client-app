import React, { useEffect, useState } from 'react';
import ProductListing2 from '../../HomeModule/ProductListing/ProductListing2';
import AddProductToCartModel from '../../utility/Models/AddProductToCartModel';
import { useAddRemoveProductHook } from '../../utility/hooks/addRemovProductHook';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIDMutation } from '../../../redux/Apis/ProductApi';
import { useGetHomePageTemplateApiQuery } from '../../../redux/Apis/HomePageTemplateApi';
import Skeleton from '@mui/material/Skeleton';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import './indexv3.css';

const ProductPageV3 = () => {
    const { t, i18n } = useTranslation();
    const params = useParams();
    const productId = params.id;
    const [getProductById, { isLoading }] = useGetProductByIDMutation();
    const [product, setProduct] = useState(null);
    const [openCartModel, setOpenCartModel] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [modalImg, setModalImg] = useState(null);
    const navigate = useNavigate();

    const { getProductQuantity, handleAddToCart, removeProductFromCart } = useAddRemoveProductHook();
    const { data: homeTemplateData, isLoading: isHomeLoading } = useGetHomePageTemplateApiQuery();

    useEffect(() => {
        getProductById(productId)
            .unwrap()
            .then(res => setProduct(res.data))
            .catch(() => setProduct(null));
    }, [productId, getProductById]);

    const getLocalized = (en, hi) => i18n.language === 'hi' && hi ? hi : en;

    const handleQtyChange = (article, delta) => {
        const minUnits = article?.minUnits || 1;
        let orderQty = getProductQuantity(article._id) || 0;
        orderQty += delta * minUnits;

        if (orderQty === 0) {
            // Remove article from cart (removes product if no articles left)
            removeProductFromCart({
                productId: product._id,
                articleId: article._id,
                orderQty: 0 // remove minUnits at a time
            });
        } else {
            // Add/update article in cart with new orderQty
            handleAddToCart({
                product: product,
                article: { ...article, orderQty },
                orderQty
            });
        }
    };

    const handleOpenModal = (img) => {
        setModalImg(img);
    };

    const handleCloseModal = () => {
        setModalImg(null);
    };

    const handleShare = async (id) => {
        const shareUrl = `${import.meta.env.VITE_APP_JIO_FACTORY_ADMIN_URL}/${id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url: shareUrl,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // fallback: copy to clipboard
            navigator.clipboard.writeText(shareUrl);
            alert("Link copied to clipboard!");
        }
    };




    const handleGeneralShare = () => {
        if (navigator.share) {
            navigator.share({
                title: getLocalized(product.name, product.nameHindi),
                text:
                    `${getLocalized(product.name, product.nameHindi)}\n` +
                    `Price: ₹${product.minPrice}${product.maxPrice && product.maxPrice !== product.minPrice ? ` - ₹${product.maxPrice}` : ''}\n` +
                    `${getLocalized(product.description, product.descriptionHindi)}`,
                url: product.logoImage || window.location.href
            });
        } else {
            alert('Sharing is not supported on this browser.');
        }
    };

    if (isLoading || !product) {
        return (
            <div className="productpage-bg animate-fadein">
                <div className="productpage-slider-wrap animate-fadein">
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={220}
                        style={{ borderRadius: 24, animation: 'pulse 1.2s infinite' }}
                    />
                </div>
                <div className="productpage-details animate-fadein">
                    <Skeleton
                        variant="text"
                        width="60%"
                        height={32}
                        style={{ margin: '16px 0', animation: 'pulse 1.2s infinite' }}
                    />
                    <Skeleton
                        variant="text"
                        width="80%"
                        height={20}
                        style={{ margin: '8px 0', animation: 'pulse 1.2s infinite' }}
                    />
                    {[...Array(2)].map((_, idx) => (
                        <div key={idx} className="productpagev3-article-row animate-pop">
                            <Skeleton
                                variant="rectangular"
                                width={110}
                                height={110}
                                style={{ borderRadius: 12, marginRight: 16, animation: 'pulse 1.2s infinite' }}
                            />
                            <div style={{ flex: 1 }}>
                                <Skeleton variant="text" width="50%" height={24} style={{ marginBottom: 8, animation: 'pulse 1.2s infinite' }} />
                                <Skeleton variant="text" width="40%" height={18} style={{ marginBottom: 8, animation: 'pulse 1.2s infinite' }} />
                                <Skeleton variant="rectangular" width={80} height={28} style={{ borderRadius: 8, animation: 'pulse 1.2s infinite' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const articles = product.articles || [];

    return (
        <div className="productpage-bg">
            {/* Header with logo, back button and name */}
            <div className="productpage-header">

                <div className="productpage-header-details">
                    <IconButton
                        className="productpagev3-back-btn"
                        onClick={() => navigate(-1)}
                        size="small"
                        style={{ fontSize: '1.1rem', padding: 4 }}
                    >
                        <ArrowBackIosNewIcon fontSize="small" />
                    </IconButton>

                    <h1 className="productpage-title">
                        {getLocalized(product.name, product.nameHindi)}
                    </h1>

                    {/* WhatsApp Share Button */}
                    <a
                        href={`http://localhost:4000/api/productv2/share/${product._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: 12, display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                        title="Share on WhatsApp"
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                            alt="WhatsApp"
                            style={{ width: 28, height: 28 }}
                        />
                    </a>
                    <button
                        onClick={()=>{handleShare(product._id)}}
                        style={{ marginLeft: 12, display: 'flex', alignItems: 'center' }}
                        title="Share"
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                            alt="Share"
                            style={{ width: 28, height: 28 }}
                        />
                    </button>
                </div>
            </div>


            {/* Articles in rows */}\
            <div className="productpagev3-articles-list">
                <div style={{ display: 'flex', gap: '0.2em', boxSizing: 'border-box', padding: '0.2em', background: '#edebeb', color: 'black', margin: '1em 1em 0em 1em', borderRadius: '20px' }}>
                    {/* <h3 className='product-desc-heading'>{t('Description')}</h3> */}
                    <img
                        src={product.logoImage}
                        alt={getLocalized(product.name, product.nameHindi)}
                        className="productpage-header-logo"
                    />

                    <p className='product-desc'>{getLocalized(product.description, product.descriptionHindi)}</p>
                </div>

                {articles.map((article, idx) => (
                    <div className="productpagev3-article-row" key={article._id || idx}>
                        {/* Left: Image with eye icon */}
                        <div className="productpagev3-article-img-col">
                            <div className="productpagev3-img-wrap">
                                <img
                                    src={article.image}
                                    alt={getLocalized(article.name, article.nameHindi)}
                                    className="productpagev3-article-img"
                                    onClick={() => handleOpenModal(article.image)}
                                />
                                <IconButton
                                    size='small'
                                    className="productpagev3-eye-btn"
                                    onClick={() => handleOpenModal(article.image)}
                                >
                                    <VisibilityIcon size='small' />
                                </IconButton>
                            </div>
                        </div>
                        {/* Right: Details and qty */}
                        <div className="productpagev3-article-details">
                            <h2 className="productpage-article-title">
                                {getLocalized(article.name, article.nameHindi)}
                            </h2>
                            <div className="productpage-article-row">
                                <span className="productpage-label">{t('Price')}: ₹{article.sellingPrice}</span>
                                <span className="productpage-label-mrp">{t('MRP')}: ₹{article.mrp}</span>
                            </div>
                            {/* Sizes chips */}
                            <div className="productpage-article-sizes-row">
                                <span className="productpage-label-generic">{t('Size')}:</span>
                                {(Array.isArray(article.sizes) ? article.sizes : []).map((size, sidx) => (
                                    <span
                                        key={size.label || size || sidx}
                                        className="productpage-article-size-chip"
                                    >
                                        {size.label || size.join(',')}
                                    </span>
                                ))}
                            </div>
                            <div className="productpage-article-row">
                                <span className="productpage-label-generic">{t('Min Set size')}: {article.minUnits}</span>
                            </div>
                            <div className="productpage-qty-row">
                                <button
                                    disabled={getProductQuantity(article._id) == 0}
                                    className="qty-btn"
                                    onClick={() => handleQtyChange(article, -1)}
                                >-</button>
                                <span className="qty-value">
                                    {getProductQuantity(article._id) || 0}
                                </span>
                                <button
                                    className="qty-btn"
                                    onClick={() => handleQtyChange(article, 1)}
                                >+</button>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="productpage-footer productpage-footer-v2">
                    <h3 className='product-desc-heading'>{t('Description')}</h3>
                    <p className='product-desc'>{getLocalized(product.description, product.descriptionHindi)}</p>
                    <div className="productpage-section">
                        <h2 className="productpage-section-title">{t('Other Products')}</h2>
                        <ProductListing2
                            loading={isHomeLoading}
                            data={homeTemplateData?.data?.[0]?.SmallSlider}
                        />
                    </div>
                </div>
            </div>

            {/* Footer: product description and other products */}
            {/* <div className="productpage-footer productpage-footer-v2">
                <h3 className='product-desc-heading'>{t('Description')}</h3>
                <p className='product-desc'>{getLocalized(product.description, product.descriptionHindi)}</p>
                <div className="productpage-section">
                    <h2 className="productpage-section-title">{t('Other Products')}</h2>
                    <ProductListing2
                        loading={isHomeLoading}
                        data={homeTemplateData?.data?.[0]?.SmallSlider}
                    />
                </div>
            </div> */}
            <AddProductToCartModel
                open={openCartModel}
                onClose={() => setOpenCartModel(false)}
                product={selectedArticle}
            />
            {/* Modal for zoomed image */}
            {modalImg && (
                <div className="productpagev3-modal-backdrop" onClick={handleCloseModal}>
                    <div className="productpagev3-modal-imgwrap" onClick={e => e.stopPropagation()}>
                        <img src={modalImg} alt="zoomed" className="productpagev3-modal-img" />
                        <button className="productpagev3-modal-close" onClick={handleCloseModal}>×</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductPageV3;