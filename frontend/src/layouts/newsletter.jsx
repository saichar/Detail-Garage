import React, { Component } from 'react';
import {Environment} from '../components/environment/index';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import Alert from 'react-s-alert';
import * as EmailValidator from 'email-validator';

class Newsletter extends Component {

    constructor (props){
        super(props);

        this.state = {
        //     information: [],
        email : '',
        }

        this.setvalueInstate = this.setvalueInstate.bind(this);
        this.subscribeUser = this.subscribeUser.bind(this);

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

    

    subscribeUser(){
        // var email = this.state.email;
        var subscriber =
        {
            "email":this.state.email,
        };
        // alert(email);

        if(EmailValidator.validate(this.state.email)){
            axios.post(Environment.apiurl+"/subscribeUser", subscriber).then(result => {
                if(result.data.status=="success"){
                    this.setState({ email: '' });
                    Alert.success(result.data.message, {
                        position: 'bottom-right',
                        timeout: 3000
                    });
                }else{
                    Alert.error(result.data.message, {
                        position: 'bottom-right',
                        timeout: 3000
                    });
                }
            });
        } else {
            Alert.error('Enter valid email!', {
                position: 'bottom-right',
                timeout: 3000
            });
        }
        
    }

    render(){
        return (
            <div>
                <section class="newsLetter">
                    <div class="container">
                        <div class="letterBox">
                            <div class="row">
                                <aside class="col-lg-4">
                                    <ul>
                                        <li><a target="_blank" href="https://www.facebook.com/detailgaragemesa/"><i class="fab fa-facebook-f"></i></a></li>
                                        {/* <li><a target="_blank" href="https://twitter.com/"><i class="fab fa-twitter"></i></a></li>
                                        <li><a target="_blank" href="https://accounts.google.com/"><i class="fab fa-google-plus-g"></i></a></li>
                                        <li><a target="_blank" href="https://www.instagram.com/"><i class="fab fa-instagram"></i></a></li> */}
                                        <li><a target="_blank" href="https://www.youtube.com/channel/UCEmuYfKhkgcB_kMdDVS-q4w?disable_polymer=true"><i class="fab fa-youtube"></i></a></li>
                                    </ul>
                                </aside>
                                <aside class="col-lg-8">
                                    <label>Sign up for newsletter</label>
                                    {/* <form onSubmit={this.subscribeUser.bind(this)} method="post">
                                        <div class="inpBox">
                                            <input name="email" type="email" class="inpTxt" placeholder="Your email address..." />
                                            <input name="" type="submit" value="Subscribe" class="inpBtn"/>
                                        </div>
                                    </form> */}
                                    <div class="inpBox">
                                        <input name="email" type="email" class="inpTxt" placeholder="Your email address..." value={this.state.email} onChange={this.setvalueInstate}/>
                                        <button class="cartBtn" onClick={(e) => this.subscribeUser()} class="inpBtn">Add to Cart</button>
                                    </div>
                                </aside>
                            </div>
                        </div>
                        <Alert stack={true} timeout={3000} position='bottom-right' />
                    </div>
                </section>
            </div>
        )
    }
}

export default Newsletter;