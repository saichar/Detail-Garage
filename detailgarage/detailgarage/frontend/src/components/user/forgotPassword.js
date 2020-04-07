import React, { Component } from 'react';
import { Environment } from '../../../src/components/environment';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import { If, Then, Else, Switch, Case} from 'react-if';
import Header from '../../../src/layouts/header';
import Footer from '../../../src/layouts/footer';
import { Form } from 'antd';
import queryString from 'query-string';

class ForgotPassword extends Component{
    constructor (props) {
        super(props);
        this.state = {
            errorMsg:'',
            successMsg:'',
        }
        this.setvalueInstate = this.setvalueInstate.bind(this);
    }

    setvalueInstate= (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    renderPasswordConfirmError(e){
        if(this.state.confirm_password && this.state.new_password){
            if(this.state.confirm_password != this.state.new_password){
                document.getElementById("confirm_password").focus();
                return (
                <div>
                    <div className="alert alert-danger">Please enter the same password.</div>
                </div>
                );
            }else{
                return null;
            }
        }else{
            return null;
        }
    }


    forgotPassword(e){
        e.preventDefault();
        this.setState({
          loading: true
        });
        var querytoken = queryString.parse(this.props.location.search);
        // console.log(querytoken); return false;
        if(this.state.confirm_password != this.state.new_password){
            return false;
        }
        axios.post(Environment.apiurl+"/updatePassword",{ verification_key: querytoken.verification_key, new_password: e.target.new_password.value
        })
        .then(result => {
            if(result.data.status==="success"){
                this.setState({successMsg:result.data.message});
                setTimeout(function () { window.location.href='/'; }, 4000);
            }else{
                this.setState({errorMsg:result.data.message});
                console.log("get error from data");
            }
        })
        .catch(error => {
            console.log(error);
            //errorMsg=error.response.data.message;
            //this.setState({errorMsg: error.result.data.message});
            //console.log(error.response.data.message);
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
                                <h1>                                
                                Reset Password                                
                                </h1>
                                <ol class="breadcrumb">
                                    <li><a href={Environment.weburl}>Home</a></li>
                                    <li class="active">Reset Password</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <section class="contactUs">
                <div class="container">
                    <div class="row">
                        <div class="col-12 col-md-10 offset-md-1">
                            
                            
                            <div class="contactForm">
                            <If condition={this.state.successMsg}>
                                <Then>
                                    <div className="alert alert-success">{this.state.successMsg}</div>
                                </Then>
                            </If>
                            <If condition={this.state.errorMsg}>
                                <Then>
                                    <div className="alert alert-danger">{this.state.errorMsg}</div>
                                </Then>
                            </If>
                                <form onSubmit={this.forgotPassword.bind(this)} method="post">
                                
                                <div class="form-group">
                                    <input type="password" class="inputField" onChange={this.setvalueInstate} placeholder="New Password" name="new_password" minLength="8" id="new_password" required />
                                </div>

                                <div class="form-group">
                                    <input type="password" class="inputField" onChange={this.setvalueInstate} placeholder="Confirm Password" name="confirm_password" minLength="8" id="confirm_password" required/>
                                </div>
                                {this.renderPasswordConfirmError()}
                                
                                <div class="form-group">
                                    {/* <input type="submit" value="SEND" class="btnSend" /> */}
                                    <button type="submit" class="subMit">SEND</button>
                                </div>
                                </form>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </section>


            

            <Footer />
            </div>
        )
    }    

}


ForgotPassword = Form.create()(ForgotPassword);
export default ForgotPassword;