export const API_CONFIG = {


    // Product endpoints


      CREATE_PRODUCT: "api/v1/productsv2",
    EDIT_PRODUCT: "api/v1/productsv2/", // + :id
    DELETE_PRODUCT: "api/v1/productsv2/", // + :id
    GET_PRODUCT_BY_ID: "api/v1/productsv2/", // + :id
    GET_PRODUCTS_PAGINATED: "api/v1/products/paginated",
    GET_PRODUCTS_BY_CATEGORY: "api/v1/products/getProductsByCategory/", // + :categoryId
    GET_ALL_PRODUCTS: "api/v1/productsv2/client",
    SEARCH_PRODUCTS: "api/v1/productsv2/searchclient", // + :searchTerm
GET_PRODUCTS_BY_FILTER_CATEGORY_VALUE: "api/v1/productsv2/filterCategory/", // + :filterCategoryId/value/:value
    // CREATE_PRODUCT: "api/v1/products/createProduct",
    // EDIT_PRODUCT: "api/v1/products/editProduct/", // + :id
    // DELETE_PRODUCT: "api/v1/products/deleteProduct/", // + :id
    // GET_PRODUCT_BY_ID: "api/v1/products/getProduct/", // + :id
    // GET_PRODUCTS_PAGINATED: "api/v1/products/paginated",
    // GET_PRODUCTS_BY_CATEGORY: "api/v1/products/getProductsByCategory/", // + :categoryId
    // GET_ALL_PRODUCTS: "api/v1/products/all",
    // GET_PRODUCTS_BY_FILTER_CATEGORY_VALUE: "api/v1/products/filterCategory/", // + :filterCategoryId/value/:value

    // Category endpoints

    CREATE_CATEGORY: "api/v1/products/createCategory",
    EDIT_CATEGORY: "api/v1/products/editCategory/", // + :id
    DELETE_CATEGORY: "api/v1/products/deleteCategory/", // + :id
    GET_CATEGORY_BY_ID: "api/v1/products/getCategory/", // + :id
    SHOW_ALL_CATEGORIES: "api/v1/products/showAllCategories",
    GET_CATEGORIES_PAGINATED: "api/v1/products/paginated",

    GET_FEATURE_CATEGORIES: "api/v1/filterCategory",


    CREATE_COLORS: "api/v1/colors",
    EDIT_COLORS: "api/v1/colors", // + :id
    DELETE_COLORS: "api/v1/colors", // + :id
    GET_COLORS_BY_ID: "api/v1/colors", // + :id
    SHOW_ALL_COLORS: "api/v1/colors",


    // Orders endpoints
    CREATE_ORDERS: "api/v1/orders",
    EDIT_ORDERS: "api/v1/orders", // + :id
    DELETE_ORDERS: "api/v1/orders", // + :id
    GET_ORDERS_BY_ID: "api/v1/orders", // + :id
    SHOW_ALL_ORDERS: "api/v1/orders",

    // Homepage template endpoint
    HOMEPAGE_TEMPLATE: "api/v1/homepagetemplate",



    // Customer endpoints
    CUSTOMERS: "api/v1/customer", // <-- Added for customer APIs
    GET_CUSTOMER_BY_MOBILE: "api/v1/customer/mobile/", // <-- For get by mobile
    FACTORY: "api/v1/factory", // <-- Added for factory APIs

}


export const Offers = [
  {
    name: 'Free bag on order above 5000',
    nameHindi: '5000 से ऊपर के ऑर्डर पर फ्री बैग',
    image: 'https://res.cloudinary.com/dy6k69ynu/image/upload/v1760198278/heris_1_pt3dd0.png',
    price:5000
  },

  {
    name: 'Free headphones on order above 10000',
    nameHindi: '10000 से ऊपर के ऑर्डर पर फ्री हेडफ़ोन',
    image: 'https://res.cloudinary.com/dy6k69ynu/image/upload/v1767538167/FootwearMandi_4_w4hopm.png',
    price:10000
  },
  {
    name: 'Free speaker on order above 20000',
    nameHindi: '20000 से ऊपर के ऑर्डर पर फ्री स्पीकर',
    image: 'https://res.cloudinary.com/dy6k69ynu/image/upload/v1767538030/FootwearMandi_3_jn4fwh.png',
    price:20000
  },
  {
    name: 'Free smart watch on order above 50000',
    nameHindi: '50000 से ऊपर के ऑर्डर पर फ्री स्मार्ट वॉच',
    image: 'https://res.cloudinary.com/dy6k69ynu/image/upload/v1760198278/heris_3_fii1p9.png',
    price:50000
  }
];