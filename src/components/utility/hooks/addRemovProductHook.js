import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { addProductCart, removeProductCart } from "../../../redux/Slices/cartSlice";

export const useAddRemoveProductHook = () => {

  const cartProducts = useSelector((state) => state.cart.cartState.products);

  const dispatch = useDispatch();
  const getProductQuantity = (articleId) => {
    for (const product of cartProducts) {
      const article = (product.articles || []).find(a => a._id === articleId);
      if (article) {
        if (article.orderQty === undefined) {
          return 0; // If orderQty is not defined, return 0
        } else {
          return article.orderQty || 0;
        }

      }
    }
    return 0;
  };

  const isProductInCart = (productId) => {
  return cartProducts.some(product => product._id === productId);
};


  const handleAddToCart = (payload) => {
    dispatch(addProductCart(payload));
  }

  const removeProductFromCart = (product) => {
    dispatch(removeProductCart(product));
  };


  // Only return state and handlers, NOT JSX!
  return {

    getProductQuantity,
    handleAddToCart,
    removeProductFromCart,
    isProductInCart
  };
}