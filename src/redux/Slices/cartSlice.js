import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartState: {
    products: [],
    totalCartValue: 0, // <-- Add this line
    name: null,
    phone: null,
    address: null,
    state: null,
    city: null,
    pincode: null,
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProductCart: (state, { payload }) => {
      // payload: { product, article, orderQty }
      const { product, article, orderQty } = payload;
      const prodIdx = state.cartState.products.findIndex(p => p._id === product._id);

      // Attach orderQty to article
      const articleWithQty = { ...article, orderQty: orderQty ?? article.orderQty ?? 1 };

      if (prodIdx !== -1) {
        // Product exists, update or add article
        const existingProduct = state.cartState.products[prodIdx];
        const articles = existingProduct.articles || [];
        const artIdx = articles.findIndex(a => a._id === article._id);

        if (artIdx !== -1) {
          // Update existing article (including orderQty)
          articles[artIdx] = { ...articles[artIdx], ...articleWithQty };
        } else {
          // Add new article with orderQty
          articles.push(articleWithQty);
        }
        existingProduct.articles = articles;
        state.cartState.products[prodIdx] = { ...existingProduct };
      } else {
        // Add new product with this article and orderQty
        state.cartState.products.push({
          ...product,
          articles: [articleWithQty],
        });
      }

      // Calculate totalCartValue after adding product
      state.cartState.totalCartValue = state.cartState.products.reduce((total, prod) => {
        if (!Array.isArray(prod.articles)) return total;
        return (
          total +
          prod.articles.reduce((sum, art) => {
            const qty = art.orderQty ?? 1;
            const price = art.sellingPrice ?? 0;
            return sum + qty * price;
          }, 0)
        );
      }, 0);
    },

    removeProductCart: (state, { payload }) => {
      // payload: { productId, articleId, orderQty }
      const { productId, articleId, orderQty } = payload;
      const prodIdx = state.cartState.products.findIndex(p => p._id === productId);

      if (prodIdx !== -1) {
        let product = state.cartState.products[prodIdx];
        let articles = product.articles || [];
        const artIdx = articles.findIndex(a => a._id === articleId);

        if (artIdx !== -1) {
          // If orderQty is provided and greater than 0, decrease orderQty
          if (typeof orderQty === 'number' && orderQty > 0) {
            const currentQty = articles[artIdx].orderQty ?? 1;
            const newQty = currentQty - orderQty;
            if (newQty > 0) {
              articles[artIdx] = { ...articles[artIdx], orderQty: newQty };
            } else {
              // Remove article if orderQty goes to 0 or below
              articles.splice(artIdx, 1);
            }
          } else {
            // Remove article directly if no orderQty or orderQty <= 0
            articles.splice(artIdx, 1);
          }
        }

        if (articles.length === 0) {
          // Remove product if no articles left
          state.cartState.products.splice(prodIdx, 1);
        } else {
          // Update product with remaining articles
          product.articles = articles;
          state.cartState.products[prodIdx] = { ...product };
        }
      }

      // Calculate totalCartValue after removing product
      state.cartState.totalCartValue = state.cartState.products.reduce((total, prod) => {
        if (!Array.isArray(prod.articles)) return total;
        return (
          total +
          prod.articles.reduce((sum, art) => {
            const qty = art.orderQty ?? 1;
            const price = art.sellingPrice ?? 0;
            return sum + qty * price;
          }, 0)
        );
      }, 0);
    },

    clearCart: (state) => {
      state.cartState.products = [];
      state.cartState.totalCartValue = 0; // <-- Reset on clear
      state.cartState.name = null;
      state.cartState.phone = null;
      state.cartState.address = null;
      state.cartState.state = null;
      state.cartState.city = null;
      state.cartState.pincode = null;
    },

    setUserData: (state, { payload }) => {
      // payload: { name, phone, address, state, city, pincode }
      state.cartState.name = payload.name ?? null;
      state.cartState.phone = payload.phone ?? null;
      state.cartState.address = payload.address ?? null;
      state.cartState.state = payload.state ?? null;
      state.cartState.city = payload.city ?? null;
      state.cartState.pincode = payload.pincode ?? null;
    },
  },
});

export const { addProductCart, removeProductCart, clearCart, setUserData } = cartSlice.actions;
export const getProductsData = (state) => state?.cart?.cartState.products;
export default cartSlice.reducer;
