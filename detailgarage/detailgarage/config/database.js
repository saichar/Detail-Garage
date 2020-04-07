var mysql = require('mysql');

var pool =  mysql.createPool({
    host : 'localhost',
    user : 'detailgarage',
    password: 'R)d#/@2%2u!#?3L',
    database: 'detailgarage'
});

exports.query = function(sql, param1, param2){
    pool.getConnection(function(err, connection){
        if(param2){
            if(err){
                console.log(err);
                param2(err);
                return;
            }
            connection.query(sql, param1, function(err, results){
                connection.release(); // always put connection back in pool after last query
                if(err){
                    console.log(err);
                    param2(err);
                    return;
                }
                param2(false, results);
            });
        } else if(param1){
            if(err){
                console.log(err);
                param1(err);
                return;
            }
            connection.query(sql, [], function(err, results){
                connection.release(); // always put connection back in pool after last query
                if(err){
                    console.log(err);
                    param1(err);
                    return;
                }
                param1(false, results);
            });
        } else {
            if(err){
                console.log(err);
                return;
            }
            connection.query(sql, [], function(err, results){
                connection.release(); // always put connection back in pool after last query
                if(err){
                    console.log(err);
                    return;
                }
            });
        }
    });
}
