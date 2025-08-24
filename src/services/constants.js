export const API_CONFIG = {


    // Product endpoints


      CREATE_PRODUCT: "api/v1/productsv2",
    EDIT_PRODUCT: "api/v1/productsv2/", // + :id
    DELETE_PRODUCT: "api/v1/productsv2/", // + :id
    GET_PRODUCT_BY_ID: "api/v1/productsv2/", // + :id
    GET_PRODUCTS_PAGINATED: "api/v1/products/paginated",
    GET_PRODUCTS_BY_CATEGORY: "api/v1/products/getProductsByCategory/", // + :categoryId
    GET_ALL_PRODUCTS: "api/v1/productsv2",
    SEARCH_PRODUCTS: "api/v1/productsv2/search", // + :searchTerm
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
}