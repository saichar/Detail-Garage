// const base_url = 'http://localhost:8018';
// const front_base_url = 'http://localhost:8017';
// const base_url = 'https://detailgarage.sourcesoftsolutions.com:8018';
// const front_base_url = 'https://detailgarage.sourcesoftsolutions.com';
const front_base_url = 'http://192.168.0.236/:9133';
const base_url = 'http://192.168.0.236/:9132';
module.exports = Object.freeze({
    PORT: 9133,
    SITE_NAME: "Detail Garage",
    PAGE_LIMIT: 10,
    PAGE_SIZE: 10,
    BASE_URL: base_url,
    FRONT_BASE_URL: front_base_url,
    SITE_URL : "http://localhost/detailgarage/lightspeedapi.php",
    
    // Show pic path
    SHOW_LOGO_PIC: base_url + "/images/logo.png",
    SHOW_PROFILE_PIC: base_url + "/users/",
    SHOW_NO_PROFILE_PIC: base_url + "/users/noimage.png",

    SHOW_BANNERS_PIC: base_url + "/banners/",
    SHOW_NO_BANNERS_PIC: base_url + "/banners/noimage.png",

    SHOW_TESTIMONIAL_PIC: base_url + "/testimonials/",
    SHOW_NO_TESTIMONIAL_PIC: base_url + "/testimonials/noimage.png",

    SHOW_PRODUCTS_PIC: base_url + "/products/",
    // SHOW_FRONT_PRODUCTS_PIC: front_base_url + "/products/",
    // SHOW_FRONT_NO_PRODUCTS_PIC: front_base_url + "/products/noimage.jpeg",
    SHOW_FRONT_PRODUCTS_PIC: base_url + "/products/",
    SHOW_FRONT_NO_PRODUCTS_PIC: base_url + "/products/noimage.jpeg",
    

 
    // SMTP Details
    SMTP_PROTOCOL: "smtp",
    SMTP_HOST: "smtp.gmail.com",
    SMTP_PORT: "465",
    SMTP_USER: "sourcesoft.developer@gmail.com",
    SMTP_PASS: "!!#$124><RTTq1",
    MAIL_TYPE: "html",
    CHARSET: "iso-8859-1",
});
