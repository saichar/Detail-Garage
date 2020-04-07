import React, { Component } from 'react';
import { Environment } from '../../../src/components/environment';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import Header from '../../../src/layouts/header';
import UserLeftMenu from '../../../src/layouts/user_left_menu';
import Footer from '../../../src/layouts/footer';
import Alert from 'react-s-alert';


class Wishlist extends Component{
    constructor (props) {
        super(props);
        this.state = {
            user_id_send :'',
            wishlistProduct: [],
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

        axios.post(Environment.apiurl+'/getUserWishlistProduct', {user_id:user_id_send, pagenumber: pagenumber})
        .then(result => {
            if(result){
                this.setState({user_id_send:user_id_send});
                this.setState({wishlistProduct: result.data.response});
            }
        });
    }

    deleteWishlistItem(param){
        var wishlistItem =
        {
            "id":param,
            "user_id":this.state.user_id_send,
        };

        axios.post(Environment.apiurl+"/deleteWishlistItem", wishlistItem).then(result => {
            // console.log(result.data);
            if(result.data.status=="success"){
                document.getElementById("wishlist_"+param).remove();
                this.setState({sucessMsg: result.data.message});
                localStorage.setItem("sucessMsg", result.data.message);
            } else if(result.data.status=="deleted"){
                document.getElementById("wishlist_"+param).remove();
                this.setState({sucessMsg: result.data.message});
                localStorage.setItem("sucessMsg", result.data.message);
                setTimeout(function () {
                    window.location.reload(1);
                }, 1000);
            } else {
                this.setState({sucessMsg3: result.data.message});
                localStorage.setItem("sucessMsg", result.data.message);
            }
            // setTimeout(function () {
            //     window.location.reload(1);
            // }, 1000);
        });
    }


    fetchMoreData(e) {
        var newpage = this.state.incpage + 1;
        var user_id_send = this.state.user_id_send;
        
        setImmediate(function() {
            document.getElementById("loadingimg").style.display = "block";
            }.bind(this),2000
        );

        axios.post(Environment.apiurl+'/getUserWishlistProduct', {user_id:user_id_send, pagenumber: newpage})
        .then(result => {
            if (result) {
                setImmediate(function() {
                    document.getElementById("loadingimg").style.display = "none";
                    }.bind(this),2000
                );
                // console.log(result);
                this.setState({user_id_send:user_id_send});
                this.setState({wishlistProduct: result.data.response});

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
                                        <li class="active">My Wishlist</li>
                                    </ul>

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

                                    <div class="table-responsive">
                                        <ul class="orderList">
                                        <If condition={this.state.wishlistProduct.length>0}>
                                        <Then>
                                        {this.state.wishlistProduct.map( (item, index) =>
                                            <li id={'wishlist_'+item.w_id}>                                    
                                                <div class="orderTable">
                                                    <div class="table-responsive">
                                                        <table>
                                                            <tr>
                                                                <td><a class="ordProdImg" href={Environment.weburl+"/product/details/"+item.id}><img src={Environment.apiurl+'/products/'+item.image} class="img-fluid" alt="" /></a></td>
                                                                <td><a href={Environment.weburl+"/product/details/"+item.id}>{item.product_name}</a></td>
                                                                <td align="center">${item.price.toFixed(2)}</td>
                                                                <td align="center"><a href="javascript:void(0);" onClick={e => window.confirm("Are you sure you wish to delete this item?") && this.deleteWishlistItem(item.w_id) }class="remove"><i class="fas fa-trash-alt"></i></a></td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </div>
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
                                            {/* <li>
                                                <img src={Environment.apiurl+"/images/no-data-found-images.png"} />
                                            </li> */}
                                            <div className="alert alert-danger">Record not found!!</div>
                                        </Else>
                                        </If>
                                        
                                        </ul>
                                    </div>
                                </div>
                            </aside>
                        </div>
                        <Alert stack={true} timeout={3000} position='bottom-right' />
                    </div>
                </section>
                <Footer />
            </div>
        )
    }    

}

export default Wishlist;