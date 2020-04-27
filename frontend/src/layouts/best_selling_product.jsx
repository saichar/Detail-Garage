import React, { Component } from 'react';
import {Environment} from '../components/environment/index';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import OwlCarousel from 'react-owl-carousel2';
import Alert from 'react-s-alert';

class BestSellingProduct extends Component {

    constructor (props){
        super(props);

        this.state = {
            cartQuantity : '',
            cartTotalAmount : '',
            bestSellingList: [],
            user_id_send :'',
            wishlistStatus : '',
            wishlistpro : '',
        }
        var user_id_send = localStorage.getItem("user_id")?localStorage.getItem("user_id"):"";
        this.addProductIntoWishlist = this.addProductIntoWishlist.bind(this);
        // this.bestSellingProductList = this.bestSellingProductList.bind(this);
        this.setState({'user_id_send': user_id_send});


        axios.post(Environment.apiurl+'/bestSellingProductList',{user_id:user_id_send})
        .then(result => {
            if(result){
                // console.log(result);
                this.setState({bestSellingList: result.data.response});
                this.setState({user_id_send:user_id_send});
            }
        });
    }

    // bestSellingProductList(){
    //     axios.post(Environment.apiurl+'/bestSellingProductList',{user_id:localStorage.getItem("user_id")})
    //     .then(result => {
    //     if(result.data.status==="true"){
    //         this.setState({user_id_send:this.state.user_id_send});
    //         this.setState({bestSellingList: result.data.response});
    //     }});
    // }

    addProductIntoCart(param, param1, param2, param3, param4, param5, param6) {
        if(param6 > 0){
            var cartData =
            {
                "product_id":param,
                "category_id":param1,
                "sub_category_id":param2,
                "price":param3,
                "quantity":param4,
                "user_id":param5,
            };
        
            axios.post(Environment.apiurl+"/addProductIntoCart", cartData).then(result => {
                if(result.data.status=="success"){
                    Alert.success(result.data.message, {
                        position: 'bottom-right',
                        timeout: 3000
                    });
                    document.getElementById('cartcount').innerHTML = result.data.response[0].cartQuantity;
                    document.getElementById('cartTotalAmount').innerHTML = result.data.response[0].cartTotalAmount.toFixed(2);
                }else{
                    Alert.error(result.data.message, {
                        position: 'bottom-right',
                        timeout: 3000
                    });
                }
            });
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
            this.setState({wishlistpro : param});
            if(result.data.status=="success"){
                // this.bestSellingProductList();
                Alert.success(result.data.message, {
                    position: 'bottom-right',
                    timeout: 3000
                });
                axios.post(Environment.apiurl+'/bestSellingProductList',{user_id:this.state.user_id_send})
                .then(result => {
                    if(result){
                        // console.log(result);
                        this.setState({bestSellingList: result.data.response});
                        this.setState({user_id_send:this.state.user_id_send});
                    }
                });
            }else{
                Alert.error(result.data.message, {
                    position: 'bottom-right',
                    timeout: 3000
                });
                axios.post(Environment.apiurl+'/bestSellingProductList',{user_id:this.state.user_id_send})
                .then(result => {
                    if(result){
                        // console.log(result);
                        this.setState({bestSellingList: result.data.response});
                        this.setState({user_id_send:this.state.user_id_send});
                    }
                });
            }
        });
    }

    render(){
        const options = {
            // items: 4,
            responsiveClass:true,
            responsive:{
                0:{
                    items:2,
                    nav:true
                },
                600:{
                    items:3,
                    nav:false
                },
                1000:{
                    items:4,
                    nav:true,
                    loop:false
                }
            },
            nav: true,
            rewind: true,
            autoplay: false,
            dots: false,
            navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
        };

        return (
            <div>
                <section class="products">
                    <div class="container">
                        <h2>Best Selling Products</h2>
                        {this.state.bestSellingList.length>0?
                        <OwlCarousel id="products1" class="owl-carousel owl-theme" options={options} >
                        {/* <div id="products1" class="owl-carousel owl-theme"> */}
                            {this.state.bestSellingList.map((item, index) =>
                            <div class="item">
                                <div class="itemBox">
                                    <figure>
                                        <If condition={item.image != ""}>
                                            <Then>
                                                <a href={Environment.weburl+'/product/details/'+item.id}><img src={Environment.apiurl+'/products/'+item.image} class="img-fluid" /></a>
                                                
                                            </Then>
                                            <Else>
                                                <a href={Environment.weburl+'/product/details/'+item.id}><img src={Environment.apiurl+'/products/noimage.jpeg'} class="img-fluid" /></a>
                                            </Else>
                                        </If>
                                    </figure>

                                    <If condition={localStorage.getItem("email")}>
                                        <Then>
                                            <div class="addCart"> 

                                            <If condition={this.state.wishlistStatus && item.id == this.state.wishlistpro}>
                                                <Then>
                                                    <If condition={this.state.wishlistStatus === 'success' && item.id == this.state.wishlistpro}>    
                                                        <Then>   
                                                                <a href="javaScript:void(0);" onClick={(e) => this.addProductIntoWishlist(item.id, localStorage.getItem("user_id"))} class="wishList-Red"><i class="fas fa-heart"></i></a>
                                                        </Then>
                                                        <Else>
                                                            <a href="javaScript:void(0);" onClick={(e) => this.addProductIntoWishlist(item.id, localStorage.getItem("user_id"))} class="wishList"><i class="fas fa-heart"></i></a>
                                                        </Else>
                                                    </If>
                                                </Then>                                            
                                                <Else>
                                                    <If condition={item.favorite > 0}>
                                                        <a href="javaScript:void(0);" onClick={(e) => this.addProductIntoWishlist(item.id, localStorage.getItem("user_id"))} class="wishList-Red"><i class="fas fa-heart"></i></a>
                                                    </If>
                                                    <If condition={item.favorite == 0}>
                                                        <a href="javaScript:void(0);" onClick={(e) => this.addProductIntoWishlist(item.id, localStorage.getItem("user_id"))} class="wishList"><i class="fas fa-heart"></i></a>
                                                    </If>
                                                </Else>
                                            </If>

                                                <button onClick={(e) => this.addProductIntoCart(item.id, item.category_id, item.sub_category_id, item.price, 1, localStorage.getItem("user_id"), item.quantity)}>Add to cart</button>
                                                <a href={Environment.weburl+'/product/details/'+item.id} class="comPare"><i class="fas fa-info-circle"></i></a> 
                                            </div>
                                        </Then>

                                        <Else>
                                            <div class="addCart"> 
                                                <a href="#" data-toggle="modal" data-target="#loginModal" class="wishList"><i class="fas fa-heart"></i></a>
                                                <button data-toggle="modal" data-target="#loginModal">Add to cart</button>
                                                <a href={Environment.weburl+'/product/details/'+item.id} class="comPare"><i class="fas fa-info-circle"></i></a> 
                                            </div>
                                        </Else>
                                    </If>
                                    <h3><a href={Environment.weburl+'/product/details/'+item.id}>{item.product_name}</a></h3>
                                    <div class="prPrice">${item.price.toFixed(2)}</div>
                                </div>
                            </div>
                            )}  
                        {/* </div> */}
                        </OwlCarousel> 
                        :""}
                        <Alert stack={true} timeout={3000} position='bottom-right' />
                    </div>
                </section>
            </div>
        )
    }
}

export default BestSellingProduct;
