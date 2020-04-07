var async = require('async');
class SettingController {
    settings(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var render_options = {
                admin_details: req.session.admin,
                layout: 'layouts/after_login',
            };
            req.flash('success', message['701']);
            res.locals.message = req.flash();
            res.render('setting/settings', render_options);
        }
    }
    getSettingList(req, res) {
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
                var sql = "SELECT * FROM tbl_settings WHERE is_deleted = 0 " + searchData + " LIMIT " + offset + ", " + limit;
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
                var sql = "SELECT * FROM tbl_settings WHERE is_deleted = 0";
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
            var sql = "UPDATE tbl_settings SET is_deleted = 1 WHERE id = (?) ";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (rows[0]) {
                    res.redirect('/admin/setting');
                    res.end();
                } else {
                    res.redirect('/admin/setting');
                    res.end();
                }
            });
        }
    }

    changeStatus(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var sql = "UPDATE tbl_settings SET status = CASE WHEN status = 1 THEN 0 WHEN status = 0 THEN 1 end WHERE id = (?) ";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (rows[0]) {
                    res.redirect('/admin/setting');
                    res.end();
                } else {
                    res.redirect('/admin/setting');
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
            res.render('setting/add', render_options);
        }
    }

    addrecord(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var body = req.body;
            var form = {
                name: body.name,
                status: body.status,
                addedOn: dateFormat('yyyy-mm-dd HH:MM:ss'),
                updatedOn: dateFormat('yyyy-mm-dd HH:MM:ss')
            }

            new promise((resolve, reject) => {
                let sql = "SELECT id FROM tbl_settings WHERE name = (?)";
                conn.query(sql, [form.name], function (err, rows) {
                    if (rows[0]) {
                        var render_options = {
                            admin_details: req.session.admin,
                            layout: 'layouts/after_login',
                            form:form,
                            error:message['704'],
                        };
                        res.render('setting/add', render_options);
                    }
                    else {
                        resolve(req);
                    }
                });
            }).then(function (req) {
                let sql = "INSERT INTO tbl_settings (name, status, addedOn, updatedOn) VALUES (?, ?, ?, ?)";
                conn.query(sql, [form.name, form.status, form.addedOn, form.updatedOn], function (err, rows) {
                    if (err) {
                        var render_options = {
                            admin_details: req.session.admin,
                            layout: 'layouts/after_login',
                            form:form,
                            error:message['701'],
                        };
                        res.render('setting/add', render_options);                       
                    } else {
                        req.flash('success', message['705']);
                        res.redirect('/admin/setting');
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
            let sql = "SELECT * FROM tbl_settings WHERE id = (?)";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (err) {
                    res.redirect('/admin/setting');
                    res.end();
                } else {
                    if (rows[0]) {
                        var render_options = {
                            admin_details: req.session.admin,
                            data: rows[0],
                            layout: 'layouts/after_login',
                        };
                        res.render('setting/edit', render_options);
                    }
                }
            });
        }
    }

    updaterecord(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var body = req.body;
            var form = {
                id: body.id,
                name: body.name,
                value: body.value,
                status: body.status,
                updatedOn: dateFormat('yyyy-mm-dd HH:MM:ss')
            }

            new promise((resolve, reject) => {
                let sql = "SELECT id FROM tbl_settings WHERE name = (?) AND id != (?)";
                conn.query(sql, [form.name, form.id], function (err, rows) {
                    if (rows[0]) {
                        req.flash('error', message['704']);
                        res.redirect('/admin/setting/edit/' + form.id);
                        res.end();
                    }
                    else {
                        resolve(req);
                    }
                });
            }).then(function (req) {                
                let sql = "UPDATE tbl_settings SET name = (?), value = (?), status = (?), updatedOn = (?) WHERE id = (?)";
                conn.query(sql, [form.name, form.value, form.status, form.updatedOn, form.id], function (err, rows) {
                    if (err) {
                        req.flash('error', message['701']);
                        res.redirect('/admin/setting/edit/' + form.id);
                        res.end();
                    } else {
                        req.flash('success', message['706']);
                        res.redirect('/admin/setting');
                        res.end();
                    }
                });
            });
        }
    }
}

module.exports = SettingController;