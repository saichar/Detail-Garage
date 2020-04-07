import React, { Component } from 'react';
import { Environment } from '../../../src/components/environment';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import Header from '../../../src/layouts/header';
import Footer from '../../../src/layouts/footer';
import { strict } from 'assert';
import Alert from 'react-s-alert';
import queryString from 'query-string'
// import CategoryFilter from '../../../src/layouts/filter';

class ProductList extends Component{
    constructor (props) {
        super(props);
        this.state = {
            cartQuantity: '',
            cartTotalAmount: '',
            user_id_send: '',
            wishlistStatus: '',
            wishlistpro: '',
            getProductList: [],
            getCategoryList: [],
            categoryId: '',
            subCategoryId: '',
            sortby: "",
            min_price: "",
            max_price: "",
            page: 0,
            hasMore: true,
            incpage: 1,
            pageNumber: 1,
            propertyslugvalue: "",
            lastitem: 1,
            // search=''
        }
        const searchquery=queryString.parse(this.props.location.search);
        const search=searchquery.s;
      
        var user_id_send = localStorage.getItem("user_id")?localStorage.getItem("user_id"):"";
        // console.log(user_id_send);
        this.addProductIntoWishlist = this.addProductIntoWishlist.bind(this);
        this.getFilterSearchProductList=this.getFilterSearchProductList.bind(this);
        this.getSortedData = this.getSortedData.bind(this);
        this.getSortedPriceRangeData = this.getSortedPriceRangeData.bind(this);
        this.setState({'user_id_send': user_id_send});
        var pagenumber = this.state.pageNumber
        this.fetchMoreData = this.fetchMoreData.bind(this);
        
        if(search!=undefined){
            axios.post(Environment.apiurl+'/searchproduct',{name:search, user_id:user_id_send, pagenumber: pagenumber})
            .then(result => {
                if(result){
                    setImmediate(function() {
                        document.getElementById("loadingimg").style.display = "none";
                        }.bind(this),2000
                    );
                    this.setState({ user_id_send: user_id_send });
                    this.setState({ search: search });
                    this.setState({ pagenumber: pagenumber });                
                    this.setState({getProductList: result.data.response});
                    if (result.data.response.length % 9 > 0) {
                        this.setState({ hasMore: false });
                        this.setState({ lastitem: 0 });
                    }
                }
            });			
		}else{
			axios.post(Environment.apiurl+'/product',{user_id:user_id_send, pagenumber: pagenumber})
            .then(result => {
                if(result){
                    setImmediate(function() {
                        document.getElementById("loadingimg").style.display = "none";
                        }.bind(this),2000
                    );
                    this.setState({ user_id_send: user_id_send });
                    this.setState({ pagenumber: pagenumber });
                    this.setState({getProductList: result.data.response});
                    if (result.data.response.length % 9 > 0) {
                        this.setState({ hasMore: false });
                        this.setState({ lastitem: 0 });
                    }
                }
            });
		}
       
        
        
        axios.get(Environment.apiurl+'/getAllCategoryList')
        .then(result => {
            if(result){
                // console.log(result.data);
                // console.log('kjhj');
                this.setState({user_id_send:user_id_send});
                this.setState({getCategoryList: result.data.response});
                
            }
        });

    }


    fetchMoreData(e) {
        var newpage = this.state.incpage + 1;
        var user_id_send = this.state.user_id_send;
        var search = this.state.search;
        
        setImmediate(function() {
            document.getElementById("loadingimg").style.display = "block";
            }.bind(this),2000
        );

        axios.post(Environment.apiurl+'/searchproduct',{name:search, user_id:user_id_send, pagenumber: newpage })
            .then(result => {
                if (result) {
                    setImmediate(function() {
                        document.getElementById("loadingimg").style.display = "none";
                        }.bind(this),2000
                    );
                    // console.log(result);
                    this.setState({ user_id_send: user_id_send });
                    this.setState({ getProductList: result.data.response });

                    this.setState({ incpage: newpage });
                    if (result.data.response.length % 9 > 0) {
                        this.setState({ hasMore: false });
                        this.setState({ lastitem: 0 });
                    }
                }
            });
    }
    

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
                    // console.log(result.data.status);
                    Alert.success(result.data.message, {
                        position: 'bottom-right',
                        timeout: 1000
                    });
                    document.getElementById('cartcount').innerHTML = result.data.response[0].cartQuantity;
                    document.getElementById('cartTotalAmount').innerHTML = result.data.response[0].cartTotalAmount.toFixed(2);
                }else{
                    Alert.error(result.data.message, {
                        position: 'bottom-right',
                        timeout: 1000
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
                // this.getTodaysDealList();
                Alert.success(result.data.message, {
                    position: 'bottom-right',
                    timeout: 1000
                });
            }else{
                Alert.error(result.data.message, {
                    position: 'bottom-right',
                    timeout: 1000
                });
            }
        });
    }


    getFilterSearchProductList(param, param1) {
        var newpage = this.state.incpage + 1;
        this.setState({categoryId: param});
        this.setState({subCategoryId: param1});
        
        var filterData =
        {
            "user_id":this.state.user_id_send,
            "categoryId":param,
            "subCategoryId":param1,
            "sortby":this.state.sortby,
            "min_price":this.state.min_price,
            "max_price":this.state.max_price,
            "pagenumber":this.state.pagenumber
        };

        // console.log(filterData);
       
        axios.post(Environment.apiurl+"/getFilterSearchProductList", filterData).then(result => {
            setImmediate(function() {
                document.getElementById("loadingimg").style.display = "block";
                }.bind(this),2000
            );
            if(result.data.status=="true"){
                setImmediate(function() {
                    document.getElementById("loadingimg").style.display = "none";
                    }.bind(this),2000
                );
                this.setState({ getProductList: result.data.response });

                this.setState({ incpage: newpage });
                if (result.data.response.length % 9 > 0) {
                    this.setState({ hasMore: false });
                    this.setState({ lastitem: 0 });
                }
            }else{
                this.setState({getProductList:[]});
                console.log("get error from data");
            }
        });
    }



    getSortedData(e) {
        var newpage = this.state.incpage + 1;
        // this.setState({user_id_send: localStorage.getItem("user_id")});
        this.setState({sortby: e.target.value});
        const searchquery=queryString.parse(this.props.location.search);
        const search=searchquery.s;
        var filterData =
        {
            "user_id": this.state.user_id_send,
            "sortby": e.target.value,
            "categoryId": this.state.categoryId,
            "subCategoryId": this.state.subCategoryId,
            "min_price": this.state.min_price,
            "max_price": this.state.max_price,
            "name":search,
            "pagenumber":this.state.pagenumber
        };
         axios.post(Environment.apiurl+'/getFilterSearchProductList', filterData)
        .then(result => {
            setImmediate(function() {
                document.getElementById("loadingimg").style.display = "block";
                }.bind(this),2000
            );

            if (result.data.status == "true") {
                setImmediate(function() {
                    document.getElementById("loadingimg").style.display = "none";
                    }.bind(this),2000
                );
                this.setState({getProductList: result.data.response});

                this.setState({ incpage: newpage });
                if (result.data.response.length % 9 > 0) {
                    this.setState({ hasMore: false });
                    this.setState({ lastitem: 0 });
                }
            } else {
                this.setState({ getProductList: [] });
                console.log("get error from data");
            }
        });
    }

    getSortedPriceRangeData(e){
        var newpage = this.state.incpage + 1;
        const searchquery=queryString.parse(this.props.location.search);
        const search=searchquery.s;
        this.setState({min_price:document.getElementById("min_price").value});
        this.setState({max_price:document.getElementById("max_price").value});
        var filterData =
        {
            "user_id": this.state.user_id_send,
            "name":search,
            "sortby":this.state.sortby,
            "categoryId": this.state.categoryId,
            "subCategoryId": this.state.subCategoryId,
            "min_price":document.getElementById("min_price").value,
            "max_price":document.getElementById("max_price").value,
            "pagenumber":this.state.pagenumber
        };
        // console.log(filterData);
        axios.post(Environment.apiurl+"/getFilterSearchProductList", filterData).then(result => {
            console.log(result);
            setImmediate(function() {
                document.getElementById("loadingimg").style.display = "block";
                }.bind(this),2000
            );
            if(result.data.status=="true"){
                setImmediate(function() {
                    document.getElementById("loadingimg").style.display = "none";
                    }.bind(this),2000
                );
                this.setState({getProductList: result.data.response});
                this.setState({ incpage: newpage });
                if (result.data.response.length % 9 > 0) {
                    this.setState({ hasMore: false });
                    this.setState({ lastitem: 0 });
                }
            }else{
                this.setState({ getProductList: [] });
                console.log("get error from data");
            }
        });
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
                                    <h1>Shop</h1>
                                    <ol class="breadcrumb">
                                        <li><a href={Environment.weburl}>Home</a></li>
                                        <li class="active">Shop</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="listing">
                    <div class="container">
                        <div class="row">

                        <div class="col-md-4 col-lg-3">
                        <button class="open-mypage2">Categories</button>
                            <div id="mypage-info2" class="slideForm"> 
                                <a href="#" class="up"><i class="fa fa-chevron-up" aria-hidden="true"></i></a>
                                <div class="scrollBar" data-simplebar>
                                    <div class="bs-example">
                                    <h3 class="shopTitle">Shop by category</h3>
                                        <div class="accordion" id="accordionExample">
                                        <If condition={this.state.getCategoryList.length > 0}>
                                        <Then>
                                            {this.state.getCategoryList.map((item, index) =>
                                            <div class="card">
                                            
                                                <div class="card-header" id={'heading' + item.id}> 
                                                    <a href="#" class="" data-toggle="collapse" data-target={'#collapse' + item.id}><i class="fas fa-chevron-right"></i>{item.category_name}<i class="fa fas fa-plus"></i></a> 
                                                </div>
                                                
                                                <div id={'collapse' + item.id} class="collapse" aria-labelledby={'heading' + item.id} data-parent="#accordionExample">

                                                    { <If condition={item.subcatidnamearray != null }>
                                                        <Then>
                                                        <ul class="subMenu">
                                                        {Object.keys(item.subcatidnamearray).map((key) => {
                                                        return <li >
                                                        <a href="javaScript:void(0);" onClick={(e)=>this.getFilterSearchProductList(item.id, key)}><i class="fas fa-chevron-right"></i>{ item.subcatidnamearray[key] }</a></li>
                                                            })
                                                        }
                                                        </ul>
                                                        </Then>
                                                    </If> } 
                                                </div> 
                                            </div>
                                            )}
                                        </Then>
                                        </If>
                                        </div>
                                    </div>

                                    <div class="priceFilter">
                                    <h3 class="shopTitle">Filter by price</h3>
                                        <div class="filterimg">
                                            <div id="slider-range" class="price-filter-range" name="rangeInput">
                                            </div>
                                            <div class="priceValue">
                                            <p>
                                                <button onClick={this.getSortedPriceRangeData}>Filter</button>
                                            </p>
                                            <h3>Price:</h3>
                                            <span>$</span><input type="" min="0" max="9900" oninput="validity.valid||(value='1');" id="min_price" class="price-range-field" />
                                            -
                                            <span>$</span><input type="" min="0" max="10000" oninput="validity.valid||(value='10000');" id="max_price" class="price-range-field" />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>


                        <div class="col-md-8 col-lg-9">
                            <div class="showMore">
                                {/* <h3>Showing 1–12 of 16 results</h3> */}
                                <div class="sortBy">
                                    <select onChange={this.getSortedData} value={this.state.sortby} id="sorting" name="sorting" >
                                    <option value="" >Sort by</option>
                                    <option value="1" >New</option>
                                    <option value="2" >Price:Low-High </option>
                                    <option value="3" >Price:High-Low </option>
                                    
                                    </select>
                                </div>
                            </div>
                            <div class="clear"></div>

                                <div class="products">
                                    <div class="row">
                                        <If condition={this.state.getProductList.length > 0}>
                                            <Then>
                                                {this.state.getProductList.map((item, index) => 
                                                <div class="col-6 col-md-6 col-lg-4">
                                                    <div class="itemBox">
                                                        <figure>
                                                            <a href={Environment.weburl+"/product/details/"+item.id}><img src={Environment.apiurl+'/products/'+item.image} class="img-fluid" /></a>
                                                        </figure>
                                                        <div class="addCart">

                                                        <If condition={localStorage.getItem("email")}>
                                                            <Then>
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
                                                                <a href={Environment.weburl + '/product/details/' + item.id} class="comPare"><i class="fas fa-info-circle"></i></a>
                                                            </Then>
                                                            <Else>
                                                                <a href="#" data-toggle="modal" data-target="#loginModal" class="wishList"><i class="fas fa-heart"></i></a>
                                                                <button data-toggle="modal" data-target="#loginModal">Add to cart</button>
                                                                <a href={Environment.weburl + '/product/details/' + item.id} class="comPare"><i class="fas fa-info-circle"></i></a>
                                                            </Else>
                                                        </If> 
                                                             
                                                        </div>
                                                        <h3>
                                                            <a href={Environment.weburl+"/product/details/"+item.id}>{item.product_name}</a>
                                                        </h3>
                                                        <div class="prPrice">${item.price.toFixed(2)}</div>
                                                    </div>
                                                </div>
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
                                            <div class="col-12 col-md-12 col-lg-12">
                                            <div id="loadingimg" style={{display:"none"}}><img src={Environment.apiurl+'/loading.gif'}/></div>
                                                <div className="alert alert-danger">Record not found!!</div>
                                                </div>
                                            </Else>
                                        </If>
                                    </div>
                                </div>
                                
                                <div class="clear"></div>
                            </div>


                        </div>
                        <Alert stack={true} timeout={1000} position='bottom-right' />
                    </div>
                </section>
                <Footer />
            </div>
        )
    }    

}

export default ProductList;
