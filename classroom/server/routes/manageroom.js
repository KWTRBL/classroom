const pool = require('./dbconfig')

module.exports.read = function (callback){
    let sec = 1 
    let year=2555
    let semester=1
    let curr2_id="05"
    let teach_day=5
    let timeperiod = 3 //1=morning 2=noon 3=evening
    //เช้า
    let stunumsql_morning = 'UPDATE teach_table SET studentnum = IF(teach_table.studentnum = 0 and section = ?,(SELECT sec1 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =2,(SELECT sec2 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =3,(SELECT sec3 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" and room_no = "" and studentnum=0'
    let manageroomsql_morning = 'UPDATE teach_table SET room_no =IF((SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) ORDER BY seat_num DESC  limit 1) IS NOT NULL, (SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) ORDER BY seat_num DESC  limit 1),IF((SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) ORDER BY seat_num DESC  limit 1) IS NOT NULL,(SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) ORDER BY seat_num limit 1),(SELECT room_no FROM t_room WHERE room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no NOT IN(SELECT room_no FROM t_room WHERE building_no="HM") ORDER BY seat_num limit 1))) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1' 
    let setbuildname_morning = 'UPDATE teach_table SET building_no=(SELECT building_no FROM t_room WHERE teach_table.room_no=t_room.room_no) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" ORDER BY teach_table.studentnum DESC'
    let setroomsql_morning = 'UPDATE t_availableroom SET morning="1" WHERE room_no in (SELECT room_no FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1")and year =? and teach_day =? and semester=?'
    //บ่าย
    let stunumsql_noon = 'UPDATE teach_table SET studentnum = IF(teach_table.studentnum = 0 and section = ?,(SELECT sec1 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =2,(SELECT sec2 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =3,(SELECT sec3 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" and studentnum=0'
    let manageroomsql_noon = 'UPDATE teach_table SET room_no =IF((SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE noon="1") AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) ORDER BY seat_num DESC  limit 1) IS NOT NULL, (SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE noon="1") AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) ORDER BY seat_num DESC  limit 1),IF((SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE noon="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) ORDER BY seat_num DESC  limit 1) IS NOT NULL,(SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE noon="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) ORDER BY seat_num limit 1),(SELECT room_no FROM t_room WHERE room_no NOT IN (SELECT room_no FROM t_availableroom WHERE noon="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no NOT IN(SELECT room_no FROM t_room WHERE building_no="HM") ORDER BY seat_num limit 1))) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1' 
    let setbuildname_noon = 'UPDATE teach_table SET building_no=(SELECT building_no FROM t_room WHERE teach_table.room_no=t_room.room_no) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" ORDER BY teach_table.studentnum DESC'
    let setroomsql_noon = 'UPDATE t_availableroom SET noon="1" WHERE room_no in (SELECT room_no FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1")and year =? and teach_day =? and semester=?'
    //ค่ำ
    let stunumsql_evening = 'UPDATE teach_table SET studentnum = IF(teach_table.studentnum = 0 and section = ?,(SELECT sec1 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =2,(SELECT sec2 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =3,(SELECT sec3 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:30:00") and teach_status="1" and room_no = "" and studentnum=0'
    let manageroomsql_evening = 'UPDATE teach_table SET room_no =IF((SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE evening="1") AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) ORDER BY seat_num DESC  limit 1) IS NOT NULL, (SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE evening="1") AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) ORDER BY seat_num DESC  limit 1),IF((SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE evening="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) ORDER BY seat_num DESC  limit 1) IS NOT NULL,(SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE evening="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) ORDER BY seat_num limit 1),(SELECT room_no FROM t_room WHERE room_no NOT IN (SELECT room_no FROM t_availableroom WHERE evening="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no NOT IN(SELECT room_no FROM t_room WHERE building_no="HM") ORDER BY seat_num limit 1))) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1' 
    let setbuildname_evening = 'UPDATE teach_table SET building_no=(SELECT building_no FROM t_room WHERE teach_table.room_no=t_room.room_no) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:30:00") and teach_status="1" ORDER BY teach_table.studentnum DESC'
    let setroomsql_evening = 'UPDATE t_availableroom SET evening="1" WHERE room_no in (SELECT room_no FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:30:00") and teach_status="1")and year =? and teach_day =? and semester=?'

    var row_affect = 1
    pool.getConnection(  async (err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        if(timeperiod==1){
            await pool.query(stunumsql_morning,[sec,year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
                console.log('The data from users table are: \n', rows);
                console.log(rows.affectedRows);
                // return the connection to pool
            });
            await pool.query(manageroomsql_morning,[curr2_id,curr2_id,year,semester,curr2_id,teach_day,curr2_id,curr2_id,year,semester,curr2_id,teach_day,curr2_id,year,semester,curr2_id,teach_day,curr2_id,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
                console.log('The data from users table are: \n', rows);
                console.log(rows.affectedRows);
                //callback(rows);
                 // return the connection to pool
            });
            await pool.query(setbuildname_morning,[year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
                console.log('The data from users table are: \n', rows);
                console.log(rows.affectedRows);
                //callback(rows);
                 // return the connection to pool
            });
            await pool.query(setroomsql_morning,[year,semester,curr2_id,teach_day,year,teach_day,semester],  (err, rows) => {
                if(err) throw err;
                row_affect = rows.affectedRows
                console.log('The data from users table are: \n', rows);
                console.log(rows.affectedRows);
                //callback(rows)
                callback("morning")
                 // return the connection to pool
            });
        }
        else if(timeperiod==2){
            await pool.query(stunumsql_noon,[sec,year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
                console.log('The data from users table are: \n', rows);
                console.log(rows.affectedRows);
                // return the connection to pool
            });
            await pool.query(manageroomsql_noon,[curr2_id,curr2_id,year,semester,curr2_id,teach_day,curr2_id,curr2_id,year,semester,curr2_id,teach_day,curr2_id,year,semester,curr2_id,teach_day,curr2_id,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
                console.log('The data from users table are: \n', rows);
                console.log(rows.affectedRows);
                //callback(rows);
                 // return the connection to pool
            });
            await pool.query(setbuildname_noon,[year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
                console.log('The data from users table are: \n', rows);
                console.log(rows.affectedRows);
                //callback(rows);
                 // return the connection to pool
            });
            await pool.query(setroomsql_noon,[year,semester,curr2_id,teach_day,year,teach_day,semester],  (err, rows) => {
                if(err) throw err;
                row_affect = rows.affectedRows
                console.log('The data from users table are: \n', rows);
                console.log(rows.affectedRows);
                //callback(rows)
                callback("noon")
                 // return the connection to pool
            });
        }
        else if(timeperiod==3){
            await pool.query(stunumsql_evening,[sec,year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
                console.log('The data from users table are: \n', rows);
                console.log(rows.affectedRows);
                // return the connection to pool
            });
            await pool.query(manageroomsql_evening,[curr2_id,curr2_id,year,semester,curr2_id,teach_day,curr2_id,curr2_id,year,semester,curr2_id,teach_day,curr2_id,year,semester,curr2_id,teach_day,curr2_id,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
                console.log('The data from users table are: \n', rows);
                console.log(rows.affectedRows);
                //callback(rows);
                 // return the connection to pool
            });
            await pool.query(setbuildname_evening,[year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
                console.log('The data from users table are: \n', rows);
                console.log(rows.affectedRows);
                //callback(rows);
                 // return the connection to pool
            });
            await pool.query(setroomsql_evening,[year,semester,curr2_id,teach_day,year,teach_day,semester],  (err, rows) => {
                if(err) throw err;
                row_affect = rows.affectedRows
                console.log('The data from users table are: \n', rows);
                console.log(rows.affectedRows);
                //callback(rows)
                callback("evening")
                 // return the connection to pool
            });
        }
        connection.release();
        //callback("success");
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