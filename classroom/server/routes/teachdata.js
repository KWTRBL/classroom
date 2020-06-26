const pool = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT teach_table.* ,subject.subject_ename FROM teach_table,subject WHERE teach_table.subject_id = subject.subject_id ORDER BY teach_table.subject_id ASC'  // คำสั่ง sql

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