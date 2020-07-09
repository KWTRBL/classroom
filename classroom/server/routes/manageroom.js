const pool = require('./dbconfig')

module.exports.read = function (callback){
    let sec = 1 
    let year=2555
    let semester=1
    let curr2_id="01"
    let teach_day=2
    let timeperiod = "morning"
    let stunumsql = 'UPDATE teach_table SET studentnum = IF(teach_table.studentnum = 0 and section = ?,(SELECT sec1 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =2,(SELECT sec2 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =3,(SELECT sec3 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" and room_no = "" and studentnum=0'
    let managesql = 'UPDATE teach_table SET room_no=(SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") ORDER BY RAND() limit 1), building_no=(SELECT building_no FROM t_room WHERE teach_table.room_no=t_room.room_no) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1' 
    let setroomsql = 'UPDATE t_availableroom SET morning="1" WHERE room_no in (SELECT room_no FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1") and teach_day =? and year =? and semester=?'
    var row_affect = 1

    pool.getConnection(  async (err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        
            await pool.query(stunumsql,[sec,year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
                console.log('The data from users table are: \n', rows);
                console.log(rows.affectedRows);
                // return the connection to pool
            });
            await pool.query(managesql,[curr2_id,curr2_id,year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
                console.log('The data from users table are: \n', rows);
                console.log(rows.affectedRows);
                //callback(rows);
                 // return the connection to pool
            });
            await pool.query(setroomsql,[year,semester,curr2_id,teach_day,teach_day,year,semester],  (err, rows) => {
                if(err) throw err;
                row_affect = rows.affectedRows
                console.log('The data from users table are: \n', rows);
                console.log(rows.affectedRows);
                 // return the connection to pool
            });
        connection.release();
        callback("success");
    });  
}

/*
do{
    pool.query(sql,  (err, rows) => {
       if(err) throw err;
       row_affect = rows.affectedRows
       console.log('The data from users table are: \n', rows);
       console.log(rows.affectedRows);
       callback(rows);
        // return the connection to pool
   });
}while(row_affect !=0)
*/