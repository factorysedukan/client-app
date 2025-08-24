import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Skeleton from '@mui/material/Skeleton';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import './OrderPageStyles.css';
import ConfirmOrderModal from '../Cart/ConfirmOrderModal';

const OrderPage = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartProducts = useSelector(state => state.cart.cartState.products);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Simulate loading for demo
    React.useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(timer);
    }, []);

    const formatPrice = (price) => price.toLocaleString('en-IN');

    const totalPrice = cartProducts.reduce((sum, product) => {
        return (
            sum +
            (product.articles || []).reduce(
                (aSum, article) => aSum + (article.sellingPrice || 0) * (article.orderQty || 0),
                0
            )
        );
    }, 0);

    const handleQtyChange = (productId, articleId, delta, minUnits = 1) => {
        const product = cartProducts.find(p => p._id === productId);
        const article = product.articles.find(a => a._id === articleId);
        let orderQty = article.orderQty || minUnits;
        orderQty += delta * minUnits;
        if (orderQty <= 0) {
            dispatch({
                type: 'cart/removeProductCart',
                payload: { productId, articleId, orderQty: minUnits }
            });
        } else {
            dispatch({
                type: 'cart/addProductCart',
                payload: { product, article: { ...article, orderQty }, orderQty }
            });
        }
    };

    // Minimum order value
    const MIN_ORDER_VALUE = 2000;

    return (
        <div className="orderpage-bg">
            <div className="orderpage-heading-row">
                <div style={{display: 'flex', alignItems: 'center',justifyContent:'center'}}>
                    <IconButton
                        className="orderpage-back-btn"
                        onClick={() => navigate(-1)}
                        size="small"
                        style={{ marginRight: 8, fontSize: '1.1rem', padding: 4 }}
                    >
                        <ArrowBackIosNewIcon fontSize="small" />
                    </IconButton>
                    <h1 className="orderpage-heading">{t('Cart')}</h1>
                </div>

                <span className="orderpage-totalprice-top">
                    {t('Total')}: <span className="orderpage-totalprice-value">₹{formatPrice(totalPrice)}</span>
                </span>
            </div>
            {loading ? (
                <div className="orderpage-list">
                    {[...Array(2)].map((_, idx) => (
                        <div key={idx} className="orderpage-product-card">
                            <Skeleton variant="rectangular" width={60} height={60} className="orderpage-product-img" />
                            <div className="orderpage-product-details">
                                <Skeleton variant="text" width={120} height={24} />
                                <Skeleton variant="text" width={80} height={18} />
                                <Skeleton variant="rectangular" width={80} height={28} style={{ borderRadius: 8, marginTop: 8 }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="orderpage-list">
                        {cartProducts.length === 0 ? (
                            <div className="orderpage-empty">{t('No products in cart')}</div>
                        ) : (
                            cartProducts.map(product => (
                                <div key={product._id} className="orderpage-product-card animate-pop">
                                    <div className="orderpage-product-header">
                                        <img
                                            src={product.logoImage || product.image || ''}
                                            alt={i18n.language === 'hi' && product.nameHindi ? product.nameHindi : product.name}
                                            className="orderpage-product-img"
                                        />
                                        <div>
                                            <h2 className="orderpage-product-title">
                                                {i18n.language === 'hi' && product.nameHindi ? product.nameHindi : product.name}
                                            </h2>
                                            <p className="orderpage-product-desc">{product.description || ''}</p>
                                        </div>
                                    </div>
                                    <div className="orderpage-articles-list">
                                        {product.articles.map(article => (
                                            <div key={article._id} className="orderpage-article-row animate-fadein">
                                                <div className="orderpage-article-img-col">
                                                    <img
                                                        src={article.image || ''}
                                                        alt={i18n.language === 'hi' && article.nameHindi ? article.nameHindi : article.name}
                                                        className="orderpage-article-img"
                                                    />
                                                </div>
                                                <div className="orderpage-article-info">
                                                    <span className="orderpage-article-name">
                                                        {i18n.language === 'hi' && article.nameHindi ? article.nameHindi : article.name}
                                                    </span>
                                                    <span className="orderpage-article-size">{t('Size')}: {Array.isArray(article.sizes) ? article.sizes.join(', ') : article.sizes}</span>
                                                    <span className="orderpage-article-price">{t('Price')}: ₹{article.sellingPrice}</span>
                                                    <span className="orderpage-article-mrp">{t('MRP')}: ₹{article.mrp}</span>
                                                    <span className="orderpage-article-minset">{t('Min Set size')}: {article.minUnits}</span>
                                                </div>
                                                <div className="orderpage-qty-controls">
                                                    <button
                                                        className="orderpage-qty-btn"
                                                        onClick={() => handleQtyChange(product._id, article._id, -1, article.minUnits)}
                                                        disabled={article.orderQty <= 0}
                                                    >
                                                        <RemoveIcon fontSize="small" />
                                                    </button>
                                                    <span className="orderpage-qty-value">{article.orderQty}</span>
                                                    <button
                                                        className="orderpage-qty-btn"
                                                        onClick={() => handleQtyChange(product._id, article._id, 1, article.minUnits)}
                                                    >
                                                        <AddIcon fontSize="small" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="orderpage-totalprice-bottom animate-pop">
                        {t('Total')}: <span className="orderpage-totalprice-value">₹{formatPrice(totalPrice)}</span>
                    </div>
                </>
            )}
            <div>
                <button
                    style={{
                        margin: '16px auto 0 auto',
                        display: 'block',
                        background: totalPrice >= MIN_ORDER_VALUE ? '#e4572e' : '#ccc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 12,
                        padding: '12px 32px',
                        fontWeight: 700,
                        fontSize: '1.1em',
                        cursor: totalPrice >= MIN_ORDER_VALUE ? 'pointer' : 'not-allowed'
                    }}
                    onClick={() => {
                        if (totalPrice >= MIN_ORDER_VALUE) setShowModal(true);
                    }}
                    disabled={totalPrice < MIN_ORDER_VALUE}
                >
                    {t('CONFIRM_ORDER')}
                </button>
                {totalPrice < MIN_ORDER_VALUE && (
                    <div style={{
                        color: '#e4572e',
                        fontWeight: 600,
                        textAlign: 'center',
                        marginTop: 8,
                        fontSize: '1.05em'
                    }}>
                        {i18n.language === 'hi'
                            ? "ऑर्डर प्लेस करने के लिए कम से कम 2000 का माल लें"
                            : "To place an order, minimum order value should be ₹2000"}
                    </div>
                )}
                <ConfirmOrderModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={(fields) => {
                        // handle order confirm logic here
                        // setShowModal(false);
                    }}
                    total={totalPrice}
                />
            </div>
        </div>
    );
};

export default OrderPage;