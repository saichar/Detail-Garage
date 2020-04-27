import React, { Component } from 'react';
import {Environment} from '../components/environment/index';
import { FacebookLogin } from 'react-facebook-login-component';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';

class LoginPopup extends Component {

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
        this.responseFacebook = this.responseFacebook.bind(this);
       
    }

    setvalueInstate= (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    responseFacebook (response) {
     
     
     var firstname  =response.name;
     var email  =response.email;
     var lname  =response.name;
     var logintype  ="F";
     var ftoken  = response.id;
     if(ftoken !=='' && ftoken !==undefined){
     console.log(email);
                
     axios.post(Environment.apiurl+"/fsignup",{
                         email: email,
                         first_name: firstname,
                         last_name : lname,
                         logintype: logintype,
                         ftoken  : ftoken
                       })
                     .then(result => {

                       if(result.data.status ==='true'){
                            this.setState({sucessMsg: result.data.message});
                            var data=result.data.data;
                            localStorage.setItem("user_id", data.id);
                            localStorage.setItem("email", data.email);
                            localStorage.setItem("first_name", data.first_name);
                            localStorage.setItem("flast_name", data.last_name);
                            localStorage.setItem("address", data.address_1);
                            localStorage.setItem("phone_no", data.mobile);
                            localStorage.setItem("profile_image", data.profile_image);
                            // localStorage.setItem("token",data.token);
                            document.getElementById('loginModal').click();
                            this.setState({sucessMsg2: result.data.message});
                            localStorage.setItem("sucessMsg", result.data.message);
                            //window.location.reload();
                         }else{
                              this.setState({errorMsg: result.data.message});
                        }
                  }).catch(error => {
     					        // this.setState({errorMsg: result.data.message});
                       console.log("testhfjffj");
              });
          }else{
            this.props.history.push("/login");
          }
   }

    loginSubmit(e){
        e.preventDefault();
        this.setState({
          loading: true
        });

        axios.post(Environment.apiurl+"/login",{
            email:e.target.email.value,
            password: e.target.password.value
        })
        .then(result => {
            // console.log(result.data);
            if(result.data.status==="success"){
                var data=result.data.data;
                localStorage.setItem("user_id", data.id);
                localStorage.setItem("email", data.email);
                localStorage.setItem("first_name", data.first_name);
                localStorage.setItem("flast_name", data.last_name);
                localStorage.setItem("address", data.address_1);
                localStorage.setItem("phone_no", data.mobile);
                localStorage.setItem("profile_image", data.profile_image);
                // localStorage.setItem("token",data.token);
                document.getElementById('loginModal').click();
                this.setState({sucessMsg2: result.data.message});
                localStorage.setItem("sucessMsg", result.data.message);
                window.location.reload();
            }else{
                this.setState({errorMsg2: result.data.message});
            }
        })
        // .catch(error => {
        //     //errorMsg=error.response.data.message;
        //     this.setState({errorMsg: error.result.data.message});
        //     //console.log(error.response.data.message);
        // });
    }

    render(){
        return (
            <div>
                <div class="modal popUp" id="loginModal">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-body">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <div class="mdLeft">
                                <div class="popupOverlay">
                                    <figure><img src={Environment.apiurl+"/images/logo.png"} class="img-fluid" alt="" /></figure>
                                    <h3>Sign in</h3>
                                    <p>To keep connected with us please sign in with your personal information.</p>
                                </div>
                                </div>
                                <div class="mdRight">
                                <ul class="topLinks">
                                    <li><a href="#" class="active" data-toggle="modal" data-target="#loginModal" data-dismiss="modal">Log in</a></li>
                                    <li><a href="#" data-toggle="modal" data-target="#signUp" data-dismiss="modal">Sign Up</a></li>
                                </ul>
                                <div class="formBlock">
                                    <form onSubmit={this.loginSubmit.bind(this)} method="post">
                                        <div class="form-group">
                                            <label>Email id <span>*</span></label>
                                            <input name="email" type="email" class="inpField" placeholder="xxxx@gmail.com" required />
                                        </div>
                                        <div class="form-group">
                                            <label>Enter Password <span>*</span></label>
                                            <input name="password" type="password" class="inpField" placeholder="password" required />
                                        </div>
                                        <div class="row">
                                            <aside class="col-sm-6">
                                            {/* <div class="cusCheck">
                                                <label>
                                                <input type="checkbox" />
                                                Remember Password <span class="checkmark"></span> </label>
                                            </div> */}
                                            </aside>
                                            <aside class="col-sm-6"><a href="#" class="forGot" data-toggle="modal" data-target="#forgotModal" data-dismiss="modal">Forgot Password ?</a></aside>
                                        </div>
                                        <div class="row btnRow">
                                            <aside class="col-sm-6">
                                            <button type="submit" class="subMit">Login</button>
                                            </aside>
                                            <aside class="col-sm-6">
                                            
											
                                            
                                            </aside>
                                        </div>
                                    </form>
                                    
                                    
                                    
                                    <FacebookLogin socialId={Environment.FACEBOOK_CLIENT_KEY}
											language="en_US"
											scope="public_profile,email"
											responseHandler={this.responseFacebook}
											xfbml={true}
											fields="id,email,name"
											version="v2.5"
											className="facebook-login loginWith"
											buttonText={<i class="fab fa-facebook-f"></i>}/>
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

export default LoginPopup;
