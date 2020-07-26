const pool = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT DISTINCT teach_table.* ,subject.subject_ename,t_room.seat_num FROM teach_table,subject,t_room WHERE teach_table.subject_id = subject.subject_id AND if(teach_table.room_no!="" AND teach_table.room_no IN (SELECT room_no FROM t_room),t_room.room_no=teach_table.room_no,t_room.seat_num=0) ORDER BY teach_table.subject_id AND teach_table.section ASC'  // คำสั่ง sql

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


module.exports.update = function (req,callback){
    console.log('update')
    let teach_status = req.body.teach_status
    let year = req.body.year
    let semester = req.body.semester
    let curr = req.body.curr
    let dept = req.body.dept
    let teachday = req.body.teachday
    let subject_id = req.body.subject_id
    let teach_time = req.body.teach_time
    let teach_time2 =req.body.teach_time2
    //let sql = "select * FROM teach_table  where teach_status = ? and year = ? and semester = ? and curr2_id = ? and dept_id = ? and teach_day = ? and subject_id = ? and teach_time = ? and teach_time2 =?  "  // คำสั่ง sql
    let sql = "UPDATE teach_table SET teach_status = ? WHERE year = ? and semester = ? and curr2_id = ? and dept_id = ? and teach_day = ? and subject_id = ? and teach_time = ? and teach_time2 =?  "  // คำสั่ง sql
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,[teach_status,year,semester,curr,dept,teachday,subject_id,teach_time,teach_time2],(err, rows) => {
            
            if(err) throw err;
            console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}