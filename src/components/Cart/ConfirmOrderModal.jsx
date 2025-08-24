import React, { useState, useEffect } from 'react';
import './ConfirmOrderModal.css';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateOrderApiMutation } from '../../redux/Apis/OrdersApi';
import { setUserData } from '../../redux/Slices/loginSlice';
import { clearCart } from '../../redux/Slices/cartSlice';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const initialFields = {
  name: '',
  phone: '',
};

const ConfirmOrderModal = ({ open, onClose, onConfirm, total }) => {
  const customerData = useSelector(state => state.login.customer);
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { t } = useTranslation();
  const cartProducts = useSelector(state => state.cart.cartState.products);
  const [createOrderApi, { isLoading }] = useCreateOrderApiMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Prefill fields from customer data if available
  useEffect(() => {
    if (customerData) {
      setFields(prev => ({
        ...prev,
        name: customerData.name ?? '',
        phone: customerData.phone ?? '',
      }));
    }
    // Only run when modal opens
    // eslint-disable-next-line
  }, [open]);

  const validate = () => {
    const errs = {};
    if (!fields.name.trim()) errs.name = t('NAME_REQUIRED');
    if (!fields.phone.trim()) errs.phone = t('PHONE_REQUIRED');
    else if (!/^\d{10}$/.test(fields.phone)) errs.phone = t('PHONE_INVALID');
    return errs;
  };

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const payload = {
        products: cartProducts,
        name: fields.name,
        mobile: fields.phone,
      };
      const res = await createOrderApi(payload).unwrap();
      setSuccessMsg(t('ORDER_SUCCESS'));
      setFields(initialFields);
      dispatch(setUserData({
        name: fields.name,
        phone: fields.phone,
      }));
      dispatch(clearCart());
      setOrderPlaced(true);
      if (onConfirm) onConfirm(fields);
    } catch (error) {
      setErrorMsg(
        error?.data?.message ||
        t('ORDER_ERROR')
      );
    }
  };

  if (!open) return null;

  return (
    <div className="confirm-modal-backdrop">
      <div className="confirm-modal">
        <button className="confirm-modal-close" onClick={onClose}>×</button>
        {!orderPlaced ? (
          <>
            <h2>{t('CONFIRM_ORDER')}</h2>
            <form onSubmit={handleSubmit} className="confirm-modal-form">
              <label>
                {t('NAME')}*
                <input name="name" value={fields.name} onChange={handleChange} disabled={isLoading} />
                {errors.name && <span className="confirm-modal-error">{errors.name}</span>}
              </label>
              <label>
                {t('PHONE')}*
                <input name="phone" value={fields.phone} onChange={handleChange} maxLength={10} disabled={isLoading} />
                {errors.phone && <span className="confirm-modal-error">{errors.phone}</span>}
              </label>
              <div className="confirm-modal-total">
                {t('TOTAL')} <span>₹{total}</span>
              </div>
              {errorMsg && <div className="confirm-modal-error" style={{marginTop:8}}>{errorMsg}</div>}
              {successMsg && <div style={{color:'#22c55e',fontWeight:600,marginTop:8}}>{successMsg}</div>}
              <button type="submit" className="confirm-modal-confirm-btn" disabled={isLoading}>
                {isLoading ? t('CONFIRMING') : t('CONFIRM')}
              </button>
            </form>
          </>
        ) : (
          <div className="order-success-content">
            <CheckCircleIcon
              className="order-success-tick"
              style={{
                fontSize: 70,
                color: '#22c55e',
                margin: '0 auto 16px auto',
                display: 'block',
                animation: 'popIn 0.4s cubic-bezier(.23,1.09,.62,1.01)'
              }}
            />
            <h2 style={{ textAlign: 'center', color: '#22c55e', marginBottom: 8 }}>
              {t('Order placed successfully!')}
            </h2>
            <div style={{ textAlign: 'center', color: '#444', fontWeight: 500, marginBottom: 24 }}>
              {t('Thank you for your order.')}
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button
                className="confirm-modal-confirm-btn"
                style={{ background: '#e4572e', minWidth: 120 }}
                onClick={() => {
                  onClose();
                  navigate('/');
                }}
              >
                {t('Shop More')}
              </button>
              <button
                className="confirm-modal-confirm-btn"
                style={{ background: '#22c55e', minWidth: 120 }}
                onClick={() => {
                  onClose();
                  navigate('/pastOrders');
                }}
              >
                {t('Orders List')}
              </button>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ConfirmOrderModal;