import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header/Header'
import FooterNavigation from './FooterNavigation/FooterNavigation'
import { useTranslation } from 'react-i18next';
import { useOfferNotificationHook } from '../../services/helpers/useOfferNotificatinHook';
import { useSelector } from 'react-redux';
import { useOfferConfettiNotification } from '../../services/helpers/useOfferConfettiNotification';

const HomeWrapper = () => {
  const location = useLocation();
  const hideHeader = location.pathname.includes('search');
  const { i18n } = useTranslation();
  const { NotificationsJSX } = useOfferNotificationHook();
  const { ConfettiJSX, CouponJSX } = useOfferConfettiNotification();

  // Get totalCartValue from Redux
  const totalCartValue = useSelector(state => state.cart.cartState.totalCartValue);

  // Hide cart value on /cart route
  const hideCartValue = location.pathname.toLowerCase() === '/cart';

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
      {!hideHeader && <Header />}

      <Outlet />

      {/* Floating Language Switcher & Cart Value */}
      <div style={{ position: 'relative', flex: 1 }}>
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 1,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            // border:'2px solid red',
            padding: '0px 16px',
            boxSizing: 'border-box',
            width: '100dvw',
            gap: 12,
          }}
        >
          {/* Cart Value Box */}
          {!hideCartValue && (
            <>
            <div
              style={{
                background: 'rgba(255,255,255,0.7)',
                borderRadius: 18,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backdropFilter: 'blur(4px)',
                border: '1px solid #eee',
                fontWeight: 600,
                fontSize: '1em',
                transition: 'background 0.2s'
              }}
            >
              {i18n.language === 'hi'
                ? <>अभी तक डाला हुआ माल: <span style={{ color: '#e4572e' }}>₹{totalCartValue}</span></>
                : <>Total cart value: <span style={{ color: '#e4572e' }}>₹{totalCartValue}</span></>
              }
            </div>
         
       
          <div
            style={{
              background: 'rgba(255,255,255,0.7)',
              borderRadius: 18,
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              padding: '10px 7px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backdropFilter: 'blur(4px)',
              border: '1px solid #eee',
              fontWeight: 600,
              fontSize: '1em',
              transition: 'background 0.2s'
            }}
          >
            <button
              onClick={() => handleLanguageChange('en')}
              style={{
                background: i18n.language === 'en' ? '#e4572e' : 'transparent',
                color: i18n.language === 'en' ? '#fff' : '#e4572e',
                border: 'none',
                borderRadius: 12,
                padding: '4px 12px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.7em',
                outline: 'none',
                transition: 'background 0.2s'
              }}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              style={{
                background: i18n.language === 'hi' ? '#e4572e' : 'transparent',
                color: i18n.language === 'hi' ? '#fff' : '#e4572e',
                border: 'none',
                borderRadius: 12,
                padding: '4px 12px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.7em',
                outline: 'none',
                transition: 'background 0.2s'
              }}
            >
              हिंदी
            </button>
          </div>
          </>
           )}
          
        </div>

      </div>
      {ConfettiJSX}
      {CouponJSX}
      <FooterNavigation />
      {<NotificationsJSX />}
    </div>
  )
}

export default HomeWrapper
