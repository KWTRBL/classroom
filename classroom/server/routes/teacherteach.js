const pool = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT a.*,b.teacher_tname,c.subject_ename FROM teacher_teach as a,teacher as b ,subject as c WHERE a.teacher_id = b.teacher_id and a.subject_id = c.subject_id'  // คำสั่ง sql

    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql, (err, rows) => {
            
            if(err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}