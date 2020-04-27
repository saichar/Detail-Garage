import React, { Component } from 'react';
import {Environment} from '../components/environment/index';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';

class SignupPopup extends Component {

    constructor (props){
        super(props);

        this.state = {
            email_id: localStorage.getItem('email'),
            password : '',
            confirm_password : '',
            errorMsg3:'',
            sucessMsg3:'',
            errorMsg1:'',
            sucessMsg1:'',
            errorMsg2:'',
            sucessMsg2:'',
            sucessMsg:'',
        }
        this.setvalueInstate = this.setvalueInstate.bind(this);
    }

    setvalueInstate= (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    renderPasswordConfirmError(e){
        if(this.state.confirm_password && this.state.password){
            if(this.state.confirm_password != this.state.password){
                document.getElementById("confirm_password").focus();
                return (
                    <div>
                        <label className="alert alert-danger">Please enter the same password.</label>
                    </div>
                    );
            }else{
                return null;
            }
        }else{
            return null;
        }
    }


    handleSubmit (e) {
        e.preventDefault();
        this.setState({
          loading: true
        });

        if(this.state.confirm_password != this.state.password){
            return false;
        }

        axios.post(Environment.apiurl+"/signup",{
            first_name: e.target.first_name.value,
            last_name: e.target.last_name.value,
            email:e.target.email.value,
            mobile: e.target.mobile.value,
            password: e.target.password.value
          })
        .then(result => {
            // console.log(result.data);
            if(result.data.status==="success"){
                setTimeout(function () { document.getElementById('signUp').click();}, 2000); 
                this.setState({sucessMsg1: result.data.message});
                localStorage.setItem("sucessMsg", result.data.message);
            // this.props.history.push("/");
            }else{
                this.setState({errorMsg1 :result.data.message});
                // setTimeout(function () { document.getElementById('signUp').click();}, 4000);
            }
        })
        .catch(error => {
            console.log(error);
            //errorMsg=error.response.data.message;
            //this.setState({errorMsg: error.result.data.message});
            //console.log(error.response.data.message);
        });
    }

    render(){
        return (
            <div>
                <div class="modal popUp" id="signUp">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-body">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <div class="mdLeft">
                                    <div class="popupOverlay">
                                        <figure><img src={Environment.apiurl+"/images/logo.png"} class="img-fluid" alt="" /></figure>
                                        <h3>Sign Up</h3>
                                        <p>Enter your personal details and register with detail garage.</p>
                                    </div>
                                </div>

                                <div class="mdRight btnChange">
                                    <ul class="topLinks">
                                        <li><a href="#" data-toggle="modal" data-target="#loginModal" data-dismiss="modal">Log in</a></li>
                                        <li><a href="#"  class="active" data-toggle="modal" data-target="#signUp" data-dismiss="modal">Sign Up</a></li>
                                    </ul>
                                <div class="formBlock">
                                    
                                <form onSubmit={this.handleSubmit.bind(this)} method="post">
                                    <div class="row">
                                        <aside class="col-sm-6">
                                        <div class="form-group">
                                            <label>First Name <span>*</span></label>
                                            <input name="first_name" id="first_name" type="text" class="inpField" placeholder="First Name" required />
                                        </div>
                                        </aside>
                                        <aside class="col-sm-6">
                                        <div class="form-group">
                                            <label>Last Name <span>*</span></label>
                                            <input name="last_name" id="last_name" type="text" class="inpField" placeholder="Last Name" required />
                                        </div>
                                        </aside>
                                    </div>
                                    <div class="row">
                                        <aside class="col-sm-6">
                                        <div class="form-group">
                                            <label>Email id <span>*</span></label>
                                            <input name="email" id="email" type="email" class="inpField" placeholder="xxx@gmail.com" required />
                                        </div>
                                        </aside>
                                        <aside class="col-sm-6">
                                        <div class="form-group">
                                            <label>Contact no. <span>*</span></label>
                                            <input name="mobile" id="mobile" type="text" class="inpField" placeholder="Contact Number" required />
                                        </div>
                                        </aside>
                                    </div>
                                    <div class="row">
                                        <aside class="col-sm-6">
                                        <div class="form-group">
                                            <label>Password <span>*</span></label>
                                            <input name="password" id="password" type="password" class="inpField" placeholder="Password" minLength="8" onChange={this.setvalueInstate} required />
                                        </div>
                                        </aside>
                                        <aside class="col-sm-6">
                                        <div class="form-group">
                                            <label>Confirm Password <span>*</span></label>
                                            <input name="confirm_password" id="confirm_password" onChange={this.setvalueInstate} type="password" class="inpField" placeholder="Confirm Password" required />
                                        </div>
                                        </aside>
                                    </div>

                                    <div class="row">
                                        <aside class="col-sm-12">
                                        <div class="cusCheck">
                                            <label>
                                            <input type="checkbox" required/>
                                            I Accept Terms & Conditions <span class="checkmark"></span> </label>
                                        </div>
                                        </aside>
                                    </div>
                                    
                                    {this.renderPasswordConfirmError()}
                                    <If condition={this.state.sucessMsg1}>
                                        <Then>
                                            <div className="alert alert-success">{this.state.sucessMsg1}</div>
                                        </Then>
                                    </If>
                                    <If condition={this.state.errorMsg1}>
                                        <Then>
                                            <div className="alert alert-danger">{this.state.errorMsg1}</div>
                                        </Then>
                                    </If>
                                    
                                    <div class="row btnRow">
                                        <aside class="col-sm-6">
                                        <button type="submit" class="subMit">Submit</button>
                                        </aside>
                                    </div>
                                </form>
                                </div>

                                <div class="register">Already have an account, 
                                    <a href="#" data-toggle="modal" data-target="#loginModal" data-dismiss="modal">Login Here</a>
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

export default SignupPopup;