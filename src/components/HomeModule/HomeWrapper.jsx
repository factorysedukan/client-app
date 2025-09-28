import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header/Header'
import FooterNavigation from './FooterNavigation/FooterNavigation'
import { useTranslation } from 'react-i18next';

const HomeWrapper = () => {
  const location = useLocation();
  const hideHeader = location.pathname.includes('search');
  console.log('hideHeader:', hideHeader);
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div style={{width: '100vw', height: '100dvh', overflow:'hidden',display:'flex',flexDirection:'column',justifyContent:'space-between', position: 'relative'}}>
      {!hideHeader && <Header />}
      
        <Outlet />
        {/* Floating Language Switcher */}
        <div style={{ position: 'relative', flex: 1 }}>
        <div
          style={{
            position: 'fixed',
            top: 60,
            right: 1,
            zIndex: 9999,
            background: 'rgba(255,255,255,0.7)',
            borderRadius: 18,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            padding: '2px 7px',
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
              // padding: '4px 12px',
               padding: '4px 12px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.5em',
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
              fontSize: '0.5em',
              outline: 'none',
              transition: 'background 0.2s'
            }}
          >
            हिंदी
          </button>
        </div>
      </div>
      <FooterNavigation/>
    </div>
  )
}

export default HomeWrapper
