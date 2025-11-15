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
import ProductListingLandscape from '../../HomeModule/ProductListing/ProductListingLandscape';
import { useMediaQuery, useTheme } from '@mui/material';
import BannerSlider from '../../HomeModule/BannerSlider/BannerSlider';

const ProductPageV3 = () => {
    const { t, i18n } = useTranslation();
    const params = useParams();
    const productId = params.id;
    const [getProductById, { isLoading }] = useGetProductByIDMutation();
    const [product, setProduct] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [openCartModel, setOpenCartModel] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [modalImg, setModalImg] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const { getProductQuantity, handleAddToCart, removeProductFromCart } = useAddRemoveProductHook();
    const { data: homeTemplateData, isLoading: isHomeLoading } = useGetHomePageTemplateApiQuery();

    useEffect(() => {
        setErrorMsg(null);
        getProductById(productId)
            .unwrap()
            .then(res => {
                const p = res?.data || null;
                if (!p) {
                    setProduct(null);
                    setErrorMsg(i18n?.language === 'hi' ? 'उत्पाद स्टॉक में नहीं है' : 'Product is out of stock');
                } else {
                    setProduct(p);
                    setErrorMsg(null);
                }
            })
            .catch(() => {
                setProduct(null);
                setErrorMsg(i18n?.language === 'hi' ? 'उत्पाद स्टॉक में नहीं है' : 'Product is out of stock');
            });
    }, [productId, getProductById, i18n?.language]);

    // if product exists but has no available articles -> show out of stock
    useEffect(() => {
        if (!product) return;
        const hasAvailable = (product?.articles || []).some(a => (a.qty ?? 0) > 0);
        if (!hasAvailable) {
            setErrorMsg(i18n?.language === 'hi' ? 'उत्पाद स्टॉक में नहीं है' : 'Product is out of stock');
        } else {
            setErrorMsg(null);
        }
    }, [product, i18n?.language]);

    useEffect(() => {
        // window.scrollTo(0, 0);
        let element = document.getElementsByClassName("container-scroll-focus")[0];
        console.log('element', element);


        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        }


    }, [product]);
    const getLocalized = (en, hi) => i18n.language === 'hi' && hi ? hi : en;

    const handleQtyChange = (article, delta) => {
        const minUnits = article?.minUnits || 1;
        let orderQty = getProductQuantity(article._id) || 0;
        orderQty += delta * minUnits;

        if (orderQty === 0) {
            // Remove article from cart (removes product if no articles left)
            removeProductFromCart({
                productId: product?._id,
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
        const shareUrl = `${import.meta.env.VITE_APP_JIO_FACTORY_ADMIN_URL}api/v1/productsv2/share/${id}`;
        console.log("Share URL:", shareUrl);
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product?.name,
                    text: product?.description,
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

    if (isLoading) {
        return (
            <div className="productpage-bg animate-fadein">
                <div className="productpage-slider-wrap animate-fadein">
                    <Skeleton variant="rectangular" width="100%" height={220} className="skeleton-hero" />
                </div>
                <div className="productpage-details animate-fadein">
                    <Skeleton variant="text" width="60%" height={32} className="skeleton-line-lg" />
                    <Skeleton variant="text" width="80%" height={20} className="skeleton-line" />
                    {[...Array(2)].map((_, idx) => (
                        <div key={idx} className="productpagev3-article-row animate-pop">
                            <Skeleton variant="rectangular" width={110} height={110} className="skeleton-image" />
                            <div className="skeleton-texts">
                                <Skeleton variant="text" width="50%" height={24} className="skeleton-line" />
                                <Skeleton variant="text" width="40%" height={18} className="skeleton-line" />
                                <Skeleton variant="rectangular" width={80} height={28} className="skeleton-rect" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="productpage-bg">
                <div className="productpage-error-wrap">
                    <div className="productpage-error-card">
                        <h2 className="productpage-error-title">{errorMsg}</h2>
                        <p className="productpage-error-sub">{t('Please try other products or contact support.')}</p>
                        <div className="productpage-error-actions">
                            <button className="productpage-error-btn" onClick={() => navigate('/')}>{t('Shop More')}</button>
                        </div>
                    </div>

                    <div className="productpage-footer productpage-footer-v2">

                        <div className="productpage-section">
                             <BannerSlider data={homeTemplateData?.data?.sliders} aspectRatio={isSmallScreen ? '16/7' : '4/1'} />
                            <h2 className="productpage-section-title">{t('Top Products')}</h2>
                           

                            <ProductListing2
                                loading={isHomeLoading}
                                data={homeTemplateData?.data?.SmallSlider}
                            />

                            <h2 className="productpage-section-title">{t('Other Products')}</h2>
                            <ProductListingLandscape

                            />


                         

                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const articles = product?.articles || [];




    return (
        <div className="productpage-bg">
            {/* Header with logo, back button and name */}
            <div className="productpage-header">

                <div className="productpage-header-details">
                    <IconButton
                        className="productpagev3-back-btn"
                        onClick={() => {
                            console.log(window.history);
                            if (window.history.length > 2) {
                                navigate(-1);
                            } else {
                                navigate('/');
                            }
                        }
                        }
                        size="small"
                        style={{ fontSize: '1.1rem', padding: 4 }}
                    >
                        <ArrowBackIosNewIcon fontSize="small" />
                    </IconButton>

                    <h1 className="productpage-title">
                        {getLocalized(product?.name, product?.nameHindi)}
                    </h1>

                    {/* 
                    <button
                        onClick={() => { handleShare(product?._id) }}
                        style={{ marginLeft: 12, display: 'flex', alignItems: 'center', border: '0px solid white', background: 'transparent' }}
                        title="Share"
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                            alt="Share"
                            style={{ width: 28, height: 28 }}
                        />
                    </button> */}

                    <button
                        onClick={() => { handleShare(product?._id) }}
                        style={{ marginLeft: 12, display: 'flex', alignItems: 'center', border: '0px solid white', background: 'transparent' }}
                        title="Share"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/929/929610.png"
                            alt="Share"
                            style={{ width: 20, height: 20 }}
                        />
                    </button>
                </div>
            </div>


            {/* Articles in rows */}
            <div className="productpagev3-articles-list">
                <div style={{ display: 'flex', gap: '0.2em', boxSizing: 'border-box', padding: '0.2em', background: '#edebeb', color: 'black', margin: '1em 1em 0em 1em', borderRadius: '20px' }} className='container-scroll-focus'>
                    {/* <h3 className='product-desc-heading'>{t('Description')}</h3> */}
                    <img
                        src={product?.logoImage}
                        alt={getLocalized(product?.name, product?.nameHindi)}
                        className="productpage-header-logo"
                    />

                    <p className='product-desc'>{getLocalized(product?.description, product?.descriptionHindi)}</p>
                </div>

                {articles
                    .filter(article => (article.qty ?? 0) > 0) // Only show articles with qty > 0
                    .map((article, idx) => (
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
                                <p className="productpage-label-mrp" style={{ color: '#22c55e', fontWeight: 600, margin: '0px 0 0 0', color: 'rgb(135 2 2)', fontSize: '1em' }}>
                                    {(() => {
                                        const price = article?.sellingPrice;
                                        const mrp = article?.mrp;
                                        if (price && mrp) {
                                            const margin = ((mrp - price) / mrp) * 100;
                                            return `Margin: ${margin.toFixed(1)}%`;
                                        }
                                        return "Margin: --";
                                    })()}
                                </p>
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
                                {/* Qt py / Add to cart area */}
                                <div className="productpage-qty-row">
                                    {getProductQuantity(article._id) == 0 ? (
                                        // Show Add to cart button when qty is zero
                                        <button
                                            className="qty-btn"
                                            onClick={() => handleQtyChange(article, 1)}
                                            style={{
                                                background: '#e4572e',
                                                color: '#fff',
                                                cursor: 'pointer',
                                                border: 'none',
                                                borderRadius: 8,
                                                padding: '8px 12px',
                                                fontWeight: 700,
                                                fontSize: '0.95em',
                                                transition: 'background 0.2s'
                                            }}
                                        >
                                            {i18n?.language === 'hi' ? 'Item खरीदें' : 'Add Item'}
                                        </button>
                                    ) : (
                                        // Show qty controls when item already in cart
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25em' }}>
                                                <div style={{ fontSize: '0.75em', color: '#444', fontWeight: 600 }}>
                                                    {/* instruction text on top */}
                                                    {i18n?.language === 'hi' ? 'Qty बढ़ाएँ/घटाएँ' : 'Increase/Decrease qty'}
                                                </div>
                                                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <button
                                                        disabled={getProductQuantity(article._id) == 0}
                                                        className="qty-btn"
                                                        onClick={() => handleQtyChange(article, -1)}
                                                        style={{
                                                            background: getProductQuantity(article._id) == 0 ? '#e5e7eb' : '#e4572e',
                                                            color: getProductQuantity(article._id) == 0 ? '#aaa' : '#fff',
                                                            cursor: getProductQuantity(article._id) == 0 ? 'not-allowed' : 'pointer',
                                                            border: 'none',
                                                            borderRadius: 8,
                                                            width: 32,
                                                            height: 32,
                                                            fontWeight: 700,
                                                            fontSize: '1.2em',
                                                            transition: 'background 0.2s'
                                                        }}
                                                    >-</button>
                                                    <span className="qty-value" style={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>
                                                        {getProductQuantity(article._id) || 0}
                                                    </span>
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => handleQtyChange(article, 1)}
                                                        disabled={getProductQuantity(article._id) >= (article.qty ?? 0)}
                                                        style={{
                                                            background: getProductQuantity(article._id) >= (article.qty ?? 0) ? '#e5e7eb' : '#e4572e',
                                                            color: getProductQuantity(article._id) >= (article.qty ?? 0) ? '#aaa' : '#fff',
                                                            cursor: getProductQuantity(article._id) >= (article.qty ?? 0) ? 'not-allowed' : 'pointer',
                                                            border: 'none',
                                                            borderRadius: 8,
                                                            width: 32,
                                                            height: 32,
                                                            fontWeight: 700,
                                                            fontSize: '1.2em',
                                                            transition: 'background 0.2s'
                                                        }}
                                                    >+</button>
                                                </div>
                                                <div style={{ fontSize: '0.85em', color: '#666' }}>
                                                    {i18n?.language === 'hi'
                                                        ? `कार्ट में डाली गई संख्या: ${getProductQuantity(article._id) || 0}`
                                                        : `Qty added:  ${getProductQuantity(article._id) || 0}`}
                                                </div>
                                                {/* {getProductQuantity(article._id) >= (article.qty ?? 0) && (article.qty ?? 0) > 0 && (
                                        <div style={{ color: '#e4572e', fontSize: '0.65em', fontWeight: 700, marginTop: 8 }}>
                                            {i18n?.language === 'hi' ? 'अधिकतम मात्रा पूरी हो चुकी है।' : 'Maximum quantity reached'}
                                        </div>
                                    )} */}
                                            </div>

                                            {/* optional small remove/edit return on top (shows current qty) */}

                                        </div>
                                    )}

                                    {/* Show out-of-stock message when qty finished */}

                                </div>
                            </div>
                        </div>
                    ))}
                <div className="productpage-footer productpage-footer-v2" style={{padding:'0em'}}>
                    <h3 className='product-desc-heading'>{t('Description')}</h3>
                    <p className='product-desc'>{getLocalized(product?.description, product?.descriptionHindi)}</p>
                    <div className="productpage-section">
                        <h2 className="productpage-section-title">{t('Top Products')}</h2>
                        <ProductListing2
                            loading={isHomeLoading}
                            data={homeTemplateData?.data?.SmallSlider}
                        />

                        <h2 className="productpage-section-title">{t('Other Products')}</h2>
                        <ProductListingLandscape

                        />


                        {homeTemplateData?.data?.sliders?.[1] && (
                            <div style={{ marginTop: '1.5em', textAlign: 'center' }}>
                                <img style={{ aspectRatio: isSmallScreen ? '16/7' : '4/1', width: '100%', objectFit: 'contain' }} src='https://res.cloudinary.com/dy6k69ynu/image/upload/v1762270953/%22factoryseDukan%22/gnhf4cykcuuatgsz6mua.jpg' />
                            </div>
                        )}

                    </div>
                </div>
            </div>

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