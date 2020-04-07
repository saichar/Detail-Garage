var async = require('async');
class BannerController {
    banners(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var render_options = {
                admin_details: req.session.admin,
                layout: 'layouts/after_login',
            };
            req.flash('success', message['701']);
            res.locals.message = req.flash();
            res.render('banner/banners', render_options);
        }
    }

    getBannerList(req, res) {
        async.parallel({
            one: function (callback) {
                var limit = constant.PAGE_LIMIT;
                var offset = parseInt(req.query.offset);
                var search = req.query.search;
                if (search) {
                    var searchData = " AND name LIKE '%" + search + "%' ";
                } else {
                    var searchData = "";
                }
                var sql = "SELECT * FROM tbl_banner WHERE is_deleted = 0 " + searchData + " LIMIT " + offset + ", " + limit;
                // console.log(sql);
                conn.query(sql, function (err, rows) {
                    // if(rows[0] && rows[0][0]){
                    //     if(rows[0][0]['image'] != "" && rows[0][0]['image'] != null){
                    //         rows[0][0]['image'] = ((rows[0][0]['image'] != '' && rows[0][0]['image'].slice(0, 7) != 'http://' && rows[0][0]['image'].slice(0, 8) != 'https://') ? constant.SHOW_BANNERS_PIC + rows[0][0]['image'] : rows[0][0]['image']);
                    //     }
                    //     else{
                    //         rows[0][0]['image'] = (constant.SHOW_NO_BANNERS_PIC); 
                    //     }
                    //     res.render('add_editusers', {
                    //         users_management_active_class: "active",
                    //         admin_details: req.session.admin,
                    //         layout: 'layouts/afterLogin',
                    //         data: rows[0][0]
                    //     });
                    // }
                    if (err) {
                        callback(null, []);
                    } else {
                        callback(null, rows);
                    }
                });
            },
            two: function (cb) {
                var sql = "SELECT * FROM tbl_banner WHERE is_deleted = 0";
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
            var sql = "UPDATE tbl_banner SET is_deleted = 1 WHERE id = (?) ";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (rows[0]) {
                    res.redirect('/admin/banner');
                    res.end();
                } else {
                    res.redirect('/admin/banner');
                    res.end();
                }
            });
        }
    }

    changeStatus(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var sql = "UPDATE tbl_banner SET status = CASE WHEN status = 1 THEN 0 WHEN status = 0 THEN 1 end WHERE id = (?) ";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (rows[0]) {
                    res.redirect('/admin/banner');
                    res.end();
                } else {
                    res.redirect('/admin/banner');
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
            res.render('banner/add', render_options);
        }
    }

    addrecord(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {            
            // console.log(req.files);
            var filename = "";
            filename = req.files[0].filename;

            new promise((resolve, reject) => {
                let name = req.body.name;
                let sql = "SELECT id FROM tbl_banner WHERE title = (?)";
                conn.query(sql, [name], function (err, rows) {
                    if (rows[0]) {
                        req.flash('error', message['704']);
                        res.redirect('/admin/banner/add');
                        res.end();
                    }
                    else {
                        resolve(req);
                    }
                });
            }).then(function (req) {
                let name = req.body.name;
                let description = req.body.description;
                let image = filename;
                let status = req.body.status;
                let addedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
                let updatedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
                let sql = "INSERT INTO tbl_banner (title, description, image, status, addedOn, updatedOn) VALUES (?, ?, ?, ?, ?, ?)";
                conn.query(sql, [name, description, image, status, addedOn, updatedOn], function (err, rows) {
                    if (err) {
                        req.flash('error', message['701']);
                        res.redirect('/admin/banner/add');
                        res.end();
                    } else {
                        req.flash('success', message['705']);
                        res.redirect('/admin/banner');
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
            let sql = "SELECT * FROM tbl_banner WHERE id = (?)";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (err) {
                    res.redirect('/admin/banner');
                    res.end();
                } else {
                    if (rows[0]) {
                        // console.log(rows[0]);
                        rows[0]['oldimage'] = rows[0]['image'];
                        rows[0]['image'] = constant.SHOW_BANNERS_PIC+rows[0]['image'];                        
                        
                        var render_options = {
                            admin_details: req.session.admin,
                            data: rows[0],
                            layout: 'layouts/after_login',
                        };
                        res.render('banner/edit', render_options);
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
                let sql = "SELECT id FROM tbl_banner WHERE title = (?) AND id != (?)";
                conn.query(sql, [name, id], function (err, rows) {
                    if (rows[0]) {
                        req.flash('error', message['704']);
                        res.redirect('/admin/banner/edit/' + id);
                        res.end();
                    }
                    else {
                        resolve(req);
                    }
                });
            }).then(function (req) {
                // console.log(req.files);
                var filename = "";
                if (!req.files[0] && req.files[0] == undefined) {
                    filename = req.body.oldimage;
                }else{
                    filename = req.files[0].filename;
                }

                let id = req.body.id;
                let name = req.body.name;
                let description = req.body.description;
                let image = filename;
                let status = req.body.status;
                let updatedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
                let sql = "UPDATE tbl_banner SET title = (?), description = (?), image = (?), status = (?), updatedOn = (?) WHERE id = (?)";
                conn.query(sql, [name, description, image, status, updatedOn, id], function (err, rows) {
                    if (err) {
                        req.flash('error', message['701']);
                        res.redirect('/admin/banner/edit/' + id);
                        res.end();
                    } else {
                        req.flash('success', message['706']);
                        res.redirect('/admin/banner');
                        res.end();
                    }
                });
            });
        }
    }
}

module.exports = BannerController;