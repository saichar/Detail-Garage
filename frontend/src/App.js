import React from 'react';
import {Environment} from './components/environment/index';
import Header from './layouts/header';
import Banner from './layouts/banner';
import TodayDeal from './layouts/todays_deal';
import ChooseUs from './layouts/why_choose_us';
import BestSellingProduct from './layouts/best_selling_product';
import ClientTestimonial from './layouts/client_testimonial';
import Newsletter from './layouts/newsletter';
import Footer from './layouts/footer';

class App extends React.Component{
  
  constructor (props){
    super(props);

    this.state = {
      show: false,
    }
  }

  render(){
    return (
      <div className="App">
        <Header />
        <Banner />
        <TodayDeal />
        <ChooseUs />
        <BestSellingProduct />
        <ClientTestimonial />
        <Newsletter />
        <Footer />
      </div>
    );
  }
}

export default App;
