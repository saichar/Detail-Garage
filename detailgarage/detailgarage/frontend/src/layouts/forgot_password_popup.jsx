import React, { Component } from 'react';
import {Environment} from '../components/environment/index';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';

class ForgotPasswordPopup extends Component {

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

        // axios.get(Environment.apiurl+'getInformation')
        //     .then(result => {
        //         if(result){
        //             this.setState({information: result.data.response});
        //         }
        //     });
    }

    setvalueInstate= (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    ForgotPassword(e){
        e.preventDefault();
        this.setState({
          loading: true
        });
            axios.post(Environment.apiurl+"/forgot_password",{
            email:e.target.email.value,
            })
        .then(result => {
            if(result.data.status==="success"){
                this.setState({sucessMsg3: result.data.message});
                localStorage.setItem("sucessMsg", result.data.message);
                setTimeout(function () { document.getElementById('forgotModal').click();}, 4000);
            }else{
                document.getElementById('forgotform').reset();
                this.setState({errorMsg3:result.data.message});
                // console.log("get error from data");
            }
        })
        .catch(error => {
            console.log(error);
            //errorMsg=error.response.data.message;
            //this.setState({errorMsg3: result.data.message});
            //console.log(error.response.data.message);
        });
    }

    render(){
        return (
            <div>
                <div class="modal popUp" id="forgotModal">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-body">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <div class="mdLeft">
                                <div class="popupOverlay">
                                    <figure><img src="images/logo.png" class="img-fluid" alt="" /></figure>
                                    <h3>Forgot Password</h3>
                                    <p>Enter your personal details and reset your password.</p>
                                </div>
                                </div>
                                <div class="mdRight">
                                <ul class="topLinks">
                                    <li><a href="#" class="active" data-toggle="modal" data-target="#loginModal" data-dismiss="modal">Log in</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#signUp" data-dismiss="modal">Sign Up</a></li>
                                </ul>
                                <div class="formBlock">
                                    <form onSubmit={this.ForgotPassword.bind(this)} method="post" id="forgotform">
                                        <div class="form-group">
                                            <label>Email id <span>*</span></label>
                                            <input name="email" id="email" type="text" class="inpField" placeholder="xxxx@gmail.com" required />
                                        </div>
                                        <div class="row btnRow">
                                            <aside class="col-sm-6">
                                            <button type="submit" class="subMit">Submit</button>
                                            </aside>
                                            {/* <aside class="col-sm-6"><a href="#" class="loginWith"><i class="fab fa-facebook-f"></i> Login With Facebook</a></aside> */}
                                        </div>
                                    </form>
                                    <If condition={this.state.sucessMsg3}>
                                        <Then>
                                            <div className="alert alert-success">{this.state.sucessMsg3}</div>
                                        </Then>
                                    </If>

                                    <If condition={this.state.errorMsg3}>     
                                        <Then>
                                            <div className="alert alert-danger">{this.state.errorMsg3}</div>
                                        </Then>
                                    </If>
                                </div>
                                <div class="register">Don't have an account, <a href="#" data-toggle="modal" data-target="#signUp" data-dismiss="modal">Register Here</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ForgotPasswordPopup;