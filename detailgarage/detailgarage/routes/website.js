var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('express-flash');
const stripe = require("stripe")("sk_test_LoxPw3X84sVD4Rb9JOishQcx00xu6Kubln");

var websiteController = require('../website/controllers/website');
var productController = require('../website/controllers/product');
var categoryController = require('../website/controllers/category');
var pageController = require('../website/controllers/page');

/* ******************* Upload files ******************* */

function getFileExtension(filename) {
    return filename.split('.').pop();
}

var strogeProfile = multer.diskStorage({
    destination: function (req, file, cb) {
        saveTo = path.join('./uploads/users/');
        cb(null, saveTo);
    },
    filename: function (req, file, cb) {
        if (file.originalname) {
            let ext = getFileExtension(file.originalname);
            cb(null, Date.now() + "." + ext);
            // cb(null, file.fieldname + '-' + Date.now()+"."+ext);
        }
    }
});

/* ******************* Upload files ******************* */

router.get('/', function(req, res){
    let web = new websiteController();
    web.home(req, res);
});


router.get('/page/:slug', function(req, res){
    let web = new pageController();
    web.pageContent(req, res);
});


router.post('/login', function(req, res){
    let web = new websiteController();
    web.userLogin(req, res);
});


router.post('/changePassword', function(req, res){
    let web = new websiteController();
    web.changePassword(req, res);
});


router.post('/updatePassword', function(req, res){
    let web = new websiteController();
    web.updatePassword(req, res);
});


router.post('/subscribeUser', function(req, res){
    let web = new websiteController();
    web.subscribeUser(req, res);
});

router.post('/signup', function(req, res){
    let web = new websiteController();
    web.userSignup(req, res);
});
router.post('/fsignup', function(req, res){
    let web = new websiteController();
    web.userfSignup(req, res);
});
router.get('/verifyaccount', function(req, res){
    let web = new websiteController();
    web.verifyaccount(req, res);
});

router.post('/forgot_password', function(req, res){
    let web = new websiteController();
    web.forgotPassword(req, res);
});

router.get('/getAllCategoryList', function(req, res){
    let web = new categoryController();
    web.getAllCategoryList(req, res);
});

router.get('/getAllSubCategoryList/:slug', function(req, res){
    let web = new categoryController();
    web.getAllSubCategoryList(req, res);
});

router.post('/getBannerList', function(req, res){
    let web = new websiteController();
    web.getBannerList(req, res);
});

router.post('/getTodaysDealList', function(req, res){
    let web = new productController();
    web.getTodaysDealList(req, res);
});

router.post('/bestSellingProductList', function(req, res){
    let web = new productController();
    web.bestSellingProductList(req, res);
});

router.post('/product', function(req, res){
    let web = new productController();
    web.getProductList(req, res);
});
router.post('/searchProductListbyprice', function(req, res){
    let web = new productController();
    web.searchProductListbyprice(req, res);
});

router.post('/searchproduct', function(req, res){
    let web = new productController();
    web.searchProductList(req, res);
});

router.post('/product/:slug', function(req, res){
    let web = new productController();
    web.getCategoryProductList(req, res);
});

router.post('/getFilterProductList', function(req, res){
    // console.log(req.parmas)
    let web = new productController();
    web.getFilterProductList(req, res);
});

router.post('/getFilterCategoryProductList', function(req, res){
    // console.log(req.body);
    let web = new productController();
    web.getFilterCategoryProductList(req, res);
});

router.post('/getFilterSearchProductList', function(req, res){
    // console.log(req.body);
    let web = new productController();
    web.getFilterSearchProductList(req, res);
});


router.post('/getSortedData', function(req, res){
    // console.log(req.parmas)
    let web = new productController();
    web.getFilterBySortingProductList(req, res);
});


router.post('/product/details/:id', function(req, res){
    // console.log(req.parmas)
    let web = new productController();
    web.getProductDetails(req, res);
});


router.post('/whyChooseUs', function(req, res){
    // console.log(req.parmas)
    let web = new pageController();
    web.whyChooseUs(req, res);
});


router.post('/clientTestimonial', function(req, res){
    // console.log(req.parmas)
    let web = new websiteController();
    web.clientTestimonial(req, res);
});



router.post('/addProductIntoCart', function(req, res){
    // console.log(req.parmas)
    let web = new productController();
    web.addProductIntoCart(req, res);
});

router.post('/addProductIntoWishlist', function(req, res){
    // console.log(req.parmas)
    let web = new productController();
    web.addProductIntoWishlist(req, res);
});


router.post('/getUserWishlistProduct', function(req, res){
    let web = new productController();
    web.getUserWishlistProduct(req, res);
});

router.post('/deleteWishlistItem', function(req, res){
    // console.log(req.parmas)
    let web = new productController();
    web.deleteWishlistItem(req, res);
});


router.post('/getUserCartlistProduct', function(req, res){
    let web = new productController();
    web.getUserCartlistProduct(req, res);
});


// router.post('/charge',function (req, res) {
//     let web = new productController();
//     web.charge(req, res);
// });

router.post("/charge", async (req, res) => {
    // try { 
    //     let {status} = await stripe.charges.create({
    //         // amount: parseInt(req.body.amount),
    //         amount: 1700,
    //         currency: "usd",
    //         description: "An example charge",
    //         source: req.body.token
    //     });
    //     console.log(status);
    //     //   res.json({status});
    //     res.json({status: "true", response: status, message: 'success'});
    //     res.end();
    // } catch (err) {
    //     //   res.status(500).end();
    //     res.json({status: "false", response: err, message: 'Something went wrong!'});
    //     res.end();
    // }

    return await stripe.charges
        .create({
        amount: parseInt(req.body.amount)*100, // Unit: cents
        currency: 'eur',
        source: req.body.token,
        description: 'Test payment',
        })
        .then(result => res.status(200).json(result));
  });



router.post('/deleteCartlistItem', function(req, res){
    // console.log(req.parmas)
    let web = new productController();
    web.deleteCartlistItem(req, res);
});


router.post('/getUserCartProDetails', function(req, res){
    let web = new productController();
    web.getUserCartProDetails(req, res);
});


router.post('/getSettingInformation', function(req, res){
    let web = new websiteController();
    web.getSettingInformation(req, res);
});

router.post('/getStanderedDelivery', function(req, res){
    let web = new websiteController();
    web.getStanderedDelivery(req, res);
});

router.post('/userEnquiry', function(req, res){
    let web = new websiteController();
    web.userEnquiry(req, res);
});

router.post('/updateCartQuantity', function(req, res){
    // console.log(req.parmas);
    let web = new productController();
    web.updateCartQuantity(req, res);
});


router.post('/productCheckout', function(req, res){
    // console.log(req.parmas);
    let web = new productController();
    web.productCheckout(req, res);
});


router.post('/orderConfirmation', function(req, res){
    // console.log(req.parmas);
    let web = new productController();
    web.orderConfirmation(req, res);
});


router.post('/getUserOrderList', function(req, res){
    // console.log(req.parmas);
    let web = new productController();
    web.getUserOrderList(req, res);
});

router.post('/getUserOrderItemList', function(req, res){
    // console.log(req.parmas);
    let web = new productController();
    web.getUserOrderItemList(req, res);
});

router.post('/addProductReview', function(req, res){
    // console.log(req.parmas);
    let web = new productController();
    web.addProductReview(req, res);
});


router.post('/addShippingAddress', function(req, res){
    // console.log(req.parmas);
    let web = new websiteController();
    web.addShippingAddress(req, res);
});

router.post('/updateShippingAddress', function(req, res){
    // console.log(req.parmas);
    let web = new websiteController();
    web.updateShippingAddress(req, res);
});



router.post('/getUserDetails', function(req, res){
    // console.log(req.parmas);
    let web = new websiteController();
    web.getUserDetails(req, res);
});

router.post('/deleteShippingAddress', function(req, res){
    // console.log(req.parmas)
    let web = new websiteController();
    web.deleteShippingAddress(req, res);
});


router.post('/getStateList', function(req, res){
    // console.log(req.parmas)
    let web = new websiteController();
    web.getStateList(req, res);
});

router.post('/getCityList', function(req, res){
    // console.log(req.parmas)
    let web = new websiteController();
    web.getCityList(req, res);
});

router.post('/getAllCityList', function(req, res){
    // console.log(req.parmas)
    let web = new websiteController();
    web.getAllCityList(req, res);
});


router.post('/getShippingAddressList', function(req, res){
    // console.log(req.parmas);
    let web = new websiteController();
    web.getShippingAddressList(req, res);
});


router.post('/uploadUserImage', multer({ storage: strogeProfile }).any("upload"), function(req, res){
    let web = new websiteController();
    web.uploadUserImage(req, res);
});


router.post('/saveUserDetails', function(req, res){
    let web = new websiteController();
    web.saveUserDetails(req, res);
});

//search data 
router.post('/relatedsearch', function(req, res){
    let web = new websiteController();
    web.relatedsearch(req, res);
});

//getreviewdetails by productid
router.post('/getReviewdetailByid', function(req, res){
    // console.log(req.parmas);
    let web = new productController();
    web.getProductReview(req, res);
});

router.post('/getShippingAddressDetails', function(req, res){
    let web = new websiteController();
    web.getShippingAddressDetails(req, res);
});







module.exports = router;
