import React, { Component } from 'react';
import { Environment } from '../../../src/components/environment';
import axios from 'axios';
import { If, Then, Else, Switch, Case} from 'react-if';
import Mainheader from '../../../src/Layouts/mainheader';
import Logo from '../../../src/Layouts/logo';
import Breadcrumb from '../../../src/Layouts/breadcrumb';
import Search from '../../../src/Layouts/search';
import Footer from '../../../src/Layouts/footer';
import Social from '../../../src/Layouts/social';

class Page extends Component{
    constructor (props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        return (
            <div>
            <Mainheader />
            <section class="listPage">
                
                <Breadcrumb />

                <div class="container">
                    <div class="mainBox">
                    <div class="d-flex align-content-stretch">

                        <Search />

                        <div class="col-lg-9">
                        <div class="mainRightSide">
                            <div class="contPage">
                                <h1>Amenities</h1>
                                <p>Here at NextHome Beach Time Realty, we strive to make sure our guests have everything they need when arriving at their vacation rental. While the amenities at some properties may vary, rest assured that all of our vacation rentals will have the following items available for your use:</p>
                                <ul>
                                    <li>Free Wi-Fi</li>
                                    <li>Cable TV</li>
                                    <li>Air Conditioning</li>
                                    <li>Iron & Ironing Board</li>
                                    <li>Coffee Maker</li>
                                    <li>Hair Dryer</li>
                                    <li>Fully Stocked Kitchens (doesn't include food items)</li>
                                    <li>All Linens Provided (sheets, blankets, pillows, bath towels)</li>
                                </ul>
                                
                                <p>Most of our properties also provide the following amenities:</p>
                                    <ul>
                                        <li>Beach Gear (chairs, toys, etc.)</li>
                                        <li>Free Parking</li>
                                        <li>Laundry Access</li>
                                        <li>Standard Small Appliances (mixer, microwave, toaster, blender)</li>
                                    </ul>
                                    
                                <h2>For Hire Amenities</h2>
                                    <p>Fishing & Diving Charter </p>
                                    <p><strong>La Costa Charters</strong></p>
                                    <p>A full service charter boat that provides top notch offshore fishing experience to anglers of all ages! We also offer dive charters and pleasure cruises.</p>
                                    <p>1-727-288-6116</p>
                                    
                                    <p><a href="#">http://www.lacostacharters.com/</a></p>
                                    
                                <h3>Forgot or Need Something?</h3>
                                        <p>A-to-Z Baby, Beach & Bike Rentals</p>
                                        <p>With over 80 different items in stock, large selection of baby equipment, beach gear & bikes. New or gently-used, clean. Inspected for safety, baby gear is certified by the Juvenile Products Manufacturers Association. Fully licensed & insured. Free Delivery and Pickup (min. order required)</p>
                                        <p>1-866-408-0048</p>
                                        <p><a href="#">http://www.rentfromatoz.com/ReserveOnline4.html</a></p>
                                        
                                <h3>Pass-A-Grille</h3>
                                    <p><strong>Bicycle Rentals</strong></p>
                                    <p>Wheel of Fun</p>
                                    <p>801 Pass-A-Grille Way, Pass-A-Grille - (727) 360-6606</p>
                                    <p><a href="#">www.WheelFunRentals.com/Locations/St-Petersburg-3</a></p>
                                
                                
                                <h4>Can I bring my pet with me?</h4>
                                <p>We offer several homes, some of which allow pets and some do not. You can look at our properties online by clicking on the "Luke's Pet-Friendly Picks" under the "Vacation Rentals" tab above and see if the home you are looking at allows pets; you can also call our office at 727-363-3300 and a receptionist would love to help find a home that is just right for you and your pet.</p>
                                
                                <h4>What are the benefits of a vacation home rental?</h4>
                                <p>Our vacation homes are stocked in such a way that you always feel like you are coming "home" to your "vacation home" rather than returning to a small hotel room. Our homes have full kitchens, with some homes having game rooms, hot tubs and BBQ grills. You will be able to enjoy a full service home while you are on vacation rather than a small, cramped hotel room.</p>
                                
                                <h4>Where can I find information about Travel Safety for your area?</h4>
                                <p>If you are seeking travel safety information, please visit <a href="#">http://www.visitstpeteclearwater.com/info/current-travel-safety-information</a></p>
                                    
                                <h3>Coupons</h3>
                                <p>There are many great deals for visitors enclosed in your welcome packet that will be in your vacation rental. Please check inside for free and discount offers, coupons, and lots of information on local activities! Make sure to check the maps and directories!</p>
                                
                                <p>Some deals you will find in your packet:</p>
                                    <ul>
                                        <li>$2 OFF at the Dali Museum</li>
                                        <li>Buy one get one admission at the Sunken Gardens</li>
                                        <li>$25 OFF a 1/2 Day, or $50 OFF Full Day of Fishing</li>
                                        <li>$10 OFF 1-hr Waverunner rental</li>
                                        <li>$5 OFF The Museum of Science & Industry</li>
                                        <li>Savings on family activities and much more!</li>
                                    </ul>
                                
                                <div class="contVideo">
                                    <iframe width="560" height="315" src="https://www.youtube.com/embed/Z-Gi7fx0Wk4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </div>
                                
                                
                            </div>
                        </div>
                        </div>
                        
                    </div>
                    </div>
                </div>
                </section>
                <Social />
                <Footer />

            </div>
        )
    }    

}

export default Page;