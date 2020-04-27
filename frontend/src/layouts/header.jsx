import React, { Component } from 'react';
import {Environment} from '../components/environment/index';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import queryString from 'query-string'
class Header extends Component {

    constructor (props){
         super(props);

        this.state = {
            getCategoryList: [],
            cartlistProduct : [],
            searchdata:[],
            userCartCount : '',
            user_id_send:'',
            s:'',
            cartQuantity : 0,
            cartTotalAmount : 0,
            userCartTotalAmount : 0,
        }
       
        const searchquery=queryString;
        const search=searchquery.s;
        // alert(search);
        this.relatedsearch=this.relatedsearch.bind(this);
        
        var user_id_send = localStorage.getItem("user_id")?localStorage.getItem("user_id"):"";
        
        axios.get(Environment.apiurl+'/getAllCategoryList')
        .then(result => {
            if(result){
                this.getUserCartdetails();
                // console.log(result.data);
                this.setState({user_id_send:user_id_send});
                this.setState({getCategoryList: result.data.response});
            }
        });

        // const session_user_id = localStorage.getItem("user_id")?localStorage.getItem("user_id"):"";
    }


    getUserCartdetails(){
        axios.post(Environment.apiurl+'/getUserCartProDetails',{user_id:localStorage.getItem("user_id")})
        .then(result => {
            // console.log(result.data.response[0].cartQuantity);
            // console.log(result.data.response[0].cartTotalAmount);
            if(result){
                this.setState({user_id_send:localStorage.getItem("user_id")});
                this.setState({cartlistProduct: result.data.response});
                this.setState({userCartCount: result.data.response[0].cartQuantity});
                this.setState({userCartTotalAmount: result.data.response[0].cartTotalAmount});
            }
        });
    }
    relatedsearch(e){
    var name=e.target.value.trim();
    
    
    if(name){
    this.setState({searchstring:name});
      axios.post(Environment.apiurl+'/relatedsearch',{name:name})
        .then(result => {
            if(result){
                this.setState({searchdata:result.data.response});
                
            }
        });
    
    }
    }
    
    logout(){
        localStorage.clear();
        window.location.href = '/';
    }
    
    render() {
    
    
        var guest = [];
        for (var i = 1; i <= 10; i++) {
            guest.push(i);
        }

        return (
            <div>
                <header>
                    <div class="topBar">
                        <div class="container">
                            <div class="row">
                                <aside class="col-sm-6 col-7">
                                    <ul class="socials">
                                        <li><a target="_blank" href="https://www.facebook.com/detailgaragemesa/"><i class="fab fa-facebook-f"></i></a></li>
                                        {/* <li><a target="_blank" href="https://twitter.com/"><i class="fab fa-twitter"></i></a></li>
                                        <li><a target="_blank" href="https://accounts.google.com/"><i class="fab fa-google-plus-g"></i></a></li>
                                        <li><a target="_blank" href="https://www.pinterest.com/"><i class="fab fa-pinterest-p"></i></a></li> */}
                                        <li><a target="_blank" href="https://www.youtube.com/channel/UCEmuYfKhkgcB_kMdDVS-q4w?disable_polymer=true"><i class="fab fa-youtube"></i></a></li>
                                    </ul>
                                </aside>
                                <If condition={localStorage.getItem("email")}>
                                    <Then>
                                        <aside class="col-sm-6 col-5"> 
                                            <a href="#" onClick={(e) => this.logout()}  data-toggle="modal" class="loginSite"><i class="fas fa-lock"></i>Logout</a> &nbsp;&nbsp;&nbsp;
                                            <a href={Environment.weburl+"/user/my-account"} class="loginSite"><i class="fas fa-user"></i>My Account</a> 
                                        </aside>
                                    </Then>
                                    <Else>
                                        <aside class="col-sm-6 col-5"> 
                                            <a href="#" data-toggle="modal" data-target="#loginModal" class="loginSite"><i class="fas fa-lock"></i> Login / Register</a> 
                                        </aside>
                                    </Else>
                                </If>
                                
                            </div>
                        </div>
                    </div>                
                    <div class="logoBar">
                        <div class="container">
                            <div class="row">
                                <div class="col-sm-3"> 
                                    <a href={Environment.weburl} class="siteLogo"><img src={Environment.apiurl+"/images/logo.png"} class="img-fluid" alt="" /></a>
                                </div>
                                <div class="col-sm-9"> 
                                    <a class="open-mypage1"><img src={Environment.apiurl+"/images/search-icon.png"} /></a>


                                    <If condition={localStorage.getItem("email")}>
                                    <Then>
                                        <div class="myCart">
                                            <a href={Environment.weburl+"/user/cart"}>
                                            <span id="cartcount">{this.state.userCartCount}</span>
                                            <img src={Environment.apiurl+"/images/cart.png"} />
                                                <div class="cartValue">My Cart <span>$</span><span id="cartTotalAmount">
                                                <If condition={this.state.userCartTotalAmount>0}>
                                                <Then>{this.state.userCartTotalAmount.toFixed(2)}</Then>
                                                <Else>0.00</Else>
                                                </If>
                                                </span></div>
                                            </a> 
                                        </div>
                                    </Then>
                                    <Else>
                                        <div class="myCart">
                                            <a href="javascript:void(0);" data-toggle="modal" data-target="#loginModal">
                                            <img src={Environment.apiurl+"/images/cart.png"} />
                                            <div class="cartValue">My Cart <span>$0.00</span></div>
                                            </a> 
                                        </div>
                                    </Else>
                                    </If>
                                    


                                    <div id="">
                                        <div class="searchBar">
                                            <form action={Environment.weburl+"/ProductList/"} method="get">
                                                <input name="s" type="text" placeholder="Keywords here..." onKeyUp={this.relatedsearch}  required/>
                                                
                                                <button type="submit"><img src={Environment.apiurl+"/images/search-icon.png"} alt="" /></button>
                                                
                                            </form>
                                               <div class="searchList">
											<If condition={this.state.searchdata.length > 0}>
											<Then>
											
											<ul class="liListings">
											{this.state.searchdata.map((data,index) =>
											<li ><a href={Environment.weburl+"/ProductList?s="+data.name} >{data.name}</a></li>
											
											)}
											</ul>
											</Then>
											 </If>
											
                                              </div>
                                        </div>
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav>
                        <div class="container">
                            <div class="siteMenus">
                                <ul>
                                <If condition={this.state.getCategoryList.length > 0}>
                                    <Then>
                                        {this.state.getCategoryList.map((item, index) => 
                                        <li>
                                            <a href={Environment.weburl+"/product/"+item.slug} class="active">{item.category_name}</a>
                                        </li>
                                        )}
                                    </Then>
                                </If>
                                <li><a href={Environment.weburl+"/contact-us"}>Contact Us</a></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </header>
            </div>
        )
    }
}

export default Header;
