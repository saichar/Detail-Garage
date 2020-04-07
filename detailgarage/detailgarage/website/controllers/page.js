class PageController{
    pageContent(req, res){
        // let sql = "SELECT * FROM tbl_staticpages WHERE identifire = 'about-us' status = 1 AND is_deleted = 0";
        // console.log(sql);
        let sql = "SELECT * FROM tbl_staticpages WHERE identifire = '"+req.params.slug+"' AND status = 1 AND is_deleted = 0";
        // console.log(sql);
        conn.query(sql, function(err, rows){
            if(err){
                res.json({status:2});
                res.end();
            } else {
                if(rows[0]){
                    // console.log(rows);
                    res.json({status: "true", response: rows, message: 'pageContent'});
                    res.end();
                }                
            }
        });
    }


    whyChooseUs(req, res){
        let sql = "SELECT * FROM tbl_staticpages WHERE identifire = (?) AND status = 1 AND is_deleted = 0";
        // console.log(sql);
        conn.query(sql, ['why-choose-us'], function(err, rows){
            if(err){
                res.json({status:2});
            } else {
                if(rows[0]){
                    res.json({status: "true", response: rows, message: 'staticContentList'});
                }
            }
        });
    }



}

module.exports = PageController;
