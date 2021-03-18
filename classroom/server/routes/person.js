const pool = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT * FROM person'  // คำสั่ง sql

    pool.getConnection((err, connection) => {
        if(err) throw err;
        // console.log('connected as id ' + connection.threadId);
        console.log('person')
        pool.query(sql, (err, rows) => {
            
            if(err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}


module.exports.getfilter = function (callback){

    let sql = 'SELECT t_office.Office_type,t_office.Office_id,Office_name FROM person,t_office WHERE t_office.Office_id = person.Office_id group by office_id'  // คำสั่ง sql

    pool.getConnection((err, connection) => {
        if(err) throw err;
        // console.log('connected as id ' + connection.threadId);
        console.log('person')
        pool.query(sql, (err, rows) => {
            
            if(err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}