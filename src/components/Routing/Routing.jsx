import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Home from '../HomeModule/Home'
import ProtectedRoute from '../utility/ProtectedRoute/ProtectedRoute'
import HomeWrapper from '../HomeModule/HomeWrapper'
import ProductPage from '../ProductModule/ProductPage/ProductPage'
import CategoryPages from '../HomeModule/pages/CategoryPages/CategoryPages'
import ProductPageV2 from '../ProductModule/ProductPage/ProductPageV2'
import ProductPageV3 from '../ProductModule/ProductPage/ProductPageV3'
import OrderPage from '../OrderModule/OrderPage'
import SearchBarPage from '../HomeModule/SearchBar/SearchBarPage'
import PastOrders from '../PastOrders/PastOrders'


const Routing = () => {
  return (
    <div>
      <Routes>


        <Route path="/" element={<HomeWrapper />}>
          <Route index element={<Home />} />
          <Route path='/product/:id' element={<ProductPageV3/>} />
          <Route path='/CategoryPages' element={<CategoryPages/>} />
          <Route path='/Cart' element={<OrderPage/>} />
          <Route path='/search' element={<SearchBarPage/>} />
          <Route path='/pastOrders' element={<PastOrders/>} />
        </Route>




      </Routes>
    </div>
  )
}

export default Routing
