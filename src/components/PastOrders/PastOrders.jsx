import React, { use, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetCustomerByMobileMutation } from '../../redux/Apis/CustomerApi';
import { Button, Accordion, AccordionSummary, AccordionDetails, Skeleton, Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { clearUserData } from '../../redux/Slices/loginSlice';
import LoginModel from '../utility/Models/loginModel';
import { useGetProductByIDMutation } from '../../redux/Apis/ProductApi';

const PastOrders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const customer = useSelector(state => state.login?.customer);
  const mobile = customer?.phone;
  const [expanded, setExpanded] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Fetch customer data and orders by mobile
  const [getCustomerData,{ data, isLoading, error }] = useGetCustomerByMobileMutation();

  useEffect(() => {
    if (error) {
      dispatch(clearUserData());
    }
  }, [error, dispatch]);

  useEffect(() => {
    getCustomerData(mobile);
  },[mobile])

  if (!customer || !mobile || error) {
    return (
      <>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <div style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: 16 }}>
            {t('Please login to view your orders')}
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowLogin(true)}
            style={{ background: '#e4572e', color: '#fff', fontWeight: 700, borderRadius: 12, padding: '10px 32px' }}
          >
            {t('Login')}
          </Button>
        </div>
        <LoginModel open={showLogin} onClose={() => setShowLogin(false)} />
      </>
    );
  }

  if (isLoading) {
    // Skeleton loader for orders list
    return (
      <div className="orderpage-bg" style={{ minHeight: '60vh', padding: '24px 0' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 700, marginBottom: 24 }}>{t('Your Orders')}</h2>
        {[...Array(2)].map((_, idx) => (
          <Accordion key={idx} expanded={false} style={{ margin: '12px 0', borderRadius: 14 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{ background: '#fff7f3', borderRadius: 14, minHeight: 56 }}
            >
              <div style={{ width: '100%' }}>
                <Skeleton variant="text" width={180} height={28} />
                <Skeleton variant="text" width={120} height={20} />
              </div>
            </AccordionSummary>
          </Accordion>
        ))}
      </div>
    );
  }
  console.log('data', data?.data?.orders);  
  // sort orders by createdAt descending (most recent first)
  const orders = (data?.data?.orders || []).slice().sort((a, b) => {
    const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });

  console.log('aa',orders)

  return (
    <div className="orderpage-bg" style={{ minHeight: '60vh', padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700 }}>{t('Your Orders')}</h2>
        <Button
          variant="outlined"
          color="secondary"
          style={{ borderRadius: 10, fontWeight: 600, borderColor: '#e4572e', color: '#e4572e' }}
          onClick={() => setShowLogin(true)}
        >
          {t('Change Account')}
        </Button>
      </div>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#e4572e', fontWeight: 600 }}>{t('No orders found')}</div>
      ) : (
        orders.map((order, idx) => (
          <OrderAccordion
            key={order._id}
            order={order}
            expanded={expandedOrderId === order._id}
            onChange={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
          />
        ))
     
      )}
      <LoginModel open={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

// Child component to fetch and show products/articles for an order
const OrderAccordion = ({ order, expanded, onChange }) => {
  console.log('order', order);
  const { t } = useTranslation();
  // map status -> chip styles and label
  const getStatusProps = (status) => {
    const s = (status || '').toString().toLowerCase();
    switch (s) {
      case 'placed':
        return { label: 'Placed', bg: '#1e88e5', color: '#fff' };
      case 'paymentdone':
      case 'payment_done':
        return { label: 'Payment Done', bg: '#10b981', color: '#fff' };
      case 'packed':
        return { label: 'Packed', bg: '#8b5cf6', color: '#fff' };
      case 'instransit':
      case 'intransit':
      case 'in_transit':
        return { label:'In Transit', bg: '#f59e0b', color: '#000' };
      case 'completed':
        return { label: 'Completed', bg: '#22c55e', color: '#fff' };
      case 'cancelled':
      case 'canceled':
        return { label:'Cancelled', bg: '#ef4444', color: '#fff' };
      default:
        return { label: status || '', bg: '#ddd', color: '#000' };
    }
  };
  const products = order?.products || [];
  const [getProductByID] = useGetProductByIDMutation();
  const [productQueries, setProductQueries] = useState({}); // { [productId]: productData }
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!expanded) return;
      setLoadingProducts(true);
      for (const prod of products) {
        if (!productQueries[prod._id]) {
          try {
            const res = await getProductByID(prod._id).unwrap();
            setProductQueries(prev => ({ ...prev, [prod._id]: res?.data }));
          } catch (e) {
            setProductQueries(prev => ({ ...prev, [prod._id]: null }));
          }
        }
      }
      setLoadingProducts(false);
    };
    fetchProducts();
    // eslint-disable-next-line
  }, [expanded, products]);

  return (
    <Accordion
      expanded={expanded}
      onChange={onChange}
      style={{ margin: '12px 0', borderRadius: 14, boxShadow: '0 2px 8px rgba(228,87,46,0.07)' }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${order._id}-content`}
        id={`panel-${order._id}-header`}
        style={{ background: '#fff7f3', borderRadius: 14, minHeight: 56 }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 700, fontSize: '1.1em', color: '#e4572e' }}>
              {t('Order')} #{order._id.slice(-6).toUpperCase()}
            </span>
            <span style={{ fontSize: '0.98em', color: '#555', marginTop: 4 }}>
              {t('Placed on')}: {new Date(order.createdAt).toLocaleString('en-IN')}
            </span>
            <span style={{ fontWeight: 600, color: '#22c55e', marginTop: 4 }}>
              {t('Total')}: ₹{order?.orderTotal.toLocaleString('en-IN')}
            </span>
          </div>
          {/* status chip */}
          {order?.status && (() => {
            const props = getStatusProps(order.status);
            return (
              <Chip
                label={props.label}
                sx={{ backgroundColor: props.bg, color: props.color, fontWeight: 700, borderRadius: 2, textTransform: 'capitalize' }}
                size="small"
              />
            );
          })()}
        </div>
      </AccordionSummary>
      <AccordionDetails style={{ background: '#fff', borderRadius: 14 }}>
        {loadingProducts ? (
          // Skeleton loader for articles/products
          <>
            {[...Array(1)].map((_, idx) => (
              <div key={idx} className="orderpage-product-card animate-pop" style={{ marginBottom: 12 }}>
                <div className="orderpage-product-header">
                  <Skeleton variant="rectangular" width={60} height={60} className="orderpage-product-img" />
                  <div>
                    <Skeleton variant="text" width={120} height={24} />
                    <Skeleton variant="text" width={80} height={18} />
                  </div>
                </div>
                <div className="orderpage-articles-list">
                  {[...Array(2)].map((_, aidx) => (
                    <div key={aidx} className="orderpage-article-row animate-fadein">
                      <div className="orderpage-article-img-col">
                        <Skeleton variant="rectangular" width={40} height={40} className="orderpage-article-img" />
                      </div>
                      <div className="orderpage-article-info">
                        <Skeleton variant="text" width={80} height={18} />
                        <Skeleton variant="text" width={60} height={16} />
                        <Skeleton variant="text" width={60} height={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          products.map(prod => {
            const productData = productQueries[prod._id];
            const orderArticles = prod.articles || [];
            let articlesToShow = [];
            if (productData && productData.articles) {
              articlesToShow = productData.articles.filter(a =>
                orderArticles.some(oa => oa._id === a._id)
              ).map(a => ({
                ...a,
                orderQty: orderArticles.find(oa => oa._id === a._id)?.orderQty || 0
              }));
            } else {
              articlesToShow = orderArticles;
            }
            return (
              <div key={prod._id} className="orderpage-product-card animate-pop" style={{ marginBottom: 12 }}>
                <div className="orderpage-product-header">
                  <img
                    src={productData?.logoImage || productData?.image || null}
                    alt={productData?.name || ''}
                    className="orderpage-product-img"
                  />
                  <div>
                    <h2 className="orderpage-product-title">{productData?.name || ''}</h2>
                    <p className="orderpage-product-desc">{productData?.description || ''}</p>
                  </div>
                </div>
                <div className="orderpage-articles-list">
                  {articlesToShow.map(article => (
                    <div key={article._id} className="orderpage-article-row animate-fadein">
                      <div className="orderpage-article-img-col">
                        <img
                          src={article.image || null}
                          alt={article.name}
                          className="orderpage-article-img"
                        />
                      </div>
                      <div className="orderpage-article-info">
                        <span className="orderpage-article-name">{article.name}</span>
                        <span className="orderpage-article-size">{t('Size')}: {Array.isArray(article.sizes) ? article.sizes.join(', ') : article.sizes}</span>
                        <span className="orderpage-article-qty">{t('Quantity')}: {article.orderQty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default PastOrders;