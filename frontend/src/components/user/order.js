import React, { Component } from 'react';
import { Environment } from '../../../src/components/environment';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import Header from '../../../src/layouts/header';
import Footer from '../../../src/layouts/footer';
import UserLeftMenu from '../../../src/layouts/user_left_menu';
import OrderItem from '../../components/user/order_item';
import Alert from 'react-s-alert';
var dateFormat = require('dateformat');

class Order extends Component{
    constructor (props) {
        super(props);
        this.state = {
            user_id_send :'',
            orderProductList: [],
            page: 0,
            hasMore: true,
            incpage: 1,
            pageNumber: 1,
            propertyslugvalue: "",
            lastitem: 1,
        }

        var user_id_send = localStorage.getItem("user_id")?localStorage.getItem("user_id"):"";

        var pagenumber = this.state.pageNumber
        this.fetchMoreData = this.fetchMoreData.bind(this);

        axios.post(Environment.apiurl+'/getUserOrderList', {user_id:user_id_send, pagenumber: pagenumber})
        .then(result => {
            if(result){
                this.setState({user_id_send:user_id_send});
                this.setState({orderProductList: result.data.response});
            }
        });
    }

    fetchMoreData(e) {
        var newpage = this.state.incpage + 1;
        var user_id_send = this.state.user_id_send;
        
        setImmediate(function() {
            document.getElementById("loadingimg").style.display = "block";
            }.bind(this),2000
        );

        axios.post(Environment.apiurl+'/getUserOrderList', {user_id:user_id_send, pagenumber: newpage})
        .then(result => {
            if (result) {
                setImmediate(function() {
                    document.getElementById("loadingimg").style.display = "none";
                    }.bind(this),2000
                );
                // console.log(result);
                this.setState({user_id_send:user_id_send});
                this.setState({orderProductList: result.data.response});

                this.setState({ incpage: newpage });
                if (result.data.response.length % 9 > 0) {
                    this.setState({ hasMore: false });
                    this.setState({ lastitem: 0 });
                }
            }
        });
    }

    render() {
        return (
            <div>
                <Header />
                <section class="dashBoard">
                    <div class="container-fluid">
                        <div class="row">
                        
                        <UserLeftMenu />

                        <aside class="col-lg-9 col-sm-8">
                            <div class="dashRight">
                            <ul class="breadcrumb">
                                <li><a href="#">My Profile</a></li>
                                <li class="active">My Orders</li>
                            </ul>
                            <div class="table-responsive">
                                <ul class="orderList">
                                <If condition={this.state.orderProductList.length>0}>
                                    <Then>
                                    {this.state.orderProductList.map( (item, index) =>
                                    <li>
                                        <div class="orderData">
                                        <div class="row">
                                            <div class="col-sm-6">
                                            <div class="orderNo">{item.transaction_no}</div>
                                            </div>
                                            <div class="col-sm-6">
                                            <div class="orderDate">Ordered On <span>{dateFormat(item.addedOn, "mmmm dS' yy")}</span></div>
                                            </div>
                                        </div>
                                        </div>
                                        <OrderItem postdata={item.id}/>
                                      
                                        {/* <div class="orderTable">
                                            <div class="table-responsive">
                                                <table>
                                                <tr>
                                                    <td><a href="#"><img src={Environment.apiurl+"/images/order-product1.jpg"} class="img-fluid" alt="" /></a></td>
                                                    <td><a href="">Chuck cupim spare</a></td>
                                                    <td>$310.00</td>
                                                    <td>Arriving Soon <span>Jul 8th '19</span></td>
                                                </tr>
                                                </table>
                                            </div>
                                        </div> */}
                                    </li>
                                    )}

                                        <div class="text-center clearfix" style={{width:"100%"}}>
                                            <div id="loadingimg" style={{display:"none"}}><img src={Environment.apiurl+'/loading.gif'}/></div>
                                                <If condition={this.state.lastitem}>
                                                    <Then>
                                                        <button onClick={this.fetchMoreData} type="button" className="load-more" data={this.state.lastitem} sadas="sdsss">Load more</button>
                                                    </Then>
                                                </If>
                                        </div>
                                    </Then>
                                    <Else>
                                        <div className="alert alert-danger">Record not found!!</div>
                                    </Else>
                                </If>
                                    
                                </ul>
                            </div>
                            </div>
                        </aside>
                        </div>
                        <Alert stack={true} timeout={1000} position='bottom-right' />
                    </div>
                </section>
                <Footer />
            </div>
        )
    }    

}

export default Order;