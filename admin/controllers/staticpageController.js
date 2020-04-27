var async = require('async');
class StaticpageController {
    staticpage(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var render_options = {
                admin_details: req.session.admin,
                layout: 'layouts/after_login',
            };
            res.render('staticpage/staticpages', render_options);
        }
    }
    getStaticpageList(req, res) {
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
                var sql = "SELECT * FROM tbl_staticpages WHERE is_deleted = 0 " + searchData + " LIMIT " + offset + ", " + limit;
                conn.query(sql, function (err, rows) {
                    if (err) {
                        callback(null, []);
                    } else {
                        callback(null, rows);
                    }
                });
            },
            two: function (cb) {
                var sql = "SELECT * FROM tbl_staticpages WHERE is_deleted = 0";
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
        });
    }

    delete(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var sql = "UPDATE tbl_staticpages SET is_deleted = 1 WHERE id = (?) ";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (rows[0]) {
                    res.redirect('/admin/staticpage');
                    res.end();
                } else {
                    res.redirect('/admin/staticpage');
                    res.end();
                }
            });
        }
    }

    changeStatus(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var sql = "UPDATE tbl_staticpages SET status = CASE WHEN status = 1 THEN 0 WHEN status = 0 THEN 1 end WHERE id = (?) ";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (rows[0]) {
                    res.redirect('/admin/staticpage');
                    res.end();
                } else {
                    res.redirect('/admin/staticpage');
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
            res.render('staticpage/add', render_options);
        }
    }

    addrecord(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            new promise((resolve, reject) => {
                let identifire = req.body.identifire;
                let sql = "SELECT id FROM tbl_staticpages WHERE identifire = (?)";
                conn.query(sql, [identifire], function (err, rows) {
                    if (rows[0]) {
                        req.flash('error', message['704']);
                        res.redirect('/admin/staticpage/add');
                        res.end();
                    }
                    else {
                        resolve(req);
                    }
                });
            }).then(function (req) {
                let name = req.body.name;
                let identifire = req.body.identifire;
                let content = req.body.content;
                let status = req.body.status;
                let addedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
                // let updatedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
                console.log(name+' '+identifire+' '+content+' '+status+' '+addedOn);
                let sql = "INSERT INTO tbl_staticpages (page_name, identifire, content, status, addedOn) VALUES (?, ?, ?, ?, ?)";
                conn.query(sql, [name, identifire, content, status, addedOn], function (err, rows) {
                    if (err) {
                        req.flash('error', message['701']);
                        res.redirect('/admin/staticpage/add');
                        res.end();
                    } else {
                        req.flash('success', message['705']);
                        res.redirect('/admin/staticpage');
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
            let sql = "SELECT * FROM tbl_staticpages WHERE id = (?)";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (err) {
                    res.redirect('/admin/staticpage');
                    res.end();
                } else {
                    if (rows[0]) {
                        var render_options = {
                            admin_details: req.session.admin,
                            data: rows[0],
                            layout: 'layouts/after_login',
                        };
                        res.render('staticpage/edit', render_options);
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
                let sql = "SELECT id FROM tbl_staticpages WHERE page_name = (?) AND id != (?)";
                conn.query(sql, [name, id], function (err, rows) {
                    if (rows[0]) {
                        req.flash('error', message['704']);
                        res.redirect('/admin/staticpage/edit/' + id);
                        res.end();
                    }
                    else {
                        resolve(req);
                    }
                });
            }).then(function (req) {
                let id = req.body.id;
                let name = req.body.name;
                let status = req.body.status;
                let content = req.body.content;
                // let updatedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
                let sql = "UPDATE tbl_staticpages SET page_name = (?), content = (?), status = (?) WHERE id = (?)";
                conn.query(sql, [name, content, status, id], function (err, rows) {
                    if (err) {
                        req.flash('error', message['701']);
                        res.redirect('/admin/staticpage/edit');
                        res.end();
                    } else {
                        req.flash('success', message['706']);
                        res.redirect('/admin/staticpage');
                        res.end();
                    }
                });
            });
        }
    }
}

module.exports = StaticpageController;