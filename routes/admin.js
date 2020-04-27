// var express = require('express');
// var bodyParser = require('body-parser');
// var session = require('express-session');
// var flash = require('express-flash');

var adminController = require('../admin/controllers/adminController');
var dashboardController = require('../admin/controllers/dashboardController');
var categoryController = require('../admin/controllers/categoryController');
var subcategoryController = require('../admin/controllers/subcategoryController');
var productController = require('../admin/controllers/productController');
var staticpageController = require('../admin/controllers/staticpageController');
var bannerController = require('../admin/controllers/bannerController');
var settingController = require('../admin/controllers/settingController');
var testimonialController = require('../admin/controllers/testimonialController');
var userController = require('../admin/controllers/userController');
var orderController = require('../admin/controllers/orderController');
var productreviewController = require('../admin/controllers/productreviewController');


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

var strogeBanner = multer.diskStorage({
    destination: function (req, file, cb) {
        saveTo = path.join('./uploads/banners/');
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


var strogeTestimonial = multer.diskStorage({
    destination: function (req, file, cb) {
        saveTo = path.join('./uploads/testimonials/');
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


var strogeProduct = multer.diskStorage({
    destination: function (req, file, cb) {
        saveTo = path.join('./uploads/products/');
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


var strogePropertiesVideo = multer.diskStorage({
    destination: function (req, file, cb) {
        saveTo = path.join('./uploads/properties/videos');
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



/* ******************* Admin management start ******************* */

router.get('/', function (req, res) {
    let adm = new adminController();
    adm.adminLogin(req, res);
});

router.post('/', function (req, res) {
    let adm = new adminController();
    adm.login(req, res);
});

router.get('/logout', function (req, res) {
    let adm = new adminController();
    adm.logout(req, res);
});

router.get('/forgot', function (req, res) {
    let adm = new adminController();
    adm.forgot(req, res);
});

router.post('/forgotpassword', function (req, res) {
    let adm = new adminController();
    adm.forgotpassword(req, res);
});

router.get('/resetverify/:id/:activationkey', function (req, res) {
    let adm = new adminController();
    adm.resetverify(req, res);
});

router.post('/resetpassword', function (req, res) {
    let adm = new adminController();
    adm.resetpassword(req, res);
});

router.get('/profile/:id', function (req, res) {
    let adm = new adminController();
    adm.profile(req, res);
});

router.post('/updateprofile', multer({ storage: strogeProfile }).any("upload"), function (req, res) {
    let adm = new adminController();
    adm.updateprofile(req, res);
});

/* ******************* Admin management end ******************* */

/* ******************* Dashboard management start ******************* */

router.get('/dashboard', function (req, res) {
    let dsb = new dashboardController();
    dsb.dashboard(req, res);
});

/* ******************* Dashboard management end ******************* */

/* ******************* Category module start ******************* */

router.get('/category', function (req, res) {
    let cat = new categoryController();
    cat.category(req, res);
});

router.post('/categoryslug', function(req, res){
	 let cat = new categoryController();
	 cat.categoryslug(req, res);
	
});
router.get('/category/getCategoryList', function (req, res) {
    let cat = new categoryController();
    cat.getCategoryList(req, res);
});

router.get('/category/delete/:id', function (req, res) {
    let cat = new categoryController();
    cat.delete(req, res);
});

router.get('/category/change_status/:id', function (req, res) {
    let cat = new categoryController();
    cat.changeStatus(req, res);
});

router.get('/category/add', function (req, res) {
    let cat = new categoryController();
    cat.add(req, res);
});

router.post('/category/addrecord', function (req, res) {
    let cat = new categoryController();
    cat.addrecord(req, res);
});

router.get('/category/edit/:id', function (req, res) {
    let cat = new categoryController();
    cat.edit(req, res);
});

router.post('/category/updaterecord', function (req, res) {
    let cat = new categoryController();
    cat.updaterecord(req, res);
});

/* ******************* Category module end ******************* */


/* ******************* Sub Sub Category module start ******************* */

router.get('/subcategory', function (req, res) {
    let subcat = new subcategoryController();
    subcat.subcategory(req, res);
});

router.post('/getsubcat',function(req,res){
	   let subcat = new subcategoryController();
      subcat.subcategorybyid(req, res);
	});

router.get('/subcategory/getSubCategoryList', function (req, res) {
    let subcat = new subcategoryController();
    subcat.getSubCategoryList(req, res);
});

router.get('/subcategory/delete/:id', function (req, res) {
    let subcat = new subcategoryController();
    subcat.delete(req, res);
});

router.get('/subcategory/change_status/:id', function (req, res) {
    let subcat = new subcategoryController();
    subcat.changeStatus(req, res);
});

router.get('/subcategory/add', function (req, res) {
    let subcat = new subcategoryController();
    subcat.add(req, res);
});

router.post('/subcategory/addrecord', function (req, res) {
    let subcat = new subcategoryController();
    subcat.addrecord(req, res);
});

router.get('/subcategory/edit/:id', function (req, res) {
    let subcat = new subcategoryController();
    subcat.edit(req, res);
});

router.post('/subcategory/updaterecord', function (req, res) {
    let subcat = new subcategoryController();
    subcat.updaterecord(req, res);
});

/* ******************* Sub Category module end ******************* */


/* ******************* Product module start ******************* */

router.get('/product', function (req, res) {
    let pro = new productController();
    pro.product(req, res);
});

router.get('/product/getProductList', function (req, res) {
    let pro = new productController();
    pro.getProductList(req, res);
});

router.get('/product/delete/:id', function (req, res) {
    let pro = new productController();
    pro.delete(req, res);
});

router.get('/product/change_status/:id', function (req, res) {
    let pro = new productController();
    pro.changeStatus(req, res);
});

router.get('/product/change_deal/:id', function (req, res) {
    let pro = new productController();
    pro.changeDeal(req, res);
});

router.get('/product/add', function (req, res) {
    let pro = new productController();
    pro.add(req, res);
});

router.post('/product/addrecord', multer({ storage: strogeProduct }).any("upload"), function (req, res) {
    let pro = new productController();
    pro.addrecord(req, res);
});

router.get('/product/edit/:id', function (req, res) {
    let pro = new productController();
    pro.edit(req, res);
});

router.post('/product/updaterecord', multer({ storage: strogeProduct }).any("upload"), function (req, res) {
    let pro = new productController();
    pro.updaterecord(req, res);
});

/* ******************* Product module end ******************* */


/* ******************* Product Review module start ******************* */

router.get('/productreview', function (req, res) {
    let pro = new productreviewController();
    pro.productreviews(req, res);
});

router.get('/productreview/getProductReviewList', function (req, res) {
    let pro = new productreviewController();
    pro.getProductReviewList(req, res);
});

router.get('/productreview/delete/:id', function (req, res) {
    let pro = new productreviewController();
    pro.delete(req, res);
});

router.get('/productreview/change_status/:id', function (req, res) {
    let pro = new productreviewController();
    pro.changeStatus(req, res);
});

// router.get('/productreview/edit/:id', function (req, res) {
//     let pro = new productreviewController();
//     pro.edit(req, res);
// });

// router.post('/productreview/updaterecord', multer({ storage: strogeProduct }).any("upload"), function (req, res) {
//     let pro = new productreviewController();
//     pro.updaterecord(req, res);
// });

/* ******************* Product Review module end ******************* */


/* ******************* Staticpage module start ******************* */

router.get('/staticpage', function (req, res) {
    let stp = new staticpageController();
    stp.staticpage(req, res);
});

router.get('/staticpage/getStaticpageList', function (req, res) {
    let stp = new staticpageController();
    stp.getStaticpageList(req, res);
});

router.get('/staticpage/delete/:id', function (req, res) {
    let stp = new staticpageController();
    stp.delete(req, res);
});

router.get('/staticpage/change_status/:id', function (req, res) {
    let stp = new staticpageController();
    stp.changeStatus(req, res);
});

router.get('/staticpage/add', function (req, res) {
    let stp = new staticpageController();
    stp.add(req, res);
});

router.post('/staticpage/addrecord', function (req, res) {
    let stp = new staticpageController();
    stp.addrecord(req, res);
});

router.get('/staticpage/edit/:id', function (req, res) {
    let stp = new staticpageController();
    stp.edit(req, res);
});

router.post('/staticpage/updaterecord', function (req, res) {
    let stp = new staticpageController();
    stp.updaterecord(req, res);
});

/* ******************* Staticpage module end ******************* */



/* ******************* Setting module start ******************* */

router.get('/setting', function (req, res) {
    let st = new settingController();
    st.settings(req, res);
});

router.get('/setting/getSettingList', function (req, res) {
    let st = new settingController();
    st.getSettingList(req, res);
});

router.get('/setting/delete/:id', function (req, res) {
    let st = new settingController();
    st.delete(req, res);
});

router.get('/setting/change_status/:id', function (req, res) {
    let st = new settingController();
    st.changeStatus(req, res);
});

router.get('/setting/add', function (req, res) {
    let st = new settingController();
    st.add(req, res);
});

router.post('/setting/addrecord', function (req, res) {
    let st = new settingController();
    st.addrecord(req, res);
});

router.get('/setting/edit/:id', function (req, res) {
    let st = new settingController();
    st.edit(req, res);
});

router.post('/setting/updaterecord', function (req, res) {
    let st = new settingController();
    st.updaterecord(req, res);
});

/* ******************* Setting module end ******************* */

/* ******************* Banner module start ******************* */

router.get('/banner', function (req, res) {
    let bn = new bannerController();
    bn.banners(req, res);
});

router.get('/banner/getBannerList', function (req, res) {
    let bn = new bannerController();
    bn.getBannerList(req, res);
});

router.get('/banner/delete/:id', function (req, res) {
    let bn = new bannerController();
    bn.delete(req, res);
});

router.get('/banner/change_status/:id', function (req, res) {
    let bn = new bannerController();
    bn.changeStatus(req, res);
});

router.get('/banner/add', function (req, res) {
    let bn = new bannerController();
    bn.add(req, res);
});

router.post('/banner/addrecord', multer({ storage: strogeBanner }).any("upload"), function (req, res) {
    let bn = new bannerController();
    bn.addrecord(req, res);
});

router.get('/banner/edit/:id', function (req, res) {
    let bn = new bannerController();
    bn.edit(req, res);
});

router.post('/banner/updaterecord', multer({ storage: strogeBanner }).any("upload"), function (req, res) {
    let bn = new bannerController();
    bn.updaterecord(req, res);
});

/* ******************* Banner module end ******************* */


/* ******************* Client Testimonial module start ******************* */

router.get('/testimonial', function (req, res) {
    let tsti = new testimonialController();
    tsti.testimonials(req, res);
});

router.get('/testimonial/getTestimonialList', function (req, res) {
    let tsti = new testimonialController();
    tsti.getTestimonialList(req, res);
});

router.get('/testimonial/delete/:id', function (req, res) {
    let tsti = new testimonialController();
    tsti.delete(req, res);
});

router.get('/testimonial/change_status/:id', function (req, res) {
    let tsti = new testimonialController();
    tsti.changeStatus(req, res);
});

router.get('/testimonial/add', function (req, res) {
    let tsti = new testimonialController();
    tsti.add(req, res);
});

router.post('/testimonial/addrecord', multer({ storage: strogeTestimonial }).any("upload"), function (req, res) {
    let tsti = new testimonialController();
    tsti.addrecord(req, res);
});

router.get('/testimonial/edit/:id', function (req, res) {
    let tsti = new testimonialController();
    tsti.edit(req, res);
});

router.post('/testimonial/updaterecord', multer({ storage: strogeTestimonial }).any("upload"), function (req, res) {
    let tsti = new testimonialController();
    tsti.updaterecord(req, res);
});

/* ******************* Client Testimonial module end ******************* */


/* ******************* User module start ******************* */

router.get('/user', function (req, res) {
    let tus = new userController();
    tus.users(req, res);
});

router.get('/user/getUserList', function (req, res) {
    let tus = new userController();
    tus.getUserList(req, res);
});

router.get('/user/delete/:id', function (req, res) {
    let tus = new userController();
    tus.delete(req, res);
});

router.get('/user/change_status/:id', function (req, res) {
    let tus = new userController();
    tus.changeStatus(req, res);
});


// router.get('/testimonial/add', function (req, res) {
//     let tus = new testimonialController();
//     tus.add(req, res);
// });

// router.post('/testimonial/addrecord', multer({ storage: strogeTestimonial }).any("upload"), function (req, res) {
//     let tus = new testimonialController();
//     tus.addrecord(req, res);
// });

// router.get('/testimonial/edit/:id', function (req, res) {
//     let tus = new testimonialController();
//     tus.edit(req, res);
// });

// router.post('/testimonial/updaterecord', multer({ storage: strogeTestimonial }).any("upload"), function (req, res) {
//     let tus = new testimonialController();
//     tus.updaterecord(req, res);
// });

/* ******************* User module end ******************* */


/* ******************* Order module start ******************* */

router.get('/order', function (req, res) {
    let or = new orderController();
    or.orders(req, res);
});

router.get('/order/getOrderList', function (req, res) {
    let or = new orderController();
    or.getOrderList(req, res);
});

// router.get('/user/delete/:id', function (req, res) {
//     let tus = new userController();
//     tus.delete(req, res);
// });

// router.get('/user/change_status/:id', function (req, res) {
//     let tus = new userController();
//     tus.changeStatus(req, res);
// });

// router.get('/testimonial/add', function (req, res) {
//     let tus = new testimonialController();
//     tus.add(req, res);
// });

// router.post('/testimonial/addrecord', multer({ storage: strogeTestimonial }).any("upload"), function (req, res) {
//     let tus = new testimonialController();
//     tus.addrecord(req, res);
// });

router.get('/order/edit/:id', function (req, res) {
    let or = new orderController();
    or.edit(req, res);
});

router.post('/order/updaterecord', multer({ storage: strogeTestimonial }).any("upload"), function (req, res) {
    let or = new orderController();
    or.updaterecord(req, res);
});


router.get('/order/view/:id', function (req, res) {
    let or = new orderController();
    or.vieworders(req, res);
});

router.post('/order/getOrderDetail', multer({ storage: strogeTestimonial }).any("upload"), function (req, res) {
    let or = new orderController();
    tus.getOrderDetail(req, res);
});

/* ******************* Order module end ******************* */


/* ******************* Page module start ******************* */

router.get('/page', function (req, res) {
    let pg = new pageController();
    pg.pages(req, res);
});

router.get('/page/getPageList', function (req, res) {
    let pg = new pageController();
    pg.getPageList(req, res);
});

router.get('/page/delete/:id', function (req, res) {
    let pg = new pageController();
    pg.delete(req, res);
});

router.get('/page/change_status/:id', function (req, res) {
    let pg = new pageController();
    pg.changeStatus(req, res);
});

router.get('/page/add', function (req, res) {
    let pg = new pageController();
    pg.add(req, res);
});

router.post('/page/addrecord', multer({ storage: strogeBanner }).any("upload"), function (req, res) {
    let pg = new pageController();
    pg.addrecord(req, res);
});

router.get('/page/edit/:id', function (req, res) {
    let pg = new pageController();
    pg.edit(req, res);
});

router.post('/page/updaterecord', multer({ storage: strogeBanner }).any("upload"), function (req, res) {
    let pg = new pageController();
    pg.updaterecord(req, res);
});

/* ******************* Page module end ******************* */


/* ******************* Setting module start ******************* */

router.get('/setting', function (req, res) {
    let st = new settingController();
    st.settings(req, res);
});

router.get('/setting/getSettingList', function (req, res) {
    let st = new settingController();
    st.getSettingList(req, res);
});

router.get('/setting/delete/:id', function (req, res) {
    let st = new settingController();
    st.delete(req, res);
});

router.get('/setting/change_status/:id', function (req, res) {
    let st = new settingController();
    st.changeStatus(req, res);
});

router.get('/setting/add', function (req, res) {
    let st = new settingController();
    st.add(req, res);
});

router.post('/setting/addrecord', function (req, res) {
    let st = new settingController();
    st.addrecord(req, res);
});

router.get('/setting/edit/:id', function (req, res) {
    let st = new settingController();
    st.edit(req, res);
});

router.post('/setting/updaterecord', function (req, res) {
    let st = new settingController();
    st.updaterecord(req, res);
});

/* ******************* Setting module end ******************* */




module.exports = router;
