require('dotenv').config();
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');

global.constant = require('./config/constant');
global.message = require('./config/message');
global.multer = require('multer');
global.path = require('path');
global.dateFormat = require('dateformat');
global.router = express.Router();
global.conn = require('./config/database');
global.promise = require('promise');
global.md5 = require('md5');
global.randomstring = require('randomstring');
global.nodemailer = require('nodemailer');

const stripe = require("stripe")("sk_test_LoxPw3X84sVD4Rb9JOishQcx00xu6Kubln");

const hbs = require('hbs');

const https = require('https');
var fs = require('fs');
var options = {
	key: fs.readFileSync('./certificates/sourcesoftsolutions.com.key'),
	cert: fs.readFileSync('./certificates/STAR_sourcesoftsolutions_com.crt'),
	ca: fs.readFileSync('./certificates/COMODORSAAddTrustCA.crt')
};

// For admin
const admin = require('./routes/admin');

// For website
const website = require("./routes/website");

const app = express();
const web = express();

app.use(cors());
app.use(flash());

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './admin/views'));

web.set('views', path.join(__dirname, './website/views'));
web.use('/', website);

hbs.registerHelper('ifEquals', function (a, b, options) {
	//console.log(a);
	//console.log(b);
    if (a === b) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('ifNotEquals', function (a, b, options) {
    if (a !== b) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('for', function(from, to, incr, block) {
    var accum = '';
    for(var i = from; i <= to; i += incr)
        accum += block.fn(i);
    return accum;
});

hbs.registerHelper('selected', function(option, value){
    if (option === value) {
        return ' selected';
    } else {
        return ''
    }
});

hbs.registerHelper('selectedmultiple', function(option, value){
    if (value.includes(option)) {        
        let sel = "selected";
        return sel;
    } else {
        let unsel = "";
        return unsel;
    }
});

app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'assets')));

// web.use(express.static(path.join(__dirname, 'uploads')));
// web.use(express.static(path.join(__dirname, 'assets')));

app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// web.use(bodyParser.json({ limit: '50mb', extended: true }));
// web.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
// app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_id',
    name: 'detailgarage',
    secret: 'detailgarageadmin',
    resave: true,
    saveUninitialized: false,
    // cookie: {
    //     expires: 600000
    // }
}));

app.use('/', web);
app.use('/admin', admin);

router.all('*', function (req, res, next) {
    next();
});
  
https.createServer(options, app).listen(8018);

/*app.listen(constant.PORT, () => {
    console.log('App listening on port ' + constant.PORT)
});*/






