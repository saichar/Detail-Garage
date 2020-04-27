import React, { Component } from 'react';
import { Environment } from '../../../src/components/environment';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import Header from '../../../src/layouts/header';
import Footer from '../../../src/layouts/footer';


class Cart extends Component{
    constructor (props) {
        super(props);
        this.state = {
            // user_id_send :'',
            orderlistProduct : [],
            transactionNo : '',
            totalAmount:0,
            itemAmount : 0,
            shippingAmount : 0,
            // subTotalAmount : 0,
            // subFinalAmount : 0,
        }
        var user_id_send = localStorage.getItem("user_id")?localStorage.getItem("user_id"):"";

        

        axios.post(Environment.apiurl+'/orderConfirmation', {user_id:user_id_send})
        .then(result => {
            console.log(result);
            // console.log(result.data);
            if(result){
                if(result.data.response.length>0){
                    this.setState({ transactionNo: result.data.response[0].transaction_no });
                    this.setState({ itemAmount: result.data.response[0].totAmt });
                    this.setState({ totalAmount: result.data.response[0].total_amount });
                    this.setState({ shippingAmount: result.data.response[0].shipping_amount });
                    this.setState({user_id_send:user_id_send});
                    this.setState({orderlistProduct: result.data.response});
                }
            }
        });
        // alert(this.state.transactionNo);
    }
    


    render() {
        return (
            <div>
                <Header />


                <section class="pageBanner">
                    <figure><img src={Environment.apiurl+"/images/page-banner.jpg"} class="img-fluid" /></figure>
                    <div class="overLay_1">
                        <div class="container">
                            <div class="row">
                                <div class="col-sm-12 text-center">
                                    <h1>Order Details</h1>
                                    <ol class="breadcrumb">
                                        <li><a href={Environment.webrl}>Home</a></li>
                                        <li class="active">Order Confirmation</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <section class="cartPage">
                    <div class="container">
                    <div className="alert alert-success">Your order has been confirmed, see details !!</div>
                        <div class="row">
                            <div class="col-12">
                            <If condition={this.state.orderlistProduct.length > 0}>
                            <div class="table-responsive">
                                <table class="table crTable" id="cartItems">
                                    <thead>
                                        <tr>
                                            <th style={{ background: "#FFFDE5" }}>Product</th>
                                            <th style={{ background: "#FFFDE5" }}>Price</th>
                                            <th style={{ background: "#FFFDE5" }}>Quantity</th>
                                            <th style={{ background: "#FFFDE5" }} colspan="2">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.orderlistProduct.length>0}
                                    {this.state.orderlistProduct.map( (item, index) =>
                                    
                                    <tr id={'cart_'+item.cart_id}>
                                        <input type='hidden' name='proPrice' id={'proPrice_'+item.cart_id} value={item.price} />

                                        <td data-label="Product"><figure class="prodImg"><img src={Environment.apiurl+'/products/'+item.image} /></figure> <h4>{item.product_name}</h4></td>
                                        <td data-label="Price">${item.price.toFixed(2)}</td>
                                        <td data-label="Quantity">{item.quantity}</td>
                                        <td data-label="Total"> $<span id={'proToatlPrice_'+item.cart_id}>{item.amount.toFixed(2)}</span></td>
                                    </tr>
                                    )}
                                        
                                    </tbody>
                                </table>
                                </div>
                            </If>
                                <div class="table-responsive">
                                    <table class="table table-bordered crTable" id="cartItems">
                                        <thead>
                                            <tr>
                                                <th colspan="2" style={{ background: "#FFFDE5" }}>Transaction No : {this.state.transactionNo}</th>
                                                
                                                <th colspan="2" style={{ background: "#FFFDE5" }}>Amount : ${this.state.itemAmount.toFixed(2)}</th>
                                                
                                                <th colspan="2" style={{ background: "#FFFDE5" }}>Shipping Charge : ${this.state.shippingAmount.toFixed(2)}</th>
                                                
                                                <th colspan="2" style={{ background: "#FFFDE5" }}>Sub Total : ${this.state.totalAmount.toFixed(2)}</th>
                                            </tr>
                                            {/* <tr>
                                                <th colspan="2">Transaction No</th>
                                                <th>{this.state.transactionNo}</th>
                                                <th colspan="2">Total Amount</th>
                                                <th>${this.state.totalAmount.toFixed(2)}</th>
                                            </tr> */}
                                        </thead>
                                        
                                    </table>
                                </div>


                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        )
    }    

}

export default Cart;