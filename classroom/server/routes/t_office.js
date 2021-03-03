const pool = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT * FROM `t_office`'  // คำสั่ง sql

    pool.getConnection((err, connection) => {
        if(err) throw err;
        // console.log('connected as id ' + connection.threadId);
        //console.log("t_office")
        pool.query(sql, (err, rows) => {
            
            if(err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}

module.exports.update = function(req,callback){
    let Office_id = req.body.Office_id
    let Office_name = req.body.Office_name
    let Office_id_select = req.body.Office_id_select

    let sql = "UPDATE t_office SET Office_id =? ,Office_name =? WHERE Office_id=?"  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,[Office_id,Office_name,Office_id_select], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            //console.log(Office_id)
            //console.log(Office_name)
            //console.log(Office_id_select)
        });
    });
}