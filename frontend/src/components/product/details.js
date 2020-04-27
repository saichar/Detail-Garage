import React, { Component } from 'react';
import { Environment } from '../../../src/components/environment';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import Header from '../../../src/layouts/header';
import TodayDeal from '../../../src/layouts/todays_deal';
import Footer from '../../../src/layouts/footer';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import OwlCarousel from 'react-owl-carousel2';
import Alert from 'react-s-alert';
import StarRatingComponent from 'react-star-rating-component';
var dateFormat = require('dateformat');

class ProductDetail extends Component{
    constructor (props) {
        super(props);
        this.state = {
            cartQuantity : '',
            cartTotalAmount : '',
            getProductDetail: [],
            imageslist:[],
            reviewlist:[],
            quantity : 0,
            user_id_to_send :'',
            wishlistStatus : '',
        }
        let user_id_send = localStorage.getItem("user_id")?localStorage.getItem("user_id"):"";

        let id = this.props.match.params.id;
        this.addQuantity = this.addQuantity.bind(this);
        this.removeQuantity = this.removeQuantity.bind(this);
        this.addProductIntoCart = this.addProductIntoCart.bind(this);
        this.addProductIntoWishlist = this.addProductIntoWishlist.bind(this);
        this.setState({'user_id_send': localStorage.getItem("user_id")?localStorage.getItem("user_id"):""});

        axios.post(Environment.apiurl+'/product/details/'+id,{user_id:user_id_send})
        .then(result => {
            if(result){
                console.log(result.data);
                this.setState({getProductDetail: result.data.response.details});
                this.setState({imageslist: result.data.response.imageslist});
                this.setState({reviewlist: result.data.response.reviewlist});
                this.setState({'id': this.props.match.params.id});
            }
        });
    }

    

    addQuantity(e){
        this.setState({ quantity: this.state.quantity+1 });
    }
    removeQuantity(e){
        if(this.state.quantity>0){
            this.setState({ quantity: this.state.quantity-1 });
        }
    }

    addProductIntoCart(param, param1, param2, param3, param4, param5) {
        if(param5 > 0){
            var quantity = this.state.quantity;
            if(quantity>0){
                var cartData =
                {
                    "product_id":param,
                    "category_id":param1,
                    "sub_category_id":param2,
                    "price":param3,
                    "user_id":param4,
                    "quantity":quantity,
                };
            
                axios.post(Environment.apiurl+"/addProductIntoCart", cartData).then(result => {
                    if(result.data.status=="success"){
                        this.setState({ quantity: 0 });
                        // console.log(result.data.status);
                        Alert.success(result.data.message, {
                            position: 'bottom-right',
                            timeout: 3000
                        });
                        document.getElementById('cartcount').innerHTML = result.data.response[0].cartQuantity;
                        document.getElementById('cartTotalAmount').innerHTML = result.data.response[0].cartTotalAmount;
                    }else{
                        Alert.error(result.data.message, {
                            position: 'bottom-right',
                            timeout: 3000
                        });
                    }
                });
            } else {
                Alert.error("Quantity should be grater than 0.", {
                    position: 'bottom-right',
                    timeout: 3000
                });
            }
        } else {
            Alert.error('Product not available!', {
                position: 'bottom-right',
                timeout: 1000
            });
        }
        
        
    }

    addProductIntoWishlist(param, param1) {
        var wishlistData =
        {
            "product_id":param,
            "user_id":param1,
        };
       
        axios.post(Environment.apiurl+"/addProductIntoWishlist", wishlistData).then(result => {
            this.setState({wishlistStatus : result.data.status});
            if(result.data.status=="success"){
                Alert.success(result.data.message, {
                    position: 'bottom-right',
                    timeout: 3000
                });
            }else{
                Alert.error(result.data.message, {
                    position: 'bottom-right',
                    timeout: 3000
                });
            }
        });
    }
    


    render() {
        const options1 = {
            items: 1,
            dots:false,
            callbacks:true,
            // nav:true,
            loop:true,
            autoplay: true,
            autoplayTimeout:3500,
            smartSpeed:800,
            singleItem:true,
            // navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
            responsiveClass:true,    
        };

        const options2 = {
            // margin:10,
            items: 4,
            dots:false,
            callbacks:true,
            // nav:true,
            loop:true,
            autoplay: true,
            autoplayTimeout:3500,
            smartSpeed:800,
            singleItem:true,
            // navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
            responsiveClass:true,    
        };
        // console.log(this.state.wishlistStatus);
        return (
            <div>
                <Header />
                    
                <section class="pageBanner">
                    <figure><img src={Environment.apiurl+"/images/page-banner.jpg"} class="img-fluid" /></figure>
                    <div class="overLay_1">
                        <div class="container">
                            <div class="row">
                                <div class="col-sm-12 text-center">
                                    <h1>Shop</h1>
                                    <ol class="breadcrumb">
                                        <li><a href={Environment.webrl}>Home</a></li>
                                        <li class="active">Product Details</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <If condition={this.state.getProductDetail.length > 0}>
                    <Then>
                    {this.state.getProductDetail.map((item, index) =>    
                    <div>                
                    <section class="listing">
                        <div class="container">
                            <div class="row">
                            <div class="col-md-5 thumSlider">
                            
                            <OwlCarousel  options={options1} id="sync1" class="owl-carousel owl-theme"> 
                                <If condition={this.state.imageslist.length > 0 }>                                               
                                <Then>
                                    {this.state.imageslist.map((item, index) =>
                                    <div class="item"><img src={item.image} class="img-fluid"/></div>
                                    )}
                                </Then>   
                                <Else>
                                    <div class="item"><img src={Environment.apiurl+'/products/'+item.image} class="img-fluid"/></div>
                                </Else>                       
                                </If>
                            </OwlCarousel>

                            <OwlCarousel  options={options2} id="sync2" class="owl-carousel owl-theme" >
                                <If condition={this.state.imageslist.length > 0 }>
                                <Then>
                                    {this.state.imageslist.map((item, index) =>
                                    <div class="item"><img src={item.image} /></div>
                                    )}
                                </Then>  
                                <Else>
                                    <div class="item"><img src={Environment.apiurl+'/products/'+item.image} class="img-fluid"/></div>
                                </Else>       
                                </If>
                            </OwlCarousel>

                            </div>
                            <div class="col-md-7 detailDis">
                                <h2>{item.product_name}</h2>
                                <p class="price">${item.price} </p>

                                <If condition={item.quantity > 0}>
                                    <Then>
                                        <p class="stock">In stock</p>
                                    </Then>
                                    <Else>
                                        <p class="stock">Out of stock</p>
                                    </Else>
                                </If>
                                <p>{ ReactHtmlParser(item.description) }</p>
                                <div class="plusMinus">
                                <form id='myform' method='POST' action='#'>
                                    <input type='button' value='-' class='qtyminus numb' field='quantity' onClick={(e) => this.removeQuantity()}/>
                                    <input type='text' name='quantity' id="quantity" value={this.state.quantity} class='qty numb' />
                                    <input type='button' value='+' class='qtyplus numb' field='quantity' onClick={(e) => this.addQuantity()}/>
                                </form>

                                <If condition={localStorage.getItem("email")}>
                                    <Then>
                                        <button class="cartBtn" onClick={(e) => this.addProductIntoCart(item.id, item.category_id, item.sub_category_id, item.price, localStorage.getItem("user_id"), item.quantity)}>Add to Cart</button>
                                        {/* <button class="reviewBtn" >Write Review</button> */}
                                    </Then>
                                    <Else>
                                        <button class="cartBtn" data-toggle="modal" data-target="#loginModal">Add to Cart</button>
                                        {/* <button class="reviewBtn" data-toggle="modal" data-target="#loginModal">Write Review</button> */}
                                    </Else>
                                </If>
                                
                                </div>

                                <ul class="otherLinks">
                                <If condition={localStorage.getItem("email")}>
                                <Then>
                                    <If condition={this.state.wishlistStatus}>
                                    <Then>
                                        <If condition={this.state.wishlistStatus === 'success'}>
                                            <Then>
                                                <li class="active"><a href="javaScript:void(0);"onClick={(e) => this.addProductIntoWishlist(item.id, localStorage.getItem("user_id"))}><i class="far fa-heart"></i></a></li>
                                            </Then>
                                            <Else>
                                                <li><a href="javaScript:void(0);" onClick={(e) => this.addProductIntoWishlist(item.id, localStorage.getItem("user_id"))}><i class="far fa-heart"></i></a></li>
                                            </Else>
                                        </If>
                                    </Then>
                                    <Else>
                                        <If condition={item.favorite > 0}>
                                            <li class="active"><a href="javaScript:void(0);"onClick={(e) => this.addProductIntoWishlist(item.id, localStorage.getItem("user_id"))}><i class="far fa-heart"></i></a></li>
                                        </If>
                                        <If condition={item.favorite == 0}>
                                            <li><a href="javaScript:void(0);" onClick={(e) => this.addProductIntoWishlist(item.id, localStorage.getItem("user_id"))}><i class="far fa-heart"></i></a></li>
                                        </If>
                                    </Else>
                                    </If>
                                </Then>
                                <Else>
                                    <li><a href="#" data-toggle="modal" data-target="#loginModal"><i class="far fa-heart"></i></a></li>
                                </Else>
                                </If>
                                {/* <li><a href="#"><i class="fas fa-exchange-alt"></i></a></li>
                                <li><a href="#"><i class="fas fa-print"></i></a></li> */}
                                </ul>

                            </div>
                            </div>
                        </div>
                    </section>

                           
                    <section class="myTab">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-12">
                                    <ul class="nav nav-tabs" id="nav-tab" role="tablist">
                                        <li class="nav-item">
                                            <a class="nav-link active" href="#description" role="tab" data-toggle="tab" aria-controls="description" aria-selected="true">Description</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link" href="#reviews" role="tab" data-toggle="tab">Reviews</a>
                                        </li>
                                    </ul>


                                    <div class="tab-content" id="nav-tabContent">
                                        <div role="tabpanel" class="tab-pane in active" id="description">{ ReactHtmlParser(item.description) }</div>
                                        <div role="tabpanel" class="tab-pane" id="reviews">
                                        <div class="reviewList" data-simplebar>
                                                    <ul>
                                                    {this.state.reviewlist.length>0}
                                                    <If condition={this.state.reviewlist.length>0}>
                                                    <Then>
                                                        {this.state.reviewlist.map( (item, index) =>
                                                            <li>
                                                            <h3><img src={Environment.apiurl+"/images/client-img.jpg"} />{item.first_name} {item.last_name}</h3>

                                                            <StarRatingComponent className="risingstar" starCount={item.rating} value={item.rating} />
                                                            {/* <div class="starrating risingstar d-flex flex-row-reverse">
                                                                <StarRatingComponent starCount={item.rating} value={item.rating} />    
                                                            </div> */}

                                                            <div class="rDate">{dateFormat(item.addedOn, "dd mmmm yyyy")}</div>
                                                                <p>{item.review}</p>
                                                            </li>
                                                        )}
                                                    </Then>
                                                    <Else>
                                                        <li><div className="alert alert-danger">Record not found!!</div></li>
                                                    </Else>
                                                    </If>
                                                    
                                                    </ul>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>


                    </div>
                    )}
                    </Then>
                </If>

                <TodayDeal />
                <Footer />
            </div>
        )
    }    

}

export default ProductDetail;