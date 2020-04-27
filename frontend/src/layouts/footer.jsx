import React, { Component } from 'react';
import {Environment} from '../components/environment/index';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import LoginPopup from './login_popup';
import SignupPopup from './signup_popup';
import ForgotPasswordPopup from './forgot_password_popup';
import ChangePasswordPopup from './change_password_popup';
import AddAddressPopup from './add_address_popup';

class Footer extends Component {

    constructor (props){
        super(props);

        this.state = {
            settingInformation: [],
            fullyear: "",
        }

        var now = new Date();
        var fullyears = now.getFullYear();

        axios.post(Environment.apiurl+'/getSettingInformation')
        .then(result => {
            if(result){
                // console.log(result);
                this.setState({settingInformation: result.data.response});
                this.setState({fullyear: fullyears});
            }
        });
    }

    render(){
        return (
            <div>
                <footer>
                    <div class="footerMain">
                        <div class="container">
                        <div class="row">
                            <div class="col-lg-3 col-sm-6">
                            <h3>Customer service</h3>
                            <ul class="links">
                                <li><a href={Environment.weburl+"/page/about-us"}>About Us</a></li>
                                <li><a href={Environment.weburl+"/page/terms-conditions"}>General Terms &amp; Conditions</a></li>
                                <li><a href={Environment.weburl+"/page/disclaimer"}>Disclaimer</a></li>
                                <li><a href={Environment.weburl+"/page/privacy-policy"}>Privacy Policy</a></li>
                                <li><a href={Environment.weburl+"/contact-us"}>Customer Support</a></li>
                            </ul>
                            </div>
                            <div class="col-lg-3 col-sm-6">
                            <h3>Products</h3>
                            <ul class="links">
                                <li><a href={Environment.weburl+"/product"}>All Products</a></li>
                                {/* <li><a href={Environment.weburl+"/product"}>New Products</a></li> */}
                            </ul>
                            </div>
                            <div class="col-lg-3 col-sm-6">
                            <h3> My account</h3>
                            <ul class="links">
                            <If condition={localStorage.getItem("email")}>
                                <Then>
                                    <li><a href={Environment.weburl+"/user/my-account"} >My Account</a></li>
                                    <li><a href={Environment.weburl+"/user/order"}>My Orders</a></li>
                                    <li><a href={Environment.weburl+"/user/wishlist"}>My Wishlist</a></li>
                                </Then>
                                <Else>
                                    <li><a href="#" data-toggle="modal" data-target="#loginModal" >Register</a></li>
                                </Else>
                            </If>
                                
                                
                            </ul>
                            </div>
                            <div class="col-lg-3 col-sm-6">
                            <h3>Store Information</h3>
                            <ul class="conInfo">
                                {/* <li><i class="fas fa-map-marker-alt"></i>406 Kamehamesha Highway Pearl City, Hawaii 96782</li>
                                <li><i class="fas fa-phone"></i>808-773-7362</li>
                                <li><a href="#"><i class="far fa-envelope"></i>sales@yourcompany.com</a></li> */}
                                <If condition={this.state.settingInformation.length > 0}>
                                <Then>
                                    {this.state.settingInformation.map((item, index) => 
                                        <li><i class={item.bootstrap_class}></i>{item.value}</li>
                                    )}                            
                                </Then>
                                </If>
                            </ul>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div class="copyRight">
                        <div class="container">&copy; {this.state.fullyear} detailgarage.com. All Rights Reserved. </div>
                    </div>
                </footer>

                <LoginPopup />
                <SignupPopup />
                <ForgotPasswordPopup />
                <ChangePasswordPopup />
                <AddAddressPopup />

            </div>
        )
    }
}

export default Footer;