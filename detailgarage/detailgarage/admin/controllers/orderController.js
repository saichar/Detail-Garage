var async = require('async');
class OrderController {
    orders(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var render_options = {
                admin_details: req.session.admin,
                layout: 'layouts/after_login',
            };
            req.flash('success', message['701']);
            res.locals.message = req.flash();
            res.render('order/orders', render_options);
        }
    }

    getOrderList(req, res) {
        async.parallel({
            one: function (callback) {
                var limit = constant.PAGE_LIMIT;
                var offset = parseInt(req.query.offset);
                var search = req.query.search;
                if (search) {
                    var searchData = "WHERE (transaction_no LIKE '%" + search + "%')";
                } else {
                    var searchData = "";
                }
                var sql = "SELECT too.*, SUM(toi.quantity) As totQuantity FROM tbl_order as too LEFT JOIN tbl_order_item AS toi ON (too.id = toi.order_id) " + searchData + " GROUP By too.id ORDER BY too.id DESC LIMIT " + offset + ", " + limit;

                // var sql = "SELECT tpr.*, tp.product_name As productName, tu.first_name As first_name, tu.last_name As last_name, concat(tu.first_name, ' ', tu.last_name) as full_name FROM tbl_product_review AS tpr INNER JOIN tbl_users AS tu ON (tu.id = tpr.user_id) INNER JOIN tbl_products AS tp ON (tp.id = tpr.product_id) WHERE tpr.is_deleted = 0 " + searchData + " LIMIT " + offset + ", " + limit;

                
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
                var sql = "SELECT * FROM tbl_order";
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

    // delete(req, res) {
    //     if (!req.session.admin) {
    //         res.redirect('/admin');
    //     } else {
    //         var sql = "UPDATE tbl_users SET is_deleted = 1 WHERE id = (?) ";
    //         conn.query(sql, [req.params.id], function (err, rows) {
    //             if (rows[0]) {
    //                 res.redirect('/admin/user');
    //                 res.end();
    //             } else {
    //                 res.redirect('/admin/user');
    //                 res.end();
    //             }
    //         });
    //     }
    // }

    // changeStatus(req, res) {
    //     if (!req.session.admin) {
    //         res.redirect('/admin');
    //     } else {
    //         var sql = "UPDATE tbl_users SET status = CASE WHEN status = 1 THEN 0 WHEN status = 0 THEN 1 end WHERE id = (?) ";
    //         conn.query(sql, [req.params.id], function (err, rows) {
    //             if (rows[0]) {
    //                 res.redirect('/admin/user');
    //                 res.end();
    //             } else {
    //                 res.redirect('/admin/user');
    //                 res.end();
    //             }
    //         });
    //     }
    // }

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

    edit(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            // let sql = "SELECT * FROM tbl_order WHERE id = (?)";
            let sql = "SELECT too.*, concat(tu.first_name, ' ', tu.last_name) as full_name, SUM(toi.quantity) As totQuantity FROM tbl_order as too LEFT JOIN tbl_order_item AS toi ON (too.id = toi.order_id) LEFT JOIN tbl_users AS tu ON (tu.id = too.user_id) WHERE too.id = (?)";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (err) {
                    res.redirect('/admin/order');
                    res.end();
                } else {
                    if (rows[0]) {
                        console.log(rows[0]);
                        // rows[0]['oldimage'] = rows[0]['image'];
                        // rows[0]['image'] = constant.SHOW_TESTIMONIAL_PIC+rows[0]['image'];                        
                        
                        var render_options = {
                            admin_details: req.session.admin,
                            data: rows[0],
                            layout: 'layouts/after_login',
                        };
                        res.render('order/edit', render_options);
                    }
                }
            });
        }
    }

    updaterecord(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
                // console.log(req.files);
                let id = req.body.id;
                let status = req.body.status;
                
                let sql = "UPDATE tbl_order SET status = (?) WHERE id = (?)";
                conn.query(sql, [status, id], function (err, rows) {
                    if (err) {
                        req.flash('error', message['701']);
                        res.redirect('/admin/order/edit/' + id);
                        res.end();
                    } else {
                        req.flash('success', message['706']);
                        res.redirect('/admin/order');
                        res.end();
                    }
                });
            
        }
    }



    vieworders(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            // console.log(req.params.id);
            let sql = "SELECT tp.product_name, tp.image, tp.price, toi.quantity, toi.amount, too.address_id, too.amount as totalAmt, too.shipping_amount, too.shipping_type, too.transaction_no, too.total_amount FROM tbl_products tp LEFT JOIN tbl_order_item toi ON tp.id = toi.product_id LEFT JOIN tbl_order too ON too.id = toi.order_id WHERE toi.order_id = "+req.params.id+"";
            conn.query(sql, function(err, rows){
                if(err){
                    res.redirect('/admin/order');
                    res.end();
                } else {
                    if(rows[0].shipping_type === 'delivery'){
                        let sql = "SELECT tsa.id, tsa.type, tsa.address_1, tc.countryid as country_id, tc.name as country, ts.stateid as state_id, ts.name as state, tci.cityId as city_id, tci.name as city FROM tbl_shipping_address tsa LEFT JOIN tbl_country tc ON tc.countryId = tsa.country LEFT JOIN tbl_state ts ON ts.stateId = tsa.state LEFT JOIN tbl_city tci ON tci.cityId = tsa.city WHERE tsa.id =" + rows[0].address_id;
                        conn.query(sql, function(err, addrows){
                            if(err){
                                res.redirect('/admin/order');
                                res.end();
                            } else {
                                let shippingAddress = addrows[0].address_1+', '+addrows[0].city+', '+addrows[0].state+', '+addrows[0].country;
                                let render_options = {
                                    admin_details: req.session.admin,
                                    data: rows,
                                    shippingAddress: shippingAddress,
                                    image_path: constant.SHOW_FRONT_PRODUCTS_PIC,
                                    layout: 'layouts/after_login',
                                };
                                res.render('order/view', render_options);
                            }
                        });
                    } else {
                        let render_options = {
                            admin_details: req.session.admin,
                            data: rows,
                            image_path: constant.SHOW_FRONT_PRODUCTS_PIC,
                            layout: 'layouts/after_login',
                        };
                        res.render('order/view', render_options);
                    }
                }
            });
        }
    }



    getOrderDetail(req, res) {
        async.parallel({
            one: function (callback) {
                var limit = constant.PAGE_LIMIT;
                var offset = parseInt(req.query.offset);
                var search = req.query.search;
                if (search) {
                    var searchData = "WHERE (transaction_no LIKE '%" + search + "%')";
                } else {
                    var searchData = "";
                }
                var sql = "SELECT too.*, SUM(toi.quantity) As totQuantity FROM tbl_order as too LEFT JOIN tbl_order_item AS toi ON (too.id = toi.order_id) " + searchData + " GROUP By too.id ORDER BY too.id DESC LIMIT " + offset + ", " + limit;

                // var sql = "SELECT tpr.*, tp.product_name As productName, tu.first_name As first_name, tu.last_name As last_name, concat(tu.first_name, ' ', tu.last_name) as full_name FROM tbl_product_review AS tpr INNER JOIN tbl_users AS tu ON (tu.id = tpr.user_id) INNER JOIN tbl_products AS tp ON (tp.id = tpr.product_id) WHERE tpr.is_deleted = 0 " + searchData + " LIMIT " + offset + ", " + limit;

                
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
                var sql = "SELECT * FROM tbl_order";
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

    
}

module.exports = OrderController;