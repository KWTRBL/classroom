const {pool} = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT * FROM `t_exam_room`'  // คำสั่ง sql

    pool.getConnection((err, connection) => {
        if(err) throw err;
        // console.log('connected as id ' + connection.threadId);
        console.log("t_exam_room")
        pool.query(sql, (err, rows) => {
            
            if(err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}

module.exports.building = function (callback){

    let sql = 'SELECT building_no FROM `t_exam_room` GROUP by building_no'  // คำสั่ง sql

    pool.getConnection((err, connection) => {
        if(err) throw err;
        // console.log('connected as id ' + connection.threadId);
        console.log("building t_exam_room")
        pool.query(sql, (err, rows) => {
            
            if(err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}