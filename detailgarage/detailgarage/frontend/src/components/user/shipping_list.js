import React, { Component } from 'react';
import { Environment } from '../../../src/components/environment';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import Header from '../../../src/layouts/header';
import Footer from '../../../src/layouts/footer';
import UserLeftMenu from '../../../src/layouts/user_left_menu';
var dateFormat = require('dateformat');

class ShippingList extends Component{
    constructor (props) {
        super(props);
        this.state = {
            user_id_send :'',
            shippingAddressList:[]
            // orderId:'',


        }
        // const orderId=this.props.postdata;
        var user_id_send = localStorage.getItem("user_id")?localStorage.getItem("user_id"):"";

        axios.post(Environment.apiurl+'/getShippingAddressList', {user_id:user_id_send})
        .then(result => {
            console.log(result.data);
            if(result){
                this.setState({user_id_send:user_id_send});
                this.setState({shippingAddressList: result.data.response});
            }   
        });

    }

    render() {
        return (
            <div>                
                    <h3>Select Address</h3>
                    <ul class="optAddress">
                        {(this.state.shippingAddressList.length > 0)}
                            {this.state.shippingAddressList.map( (item, index) => {
                                return <li>
                                <label><input type="radio" value={item.id} name="radio2" id="address_id" checked/><strong>{item.type.toUpperCase()}</strong></label>
                                <p>{item.address_1}, {item.city.charAt(0).toUpperCase() + item.city.slice(1)}, {item.state.charAt(0).toUpperCase() + item.state.slice(1)}, {item.country.charAt(0).toUpperCase() + item.country.slice(1)}</p>
                            </li>
                            })
                        }
                        
                        <li>
                            {/* <If condition = {this.state.shippingAddressList.length == 0}> */}
                                <input type="hidden" name="addressLength" id="addressLength" value={this.state.shippingAddressList.length} />
                            {/* </If> */}
                            <a class="addNew" href="#" data-toggle="modal" data-target="#addNew">Add New Address</a>
                        </li>
                    </ul>                
            </div>
        )
    }    

}

export default ShippingList;