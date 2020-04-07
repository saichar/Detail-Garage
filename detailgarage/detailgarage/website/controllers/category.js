class CategoryController{

    
    getAllCategoryList(req, res){
        // let sql = "SELECT tc.id, tc.category_name, tc.slug, GROUP_CONCAT( tsc.id ) AS sub_cat_id, tc.status, tc.is_deleted, GROUP_CONCAT( tsc.sub_category_name ) AS subname, tsc.slug AS sub_slug FROM tbl_category AS tc LEFT JOIN tbl_sub_category AS tsc ON ( tc.id =  tsc.category_id ) GROUP BY tc.id HAVING tc.status =1 AND tc.is_deleted =0";

        let sql = "SELECT tc.id, tc.category_name, tc.slug, GROUP_CONCAT( tsc.id ) AS sub_cat_id, tc.status, tc.is_deleted, GROUP_CONCAT( tsc.category_name ) AS subname, tsc.slug AS sub_slug FROM tbl_categories tc  INNER JOIN tbl_categories tsc ON tsc.parent_id = tc.id GROUP BY tc.id HAVING tc.status =1 AND tc.is_deleted =0";

        // console.log(sql);
            
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    
                     //console.log(rows);    
                    for(var i=0;i<rows.length;i++)
                    {
                        var obj = {};
                        var subcatarray  = [];
                        var sbucatidarray = [];
                        if(rows[i]['subname'] != null){
                        subcatarray = rows[i]['subname'].split(',');
                        }
                        if(rows[i]['sub_cat_id'] != null){
                        sbucatidarray = rows[i]['sub_cat_id'].split(',');
                        }
                        for(var j=0; j <= subcatarray.length; j++){
                            for(var k = 0; k< sbucatidarray.length; k++){
                                if(j == k){
                                    obj[sbucatidarray[k]] = subcatarray[j]?subcatarray[j]:"";
                                }
                            }
                        }
                        rows[i]['id'] = rows[i]['id']?rows[i]['id']:"";
                        rows[i]['category_name'] = rows[i]['category_name']?rows[i]['category_name']:"";
                        rows[i]['slug'] = rows[i]['slug']?rows[i]['slug']:"";
                        rows[i]['sub_cat_id'] = rows[i]['sub_cat_id']?rows[i]['sub_cat_id']:"";
                        rows[i]['status'] = rows[i]['status']?rows[i]['status']:"";
                        rows[i]['is_deleted'] = rows[i]['is_deleted']?rows[i]['is_deleted']:"";
                        rows[i]['subcatidnamearray']= obj;
                        rows[i]['subname'] = rows[i]['subname']?rows[i]['subname']:"";
                        rows[i]['sub_slug'] = rows[i]['sub_slug']?rows[i]['sub_slug']:"";
                    }
                    // console.log(rows);
                    res.json({status: "true", response: rows, message: 'categoryList'});
                    res.end();
                }                
            }
        });
    }


    getAllSubCategoryList(req, res){
        // console.log(req.params.slug);
        if(req.params.slug){
            // let sql = "SELECT tsc.id, tsc.sub_category_name, tsc.slug FROM tbl_sub_category AS tsc LEFT JOIN tbl_category AS tc ON ( tc.id =  tsc.category_id ) WHERE tc.slug = (?)";

            let sql = "SELECT tsc.id, tsc.category_name as sub_category_name, tsc.slug FROM tbl_categories AS tsc LEFT JOIN tbl_categories AS tc ON (tc.id = tsc.parent_id ) WHERE tc.slug = (?)";

            // console.log(sql);
            conn.query(sql, [req.params.slug], function(err, rows){
                if(err){
                    res.json({status:2});
                    res.end();
                } else {
                    if(rows[0]){
                        // console.log(rows);
                        res.json({status: "true", response: rows, message: 'subCategoryList'});
                        res.end();
                    }                
                }
            });
        }
    }

    
    

}

module.exports = CategoryController;
