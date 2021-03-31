const {pool} = require('./dbconfig')

module.exports.read = function (callback){
    console.log('yeardata')

    let sql = 'SELECT DISTINCT year FROM t_exam_week ORDER BY year'  // คำสั่ง sql

    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql, (err, rows) => {
            
            if(err) throw err;
           // console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}