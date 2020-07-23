const pool = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT teach_table.* ,subject.subject_ename,t_room.seat_num FROM teach_table,subject,t_room WHERE teach_table.subject_id = subject.subject_id AND IF(teach_table.room_no !="",t_room.seat_num=(SELECT seat_num FROM t_room WHERE t_room.room_no=teach_table.room_no),t_room.seat_num=0) ORDER BY teach_table.subject_id AND teach_table.section ASC'  // คำสั่ง sql

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