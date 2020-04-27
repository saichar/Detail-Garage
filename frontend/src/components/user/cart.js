import React, { Component } from 'react';
import { Environment } from '../../../src/components/environment';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import Header from '../../../src/layouts/header';
import Footer from '../../../src/layouts/footer';
import Alert from 'react-s-alert';
import ShippingList from '../../components/user/shipping_list';
import StoreAddress from '../../components/user/store_address';
import CheckoutForm from '../../components/user/stripe-checkout';
import {Elements, StripeProvider} from 'react-stripe-elements';
// import StripeCheckout from 'react-stripe-checkout';
import { constants } from 'crypto';


class Cart extends Component{
    constructor (props) {
        super(props);
        this.state = {
            user_id_send :'',
            useremail:localStorage.getItem("email")?localStorage.getItem("email"):"",
            username:localStorage.getItem("first_name")?localStorage.getItem("first_name"):"",
            cartlistProduct : [],
            addresslist : [],
            deliveryAmount:[],
            quantity : 0,
            cartTotalQuantity:0,
            cartQuantity : 0,
            cartTotalAmount : 0,
            subTotalAmount : 0,
            totalamount:0,
            subFinalAmount : 0,
            standeredDelivery : 0,
            langValue:'',
            stripeRes:''
        }
        var user_id_send = localStorage.getItem("user_id")?localStorage.getItem("user_id"):"";

        this.addQuantity = this.addQuantity.bind(this);
        this.removeQuantity = this.removeQuantity.bind(this);
        this.getUserCartdetails = this.getUserCartdetails.bind(this);
        this.handleLanguage=this.handleLanguage.bind(this);
        axios.post(Environment.apiurl+'/getUserCartlistProduct', {user_id:user_id_send})
        .then(result => {
            if(result){
                if(result.data.response.cartlistProduct.length>0){
                    this.getUserCartdetails();
                    // this.setState({ subTotalAmount: result.data.response[0].cartTotalAmount?result.data.response[0].cartTotalAmount:0 });
                    // this.setState({ subFinalAmount: result.data.response[0].cartTotalAmount });
                    // this.setState({cartlistProduct: result.data.response});

                    this.setState({ subTotalAmount: result.data.response.cartlistProduct[0].cartTotalAmount?result.data.response.cartlistProduct[0].cartTotalAmount:0 });
                    this.setState({ subFinalAmount: result.data.response.cartlistProduct[0].cartTotalAmount });
                    this.setState({"totalamount":result.data.response.cartlistProduct[0].cartTotalAmount});
                    this.setState({cartlistProduct: result.data.response.cartlistProduct});
                    this.setState({deliveryAmount: result.data.response.deliveryAmount});
                    this.setState({ standeredDelivery: result.data.response.deliveryAmount[0].value?result.data.response.deliveryAmount[0].value:0 });

                    this.setState({user_id_send:user_id_send});
                } else {
                    //this.setState({ subTotalAmount: 0 });
                    //this.setState({ subFinalAmount: 0 });
                }
            }
        });
    }
    
    
    handleLanguage = (stripeRes) => {
        // console.log(stripeRes.data.payment_method);
        this.setState({stripeResponse: stripeRes});
        this.setState({stripeStatus: stripeRes.data.status});
        this.setState({stripeTxnId: stripeRes.data.balance_transaction});
        this.setState({stripeId: stripeRes.data.id});

        if(this.state.stripeStatus == "succeeded"){
            var deliveryTypeval = document.querySelector('input[name = "radio1"]:checked').value;
            if(deliveryTypeval == 'self'){
                var address_id = '';
                var shipping_amount = 0;

                var proAmt = document.getElementById('subTotalAmount').innerHTML;
                var subTot = document.getElementById('subFinalAmount').innerHTML;
                var checkoutDetails =
                {
                    "stripeTxnId":this.state.stripeTxnId,
                    "stripeId":this.state.stripeId,
                    "shipping_amount":shipping_amount,
                    "amount":proAmt,
                    "total_amount":subTot,
                    "shipping_type":deliveryTypeval,
                    "address_id":address_id,
                    "user_id":this.state.user_id_send,
                    "useremail":this.state.useremail,
                    "username":this.state.username
                    
                // "catproducts":this.state.cartlistProduct
                };
                axios.post(Environment.apiurl+"/productCheckout", checkoutDetails).then(result => {
                    if(result.data.status=="success"){
                        // alert(result.data.status);
                        localStorage.setItem("sucessMsg", result.data.message);
                            window.location.href = Environment.weburl+'/user/confirm-order';
                    } else {
                        Alert.error(result.data.message, {
                            position: 'bottom-right',
                            timeout: 1000
                        });
                    }
                });
            }

            if(deliveryTypeval == 'delivery'){
                var addressLength = document.getElementById('addressLength').value;
                if(addressLength > 0){
                    var shipping_amount = this.state.standeredDelivery;
                    var address_id = document.querySelector('input[name = "radio2"]:checked').value;
                    var proAmt = document.getElementById('subTotalAmount').innerHTML;
                    var subTot = document.getElementById('subFinalAmount').innerHTML;
                    var checkoutDetails =
                    {
                        "stripeTxnId":this.state.stripeTxnId,
                        "stripeId":this.state.stripeId,
                        "shipping_amount":shipping_amount,
                        "amount":proAmt,
                        "total_amount":subTot,
                        "shipping_type":deliveryTypeval,
                        "address_id":address_id,
                        "user_id":this.state.user_id_send,
                        "useremail":this.state.useremail,
                        "username":this.state.username
                        
                    // "catproducts":this.state.cartlistProduct
                    };
                    axios.post(Environment.apiurl+"/productCheckout", checkoutDetails).then(result => {
                        if(result.data.status=="success"){
                            // alert(result.data.status);
                            localStorage.setItem("sucessMsg", result.data.message);
                                window.location.href = Environment.weburl+'/user/confirm-order';
                        } else {
                            Alert.error(result.data.message, {
                                position: 'bottom-right',
                                timeout: 1000
                            });
                        }
                    });
                } else {
                    Alert.error('Add your delivery address!', {
                        position: 'bottom-right',
                        timeout: 2000
                    });
                }                
            }
        } else {
            Alert.error('Something went wrong', {
                position: 'bottom-right',
                timeout: 2000
            });
        }
    }

    addQuantity(e){
        var qnt = document.getElementById('quantity_'+e).value;
        var newQuantity = parseInt(qnt)+1;
        var itmPrice = document.getElementById('proPrice_'+e).value;
        var updateCartItem =
        {
            "id":e,
            "user_id":this.state.user_id_send,
            "quantity":newQuantity,
            "price":itmPrice,
            "type":'add',
        };
        axios.post(Environment.apiurl+"/updateCartQuantity", updateCartItem).then(result => {
        if(result){
            // console.log(result.data.response[0].quantity);
            // console.log(result.data.response[0].total_amount);
            if(result.data.status == "success"){
                this.getUserCartdetails();
                Alert.success(result.data.message, {
                    position: 'bottom-right',
                    timeout: 1000
                });
                document.getElementById('quantity_'+e).value = result.data.response[0].quantity;
                document.getElementById('proToatlPrice_'+e).innerHTML = result.data.response[0].total_amount.toFixed(2);
            } else {
                Alert.error(result.data.message, {
                    position: 'bottom-right',
                    timeout: 1000
                });
            }
        }
        });
    }

    updateSubTotal(param){
        // alert(param);
        var radioVal = param;
        var subTot = document.getElementById('subTotalAmount').innerHTML;
        if(radioVal == 'self'){
            document.getElementById("shipping_address").style.display = "none";
            document.getElementById("store_address").style.display = "block";
            document.getElementById('subFinalAmount').innerHTML = parseInt(subTot).toFixed(2);
             this.setState({"totalamount":parseInt(subTot).toFixed(2)});
        }
        if(radioVal == 'delivery'){
            document.getElementById("shipping_address").style.display = "block";
            document.getElementById("store_address").style.display = "none";
            var standeredDelivery = this.state.standeredDelivery;
            var totValAmt = parseInt(subTot)+parseInt(standeredDelivery);
            document.getElementById('subFinalAmount').innerHTML = totValAmt.toFixed(2);
            this.setState({"totalamount":totValAmt.toFixed(2)});
        }
    }


    closePaymentModel(id){
        var modal = document.getElementById(id);
        modal.style.display = "none";
    }


    productCheckout(){
        var deliveryType = document.querySelector('input[name = "radio1"]:checked');
        if(deliveryType){
            var deliveryTypeval = document.querySelector('input[name = "radio1"]:checked').value;
            
            // STRIPE PAYMENT HERE START
            // console.log(this.state.stripeStatus);
            var modal = document.getElementById("paymentModal");
            modal.style.display = "block";
            return false;

            // STRIPE PAYMENT HERE END


            // if(deliveryTypeval == 'self'){
            //     var address_id = '';
            //     var shipping_amount = 0;

            //     var proAmt = document.getElementById('subTotalAmount').innerHTML;
            //     var subTot = document.getElementById('subFinalAmount').innerHTML;
            //     var checkoutDetails =
            //     {
            //         "shipping_amount":shipping_amount,
            //         "amount":proAmt,
            //         "total_amount":subTot,
            //         "shipping_type":deliveryTypeval,
            //         "address_id":address_id,
            //         "user_id":this.state.user_id_send,
            //         "useremail":this.state.useremail,
            //         "username":this.state.username
                    
            //     // "catproducts":this.state.cartlistProduct
            //     };
            //     axios.post(Environment.apiurl+"/productCheckout", checkoutDetails).then(result => {
            //         if(result.data.status=="success"){
            //             // alert(result.data.status);
            //             localStorage.setItem("sucessMsg", result.data.message);
            //                 window.location.href = Environment.weburl+'/user/confirm-order';
            //         } else {
            //             Alert.error(result.data.message, {
            //                 position: 'bottom-right',
            //                 timeout: 1000
            //             });
            //         }
            //     });
            // }
            
            // if(deliveryTypeval == 'delivery'){
            //     var addressLength = document.getElementById('addressLength').value;
            //     if(addressLength > 0){
            //         var shipping_amount = this.state.standeredDelivery;
            //         var address_id = document.querySelector('input[name = "radio2"]:checked').value;
            //         var proAmt = document.getElementById('subTotalAmount').innerHTML;
            //         var subTot = document.getElementById('subFinalAmount').innerHTML;
            //         var checkoutDetails =
            //         {
            //             "shipping_amount":shipping_amount,
            //             "amount":proAmt,
            //             "total_amount":subTot,
            //             "shipping_type":deliveryTypeval,
            //             "address_id":address_id,
            //             "user_id":this.state.user_id_send,
            //             "useremail":this.state.useremail,
            //             "username":this.state.username
                        
            //         // "catproducts":this.state.cartlistProduct
            //         };
            //         axios.post(Environment.apiurl+"/productCheckout", checkoutDetails).then(result => {
            //             if(result.data.status=="success"){
            //                 // alert(result.data.status);
            //                 localStorage.setItem("sucessMsg", result.data.message);
            //                     window.location.href = Environment.weburl+'/user/confirm-order';
            //             } else {
            //                 Alert.error(result.data.message, {
            //                     position: 'bottom-right',
            //                     timeout: 1000
            //                 });
            //             }
            //         });
            //     } else {
            //         Alert.error('Add your delivery address!', {
            //             position: 'bottom-right',
            //             timeout: 2000
            //         });
            //     }                
            // }
        } else {
            Alert.error('Please select your shipping type!', {
                position: 'bottom-right',
                timeout: 2000
            });
        }
    }

    removeQuantity(e){
        var qnt = document.getElementById('quantity_'+e).value;
        if(qnt>1){
            var qnt = document.getElementById('quantity_'+e).value;
            var newQuantity = parseInt(qnt)-1;
            var itmPrice = document.getElementById('proPrice_'+e).value;
            var updateCartItem =
            {
                "id":e,
                "user_id":this.state.user_id_send,
                "quantity":newQuantity,
                "price":itmPrice,
                "type":'add',
            };
            axios.post(Environment.apiurl+"/updateCartQuantity", updateCartItem).then(result => {
            if(result){
                // console.log(result.data.response[0].quantity);
                // console.log(result.data.response[0].total_amount);
                if(result.data.status == "success"){
                    this.getUserCartdetails();
                    Alert.success(result.data.message, {
                        position: 'bottom-right',
                        timeout: 1000
                    });
                    document.getElementById('quantity_'+e).value = result.data.response[0].quantity;
                    document.getElementById('proToatlPrice_'+e).innerHTML = result.data.response[0].total_amount.toFixed(2);
                } else {
                    Alert.error(result.data.message, {
                        position: 'bottom-right',
                        timeout: 1000
                    });
                }
            }
            });
        }
    }


    getUserCartdetails(){
        axios.post(Environment.apiurl+'/getUserCartProDetails',{user_id:localStorage.getItem("user_id")})
        .then(result => {
            // console.log(result);
            // console.log(result.data.response[0].cartTotalAmount);
            // console.log(result.data.response[0].cartTotalAmount);
            // console.log(result.data.response[0].cartQuantity);
            if(result){
               document.getElementById('subTotalAmount').innerHTML = result.data.response[0].cartTotalAmount.toFixed(2);
                document.getElementById('subFinalAmount').innerHTML = result.data.response[0].cartTotalAmount.toFixed(2);
                document.getElementById('cartcount').innerHTML = result.data.response[0].cartQuantity;
                document.getElementById('cartTotalAmount').innerHTML = result.data.response[0].cartTotalAmount.toFixed(2);                
            }
        });
    }


    deleteCartlistItem(param){
        var wishlistItem =
        {
            "id":param,
            "user_id":this.state.user_id_send,
        };
        axios.post(Environment.apiurl+"/deleteCartlistItem", wishlistItem).then(result => {
            if(result.data.status=="success"){
                this.getUserCartdetails();
                document.getElementById("cart_"+param).remove();
                this.setState({sucessMsg: result.data.message});
                localStorage.setItem("sucessMsg", result.data.message);
            } else if(result.data.status=="deleted"){
                this.getUserCartdetails();
                document.getElementById("cart_"+param).remove();
                this.setState({sucessMsg: result.data.message});
                localStorage.setItem("sucessMsg", result.data.message);
                setTimeout(function () {
                    window.location.reload(1);
                }, 1000);
            } else {
                this.setState({sucessMsg3: result.data.message});
                localStorage.setItem("sucessMsg", result.data.message);
            }
        });
    }



    render() {
        return (
            <div>
                <Header />
                <section class="cartPage">
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <h2>Cart</h2>
                                <ul class="breadcrumb">
                                    <li><a href="#">Home</a></li>
                                    <li>Cart</li>
                                </ul>
                            </div>
                            
                            <div class="col-12">
                            <If condition={this.state.sucessMsg}>
                                <Then>
                                    <div className="alert alert-success">{this.state.sucessMsg}</div>
                                </Then>
                            </If>

                            <If condition={this.state.errorMsg}>     
                                <Then>
                                    <div className="alert alert-danger">{this.state.errorMsg}</div>
                                </Then>
                            </If>
                            
                            <If condition={this.state.cartlistProduct.length > 0}>
                            <Then>
                            <div class="table-responsive">
                                <table class="table crTable" id="cartItems">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th colspan="2">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.cartlistProduct.length>0}
                                    {this.state.cartlistProduct.map( (item, index) =>
                                    
                                    <tr id={'cart_'+item.cart_id}>
                                        <input type='hidden' name='proPrice' id={'proPrice_'+item.cart_id} value={item.price} />

                                        <td data-label="Product"><figure class="prodImg"><img src={Environment.apiurl+'/products/'+item.image} /></figure> <h4>{item.product_name}</h4></td>
                                        <td data-label="Price">${item.price.toFixed(2)}</td>
                                        <td data-label="Quantity">
                                            <div class="plusMinus prodCount">
                                                <form id='myform' method='POST' action='#'>
                                                    <input type='button' value='-' class='numb' field='quantity' onClick={(e) => this.removeQuantity(item.cart_id)}/>

                                                    <input type='text' name='quantity' id={'quantity_'+item.cart_id} value={item.cartTotalQuantity} class='qty numb' />

                                                    <input type='button' value='+' class='numb' field='quantity' onClick={(e) => this.addQuantity(item.cart_id)}/>
                                                </form>
                                            </div>
                                        </td>
                                        <td data-label="Total"> $<span id={'proToatlPrice_'+item.cart_id}>{item.total_amount.toFixed(2)}</span></td>
                                        <td class="text-center"><a href="javascript:void(0);" onClick={e => window.confirm("Are you sure you wish to delete this item?") && this.deleteCartlistItem(item.cart_id) }><img src={Environment.apiurl+"/images/cross.png"} /></a></td>
                                    </tr>
                                    )}
                                        
                                    </tbody>
                                </table>
                                </div>
                                
                                <div class="contnuShop">
                                    <div class="row">
                                        <div class="col-6">
                                            <a href={Environment.weburl+'/product'}><button class="btn gray">Continue shopping</button></a>
                                        </div>
                                        {/* <div class="col-6 text-right">
                                            <button class="btn red">Update cart</button>
                                        </div> */}
                                    </div>
                                </div>
                                
                                <div class="carTotal">
                                    <div class="row">
                                        <div class="col-lg-3">
                                            <h3>Cart Totals</h3>
                                        </div>
                                        <div class="col-lg-9">
                                            <ul class="cartVelu">
                                                <li><h3>Subtotal</h3></li>
                                                <li>$<span id="subTotalAmount">{this.state.subTotalAmount}</span></li>
                                            </ul>
                                            
                                            <ul class="cartVelu">
                                                <li><h3>Shipping</h3></li>
                                                <li>
                                                    <label>
                                                        <input type="radio" value="self" name="radio1" id="delivery_type" onClick={(e) => this.updateSubTotal('self')} /> Self Pick-Up (Free)
                                                    </label>
                                                    <label>
                                                        <input type="radio" value="delivery" name="radio1" id="delivery_type" onClick={(e) => this.updateSubTotal('delivery')} /> Standard Delivery (${this.state.standeredDelivery})
                                                    </label>
                                                </li>
                                            </ul>
                                            
                                            <div class="cartAddrs" id="shipping_address" style={{ display: "none" }}>
                                            <ShippingList />
                                            </div>
                                            

                                            <div class="cartAddrs" id="store_address" style={{ display: "none" }}>
                                            <StoreAddress />
                                            </div>
                                            
                                            <ul class="cartVelu">
                                                <li><h3>Total</h3></li>
                                                <li>$<span id="subFinalAmount">{this.state.finalTotalAmount}</span></li>
                                            </ul>                                            
                                        </div>
                                    </div>
                                    
                                </div>                                
                                <div class="clearfix"></div>
                                

                              

                                <button onClick={e => window.confirm("Are you sure to checkout this item?") && this.productCheckout()} class="checkoutBtn">Proceed to Checkout</button>

                                {/* <button data-toggle="modal" data-target="#loginModal" class="checkoutBtn">Proceed to Checkout</button> */}
                                <div class="clearfix"></div>

                                {/* <StripeCheckout
                                    amount="5.00"
                                    // billingAddress
                                    // description="Awesome Product"
                                    image={Environment.apiurl+'/images/logo.png'}
                                    locale="auto"
                                    name="Detailgarage"
                                    stripeKey="pk_test_1kxFnHhyTrYl42GVcNw65WB400QCKzHbxG"
                                    token={this.onToken}
                                    // zipCode
                                /> */}

                                {/* <StripeProvider apiKey="pk_test_1kxFnHhyTrYl42GVcNw65WB400QCKzHbxG">
                                    <div className="example payCard">
                                    <Elements>
                                        <CheckoutForm />
                                    </Elements>
                                    </div>
                                </StripeProvider> */}

                            </Then>
                            <Else>
                            <div class="table-responsive">
                                <table class="table crTable" id="cartItems">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th colspan="2">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* <tr><td colSpan="4"><img src={Environment.apiurl+"/images/no-data-found-images.png"} /></td></tr> */}
                                        
                                    </tbody>
                                </table>
                                <div className="alert alert-danger">Record not found!!</div>
                            </div>
                            
                            </Else>
                            </If>
                            </div>
                        </div>
                        <Alert stack={true} timeout={1000} position='bottom-right' />
                    </div>
                </section>
                <Footer />
                
                <div class="modal payPopup" id="paymentModal">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-body">
                            <button type="button" class="close" data-dismiss="modal" onClick={e => this.closePaymentModel('paymentModal')}> &times;</button>

                            <StripeProvider apiKey="pk_test_1kxFnHhyTrYl42GVcNw65WB400QCKzHbxG">
                                <div className="example payCard">
                                <Elements>
                                   
                                  <CheckoutForm amountdata={this.state.totalamount} onSelectLanguage={this.handleLanguage}/>
                                </Elements>
                                </div>
                            </StripeProvider>
                               
                            </div>
                        </div>
                    </div>
                </div>

                                
            </div>
        )
    }    

}

export default Cart;
