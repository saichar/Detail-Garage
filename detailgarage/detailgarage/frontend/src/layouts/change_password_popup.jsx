import React, { Component } from 'react';
import {Environment} from '../components/environment/index';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';

class ChangePasswordPopup extends Component {

    constructor (props){
        super(props);

        this.state = {
            email_id: localStorage.getItem('email'),
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
        }

        // axios.get(Environment.apiurl+'getInformation')
        //     .then(result => {
        //         if(result){
        //             this.setState({information: result.data.response});
        //         }
        //     });

        this.setvalueInstate = this.setvalueInstate.bind(this);
    }

    setvalueInstate= (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    changePassword(e){
        e.preventDefault();
        this.setState({
          loading: true
        });

        axios.post(Environment.apiurl+"/changePassword",{
            email:localStorage.getItem('email'),
            current_password:e.target.current_password.value,
            new_password:e.target.new_password.value,
            confirm_password: e.target.confirm_password.value
        })
        .then(result => {
            // console.log(result.data);
            if(result.data.status==="success"){
                // setTimeout(function () { document.getElementById('pwd').click();}, 4000); 
                this.setState({sucessMsg2: result.data.message});
                localStorage.setItem("sucessMsg", result.data.message);
                setTimeout(function () { window.location.reload(); }, 4000);
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
                <div class="modal popUp popUp1" id="pwd">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-body">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <div class="mdLeft">
                                    <div class="popupOverlay">
                                        <h3>Change Password</h3>
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

                                    <form onSubmit={this.changePassword.bind(this)} method="post">
                                        <div class="form-group">
                                            <label>Current Password <span>*</span></label>
                                            <input name="current_password" type="password" class="inpField" placeholder="password" required />
                                        </div>
                                        <div class="form-group">
                                            <label>New Password <span>*</span></label>
                                            <input name="new_password" type="password" class="inpField" placeholder="password" required minLength="8" />
                                        </div>
                                        <div class="form-group">
                                            <label>Confirm Password <span>*</span></label>
                                            <input name="confirm_password" type="password" class="inpField" placeholder="password" required />
                                        </div>
                                        <div class="row btnRow">
                                            <aside class="col-sm-6">
                                            <button type="submit" class="subMit">Submit</button>
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

export default ChangePasswordPopup;