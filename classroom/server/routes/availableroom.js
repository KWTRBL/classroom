const pool = require('./dbconfig')

module.exports.read = function (callback){
    let sql = 'SELECT t_room.room_floor ,t_room.building_no, t_availableroom.* FROM t_room,t_availableroom WHERE t_room.room_no = t_availableroom.room_no' 
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