class AdminController{
    adminLogin(req, res){
        if (req.session.admin) {
            res.redirect('/admin/dashboard');
        } else {
            var render_options = {
                layout: 'layouts/header'
            };
            req.session.admin_panel_messages = {};
            res.render('admin/login', render_options);
        }
    }

    login(req, res){
        // console.log(req.body);
        if (req.session.admin) {
            res.redirect('/admin/dashboard');
        } else {
            let sql = 'SELECT * FROM tbl_admin WHERE email = (?) AND password = MD5(?) AND status = 1';
            conn.query(sql, [req.body.email, req.body.password], function(err, rows) {                
                if (err) {
                    req.session.admin_panel_messages.error = message['701'];
                    res.redirect('/admin');
                } else {
                    // console.log(rows[0]);
                    // console.log(rows[0]['name']);
                    if (rows[0]) {
                        var adminDetails = rows[0];
                        adminDetails['id'] = rows[0]['id'];
                        adminDetails['name'] = rows[0]['full_name'];
                        adminDetails['email'] = rows[0]['email'];
                        adminDetails['profile_image'] = constant.SHOW_PROFILE_PIC+rows[0]['profile_image'];
                        adminDetails['member_since'] = dateFormat(rows[0]['addedOn'], 'mmm dd, yyyy');
                        adminDetails['current_year'] = dateFormat('yyyy');
                        adminDetails['site_name'] = constant.SITE_NAME;
                        adminDetails['page_size'] = constant.PAGE_SIZE;

                        req.session.admin = adminDetails; // setting session variable
                        // req.session.admin = rows[0]; // setting session variable
                        res.redirect('/admin/dashboard'); 
                    } else {
                        req.session.admin_panel_messages.error = message['702'];
                        res.redirect('/admin');
                    }
                }
            });
        }
    }

    logout(req, res){
        if (!req.session.admin) {
            res.redirect('/');
        } else {
            req.session.destroy(function(err) {
            // cannot access session here
            });
            res.redirect('/admin');
        }
    }

    forgot(req, res){
        var render_options = {
            layout: 'layouts/header'
        };
        req.session.admin_panel_messages = {};
        res.render('admin/forgotpassword', render_options);
    }

    forgotpassword(req, res){
        console.log(req.body.email);
        let sql = 'SELECT * FROM tbl_admin WHERE email = (?) AND status = 1 AND is_deleted = 0';
        conn.query(sql, [req.body.email], function(err, rows){
            if(err){
                req.flash('error', message['703']);
                res.redirect('/admin/forgot');
                res.end();
            } else {
                // console.log(rows[0]);
                var activationkey = randomstring.generate(7);
                let updateSql = "UPDATE tbl_admin SET activation_key = (?) WHERE email = (?)";
                conn.query(updateSql, [activationkey, req.body.email], function(err, result){
                    if(err){
                        req.flash('error', message['701']);
                        res.redirect('/admin/forgot');
                    } else {
                        let sql = "SELECT id, name, subject, description FROM tbl_email_template WHERE name = 'forgot_password_admin' "
                        conn.query(sql, function(err, mailrows){
                            if(err){
                                req.flash('error', message['701']);
                                res.redirect('/admin/forgot');
                            } else {
                                var toName = rows[0]['name'];
                                var toMail = rows[0]['email'];
                                var subject = mailrows[0]['subject'];
                                var emailContent = mailrows[0]['description'];

                                var clicklink = constant.BASE_URL+"/admin/resetverify/"+rows[0]['id']+"/"+activationkey;

                                emailContent = emailContent.replace('email_logo_url', constant.SHOW_LOGO_PIC);
                                emailContent = emailContent.replace('contact_person', toName); 
                                emailContent = emailContent.replace('click_link', clicklink); 
                                emailContent = emailContent.replace('site_name', constant.SITE_NAME); 
                                emailContent = emailContent.replace('current_year', dateFormat("mm-dd-yyyy"));
                                
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
                                    from: 'support@sunriseresort.com',
                                    to: toMail,
                                    subject: subject,
                                    html: emailContent
                                };
                                
                                transporter.sendMail(mailOptions, function(error, info){
                                    if (error) {
                                        // console.log(error);
                                        req.flash('error', message['701']);
                                        res.redirect('/admin/forgot');
                                    } else {
                                        // console.log('Email sent: ' + info.response);
                                        req.flash('success', message['707']);
                                        res.redirect('/admin/forgot');
                                        res.end();
                                    }
                                });
                            }
                        });
                    }
                }); 
            }
        });
    }

    resetverify(req, res){
        var id = req.params.id;
        var activationkey = req.params.activationkey;
        if(!id && !activationkey){
            var render_options = {
                layout: 'layouts/header'
            };
            req.session.admin_panel_messages = {};
            res.render('admin/login', render_options);
        } else {
            var render_options = {
                layout: 'layouts/header',
                id: id,
                activationkey: activationkey
            };
            req.session.admin_panel_messages = {};
            res.render('admin/reset', render_options);
        }        
    }

    resetpassword(req, res){
        var id = req.body.id;
        var activationkey = req.body.activationkey;
        var password = req.body.password;
        var cpassword = req.body.cpassword;
        if(password !== cpassword){            
            req.flash('error', message['708']);
            res.redirect("resetverify/"+id+"/"+activationkey);
            res.end();
        } else {
            new promise((resolve, reject) => {
                let sql = "SELECT id, activation_key FROM tbl_admin WHERE id = "+id+" AND activation_key = '"+activationkey+"' ";
                conn.query(sql, function(err, rows){
                    if(err){
                        req.flash('error', message['710']);
                        res.redirect("resetverify/"+id+"/"+activationkey);
                        res.end();
                    } else {
                        resolve(req);
                    }
                });
            }).then(function (req) {
                let sql = "UPDATE tbl_admin SET password = '"+md5(req.body.password)+"', activation_key = '' WHERE id = "+id+" AND activation_key = '"+activationkey+"' ";
                // console.log(sql);
                conn.query(sql, function(err, rows){
                    if(err){
                        console.log(err);
                        req.flash('error', message['701']);
                        res.redirect("resetverify/"+id+"/"+activationkey);
                        res.end();
                    } else {
                        req.session.admin_panel_messages.success = message['709'];
                        res.redirect('/admin'); 
                        res.end();
                    }
                });
            });
        }
    }

    profile(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            let sql = "SELECT id, full_name, email, profile_image, status FROM tbl_admin WHERE id = (?) AND is_deleted = 0";
            conn.query(sql, [req.params.id], function(err, rows){
                if(rows[0]){
                    var details = [];
                    details['id'] = rows[0]['id'];
                    details['name'] = rows[0]['full_name'];
                    details['email'] = rows[0]['email'];
                    details['profile_image'] = constant.SHOW_PROFILE_PIC+rows[0]['profile_image'];
                    details['status'] = rows[0]['status'];
                    details['oldimage'] = rows[0]['profile_image'];

                    var render_options = {
                        admin_details: req.session.admin,
                        layout: 'layouts/after_login',
                        data: details,
                    };
                    res.render('admin/profile', render_options);
                }
            });                        
        }
    }

    updateprofile(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            // console.log(req.files);
            var filename = "";
            if (!req.files[0] && req.files[0] == undefined) {
                filename = req.body.oldimage;
            }else{
                filename = req.files[0].filename;
            }

            let id = req.body.id;
            let name = req.body.name;
            let email = req.body.email;
            let profile_image = filename;
            let status = req.body.status;
            let updatedOn = dateFormat('yyyy-mm-dd HH:MM:ss');

            var password = "";
            if(req.body.password){
                password = ", password = '"+md5(req.body.password)+"' ";
            } else {
                password = "";
            }

            let sql = "UPDATE tbl_admin SET full_name = '"+name+"', email = '"+email+"', profile_image = '"+profile_image+"', status = "+status+", updatedOn = '"+updatedOn+"' "+ password +" WHERE id = "+id+" ";
            
            conn.query(sql, function (err, rows) {
                if (err) {
                    req.flash('error', message['701']);
                    res.redirect('/admin/profile/' + id);
                    res.end();
                } else {
                    req.flash('success', message['706']);
                    res.redirect('/admin/profile/' + id);
                    res.end();
                }
            });
        }
    }

    

}

module.exports = AdminController;
