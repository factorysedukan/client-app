import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header/Header'
import FooterNavigation from './FooterNavigation/FooterNavigation'
import { useTranslation } from 'react-i18next';
import { useOfferNotificationHook } from '../../services/helpers/useOfferNotificatinHook';
import { useSelector } from 'react-redux';
import { useOfferConfettiNotification } from '../../services/helpers/useOfferConfettiNotification';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CallIcon from '@mui/icons-material/Call';

const HomeWrapper = () => {
  const location = useLocation();
  const hideHeader = location.pathname.includes('search');
  const { i18n } = useTranslation();
  const { NotificationsJSX } = useOfferNotificationHook();


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
                  padding: '4px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backdropFilter: 'blur(4px)',
                  border: '1px solid #eee',
                  fontWeight: 600,
                  fontSize: '0.7em',
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
                  padding: '4px 7px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backdropFilter: 'blur(4px)',
                  border: '1px solid #eee',
                  fontWeight: 600,
                  fontSize: '0.7em',
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

      {/* Floating buttons (bottom-left) */}
      <div
        style={{
          position: 'fixed',
          bottom: '40%',
          right: 16,
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          alignItems: 'center',
          textDecoration: 'none',
          pointerEvents: 'auto'
        }}
      >
        {/* Helpline label */}
        <div
          style={{
            background: '#fff',
            padding: '6px 10px',
            borderRadius: 16,
            boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
            fontWeight: 700,
            color: '#222',
            textAlign: 'center',
            minWidth: 'fit-content'
          }}
        >
          <div style={{ fontSize: '0.7em' }}>Helpline</div>
          <div style={{ color: '#e4572e', fontSize: '0.5em' }}>+91 8130224332</div>
        </div>
        
        <div style={{width:'100%',display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'0.5em'}}>
             {/* Call button */}
        <a
          href="tel:+918130224332"
          title="Call Helpline"
          style={{ textDecoration: 'none' }}
          aria-label="Call Helpline"
        >
          <div
            style={{
              background: '#1e88e5',
              width: 26,
              height: 26,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(30,136,229,0.24)',
              cursor: 'pointer'
            }}
          >
            <CallIcon style={{ color: '#fff', fontSize: 18 }} />
          </div>
        </a>

        {/* WhatsApp chat button */}
        <a
          href="https://wa.me/918130224332"
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp"
          aria-label="Chat on WhatsApp"
          style={{ textDecoration: 'none' }}
        >
          <div
            style={{
              background: '#25D366',
              width: 26,
              height: 26,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(37,211,102,0.24)',
              cursor: 'pointer'
            }}
          >
            <WhatsAppIcon style={{ color: '#fff', fontSize: 18 }} />
          </div>
        </a>
        </div>
     
      </div>

  
      <FooterNavigation />
      {<NotificationsJSX />}
    </div>
  )
}

export default HomeWrapper
