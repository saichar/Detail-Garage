var async = require('async');
var Request = require("request");
class SubCategoryController {
    subcategory(req, res) {
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
            res.render('subcategory/subcategories', render_options);
        }
    }
    
    subcategorybyid(req, res) {
        // console.log(req.body.catid)
        var sql = "SELECT * FROM tbl_categories WHERE  parent_id="+req.body.catid;
        // console.log(sql);
        conn.query(sql, function (err, rows) {
            if (rows) {
            res.json({ "subcategories": rows });
        }
            
        });
    }

    getSubCategoryList(req, res) {
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

                let sql = "SELECT tc.category_name as category_name, tsc.id as sub_cat_id, tsc.category_name as sub_category_name, tsc.status FROM tbl_categories tc INNER JOIN tbl_categories tsc ON tc.id = tsc.parent_id WHERE tsc.is_deleted = '0' AND tsc.parent_id != '0' " + searchData + "LIMIT " + offset + ", " + limit;

                // let sql = "SELECT tc.id, tc.parent_id as category_name, tc.category_name as sub_category_name FROM tbl_categories AS tc WHERE tc.is_deleted = '0' AND tc.parent_id != '0' " + searchData + " LIMIT " + offset + ", " + limit;

                conn.query(sql, function (err, rows) {
                    if (err) {
                        callback(null, []);
                    } else {
                        callback(null, rows);
                    }
                });
            },
            two: function (cb) {
                var sql = "SELECT * FROM tbl_categories WHERE is_deleted = 0 AND parent_id != 0";
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
            var sql_1 = "SELECT * FROM tbl_categories WHERE id = (?) ";
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
                            res.redirect('/admin/subcategory');
                            res.end();
                        } else {
                            var sql = "UPDATE tbl_categories SET is_deleted = 1 WHERE id = (?) ";
                            conn.query(sql, [req.params.id], function (err, rows) {
                                if (rows[0]) {
                                    res.redirect('/admin/subcategory');
                                    res.end();
                                } else {
                                    res.redirect('/admin/subcategory');
                                    res.end();
                                }
                            });
                        } 
                    });
                } else {
                    res.redirect('/admin/subcategory');
                    res.end();
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
                    res.redirect('/admin/subcategory');
                    res.end();
                } else {
                    res.redirect('/admin/subcategory');
                    res.end();
                }
            });
        }
    }

    add(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            let sql = "SELECT id, category_name FROM tbl_categories WHERE parent_id = 0 AND status = '1' AND is_deleted = 0";
            conn.query(sql, function (err, rows) {
                if (rows[0]) {
                    var render_options = {
                        admin_details: req.session.admin,
                        categorylist: rows,
                        layout: 'layouts/after_login',
                    };
                    res.render('subcategory/add', render_options);
                }
            });
        }
    }

    addrecord(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            new promise((resolve, reject) => {
                let name = req.body.name;
                let category_id = req.body.category_id;
                let sql = "SELECT id FROM tbl_categories WHERE parent_id = (?) AND category_name = (?)";
                conn.query(sql, [category_id, name], function (err, rows) {
                    if (rows[0]) {
                        req.flash('error', message['704']);
                        res.redirect('/admin/subcategory/add');
                        res.end();
                    }
                    else {
                        resolve(req);
                    }
                });
            }).then(function (req) {
                let sql_1 = "SELECT * FROM tbl_categories WHERE id = "+req.body.category_id+"";
                conn.query(sql_1, function (err, parentrows) {
                    if(parentrows[0]) {
                        var parentId = parentrows[0].light_speed_cat_id;
                        let name = req.body.name;
                        let slug = req.body.slug;
                        let category_id = req.body.category_id;
                        let status = req.body.status;
                        let addedOn = dateFormat('yyyy-mm-dd HH:MM:ss');

                        // Add Sub Category In Lightspeed API

                        Request.post({
                            "headers": { "content-type": "application/json" },
                            // "url": "http://localhost/detailgarage/lightspeedapi.php",
                            "url": constant.SITE_URL,
                            "body": JSON.stringify({"type":"create_category","name":name,"fullPathName":name,"parentID":parentId})
                        }, (error, response, body) => {
                            var objbody = JSON.parse(body);
                            
                            if(objbody.errorClass) {
                                req.flash('error', objbody.message);
                                res.redirect('/admin/subcategory/add');
                                res.end();
                            } else {
                                var lightSpeedcatId = objbody.Category.categoryID;
                                let sql = "INSERT INTO tbl_categories (parent_id, light_speed_cat_id, category_name, slug, status, addedOn) VALUES (?, ?, ?, ?, ?, ?)";
                                conn.query(sql, [category_id, lightSpeedcatId, name, slug, status, addedOn], function (err, rows) {
                                    if (err) {
                                        req.flash('error', message['701']);
                                        res.redirect('/admin/subcategory/add');
                                        res.end();
                                    } else {
                                        req.flash('success', message['705']);
                                        res.redirect('/admin/subcategory');
                                        res.end();
                                    }
                                });
                            }
                        });
                    } else {
                        req.flash('error','Something went wrong');
                        res.redirect('/admin/subcategory/add');
                        res.end();
                    }
                });
            });
        }
    }
    
    
    edit(req, res) {
        
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {

            async.parallel({
                one: function (callback) {

                // let sql = "SELECT tc.category_name as category_name, tsc.id as sub_cat_id, tsc.category_name as sub_category_name, tsc.slug, tsc.status FROM tbl_categories tc INNER JOIN tbl_categories tsc ON tc.id = tsc.parent_id WHERE tsc.is_deleted = '0' AND tsc.id = "+req.params.id+" ";

                let sql = "SELECT * FROM tbl_categories WHERE id = (?)";
                    conn.query(sql, [req.params.id], function (err, rows) {
                        if (err) {
                            callback(null, []);
                        } else {
                            // rows[0]['oldimage'] = rows[0]['image'];
                            // rows[0]['image'] = constant.SHOW_PRODUCTS_PIC + rows[0]['image'];
                            callback(null, rows);
                        }
                    });
                },
                two: function (cb) {
                    var sql = "SELECT id, category_name FROM tbl_categories WHERE parent_id = 0 AND status = '1' AND is_deleted = 0";
                    conn.query(sql, function (err, rows) {
                        if (err) {
                            cb(null, []);
                        } else {

                            cb(null, rows);

                        }
                    });
                },
              
            },
                function (err, results) {
                    var render_options = {
                        admin_details: req.session.admin,
                        data: results.one[0],
                        catlist: results.two,  
                        id:req.params.id,
                        layout: 'layouts/after_login',
                    };
                    res.render('subcategory/edit', render_options);
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
                let category_id = req.body.category_id;                
                let sql = "SELECT id FROM tbl_categories WHERE category_name = (?) AND id != (?) AND parent_id != 0";

                conn.query(sql, [name, id], function (err, rows) {
                    if (rows[0]) {
                        req.flash('error', message['704']);
                        res.redirect('/admin/subcategory/edit/'+id);
                        res.end();
                    }
                    else {
                        resolve(req);
                    }
                });
            }).then(function (req) {
                let sql_1 = "SELECT * FROM tbl_categories WHERE id = "+req.body.category_id+"";
                conn.query(sql_1, function (err, parentrows) {
                    if(parentrows[0]) {
                        let id = req.body.id;
                        let parentId = parentrows[0].light_speed_cat_id;
                        let name = req.body.name;
                        let category_id = req.body.category_id;
                        let status = req.body.status;
                        let updatedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
                        let light_speed_cat_id = req.body.lightSpeedCatId;

                        // Update category on lightspeed server and local server
                        // Update Category In Lightspeed API
                        Request.post({
                            "headers": { "content-type": "application/json" },
                            // "url": "http://localhost/detailgarage/lightspeedapi.php",
                            "url": constant.SITE_URL,
                            "body": JSON.stringify({"type":"update_category","name":name,"fullPathName":name,"parentID":parentId,"light_speed_cat_id":light_speed_cat_id})
                        }, (error, response, body) => {
                            var objbody = JSON.parse(body);
                            // console.log(objbody); return false;
                            if(objbody.errorClass) {
                                // return console.dir(error);
                                req.flash('error', objbody.message);
                                res.redirect('/admin/subcategory/edit/'+id);
                                res.end();
                            } else {
                                let sql = "UPDATE tbl_categories SET category_name = (?), parent_id = (?), light_speed_cat_id = (?), status = (?), updatedOn = (?) WHERE id = (?)";
                                conn.query(sql, [name, category_id, light_speed_cat_id, status, updatedOn, id], function (err, rows) {
                                    if (err) {
                                        req.flash('error', message['701']);
                                        res.redirect('/admin/subcategory/edit/'+id);
                                        res.end();
                                    } else {
                                        req.flash('success', message['706']);
                                        res.redirect('/admin/subcategory');
                                        res.end();
                                    }
                                });
                            }
                            
                        });
                    } else {
                        req.flash('error','Something went wrong');
                        res.redirect('/admin/subcategory/add');
                        res.end();
                    }
                });
            });
        }
    }
}

module.exports = SubCategoryController;
