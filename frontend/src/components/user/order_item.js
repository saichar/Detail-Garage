import React, { Component } from 'react';
import { Environment } from '../../../src/components/environment';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import Header from '../../../src/layouts/header';
import Alert from 'react-s-alert';
import Footer from '../../../src/layouts/footer';
import UserLeftMenu from '../../../src/layouts/user_left_menu';
// import UserReview from '../../components/user/user_review';
var dateFormat = require('dateformat');

class OrderItem extends Component{
    constructor (props) {
        super(props);
        this.state = {
            user_id_send :'',
            orderItemList: [],
            orderId:'',
            rating : 0,
            reviewedit:""
            
            // reviewlist:[],
            // itemlist:[],

        }
        const orderId=this.props.postdata;
        var user_id_send = localStorage.getItem("user_id")?localStorage.getItem("user_id"):"";
        this.addRating = this.addRating.bind(this);
        this.GetDetails=this.GetDetails.bind(this);

        axios.post(Environment.apiurl+'/getUserOrderItemList', {orderId:orderId, user_id:user_id_send})
        .then(result => {
            
            if(result){
                this.setState({user_id_send:user_id_send});
                this.setState({orderItemList: result.data.response});
                // this.setState({reviewlist: result.data.response.reviewlist});
            }
        });

    }
    GetDetails(param, param1){
		this.setState({reviewedit:"" });
		var user_id_send = localStorage.getItem("user_id")?localStorage.getItem("user_id"):"";
		if(param!=undefined && param1!=undefined){
			axios.post(Environment.apiurl+'/getReviewdetailByid', {productid:param1, user_id:user_id_send})
        .then(result => {
            console.log(result.data);
            if(result){
                 var resuldata=result.data.response;
                 if(resuldata.length>0){
					 var rating=resuldata[0].rating;
					 
					 document.getElementById("star"+rating+"_"+param).checked = true;
					 document.getElementById('review'+param).value=resuldata[0].review;
					  this.setState({reviewedit:resuldata[0].id });
				 }
            }
        });
		}
	}

    addRating(param, param1){
        alert(param);
        alert(param1)
        this.setState({ rating: param1 });   
    }


    submitReview(param, param1){
		
        //var prorating = document.querySelector('input[name = rating'+param+']:checked').value;
        //alert(prorating);
        var prorating = 0;
        var proratingObj = document.querySelector('input[name = rating'+param+']:checked');
        if(proratingObj) { 
            prorating = proratingObj.value;
        }
        var proReview = document.getElementById('review'+param).value;
        var proId = param1;

        var reviewDetails =
        {
			"reviewedit":this.state.reviewedit,
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
                <div class="orderTable">
                    <div class="table-responsive">
                        <table>
                        <tr>
                            <td><a href={Environment.weburl+'/product/details/'+item.id}><img src={Environment.apiurl+'/products/'+item.image} class="img-fluid" alt="" /></a></td>
                            <td><a href="">{item.product_name}</a></td>
                            <td>${item.amount.toFixed(2)}</td>
                            <td>Arriving Soon <span>{dateFormat(item.addedOn, "mmmm dS' yy")}</span></td>
                            <td><a data-toggle="collapse" data-target={"#wReview"+item.itemId}  onClick={e => this.GetDetails(item.itemId, item.id) }  class="writeReview">Write a review</a></td>
                        </tr>

                        <tr>
                            <td colspan="5"><div id={"wReview"+item.itemId} class="collapse reviewToggle">
                                <div class="reviewIn">

                                    {/* <UserReview postdata={(item.itemId, item.id)}/> */}
                                    <div class="form-group">
                                        <h4>Overall Rating</h4>
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
                                        <textarea placeholder="Write your review" required = "required" name="review" id={"review"+item.itemId}></textarea>
                                    </div>
                                    <button type="button" onClick={(e) => this.submitReview(item.itemId, item.id)}>Submit</button>
                                    </div>

                                </div>
                            </td>
                        </tr>
                        </table>
                    </div>
                </div>
                )}
            </div>
        )
    }    

}

export default OrderItem;
