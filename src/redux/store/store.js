import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import { rootSlice } from "../RootSlice/RootSlice";
// import { guestApi } from "../Apis/GuestApi";
// import { homePageApi } from "../Apis/HomepageApi";
// import { loginApi } from "../Apis/LoginApi";
// import { profileApi } from "../Apis/ProfileApi";
// import { myListApi } from "../Apis/MyListApi";
// import { categoryPageApi } from "../Apis/CategoryApi";
// import { gamePageApi } from "../Apis/GameApi";
// import { searchApi } from "../Apis/SearchApi";
// import { updateLastPlayApi } from "../Apis/UpdatedLastPlayApi";
// import { postGameScoreApi } from "../Apis/PostScoreApi";
// import { favoriteApi } from "../Apis/FavoriteApi";
// import { jgsNodeApi } from "../Apis/JGSNodeApi";
import storage from "redux-persist/lib/storage";

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { loginApi } from "../Apis/LoginApi";
// import loginViewSlice from "../Slices/loginViewSlice";
// import guestSlice from "../Slices/guestSlice";
// import HeaderSlice from "../Slices/HeaderSlice";
import loginReducer from "../Slices/loginSlice";
// import loginReducer from "../Slices/loginSlice";
import cartReducer from "../Slices/cartSlice";
import { commonFactoryApi } from "../Apis/commonApiSlice";
import { productApi } from "../Apis/ProductApi";
import { categoryApi } from "../Apis/CategoryApi";
import { colorsApi } from "../Apis/ColorsApi";
import { homePageTemplateApi } from "../Apis/HomePageTemplateApi";
import { customerApi } from "../Apis/CustomerApi";
// import homePageSlice from "../Slices/homePageSlice";
// import focusElementSlice from "../Slices/focusElementSlice";
// import {
//   commonInstaplayApiProtected,
//   commonInstaplayApiPublic,
// } from "../Apis/CommonInstaplayApi";
// import { recentlyPlayedApi } from "../Apis/RecentlyPlayedApi";

const persistConfig = {
  key: "root",
  storage,
  blacklist: [
    loginApi.reducerPath,
    homePageTemplateApi.reducerPath,
    productApi.reducerPath,
    categoryApi.reducerPath,
    colorsApi.reducerPath,
    commonFactoryApi.reducerPath,
    customerApi.reducerPath
    // guestApi.reducerPath,
    // homePageApi.reducerPath,
    // loginApi.reducerPath,
    // profileApi.reducerpath,
    // myListApi.reducerpath,
    // categoryPageApi.reducerpath,
    // gamePageApi.reducerpath,
    // searchApi.reducerpath,
    // updateLastPlayApi.reducerpath,
    // postGameScoreApi.reducerpath,
    // favoriteApi.reducerpath,
    // jgsNodeApi.reducerpath,
    // recentlyPlayedApi.reducerPath,
    // "homepage",
    // "focus",
  ],
};

const rootReducer = combineReducers({
    [loginApi.reducerPath]: loginApi.reducer,
    [commonFactoryApi.reducerPath]: commonFactoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [colorsApi.reducerPath]: colorsApi.reducer,
    [homePageTemplateApi.reducerPath]: homePageTemplateApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,



//   [guestApi.reducerPath]: guestApi.reducer,
//   [homePageApi.reducerPath]: homePageApi.reducer,
//   [loginApi.reducerPath]: loginApi.reducer,
//   [profileApi.reducerPath]: profileApi.reducer,
//   [myListApi.reducerPath]: myListApi.reducer,
//   [recentlyPlayedApi.reducerPath]: recentlyPlayedApi.reducer,

//   [categoryPageApi.reducerPath]: categoryPageApi.reducer,
//   [gamePageApi.reducerPath]: gamePageApi.reducer,
//   [searchApi.reducerPath]: searchApi.reducer,
//   [updateLastPlayApi.reducerPath]: updateLastPlayApi.reducer,
//   [postGameScoreApi.reducerPath]: postGameScoreApi.reducer,
//   [favoriteApi.reducerPath]: favoriteApi.reducer,
//   [jgsNodeApi.reducerPath]: jgsNodeApi.reducer,
//   [commonInstaplayApiPublic.reducerPath]: commonInstaplayApiPublic.reducer,
//   [commonInstaplayApiProtected.reducerPath]:
//     commonInstaplayApiProtected.reducer,
//   loginView: loginViewSlice,
//   guest: guestSlice,
//   header: HeaderSlice,
  login: loginReducer,
  cart: cartReducer,

//   homepage: homePageSlice,
//   focus: focusElementSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(loginApi.middleware)
 
  .concat(productApi.middleware)
  
  // .concat(categoryApi.middleware)
  // .concat(colorsApi.middleware)
    //   .concat(commonInstaplayApiPublic.middleware)
    //   .concat(commonInstaplayApiProtected.middleware)

    //   .concat(guestApi.middleware)
    //   .concat(homePageApi.middleware)
    //   .concat(loginApi.middleware)
    //   .concat(profileApi.middleware)
    //   .concat(myListApi.middleware)
    //   .concat(categoryPageApi.middleware)
    //   .concat(gamePageApi.middleware)
    //   .concat(searchApi.middleware)
    //   .concat(updateLastPlayApi.middleware)
    //   .concat(postGameScoreApi.middleware)
    //   .concat(favoriteApi.middleware)
    //   .concat(jgsNodeApi.middleware)
    //   .concat(recentlyPlayedApi.middleware),
});

export const persistor = persistStore(store);
