import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, IconButton, Button, Divider, Autocomplete, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import './addProductToCartStyles.css';
import i18n from '../../../i18n';
import { useDispatch, useSelector } from 'react-redux';
import { addProductCart, removeProductCart } from '../../../redux/Slices/cartSlice';

const AddProductToCartModel = ({ open, onClose, product, onAddToCart, onPlaceOrder }) => {
    const dispatch = useDispatch();
    const cartProducts = useSelector(state => state.cart.cartState.products);

    // Find if product is already in cart
    const cartProduct = cartProducts.find(p => p._id === product?._id);

    // Use cart data if present, else use defaults
    const [selectedSizes, setSelectedSizes] = useState(cartProduct?.sizes || []);
    const [selectedColors, setSelectedColors] = useState(cartProduct?.selectedColors || []);
    const [quantity, setQuantity] = useState(cartProduct?.quantity || product?.minUnits || 1);

    const { t } = useTranslation();
    const getLocalized = (en, hi) => i18n.language === 'hi' && hi ? hi : en;

    // Reset all form elements when modal closes
    const handleClose = () => {
        setSelectedSizes(cartProduct?.sizes || []);
        setSelectedColors(cartProduct?.selectedColors || []);
        setQuantity(cartProduct?.quantity || product?.minUnits || 1);
        setTimeout(() => {
            if (onClose) onClose();
        }, 100); // Delay to ensure state reset before closing
        
    };

    useEffect(() => {
        // When product changes, reset form to cart data if present
        setSelectedSizes(cartProduct?.sizes || []);
        setSelectedColors(cartProduct?.selectedColors || []);
        setQuantity(cartProduct?.quantity || product?.minUnits || 1);
    }, [product, cartProduct]);

    // Handle quantity change, only allow multiples of minUnits
    const handleQuantityChange = (delta) => {
        const minUnits = product?.minUnits || 1;
        let newQty = quantity + delta * minUnits;
        if (newQty < minUnits) newQty = minUnits;
        setQuantity(newQty);
    };

    const handleAddToCart = () => {
        // if (onAddToCart) onAddToCart({ product, sizes: selectedSizes, colors: selectedColors, quantity });
        dispatch(addProductCart({
            _id:product._id,
            sizes: selectedSizes,
            selectedColors:selectedColors,
            quantity: quantity,
        }))
        handleClose();
    };

    const handlePlaceOrder = () => {
        if (onPlaceOrder) onPlaceOrder({ product, sizes: selectedSizes, colors: selectedColors, quantity });
        handleClose();
    };

    const handleRemoveFromCart = () => {
        dispatch(removeProductCart({ _id: product._id }));
        // Reset fields to product defaults after removal
        setSelectedSizes([]);
        setSelectedColors([]);
        setQuantity(product?.minUnits || 1);
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box className="add-product-modal">
                <div className="add-product-header">
                    <IconButton
                        aria-label={t('Close')}
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 12, top: 12 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1em', marginBottom: '0.5em' }}>
                        {product?.logoImage && (
                            <img
                                src={product.logoImage}
                                alt={getLocalized(product?.name, product?.nameHindi)}
                                style={{
                                    width: 48,
                                    aspectRatio: '1 / 1',
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                                }}
                            />
                        )}
                        <Typography variant="h6" sx={{ mb: 0.5 }}>
                            {getLocalized(product?.name, product?.nameHindi)}
                        </Typography>
                    </div>
                    <Divider />
                </div>
                <div className="add-product-body">
                    <div style={{ marginBottom: '1em' }}>
                        {product?.description && (
                            <Typography variant="body2" color="text.secondary">
                                {getLocalized(product?.description, product?.descriptionHindi)}
                            </Typography>
                        )}
                    </div>
                    <div className="add-product-section">
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>{t('Select Sizes')}</Typography>
                        <Autocomplete
                            multiple
                            options={product?.sizes || []}
                            value={selectedSizes}
                            onChange={(_, value) => setSelectedSizes(value)}
                            renderInput={(params) => <TextField {...params} label={t('Sizes')} />}
                            sx={{ mb: 2 }}
                        />
                    </div>
                    <div className="add-product-section">
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>{t('Select Colors')}</Typography>
                        <Autocomplete
                            multiple
                            options={product?.colors || []}
                            getOptionLabel={(option) => option.name || option.code}
                            value={selectedColors}
                            onChange={(_, value) => setSelectedColors(value)}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            width: 18,
                                            height: 18,
                                            background: option.code,
                                            borderRadius: '50%',
                                            marginRight: 8,
                                            border: '1px solid #e5e7eb',
                                            verticalAlign: 'middle'
                                        }}
                                    ></span>
                                    {option.name || option.code}
                                </li>
                            )}
                            renderInput={(params) => <TextField {...params} label={t('Colors')} />}
                            sx={{ mb: 2 }}
                        />
                    </div>
                    <div className="add-product-section">
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>{t('Quantity')}</Typography>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Button
                                variant="outlined"
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= (product?.minUnits || 1)}
                                sx={{ minWidth: 36, padding: 0 }}
                            >-</Button>
                            <Typography variant="body1" sx={{ minWidth: 40, textAlign: 'center' }}>
                                {quantity}
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={() => handleQuantityChange(1)}
                                sx={{ minWidth: 36, padding: 0 }}
                            >+</Button>
                            <Typography variant="caption" color="text.secondary">
                                {t('Min Set size')}: {product?.minUnits || 1}
                            </Typography>
                            {/* <Button
                                variant="text"
                                color="error"
                                onClick={handleRemoveFromCart}
                                sx={{ marginLeft: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                                <DeleteIcon fontSize="small" />
                                {t('Remove')}
                            </Button> */}
                        </div>
                    </div>
                    <div className="add-product-section">
                         <Button
                                variant="outlined"
                                color="error"
                                onClick={handleRemoveFromCart}
                                sx={{ display: 'flex', alignItems: 'center', gap: 1 , marginTop:'1em'}}
                            >
                                <DeleteIcon fontSize="small" />
                                {t('Remove')}
                            </Button>
                        </div>
                </div>
                <div className="add-product-footer">
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePlaceOrder}
                            fullWidth
                            disabled={selectedSizes.length === 0 || selectedColors.length === 0}
                        >
                            {t('Place Order')}
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleAddToCart}
                            fullWidth
                            disabled={selectedSizes.length === 0 || selectedColors.length === 0}
                        >
                            {t('Add to Cart')}
                        </Button>
                    </Box>
                </div>
            </Box>
        </Modal>
    );
};

export default AddProductToCartModel;