var async = require('async');
var randomstring = require('randomstring');
var randomize = require('randomatic');
class ProductController{

    getProductList(req, res){
        // console.log('asfhsdkljhflsdkfhlsdhfl');
        // console.log(req.body.pagenumber);

        let pageno = req.body.pagenumber;
		var limit = 9;
		var offset = 0;
		if (pageno == 1) {
			//var offset = 0;
			var newlimit = limit;
		} else {
			//var offset = (pageno-1) * limit;
			var newlimit = limit * pageno;
        }
        
        if(req.body.user_id != ''){
            var sql = "SELECT tp.* , IFNULL((SELECT IFNULL(id, 0) AS favorite from tbl_wishlist_product twp WHERE twp.product_id = tp.id AND twp.user_id = "+req.body.user_id+" ), 0) AS favorite FROM tbl_products tp LEFT JOIN tbl_wishlist_product twp ON tp.id = twp.product_id WHERE status = 1 AND is_deleted = 0 GROUP BY tp.id LIMIT " + offset + "," + newlimit + "";
        } else {
            var sql = "SELECT * FROM tbl_products WHERE status = 1 AND is_deleted = 0 GROUP BY id LIMIT " + offset + "," + newlimit + "";
        }
        

        // let sql = "SELECT * FROM tbl_products WHERE status = 1 AND is_deleted = 0";
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'productList'});
                    res.end();
                }                
            }
        });
        
    }


    getCategoryProductList(req, res){   
        let pageno = req.body.pagenumber;
		var limit = 9;
		var offset = 0;
		if (pageno == 1) {
			//var offset = 0;
			var newlimit = limit;
		} else {
			//var offset = (pageno-1) * limit;
			var newlimit = limit * pageno;
        }

        if(req.body.user_id != ''){
            var sql = "SELECT tp.* , IFNULL((SELECT IFNULL(id, 0) AS favorite from tbl_wishlist_product twp WHERE twp.product_id = tp.id AND twp.user_id = "+req.body.user_id+" ), 0) AS favorite FROM tbl_products tp INNER JOIN tbl_category AS tc ON (tc.id = tp.category_id) WHERE tc.slug = (?) AND tp.status = 1 AND tp.is_deleted = 0 GROUP BY tp.id LIMIT " + offset + "," + newlimit + "";
        } else {
            var sql = "SELECT tp.* FROM tbl_products tp INNER JOIN tbl_category AS tc ON (tc.id = tp.category_id) WHERE tc.slug = (?) AND tp.status = 1 AND tp.is_deleted = 0 GROUP BY tp.id LIMIT " + offset + "," + newlimit + "";
        }
            
        // let sql = "SELECT tp.id, tp.category_id, tp.sub_category_id, tp.product_name, LEFT(tp.description, 180) AS description, tp.old_price, tp.price, tp.quantity, tp.image FROM tbl_products AS tp INNER JOIN tbl_category AS tc ON (tc.id = tp.category_id) WHERE tc.slug = (?) AND tp.status = 1 AND tp.is_deleted = 0";
        conn.query(sql, [req.params.slug], function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'productList'});
                    res.end();
                }                
            }
        });
        
    }


    getFilterProductList(req, res){ //console.log(req.body);
        var sortBy = req.body.sortby;
        var categoryId =req.body.categoryId;
        var subCategoryId =req.body.subCategoryId;
        var min_price =req.body.min_price;
        var max_price =req.body.max_price;

        if(sortBy == 1){
            var orderBy = " GROUP BY tp.id order by tp.id DESC";
        } else if(sortBy == 2){
            var orderBy = " GROUP BY tp.id order by tp.price ASC";
        } else if(sortBy == 3){
            var orderBy = " GROUP BY tp.id order by tp.price DESC";
        } else if(sortBy == 4){
            var orderBy = " GROUP BY tp.id order by tp.sell_quantity DESC";
        } else {
            var orderBy = " GROUP BY tp.id order by tp.id ASC";
        }

        if(categoryId != ""){
            var Where = " AND tp.category_id ="+categoryId;
        } else {
            var Where = "";
        }

        if(subCategoryId != ""){
            var Where1 = " AND tp.sub_category_id ="+subCategoryId;
        } else {
            var Where1 = "";
        }

        if(min_price != "" && max_price != ""){
            var Where2 = " AND price > "+min_price+" AND price < "+max_price;
        } else {
            var Where2 = "";
        }

        if(req.body.user_id != ''){
            var sql = "SELECT tp.* , IFNULL((SELECT IFNULL(id, 0) AS favorite from tbl_wishlist_product twp WHERE twp.product_id = tp.id AND twp.user_id = "+req.body.user_id+" ), 0) AS favorite FROM tbl_products tp LEFT JOIN tbl_wishlist_product twp ON tp.id = twp.product_id WHERE status = 1 AND is_deleted = 0"+Where+Where1+Where2+orderBy;
        } else {
            var sql = "SELECT tp.* FROM tbl_products tp LEFT JOIN tbl_wishlist_product twp ON tp.id = twp.product_id WHERE status = 1 AND is_deleted = 0"+Where+Where1+Where2+orderBy;
        }
        


        // console.log(sql);
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'productList'});
                    res.end();
                } else {
                    res.json({status: "true", response: [], message: 'productList'});
                    res.end();
                }               
            }
        });
    }


    getFilterCategoryProductList(req, res){
        // console.log(req.body);

        var sortBy = req.body.sortby;
        let slug = req.body.slug;
        // var subCategoryId =parseInt(req.body.subCategoryId);
        var subCategoryId =req.body.subCategoryId;
        var min_price =req.body.min_price;
        var max_price =req.body.max_price;

        if(sortBy == 1){
            var orderBy = " GROUP BY tp.id order by tp.id DESC";
        } else if(sortBy == 2){
            var orderBy = " GROUP BY tp.id order by tp.price ASC";
        } else if(sortBy == 3){
            var orderBy = " GROUP BY tp.id order by tp.price DESC";
        } else if(sortBy == 4){
            var orderBy = " GROUP BY tp.id order by tp.sell_quantity DESC";
        } else {
            var orderBy = " GROUP BY tp.id order by tp.id ASC";
        }

        if(subCategoryId != ""){
            var Where1 = " AND tp.sub_category_id ="+subCategoryId;
        } else {
            var Where1 = '';
        }

        if(min_price != "" && max_price != ""){
            var Where2 = " AND price > "+min_price+" AND price < "+max_price;
        } else {
            var Where2 = '';
        }

        if(req.body.user_id != ''){
            var sql = "SELECT tp.* , IFNULL((SELECT IFNULL(id, 0) AS favorite from tbl_wishlist_product twp WHERE twp.product_id = tp.id AND twp.user_id = "+req.body.user_id+" ), 0) AS favorite FROM tbl_products tp INNER JOIN tbl_category AS tc ON (tc.id = tp.category_id) WHERE tc.slug = '"+req.body.slug+"' AND tp.status = 1 AND tp.is_deleted = 0"+Where1+Where2+orderBy;
        } else {
            var sql = "SELECT tp.* FROM tbl_products tp INNER JOIN tbl_category AS tc ON (tc.id = tp.category_id) WHERE tc.slug = '"+req.body.slug+"' AND tp.status = 1 AND tp.is_deleted = 0"+Where1+Where2+orderBy;
        }
        


        // let sql = "SELECT tp.id, tp.category_id, tp.sub_category_id, tp.product_name, LEFT(tp.description, 180) AS description, tp.old_price, tp.price, tp.quantity, tp.image FROM tbl_products AS tp INNER JOIN tbl_category AS tc ON (tc.id = tp.category_id) WHERE tc.slug = (?) AND tp.status = 1 AND tp.is_deleted = 0"+Where1+Where2+orderBy;
        

        console.log(sql);
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'productList'});
                    res.end();
                }else{
                    res.json({status: "true", response: [], message: 'productList'});
                    res.end();
                }               
            }
        });
    }



    // getUserCartlistProduct(req, res){
    //     var sql = "SELECT tp.*, tc.id as cart_id, tc.quantity as cartTotalQuantity, tc.total_amount FROM tbl_products tp LEFT JOIN tbl_cart tc ON tp.id = tc.product_id WHERE tc.user_id = (?)";
    //     // console.log(sql);
    //     conn.query(sql, [req.body.user_id], function(err, rows){
    //         if(err){
    //             res.json({status:2});
    //             res.end();
    //         } else {
    //             if(rows[0]){
    //                 res.json({status: "true", response: rows, message: 'cartlistProduct'});
    //                 res.end();
    //             } else {
    //                 res.json({status: "true", response: [], message: 'cartlistProduct'});
    //                 res.end();
    //             }          
    //         }
    //     });
    // }



    getUserCartlistProduct(req, res){
        async.parallel({
            cartlist: function (callback) {
                var sql = "SELECT tp.*, tc.id as cart_id, tc.quantity as cartTotalQuantity, tc.total_amount FROM tbl_products tp LEFT JOIN tbl_cart tc ON tp.id = tc.product_id WHERE tc.user_id = "+req.body.user_id;
                // console.log(sql);
                conn.query(sql, function(err, rows){
                    if (err) {
                        callback(null, []);
                    } else {
                        callback(null, rows);
                    }
                });
            },
            deliveryAmount: function (calb) {
                var sql = "SELECT value FROM tbl_settings WHERE setting_name IN ('delivery_amount') AND status = 1 AND is_deleted = 0";
                conn.query(sql, function (err, addrows) {
                    if (err) {
                        calb(null, []);
                    } else {
                        calb(null, addrows);
                    }
                });
            }
        }, function (err, results) {
            var data = {};
            data['cartlistProduct'] = results.cartlist;
            data['deliveryAmount'] = results.deliveryAmount;
            res.json({ "response": data });
            res.end();
        });
    }





    getProductDetails(req, res){
        async.parallel({
            details: function (callback) {
                if(req.body.user_id != ""){
                    var sql = "SELECT tp.* , IFNULL((SELECT IFNULL(id, 0) AS favorite from tbl_wishlist_product twp WHERE twp.product_id = tp.id AND twp.user_id = "+req.body.user_id+" ), 0) AS favorite FROM tbl_products tp LEFT JOIN tbl_wishlist_product twp ON tp.id = twp.product_id WHERE tp.id = (?) GROUP BY tp.id";
                    // console.log(sql);
                    conn.query(sql, [req.params.id], function (err, rows) {
                        if (err) {
                            callback(null, []);
                        } else {
                            callback(null, rows);
                        }
                    });
                } else {
                    conn.query('SELECT tp.* FROM tbl_products AS tp WHERE tp.id = (?) GROUP BY tp.id',
                    [req.params.id], function(err, rows){
                        if (err) {
                            callback(null, []);
                        } else {
                            callback(null, rows);
                        }
                    });
                }
            },
            imagelist: function (calb) {
                var sql = "SELECT * FROM tbl_product_gallery WHERE product_id =" + req.params.id;
                conn.query(sql, function (err, imgrows) {
                    if (err) {
                        calb(null, []);
                    } else {
                        if (imgrows.length > 0) {
                            for (var i = 0; i < imgrows.length; i++) {
                                imgrows[i]['image'] = constant.SHOW_PRODUCTS_PIC + imgrows[i]['image'];
                            }
                        }
                        calb(null, imgrows);
                    }
                });


            },
            reviewlist: function (prorev) {
                conn.query('SELECT tpr.*, tu.first_name, tu.last_name, tu.profile_image FROM tbl_product_review AS tpr LEFT JOIN tbl_users as tu ON tu.id=tpr.user_id WHERE tpr.product_id = (?) AND tpr.status = 1',
                [req.params.id], function(err, reviewrows){
                    if (err) {
                        prorev(null, []);
                    } else {
                        prorev(null, reviewrows);
                    }
                });
            }
        }, function (err, results) {
            var data = {};
            data['details'] = results.details;
            data['imageslist'] = results.imagelist;
            data['reviewlist'] = results.reviewlist;
            res.json({ "response": data });
            res.end();
        });
    }


    addProductIntoCart(req, res){
        // console.log(req.body.user_id);
        let addedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
        let sql = "SELECT * FROM tbl_cart WHERE product_id = (?) AND user_id = (?)";
        conn.query(sql, [req.body.product_id, req.body.user_id], function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    // console.log(rows);
                    // var data=result.data.data;
                    let quantity = rows[0].quantity;
                    let total_amount = rows[0].total_amount;
                    let updateQuantity = quantity+req.body.quantity;
                    let updated_price = total_amount+(req.body.quantity*req.body.price);

                    conn.query('UPDATE tbl_cart SET quantity = (?), total_amount = (?) WHERE id = (?) AND user_id = (?)', [updateQuantity, updated_price, rows[0].id, req.body.user_id], function(err, rows){
                        if(err){
                            res.json({status: "false", response: rows, message: 'Something went wrong!'});
                            res.end();
                        }else{
                            // res.json({status: "success", response: rows, message: 'Product added into cart successfully!'});
                            // res.end();
                            var sql = "SELECT Count(tc.id) as cartQuantity, SUM(tc.total_amount) as cartTotalAmount FROM tbl_cart tc WHERE tc.user_id = "+req.body.user_id+"";
                            // console.log(sql);
                            conn.query(sql, function(err, rows){
                                if(err){
                                    res.json({status: "false", response: rows, message: 'Something went wrong!'});
                                    res.end();
                                } else {
                                    if(rows[0]){
                                        res.json({status: "success", response: rows, message: 'Product added into cart successfully!'});
                                        res.end();
                                    }                
                                }
                            });
                        }
                    })
                    // console.log(updateQuantity);
                    // res.json({status: "true", response: rows, message: 'cartItems'});
                    // res.end();
                } else {
                    let total_amount = req.body.quantity*req.body.price;
                    // console.log('No record');
                    let sql = "INSERT INTO tbl_cart (user_id, product_id, category_id, sub_cat_id, quantity, amount, total_amount, addedOn) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    conn.query(sql, [req.body.user_id, req.body.product_id, req.body.category_id, req.body.sub_category_id, req.body.quantity, req.body.price, total_amount, addedOn], function (err, rows) {
                        if (err) {
                            res.json({status: "false", response: rows, message: 'Something went wrong!'});
                            res.end();
                        } else {
                            // res.json({status: "success", response: rows, message: 'Product added into cart successfully!'});
                            // res.end();
                            var sql = "SELECT Count(tc.id) as cartQuantity, SUM(tc.total_amount) as cartTotalAmount FROM tbl_cart tc WHERE tc.user_id = "+req.body.user_id+"";
                            // console.log(sql);
                            conn.query(sql, function(err, rows){
                                if(err){
                                    res.json({status: "false", response: rows, message: 'Something went wrong!'});
                                    res.end();
                                } else {
                                    if(rows[0]){
                                        res.json({status: "success", response: rows, message: 'Product added into cart successfully!'});
                                        res.end();
                                    }                
                                }
                            });
                        }
                    });
                }
            }
        });
    }


    addProductIntoWishlist(req, res){
        // console.log(req.body.user_id);
        let addedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
        let sql = "SELECT * FROM tbl_wishlist_product WHERE product_id = (?) AND user_id = (?)";
        conn.query(sql, [req.body.product_id, req.body.user_id], function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    conn.query('DELETE FROM tbl_wishlist_product WHERE product_id = (?) AND user_id = (?)', [req.body.product_id, req.body.user_id], function(err, rows){
                        if(err){
                            res.json({status: "false", response: rows, message: 'Something went wrong!'});
                            res.end();
                        }else{
                            res.json({status: "delete", response: rows, message: 'Product remove from wishlist!'});
                            res.end();
                        }
                    })
                } else {
                    // console.log('No record');
                    let sql = "INSERT INTO tbl_wishlist_product (user_id, product_id,  addedOn) VALUES (?, ?, ?)";
                    conn.query(sql, [req.body.user_id, req.body.product_id, addedOn], function (err, rows) {
                        if (err) {
                            res.json({status: "false", response: rows, message: 'Something went wrong!'});
                            res.end();
                        } else {
                            res.json({status: "success", response: rows, message: 'Product added into wishlist successfully!'});
                            res.end();
                        }
                    });
                }
            }
        });
    }


    getTodaysDealList(req, res){
        // console.log(req.body.user_id);
        let sql = "SELECT tp.* , IFNULL((SELECT IFNULL(id, 0) AS favorite from tbl_wishlist_product twp WHERE twp.product_id = tp.id AND twp.user_id = (?) ), 0) AS favorite FROM tbl_products tp LEFT JOIN tbl_wishlist_product twp ON tp.id = twp.product_id WHERE today_deal = 1 AND status = 1 AND is_deleted = 0 GROUP By tp.id";
        // console.log(sql);
        conn.query(sql, [req.body.user_id], function(err, rows){
            // console.log(conn.query);
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'todaydeallist'});
                    res.end();
                }                
            }
        });
    }


    bestSellingProductList(req, res){
        // console.log(req.body.user_id);
        // let sql = "SELECT * FROM tbl_products WHERE status = 1 AND is_deleted = 0 order by sell_quantity DESC";
        let sql = "SELECT tp.* , IFNULL((SELECT IFNULL(id, 0) AS favorite from tbl_wishlist_product twp WHERE twp.product_id = tp.id AND twp.user_id = (?) ), 0) AS favorite FROM tbl_products tp LEFT JOIN tbl_wishlist_product twp ON tp.id = twp.product_id WHERE status = 1 AND is_deleted = 0 GROUP By tp.id order by tp.sell_quantity DESC" ;
        // console.log(sql);
        conn.query(sql, [req.body.user_id], function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'bestsellingproductllist'});
                    res.end();
                }                
            }
        });
    }


    getUserWishlistProduct(req, res){
        let pageno = req.body.pagenumber;
		var limit = 9;
		var offset = 0;
		if (pageno == 1) {
			//var offset = 0;
			var newlimit = limit;
		} else {
			//var offset = (pageno-1) * limit;
			var newlimit = limit * pageno;
        }
        var sql = "SELECT tp.*, twp.id as w_id FROM tbl_products tp LEFT JOIN tbl_wishlist_product twp ON tp.id = twp.product_id WHERE twp.user_id = (?) GROUP By tp.id LIMIT " + offset + "," + newlimit;
        // console.log(sql);
        conn.query(sql, [req.body.user_id], function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'wishlistProduct'});
                    res.end();
                }                
            }
        });
    }

    deleteWishlistItem(req, res){
        var sql = "DELETE FROM tbl_wishlist_product WHERE user_id = (?) AND id = (?)";
        conn.query(sql, [req.body.user_id, req.body.id], function(err, rows){
            if(err){
                var response = {};
                response.status = "false";
                response.message = 'Something went wrong!';
                res.send(response);
                res.end();
            } else {
                if(rows){
                    var sql = "SELECT COUNT(id) as wishlistCount FROM tbl_wishlist_product WHERE user_id = "+req.body.user_id+"";
                    conn.query(sql, function(err, rows){
                        // console.log(rows);
                        // console.log(rows[0]);
                        // console.log(rows[0].wishlistCount);
                        if(err){
                            res.json({status: "false", response: rows, message: 'Something went wrong!'});
                            res.end();
                        } else {
                            if(rows[0].wishlistCount>0){
                                res.json({status: "success", response: rows, message: 'Item deleted successfully!'});
                                res.end();
                            } else {
                                res.json({status: "deleted", response: [], message: 'Item deleted successfully!'});
                                res.end();
                            }
                        }
                    });
                    // var response = {};
                    // response.status = "success";
                    // response.message = 'Item deleted successfully!';
                    // res.send(response);
                    // res.end();
                }                
            }
        });
    }


    

    deleteCartlistItem(req, res){
        var sql = "DELETE FROM tbl_cart WHERE user_id = (?) AND id = (?)";
        conn.query(sql, [req.body.user_id, req.body.id], function(err, rows){
            if(err){
                var response = {};
                response.status = "false";
                response.message = 'Something went wrong!';
                res.send(response);
                res.end();
            } else {
                if(rows){
                    var sql = "SELECT COUNT(id) as cartCount FROM tbl_cart WHERE user_id = "+req.body.user_id+"";
                    conn.query(sql, function(err, rows){
                        if(err){
                            res.json({status: "false", response: rows, message: 'Something went wrong!'});
                            res.end();
                        } else {
                            if(rows[0].cartCount>0){
                                res.json({status: "success", response: rows, message: 'Item deleted successfully!'});
                                res.end();
                            } else {
                                res.json({status: "deleted", response: [], message: 'Item deleted successfully!'});
                                res.end();
                            }
                        }
                    });
                    // var response = {};
                    // response.status = "success";
                    // response.message = 'Item deleted successfully!';
                    // res.send(response);
                    // res.end();
                }                
            }
        });
    }

    getUserCartProDetails(req, res){
        var sql = "SELECT IFNULL(COUNT(tc.id), 0) as cartQuantity, IFNULL(SUM(tc.total_amount), 0) as cartTotalAmount FROM tbl_cart tc WHERE tc.user_id = "+req.body.user_id+"";
        // console.log(sql);
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'cartlistProduct'});
                    res.end();
                }                
            }
        });
    }


    updateCartQuantity(req, res){
        // console.log(req.body);
        let updateQuantity = req.body.quantity;
        let updated_price = req.body.quantity*req.body.price;
        conn.query('UPDATE tbl_cart SET quantity = (?), total_amount = (?) WHERE id = (?) AND user_id = (?)', [updateQuantity, updated_price, req.body.id, req.body.user_id], function(err, rows){
            if(err){
                res.json({status: "false", response: rows, message: 'Something went wrong!'});
                res.end();
            }else{
                var sql = "SELECT tc.quantity, tc.total_amount FROM tbl_cart tc WHERE tc.user_id = "+req.body.user_id+" AND tc.id = "+req.body.id+"";
                // console.log(sql);
                conn.query(sql, function(err, rows){
                    if(err){
                        res.json({status: "false", response: rows, message: 'Something went wrong!'});
                        res.end();
                    } else {
                        if(rows[0]){
                            res.json({status: "success", response: rows, message: 'Cart updated successfully!'});
                            res.end();
                        }                
                    }
                });
            }
        });
    }



    productCheckout(req, res){
         
         //return false;
        let addedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
        // let transactionId = randomstring.generate(20);
        let transactionId = 'TX'+randomize('0', 18);
        let sql = "INSERT INTO tbl_order (user_id, transaction_no, amount, total_amount, shipping_amount, shipping_type, address_id, addedOn) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        conn.query(sql, [req.body.user_id, transactionId, req.body.amount, req.body.total_amount, req.body.shipping_amount, req.body.shipping_type, req.body.address_id, addedOn], function (err, rows) {
            if(err){
                res.json({status: "false", response: rows, message: 'Something went wrong!'});
                res.end();
            }else{
                // console.log(result.insertId);
                let orderId = rows.insertId;
                let sql = "SELECT * FROM tbl_cart tc WHERE tc.user_id = "+req.body.user_id+"";
                conn.query(sql, function(err, rows){
                    if(err){
                        res.json({status: "false", response: rows, message: 'Something went wrong!'});
                        res.end();
                    } else {
                        if(rows[0]){
                            for(var i=0;i<rows.length;i++)
                            {
                                let sql = "INSERT INTO tbl_order_item (category_id, sub_category_id, product_id, order_id, user_id, quantity, amount, addedOn) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                                conn.query(sql, [rows[i]['category_id'], rows[i]['sub_cat_id'], rows[i]['product_id'], orderId, req.body.user_id, rows[i]['quantity'], rows[i]['total_amount'], addedOn], function (err, rows) {
                                });

                                var cartQuant = rows[i]['quantity'];
                                var proId = rows[i]['product_id'];

                                // Update Quantity in Product table
                                let sql_1 = "SELECT quantity, sell_quantity FROM tbl_products WHERE id = "+rows[i]['product_id']+"";
                                conn.query(sql_1, function(err, sql_rows){ 

                                    var proQuant = sql_rows[0]['quantity'];
                                    var sellQuantityNum = sql_rows[0]['sell_quantity'];
                                    var updateproQuant = proQuant-cartQuant;
                                    var updatesellQuant = sellQuantityNum+cartQuant;

                                    conn.query('UPDATE tbl_products SET quantity= (?), sell_quantity = (?) WHERE id = (?)', [updateproQuant, updatesellQuant, proId], function(err, rows){
                                    })
                                });

                            }
                            
							let sql1 = "SELECT * FROM tbl_order WHERE user_id = "+req.body.user_id+" order by id DESC limit 1";
							conn.query(sql1, function(err, rows){
								if(err){
								   
								} else {
									
									if(rows[0]){
										// console.log(rows[0].id);
										var sql2 = "SELECT tp.product_name, tp.image, tp.price, toi.quantity, toi.amount, too.transaction_no, too.amount as totAmt, too.shipping_amount, too.total_amount, too.addedOn FROM tbl_products tp LEFT JOIN tbl_order_item toi ON tp.id = toi.product_id LEFT JOIN tbl_order too ON too.id = toi.order_id WHERE toi.user_id = "+req.body.user_id+" AND toi.order_id = "+rows[0].id+"";
										// console.log(sql);
										conn.query(sql2, function(err, rows){
											if(err){
											} else {
													if(rows[0]){
                                                      var html="";
													  for(let k=0;k<rows.length;k++){
                                                        html+='<tr style="background-color:#fff;">';
                                                        html+='<td><figure><img src="'+constant.SHOW_PRODUCTS_PIC+rows[k].image+'" width="59px" height="59px"></figure></td>';
                                                        html+='<td><span style="color: #00346f;text-transform:uppercase; font-weight:bold;">'+rows[k].product_name+'</span></td>';
                                                        html+='<td align="center">'+rows[k].quantity+'</td>';
                                                        html+='<td align="center">$ '+rows[k].price+'</td>';
                                                        html+='</tr>';
                                                        // html+='<tr id="cart_undefined">';
                                                        // html+='<td ><figure><img src="'+constant.SHOW_PRODUCTS_PIC+rows[k].image+'" width="59px" height="59px"></figure> <h6>'+rows[k].product_name+'</h6></td>';
														//   html+='<td data-label="Price">$'+rows[k].price+'</td>';
														  
														//   html+='<td data-label="Price">'+rows[k].quantity+'</td></tr>';
														  
													  }
													//   html+='<tr id="cart_undefined"><th >Transaction No</th><th>'+rows[0].transaction_no+'</th><th >Total</th><th>$'+rows[0].totAmt+'</th></tr><tr id="cart_undefined"><th >Shipping Charge</th><th>$'+rows[0].shipping_amount+'</th><th >Sub Total</th><th>$'+rows[0].total_amount+'</th></tr>';
													 let sql3 = "SELECT id, name, subject, description FROM tbl_email_template WHERE name = 'order_details' "
													conn.query(sql3, function(err, mailrows){
													if(err){
														//res.json({status:"false", response:[],message:"Something went wrong"});
														//res.end();
													} else {
														
														var subject = mailrows[0]['subject'];
														var emailContent = mailrows[0]['description'];
														var emailContent = emailContent.replace('{{contact_person}}', req.body.username, "g");
														emailContent = emailContent.replace('{{email_logo_url}}', constant.SHOW_LOGO_PIC, "g");
                                                        emailContent = emailContent.replace('{{order_number}}',rows[0].transaction_no , "g");
                                                        emailContent = emailContent.replace('{{order_date}}',rows[0].addedOn , "g");
                                                        emailContent = emailContent.replace('{{item_price}}',rows[0].totAmt , "g");
                                                        emailContent = emailContent.replace('{{shipping_charge}}',rows[0].shipping_amount , "g");
                                                        emailContent = emailContent.replace('{{grand_total}}',rows[0].total_amount , "g");


														emailContent = emailContent.replace('{{order_items}}',html , "g");
														emailContent = emailContent.replace('{{site_name}}', constant.SITE_NAME, "g");
														emailContent = emailContent.replace('{{year}}', "2019", "g");

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
															from: 'Detail Garage',
															to: req.body.useremail,
															subject: subject,
															html: emailContent
														};

														new promise((resolve, reject) => {
															transporter.sendMail(mailOptions, function(error, info){
																if (error) {
																	// console.log(error);
																	reject();
																} else {
																	// console.log('Email sent: ' + info.response);
																	resolve();
																}
															});
															resolve();                            
														}).then(() => {
															// console.log('SUCCESS');
														   
														})
													}
													}) 
													}  
											}
										});
									} 
								}
							});
                            

                            // Sent Confirmation mail to user 
                            var sql = "DELETE FROM tbl_cart WHERE user_id = (?)";
                            conn.query(sql, [req.body.user_id], function(err, rows){
                            if(err){
                                res.json({status: "false", response: rows, message: 'Something went wrong!'});
                                res.end();
                            } else {
                                res.json({status: "success", response: [], message: 'Order places successfully!!'});
                                res.end();
                            }
                            });
                        } else {
                            res.json({status: "false", response: rows, message: 'Something went wrong!'});
                            res.end();
                        }             
                    }
                });
            }
        });
    }


    orderConfirmation(req, res){
		
        let sql = "SELECT * FROM tbl_order WHERE user_id = "+req.body.user_id+" order by id DESC limit 1";
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status: "false", response: rows, message: 'Something went wrong!'});
                res.end();
            } else {
				
                if(rows[0]){
                    // console.log(rows[0].id);
                    var sql = "SELECT tp.product_name, tp.image, tp.price, toi.quantity, toi.amount, too.transaction_no, too.amount as totAmt, too.shipping_amount, too.total_amount FROM tbl_products tp LEFT JOIN tbl_order_item toi ON tp.id = toi.product_id LEFT JOIN tbl_order too ON too.id = toi.order_id WHERE toi.user_id = "+req.body.user_id+" AND toi.order_id = "+rows[0].id+"";
                    // console.log(sql);
                    conn.query(sql, function(err, rows){
						
                        if(err){
                            res.json({status: "false", response: rows, message: 'Something went wrong!'});
                            res.end();
                        } else {
							  
							
                            res.json({status: "true", response: rows, message: 'orderlistProduct'});
                            res.end();
                        }
                    });
                } else {
                    res.json({status: "true", response: [], message: 'orderlistProduct'});
                    res.end();
                }
            }
        });
    }


    getUserOrderList(req, res){
        let pageno = req.body.pagenumber;
		var limit = 9;
		var offset = 0;
		if (pageno == 1) {
			//var offset = 0;
			var newlimit = limit;
		} else {
			//var offset = (pageno-1) * limit;
			var newlimit = limit * pageno;
        }

        let sql = "SELECT * FROM tbl_order WHERE user_id = "+req.body.user_id+" order by id DESC LIMIT " + offset + "," + newlimit + "";
        // console.log(sql);
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status: "false", response: rows, message: 'Something went wrong!'});
                res.end();
            } else {
                // if(rows[0]){
                //     for(var i=0;i<rows.length;i++)
                //     {
                //         var sql1 = "SELECT tp.product_name, tp.image, tp.price, toi.quantity, toi.amount, too.transaction_no, too.addedOn, too.total_amount FROM tbl_products tp LEFT JOIN tbl_order_item toi ON tp.id = toi.product_id LEFT JOIN tbl_order too ON too.id = toi.order_id WHERE toi.user_id = "+req.body.user_id+" AND toi.order_id = "+rows[i].id+"";
                //         console.log(sql1);
                //         conn.query(sql1, function(err, orderrows){
                            
                //         });
                //     }
                // } else {
                //     res.json({status: "true", response: [], message: 'orderProductList'});
                //     res.end();
                // }
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'orderProductList'});
                    res.end();
                } else {
                    res.json({status: "true", response: [], message: 'orderProductList'});
                    res.end();
                }
                
            }
        });
    }


    getUserOrderItemList(req, res){
        var sql = "SELECT tp.id, tp.product_name, tp.image, tp.price, toi.quantity, toi.id as itemId, toi.amount, too.addedOn, too.updatedOn FROM tbl_products tp LEFT JOIN tbl_order_item toi ON tp.id = toi.product_id LEFT JOIN tbl_order too ON too.id = toi.order_id WHERE toi.order_id = "+req.body.orderId+"";
        // console.log(sql);
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status: "false", response: rows, message: 'Something went wrong!'});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'orderItemList'});
                    res.end();
                } else {
                    res.json({status: "true", response: [], message: 'orderItemList'});
                    res.end();
                }
            }
        });
    }




    getUserOrderItemList__(req, res){
        // console.log(req.body);
        async.parallel({
            orderItemList: function (callback) {
                var sql = "SELECT tp.id, tp.product_name, tp.image, tp.price, toi.quantity, toi.id as itemId, toi.amount, too.addedOn, too.updatedOn FROM tbl_products tp LEFT JOIN tbl_order_item toi ON tp.id = toi.product_id LEFT JOIN tbl_order too ON too.id = toi.order_id WHERE toi.order_id = "+req.body.orderId+"";
                // console.log(sql);
                conn.query(sql, function(err, rows){
                    if (err) {
                        callback(null, []);
                    } else {
                        callback(null, rows);
                    }
                });
            },
            reviewlist: function (prorev) {
                conn.query('SELECT tpr.*, tu.first_name, tu.last_name, tu.profile_image FROM tbl_product_review AS tpr LEFT JOIN tbl_users as tu ON tu.id=tpr.user_id WHERE tpr.user_id = (?)',
                [req.body.user_id], function(err, reviewrows){
                    if (err) {
                        prorev(null, []);
                    } else {
                        prorev(null, reviewrows);
                    }
                });
            }
        }, function (err, results) {
            var data = {};
            data['orderItemList'] = results.orderItemList;
            data['reviewlist'] = results.reviewlist;
            res.json({ "response": data });
            res.end();
        });
    }




    addProductReview(req, res){

        if(req.body.rating > 0){
            let addedOn = dateFormat('yyyy-mm-dd HH:MM:ss');
            var editid=req.body.reviewedit;
            if(editid!="" && editid!=undefined){
                let sql="UPDATE tbl_product_review SET rating = (?), review = (?) WHERE id = (?)"
                    conn.query(sql, [req.body.rating, req.body.review,editid], function (err, rows) {
                    if(err){
                        res.json({status:"false", response:[],message:"Something went wrong"});
                        res.end();
                    } else {
                        res.json({status : "success", response:[],message:"Review added successfully!!!"});
                    }
                });
            } else {
                
                let sql = "INSERT INTO tbl_product_review (user_id, product_id, rating, review, addedOn) VALUES (?, ?, ?, ?, ?)";
                conn.query(sql, [req.body.user_id, req.body.product_id, req.body.rating, req.body.review, addedOn], function (err, rows) {
                    if(err){
                        res.json({status:"false", response:[],message:"Something went wrong"});
                        res.end();
                    } else {
                        res.json({status : "success", response:[],message:"Review added successfully!!!"});
                    }
                });
            }
        } else {
            res.json({status : "false", response:[],message:"Select your product rating!"});
            res.end();
        }
		
        
        
    }
    
    getProductReview(req, res){
		var product_id=req.body.productid;
		var userid=req.body.user_id;
        var sql = "SELECT * FROM tbl_product_review Where user_id="+userid+" AND product_id="+product_id+" ";
        
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status: "false", response: rows, message: 'Something went wrong!'});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'ReviewList'});
                    res.end();
                } else {
                    res.json({status: "true", response: [], message: 'ReviewList'});
                    res.end();
                }
            }
        });
    }
    
    searchProductList(req, res){
		var name=req.body.name;
		var sortby=req.body.sortby;
		var min_price=req.body.min_price;
        var max_price=req.body.max_price;
        
        let pageno = req.body.pagenumber;
		var limit = 9;
		var offset = 0;
		if (pageno == 1) {
			//var offset = 0;
			var newlimit = limit;
		} else {
			//var offset = (pageno-1) * limit;
			var newlimit = limit * pageno;
        }
		
		var order="price DESC";
		if(sortby==1){
			order="price DESC";
		}else if(sortby==2){
			order="price ASC";
		}else{
			order="price DESC";
		}
		async.parallel({
            productlist: function (callback) {
                var sql = "SELECT id as id From tbl_products WHERE product_name LIKE '%"+name+"%'";
                // console.log(sql);
                conn.query(sql, [name,name], function (err, rows) {
                    if (err) {
                        callback(null, []);
                    } else {
                        callback(null, rows);
                    }
                });
            },
            category: function (calb) {
              

                var sql = "SELECT sct.id as succat From tbl_category ct LEFT JOIN tbl_sub_category sct ON ct.id = sct.category_id WHERE  ct.category_name LIKE '%"+name+"%' OR  ct.slug LIKE '%"+name+"%' OR  sct.sub_category_name LIKE '%"+name+"%'";

                // console.log(sql);

                conn.query(sql, function (err, addrows) {
                    if (err) {
                        calb(null, []);
                    } else {
                        calb(null, addrows);
                    }
                });


            }
        }, function (err, results) {
            var data = {};
            data['productname'] = results.productlist;
			data['categorieslist'] = results.category;
			
			if(results.productlist.length>0 && results.category.length>0){
				let newarr=[]
				 for(let k=0;k<results.productlist.length;k++){
					 newarr.push(results.productlist[k].id);
				 }
				 let newarrcat=[]
				 for(let j=0;j<results.category.length;j++){
					 newarrcat.push(results.category[j].succat);
				 }
                //  var sql = "SELECT * FROM tbl_products WHERE status = 1 AND is_deleted = 0 AND sub_category_id IN ("+newarrcat.toString()+") OR id IN ("+newarr.toString()+")  ORDER BY "+order+" ";
                 
                if(req.body.user_id != ''){
                    var sql = "SELECT tp.* , IFNULL((SELECT IFNULL(id, 0) AS favorite from tbl_wishlist_product twp WHERE twp.product_id = tp.id AND twp.user_id = "+req.body.user_id+" ), 0) AS favorite FROM tbl_products tp LEFT JOIN tbl_wishlist_product twp ON tp.id = twp.product_id WHERE tp.status = 1 AND tp.is_deleted = 0 AND tp.sub_category_id IN ("+newarrcat.toString()+") OR tp.id IN ("+newarr.toString()+") GROUP BY tp.id ORDER BY "+order+"  LIMIT " + offset + "," + newlimit + "";
                    
                } else {
                    var sql = "SELECT * FROM tbl_products WHERE status = 1 AND is_deleted = 0 AND sub_category_id IN ("+newarrcat.toString()+") OR id IN ("+newarr.toString()+") GROUP BY id ORDER BY "+order+"  LIMIT " + offset + "," + newlimit + "";
                }
                 

				
			}else if(results.productlist.length<=0 && results.category.length>0){
				 let newarr=[]
				 for(let k=0;k<results.category.length;k++){
					 newarr.push(results.category[k].succat);
				 }
				// console.log(newarr);
                // var sql = "SELECT * FROM tbl_products WHERE status = 1 AND is_deleted = 0 AND sub_category_id IN ("+newarr.toString()+") ORDER BY "+order+" ";
                
                if(req.body.user_id != ''){
                    var sql = "SELECT tp.* , IFNULL((SELECT IFNULL(id, 0) AS favorite from tbl_wishlist_product twp WHERE twp.product_id = tp.id AND twp.user_id = "+req.body.user_id+" ), 0) AS favorite FROM tbl_products tp LEFT JOIN tbl_wishlist_product twp ON tp.id = twp.product_id WHERE tp.status = 1 AND tp.is_deleted = 0 AND tp.sub_category_id IN ("+newarr.toString()+") GROUP BY tp.id ORDER BY "+order+"  LIMIT " + offset + "," + newlimit + "";
                } else {
                    var sql = "SELECT * FROM tbl_products WHERE status = 1 AND is_deleted = 0 AND sub_category_id IN ("+newarr.toString()+") GROUP BY id ORDER BY "+order+"  LIMIT " + offset + "," + newlimit + "";
                }
                

			}else if(results.productlist.length>0 && results.category.length<=0){
                // console.log(3);
				 let newarr=[]
				 for(let k=0;k<results.productlist.length;k++){
					 newarr.push(results.productlist[k].id);
				 }
				
                // var sql = "SELECT * FROM tbl_products WHERE status = 1 AND is_deleted = 0 AND id IN ("+newarr.toString()+") ORDER BY "+order+" ";
                
                if(req.body.user_id != ''){
                    var sql = "SELECT tp.* , IFNULL((SELECT IFNULL(id, 0) AS favorite from tbl_wishlist_product twp WHERE twp.product_id = tp.id AND twp.user_id = "+req.body.user_id+" ), 0) AS favorite FROM tbl_products tp LEFT JOIN tbl_wishlist_product twp ON tp.id = twp.product_id WHERE tp.status = 1 AND tp.is_deleted = 0 AND tp.id IN ("+newarr.toString()+") GROUP BY tp.id ORDER BY "+order+"  LIMIT " + offset + "," + newlimit + "";
                } else {
                    var sql = "SELECT * FROM tbl_products WHERE status = 1 AND is_deleted = 0 AND id IN ("+newarr.toString()+") GROUP BY id ORDER BY "+order+"  LIMIT " + offset + "," + newlimit + "";
                }
            }
            
			
       conn.query(sql, function(err, rows){
            if(err){
                res.json({status: "true", response: [], message: 'productList'});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'productList'});
                    res.end();
                }                
            }
        });
            
            
            //res.json({ "response": data });
            //res.end();
        });
		
		
  }
   searchProductListbyprice(req, res){
		var name=req.body.name;
		var sortby=req.body.sortby;
		var min_price=req.body.min_price;
		var max_price=req.body.max_price;
		
		var order="price DESC";
		if(sortby==1){
			order="price DESC";
		}else if(sortby==2){
			order="price ASC";
		}else{
			order="price DESC";
		}
		async.parallel({
            productlist: function (callback) {
                var sql = "SELECT id as id From tbl_products WHERE product_name LIKE '%"+name+"%'";
                // console.log(sql);
                conn.query(sql, [name,name], function (err, rows) {
                    if (err) {
                        callback(null, []);
                    } else {
                        callback(null, rows);
                    }
                });
            },
            category: function (calb) {
              

                var sql = "SELECT sct.id as succat From tbl_category ct LEFT JOIN tbl_sub_category sct ON ct.id = sct.category_id WHERE  ct.category_name LIKE '%"+name+"%' OR  ct.slug LIKE '%"+name+"%' OR  sct.sub_category_name LIKE '%"+name+"%'";

                // console.log(sql);

                conn.query(sql, function (err, addrows) {
                    if (err) {
                        calb(null, []);
                    } else {
                        calb(null, addrows);
                    }
                });


            }
        }, function (err, results) {
            var data = {};
            data['productname'] = results.productlist;
			data['categorieslist'] = results.category;
			
			if(results.productlist.length>0 && results.category.length>0){
				console.log("test");
				let newarr=[]
				 for(let k=0;k<results.productlist.length;k++){
					 newarr.push(results.productlist[k].id);
				 }
				 let newarrcat=[]
				 for(let j=0;j<results.category.length;j++){
					 newarrcat.push(results.category[j].succat);
				 }
                 var sql = "SELECT * FROM tbl_products WHERE status = 1 AND is_deleted = 0 AND (sub_category_id IN ("+newarrcat.toString()+") OR id IN ("+newarr.toString()+")) AND price > "+min_price+" AND price < "+max_price+"  ORDER BY "+order+"  ";
                //  console.log(sql);
				
			}else if(results.productlist.length<=0 && results.category.length>0){
				console.log("test2");
				 let newarr=[]
				 for(let k=0;k<results.category.length;k++){
					 newarr.push(results.category[k].succat);
				 }
				console.log(newarr);
				var sql = "SELECT * FROM tbl_products WHERE status = 1 AND is_deleted = 0 AND sub_category_id IN ("+newarr.toString()+") AND price > "+min_price+" AND price < "+max_price+" ORDER BY "+order+" ";
			}else if(results.productlist.length>0 && results.category.length<=0){
				console.log("test3");
				 let newarr=[]
				 for(let k=0;k<results.productlist.length;k++){
					 newarr.push(results.productlist[k].id);
				 }
				
				var sql = "SELECT * FROM tbl_products WHERE status = 1 AND is_deleted = 0 AND id IN ("+newarr.toString()+") AND price > "+min_price+" AND price < "+max_price+" ORDER BY "+order+" ";
			}
			
       conn.query(sql, function(err, rows){
            if(err){
                res.json({status: "true", response: [], message: 'productList'});
                res.end();
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'productList'});
                    res.end();
                } else {
                    res.json({status: "true", response: [], message: 'productList'});
                    res.end();
                }
            }
        });
            
            
            //res.json({ "response": data });
            //res.end();
        });
		
		
  }

  

// charge(req, res) {

// console.log(req.body.token);


// try { 
// let {status} = stripe.charges.create({
// amount: 2000,
// currency: "usd",
// description: "An example charge",
// source: req.body.token
// });

// res.json({status});
// } catch (err) {
// console.log('kljuli');
// res.status(52200).end();
// }
// }



// charge (req, res){   
//     try { 
//         console.log('1222');
//         console.log(req.body);
//         let {res} = stripe.charges.create({
//         amount: 1000,
//         currency: "usd",
//         description: "An example charge",
//         source: req.body.token
//     });
//     console.log(status);
//       res.json({res});
//         res.json({status: "true", response: [], message: 'success'});
//         res.end();
//     } catch (err) {
//         console.log(res);
//         // res.status(500).end();
//         res.json({status: "false", response: [], message: 'Something went wrong!'});
//         res.end();
//     }
// }



}

module.exports = ProductController;
