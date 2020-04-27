var async = require('async');
class ProductreviewController {
    productreviews(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var render_options = {
                admin_details: req.session.admin,
                layout: 'layouts/after_login',
            };
            req.flash('success', message['701']);
            res.locals.message = req.flash();
            res.render('productreview/productreviews', render_options);
        }
    }

    getProductReviewList(req, res) {
        async.parallel({
            one: function (callback) {
                var limit = constant.PAGE_LIMIT;
                var offset = parseInt(req.query.offset);
                var search = req.query.search;
                if (search) {
                    var searchData = " AND review LIKE '%" + search + "%' ";
                } else {
                    var searchData = "";
                }
                var sql = "SELECT * FROM tbl_product_review WHERE is_deleted = 0 " + searchData + " LIMIT " + offset + ", " + limit;


                var sql = "SELECT tpr.*, tp.product_name As productName, tu.first_name As first_name, tu.last_name As last_name, concat(tu.first_name, ' ', tu.last_name) as full_name FROM tbl_product_review AS tpr INNER JOIN tbl_users AS tu ON (tu.id = tpr.user_id) INNER JOIN tbl_products AS tp ON (tp.id = tpr.product_id) WHERE tpr.is_deleted = 0 " + searchData + " LIMIT " + offset + ", " + limit;

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
                var sql = "SELECT * FROM tbl_product_review WHERE is_deleted = 0";
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
            var sql = "UPDATE tbl_product_review SET is_deleted = 1 WHERE id = (?) ";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (rows[0]) {
                    res.redirect('/admin/productreview');
                    res.end();
                } else {
                    res.redirect('/admin/productreview');
                    res.end();
                }
            });
        }
    }

    changeStatus(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var sql = "UPDATE tbl_product_review SET status = CASE WHEN status = 1 THEN 0 WHEN status = 0 THEN 1 end WHERE id = (?) ";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (rows[0]) {
                    res.redirect('/admin/productreview');
                    res.end();
                } else {
                    res.redirect('/admin/productreview');
                    res.end();
                }
            });
        }
    }

    // edit(req, res) {
    //     if (!req.session.admin) {
    //         res.redirect('/admin');
    //     } else {
    //         let sql = "SELECT * FROM tbl_testimonials WHERE id = (?)";
    //         conn.query(sql, [req.params.id], function (err, rows) {
    //             if (err) {
    //                 res.redirect('/admin/testimonial');
    //                 res.end();
    //             } else {
    //                 if (rows[0]) {
    //                     // console.log(rows[0]);
    //                     rows[0]['oldimage'] = rows[0]['image'];
    //                     rows[0]['image'] = constant.SHOW_TESTIMONIAL_PIC+rows[0]['image'];                        
                        
    //                     var render_options = {
    //                         admin_details: req.session.admin,
    //                         data: rows[0],
    //                         layout: 'layouts/after_login',
    //                     };
    //                     res.render('testimonial/edit', render_options);
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
    //             var filename = "";
    //             if (!req.files[0] && req.files[0] == undefined) {
    //                 filename = req.body.oldimage;
    //             }else{
    //                 filename = req.files[0].filename;
    //             }

    //             let id = req.body.id;
    //             let name = req.body.name;
    //             let address = req.body.address;
    //             let description = req.body.description;
    //             let image = filename;
    //             let status = req.body.status;
                
    //             let sql = "UPDATE tbl_testimonials SET name = (?), address = (?), description = (?), image = (?), status = (?) WHERE id = (?)";
    //             conn.query(sql, [name, address, description, image, status, id], function (err, rows) {
    //                 if (err) {
    //                     req.flash('error', message['701']);
    //                     res.redirect('/admin/testimonial/edit/' + id);
    //                     res.end();
    //                 } else {
    //                     req.flash('success', message['706']);
    //                     res.redirect('/admin/testimonial');
    //                     res.end();
    //                 }
    //             });
            
    //     }
    // }
}

module.exports = ProductreviewController;