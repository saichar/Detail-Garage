
//var auth = require('../../helpers/auth_helper');
var async = require('async');
var randomstring = require('randomstring');
var promise = require('promise');

class WebsiteController{
    userSignup(req, res){
        let sql = 'SELECT * FROM tbl_users WHERE email = (?)';
        conn.query(sql, [req.body.email], function(err, getrows){
            if(err){
                res.json({status:"false", response:[],message:"Something went wrong"});
                res.end();
            } else {
                if(getrows[0]){
                    res.json({status:"false", response:[],message:"User already registered"});
                    res.end();
                } else {
                    var verification_key = randomstring.generate(15);
                    var link = constant.BASE_URL+"/verifyaccount?token="+verification_key;
                    let sql = "INSERT INTO tbl_users (first_name, last_name, email, mobile, password, verification_key) VALUES (?, ?, ?, ?, ?, ?)";
                    conn.query(sql, [req.body.first_name, req.body.last_name, req.body.email, req.body.mobile, md5(req.body.password), verification_key], function (err, rows) {
                        if(err){
                            res.json({status:"false", response:[],message:"Something went wrong"});
                            res.end();
                        } else {
                            let sql = "SELECT id, name, subject, description FROM tbl_email_template WHERE name = 'user_veryfication_code' "
                            conn.query(sql, function(err, mailrows){
                                if(err){
                                    res.json({status:"false", response:[],message:"Something went wrong"});
                                    res.end();
                                } else {
                                    // console.log(mailrows);
                                    var subject = mailrows[0]['subject'];
                                    var emailContent = mailrows[0]['description'];
                                    var emailContent = emailContent.replace('{{contact_person}}', req.body.first_name, "g");
                                    emailContent = emailContent.replace('{{email_logo_url}}', constant.SHOW_LOGO_PIC, "g");
                                    
                                    emailContent = emailContent.replace('{{click_link}}',link , "g");
                                    emailContent = emailContent.replace('{{site_name}}', constant.SITE_NAME, "g");
                                    emailContent = emailContent.replace('{{year}}', "2019", "g");

                                    let transporter = nodemailer.createTransport({
                                        host: constant.SMTP_HOST,
                                        port: constant.SMTP_PORT,
                                        secure: true, // true for 465, false for 587 other ports
                                        auth: {
                                            user: constant.SMTP_USER, // generated ethereal user
                                            pass: constant.SMTP_PASS // generated ethereal password
                                        }
                                    });

                                    var mailOptions = {
                                        from: 'Detail Garage',
                                        to: req.body.email,
                                        subject: subject,
                                        html: emailContent
                                    };

                                    new promise((resolve, reject) => {
                                        transporter.sendMail(mailOptions, function(error, info){
                                            if (error) {
                                                // console.log(error);
                                                reject();
                                            } else {
                                                // console.log('Email sent: ' + info.response);
                                                resolve();
                                            }
                                        });
                                        resolve();                            
                                    }).then(() => {
                                        // console.log('SUCCESS');
                                        var response = {};
                                            response = { 'status': 'success', 'message': 'Account activation link sent on your email. Please verify your details to continue login' };
                                        res.send(response);
                                        res.end();
                                    })
                                }
                            })
                        }
                    })
                }
            }
        });
    }
    userfSignup(req, res){
        let sql = 'SELECT * FROM tbl_users WHERE email = (?) AND ftoken=(?) ';
        conn.query(sql, [req.body.email,req.body.ftoken], function(err, getrows){
            if(err){
                res.json({status:"false", response:[],message:"Something went wrong"});
                res.end();
            } else {
                if(getrows[0]){
                    if(getrows[0]['profile_image'] != undefined){
                    getrows[0]['profile_image'] = ((getrows[0]['profile_image'] != '' && getrows[0]['profile_image'].slice(0, 7) != 'http://' && getrows[0]['profile_image'].slice(0, 8) != 'https://') ? constant.SHOW_PROFILE_PIC + getrows[0]['profile_image'] : getrows[0]['profile_image']);
                    }else{
                        getrows[0]['profile_image'] = ''; 
                    }
                    // rows[0]['token'] = token;
                    // console.log(rows);
                    res.json({status : "success", message:"Sign in successfull!", data: getrows[0]});
                } else {
                   
                    let sql = "INSERT INTO tbl_users (first_name, last_name, email, logintype, ftoken) VALUES (?, ?, ?, ?, ?)";
                    conn.query(sql, [req.body.first_name, req.body.last_name, req.body.email, req.body.logintype, req.body.ftoken], function (err, rows) {
                        if(err){
                            res.json({status:"false", response:[],message:"Something went wrong"});
                            res.end();
                        } else {
							 let sql = 'SELECT * FROM tbl_users WHERE email = (?) AND ftoken=(?) ';
                             conn.query(sql, [req.body.email,req.body.ftoken], function(err, rows){
								if(err){
								res.json({status:"false", response:[],message:"Something went wrong"});
								res.end();
								} else{
									 res.json({status : "success", message:"Sign in successfull!", data: rows[0]});
								}
							})
                        }
                    })
                }
            }
        });
    }

    userLogin(req, res){
        conn.query('SELECT * FROM tbl_users WHERE email = ? AND password = MD5(?)',[req.body.email, req.body.password], function(err, rows){
            if(err){
                res.json({status:"false", response:[],message:"Something went wrong"});
                res.end();
            }else{
                if(rows[0]){
                    if(rows[0]['status'] == 1){
                        // var token = auth.generateToken(rows[0]);
                        if(rows[0]['profile_image'] != undefined){
                            rows[0]['profile_image'] = ((rows[0]['profile_image'] != '' && rows[0]['profile_image'].slice(0, 7) != 'http://' && rows[0]['profile_image'].slice(0, 8) != 'https://') ? constant.SHOW_PROFILE_PIC + rows[0]['profile_image'] : rows[0]['profile_image']);
                            }else{
                                rows[0]['profile_image'] = ''; 
                            }
                            // rows[0]['token'] = token;
                            // console.log(rows);
                            res.json({status : "success", message:"Sign in successfull!", data: rows[0]});
                    } else {
                        res.json({status : "false", message:"Please activate your account!", data: []});
                    }                    
                }else{
                    res.json({status : "false", message:"Email id OR password not matched!", data: []});
                }
            }
        })
    }


    changePassword(req, res){
        conn.query('SELECT * FROM tbl_users WHERE email = ? AND password = MD5(?)',[req.body.email, req.body.current_password], function(err, rows){
            if(err){
                res.json({status:"false", response:[],message:"Something went wrong"});
                res.end();
            }else{
                if(rows[0]){
                    if(req.body.new_password == req.body.confirm_password){
                        conn.query('UPDATE tbl_users SET password = MD5(?) WHERE email = (?)', [req.body.confirm_password, req.body.email], function(err, rows){
                            if(err){
                                res.json({status:"false", response:[],message:"Something went wrong"});
                                res.end();
                            }else{
                                res.json({status : "success", response:[],message:"Password changed successfully!!!"});
                            }
                        })
                    } else {
                        res.json({status:"false", response:[],message:"new password and confirm password not matched!"});
                        res.end();
                    }
                } else {
                    res.json({status:"false", response:[],message:"current password not matched!"});
                    res.end();
                }
            }
        })
    }


    updatePassword(req, res){
        var sql = "SELECT * FROM tbl_users WHERE password_verification_key = '"+req.body.verification_key+"'";
        conn.query(sql, function(err, rows){
        // conn.query('SELECT * FROM tbl_users WHERE password_verification_key = ?',[req.body.verification_key], function(err, rows){
            if(err){
                res.json({status:"false", response:[],message:"User not found!"});
                res.end();
            }else{
                var sql = "UPDATE tbl_users SET password = MD5(?), password_verification_key=null WHERE password_verification_key = '"+req.body.verification_key+"'";
                console.log(sql);

                // conn.query('UPDATE tbl_users SET password = MD5(?), password_verification_key=null WHERE password_verification_key = ?',[req.body.new_password,req.body.password_verification_key], function(err, rows){
                conn.query(sql, [req.body.new_password], function(err, rows){
                    if(err){
                        res.json({status:"false", response:[], message:"something went wrong!"});
                        res.end();
                    }else{
                        if(rows.affectedRows){
                            var response = {};
                            response.status = "success";
                            response.message = 'Your password has been updated! Please login';
                            res.send(response);
                            res.end();
                        }else{
                            res.json({status:"false", response:[], message:"Something went wrong!"});
                            res.end();
                        }
                    }
                })
            }
        })
    }


    subscribeUser(req, res){
        let addedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
        if(req.body.email != ""){
            let sql = "INSERT INTO tbl_subscribers (email, addedOn) VALUES (?, ?)";
            conn.query(sql, [req.body.email, addedOn], function (err, rows) {
                if (err) {
                    res.json({status: "false", response: rows, message: 'Something went wrong!'});
                    res.end();
                } else {
                    res.json({status: "success", response: [], message: 'You have subscribed successfully!'});
                    res.end();
                }
            });
        } else {
            res.json({status: "false", response: '', message: 'Enter valid email!'});
            res.end();
        }
        
    }


    verifyaccount(req, res){
        // console.log(req.query.token);
        conn.query('UPDATE tbl_users SET status = "1", verification_key = "" WHERE verification_key = ?', [req.query.token], function(err, rows){
            console.log(rows);
            if(err){
                res.render('verifyaccount', {data:{"homepage":"Something went wrong! Please try to signup first or contact to administrator", status: 0}});
            }else{
                if(rows.affectedRows){
                    res.render('verifyaccount', {data:{"homepage":constant.FRONT_BASE_URL, status: 1}});
                }
            }
        })
    }


    forgotPassword(req, res, next){
        conn.query('SELECT * FROM tbl_users WHERE email = ?',[req.body.email], function(er, rw){
            if(er){
                res.json({status:"false", response:[],message:"Something went wrong"});
                res.end();
            } else {
                if(rw[0]){
                    var password_verification_key = randomstring.generate(25);
                    conn.query('UPDATE tbl_users SET password_verification_key = ? WHERE email = ?', [password_verification_key, req.body.email], function(err, rows){
                    if(err){
                        res.json({status:"false", response:[], message:"something went wrong!"});
                        res.end();
                    } else {
                        if(rows.affectedRows){
                            conn.query('SELECT * FROM tbl_email_template WHERE name = "forgot_password_user"', function(er, mailrows){
                                if(er){
                                    res.json({status:"false", response:[],message:"Something went wrong"});
                                    res.end();
                                }else{
                                    var link = constant.FRONT_BASE_URL+"/forgotPassword?verification_key="+password_verification_key;
                                    var subject = mailrows[0]['subject'];
                                    var emailContent = mailrows[0]['description'];
                                    var emailContent = emailContent.replace('{{contact_person}}', "User", "g");
                                    emailContent = emailContent.replace('{{email_logo_url}}', constant.SHOW_LOGO_PIC, "g");
                                    
                                    emailContent = emailContent.replace('{{click_link}}',link , "g");
                                    emailContent = emailContent.replace('{{site_name}}', constant.SITE_NAME, "g");
                                    emailContent = emailContent.replace('{{year}}', "2019", "g");

                                    let transporter = nodemailer.createTransport({
                                        host: constant.SMTP_HOST,
                                        port: constant.SMTP_PORT,
                                        secure: true, // true for 465, false for 587 other ports
                                        auth: {
                                            user: constant.SMTP_USER, // generated ethereal user
                                            pass: constant.SMTP_PASS // generated ethereal password
                                        }
                                    });

                                    var mailOptions = {
                                        from: 'Detail Garage',
                                        to: req.body.email,
                                        subject: subject,
                                        html: emailContent
                                    };
                                
                                // send mail with defined transport object
                                new promise((resolve, reject) => {
                                transporter.sendMail(mailOptions, function(error, info){
                                    if (error) {
                                        // console.log(error);
                                        reject();
                                    } else {
                                        // console.log('Email sent: ' + info.response);
                                        resolve();
                                    }
                                });
                                resolve();
                                    
                                }).then(() => {
                                    var response = {};
                                    response.status = "success";
                                    response.message = 'Password link has been sent to your email. Please reset your password!';
                                    res.send(response);
                                    res.end();
                                })
                            }
                        })
                        }else{
                            res.json({status:"false", response:[], message:"something went wrong!"});
                        }
                    }
                });
                }else{
                    res.json({status:"false", response:[], message:"Your email id is not associated with any account. Please register!!!"});
                }
            }
        })
    }


    getBannerList(req, res){
        let sql = "SELECT id, title, description, image FROM tbl_banner WHERE status = 1 AND is_deleted = 0";
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'bannerlist'});
                    res.end();
                }                
            }
        });
    }


    clientTestimonial(req, res){
        let sql = "SELECT * FROM tbl_testimonials WHERE status = 1 AND is_deleted = 0";
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'testimonialData'});
                    res.end();
                }                
            }
        });
    }


    getSettingInformation(req, res){
        let sql = "SELECT name, value, bootstrap_class FROM tbl_settings WHERE setting_name IN ('contact_address', 'contact_email', 'contact_number') AND status = 1 AND is_deleted = 0";
        // console.log(sql);
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'settingInformation'});
                    res.end();
                }                
            }
        });
    }


    getStanderedDelivery(req, res){
        let sql = "SELECT value FROM tbl_settings WHERE setting_name IN ('delivery_amount') AND status = 1 AND is_deleted = 0";
        // console.log(sql);
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'standeredDelivery'});
                    res.end();
                }                
            }
        });
    }



    userEnquiry(req, res){
        let sql = "INSERT INTO tbl_enquiry (name, phone, email, message) VALUES (?, ?, ?, ?)";
        conn.query(sql, [req.body.name, req.body.phone, req.body.email, req.body.message], function (err, rows) {
            if(err){
                res.json({status:"false", response:[],message:"Something went wrong"});
                res.end();
            } else {
                let sql = "SELECT id, name, subject, description FROM tbl_email_template WHERE name = 'user_enquiry' "
                conn.query(sql, function(err, mailrows){
                    if(err){
                        res.json({status:"false", response:[],message:"Something went wrong"});
                        res.end();
                    } else {
                        var subject = mailrows[0]['subject'];
                        var emailContent = mailrows[0]['description'];
                        var emailContent = emailContent.replace('{{contact_person}}', req.body.first_name, "g");
                        emailContent = emailContent.replace('{{email_logo_url}}', constant.SHOW_LOGO_PIC, "g");
                        
                        
                        emailContent = emailContent.replace('{{site_name}}', constant.SITE_NAME, "g");
                        emailContent = emailContent.replace('{{year}}', "2019", "g");

                        let transporter = nodemailer.createTransport({
                            host: constant.SMTP_HOST,
                            port: constant.SMTP_PORT,
                            secure: true, // true for 465, false for 587 other ports
                            auth: {
                                user: constant.SMTP_USER, // generated ethereal user
                                pass: constant.SMTP_PASS // generated ethereal password
                            }
                        });

                        var mailOptions = {
                            from: 'Detail Garage',
                            to: req.body.email,
                            subject: subject,
                            html: emailContent
                        };

                        new promise((resolve, reject) => {
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    // console.log(error);
                                    reject();
                                } else {
                                    // console.log('Email sent: ' + info.response);
                                    resolve();
                                }
                            });
                            resolve();                            
                        }).then(() => {
                            // console.log('SUCCESS');
                            var response = {};
                                response = { 'status': 'success', 'message': 'Enquiry submited successfully!!' };
                            res.send(response);
                            res.end();
                        })
                    }
                })
            }
        })
    }

    addShippingAddress(req, res){
        let addedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
        let sql = "INSERT INTO tbl_shipping_address (user_id, type, country, state, city, address_1, addedOn) VALUES (?, ?, ?, ?, ?, ?, ?)";
        conn.query(sql, [req.body.user_id, req.body.address_type, req.body.country, req.body.state, req.body.city, req.body.address, addedOn], function (err, rows) {
            if(err){
                res.json({status:"false", response:[],message:"Something went wrong"});
                res.end();
            } else {
                res.json({status : "success", response:[],message:"Address added successfully!!!"});
            }
        });
    }


    updateShippingAddress(req, res){
        let updatedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
        conn.query('UPDATE tbl_shipping_address SET type = (?), country = (?), state = (?), city = (?), address_1 = (?), updatedOn = (?) WHERE id = (?)', [req.body.address_type, req.body.country, req.body.state, req.body.city, req.body.address, updatedOn, req.body.address_id], function(err, rows){
            if(err){
                res.json({status:"false", response:[],message:"Something went wrong"});
                res.end();
            } else {
                res.json({status : "success", response:[],message:"Address updated successfully!!!"});
            }
        });
    }


    uploadUserImage(req, res){
        // console.log(req.body);
        // console.log(req.files[0].fieldname);
        var filename = "";
        if (req.files[0].fieldname == 'Image') {
            filename = req.files[0].filename;
        } else {
            filename = '';
        }
        let updatedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
        conn.query('UPDATE tbl_users SET profile_image = (?), updatedOn = (?) WHERE id = (?)', [filename, updatedOn, req.body.id], function(err, rows){
            if(err){
                res.json({status:"false", response:[],message:"Something went wrong"});
                res.end();
            } else {
                res.json({status : "success", response:[],message:"image uploded successfully!!!"});
            }
        });
    }



    getUserDetails(req, res){
        async.parallel({
            userDetails: function (callback) {
                var sql = "SELECT * FROM tbl_users tu WHERE tu.id = (?)";
                // console.log(sql);
                conn.query(sql, [req.body.user_id], function (err, rows) {
                    if (err) {
                        callback(null, []);
                    } else {
                        callback(null, rows);
                    }
                });
            },
            addressList: function (calb) {
                // var sql = "SELECT * FROM tbl_shipping_address WHERE user_id =" + req.body.user_id;

                var sql = "SELECT tsa.id, tsa.type, tsa.address_1, tc.countryid as country_id, tc.name as country, ts.stateid as state_id, ts.name as state, tci.cityId as city_id, tci.name as city FROM tbl_shipping_address tsa LEFT JOIN tbl_country tc ON tc.countryId = tsa.country LEFT JOIN tbl_state ts ON ts.stateId = tsa.state LEFT JOIN tbl_city tci ON tci.cityId = tsa.city WHERE tsa.user_id =" + req.body.user_id;

                // console.log(sql);

                conn.query(sql, function (err, addrows) {
                    if (err) {
                        calb(null, []);
                    } else {
                        calb(null, addrows);
                    }
                });


            }
        }, function (err, results) {
            var data = {};
            data['userDetails'] = results.userDetails;
            data['addressList'] = results.addressList;
            res.json({ "response": data });
            res.end();
        });
    }


    deleteShippingAddress(req, res){
        // console.log(req.body);
        var sql = "DELETE FROM tbl_shipping_address WHERE user_id = (?) AND id = (?)";
        conn.query(sql, [req.body.user_id, req.body.id], function(err, rows){
            if(err){
                res.json({status: "false", response: rows, message: 'Something went wrong!'});
                res.end();
            } else {
                res.json({status: "success", response: rows, message: 'Address deleted successfully!'});
                res.end();              
            }
        });
    }


    getShippingAddressList(req, res){
        // var sql = "SELECT * FROM tbl_shipping_address WHERE user_id =" + req.body.user_id;
        var sql = "SELECT tsa.id, tsa.type, tsa.address_1, tc.name as country, ts.name as state, tci.name as city FROM tbl_shipping_address tsa LEFT JOIN tbl_country tc ON tc.countryId = tsa.country LEFT JOIN tbl_state ts ON ts.stateId = tsa.state LEFT JOIN tbl_city tci ON tci.cityId = tsa.city WHERE tsa.user_id =" + req.body.user_id;
        conn.query(sql, function (err, rows) {
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'shippingAddressList'});
                    res.end();
                }                
            }
        });
    }


    getStateList(req, res){
        let sql = "SELECT * FROM tbl_state WHERE countryId = 231";
        //console.log(sql);
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'stateList'});
                    res.end();
                }                
            }
        });
    }


    getCityList(req, res){
        // console.log(req.body);
        let sql = "SELECT * FROM tbl_city WHERE stateId ="+ req.body.state_id;
        // console.log(sql);
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'cityList'});
                    res.end();
                }                
            }
        });
    }


    getAllCityList(req, res){
        // console.log(req.body);
        let sql = "SELECT * FROM tbl_city WHERE status=1";
        console.log(sql);
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'cityList'});
                    res.end();
                }                
            }
        });
    }
    

    saveUserDetails(req, res){
        // console.log(req.body);
        // console.log(req.query.token);
        conn.query('UPDATE tbl_users SET first_name = (?), last_name = (?), mobile = (?) WHERE id = (?)', [req.body.first_name, req.body.last_name, req.body.mobile, req.body.id], function(err, rows){
            // console.log(rows);
            if(err){
                res.json({status:"false", response:[],message:"Something went wrong"});
                res.end();
            }else{
                if(rows.affectedRows){
                    res.json({status:"success", response:[],message:"User updated successfully!"});
                    res.end();
                } else {
                    res.json({status:"false", response:[],message:"Something went wrong"});
                    res.end();
                }
            }
        })
    }
    
    relatedsearch(req, res){
		var name=req.body.name;
		async.parallel({
            productlist: function (callback) {
                var sql = "SELECT product_name as name From tbl_products WHERE product_name LIKE '%"+name+"%' LIMIT 0,5";
                // console.log(sql);
                conn.query(sql, [name,name], function (err, rows) {
                    if (err) {
                        callback(null, []);
                    } else {
                        callback(null, rows);
                    }
                });
            },
            category: function (calb) {
              

                var sql = "SELECT ct.category_name as name  From tbl_category ct LEFT JOIN tbl_sub_category sct ON ct.id = sct.category_id WHERE  ct.category_name LIKE '%"+name+"%' OR  ct.slug LIKE '%"+name+"%' OR  sct.sub_category_name LIKE '%"+name+"%' GROUP BY  ct.category_name LIMIT 0,5";

                // console.log(sql);

                conn.query(sql, function (err, addrows) {
                    if (err) {
                        calb(null, []);
                    } else {
                        calb(null, addrows);
                    }
                });


            }
        }, function (err, results) {
            var data = {};
            var newresult="";
            if(results.productlist.length>=results.category){
				data['productname'] = results.productlist;
				data['categorieslist'] = results.category;
				newresult = data['productname'].concat(data['categorieslist']);
			}else{
				data['categorieslist'] = results.category;
				data['productname'] = results.productlist;
				newresult = data['categorieslist'].concat(data['productname']);
			}
            
            res.json({ "response": newresult });
            res.end();
        });
		
		
    }
    

    getShippingAddressDetails_OLD(req, res){
        // console.log(req.body);
        let sql = "SELECT * FROM tbl_shipping_address WHERE status = '1' AND id = '"+req.body.address_id+"' AND user_id ="+ req.body.user_id;
        // console.log(sql);
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'shippingDetailsArr'});
                    res.end();
                }                
            }
        });
    }


    getShippingAddressDetails(req, res){
        async.parallel({
            shippingDetails: function (callback) {
                let sql = "SELECT * FROM tbl_shipping_address WHERE status = '1' AND id = '"+req.body.address_id+"' AND user_id ="+ req.body.user_id;
                // console.log(sql);
                conn.query(sql, function (err, rows) {
                    if (err) {
                        callback(null, []);
                    } else {
                        callback(null, rows);
                    }
                });
                // stateId = rows[0]['state'];
            },
            cityList: function (calb) {
                let sql = "SELECT * FROM tbl_city WHERE status=1 AND stateId ="+req.body.state_id;
                // console.log(sql);
                conn.query(sql, function (err, addrows) {
                    if (err) {
                        calb(null, []);
                    } else {
                        calb(null, addrows);
                    }
                });


            }
        }, function (err, results) {
            var data = {};
            data['shippingDetails'] = results.shippingDetails;
            data['cityList'] = results.cityList;
            // res.json({ "response": data });
            res.json({status: "true", response: data, message: 'shippingDetailsArr'});
            res.end();
        });
    }


    
    
}

module.exports = WebsiteController;
