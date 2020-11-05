const pool = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT * FROM t_faculty_condition where faculty_id = "01"'  // คำสั่ง sql

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
    let committee_per_student = req.body.committee_per_student
   

    let sql = 'UPDATE t_faculty_condition SET committee_per_student = ? where faculty_id = "01"'  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,[committee_per_student], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            
        });
    });


}