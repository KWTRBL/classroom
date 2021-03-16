const pool = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT * FROM person'  // คำสั่ง sql

    pool.getConnection((err, connection) => {
        if(err) throw err;
        // console.log('connected as id ' + connection.threadId);
        //console.log('person')
        pool.query(sql, (err, rows) => {
            
            if(err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}

module.exports.delete = function (person_id,callback) {
    let sql = "DELETE FROM person WHERE person.Person_id= ?"  // คำสั่ง sql
    let sql2 = "DELETE FROM t_condition WHERE t_condition.person_id=?"
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,[person_id], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows.affectedRows)
            connection.release(); // return the connection to pool
            console.log("avbbb")
        });
    });
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql2,[person_id], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows.affectedRows)
            connection.release(); // return the connection to pool
            console.log("yeah")
        });
    });
}