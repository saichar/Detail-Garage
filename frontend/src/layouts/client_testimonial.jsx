import React, { Component } from 'react';
import {Environment} from '../components/environment/index';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import OwlCarousel from 'react-owl-carousel2';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

class ClientTestimonial extends Component {

    constructor (props){
        super(props);

        this.state = {
            testimonialData: [],
        }

        axios.post(Environment.apiurl+'/clientTestimonial')
            .then(result => {
                if(result){
                    console.log(result);
                    this.setState({testimonialData: result.data.response});
                }
            });
    }

    render(){
        const options = {
            margin:30,
            items: 2,
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
                <section class="clientWords">
                <figure>
                    <img src={Environment.apiurl+"/images/testi-image.jpg"} class="img-fluid" />
                </figure>
                    <div class="container">
                        <div class="testimonials">
                            <h2>Client Says</h2>
                            {/* <div id="testi" class="owl-carousel owl-theme"> */}
                            {this.state.testimonialData.length>0?
                            <OwlCarousel id="testi" options={options} >
                            {this.state.testimonialData.map( (item, index) =>
                                <div class="item">
                                    <div class="comments">
                                        <div class="pic">
                                            <img src={Environment.apiurl+'/testimonials/'+item.image} />
                                        </div>
                                        <h3>{item.name} <span>{item.address}</span></h3>
                                        <p>{ ReactHtmlParser(item.description) }</p>
                                    </div>
                                </div>
                            )}
                            </OwlCarousel>
                            :""}    


                            {/* </div> */}
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default ClientTestimonial;