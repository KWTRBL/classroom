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

module.exports.update = function (req,callback){
    console.log('update')
    let building_no = req.body.building_no
    let room_no = req.body.room_no
    let year = req.body.year
    let semester = req.body.semester
    let curr = req.body.curr
    let dept = req.body.dept
    let teachday = req.body.teachday
    let subject_id = req.body.subject_id
    let teach_time = req.body.teach_time
    let teach_time2 =req.body.teach_time2
    let oldroom = req.body.oldroom
    let time = req.body.time
    let section = req.body.section
    let timestring = null
    if(time == 1){
        timestring = "morning"
    }
    else if(time == 2){
        timestring = "noon"
    }
    else if(time == 3){
        timestring = "evening"
    }
    console.log(oldroom,room_no)
    //let sql = "select * FROM teach_table  where teach_status = ? and year = ? and semester = ? and curr2_id = ? and dept_id = ? and teach_day = ? and subject_id = ? and teach_time = ? and teach_time2 =?  "  // คำสั่ง sql
    let sql = "UPDATE teach_table SET room_no = ? ,building_no = ? WHERE year = ? and semester = ? and curr2_id = ? and dept_id = ? and teach_day = ? and subject_id = ? and teach_time = ? and teach_time2 =? and section = ?  "  // คำสั่ง sql
    let sql1 = `UPDATE t_availableroom SET ${timestring} = 0 where room_no = ? and year = ? and semester = ? and teach_day = ?`
    let sql2 = `UPDATE t_availableroom SET ${timestring} = 1 where room_no = ? and year = ? and semester = ? and teach_day = ?`
    console.log(sql1)
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,[room_no,building_no,year,semester,curr,dept,teachday,subject_id,teach_time,teach_time2,section],(err, rows) => {
            
            if(err) throw err;
            //console.log('The data from users table are: \n', rows);
            //callback(rows)
            //connection.release(); // return the connection to pool
        });
        pool.query(sql1,[oldroom,year,semester,teachday],(err, rows) => {
            
            if(err) throw err;
            //console.log('The data from users table are: \n', rows);
            //callback(rows)
           // connection.release(); // return the connection to pool
        });

        pool.query(sql2,[room_no,year,semester,teachday],(err, rows) => {
            
            if(err) throw err;
            console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });


    });
}


module.exports.delete = function (req,callback){
    console.log('del aval room')
    let building_no = req.body.building_no
    let room_no = req.body.room_no
    let year = req.body.year
    let semester = req.body.semester
    let curr = req.body.curr
    let dept = req.body.dept
    let teachday = req.body.teachday
    let subject_id = req.body.subject_id
    let teach_time = req.body.teach_time
    let teach_time2 =req.body.teach_time2
    let time = req.body.time
    let section = req.body.section
    let timestring = null
    console.log(time)
    if(time == 1){
        timestring = "morning"
    }
    else if(time == 2){
        timestring = "noon"
    }
    else if(time == 3){
        timestring = "evening"
    }
    let sql = "UPDATE teach_table SET room_no = ' ' ,building_no = ' ' WHERE year = ? and semester = ? and curr2_id = ? and dept_id = ? and teach_day = ? and subject_id = ? and teach_time = ? and teach_time2 =? and section = ?  "  // คำสั่ง sql
    let sql1 = `UPDATE t_availableroom SET ${timestring} = 0 where room_no = ? and year = ? and semester = ? and teach_day = ?`
    console.log(sql1)
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,[year,semester,curr,dept,teachday,subject_id,teach_time,teach_time2,section],(err, rows) => {
            console.log('The data from users table are: \n', rows);

            if(err) throw err;
        });
        pool.query(sql1,[room_no,year,semester,teachday],(err, rows) => {
            
            if(err) throw err;
            callback(rows.affectedRows)
            connection.release(); // return the connection to pool
        });


    });
}
