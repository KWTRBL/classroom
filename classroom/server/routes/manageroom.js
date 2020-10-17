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

//test
/*
module.exports.read = async function (callback) {
    for(i=0;i<=23;i++){
    for(j=0;j<=6;j++){
        for(k=0;k<=2;k++){
    //let i=9
    //let j=5
    //let k=0
    let year = 2563
    let semester = 1
    var curr2_id_array = ["04","63","08","102","09","100","74","10","62","01","02","03","07","43","73","06","14","05","107","108","61","11","12","67"];
    var teach_day_array = [1,2,3,4,5,6,7];
    var timeperiod_array =["07:00","13:00","16:30"];
    let curr2_id = curr2_id_array[i];
    let teach_day = teach_day_array[j];
    let timeperiod = timeperiod_array[k]; //1=07:00 2=13:00 3=16:30
    let loopnum = 0
*/

/*
module.exports.read = async function (req,callback) {
    console.log(req.body.data)
    let year = req.body.data.year
    let semester = req.body.data.semester
    let curr2_id = req.body.data.curr2_id
    let teach_day = req.body.data.teach_day
    let timeperiod = req.body.data.timeperiod //1=morning 2=noon 3=evening
    let loopnum = 0
*/
module.exports.read = async function (callback) {
    let year = 2563
    let semester = 1
    let curr2_id = 102;
    let teach_day = 4;
    let timeperiod = "16:30"; //1=07:00 2=13:00 3=16:30
    let loopnum = 0

//ใส่ห้องของปีก่อนหน้า
    let subjectoldroom ='SELECT room_no FROM `teach_table`WHERE subject_id=? AND year=?-1 AND semester=? and curr2_id=? ORDER BY section ASC LIMIT 1'
    //เช้า
    let subject_morning = 'SELECT subject_id FROM teach_table WHERE semester = ? and curr2_id = ? AND teach_day = ? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00")  and teach_status = "1" AND year = ? ORDER BY `teach_table`.`subject_id` ASC'
    let updateoldroom_morning='UPDATE teach_table,t_availableroom SET teach_table.room_no=IF(? IN(SELECT room_no FROM t_availableroom WHERE morning=0 and teach_day=? AND semester=? AND year=?),?,teach_table.room_no) ,morning=1 WHERE teach_table.semester = ? and teach_table.curr2_id = ? AND teach_table.teach_day = ? AND teach_table.teach_time > TIME("07:00:00") and teach_table.teach_time < TIME("12:45:00")  and teach_table.teach_status = "1" AND teach_table.year = ? AND teach_table.room_no="" AND teach_table.subject_id=? AND t_availableroom.semester=? AND t_availableroom.year=? AND t_availableroom.teach_day=? AND t_availableroom.room_no=?'
    //บ่าย
    let subject_noon = 'SELECT subject_id FROM teach_table WHERE semester = ? and curr2_id = ? AND teach_day = ? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00")  and teach_status = "1" AND year = ? ORDER BY `teach_table`.`subject_id` ASC'
    let updateoldroom_noon = 'UPDATE teach_table,t_availableroom SET teach_table.room_no=IF(? IN(SELECT room_no FROM t_availableroom WHERE noon=0 and teach_day=? AND semester=? AND year=?),?,teach_table.room_no) ,noon=1 WHERE teach_table.semester = ? and teach_table.curr2_id = ? AND teach_table.teach_day = ? AND teach_table.teach_time > TIME("12:44:59") and teach_table.teach_time < TIME("16:30:00")  and teach_table.teach_status = "1" AND teach_table.year = ? AND teach_table.room_no="" AND teach_table.subject_id=? AND t_availableroom.semester=? AND t_availableroom.year=? AND t_availableroom.teach_day=? AND t_availableroom.room_no=?'
    //เย็น
    let subject_evening = 'SELECT subject_id FROM teach_table WHERE semester = ? and curr2_id = ? AND teach_day = ? AND teach_time > TIME("16:29:59") and teach_status = "1" AND year = ? ORDER BY `teach_table`.`subject_id` ASC'
    let updateoldroom_evening = 'UPDATE teach_table,t_availableroom SET teach_table.room_no=IF(? IN(SELECT room_no FROM t_availableroom WHERE evening=0 and teach_day=? AND semester=? AND year=?),?,teach_table.room_no) ,evening=1 WHERE teach_table.semester = ? and teach_table.curr2_id = ? AND teach_table.teach_day = ? AND teach_table.teach_time > TIME("16:29:59") and teach_table.teach_status = "1" AND teach_table.year = ? AND teach_table.room_no="" AND teach_table.subject_id=? AND t_availableroom.semester=? AND t_availableroom.year=? AND t_availableroom.teach_day=? AND t_availableroom.room_no=?'
//จัดห้องปกติ
    let numrow_morning = 'SELECT COUNT(subject_id) as row FROM teach_table WHERE year = ? and semester = ? and curr2_id = ? AND teach_day = ? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status = "1" ORDER BY teach_table.studentnum DESC'
    let numrow_noon = 'SELECT COUNT(subject_id) as row FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" ORDER BY teach_table.studentnum DESC'
    let numrow_evening = 'SELECT COUNT(subject_id) as row FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" ORDER BY teach_table.studentnum DESC'
    //เช้า
    let setgeneral_morning ='UPDATE teach_table SET room_no=IF(subject_id="01006020","ประชุม-2",IF(subject_id="01006025","ประชุม-1","")) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = ""'
    let stunumsql_morning = 'UPDATE teach_table SET studentnum = IF(teach_table.studentnum = 0 and section = 1,(SELECT sec1 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =2,(SELECT sec2 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =3,(SELECT sec3 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" and studentnum=0'
    let manageroomsql_morning = 'UPDATE teach_table SET room_no =IF((SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1)ORDER BY seat_num limit 1) IS NOT NULL, (SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.5*(SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num   limit 1),IF((SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.5* (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num  limit 1) IS NOT NULL,(SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.5* (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1),(SELECT room_no FROM t_room WHERE room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.5*(SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no NOT IN(SELECT room_no FROM t_room WHERE building_no="7 ชั้น")  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1))) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1'
    let setbuildname_morning = 'UPDATE teach_table ,t_availableroom SET building_no=(SELECT building_no FROM t_room WHERE teach_table.room_no=t_room.room_no) ,morning=1 WHERE teach_table.year =? and teach_table.semester=? and teach_table.curr2_id=? AND teach_table.teach_day=? AND teach_table.teach_time > TIME("07:00:00") and teach_table.teach_time < TIME("12:45:00") and teach_table.teach_status="1" AND t_availableroom.room_no IN (SELECT room_no FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1") and t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?'
    
    //บ่าย
    let setgeneral_noon = 'UPDATE teach_table SET room_no=IF(subject_id="01006020","ประชุม-2",IF(subject_id="01006025","ประชุม-1","")) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = ""'
    let stunumsql_noon = 'UPDATE teach_table SET studentnum = IF(teach_table.studentnum = 0 and section = 1,(SELECT sec1 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =2,(SELECT sec2 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =3,(SELECT sec3 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" and studentnum=0'
    let manageroomsql_noon = 'UPDATE teach_table SET room_no =IF((SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE noon="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1)ORDER BY seat_num limit 1) IS NOT NULL, (SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE noon="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.5*(SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num   limit 1),IF((SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE noon="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.5* (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num  limit 1) IS NOT NULL,(SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE noon="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.5* (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1),(SELECT room_no FROM t_room WHERE room_no NOT IN (SELECT room_no FROM t_availableroom WHERE noon="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.5*(SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no NOT IN(SELECT room_no FROM t_room WHERE building_no="7 ชั้น")  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1))) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1'
    let setbuildname_noon = 'UPDATE teach_table ,t_availableroom SET building_no=(SELECT building_no FROM t_room WHERE teach_table.room_no=t_room.room_no) ,noon=1 WHERE teach_table.year =? and teach_table.semester=? and teach_table.curr2_id=? AND teach_table.teach_day=? AND teach_table.teach_time > TIME("12:44:59") and teach_table.teach_time < TIME("16:30:00") and teach_table.teach_status="1" AND t_availableroom.room_no IN (SELECT room_no FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1") and t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?'
   
    //ค่ำ
    let setgeneral_evening ='UPDATE teach_table SET room_no=IF(subject_id="01006020","ประชุม-2",IF(subject_id="01006025","ประชุม-1","")) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = ""'
    let stunumsql_evening = 'UPDATE teach_table SET studentnum = IF(teach_table.studentnum = 0 and section = 1,(SELECT sec1 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =2,(SELECT sec2 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =3,(SELECT sec3 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" and studentnum=0'
    let manageroomsql_evening = 'UPDATE teach_table SET room_no =IF((SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE evening="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1)ORDER BY seat_num limit 1) IS NOT NULL, (SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE evening="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.5*(SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num   limit 1),IF((SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE evening="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.5* (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num  limit 1) IS NOT NULL,(SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE evening="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.5* (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1),(SELECT room_no FROM t_room WHERE room_no NOT IN (SELECT room_no FROM t_availableroom WHERE evening="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.5*(SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no NOT IN(SELECT room_no FROM t_room WHERE building_no="7 ชั้น")  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1))) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1'
    let setbuildname_evening = 'UPDATE teach_table ,t_availableroom SET building_no=(SELECT building_no FROM t_room WHERE teach_table.room_no=t_room.room_no) ,evening=1 WHERE teach_table.year =? and teach_table.semester=? and teach_table.curr2_id=? AND teach_table.teach_day=? AND teach_table.teach_time > TIME("16:29:59") and teach_table.teach_status="1" AND t_availableroom.room_no IN (SELECT room_no FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1") and t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?'
    

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

    
    //console.log("row = "+rownum[0].row)
    pool.getConnection(async (err, connection) => {
        if (err) throw err;
        var test
        if(timeperiod=="07:00"){
            connection.query(subject_morning,[semester,curr2_id,teach_day,year],(err, rows) => {
            if (err) throw err;
                console.log(rows[0]);
                rows.forEach(user => {
                    console.log(user.subject_id);
                    //console.log("1")
                    connection.query(subjectoldroom,[user.subject_id,year,semester,curr2_id],  (err, room) => {
                        if(err) throw err;
                        console.log(room[0])
                        room.forEach(rooms => {
                            console.log(rooms.room_no)
                            connection.query(updateoldroom_morning,[rooms.room_no,teach_day,semester,year,rooms.room_no,semester,curr2_id,teach_day,year,user.subject_id,semester,year,teach_day,rooms.room_no],  (err, updatedroom) => {
                                if(err) throw err;
                                //console.log("3")
                                connection.query(setbuildname_morning,[year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day,year,teach_day,semester],  (err, rows) => {
                                    if(err) throw err;
                                });
                            });
                        });
                        //console.log("2")
                    });
                });
            //})
            callback(rows)
            });
        }
        else if(timeperiod=="13:00"){
            connection.query(subject_noon,[semester,curr2_id,teach_day,year],(err, rows) => {
            if (err) throw err;
                console.log(rows[0]);
                rows.forEach(user => {
                    console.log(user.subject_id);
                    //console.log("1")
                    connection.query(subjectoldroom,[user.subject_id,year,semester,curr2_id],  (err, room) => {
                        if(err) throw err;
                        console.log(room[0])
                        room.forEach(rooms => {
                            console.log(rooms.room_no)
                            connection.query(updateoldroom_noon,[rooms.room_no,teach_day,semester,year,rooms.room_no,semester,curr2_id,teach_day,year,user.subject_id,semester,year,teach_day,rooms.room_no],  (err, updatedroom) => {
                                if(err) throw err;
                                //console.log("3")
                                connection.query(setbuildname_noon,[year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day,year,teach_day,semester],  (err, rows) => {
                                    if(err) throw err;
                                });
                            });
                        });
                        //console.log("2")
                    });
                });
            callback(rows)
            });
        }
        else if(timeperiod=="16:30"){
            connection.query(subject_evening,[semester,curr2_id,teach_day,year],(err, rows) => {
            if (err) throw err;
                rows.forEach(user => {
                    console.log(user.subject_id);
                    connection.query(subjectoldroom,[user.subject_id,year,semester,curr2_id],  (err, room) => {
                        if(err) throw err;
                        console.log("2")
                        room.forEach(rooms => {
                            console.log(rooms.room_no)
                            connection.query(updateoldroom_evening,[rooms.room_no,teach_day,semester,year,rooms.room_no,semester,curr2_id,teach_day,year,user.subject_id,semester,year,teach_day,rooms.room_no],  (err, updatedroom) => {
                                if(err) throw err;
                                console.log("3")
                                connection.query(setbuildname_evening,[year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day,year,teach_day,semester],  (err, rows) => {
                                    if(err) throw err;
                                });
                            });
                        });
                    });
                });
            callback(rows)
            });
        }    
        
        

        //console.log('connected as id ' + connection.threadId);
        /*
        do{
        if(timeperiod=="07:00"){
            connection.query(setgeneral_morning,[year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
            connection.query(stunumsql_morning,[year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
            connection.query(manageroomsql_morning,[curr2_id,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,curr2_id,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,year,teach_day,semester,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
            connection.query(setbuildname_morning,[year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day,year,teach_day,semester],  (err, rows) => {
                if(err) throw err;
            });
        }
        else if(timeperiod=="13:00"){
            connection.query(setgeneral_noon,[year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
            connection.query(stunumsql_noon,[year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
            connection.query(manageroomsql_noon,[curr2_id,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,curr2_id,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,year,teach_day,semester,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
            connection.query(setbuildname_noon,[year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day,year,teach_day,semester],  (err, rows) => {
                if(err) throw err;
            });
        }
        else if(timeperiod=="16:30"){
            connection.query(setgeneral_evening,[year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
            connection.query(stunumsql_evening,[year,semester,curr2_id,teach_day],  (err, rows) => {
            });
            connection.query(manageroomsql_evening,[curr2_id,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,curr2_id,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,year,teach_day,semester,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
            connection.query(setbuildname_evening,[year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day,year,teach_day,semester],  (err, rows) => {
                if(err) throw err;
            });
        }
        loopnum++;
        }while(loopnum!=rownum[0].row+1)
        */
        connection.release();
        //callback(rownum[0].row)
        //callback("success");
        
        
    });
    //}}}
}
