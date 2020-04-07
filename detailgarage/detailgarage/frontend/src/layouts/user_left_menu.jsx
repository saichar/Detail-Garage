import React, { Component } from 'react';
import {Environment} from '../components/environment/index';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';

class UserLeftMenu extends Component {

    constructor (props){
        super(props);

        this.state = {
            // getCategoryList: []
        }

        // axios.get(Environment.apiurl+'/getAllCategoryList')
        // .then(result => {
        //     if(result){
        //         // console.log(result.data);
        //         this.setState({getCategoryList: result.data.response});
        //     }
        // });

        const session_user_id = localStorage.getItem("user_id")?localStorage.getItem("user_id"):"";
    }

    logout(){
        localStorage.clear();
        window.location.href = '/';
    }

    render() {
        // var guest = [];
        // for (var i = 1; i <= 10; i++) {
        //     guest.push(i);
        // }

        return (
            
            <aside class="col-lg-3 col-sm-4">
                <button class="open-mypage2">Dashboard Links</button>
                <div id="mypage-info2" class="navLinks"> <a href="#" class="up"><i class="fa fa-chevron-up" aria-hidden="true"></i></a>
                <ul>
                    <li><a href={Environment.weburl+"/user/my-account"} class="active">My Account</a></li>
                    <li><a href={Environment.weburl+"/user/order"}>My Orders</a></li>
                    <li><a href={Environment.weburl+"/user/wishlist"}>My Wishlist</a></li>
                    <li><a href="javascript:void(0);" onClick={(e) => this.logout()}>Logout</a></li>
                </ul>
                </div>
            </aside>
            
        )
    }
}

export default UserLeftMenu;