import React, { Component } from 'react';
import { Environment } from '../../../src/components/environment';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import Header from '../../../src/layouts/header';
import Footer from '../../../src/layouts/footer';
import UserLeftMenu from '../../../src/layouts/user_left_menu';
var dateFormat = require('dateformat');

class StoreAddress extends Component{
    constructor (props) {
        super(props);
        this.state = {
            user_id_send :'',
            storeInformation: [],
            // orderId:'',


        }
        // const orderId=this.props.postdata;
        var user_id_send = localStorage.getItem("user_id")?localStorage.getItem("user_id"):"";

        axios.post(Environment.apiurl+'/getSettingInformation')
        .then(result => {
            if(result){
                // console.log(result);
                this.setState({storeInformation: result.data.response});
            }
        });

    }

    render() {
        return (
            <div>
                
                    <h3>Store Information</h3>
                    <ul class="conInfo">
                        <If condition={this.state.storeInformation.length > 0}>
                            <Then>
                                {this.state.storeInformation.map((item, index) => 
                                    <li><i class={item.bootstrap_class}></i><p>{item.value}</p></li>
                                )}                            
                            </Then>
                        </If>
                    </ul>
                
                
            </div>
        )
    }    

}

export default StoreAddress;