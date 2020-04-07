var async = require('async');
class ProductController {
    product(req, res) {
        // console.log('Product');
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var render_options = {
                admin_details: req.session.admin,
                layout: 'layouts/after_login',
            };
            req.flash('success', message['701']);
            res.locals.message = req.flash();
            res.render('product/products', render_options);
        }
    }
    getProductList(req, res) {
        async.parallel({
            one: function (callback) {
                var limit = constant.PAGE_LIMIT;
                var offset = parseInt(req.query.offset);
                var search = req.query.search;
                if (search) {
                    var searchData = " AND product_name LIKE '%" + search + "%' ";
                } else {
                    var searchData = "";
                }
                var sql = "SELECT * FROM tbl_products WHERE is_deleted = 0 " + searchData + " LIMIT " + offset + ", " + limit;
                conn.query(sql, function (err, rows) {
                    if (err) {
                        callback(null, []);
                    } else {
                        callback(null, rows);
                    }
                });
            },
            two: function (cb) {
                var sql = "SELECT * FROM tbl_products WHERE is_deleted = 0";
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
            var sql = "UPDATE tbl_products SET is_deleted = 1 WHERE id = (?) ";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (rows[0]) {
                    res.redirect('/admin/product');
                    res.end();
                } else {
                    res.redirect('/admin/product');
                    res.end();
                }
            });
        }
    }

    changeStatus(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var sql = "UPDATE tbl_products SET status = CASE WHEN status = '1' THEN '0' WHEN status = '0' THEN '1' end WHERE id = (?) ";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (rows[0]) {
                    res.redirect('/admin/product');
                    res.end();
                } else {
                    res.redirect('/admin/product');
                    res.end();
                }
            });
        }
    }

    changeDeal(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            var sql = "UPDATE tbl_products SET today_deal = CASE WHEN today_deal = '1' THEN '0' WHEN today_deal = '0' THEN '1' end WHERE id = (?) ";
            // console.log(req.params.id);
            // console.log(sql);
            conn.query(sql, [req.params.id], function (err, rows) {
                if (rows[0]) {
                    res.redirect('/admin/product');
                    res.end();
                } else {
                    res.redirect('/admin/product');
                    res.end();
                }
            });
        }
    }

    add(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            let sql = "SELECT id, category_name FROM tbl_category WHERE status = '1' AND is_deleted = 0";
            conn.query(sql, function (err, rows) {
                if (rows[0]) {
                    var render_options = {
                        admin_details: req.session.admin,
                        categorylist: rows,
                        layout: 'layouts/after_login',
                    };
                    res.render('product/add', render_options);
                }
            });
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
                let sql = "SELECT id FROM tbl_products WHERE product_name = (?)";
                conn.query(sql, [name], function (err, rows) {
                    if (rows[0]) {
                        req.flash('error', message['712']);
                        res.redirect('/admin/product/add');
                        res.end();
                    }
                    else {
                        resolve(req);
                    }
                });

                let code = req.body.code;
                let sql_1 = "SELECT id FROM tbl_products WHERE product_code = (?)";
                conn.query(sql_1, [code], function (err, rows) {
                    if (rows[0]) {
                        req.flash('error', message['713']);
                        res.redirect('/admin/product/add');
                        res.end();
                    }
                    else {
                        resolve(req);
                    }
                });

            }).then(function (req) {
                let category_id = req.body.category_id;
                let sub_category_id = req.body.sub_category_id;
                let name = req.body.name;
                // let code = req.body.code;
                let price = req.body.price;
                let quantity = req.body.quantity;
                let description = req.body.description;
                let image = filename;
                let status = req.body.status;
                let addedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
                
                let sql = "INSERT INTO tbl_products (category_id, sub_category_id, product_name, price, quantity, description, image, status, addedOn) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)";
                conn.query(sql, [category_id, sub_category_id, name, price, quantity, description, image, status, addedOn], function (err, rows) {
                    if (err) {
                        req.flash('error', message['701']);
                        res.redirect('/admin/product/add');
                        res.end();
                    } else {
						//console.log(rows.insertId);
						if (req.files.length>0) 
						    {
							   
							  for(var i=0;i<req.files.length;i++){
							    let imagval=req.files[i].filename;
							         //console.log(req.files[i].filename);
                               let sql = "INSERT INTO tbl_product_gallery (product_id,image,  addedOn) VALUES (?, ?, ?)";
							          conn.query(sql, [rows.insertId, imagval,addedOn], function (err, rows) {
                                });
							   }
                     
                            } 
                        req.flash('success', message['705']);
                        res.redirect('/admin/product');
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
               
                let sql = "SELECT tp.*, tc.category_name AS cat_name FROM tbl_products AS tp INNER JOIN tbl_category AS tc ON (tc.id = tp.category_id) WHERE tp.id = (?)";
                conn.query(sql, [req.params.id], function (err, rows) {
                    if (err) {
                        callback(null, []);
                    } else {
						rows[0]['oldimage'] = rows[0]['image'];
                        rows[0]['image'] = constant.SHOW_PRODUCTS_PIC+rows[0]['image'];
                        callback(null, rows);
                    }
                });
            },
            two: function (cb) {
                var sql = "SELECT id, category_name FROM tbl_category WHERE status = '1' AND is_deleted = 0";
                conn.query(sql, function (err, rows) {
                    if (err) {
                        cb(null, []);
                    } else {
					
						cb(null, rows);
                        
                    }
                });
            },
            three:function (calb){
				var sql = "SELECT id, image FROM tbl_product_gallery WHERE product_id = (?)";
                conn.query(sql, [req.params.id], function (err, imgrows) {
                    if (err) {
                        calb(null, []);
                    } else {
						if (imgrows.length>0) 
						    {
							   
							  for(var i=0;i<imgrows.length;i++)
							   {
							     imgrows[i]['image'] = constant.SHOW_PRODUCTS_PIC+imgrows[i]['image'];
							   }
							   
                     
                            }  
					
						calb(null, imgrows);
                        
                    }
                });
				
				
			}
        },
            function (err, results) {
                //res.json({ "rows": results.one, "total": results.two.length });
                console.log(results.three);
                        //var productinfo=results.one[0]; 
                        //productinfo[0]['oldimage'] = productinfo['image'];
                        //productinfo[0]['image'] = constant.SHOW_PRODUCTS_PIC+productinfo[0]['image'];

                        var render_options = {
                            admin_details: req.session.admin,
                            data: results.one[0],
                            catlist:results.two,
                            imagelist:results.three,
                            layout: 'layouts/after_login',
                        };
                        res.render('product/edit', render_options);
                
            });
			
			
			
			
			
			
			
            // let sql = "SELECT * FROM tbl_products WHERE id = (?)";
            /*let sql = "SELECT tp.*, tc.category_name AS cat_name FROM tbl_products AS tp INNER JOIN tbl_category AS tc ON (tc.id = tp.category_id) WHERE tp.id = (?)";
            conn.query(sql, [req.params.id], function (err, rows) {
                if (err) {
                    res.redirect('/admin/product');
                    res.end();
                } else {
					 
                    if (rows[0]) {
                        // console.log(rows[0]);
                        rows[0]['oldimage'] = rows[0]['image'];
                        rows[0]['image'] = constant.SHOW_PRODUCTS_PIC+rows[0]['image'];

                        var render_options = {
                            admin_details: req.session.admin,
                            data: rows[0],
                            
                            layout: 'layouts/after_login',
                        };
                        res.render('product/edit', render_options);
                    }
                }
            });*/
        }
    }

    updaterecord(req, res) {
        if (!req.session.admin) {
            res.redirect('/admin');
        } else {
            new promise((resolve, reject) => {
                let id = req.body.id;
                let name = req.body.name;                
                let sql = "SELECT id FROM tbl_products WHERE product_name = (?) AND id != (?)";
                conn.query(sql, [name, id], function (err, rows) {
                    if (rows[0]) {
                        req.flash('error', message['712']);
                        res.redirect('/admin/product/edit/'+id);
                        res.end();
                    }
                    else {
                        resolve(req);
                    }
                });

                
                let code = req.body.code;                
                let sql_1 = "SELECT id FROM tbl_products WHERE product_code = (?) AND id != (?)";
                conn.query(sql_1, [code, id], function (err, rows) {
                    if (rows[0]) {
                        req.flash('error', message['713']);
                        res.redirect('/admin/product/edit/'+id);
                        res.end();
                    }
                    else {
                        resolve(req);
                    }
                });

            }).then(function (req) {
                var filename = "";
               
                if (!req.files[0] && req.files[0] == undefined) {
                    filename = req.body.oldimage;
                }else{
                    filename = req.files[0].filename;
                }
              
                let id = req.body.id;
                let category_id = req.body.category_id;
                let sub_category_id = req.body.sub_category_id;
                let name = req.body.name;
                // let code = req.body.code;
                let old_price=req.body.old_price;
                let price = req.body.price;
                let quantity = req.body.quantity;
                let description = req.body.description;
                let image = filename;
                let status = req.body.status;
                let updatedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
                let sql = "UPDATE tbl_products SET category_id = (?), sub_category_id = (?), product_name = (?), old_price=(?), price = (?), quantity = (?), description = (?), image = (?), status = (?), updatedOn = (?) WHERE id = (?)";
                conn.query(sql, [category_id, sub_category_id, name, old_price, price, quantity, description, image, status, updatedOn, id], function (err, rows) {
                    if (err) {
                        req.flash('error', message['701']);
                        res.redirect('/admin/product/edit/'+id);
                        res.end();
                    } else {
						    if (req.files.length>0) 
						    {
							   let dsql="DELETE FROM tbl_product_gallery WHERE product_id = (?)";
							       conn.query(dsql, [id], function (err, rows) {
							   }); 
							  for(var i=0;i<req.files.length;i++){
							    let imagval=req.files[i].filename;
							         //console.log(req.files[i].filename);
                               let sql = "INSERT INTO tbl_product_gallery (product_id,image,  addedOn) VALUES (?, ?, ?)";
							          conn.query(sql, [id, imagval,updatedOn], function (err, rows) {
                                });
							   }
                     
                            } 
							
                        req.flash('success', message['706']);
                        res.redirect('/admin/product');
                        res.end();
                    }
                });
            });
        }
    }
}

module.exports = ProductController;
