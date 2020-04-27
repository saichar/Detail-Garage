var async = require('async');
var Request = require("request");
class CategoryController {
    category(req, res) {
        // console.log('category');
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var render_options = {
                admin_details: req.session.admin,
                layout: 'layouts/after_login',
            };
            req.flash('success', message['701']);
            res.locals.message = req.flash();
            res.render('category/categories', render_options);
        }
    }


    getCategoryList(req, res) {
        async.parallel({
            one: function (callback) {
                var limit = constant.PAGE_LIMIT;
                var offset = parseInt(req.query.offset);
                var search = req.query.search;
                if (search) {
                    var searchData = " AND category_name LIKE '%" + search + "%' ";
                } else {
                    var searchData = "";
                }
                var sql = "SELECT * FROM tbl_categories WHERE parent_id = 0 AND is_deleted = 0 " + searchData + " LIMIT " + offset + ", " + limit;

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
                var sql = "SELECT * FROM tbl_categories WHERE is_deleted = 0 AND parent_id = 0";
                conn.query(sql, function (err, rows) {
                    if (err) {
                        cb(null, []);
                    } else {
                        cb(null, rows);
                    }
                });
            }
        },
            function (err, results) {
                res.json({ "rows": results.one, "total": results.two.length });
            });
    }

    delete(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var sql_1 = "SELECT * FROM tbl_categories WHERE parent_id = (?) AND is_deleted = 0";
            // console.log(sql_1);
            conn.query(sql_1, [req.params.id], function (err, rowsNum) {
                if (rowsNum[0]) { console.log('Yes');
                    req.flash('error', 'You can not delete category with subcategory, please delete subcategory first!');
                    res.redirect('/admin/category');
                    res.end();
                } else { // console.log('No');
                    var sql_1 = "SELECT * FROM tbl_categories WHERE id = (?)  AND is_deleted = 0";
                    conn.query(sql_1, [req.params.id], function (err, rowsNum) {
                        if (rowsNum[0]) {
                            let parentId = rowsNum[0].light_speed_cat_id;
                            // Function for delete category from light speed api
                            Request.post({
                                "headers": { "content-type": "application/json" },
                                "url": constant.SITE_URL,
                                "body": JSON.stringify({"type":"delete_category","light_speed_cat_id":parentId})
                            }, (error, response, body) => {
                                var objbody = JSON.parse(body);
                                // console.log(objbody); return false;
                                if(objbody.errorClass) {
                                    // return console.dir(error);
                                    req.flash('error', objbody.message);
                                    res.redirect('/admin/category');
                                    res.end();
                                } else {
                                    var sql = "UPDATE tbl_categories SET is_deleted = 1 WHERE id = (?) ";
                                    conn.query(sql, [req.params.id], function (err, rows) {
                                        if (rows[0]) {
                                            res.redirect('/admin/category');
                                            res.end();
                                        } else {
                                            res.redirect('/admin/category');
                                            res.end();
                                        }
                                    });
                                } 
                            });
                        } else {
                            res.redirect('/admin/category');
                            res.end();
                        }
                    });
                }
            });
        }
    }

    changeStatus(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var sql = "UPDATE tbl_categories SET status = CASE WHEN status = 1 THEN 0 WHEN status = 0 THEN 1 end WHERE id = (?) ";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (rows[0]) {
                    res.redirect('/admin/category');
                    res.end();
                } else {
                    res.redirect('/admin/category');
                    res.end();
                }
            });
        }
    }

    add(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var render_options = {
                admin_details: req.session.admin,
                layout: 'layouts/after_login',
            };
            res.render('category/add', render_options);
        }
    }

    addrecord(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            new promise((resolve, reject) => {
                let name = req.body.name;
                let sql = "SELECT id FROM tbl_categories WHERE category_name = (?)";
                conn.query(sql, [name], function (err, rows) {
                    if (rows[0]) {
                        req.flash('error', message['704']);
                        res.redirect('/admin/category/add');
                        res.end();
                    }
                    else {
                        resolve(req);
                    }
                });
                let slug = req.body.slug;
                let sql_1 = "SELECT id FROM tbl_categories WHERE slug = (?)";
                conn.query(sql_1, [slug], function (err, rows) {
                    if (rows[0]) {
                        req.flash('error', message['713']);
                        res.redirect('/admin/category/add');
                        res.end();
                    }
                    else {
                        resolve(req);
                    }
                });
            }).then(function (req) {
                // let categoryID = '';
                let name = req.body.name;
                let slug =req.body.slug;
                // let description = req.body.description;
                let status = req.body.status;
                let addedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
                
                // Add Category In Lightspeed API
                Request.post({
                    "headers": { "content-type": "application/json" },
                    // "url": "http://localhost/detailgarage/lightspeedapi.php",
                    "url": constant.SITE_URL,
                    "body": JSON.stringify({"type":"create_category","name":name,"fullPathName":name,"parentID":"0"})
                }, (error, response, body) => {
                    var objbody = JSON.parse(body);
                    // console.log(typeof(objbody));
                    // console.log(objbody);
                    // console.log(objbody.Category);
                    // console.log(objbody.Category.categoryID);
                    if(objbody.errorClass) {
                        // return console.dir(error);
                        req.flash('error', objbody.message);
                        res.redirect('/admin/category/add');
                        res.end();
                    } else {
                        var lightSpeedcatId = objbody.Category.categoryID;
                        // console.dir(JSON.parse(body));
                        let sql = "INSERT INTO tbl_categories (light_speed_cat_id, category_name, slug, status, addedOn) VALUES (?, ?, ?, ?, ?)";
                        conn.query(sql, [lightSpeedcatId, name, slug, status, addedOn], function (err, rows) {
                            if (err) {
                                req.flash('error', "This category name is alrady exist");
                                res.redirect('/admin/category/add');
                                res.end();
                            } else {
                                req.flash('success', message['705']);
                                res.redirect('/admin/category');
                                res.end();
                            }
                        });
                    }
                    
                });
            });
        }
    }
    
    categoryslug(req, res) {
        //console.log(req.body.catid)
        var sql = "SELECT * FROM tbl_categories WHERE  slug='"+req.body.catname+"'";
        conn.query(sql, function (err, rows) {
            if (rows.length>0){
                res.json({ "categoriesname": req.body.catname+"_"+(rows.length+1) });
            }else{
                res.json({ "categoriesname": req.body.catname });
            }
            
        });
    }
    
    edit(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            let sql = "SELECT * FROM tbl_categories WHERE id = (?)";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (err) {
                    res.redirect('/admin/category');
                    res.end();
                } else {
                    if (rows[0]) {
                        var render_options = {
                            admin_details: req.session.admin,
                            data: rows[0],
                            layout: 'layouts/after_login',
                        };
                        res.render('category/edit', render_options);
                    }
                }
            });
        }
    }

    updaterecord(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            new promise((resolve, reject) => {
                let id = req.body.id;
                let name = req.body.name;                
                let sql = "SELECT id FROM tbl_categories WHERE category_name = (?) AND id != (?)";
                conn.query(sql, [name, id], function (err, rows) {
                    if (rows[0]) {
                        req.flash('error', message['704']);
                        res.redirect('/admin/category/edit/'+id);
                        res.end();
                    }
                    else {
                        resolve(req);
                    }
                });
                let slug = req.body.slug;                
                let sql1 = "SELECT id FROM tbl_categories WHERE slug = (?) AND id != (?)";
                conn.query(sql1, [slug, id], function (err, rows) {
                    if (rows[0]) {
                        req.flash('error', message['704']);
                        res.redirect('/admin/category/edit/'+id);
                        res.end();
                    }
                    else {
                        resolve(req);
                    }
                });
            }).then(function (req) {
                let id = req.body.id;
                let name = req.body.name;
                let light_speed_cat_id = req.body.lightSpeedCatId;
                let status = req.body.status;
                let updatedOn = dateFormat('yyyy-mm-dd HH:MM:ss');

                // Update category on lightspeed server and local server
                // Update Category In Lightspeed API
                Request.post({
                    "headers": { "content-type": "application/json" },
                    // "url": "http://localhost/detailgarage/lightspeedapi.php",
                    "url": constant.SITE_URL,
                    "body": JSON.stringify({"type":"update_category","name":name,"fullPathName":name,"parentID":"0","light_speed_cat_id":light_speed_cat_id})
                }, (error, response, body) => {
                    var objbody = JSON.parse(body);
                    // console.log(objbody); return false;
                    if(objbody.errorClass) {
                        // return console.dir(error);
                        req.flash('error', objbody.message);
                        res.redirect('/admin/category/edit/'+id);
                        res.end();
                    } else {
                        let sql = "UPDATE tbl_categories SET category_name = (?), status = (?), updatedOn = (?) WHERE id = (?)";
                        conn.query(sql, [name, status, updatedOn, id], function (err, rows) {
                            if (err) {
                                req.flash('error', message['701']);
                                res.redirect('/admin/category/edit/'+id);
                                res.end();
                            } else {
                                req.flash('success', message['706']);
                                res.redirect('/admin/category');
                                res.end();
                            }
                        });
                    }
                    
                });
            });
        }
    }
}

module.exports = CategoryController;
