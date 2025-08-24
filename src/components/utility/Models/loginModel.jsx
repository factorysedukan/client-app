import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useGetCustomerByMobileMutation } from '../../../redux/Apis/CustomerApi';
import { setUserData } from '../../../redux/Slices/loginSlice';
import './loginModel.css';

const LoginModel = ({ open, onClose }) => {
  const [mobile, setMobile] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');
  const [trigger, setTrigger] = useState(false);
  const [localApiError, setLocalApiError] = useState('');
  const dispatch = useDispatch();

  const [getCustomerData, { data, isLoading, error: apiError, reset }] = useGetCustomerByMobileMutation();

  React.useEffect(() => {
    if (data && data.customer) {
      dispatch(setUserData({
        name: data.customer.name,
        phone: data.customer.phone,
        address: data.customer.address,
        state: data.customer.state,
        city: data.customer.city,
        pincode: data.customer.pincode,
      }));
      setMobile('');
      setTouched(false);
      setError('');
      setTrigger(false);
      setLocalApiError('');
      if (onClose) onClose();
      window.location.reload();
    } else if (trigger && !isLoading && !data && !apiError) {
      setError('Customer not found');
    }
    // eslint-disable-next-line
  }, [data, dispatch, onClose, trigger, isLoading, apiError]);

  React.useEffect(() => {
    if (apiError) {
      setLocalApiError(apiError?.data?.message || apiError?.message || 'Something went wrong');
    } else {
      setLocalApiError('');
    }
  }, [apiError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!/^\d{10}$/.test(mobile)) {
      setError('Enter valid 10 digit mobile number');
      return;
    }
    setError('');
    setTrigger(true);
    getCustomerData(mobile);
  };

  const handleClose = () => {
    setMobile('');
    setTouched(false);
    setError('');
    setTrigger(false);
    setLocalApiError('');
    if (typeof reset === 'function') reset();
    if (onClose) onClose();
  };

  if (!open) return null;

  return (
    <div className="login-modal-backdrop">
      <div className="login-modal">
        <button className="login-modal-close" onClick={handleClose}>×</button>
        <h2 style={{ marginBottom: 16 }}>Login</h2>
        <form onSubmit={handleSubmit} className="login-modal-form">
          <label>
            Mobile Number*
            <input
              type="tel"
              value={mobile}
              onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
              maxLength={10}
              onBlur={() => setTouched(true)}
              autoFocus
            />
          </label>
          {(touched && !/^\d{10}$/.test(mobile)) && (
            <span className="login-modal-error">Enter valid 10 digit mobile number</span>
          )}
          {(error || localApiError) && (
            <span className="login-modal-error">{error || localApiError}</span>
          )}
          <button
            type="submit"
            className="login-modal-btn"
            disabled={isLoading}
            style={{ marginTop: 18 }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModel;