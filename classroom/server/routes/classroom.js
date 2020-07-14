const pool = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT t_room.building_no,t_building.building_name,room_no,seat_num ,t_room.room_floor,t_room.room_status FROM t_room,t_building WHERE t_room.building_no = t_building.building_no    ORDER BY building_no ,room_floor,room_no ASC '  // คำสั่ง sql

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

module.exports.delete = function (building_no,callback) {
    let sql = "DELETE FROM t_room WHERE t_room.room_no = ?"  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,building_no, async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows.affectedRows)
            connection.release(); // return the connection to pool
            
        });
    });
}

module.exports.add = function (req,callback) {
    let building_no = req.body.data.building_no
    let room_no = req.body.data.room_no
    let room_name = req.body.data.room_name
    let seat_num = req.body.data.seat_num
    let room_status = req.body.data.room_status
    let room_floor = req.body.data.room_floor
    let sql = "INSERT INTO t_room (building_no, room_no, room_name, seat_num, room_floor, room_status) VALUES (?, ?, ? , ?, ?, ?); "  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,[building_no, room_no, room_name, seat_num, room_floor, room_status], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            
        });
    });
}

module.exports.update = function(req,callback){
    let room_no = req.body.room_no
    let room_name = req.body.room_name
    let seat_num = req.body.seat_num
    let room_no_select = req.body.room_no_select
    let room_status = req.body.room_status    

    let sql = "UPDATE t_room SET room_no = ? ,room_name = ?,seat_num = ?,room_status = ? WHERE room_no = ?"  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,[room_no,room_name,seat_num,room_status,room_no_select], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            
        });
    });


}