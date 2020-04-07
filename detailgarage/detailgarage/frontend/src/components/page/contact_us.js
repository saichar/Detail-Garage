import React, { Component } from 'react';
import { Environment } from '../../../src/components/environment';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import { If, Then, Else, Switch, Case} from 'react-if';
import Header from '../../../src/layouts/header';
import Footer from '../../../src/layouts/footer';

class Page extends Component{
    constructor (props) {
        super(props);
        this.state = {
            errorMsg:'',
            sucessMsg:'',
            settingInformation:[]
            // getPageContent: [],
        }
        this.setvalueInstate = this.setvalueInstate.bind(this);
        
        axios.post(Environment.apiurl+'/getSettingInformation')
        .then(result => {
            if(result){
                console.log(result);
                this.setState({settingInformation: result.data.response});
            }
        });
    }
    
    setvalueInstate= (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    enquirySubmit (e) {
        e.preventDefault();

        axios.post(Environment.apiurl+"/userEnquiry",{
            name: e.target.full_name.value,
            phone: e.target.phone_number.value,
            email:e.target.email.value,
            message: e.target.message.value
          })
        .then(result => {
            if(result.data.status==="success"){
                setTimeout(function () { document.getElementById('signUp').click();}, 4000); 
                this.setState({sucessMsg: result.data.message});
                localStorage.setItem("sucessMsg", result.data.message);
                setTimeout(function () {
                    window.location.reload(1);
                }, 1000);
            }else{
                this.setState({errorMsg :result.data.message});
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    sendMailTo(param){
        window.location = 'mailto:'+param;
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
                                    Contact Us                                
                                </h1>
                                <ol class="breadcrumb">
                                    <li><a href={Environment.weburl}>Home</a></li>
                                    <li class="active">Contact us</li>
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
                            <h3 class="title2">WE WANT TO HEAR  FROM YOU!</h3>
                            <p class="subTitl">Please feel free to contact us by filling in the form below and providing your contact information. We will do our best to respond within 24 hours of receiving your message and look forward to answering your questions.</p>
                            <p class="formNot">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled</p>
                            
                            <div class="contactForm">
                            <If condition={this.state.sucessMsg}>
                                <Then>
                                    <div className="alert alert-success">{this.state.sucessMsg}</div>
                                </Then>
                            </If>
                            <If condition={this.state.errorMsg}>
                                <Then>
                                    <div className="alert alert-danger">{this.state.errorMsg}</div>
                                </Then>
                            </If>
                                <form onSubmit={this.enquirySubmit.bind(this)} method="post">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <input type="text" class="inputField" placeholder="Full Name" name="full_name" id="full_name" required />
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <input type="text" class="inputField" placeholder="Phone Number" name="phone_number" id="phone_number" required/>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <input type="email" class="inputField" placeholder="Email" name="email" id="email" required/>
                                </div>
                                <div class="form-group">
                                    <textarea class="textareaField" placeholder="Message" name="message" id="message" required></textarea>
                                </div>
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


            <section class="contactMap">
            <div class="row m-0">
                <div class="col-sm-6">
                    <address>
                        <h3>CONTACT <span>US</span></h3>
                        <p class="addHead">For now, you can use :</p>
                        <If condition={this.state.settingInformation.length > 0}>
                            <Then>
                                {this.state.settingInformation.map((item, index) => 
                                <div>
                                    <If condition={item.name === "Contact address"}>
                                        <p><img src={Environment.apiurl+"/images/map-marker.png"} />{item.value}</p>
                                    </If>
                                    <If condition={item.name === "Contact Number"}>
                                        <p><img src={Environment.apiurl+"/images/phone-icon.png"} />{item.value}</p>
                                    </If>
                                    <If condition={item.name === "Contact email"}>
                                        <p><img src={Environment.apiurl+"/images/envelop.png"} /><a href="javaScript:void(0);" onClick={(e) => this.sendMailTo(item.value)}>{item.value}</a></p>
                                    </If> 
                                </div>                             
                                )}                            
                            </Then>
                        </If>
                        {/* <p><img src={Environment.apiurl+"/images/map-marker.png"} />2667 W. Baseline Rd. Mesa, AZ 85202</p>
                        <p><img src={Environment.apiurl+"/images/phone-icon.png"} />(480)-361-5880</p>
                        <p><img src={Environment.apiurl+"/images/envelop.png"} />
                        <a href="mailto:info@deatailgarageaz.com">info@deatailgarageaz.com</a></p> */}
                    </address>
                </div>
                
                <div class="col-sm-6">
                    {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26370943.99735649!2d-113.70989540076337!3d36.21253639149963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54eab584e432360b%3A0x1c3bb99243deb742!2sUnited+States!5e0!3m2!1sen!2sin!4v1564154985727!5m2!1sen!2sin" width="100%" height="450" frameborder="0" style={{ border: "0" }} allowfullscreen></iframe>     */}

                    {/* <iframe src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCDBOYjv4ag_03zVGHHfV-hYmP9i-hK07k&callback=initMap" width="100%" height="450" frameborder="0" style={{ border: "0" }} allowfullscreen></iframe> */}
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3331.7404840032277!2d-111.89454294954243!3d33.377840660320444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b07c58be070e3%3A0x81aa93a83e8e246b!2s2667%20W%20Baseline%20Rd%2C%20Mesa%2C%20AZ%2085202%2C%20USA!5e0!3m2!1sen!2sin!4v1566832786264!5m2!1sen!2sin" width="100%" height="450" frameborder="0" style={{ border: "0" }} allowfullscreen=""></iframe>

                    {/* <iframe width="600" height="450" frameborder="0" style={{ border: "0" }}
                    src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Space+Needle,Seattle+WA" allowfullscreen>
                    </iframe> */}
                </div>
            </div>
            </section>

            <Footer />
            </div>
        )
    }    

}



export default Page;