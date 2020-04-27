import React, { Component } from 'react';
import {Environment} from '../components/environment/index';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
// import OwlCarousel from 'react-owl-carousel2';

class CategoryFilter extends Component {

    constructor (props){
        super(props);

        this.state = {            
            getCategoryList: [],
        //     quickLinks: [],
        //     gallery: [],
        //     weather: [],
        }

        // console.log(Environment.apiurl);
        axios.get(Environment.apiurl+'/getAllCategoryList')
        .then(result => {
            if(result){
                // console.log(result.data);
                this.setState({getCategoryList: result.data.response});
            }
        });
    }

    render(){      

        return (
            <div>
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
                                                <li><a href="#"><i class="fas fa-chevron-right"></i>Chemical Guys</a></li>
                                                <li><a href="#"><i class="fas fa-chevron-right"></i>Chemical Guys</a></li>
                                                <li><a href="#"><i class="fas fa-chevron-right"></i>Chemical Guys</a></li>
                                                <li><a href="#"><i class="fas fa-chevron-right"></i>Chemical Guys</a></li>
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
            </div>
        )
    }
}

export default CategoryFilter;
