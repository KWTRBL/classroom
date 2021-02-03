const pool = require('./dbconfig')
const mysql = require('mysql') // เรียกใช้ mysql
var  connection = mysql.createPool({   // config ค่าการเชื่อมต่อฐานข้อมูล
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'classroom_management',
    multipleStatements: true
})
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


  function setStudentnum(query_stunum,year,semester,curr2_id,teach_day){
    return new Promise(function(resolve,reject){
        pool.query(query_stunum,[year,semester,curr2_id,teach_day],  (err, rows) => {
        if(err){
          reject(err)
            
        }else{
        console.log("set stunem oldroom")
          resolve(rows)
        }
      })
    })
  }

  function getSubject(query_subject,year,semester,curr2_id,teach_day){
    return new Promise(function(resolve,reject){
        pool.query(query_subject,[semester,curr2_id,teach_day,year], async (err, rows) => {
        if(err){
          reject(err)
        }else{
          resolve(rows)
        }
      })
    })
  }

  function getOldroom(query_oldroom,year,semester,curr2_id,subject){
    return new Promise(function(resolve,reject){
        pool.query(query_oldroom,[subject,year,semester,curr2_id], async (err, room) => {
        if(err){
          reject(err)
        }else{
          resolve(room)
        }
      })
    })
  }

  function updateOldroom(query_updateoldroom,year,semester,curr2_id,teach_day,oldroom,subject){
    return new Promise(function(resolve,reject){
        pool.query(query_updateoldroom,[oldroom,teach_day,semester,year,oldroom,oldroom,oldroom,teach_day,semester,year,oldroom,semester,curr2_id,teach_day,year,subject,semester,year,teach_day,oldroom,oldroom], async (err, updatedroom) => {
        if(err){
          reject(err)
        }else{
            console.log("updateoldroom")
          resolve(updatedroom)
        }
      })
    })
  }

  function setBuilding(query_setbuild,year,semester,curr2_id,teach_day){
    return new Promise(function(resolve,reject){
        pool.query(query_setbuild,[year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day,year,teach_day,semester],  (err, rows) => {
        if(err){
          reject(err)
        }else{
          resolve(rows)
        }
      })
    })
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
  let semester = 2
  var curr2_id_array = ["04","63","08","102","110","09","10","74","43","05","07","03","14","122","01","12","67","61","62","11","73","02","107","06","101","100","116","120","108"];
  var teach_day_array = [1,2,3,4,5,6,7];
  var timeperiod_array =["07:00","13:00","16:30"];
  let curr2_id = curr2_id_array[i];
  let teach_day = teach_day_array[j];
  let timeperiod = timeperiod_array[k]; //1=07:00 2=13:00 3=16:30
  let loopnum = 0

  module.exports.read = async function (callback) {
  let year = 2563
  let semester = 2
  let curr2_id = 04;
  let teach_day = 2;
  let timeperiod = "07:00"; //1=07:00 2=13:00 3=16:30
  let loopnum = 0
*/


module.exports.read = async function (req,callback) {
  console.log(req.body.data)
  let year = req.body.data.year
  let semester = req.body.data.semester
  let curr2_id = req.body.data.curr2_id
  let teach_day = req.body.data.teach_day
  let timeperiod = req.body.data.timeperiod //1=morning 2=noon 3=evening
  let loopnum = 0

//ใส่ห้องของปีก่อนหน้า
    let subjectoldroom ='SELECT room_no FROM `teach_table`WHERE subject_id=? AND year=?-1 AND semester=? and curr2_id=? ORDER BY section ASC LIMIT 1'
    //เช้า
    let subject_morning = 'SELECT subject_id FROM teach_table WHERE semester = ? and curr2_id = ? AND teach_day = ? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00")  and teach_status = "1" AND year = ? ORDER BY `teach_table`.`subject_id` ASC'
    let updateoldroom_morning= 'UPDATE teach_table,t_availableroom SET teach_table.room_no=IF(? IN(SELECT room_no FROM t_availableroom WHERE morning=0 and teach_day=? AND semester=? AND year=?) AND ? IN(SELECT room_no FROM t_room WHERE t_room.room_status=1),?,teach_table.room_no) ,morning= IF(? IN(SELECT room_no FROM t_availableroom WHERE morning=0 and teach_day=? AND semester=? AND year=?) AND ? IN(SELECT room_no FROM t_room WHERE t_room.room_status=1),1,morning) WHERE teach_table.semester = ? and teach_table.curr2_id = ? AND teach_table.teach_day = ? AND teach_table.teach_time > TIME("07:00:00") and teach_table.teach_time < TIME("12:45:00")  and teach_table.teach_status = "1" AND teach_table.year = ? AND teach_table.room_no="" AND teach_table.building_no="" AND teach_table.subject_id=? AND t_availableroom.semester=? AND t_availableroom.year=? AND t_availableroom.teach_day=? AND t_availableroom.room_no=? AND (SELECT seat_num FROM t_room WHERE room_no=?)>teach_table.studentnum'
    //บ่าย
    let subject_noon = 'SELECT subject_id FROM teach_table WHERE semester = ? and curr2_id = ? AND teach_day = ? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00")  and teach_status = "1" AND year = ? ORDER BY `teach_table`.`subject_id` ASC'
    let updateoldroom_noon = 'UPDATE teach_table,t_availableroom SET teach_table.room_no=IF(? IN(SELECT room_no FROM t_availableroom WHERE noon=0 and teach_day=? AND semester=? AND year=?) AND ? IN(SELECT room_no FROM t_room WHERE t_room.room_status=1),?,teach_table.room_no) ,noon= IF(? IN(SELECT room_no FROM t_availableroom WHERE noon=0 and teach_day=? AND semester=? AND year=?) AND ? IN(SELECT room_no FROM t_room WHERE t_room.room_status=1),1,noon) WHERE teach_table.semester = ? and teach_table.curr2_id = ? AND teach_table.teach_day = ? AND teach_table.teach_time > TIME("12:44:59") and teach_table.teach_time < TIME("16:30:00") and teach_table.teach_status = "1" AND teach_table.year = ? AND teach_table.room_no="" AND teach_table.building_no="" AND teach_table.subject_id=? AND t_availableroom.semester=? AND t_availableroom.year=? AND t_availableroom.teach_day=? AND t_availableroom.room_no=? AND (SELECT seat_num FROM t_room WHERE room_no=?)>teach_table.studentnum'
    //เย็น
    let subject_evening = 'SELECT subject_id FROM teach_table WHERE semester = ? and curr2_id = ? AND teach_day = ? AND teach_time > TIME("16:29:59") and teach_status = "1" AND year = ? ORDER BY `teach_table`.`subject_id` ASC'
    let updateoldroom_evening = 'UPDATE teach_table,t_availableroom SET teach_table.room_no=IF(? IN(SELECT room_no FROM t_availableroom WHERE evening=0 and teach_day=? AND semester=? AND year=?) AND ? IN(SELECT room_no FROM t_room WHERE t_room.room_status=1),?,teach_table.room_no) ,evening= IF(? IN(SELECT room_no FROM t_availableroom WHERE evening=0 and teach_day=? AND semester=? AND year=?) AND ? IN(SELECT room_no FROM t_room WHERE t_room.room_status=1),1,evening) WHERE teach_table.semester = ? and teach_table.curr2_id = ? AND teach_table.teach_day = ? AND teach_table.teach_time > TIME("16:29:59") and teach_table.teach_status = "1" AND teach_table.year = ? AND teach_table.room_no="" AND teach_table.building_no="" AND teach_table.subject_id=? AND t_availableroom.semester=? AND t_availableroom.year=? AND t_availableroom.teach_day=? AND t_availableroom.room_no=? AND (SELECT seat_num FROM t_room WHERE room_no=?)>teach_table.studentnum'
//จัดห้องปกติ
    let numrow_morning = 'SELECT COUNT(subject_id) as row FROM teach_table WHERE year = ? and semester = ? and curr2_id = ? AND teach_day = ? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status = "1" ORDER BY teach_table.studentnum DESC'
    let numrow_noon = 'SELECT COUNT(subject_id) as row FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" ORDER BY teach_table.studentnum DESC'
    let numrow_evening = 'SELECT COUNT(subject_id) as row FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" ORDER BY teach_table.studentnum DESC'
    //เช้า
    let setgeneral_morning ='UPDATE teach_table SET room_no=IF(subject_id="01006020","ประชุม-2",IF(subject_id="01006025","ประชุม-1","")) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" AND building_no=""'
    let stunumsql_morning = 'UPDATE teach_table SET studentnum = IF(teach_table.studentnum = 0 and section = 1,(SELECT sec1 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =2,(SELECT sec2 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =3,(SELECT sec3 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" AND building_no="" and studentnum=0'
    let manageroomsql_morning = 'UPDATE teach_table SET room_no =IF((SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1)ORDER BY seat_num limit 1) IS NOT NULL, (SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.2*(SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num   limit 1),IF((SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.2* (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num  limit 1) IS NOT NULL,(SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.2* (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1),(SELECT room_no FROM t_room WHERE room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.2*(SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1) AND room_no NOT IN(SELECT room_no FROM t_room WHERE building_no="7 ชั้น")  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1))) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1'
    //ไม่ใช้(w. subject_id) let manageroomsql_morning = await 'UPDATE teach_table SET room_no =IF((SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1)ORDER BY seat_num limit 1) IS NOT NULL, (SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.5*(SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num   limit 1),IF((SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.5* (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num  limit 1) IS NOT NULL,(SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.5* (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1),(SELECT room_no FROM t_room WHERE room_no NOT IN (SELECT room_no FROM t_availableroom WHERE morning="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.5*(SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" ORDER BY teach_table.studentnum DESC limit 1) AND room_no NOT IN(SELECT room_no FROM t_room WHERE building_no="7 ชั้น")  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1))) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1" and room_no = "" and subject_id =? ORDER BY teach_table.studentnum DESC limit 1'
    let setbuildname_morning = 'UPDATE teach_table ,t_availableroom SET building_no=IF((SELECT building_no FROM t_room WHERE teach_table.room_no=t_room.room_no)IS NOT NULL,(SELECT building_no FROM t_room WHERE teach_table.room_no=t_room.room_no),building_no) ,morning=1 WHERE teach_table.year =? and teach_table.semester=? and teach_table.curr2_id=? AND teach_table.teach_day=? AND teach_table.teach_time > TIME("07:00:00") and teach_table.teach_time < TIME("12:45:00") and teach_table.teach_status="1" AND t_availableroom.room_no IN (SELECT room_no FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("07:00:00") and teach_time < TIME("12:45:00") and teach_status="1") and t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?'
    
    //บ่าย
    let setgeneral_noon = 'UPDATE teach_table SET room_no=IF(subject_id="01006020","ประชุม-2",IF(subject_id="01006025","ประชุม-1","")) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" AND building_no=""'
    let stunumsql_noon = 'UPDATE teach_table SET studentnum = IF(teach_table.studentnum = 0 and section = 1,(SELECT sec1 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =2,(SELECT sec2 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =3,(SELECT sec3 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" AND building_no="" and studentnum=0'
    let manageroomsql_noon = 'UPDATE teach_table SET room_no =IF((SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE noon="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1)ORDER BY seat_num limit 1) IS NOT NULL, (SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE noon="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.2*(SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num   limit 1),IF((SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE noon="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.2* (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num  limit 1) IS NOT NULL,(SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE noon="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.2* (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1),(SELECT room_no FROM t_room WHERE room_no NOT IN (SELECT room_no FROM t_availableroom WHERE noon="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.2*(SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1) AND room_no NOT IN(SELECT room_no FROM t_room WHERE building_no="7 ชั้น")  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1))) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1'
    let setbuildname_noon = 'UPDATE teach_table ,t_availableroom SET building_no=IF((SELECT building_no FROM t_room WHERE teach_table.room_no=t_room.room_no)IS NOT NULL,(SELECT building_no FROM t_room WHERE teach_table.room_no=t_room.room_no),building_no),noon=1 WHERE teach_table.year =? and teach_table.semester=? and teach_table.curr2_id=? AND teach_table.teach_day=? AND teach_table.teach_time > TIME("12:44:59") and teach_table.teach_time < TIME("16:30:00") and teach_table.teach_status="1" AND t_availableroom.room_no IN (SELECT room_no FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("12:44:59") and teach_time < TIME("16:30:00") and teach_status="1") and t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?'
   
    //ค่ำ
    let setgeneral_evening ='UPDATE teach_table SET room_no=IF(subject_id="01006020","ประชุม-2",IF(subject_id="01006025","ประชุม-1","")) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" AND building_no=""'
    let stunumsql_evening = 'UPDATE teach_table SET studentnum = IF(teach_table.studentnum = 0 and section = 1,(SELECT sec1 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =2,(SELECT sec2 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum),studentnum = IF(teach_table.studentnum = 0 and section =3,(SELECT sec3 FROM t_section WHERE t_section.curr2_id = teach_table.curr2_id AND teach_table.class=t_section.class),teach_table.studentnum) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" AND building_no="" and studentnum=0'
    let manageroomsql_evening = 'UPDATE teach_table SET room_no =IF((SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE evening="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1)ORDER BY seat_num limit 1) IS NOT NULL, (SELECT room_no FROM t_room WHERE room_floor=(SELECT floor_zone FROM curriculum2 WHERE curr2_id=?) AND building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE evening="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.2*(SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1) AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num   limit 1),IF((SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE evening="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.2* (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num  limit 1) IS NOT NULL,(SELECT room_no FROM t_room WHERE building_no=(SELECT building_zone FROM curriculum2 WHERE curr2_id=?) AND room_no NOT IN (SELECT room_no FROM t_availableroom WHERE evening="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.2* (SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1)  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1),(SELECT room_no FROM t_room WHERE room_no NOT IN (SELECT room_no FROM t_availableroom WHERE evening="1" AND t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?) AND seat_num > 1.2*(SELECT studentnum FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1) AND room_no NOT IN(SELECT room_no FROM t_room WHERE building_no="7 ชั้น")  AND room_no IN (SELECT room_no FROM t_room WHERE room_status=1) ORDER BY seat_num limit 1))) WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1" and room_no = "" AND building_no="" ORDER BY teach_table.studentnum DESC limit 1'
    let setbuildname_evening = 'UPDATE teach_table ,t_availableroom SET building_no=IF((SELECT building_no FROM t_room WHERE teach_table.room_no=t_room.room_no)IS NOT NULL,(SELECT building_no FROM t_room WHERE teach_table.room_no=t_room.room_no),building_no) ,evening=1 WHERE teach_table.year =? and teach_table.semester=? and teach_table.curr2_id=? AND teach_table.teach_day=? AND teach_table.teach_time > TIME("16:29:59") and teach_table.teach_status="1" AND t_availableroom.room_no IN (SELECT room_no FROM teach_table WHERE year =? and semester=? and curr2_id=? AND teach_day=? AND teach_time > TIME("16:29:59") and teach_status="1") and t_availableroom.year =? and t_availableroom.teach_day =? and t_availableroom.semester=?'
    

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

    if(timeperiod=="07:00"){
        await setStudentnum(stunumsql_morning,year,semester,curr2_id,teach_day)
        var subjectRow = await getSubject(subject_morning,year,semester,curr2_id,teach_day)
        var Oldroomlist = []
        var  OldroomData = await subjectRow.map(async(data,index) =>{
            var room = await getOldroom(subjectoldroom,year,semester,curr2_id,data.subject_id)
            //console.log(room[0].room_no)
            if(room.length){
                await updateOldroom(updateoldroom_morning,year,semester,curr2_id,teach_day,room[0].room_no,data.subject_id)
                await setBuilding(setbuildname_morning,year,semester,curr2_id,teach_day)
            }
        })
    }
    else if(timeperiod=="13:00"){
        await setStudentnum(stunumsql_noon,year,semester,curr2_id,teach_day)
        var subjectRow = await getSubject(subject_noon,year,semester,curr2_id,teach_day)
        var Oldroomlist = []
        var  OldroomData = await subjectRow.map(async(data,index) =>{
            var room = await getOldroom(subjectoldroom,year,semester,curr2_id,data.subject_id)
            //console.log(room[0].room_no)
            if(room.length){
                await updateOldroom(updateoldroom_noon,year,semester,curr2_id,teach_day,room[0].room_no,data.subject_id)
                await setBuilding(setbuildname_noon,year,semester,curr2_id,teach_day)
            }
        })
    }
    else if(timeperiod=="16:30"){
        await setStudentnum(stunumsql_evening,year,semester,curr2_id,teach_day)
        var subjectRow = await getSubject(subject_evening,year,semester,curr2_id,teach_day)
        var Oldroomlist = []
        var  OldroomData = await subjectRow.map(async(data,index) =>{
            var room = await getOldroom(subjectoldroom,year,semester,curr2_id,data.subject_id)
            //console.log(room[0].room_no)
            if(room.length){
                await updateOldroom(updateoldroom_evening,year,semester,curr2_id,teach_day,room[0].room_no,data.subject_id)
                await setBuilding(setbuildname_evening,year,semester,curr2_id,teach_day)
            }
        })
    }

    pool.getConnection(async (err, connection) => {
        if (err) throw err;
        var test
        do{
        if(timeperiod=="07:00"){
            await connection.query(setgeneral_morning,[year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
                console.log("set genphy genchem")
            });
            await connection.query(manageroomsql_morning,[curr2_id,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,curr2_id,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,year,teach_day,semester,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
                console.log("manage room auto")
            });
            await connection.query(setbuildname_morning,[year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day,year,teach_day,semester],  (err, rows) => {
                if(err) throw err;
                console.log("set building name")
            });
        }
        else if(timeperiod=="13:00"){
            connection.query(setgeneral_noon,[year,semester,curr2_id,teach_day],  (err, rows) => {
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
            connection.query(manageroomsql_evening,[curr2_id,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,curr2_id,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,curr2_id,year,teach_day,semester,year,semester,curr2_id,teach_day,year,teach_day,semester,year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day],  (err, rows) => {
                if(err) throw err;
            });
            connection.query(setbuildname_evening,[year,semester,curr2_id,teach_day,year,semester,curr2_id,teach_day,year,teach_day,semester],  (err, rows) => {
                if(err) throw err;
            });
        }
        loopnum++;
        }while(loopnum!=rownum[0].row+1)
        
        connection.release();
        //callback(rownum[0].row)
        callback("success");
        
        
    });
    //}}}
}