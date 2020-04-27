import React, { Component } from 'react';
import { Environment } from '../../../src/components/environment';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import Header from '../../../src/layouts/header';
import Footer from '../../../src/layouts/footer';
import UserLeftMenu from '../../../src/layouts/user_left_menu';
import Alert from 'react-s-alert';
import EditShippingAddress from '../../components/user/edit_shipping_address';


class MyAccount extends Component{
    constructor (props) {
        super(props);
        this.state = {
            user_id_send :'',
            getUserDetail: [],
            addresslist:[],
            full_name:'',
            mobile:'',
            address_id:'',
            stateListArr:[],
            cityListArr:[],
            shippingDetailsArr:[],
        }


        let user_id_send = localStorage.getItem("user_id")?localStorage.getItem("user_id"):"";
        this.setState({'user_id_send': localStorage.getItem("user_id")?localStorage.getItem("user_id"):""});

        this.uploadimage=this.uploadimage.bind(this);
        // this.editShippingAddress = this.editShippingAddress.bind(this);

        axios.post(Environment.apiurl+'/getUserDetails',{user_id:user_id_send})
        .then(result => {
            if(result){
                // console.log(result.data);
                this.setState({user_id_send:user_id_send});
                this.setState({getUserDetail: result.data.response.userDetails});
                this.setState({addresslist: result.data.response.addressList});

                // console.log(result.data.response.userDetails[0].first_name);
                // this.setState({full_name:result.data.response.userDetails[0].first_name+' '+result.data.response.userDetails[0].last_name});
                this.setState({first_name:result.data.response.userDetails[0].first_name});
                this.setState({last_name:result.data.response.userDetails[0].last_name});
                this.setState({mobile:result.data.response.userDetails[0].mobile});
            }
        });

        this.getCityList=this.getCityList.bind(this);
        // this.getAllCityList=this.getAllCityList.bind(this);
        this.editShippingAddress=this.editShippingAddress.bind(this);
        

        axios.post(Environment.apiurl+"/getStateList").then(result => {
            if(result.data.status==="true"){
                this.setState({stateListArr: result.data.response});
            }
        });
        
        this.setvalueInstate = this.setvalueInstate.bind(this);

    }

    
    setvalueInstate = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }


    deleteShippingAddress(param){
        var addressItem =
        {
            "id":param,
            "user_id":this.state.user_id_send,
        };
        axios.post(Environment.apiurl+"/deleteShippingAddress", addressItem).then(result => {
            if(result.data.status=="success"){
                document.getElementById("edtAddrs_"+param).remove();
                // this.setState({sucessMsg: result.data.message});
                // localStorage.setItem("sucessMsg", result.data.message);
                Alert.success(result.data.message, {
                    position: 'bottom-right',
                    timeout: 1000
                });
            } else {
                // this.setState({sucessMsg3: result.data.message});
                // localStorage.setItem("sucessMsg", result.data.message);
                Alert.error(result.data.message, {
                    position: 'bottom-right',
                    timeout: 1000
                });
            }
        });
    }


    uploadimage(param, e){
        // console.log(e.target.files[0]);
        e.preventDefault();
        const data = new FormData();
        
        data.append('Image', e.target.files[0]);
        data.append('id', param);
        
        axios.post(Environment.apiurl +"/uploadUserImage", data).then(result => { 
            // console.log(result.data.status);
            if(result.data.status=="success"){
                window.location.href = Environment.weburl+'/user/my-account';
            }else{
                console.log("get error from data");
            }
        })
        .catch(error => {
        });
    }


    editUserDetails(param){
        var showDetails = document.querySelectorAll('.showDetails'),
            i = 0,
            l = showDetails.length;

        for (i; i < l; i++) {
            showDetails[i].style.display = 'none';
        }

        var editDetails = document.querySelectorAll('.editDetails'),
            i = 0,
            l = editDetails.length;

        for (i; i < l; i++) {
            editDetails[i].style.display = 'block';
        }
    }

    cancelUserDetails(param){
        var editDetails = document.querySelectorAll('.editDetails'),
            i = 0,
            l = editDetails.length;

        for (i; i < l; i++) {
            editDetails[i].style.display = 'none';
        }

        var showDetails = document.querySelectorAll('.showDetails'),
            i = 0,
            l = showDetails.length;

        for (i; i < l; i++) {
            showDetails[i].style.display = 'block';
        }
    }

    saveUserDetails(param){
        var first_name = document.getElementById("first_name").value;
        var last_name = document.getElementById("last_name").value;
        var mobile = document.getElementById("mobile").value;

        var valid=false;

        if(first_name == ''){
            // document.getElementById("fname_msg").innerHTML = "Please enter your first name";  
            valid=false;
        } else if(last_name == ''){
            // document.getElementById("lname_msg").innerHTML = "Please enter your last name";  
            valid=false;
        } else if(mobile == ''){
            // document.getElementById("mobile_msg").innerHTML = "Please enter contact number";  
            valid=false;
        } else {
            valid=true;
        }
        
        if(valid == true){
            var userDetails =
            {
                "id":param,
                "first_name":first_name,
                "last_name":last_name,
                "mobile":mobile,
                
            };

            axios.post(Environment.apiurl+"/saveUserDetails", userDetails).then(result => {
                if(result.data.status=="success"){
                    window.location.href = Environment.weburl+'/user/my-account';
                } else {
                    window.location.href = Environment.weburl+'/user/my-account';
                }
            });
        }
        
    }


    editShippingAddress(item, item1){
        // alert(item1);
        axios.post(Environment.apiurl+"/getShippingAddressDetails",{address_id:item, user_id:this.state.user_id_send, state_id:item1})
        .then(result => {
            // console.log(result);
            if(result.data.status==="true"){
                // console.log(result.data.response[0].city);
                
                this.setState({shippingDetailsArr: result.data.response.shippingDetails});
                this.setState({cityListArr: result.data.response.cityList});
                // console.log(result.data.response.shippingDetails[0].address_1);
                // this.setState({shippingDetailsArr: result.data.response});
                this.setState({address:result.data.response.shippingDetails[0].address_1});
                this.setState({city:result.data.response.shippingDetails[0].city});
                this.setState({state:result.data.response.shippingDetails[0].state});
                this.setState({country:result.data.response.shippingDetails[0].country});
                this.setState({type:result.data.response.shippingDetails[0].type});
                this.setState({address_id:item});
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


    // getAllCityList(e){
    //     alert('Hello');
    //     // console.log( "You selected: " + ststeId);
    //     axios.post(Environment.apiurl+"/getCityList", { "state_id":this.state.state } ).then(result => {
    //         if(result.data.status=="true"){
    //             // console.log(result.data);
    //             this.setState({cityListArr: result.data.response});
    //         } else {
    //             this.setState({cityListArr:[]});
    //         }
    //     });
    // }


    updateShippingAddress(e){
        var addressType = document.querySelector('input[name = "radio"]:checked').value;
        e.preventDefault();
        this.setState({
          loading: true
        });

        axios.post(Environment.apiurl+"/updateShippingAddress",{
            user_id:localStorage.getItem('user_id'),
            address_type:addressType,
            country:e.target.country.value,
            state:e.target.state.value,
            city: e.target.city.value,
            address: e.target.address.value,
            address_id: this.state.address_id,
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
                                    
                                <form>
                                        {this.state.getUserDetail.length>0}
                                        {this.state.getUserDetail.map( (item, index) =>
                                        <div class="row">
                                            <div class="col-lg-3 text-center">
                                            <figure class="userImage">
                                            <If condition={item.profile_image != ""}>
                                                <Then>
                                                    <img src={Environment.apiurl+'/users/'+item.profile_image} alt="" class="img-fluid" />
                                                    
                                                </Then>
                                                <Else>
                                                    <img src={Environment.apiurl+"/uploads/users/noimage.png"} alt="" class="img-fluid" style={{ height:'70px', width:'100px' }} />
                                                </Else>
                                            </If>

                                                
                                                <div class="upload">
                                                <i class="fas fa-camera"></i>
                                                    <input type="file" name="upload"/>
                                                    <input name="user_image" id="user_image" ref="image" type="file" onChange={(e) => this.uploadimage(item.id, e)} />
                                                </div>
                                                </figure>
                                            </div>
                                                
                                            <div class="col-lg-6">
                                                <h2 class="showDetails">{item.first_name} {item.last_name}</h2>
                                                <input class="editDetails inpField" type="text" name="first_name" id="first_name" value={this.state.first_name}  onChange={this.setvalueInstate} style={{ display: "none" }}  required="required" />
                                                <span id="fname_msg"></span>
                                                <input class="editDetails inpField" type="text" name="last_name" id="last_name" value={this.state.last_name}  onChange={this.setvalueInstate} style={{ display: "none" }} required="required" />
                                                <span id="lname_msg"></span>
                                                <a href="#" class="anLink1" data-toggle="modal" data-target="#pwd">Change Password</a>
                                                <div class="clear"></div>
                                            <ul class="infos">
                                                <li>{item.email}</li>
                                                <li class="showDetails">{item.mobile}</li>
                                                <input class="editDetails inpField" type="text" name="mobile" id="mobile" value={this.state.mobile} onChange={this.setvalueInstate} style={{ display: "none" }} required="required" />
                                                <span id="mobile_msg"></span>
                                            </ul>
                                            
                                            <div class="btnSets">
                                                <button class="showDetails" type="button" style={{ display: "block" }} onClick={e => this.editUserDetails(item.id) }>Edit <i class="fas fa-pencil-alt"></i></button>
                                                <button class="editDetails" type="button" style={{ display: "none" }} onClick={e => this.cancelUserDetails(item.id) }>Cancel <i class="fas fa-times"></i></button>
                                                <button class="editDetails" type="submit" onClick={e => this.saveUserDetails(item.id) } style={{ display: "none" }}>Save <i class="far fa-save"></i></button>
                                            </div>
                                            
                                            <div class="clear"></div>
                                            
                                        
                                            </div>
                                        </div>
                                        )}
                                    </form>

                                    <div class="row">
                                    <div class="col-lg-3"></div>
                                    <div class="col-lg-6">
                                    <h3>Manage Addresses</h3>
                                        <a href="#" class="anLink2" data-toggle="modal" data-target="#addNew">Add More</a>
                                            
                                            {this.state.addresslist.length>0}
                                            {this.state.addresslist.map( (item, index) =>
                                            <div class="edtAddrs" id={'edtAddrs_'+item.id}>
                                                <span><strong>{item.type.toUpperCase()}</strong></span>
                                                <span>{item.address_1}</span>
                                                {item.city.charAt(0).toUpperCase() + item.city.slice(1)}, {item.state.charAt(0).toUpperCase() + item.state.slice(1)}, {item.country.charAt(0).toUpperCase() + item.country.slice(1)}
                                                <div class="dotThree" data-toggle="collapse" data-target={'#togLinks'+item.id}>
                                                    <i class="fas fa-ellipsis-v"></i>
                                                    <div id={'togLinks'+item.id} class="togLinks collapse">
                                                        <ul>
                                                            <li><a href="#" onClick={e =>this.editShippingAddress(item.id, item.state_id)} data-toggle="modal" data-target="#editAddress">Edit</a></li>

                                                            <li><a href="javascript:void(0);" onClick={e => window.confirm("Are you sure you wish to delete this item?") && this.deleteShippingAddress(item.id) }>Delete</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            
                                            )}
                                        </div>
                                        </div>

                                </div>
                            </aside>
                        </div>
                        <Alert stack={true} timeout={1000} position='bottom-right' />
                    </div>
                    
                </section>
                
                {/* <EditShippingAddress postdata={this.state.address_id}/> */}

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
                                        
                                        <form onSubmit={this.updateShippingAddress.bind(this)} method="post">
                                            <div class="row">
                                                <aside class="col-sm-6">       
                                                    <div class="form-group">
                                                        <label>Country <span>*</span></label>
                                                        <select name="country" required>
                                                            <option value="">-- Select Country--</option>
                                                            <option value="231" selected>United State</option>
                                                        </select>
                                                    </div>
                                                </aside>
                                                <aside class="col-sm-6">
                                                    <div class="form-group">
                                                        <label>State <span>*</span></label>
                                                        <select name="state" id="mySelect" required onChange={(e)=>this.getCityList()}>
                                                            <option value="">-- Select State --</option>                   
                                                            {(this.state.stateListArr.length > 0)}
                                                            {this.state.stateListArr.map( (item, index) => {
                                                            return <option value={item.stateId} selected={ this.state.state == item.stateId? "selected" : ""} >{item.name}</option>
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
                                                        <option value="">-- Select City --</option>
                                                        {(this.state.cityListArr.length > 0)}
                                                        {this.state.cityListArr.map( (item, index) => {
                                                        return <option value={item.cityId} selected={ this.state.city == item.cityId? "selected" : ""} >{item.name}</option>
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
                                                                <input type="radio" checked={ this.state.type == 'home'? "checked" : ""} value="home" name="radio" id="address_type" />
                                                                Home<span class="checkmark"></span> 
                                                            </label>
                                                            <label>
                                                                <input type="radio" checked={ this.state.type == 'office'? "checked" : ""} value="office" name="radio"  id="address_type" />
                                                                Office<span class="checkmark"></span> 
                                                            </label>
                                                        </div>
                                                    </div>
                                                </aside>
                                            </div>
                                            <div class="form-group">
                                                <label>Addres (Area and Street)</label>
                                                <textarea name="address" required value={this.state.address} onChange={this.setvalueInstate}></textarea>
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


                <Footer />
            </div>
        )
    }    

}

export default MyAccount;