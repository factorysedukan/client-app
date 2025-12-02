import React from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import './index.css';
import { useTranslation } from 'react-i18next';
import SearchBar from '../SearchBar/SearchBar';

const Header = () => {
    const { t } = useTranslation();
    return (
        <AppBar position="static" color="inherit" elevation={1} className="custom-appbar" style={{ zIndex: 100 }}>
            <Toolbar className="header-toolbar">
                {/* Logo + Tagline */}
                <Box className="logo-container-with-tagline">
                    <div className="logo-container logo-animate">
                        {/* <span className="logo-red">{t('FACTORY')}</span>
                        <span className="logo-green">{t('SE')}</span>
                        <span className="logo-red">{t('DUKAN')}</span> */}
                         <span className="logo-red">{t('Footwear')}</span>
                        <span className="logo-green">{t('Mandi')}</span>
                        {/* <span className="logo-red">{t('DUKAN')}</span> */}
                    </div>
                    <div className="header-tagline">
                        <span>By <span className="tagline-highlight">Shubham Traders</span></span>
                    </div>
                </Box>
                <SearchBar/>
                {/* Cart Icon (if needed) */}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
