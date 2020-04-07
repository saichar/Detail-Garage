import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import App from './App';
import Product from './components/product/product';
import ProductList from './components/product/productlist';
import CategoryProduct from './components/product/category-product';
import ProductDetail from './components/product/details';
import Cart from './components/user/cart';
import Order from './components/user/order';
import Wishlist from './components/user/wishlist';
import MyAccount from './components/user/my-account';
import ConfirmOrder from './components/user/confirm-order';
import Page from './components/page/page';
import ContactUs from './components/page/contact_us';
import ForgotPassword from './components/user/forgotPassword';

import * as serviceWorker from './serviceWorker';


ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path='/' component={App} />
            <Route exact path='/product' component={Product} />
            <Route exact path='/productlist' component={ProductList} />
            <Route exact path='/product/:slug' component={CategoryProduct} />
            <Route path='/product/details/:id' component={ProductDetail} />
            <Route path='/user/cart' component={Cart} />
            <Route path='/user/order' component={Order} />
            <Route path='/user/wishlist' component={Wishlist} />
            <Route path='/user/my-account' component={MyAccount} />
            <Route path='/user/confirm-order' component={ConfirmOrder} />
            <Route path='/contact-us' component={ContactUs} />
            {/* <Route path='/about-us' component={Page} /> */}
            <Route path='/forgotPassword' component={ForgotPassword} />
            <Route path='/page/:slug' component={Page} />
           
        </Switch>
    </Router>, document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
