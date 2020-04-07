import React, {Component} from 'react';
import { Environment } from '../../../src/components/environment';
import {CardElement, injectStripe} from 'react-stripe-elements';
import axios from 'axios';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token:'',
      id:'',
      amount:''
    }
    
    this.state = {complete: false};
    this.submit = this.submit.bind(this);

    // this.setState({amount:amount});
  }
  

  async submit(req, res) {
	  const amountdata=this.props.amountdata;
    // alert((this.props.amountdata));
    //return false;
    let {token} = await this.props.stripe.createToken({name: "card"});
    // console.log(this.state.amount);
    // return false;
    if(token){
      axios.post(Environment.apiurl+"/charge", {'token':token.id,'amount':this.props.amountdata}).then(result => {
        if(result){
          // console.log(result.data);
          // console.log(result.data.id);
          // console.log(result.data.payment_method);
          this.props.onSelectLanguage(result);
          // var data = {};
          // data['paymentRes'] = results;
          // res.json({ "response": result });
          // res.end();
        } else {
          // res.json({ "response": result });
          // res.end();
        }
      });
    }
      
  }

  render() {
    return (
      <div className="checkout">
        <p>Would you like to complete the purchase?</p>
        <CardElement />
        <button onClick={this.submit}>Purchase</button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
