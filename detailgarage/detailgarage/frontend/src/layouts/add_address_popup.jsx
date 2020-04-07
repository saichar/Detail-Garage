import React, { Component } from 'react';
import {Environment} from '../components/environment/index';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';

class AddAddressPopup extends Component {

    constructor (props){
        super(props);

        this.state = {
            user_id: localStorage.getItem('user_id'),
            current_password : '',
            new_password : '',
            confirm_password : '',
            errorMsg3:'',
            sucessMsg3:'',
            errorMsg1:'',
            sucessMsg1:'',
            errorMsg2:'',
            sucessMsg2:'',
            sucessMsg:'',
            stateListArr:[],
            cityListArr:[],
            stateId:''
        }
        this.getCityList = this.getCityList.bind(this);

        // axios.get(Environment.apiurl+'getInformation')
        //     .then(result => {
        //         if(result){
        //             this.setState({information: result.data.response});
        //         }
        //     });

        
        axios.post(Environment.apiurl+"/getStateList").then(result => {
            if(result.data.status==="true"){
                this.setState({stateListArr: result.data.response});
            }
        });
       

        this.setvalueInstate = this.setvalueInstate.bind(this);
    }

    setvalueInstate= (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    addShippingAddress(e){
        document.getElementById('addrBtn').disabled = true;
        var addressType = document.querySelector('input[name = "radio"]:checked').value;
        // alert(deliveryType);
        // alert(e.target.country.value);
        e.preventDefault();
        this.setState({
          loading: true
        });

        axios.post(Environment.apiurl+"/addShippingAddress",{
            user_id:localStorage.getItem('user_id'),
            address_type:addressType,
            country:e.target.country.value,
            state:e.target.state.value,
            city: e.target.city.value,
            address: e.target.address.value,
        })
        .then(result => {
            // console.log(result.data);
            if(result.data.status==="success"){
                // setTimeout(function () { document.getElementById('pwd').click();}, 4000); 
                this.setState({sucessMsg2: result.data.message});
                localStorage.setItem("sucessMsg", result.data.message);
                setTimeout(function () { window.location.reload(); }, 1000);
            }else{
                this.setState({errorMsg2: result.data.message});
            }
        })
    }


    getCityList(e){
        //e.preventDefault();
        // var stateId = document.getElementById("mySelect").value;
        var stateId = e.target.value;
        // alert(e.target.value);
        axios.post(Environment.apiurl+"/getCityList", { "state_id":stateId } ).then(result => {
            if(result.data.status=="true"){
                // console.log(result.data);
                this.setState({cityListArr: result.data.response});
            } else {
                this.setState({cityListArr:[]});
            }
        });
    }
    

    render(){
        
        // const statearr = JSON.parse(this.state.stateList);
        
        return (
            <div>
                <div class="modal popUp popUp1" id="addNew">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-body">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <div class="mdLeft">
                                <div class="popupOverlay">
                                    <h3>Add New Address</h3>
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
                                    <form onSubmit={this.addShippingAddress.bind(this)} method="post">
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
                                                    <select name="state" id="mySelect" required onChange={(e)=>this.getCityList(e) && this.setvalueInstate()}>
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
                                            <button type="submit" id="addrBtn" class="subMit">Save</button>
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

export default AddAddressPopup;