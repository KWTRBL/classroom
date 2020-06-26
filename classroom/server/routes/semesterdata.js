const pool = require('./dbconfig')

module.exports.read = function (callback){

   // let sql = 'SELECT DISTINCT year , semester FROM teach_table '  // คำสั่ง sql
    let sql = 'SELECT DISTINCT year ,count(DISTINCT semester) as semester FROM teach_table group by year'
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