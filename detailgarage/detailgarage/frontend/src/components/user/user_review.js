import React, { Component } from 'react';
import { Environment } from '../../../src/components/environment';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import Header from '../../../src/layouts/header';
import Alert from 'react-s-alert';
import Footer from '../../../src/layouts/footer';
import UserLeftMenu from '../../../src/layouts/user_left_menu';
import UserReview from '../../components/user/user_review';
var dateFormat = require('dateformat');

class OrderItem extends Component{
    constructor (props) {
        super(props);
        this.state = {
            user_id_send :'',
            orderItemList: [],
            // orderId:'',
            // rating : 0,
            product_id:'',
            item_id:''

        }
        console.log(this.props.postdata);
        const orderId=this.props.postdata;
        var user_id_send = localStorage.getItem("user_id")?localStorage.getItem("user_id"):"";
        this.addRating = this.addRating.bind(this);

        axios.post(Environment.apiurl+'/getUserOrderItemList', {orderId:orderId, user_id:user_id_send})
        .then(result => {
            console.log(result.data);
            if(result){
                this.setState({user_id_send:user_id_send});
                this.setState({orderItemList: result.data.response});
                // this.setState({reviewlist: result.data.response.reviewlist});
            }
        });

    }

    addRating(param, param1){
        alert(param);
        alert(param1)
        this.setState({ rating: param1 });
        
    }


    submitReview(param, param1){
        var prorating = document.querySelector('input[name = rating'+param+']:checked').value;
        var proReview = document.getElementById('review'+param).value;
        var proId = param1;
        // alert(prorating);
        // alert(proReview);
        // alert(param1);

        var reviewDetails =
        {
            "rating":prorating,
            "review":proReview,
            "product_id":proId,
            "user_id":this.state.user_id_send,
        };
        axios.post(Environment.apiurl+"/addProductReview", reviewDetails).then(result => {
            if(result.data.status=="success"){
                Alert.success(result.data.message, {
                    position: 'bottom-right',
                    timeout: 1000
                });
                var reviewArea = document.getElementById("wReview"+param);
                reviewArea.style.display = "none";
            } else {
                Alert.error(result.data.message, {
                    position: 'bottom-right',
                    timeout: 1000
                });
            }
        });
    }

    render() {
        return (
            <div>
                
                {this.state.orderItemList.length>0}
                {this.state.orderItemList.map( (item, index) =>
                <div class="form-group">
                <h4>Overall Rating</h4>
                <div class="reviewIn">
                    <div class="starrating risingstar d-flex text-left flex-row-reverse">
                        <input type="radio" id={"star5_"+item.itemId} name={"rating"+item.itemId} value="5" />
                        <label for={"star5_"+item.itemId} title="5 star"></label>
                        <input type="radio" id={"star4_"+item.itemId} name={"rating"+item.itemId} value="4" />
                        <label for={"star4_"+item.itemId} title="4 star"></label>
                        <input type="radio" id={"star3_"+item.itemId} name={"rating"+item.itemId} value="3" />
                        <label for={"star3_"+item.itemId} title="3 star"></label>
                        <input type="radio" id={"star2_"+item.itemId} name={"rating"+item.itemId} value="2" />
                        <label for={"star2_"+item.itemId} title="2 star"></label>
                        <input type="radio" id={"star1_"+item.itemId} name={"rating"+item.itemId} value="1" />
                        <label for={"star1_"+item.itemId} title="1 star"></label>
                    </div>
                </div>
                <div class="form-group">
                    <h4>Write your review</h4>
                    <textarea placeholder="Write your review" name="review" id={"review"+item.itemId}></textarea>
                </div>
                <button type="button" onClick={(e) => this.submitReview(item.itemId, item.id)}>Submit</button>
                </div>
                )}

            </div>
        )
    }    

}

export default OrderItem;
