import React, { useEffect, useRef, useState, useCallback } from 'react';
import './indexLandscape.css';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAddRemoveProductHook } from '../../utility/hooks/addRemovProductHook';
import AddProductToCartModel from '../../utility/Models/AddProductToCartModel';
import { useSelector } from 'react-redux';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useListProductsApiPaginatedQQuery } from '../../../redux/Apis/ProductApi';

const ProductListingLandscape = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { isProductInCart } = useAddRemoveProductHook();
    const cartProducts = useSelector(state => state.cart.cartState.products);

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const LIMIT = 10;
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const { data: apiData, isLoading: apiLoading } = useListProductsApiPaginatedQQuery({ page, limit: LIMIT });

    const [openCartModel, setOpenCartModel] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const containerRef = useRef(null);
    const ticking = useRef(false);

    const skeletonArray = Array.from({ length: 4 });


    const optimizeCloudinary = (url) => {
        if (!url || !url.includes('cloudinary.com')) return url;
        return url.replace(
            '/upload/',
            '/upload/w_150,c_limit,f_auto,q_auto:eco/'
        );
    };

    useEffect(() => {
        setLoadingMore(true);
    }, [page]);

    useEffect(() => {
        if (apiData && apiData.data) {
            if (page === 1) {
                setProducts(apiData.data || []);
            } else {
                setProducts(prev => [...prev, ...(apiData.data || [])]);
            }
            setHasMore((apiData.data?.length || 0) === LIMIT);
        }
        setLoadingMore(false);
    }, [apiData, page]);

    // horizontal scroll handler to load next page
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onScroll = () => {
            if (ticking.current) return;
            ticking.current = true;
            requestAnimationFrame(() => {
                const scrollLeft = el.scrollLeft;
                const clientWidth = el.clientWidth;
                const scrollWidth = el.scrollWidth;
                // when near end horizontally
                if (scrollLeft + clientWidth >= scrollWidth - 200 && hasMore && !loadingMore && !apiLoading) {
                    setLoadingMore(true);
                    setPage(prev => prev + 1);
                }
                ticking.current = false;
            });
        };

        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, [hasMore, loadingMore, apiLoading]);

    const handleNavigate = (product) => {
        navigate(`/product/${product._id}`, { state: { product } });
    };

    const getLocalized = (en, hi) => (i18n.language === 'hi' && hi ? hi : en);

    return (
        <div style={{ marginTop: 24, marginBottom: 24 }}>
            <div className="product-listing-horizontal" ref={containerRef} aria-label="horizontal product list">
                {(apiLoading && page === 1) ? (
                    skeletonArray.map((_, idx) => (
                        <div key={idx} className="product-card product-card-horizontal">
                            <Skeleton variant="rectangular" width="100%" height={120} className="product-image" style={{ borderRadius: 12 }} />
                            <div className="product-details">
                                <Skeleton variant="text" width="70%" height={24} className="product-title" />
                                <Skeleton variant="text" width="90%" height={18} className="product-desc-home" />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                    <Skeleton variant="text" width={60} height={20} />
                                    <Skeleton variant="rectangular" width={60} height={28} style={{ borderRadius: 6 }} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    products.map((product) => (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNavigate(product)
                            }}
                            key={product._id || product.id}
                            className="product-card product-card-horizontal"
                            style={{ position: 'relative' }}
                        >
                            <div className="productImageContainer" onClick={() => handleNavigate(product)} role="button" tabIndex={0}>
                                <img
                                    alt={getLocalized(product.name, product.nameHindi)}
                                    className="product-image"
                                    src={optimizeCloudinary(Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.logoImage || product.image || '')}
                                />
                            </div>

                            <div className="product-details">
                                <h3 className="product-title">{getLocalized(product.name, product.nameHindi)}</h3>
                                <p className="product-desc-home">
                                    {(() => {
                                        const desc = getLocalized(product.description, product.descriptionHindi) || '';
                                        const words = desc.split(' ');
                                        return words.length > 8 ? words.slice(0, 8).join(' ') + '...' : desc;
                                    })()}
                                </p>

                                <div className="product-action-row">
                                    <p className="product-price">
                                        {product?.minPrice == product?.maxPrice
                                            ? `₹${product?.minPrice ? product?.minPrice : "--"}`
                                            : `₹${product?.minPrice}-₹${product?.maxPrice}`}
                                    </p>
                                    <div className="product-qty">
                                        {isProductInCart(product._id || product.id) == 0 ? (
                                            <button className="buy-now-btn"


                                            // onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); setOpenCartModel(true); }}

                                            >
                                                {t('Buy Now')}
                                            </button>
                                        ) : (
                                            <button className="edit-now-btn"
                                            // onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); setOpenCartModel(true); }}

                                            >
                                                {t('Change Quantity')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {isProductInCart(product._id || product.id) ? (
                                <div className="product-listing1-cart-indicator" style={{ right: 8 }}>
                                    <CheckCircleIcon fontSize="small" />
                                    <span style={{ marginLeft: 4, fontSize: '0.75em', fontWeight: 500 }}>
                                        {i18n.language === 'hi' ? 'कार्ट में जोड़ा गया' : 'Added to cart'}
                                    </span>
                                </div>
                            ) : null}
                        </div>
                    ))
                )}

                {/* loadingMore skeleton appended at end */}
                {loadingMore && page > 1 && (
                    skeletonArray.map((_, idx) => (
                        <div key={`s-${idx}`} className="product-card product-card-horizontal">
                            <Skeleton variant="rectangular" width="100%" height={120} className="product-image" style={{ borderRadius: 12 }} />
                            <div className="product-details">
                                <Skeleton variant="text" width="70%" height={24} className="product-title" />
                                <Skeleton variant="text" width="90%" height={18} className="product-desc-home" />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                    <Skeleton variant="text" width={60} height={20} />
                                    <Skeleton variant="rectangular" width={60} height={28} style={{ borderRadius: 6 }} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <AddProductToCartModel
                open={openCartModel}
                onClose={() => setOpenCartModel(false)}
                product={selectedProduct}
            />
        </div>
    );
};

export default ProductListingLandscape;