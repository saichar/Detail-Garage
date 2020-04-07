var async = require('async');
class UserController {
    users(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var render_options = {
                admin_details: req.session.admin,
                layout: 'layouts/after_login',
            };
            req.flash('success', message['701']);
            res.locals.message = req.flash();
            res.render('user/users', render_options);
        }
    }

    getUserList(req, res) {
        async.parallel({
            one: function (callback) {
                var limit = constant.PAGE_LIMIT;
                var offset = parseInt(req.query.offset);
                var search = req.query.search;
                if (search) {
                    var searchData = " AND (first_name LIKE '%" + search + "%' OR first_name LIKE '%" + search + "%' OR email LIKE '%" + search + "%' OR mobile LIKE '%" + search + "%')";
                } else {
                    var searchData = "";
                }
                var sql = "SELECT * FROM tbl_users WHERE is_deleted = 0 " + searchData + " LIMIT " + offset + ", " + limit;
                // console.log(sql);
                conn.query(sql, function (err, rows) {
                    if (err) {
                        callback(null, []);
                    } else {
                        callback(null, rows);
                    }
                });
            },
            two: function (cb) {
                var sql = "SELECT * FROM tbl_users WHERE is_deleted = 0";
                conn.query(sql, function (err, rows) {
                    if (err) {
                        cb(null, []);
                    } else {
                        cb(null, rows);
                    }
                });
            }
        }, function (err, results) {
            res.json({ "rows": results.one, "total": results.two.length });
        }
        );
    }

    delete(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var sql = "UPDATE tbl_users SET is_deleted = 1 WHERE id = (?) ";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (rows[0]) {
                    res.redirect('/admin/user');
                    res.end();
                } else {
                    res.redirect('/admin/user');
                    res.end();
                }
            });
        }
    }

    changeStatus(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var sql = "UPDATE tbl_users SET status = CASE WHEN status = 1 THEN 0 WHEN status = 0 THEN 1 end WHERE id = (?) ";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (rows[0]) {
                    res.redirect('/admin/user');
                    res.end();
                } else {
                    res.redirect('/admin/user');
                    res.end();
                }
            });
        }
    }

    // add(req, res) {
    //     if (!req.session.admin) {
    //         res.redirect('/admin');
    //     } else {
    //         var render_options = {
    //             admin_details: req.session.admin,
    //             layout: 'layouts/after_login',
    //         };
    //         res.render('user/add', render_options);
    //     }
    // }

    // addrecord(req, res) {
    //     if (!req.session.admin) {
    //         res.redirect('/admin');
    //     } else {            
    //         let first_name = req.body.first_name;
    //         let last_name = req.body.last_name;
    //         let email = req.body.email;
    //         let mobile = req.body.mobile;
    //         let status = req.body.status;
    //         let addedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
    //         let sql = "INSERT INTO tbl_users (first_name, last_name, email, mobile, status, addedOn) VALUES (?, ?, ?, ?, ?, ?)";
    //         conn.query(sql, [first_name, last_name, email, mobile, status, addedOn], function (err, rows) {
    //             if (err) {
    //                 req.flash('error', message['701']);
    //                 res.redirect('/admin/user/add');
    //                 res.end();
    //             } else {
    //                 req.flash('success', message['705']);
    //                 res.redirect('/admin/user');
    //                 res.end();
    //             }
    //         });
    //     }
    // }

    // edit(req, res) {
    //     if (!req.session.admin) {
    //         res.redirect('/admin');
    //     } else {
    //         let sql = "SELECT * FROM tbl_users WHERE id = (?)";
    //         conn.query(sql, [req.params.id], function (err, rows) {
    //             if (err) {
    //                 res.redirect('/admin/user');
    //                 res.end();
    //             } else {
    //                 if (rows[0]) {
    //                     // console.log(rows[0]);
    //                     // rows[0]['oldimage'] = rows[0]['image'];
    //                     // rows[0]['image'] = constant.SHOW_TESTIMONIAL_PIC+rows[0]['image'];                        
                        
    //                     var render_options = {
    //                         admin_details: req.session.admin,
    //                         data: rows[0],
    //                         layout: 'layouts/after_login',
    //                     };
    //                     res.render('user/edit', render_options);
    //                 }
    //             }
    //         });
    //     }
    // }

    // updaterecord(req, res) {
    //     if (!req.session.admin) {
    //         res.redirect('/admin');
    //     } else {
    //             // console.log(req.files);
    //             v

    //             let id = req.body.id;
    //             let first_name = req.body.first_name;
    //             let last_name = req.body.last_name;
    //             let email = req.body.email;
    //             let mobile = req.body.mobile;
    //             let status = req.body.status;
                
    //             let sql = "UPDATE tbl_users SET first_name = (?), last_name = (?), email = (?), mobile = (?), status = (?) WHERE id = (?)";
    //             conn.query(sql, [first_name, last_name, email, mobile, status, id], function (err, rows) {
    //                 if (err) {
    //                     req.flash('error', message['701']);
    //                     res.redirect('/admin/user/edit/' + id);
    //                     res.end();
    //                 } else {
    //                     req.flash('success', message['706']);
    //                     res.redirect('/admin/user');
    //                     res.end();
    //                 }
    //             });
            
    //     }
    // }
}

module.exports = UserController;