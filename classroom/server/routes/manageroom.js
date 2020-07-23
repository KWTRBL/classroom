const pool = require('./dbconfig')

function getRow(query,year,semester,curr2_id,teach_day) {
    return new Promise(async function(resolve, reject) {
      let conn; // Declared here for scoping purposes.
      try {
        pool.query(query,[year,semester,curr2_id,teach_day],(err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            resolve(rows);
            //console.log(row);
            // return the connection to pool
        });
        
      } catch (err) {
        console.log('Error occurred', err);
        reject(err);
      } 
    });
  }

  async function row(query,year,semester,curr2_id,teach_day) {
    try {
      let row = await getRow(query,year,semester,curr2_id,teach_day);
     // console.log(row)
      
      return row
    } catch (err) {
      console.log('Opps, an error occurred', err);
    }
  }

module.exports.read = async function (req,callback) {
    console.log(req.body.data)
    let year = req.body.data.year
    let semester = req.body.data.semester
    let curr2_id = req.body.data.curr2_id
    let teach_day = req.body.data.teach_day
    let timeperiod = req.body.data.timeperiod //1=morning 2=noon 3=evening
    let loopnum = 0

    let numrow_morning = 'SELECT COUNT(subject_id) as row FROM teach_table WHERE year = ? and semester = ? and curr2_id = ? AND teach_day = ? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status = "1" ORDER BY teach_table.studentnum DESC'
    let numrow_noon = 'SELECT COUNT(subject_id) as row FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" ORDER BY teach_table.studentnum DESC'
    let numrow_evening = 'SELECT COUNT(subject_id) as row FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" ORDER BY teach_table.studentnum DESC'
    //เช้า
    let stunumsql_morning = 'UPDATE teach_table SET studentnum = IF(teach_table.studentnum = 0 and section = 1,(SELECT sec1 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =2,(SELECT sec2 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =3,(SELECT sec3 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" and room_no = "" and studentnum=0'
    let manageroomsql_morning = 'UPDATE teach_table SET room_no =IF((SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1)ORDER BY seat_num DESC  limit 1) IS NOT NULL, (SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num DESC  limit 1),IF((SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num DESC  limit 1) IS NOT NULL,(SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1),(SELECT room_no FROM t_room WHERE room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no NOT IN(SELECT room_no FROM t_room WHERE building_no="HM")  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1))) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1'
    let setbuildname_morning = 'UPDATE teach_table SET building_no=(SELECT building_no FROM t_room WHERE teach_table.room_no=t_room.room_no) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("13:00:00") and teach_status="1" ORDER BY teach_table.studentnum DESC'
    let setroomsql_morning = 'UPDATE t_availableroom t1 SET morning= "1" WHERE EXISTS (SELECT room_no FROM teach_table t2 WHERE t1.room_no=t2.room_no and year = ? and t2.year = t1.year and semester=?  and t2.semester = t1.semester and curr2_id=? AND teach_day=? AND t2.teach_day = t1.teach_day AND teach_time > TIME("07:00:00") and t2.teach_day = t1.teach_day and teach_time < TIME("13:00:00") and teach_status="1")'
    //บ่าย
    let stunumsql_noon = 'UPDATE teach_table SET studentnum = IF(teach_table.studentnum = 0 and section = 1,(SELECT sec1 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =2,(SELECT sec2 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =3,(SELECT sec3 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" and studentnum=0'
    let manageroomsql_noon = 'UPDATE teach_table SET room_no =IF((SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1)ORDER BY seat_num DESC  limit 1) IS NOT NULL, (SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num DESC  limit 1),IF((SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num DESC  limit 1) IS NOT NULL,(SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1),(SELECT room_no FROM t_room WHERE room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no NOT IN(SELECT room_no FROM t_room WHERE building_no="HM")  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1))) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1'
    let setbuildname_noon = 'UPDATE teach_table SET building_no=(SELECT building_no FROM t_room WHERE teach_table.room_no=t_room.room_no) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:59:59") and teach_time < TIME("16:30:00") and teach_status="1" ORDER BY teach_table.studentnum DESC'
    let setroomsql_noon = 'UPDATE t_availableroom t1 SET noon= "1" WHERE EXISTS (SELECT room_no FROM teach_table t2 WHERE t1.room_no=t2.room_no and year = ? and t2.year = t1.year and semester=?  and t2.semester = t1.semester and curr2_id=? AND teach_day=? AND t2.teach_day = t1.teach_day AND teach_time > TIME("12:59:59") and t2.teach_day = t1.teach_day and teach_time < TIME("16:30:00") and teach_status="1")'
    //ค่ำ
    let stunumsql_evening = 'UPDATE teach_table SET studentnum = IF(teach_table.studentnum = 0 and section = 1,(SELECT sec1 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =2,(SELECT sec2 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =3,(SELECT sec3 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" and studentnum=0'
    let manageroomsql_evening = 'UPDATE teach_table SET room_no =IF((SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1)ORDER BY seat_num DESC  limit 1) IS NOT NULL, (SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num DESC  limit 1),IF((SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num DESC  limit 1) IS NOT NULL,(SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1),(SELECT room_no FROM t_room WHERE room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1") AND seat_num-19 > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no NOT IN(SELECT room_no FROM t_room WHERE building_no="HM")  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1))) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1'
    let setbuildname_evening = 'UPDATE teach_table SET building_no=(SELECT building_no FROM t_room WHERE teach_table.room_no=t_room.room_no) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" ORDER BY teach_table.studentnum DESC'
    let setroomsql_evening = 'UPDATE t_availableroom t1 SET evening= "1" WHERE EXISTS (SELECT room_no FROM teach_table t2 WHERE t1.room_no=t2.room_no and year = ? and t2.year = t1.year and semester=?  and t2.semester = t1.semester and curr2_id=? AND teach_day=? AND t2.teach_day = t1.teach_day AND teach_time > TIME("16:29:59") and t2.teach_day = t1.teach_day and teach_status="1")'

    var row_affect = 1
    if(timeperiod=="07:00"){
        var rownum =  await row(numrow_morning,year,semester,curr2_id,teach_day)  
    }
    else if(timeperiod=="13:00"){
        var rownum =  await row(numrow_noon,year,semester,curr2_id,teach_day)  
    }
    else if(timeperiod=="16:30"){
        var rownum =  await row(numrow_evening,year,semester,curr2_id,teach_day)  
    }

    console.log(rownum[0].row)
    pool.getConnection(async (err, connection) => {
        if (err) throw err;
        var test
        console.log('connected as id ' + connection.threadId);

        do{
        if(timeperiod=="07:00"){
            connection.query(stunumsql_morning,[year,semester,curr2_id,teach_day],  async (err, rows) => {
            });
            
            connection.query(manageroomsql_morning,[curr2_id,curr2_id,year,semester,curr2_id,teach_day,curr2_id,curr2_id,year,semester,curr2_id,teach_day,curr2_id,year,semester,curr2_id,teach_day,curr2_id,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
            connection.query(setbuildname_morning,[year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
            connection.query(setroomsql_morning,[year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
        }
        else if(timeperiod=="13:00"){
            connection.query(stunumsql_noon,[year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
            connection.query(manageroomsql_noon,[curr2_id,curr2_id,year,semester,curr2_id,teach_day,curr2_id,curr2_id,year,semester,curr2_id,teach_day,curr2_id,year,semester,curr2_id,teach_day,curr2_id,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
            connection.query(setbuildname_noon,[year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
            connection.query(setroomsql_noon,[year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
        }
        else if(timeperiod=="16:30"){
            connection.query(stunumsql_evening,[year,semester,curr2_id,teach_day],  (err, rows) => {
            });
            connection.query(manageroomsql_evening,[curr2_id,curr2_id,year,semester,curr2_id,teach_day,curr2_id,curr2_id,year,semester,curr2_id,teach_day,curr2_id,year,semester,curr2_id,teach_day,curr2_id,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
            connection.query(setbuildname_evening,[year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
            connection.query(setroomsql_evening,[year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
        }
        loopnum++;
        }while(loopnum!=rownum[0].row+1)
        connection.release();
        callback(rownum[0].row)
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