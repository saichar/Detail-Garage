import React, { Component } from 'react';
import {Environment} from '../components/environment/index';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

class ChooseUs extends Component {

    constructor (props){
        super(props);

        this.state = {
            staticContentList: [],
        }

        axios.post(Environment.apiurl+'/whyChooseUs')
            .then(result => {
                if(result){
                    console.log(result);
                    this.setState({staticContentList: result.data.response});
                }
            });
    }

    render(){
        return (
            <div>
                <If condition = {this.state.staticContentList.length > 0}>
                    <Then>
                        {this.state.staticContentList.map((item, index) =>
                        <section class="whyUs">
                            { ReactHtmlParser(item.content) }
                        </section>
                        )}
                    </Then>
                </If>

            </div>
        )
    }
}

export default ChooseUs;