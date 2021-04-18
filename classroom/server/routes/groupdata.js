const {pool} = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT curriculum2.curr2_tname,t_section.curr2_id,t_section.class,t_section.sec1,t_section.sec2,t_section.sec3 FROM curriculum2,t_section WHERE t_section.curr2_id = curriculum2.curr2_id'  // คำสั่ง sql

    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql, (err, rows) => {
            
            if(err) throw err;
            console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}

module.exports.update = function(req,callback){
    let curr2_id = req.body.curr2_id
    let classdata = req.body.class
    let sec1 = req.body.sec1
    let sec2 = req.body.sec2
    let sec3 = req.body.sec3 

    let sql = "UPDATE t_section SET sec1 = ? ,sec2 = ?,sec3 = ? WHERE curr2_id = ? AND class = ?"  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,[sec1,sec2,sec3,curr2_id,classdata], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            
        });
    });


}
module.exports.delete = function (req,callback) {
    let curr2_id = req.body.data.curr2_id
    let classdata = req.body.data.class
    let sql = "UPDATE t_section SET sec1 = 0, sec2 = 0, sec3 = 0 WHERE curr2_id = ? and class = ?"  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,[curr2_id,classdata], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows.affectedRows)
            connection.release(); // return the connection to pool
            
        });
    });
}