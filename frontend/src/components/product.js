import React, { Component } from 'react';
import { Environment } from '../../../src/components/environment';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import Header from '../../../src/layouts/header';
import Footer from '../../../src/layouts/footer';
import { strict } from 'assert';
// import CategoryFilter from '../../../src/layouts/filter';

class Product extends Component{
    constructor (props) {
        super(props);
        this.state = {
            getProductList: [],
            getCategoryList: [],
        }
        // let id = this.props.match.params.id;
        // if(id){
        //     axios.get(Environment.apiurl+'/product/'+id)
        //     .then(result => {
        //         if(result){
        //             // console.log(result);
        //             this.setState({getProductList: result.data.response});
        //         }
        //     });
        // } else {
            axios.get(Environment.apiurl+'/product')
            .then(result => {
                if(result){
                    // console.log(result);
                    this.setState({getProductList: result.data.response});
                }
            });
        // }
        

        axios.get(Environment.apiurl+'/getAllCategoryList')
        .then(result => {
            if(result){
                // console.log(result.data);
                this.setState({getCategoryList: result.data.response});
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
                                                
                                                    <ul class="subMenu">
                                                    <If condition={item.subname.length != 'NULL'}>
                                                        <If condition={item.subname.split(",").length != 'NULL'}>
                                                            <Then>
                                                            {item.subname.split(",").map((subitem, index) =>
                                                            <li><a href="#"><i class="fas fa-chevron-right"></i>{ subitem }</a></li>
                                                            )}
                                                            </Then>
                                                        </If>
                                                    </If>            
                                                    </ul>
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
                                                    <button>Filter</button>
                                                </p>
                                                <h3>Price:</h3>
                                            <input type="" min="0" max="9900" oninput="validity.valid||(value='1');" id="min_price" class="price-range-field" />
                                            -
                                            <input type="" min="0" max="10000" oninput="validity.valid||(value='10000');" id="max_price" class="price-range-field" />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>


                        <div class="col-md-8 col-lg-9">
                            <div class="showMore">
                                <h3>Showing 1–12 of 16 results</h3>
                                <div class="sortBy">
                                    <select name="">
                                    <option>Default sorting</option>
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
                                                            <a href="#" class="wishList"><i class="fas fa-heart"></i></a>
                                                            <button>Add to cart</button>
                                                            <a href="#" class="comPare"><i class="fas fa-info-circle"></i></a> 
                                                        </div>
                                                        <h3>
                                                            <a href={Environment.weburl+"/product/details/"+item.id}>{item.product_name}</a>
                                                        </h3>
                                                        <div class="prPrice">${item.price}</div>
                                                    </div>
                                                </div>
                                                )}
                                            </Then>
                                        </If>
                                    </div>
                                </div>

                                <div class="paginate">
                                    <ul class="pagination">
                                    <li><a href="#" class=" "><i class="fas fa-long-arrow-alt-left"></i></a></li>
                                    <li class="active "><span>1</span></li>
                                    <li><a href="#" class=" ">2</a></li>
                                    <li><a href="#" class=" ">3</a></li>
                                    <li><a href="#" class=" "><i class="fas fa-long-arrow-alt-right"></i></a></li>
                                    </ul>
                                    <div class="clearfix"></div>
                                </div>
                                <div class="clear"></div>
                            </div>


                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        )
    }    

}

export default Product;