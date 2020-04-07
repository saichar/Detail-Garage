import React, { Component } from 'react';
import {Environment} from '../components/environment/index';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import OwlCarousel from 'react-owl-carousel2';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

class Banner extends Component {

    constructor (props){
        super(props);

        this.state = {
            bannerList: [],
        //     quickLinks: [],
        //     gallery: [],
        //     weather: [],
        }

        // console.log(Environment.apiurl);
        axios.post(Environment.apiurl+'/getBannerList')
            .then(result => {
                if(result){
                    // console.log(result);
                    this.setState({bannerList: result.data.response});
                }
            });
    }

    render(){
        const options = {
            margin:10,
            items: 1,
            // dots:false,
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

        return (
            <div>
                <section class="slider">
                    {/* <div id="slide" class="owl-carousel owl-theme"> */}

                    {this.state.bannerList.length>0?
                    <OwlCarousel ref="car" options={options} >
                        {this.state.bannerList.map( (item, index) => 
                            <div class="item">
                                <div class="slideCaption">
                                    <div class="container">
                                        <div class="row">
                                            <aside class="col-lg-5 col-sm-7">
                                            <h1>{item.title}</h1>
                                            { ReactHtmlParser(item.description) }
                                            </aside>
                                            <aside class="col-lg-7 col-sm-5"> <img src={Environment.apiurl+'/banners/'+item.image} class="img-fluid" /> </aside>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </OwlCarousel>
                    :""}
                </section>
            </div>
        )
    }
}

export default Banner;
