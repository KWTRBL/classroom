const pool = require('./dbconfig')

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