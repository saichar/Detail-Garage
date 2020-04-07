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
            getPageContent: [],
        }
        let pageSlug = this.props.match.params.slug;
        axios.get(Environment.apiurl+'/page/'+pageSlug)
        .then(result => {
            if(result){
                // console.log(result);
                this.setState({getPageContent: result.data.response});
            }
        });
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
                        {this.state.getPageContent.map((item, index) =>
                            <div class="col-sm-12 text-center">
                                <h1>                                
                                    {item.page_name}                                
                                </h1>
                                <ol class="breadcrumb">
                                    <li><a href={Environment.weburl}>Home</a></li>
                                    <li class="active">{item.page_name}</li>
                                </ol>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            
            <section class="listing aboutCont">
                <div class="container">
                    <If condition={this.state.getPageContent.length > 0}>
                        <Then>
                            {this.state.getPageContent.map((item, index) =>
                            <div>{ ReactHtmlParser(item.content) }</div>
                            )}
                        </Then>
                    </If>
                </div>
            </section>

            <Footer />
            </div>
        )
    }    

}

export default Page;