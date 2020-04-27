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

class EditShippingAddress extends Component{
    constructor (props) {
        super(props);
        this.state = {
            user_id_send :'',
            orderItemList: [],
            stateListArr:[],
            cityListArr:[],
            addressId:''
        }

        const addressId = this.props.postdata;
        console.log(this.props.postdata);
        var user_id_send = localStorage.getItem("user_id")?localStorage.getItem("user_id"):"";

        this.getCityList=this.getCityList.bind(this);

        axios.post(Environment.apiurl+"/getStateList").then(result => {
            if(result.data.status==="true"){
                this.setState({stateListArr: result.data.response});
            }
        });
        

        axios.post(Environment.apiurl+"/getShippingAddressDetails",{address_id:addressId, user_id:user_id_send})
        .then(result => {
            if(result.data.status==="true"){
                console.log(result);
                this.setState({shippingDetailsArr: result.data.response});
            }
        });

    }
    

    getCityList(e){
        var ststeId = document.getElementById("mySelect").value;
        // console.log( "You selected: " + ststeId);
        axios.post(Environment.apiurl+"/getCityList", { "state_id":ststeId } ).then(result => {
            if(result.data.status=="true"){
                // console.log(result.data);
                this.setState({cityListArr: result.data.response});
            } else {
                this.setState({cityListArr:[]});
            }
        });
    }

    render() {
        return (
            <div>
                
                <div class="modal popUp popUp1" id="editAddress">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-body">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <div class="mdLeft">
                                <div class="popupOverlay">
                                    <h3>Update Address</h3>
                                </div>
                                </div>
                                <div class="mdRight">
                                    <div class="formBlock">
                                    <If condition={this.state.sucessMsg2}>
                                        <Then>
                                        <div className="alert alert-success">{this.state.sucessMsg2}</div>
                                        </Then>
                                    </If>
                                    <If condition={this.state.errorMsg2}>
                                        <Then>
                                        <div className="alert alert-danger">{this.state.errorMsg2}</div>
                                        </Then>
                                    </If>
                                    {/* <form onSubmit={this.editShippingAddress.bind(this)} method="post"> */}
                                    <form>
                                        <div class="row">
                                            <aside class="col-sm-6">       
                                                <div class="form-group">
                                                    <label>Country <span>*</span></label>
                                                    <select name="country" required>
                                                        <option value="">-- Select Country--</option>
                                                        <option value="231">United State</option>
                                                    </select>
                                                </div>
                                            </aside>
                                            <aside class="col-sm-6">
                                                <div class="form-group">
                                                    <label>State <span>*</span></label>
                                                    <select name="state" id="mySelect" required onChange={(e)=>this.getCityList()}>
                                                        <option value="">-- Select State--</option>                   
                                                        {(this.state.stateListArr.length > 0)}
                                                        {this.state.stateListArr.map( (item, index) => {
                                                        return <option value={item.stateId} >{item.name}</option>
                                                        })
                                                        }
                                                    </select>
                                                </div>
                                            </aside>
                                        </div>
                                        <div class="row">
                                        
                                            <aside class="col-sm-6">
                                            <div class="form-group">
                                                <label>City <span>*</span></label>
                                                <select name="city" required>
                                                    <option value="">-- Select City--</option>
                                                    {(this.state.cityListArr.length > 0)}
                                                    {this.state.cityListArr.map( (item, index) => {
                                                    return <option value={item.cityId} >{item.name}</option>
                                                    })
                                                    }
                                                </select>
                                            </div>
                                            </aside>


                                            <aside class="col-sm-6">
                                                <div class="form-group">
                                                    <label>Address Type <span>*</span></label>
                                                    <div class="custRadio">
                                                        <label>
                                                            <input type="radio" checked="checked" value="home" name="radio" id="address_type" />
                                                            Home<span class="checkmark"></span> 
                                                        </label>
                                                        <label>
                                                            <input type="radio" value="office" name="radio"  id="address_type" />
                                                            Office<span class="checkmark"></span> 
                                                        </label>
                                                    </div>
                                                </div>
                                            </aside>
                                        </div>
                                        <div class="form-group">
                                            <label>Addres (Area and Street)</label>
                                            <textarea name="address" required></textarea>
                                        </div>
                                        <div class="row btnRow">
                                            <aside class="col-sm-6">
                                            <button type="submit" class="subMit">Save</button>
                                            </aside>
                                        </div>
                                        </form>
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

export default EditShippingAddress;