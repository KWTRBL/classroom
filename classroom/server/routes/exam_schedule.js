const pool = require("./dbconfig");

function countNumExam(query_subject, year, semester, mid_or_final) {
  return new Promise(function (resolve, reject) {
    pool.query(
      query_subject,
      [year, semester, mid_or_final],
      async (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

function getdataFromSql(query) {
  return new Promise(function (resolve, reject) {
    pool.query(query, async (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  // console.log(index)
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

Date.prototype.addDays = function (days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
};

function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push([currentDate, "1"]);
    dateArray.push([currentDate, "2"]);
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports.ownsubject = async function (callback) {
  //   var year = req.body.year;
  //   var semester = req.body.semester;
  //   var mid_or_final = req.body.mid_or_final;
  // var faculty_id = req.body.faculty_id;
  var year = 2562;
  var semester = 1;
  var mid_or_final = "F";
  var faculty_id = "05";
  var returndata = null;
  //คำนวนจำนวนครั้งที่แต่ละคนต้องคุม

  // var facultylist = []
  // for (let i = 1; i < 30; i++) {
  //   facultylist.push(i < 10 ?`0${i}`:i.toString())

  // }

  // for (let faculty_index = 0; faculty_index < facultylist.length; faculty_index++) {
  //   const faculty_id = facultylist[faculty_index];

  var NumExam = await countNumExam(
    `SELECT ceiling (((select sum(sumstdnum.countstdnum) FROM (SELECT ceiling(IF(sum(std_num)/30 < 2,2, sum(std_num)/30))as countstdnum from t_exam_room where t_exam_room.year = ? and t_exam_room.semester = ? and t_exam_room.mid_or_final = ? GROUP BY exam_date,exam_time,room_no ) as sumstdnum) -(SELECT count(*) from t_condition where condition_status = 2) )/ ( (SELECT count(*) from t_condition) - (SELECT count(*) from t_condition where condition_status = 2) - (SELECT count(*) from t_condition where condition_status = 0)) )as result`,
    year,
    semester,
    mid_or_final
  );
  // console.log(NumExam[0].result);
  count = Math.floor(NumExam[0].result);
  // console.log('facultyid' ,faculty_id)
  console.log("numexam: ", count);
  // query ข้อมูลอาจารย์ตาม filter
  var condition_result = await getdataFromSql(
    `SELECT * FROM t_condition where condition_status != 0 and person_type = '1' and faculty_id = '${faculty_id}' and own_subject != 0`
  );

  console.log("teacher num : ", condition_result.length);
  daysInWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // query วันที่สอบ
  var examweek = await getdataFromSql(
    `SELECT * FROM t_exam_week WHERE year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}'  `
  );

  //เก็บข้อมูลวันที่สอบ
  var examweekdata = examweek[0];
  var Examweeklist = [];
  Examweeklist[0] = examweekdata.week1_start;
  Examweeklist[1] = examweekdata.week1_end;
  Examweeklist[2] = examweekdata.week2_start;
  Examweeklist[3] = examweekdata.week2_end;
  Examweeklist[4] = examweekdata.week3_start;
  Examweeklist[5] = examweekdata.week3_end;
  Examweeklist[6] = examweekdata.week4_start;
  Examweeklist[7] = examweekdata.week4_end;

  //เก็บวันสอบ
  var Examdaylist = [];
  for (let i = 0; i < Examweeklist.length / 2; i++) {
    var dateArray = getDates(
      new Date(Examweeklist[2 * i]),
      new Date(Examweeklist[2 * i + 1])
    );
    if (dateArray.length == 0) {
      Examdaylist.push([]);
    } else {
      Examdaylist.push(dateArray);
    }
  }

  var backupExamdaylist = JSON.parse(JSON.stringify(Examdaylist));

  dayInweekExam = [];
  Examdaylist.map((data, index) => {
    var daylist = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      // console.log("element : ", element);
      var day = new Date(element[0]);
      daylist.push([daysInWeek[day.getDay()], element[1]]);
    }
    // console.log(daylist);

    dayInweekExam.push(daylist);
  });

  //for แยกจารย์
  for (let index = 0; index < condition_result.length; index++) {
    const teacherdata = condition_result[index];

    // console.log("teacher_id : ", teacherdata.person_id);
    //query วิชาที่สอน
    var subjectList = await getdataFromSql(
      `SELECT t_exam_room.year,t_exam_room.semester,t_exam_room.mid_or_final,t_exam_room.exam_date,t_exam_room.exam_time,t_exam_room.building_no,t_exam_room.room_no,t_exam_room.subject_id,t_exam_room.section ,teacher_teach.teacher_id,t_exam_room.faculty_id  ,teacher_teach.section as t_section FROM t_exam_room, teacher_teach 
      where t_exam_room.subject_id = teacher_teach.subject_id and t_exam_room.section = teacher_teach.section and t_exam_room.year = teacher_teach.year and t_exam_room.semester = teacher_teach.semester 
      and t_exam_room.mid_or_final = "${mid_or_final}" and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and teacher_teach.teacher_id = ${teacherdata.person_id} and teacher_teach.lect_or_prac = 'ท' `
    );

    if (!subjectList.length) {
      continue;
    }

    //หาวันที่ไม่ว่าง
    var notfreedayinweek = [];
    notfreedayinweek[0] =
      teacherdata.freetime_week1 != "" ?
      teacherdata.freetime_week1.split(",") :
      null;
    notfreedayinweek[1] =
      teacherdata.freetime_week2 != "" ?
      teacherdata.freetime_week2.split(",") :
      null;
    notfreedayinweek[2] =
      teacherdata.freetime_week3 != "" ?
      teacherdata.freetime_week3.split(",") :
      null;
    notfreedayinweek[3] =
      teacherdata.freetime_week4 != "" ?
      teacherdata.freetime_week4.split(",") :
      null;

    var notfreedayindex = [];

    //for ตาม จำนวน week
    for (let index = 0; index < 4; index++) {
      //get วันในสัปดาห์สอบ จ - อา
      const dayInweekExamdata = dayInweekExam[index];
      const examdayweek = Examdaylist[index];

      //รับค่าวันที่ไม่ว่าง ex. [2x1,3x2]
      const notfreedayinweekdata = notfreedayinweek[index];
      //check ว่าถ้าไม่มีค่า notfreeday ให้ skip
      if (notfreedayinweekdata == null || dayInweekExamdata == []) {
        notfreedayindex.push([]);
        continue;
      }

      var indexlist = []; //เก็บวันที่ไม่ว่าง ทีละวัน  notfreedayindex เก็บเป็นสัปดาห์ [indexlistweek1,indexlistweek2]
      //for ตามวันในสัปดาห์สอบ
      for (let dayindex = 0; dayindex < dayInweekExamdata.length; dayindex++) {
        const examday = dayInweekExamdata[dayindex];

        // for ตามวันที่ไม่ว่าง

        for (
          let notfreeindex = 0; notfreeindex < notfreedayinweekdata.length; notfreeindex++
        ) {
          const notfreeday = notfreedayinweekdata[notfreeindex].split("x"); //[2,1]

          if (
            daysInWeek[notfreeday[0]] == examday[0] &&
            notfreeday[1] == examday[1]
          ) {
            // indexlist.push(examday);
            indexlist.push(examdayweek[dayindex]);
          }
        }
      }
      if (indexlist.length > 0) {
        notfreedayindex.push(indexlist);
      }
      if (indexlist.length == 0) {
        notfreedayindex.push([]);
      }
    }

    for (let index = 0; index < 4; index++) {
      const Examdaylistdata = Examdaylist[index];
      const notfreedayweek = notfreedayindex[index];
      for (let count = 0; count < notfreedayweek.length; count++) {
        let index = notfreedayweek[count];
        removeItemOnce(Examdaylistdata, index);
      }
    }

    //รวมวันที่ว่างคุม
    var Day = [];
    Day.push(
      ...Examdaylist[0],
      ...Examdaylist[1],
      ...Examdaylist[2],
      ...Examdaylist[3]
    );

    //รับข้อมูลว่าคุมสอบเวลาใดไปแล้วบ้าง
    var t_exam_committee = await getdataFromSql(
      `SELECT * FROM t_exam_committee where year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}' and faculty_id = '${faculty_id}' and person_type = '1' and person_id = '${teacherdata.person_id}' `
    );

    // เช็คว่าจารย์คนนั้นคุมวันไหนไปแล้วบ้าง
    var examlist = [];
    for (let index = 0; index < t_exam_committee.length; index++) {
      const element = t_exam_committee[index];
      for (let dayindex = 0; dayindex < Day.length; dayindex++) {
        const daydata = Day[dayindex];
        const newday = new Date(daydata[0]);
        if (
          newday.getTime() === element.exam_date.getTime() &&
          daydata[1] == element.exam_time
        ) {
          examlist.push(daydata);
        }
      }
    }

    // เอาวันที่คุมไปแล้วออก
    for (let index = 0; index < examlist.length; index++) {
      const element = examlist[index];
      removeItemOnce(Day, element);
    }

    if (teacherdata.person_id == "11222" || teacherdata.person_id == "11209") {
      console.log("teacher id :", teacherdata.person_id);
      console.log(subjectList);
    }

    //เก็บข้อมูลวิชาที่มีคนคุมไปแล้ว
    var subjectExam = [];
    for (
      let subjectindex = 0; subjectindex < subjectList.length; subjectindex++
    ) {
      const subjectdata = subjectList[subjectindex];

      // const mySQLDateString = subjectdata.exam_date

      const mySQLDateString = subjectdata.exam_date
        .toJSON()
        .slice(0, 19)
        .replace("T", " ");

      var t_exam_committee = await getdataFromSql(
        `SELECT * FROM t_exam_committee WHERE year = ${subjectdata.year} and semester = ${subjectdata.semester} and mid_or_final = '${subjectdata.mid_or_final}' and person_type = '1' and building_no = '${subjectdata.building_no}' and room_no = '${subjectdata.room_no}' and exam_date = '${mySQLDateString}' and exam_time = '${subjectdata.exam_time}' and subject_id = '${subjectdata.subject_id}' and room_no = '${subjectdata.room_no}' `
      );

      //มีวิชาอยู่ในจัดคุมแล้ว

      //ทำถึงตรงนี้
      if (t_exam_committee.length) {
        if (
          teacherdata.person_id == "11222" ||
          teacherdata.person_id == "11209"
        ) {
          console.log(
            "teacher id :",
            teacherdata.person_id,
            subjectList.length
          );
          console.log(subjectList);
        }
        removeItemOnce(subjectList, subjectdata);
        if (
          teacherdata.person_id == "11222" ||
          teacherdata.person_id == "11209"
        ) {
          console.log(
            "teacher id :",
            teacherdata.person_id,
            subjectList.length
          );
          console.log(subjectList);
        }
      }
    }

    // if (teacherdata.person_id == "90409" || teacherdata.person_id == "90410") {
    //   // console.log('teacherid : ',teacherdata.person_id)
    //   console.log(subjectList);
    // }

    var teachercount = 0;
    // console.log("condition_status ", teacherdata.condition_status);
    for (let index = 0; index < count; index++) {
      if (teacherdata.condition_status == 2 && teachercount == 1) {
        // console.log("break");
        break;
      }

      if (subjectList.length == 0) {
        await getdataFromSql(`
        UPDATE t_condition
        SET mark = ${count - teachercount},markcount= ${teachercount}
        WHERE person_id = '${teacherdata.person_id}'`);
        break;
      }
      const random = Math.floor(Math.random() * subjectList.length);
      const subject = subjectList[random];
      const subjectday = subject.exam_date;

      var exam_time = subject.exam_time;

      for (let dayindex = 0; dayindex < Day.length + 1; dayindex++) {
        //check case ที่มันไม่ตรงวันเลย
        if (Day.length == dayindex) {
          removeItemOnce(subjectList, subject);
          index--;
          break;
        }
        const daydata = Day[dayindex];
        var convertday = new Date(daydata[0]);
        if (
          subjectday.getTime() == convertday.getTime() &&
          exam_time == daydata[1]
        ) {
          const mySQLDateString = subjectday
            .toJSON()
            .slice(0, 19)
            .replace("T", " ");

          // อัพเดทข้อมูลลง DB

          await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
          VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${subject.teacher_id}','${faculty_id}','${subject.subject_id}');
          `);

          teachercount += 1;
          await getdataFromSql(`
          UPDATE t_condition
          SET mark = ${count - teachercount},markcount= ${teachercount}
          WHERE person_id = '${teacherdata.person_id}'`);

          // console.log(teachercount);
          removeItemOnce(subjectList, subject);
          removeItemOnce(Day, daydata);
          break;
        }
      }
    }
    //เอาข้อมูลวันที่มีสอบมาใส่ใหม่
    var Examdaylist = JSON.parse(JSON.stringify(backupExamdaylist));

    //เช็ควันว่าง จาก conditionresult
  }

  callback(returndata);
};

module.exports.othersubject = async function (callback) {
  //   var year = req.body.year;
  //   var semester = req.body.semester;
  //   var mid_or_final = req.body.mid_or_final;
  // var faculty_id = req.body.faculty_id;
  var year = 2562;
  var semester = 1;
  var mid_or_final = "F";
  var faculty_id = "05";

  // query ข้อมูลอาจารย์ตาม filter
  var teacher_list = await getdataFromSql(
    `SELECT * FROM t_condition where condition_status != 0  and faculty_id = '${faculty_id}' `
  );

  // query วันที่สอบ
  var examweek = await getdataFromSql(
    `SELECT * FROM t_exam_week WHERE year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}'  `
  );

  //เก็บข้อมูลวันที่สอบ
  var examweekdata = examweek[0];
  var Examweeklist = [];
  Examweeklist[0] = examweekdata.week1_start;
  Examweeklist[1] = examweekdata.week1_end;
  Examweeklist[2] = examweekdata.week2_start;
  Examweeklist[3] = examweekdata.week2_end;
  Examweeklist[4] = examweekdata.week3_start;
  Examweeklist[5] = examweekdata.week3_end;
  Examweeklist[6] = examweekdata.week4_start;
  Examweeklist[7] = examweekdata.week4_end;

  //เก็บวันสอบแยกเป็นแต่ละ week ex. [[day1,day2],[],[],[]]
  var Examdaylist = [];

  for (let i = 0; i < Examweeklist.length / 2; i++) {
    var dateArray = getDates(
      new Date(Examweeklist[2 * i]),
      new Date(Examweeklist[2 * i + 1])
    );
    if (dateArray.length == 0) {
      Examdaylist.push([]);
    } else {
      Examdaylist.push(dateArray);
    }
  }

  var backupExamdaylist = JSON.parse(JSON.stringify(Examdaylist));

  //แปลงวันใน edamday ให้อยู่ในรูป daysInWeek
  daysInWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  dayInweekExam = [];
  Examdaylist.map((data, index) => {
    var daylist = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      // console.log("element : ", element);
      var day = new Date(element[0]);
      daylist.push([daysInWeek[day.getDay()], element[1]]);
    }
    // console.log(daylist);

    dayInweekExam.push(daylist);
  });

  // console.log(Examdaylist);
  // console.log(dayInweekExam);

  // for ตามจารย์
  for (
    let teacherindex = 0; teacherindex < teacher_list.length; teacherindex++
  ) {


    // list ข้อมูล teacher ออกมา
    const teacherdata = teacher_list[teacherindex];

    //เอาชื่อวิชาทั้งหมดที่ยังไม่คุมมา
    var subjectList = await getdataFromSql(
      `SELECT t_exam_room.* FROM t_exam_room left JOIN t_exam_committee on t_exam_room.year = t_exam_committee.year and t_exam_room.semester = t_exam_committee.semester and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_room.building_no = t_exam_committee.building_no AND t_exam_room.room_no = t_exam_committee.room_no WHERE t_exam_committee.year is null and t_exam_committee.semester is null and t_exam_committee.mid_or_final is null and t_exam_committee.exam_date is null and t_exam_committee.exam_time is null and t_exam_committee.subject_id is null and t_exam_committee.building_no is null AND t_exam_committee.room_no is null`
    );

    if (!subjectList.length) {
      break;
    }

    //เช็ค condition week
    var conditionweek = teacherdata.condition_week;
    if (conditionweek != 0) {
      for (let index = 0; index < 4; index++) {
        if (conditionweek != index - 1) {
          Examdaylist[index] = [];
          dayInweekExam[index] = [];
        }
      }
    }


    //เช็คช่วงเวลา กรณี เช้า หรือ บ่าย
    if (teacherdata.condition_time == 0 || teacherdata.condition_time == 1) {
      for (let index = 0; index < 4; index++) {
        var examdayarray = Examdaylist[index];
        var dayInweekExamarray = Examdaylist[index];
        if (examdayarray.length == 0 || dayInweekExamarray.length == 0) {
          continue;
        }
        for (let dayindex = 0; dayindex < examdayarray.length; dayindex++) {
          let examday = examdayarray[dayindex];
          let dayinweekdata = dayInweekExamarray[dayindex];
          if (examday[1] == teacherdata.condition_time - 1) {
            removeItemOnce(examdayarray, examday);
            removeItemOnce(dayInweekExamarray, dayinweekdata);
          }
        }
      }
    }

    //case condition time เช้าบ่ายวันเดียวกัน เหลือเอาไปใช้กับ การจัดจริงๆ
    var timelist = [];
    if (teacherdata.condition_time == 2) {
      let exam_committeedata = await getdataFromSql(
        `select exam_date,exam_time from t_exam_committee where persion_id = ${teacherdata.person_ids}  and year = ${year} and semester = ${semester} and mid_or_final = ${mid_or_final}`
      );
      if (exam_committeedata.length > 0) {
        for (let index = 0; index < exam_committeedata.length; index++) {
          const element = exam_committeedata[index];
          let daylist = await getdataFromSql(
            `select * from t_exam_committee where examdate = ${element.exam_date} and person_id = ${teacherdata.person_id}`
          );
          if (daylist.length > 1) {
            timelist.push(
              element.exam_time == 1 ? [element.exam_date, "2"] : [element.exam_date, "1"]
            );
          }
        }
      }
    }



    //เช็ค t_examcommittee
    // var exam_committee = await getdataFromSql(`
    //  SELECT * FROM t_exam_committee where person_id = ${teacherdata.person_id}
    // `);

    // if (exam_committee.length) {
    //   for (let index = 0; index < exam_committee.length; index++) {
    //     var examdata = exam_committee[index];
    //     for (let indexdata = 0; indexdata < 4; indexdata++) {
    //       let examdayarray = Examdaylist[indexdata];
    //       let dayInweekExamarray = Examdaylist[indexdata];
    //       if (examdayarray.length == 0 || dayInweekExamarray.length == 0) {
    //         continue;
    //       }
    //       for (let dayindex = 0; dayindex < examdayarray.length; dayindex++) {
    //         let examday = examdayarray[dayindex];
    //         let dayinweekdata = dayInweekExamarray[dayindex];
    //         var day = new Date(examday[0]);
    //         if (
    //           day.getTime() === examday.exam_date.getTime() &&
    //           dayinweekdata[1] == element.exam_time
    //         ) {
    //           removeItemOnce(examdayarray, examday);
    //           removeItemOnce(dayInweekExamarray, dayinweekdata);
    //         }
    //       }
    //     }
    //   }
    // }

    //case ไม่คุมวิชาตัวเอง
    if (teacherdata.ownsubject == 0) {
      var teacher_subject = await getdataFromSql(`
      SELECT t_exam_room.year,t_exam_room.semester,t_exam_room.mid_or_final,t_exam_room.exam_date,t_exam_room.exam_time,t_exam_room.building_no,t_exam_room.room_no,t_exam_room.subject_id,t_exam_room.section ,teacher_teach.teacher_id,t_exam_room.faculty_id  ,teacher_teach.section as t_section FROM t_exam_room, teacher_teach 
        where t_exam_room.subject_id = teacher_teach.subject_id and t_exam_room.section = teacher_teach.section and t_exam_room.year = teacher_teach.year and t_exam_room.semester = teacher_teach.semester 
        and t_exam_room.mid_or_final = "${mid_or_final}" and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and teacher_teach.teacher_id = ${teacherdata.person_id} and teacher_teach.lect_or_prac = 'ท' 
      `);
      if (teacher_subject.length) {
        for (let index = 0; index < teacher_subject.length; index++) {
          const subject = teacher_subject[index];
          for (
            let subjectListindex = 0; subjectListindex < subjectList.length; subjectListindex++
          ) {
            const subjectlistdata = subjectList[subjectListindex];
            // if(subjectlistdata.exam_date.getTime() === subject.exam_date.getTime() && subjectlistdata.exam_time == subject.exam_time && subject.room_no == subjectlistdata.room_no && subject.subject_id == subjectlistdata.subject_id){
            if (subject.subject_id == subjectlistdata.subject_id) {
              removeItemOnce(subjectList, subjectlistdata);
              subjectListindex--;
            }
          }
        }
      }
    }

    //เช็ค condition weekend
    var conditionweekend = teacherdata.condition_weekend;
    var weekenddayweekist = [];

    //case ไม่คุมสุดสัปดาห์
    if (conditionweekend == 0) {
      for (let index = 0; index < 4; index++) {
        var examdayarray = Examdaylist[index];
        var dayInweekExamarray = Examdaylist[index];
        if (examdayarray.length == 0 || dayInweekExamarray.length == 0) {
          continue;
        }
        for (let dayindex = 0; dayindex < examdayarray.length; dayindex++) {
          let examday = examdayarray[dayindex];
          let dayinweekdata = dayInweekExamarray[dayindex];
          var day = new Date(examday[0]);
          if (
            daysInWeek[day.getDay()] == "Saturday" ||
            daysInWeek[day.getDay()] == "Sunday"
          ) {
            removeItemOnce(examdayarray, examday);
            removeItemOnce(dayInweekExamarray, dayinweekdata);
          }
        }
      }
    }

    //หาวันที่ไม่ว่าง
    var notfreedayinweek = [];
    notfreedayinweek[0] =
      teacherdata.freetime_week1 != "" ?
      teacherdata.freetime_week1.split(",") :
      null;
    notfreedayinweek[1] =
      teacherdata.freetime_week2 != "" ?
      teacherdata.freetime_week2.split(",") :
      null;
    notfreedayinweek[2] =
      teacherdata.freetime_week3 != "" ?
      teacherdata.freetime_week3.split(",") :
      null;
    notfreedayinweek[3] =
      teacherdata.freetime_week4 != "" ?
      teacherdata.freetime_week4.split(",") :
      null;

    var notfreedayindex = [];

    //for ตาม จำนวน week
    for (let index = 0; index < 4; index++) {

      //get วันในสัปดาห์สอบ จ - อา
      const dayInweekExamdata = dayInweekExam[index];
      const examdayweek = Examdaylist[index];

      //รับค่าวันที่ไม่ว่าง ex. [2x1,3x2]
      const notfreedayinweekdata = notfreedayinweek[index];
      //check ว่าถ้าไม่มีค่า notfreeday ให้ skip
      if (notfreedayinweekdata == null || dayInweekExamdata == []) {
        notfreedayindex.push([]);
        continue;
      }

      var indexlist = []; //เก็บวันที่ไม่ว่าง ทีละวัน  notfreedayindex เก็บเป็นสัปดาห์ [indexlistweek1,indexlistweek2]
      //for ตามวันในสัปดาห์สอบ
      for (let dayindex = 0; dayindex < dayInweekExamdata.length; dayindex++) {
        const examday = dayInweekExamdata[dayindex];

        // for ตามวันที่ไม่ว่าง

        for (
          let notfreeindex = 0; notfreeindex < notfreedayinweekdata.length; notfreeindex++
        ) {
          const notfreeday = notfreedayinweekdata[notfreeindex].split("x"); //[2,1]

          if (
            daysInWeek[notfreeday[0]] == examday[0] &&
            notfreeday[1] == examday[1]
          ) {
            // indexlist.push(examday);
            indexlist.push(examdayweek[dayindex]);
          }
        }
      }
      if (indexlist.length > 0) {
        notfreedayindex.push(indexlist);
      }
      if (indexlist.length == 0) {
        notfreedayindex.push([]);
      }
    }

    for (let index = 0; index < 4; index++) {
      const Examdaylistdata = Examdaylist[index];
      const notfreedayweek = notfreedayindex[index];
      for (let count = 0; count < notfreedayweek.length; count++) {
        let index = notfreedayweek[count];
        removeItemOnce(Examdaylistdata, index);
      }
    }

    //รวมวันที่ว่างคุม
    var Day = [];
    Day.push(
      ...Examdaylist[0],
      ...Examdaylist[1],
      ...Examdaylist[2],
      ...Examdaylist[3]
    );


    //รับข้อมูลว่าคุมสอบเวลาใดไปแล้วบ้าง
    var t_exam_committee = await getdataFromSql(
      `SELECT * FROM t_exam_committee where year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}' and faculty_id = '${faculty_id}' and person_id = '${teacherdata.person_id}' `
    );

    // เช็คว่าจารย์คนนั้นคุมวันไหนไปแล้วบ้าง
    var examlist = [];
    for (let index = 0; index < t_exam_committee.length; index++) {
      const element = t_exam_committee[index];
      for (let dayindex = 0; dayindex < Day.length; dayindex++) {
        const daydata = Day[dayindex];
        const newday = new Date(daydata[0]);
        if (
          newday.getTime() === element.exam_date.getTime() &&
          daydata[1] == element.exam_time
        ) {
          examlist.push(daydata);
        }
      }
    }

    // เอาวันที่คุมไปแล้วออก
    for (let index = 0; index < examlist.length; index++) {
      const element = examlist[index];
      removeItemOnce(Day, element);
    }


    //case สุดสัปดาห์
    if (conditionweekend == 1) {
      for (let index = 0; index < dayInweekExam.length; index++) {
        let daylist = [];
        let dayInweekExamdata = dayInweekExam[index];
        if (dayInweekExamdata.length == 0) {
          continue;
        }
        for (
          let dayindex = 0; dayindex < dayInweekExamdata.length; dayindex++
        ) {
          var daydata = Examdaylist[index][dayindex];
          const element = dayInweekExamdata[dayindex];
          if (element[0] == "Saturday" || element[0] == "Sunday") {
            daylist.push(daydata);
          }
        }
        weekenddayweekist.push(daylist);
      }
    }

    var weekenddaylist = [
      ...weekenddayweekist[0],
      ...weekenddayweekist[1],
      ...weekenddayweekist[2],
      ...weekenddayweekist[3],
    ];

    //จัดผู้คุม
    for (let index = 0; index < teacherdata.mark; index++) {


      // ถ้า weekend มี
      if (conditionweekend == 1) {
        shuffle(subjectList);
        shuffle(weekenddaylist);
        // list วิชามา
        for (let subjectindex = 0; subjectindex < subjectList.length; subjectindex++) {
          let subject = subjectList[subjectindex];
          var checkday = false
          //list day มา 
          for (let dayindex = 0; dayindex < Day.length; dayindex++) {
            const element = Day[dayindex];

            //check ว่าวันสุดสัปดาห์มั้ย และเวลาสอบตรงกันหรือป่าว
            if ((element[0].getDay() == 0 || element[0].getDay() == 6) && element[0].getTime() === subject.exam_date.getTime() && element[1] == subject.exam_time) {
              //เงื่อนไขเวลา case เช้าบ่ายในวันเดียวกัน ถ้าเจอวันสุดสัปดาห์
              if (teacherdata.condition_time == 2) {
                let exam_committeedata = await getdataFromSql(
                  `select distinct exam_date from t_exam_committee where persion_id = ${teacherdata.person_id}  and year = ${year} and semester = ${semester} and mid_or_final = ${mid_or_final}`
                );
                //เคยคุมแล้ว
                if (exam_committeedata.length > 0) {
                  // list วันที่คุมมา
                  for (let index = 0; index < exam_committeedata.length; index++) {

                    const data = exam_committeedata[index];
                    let daylist = await getdataFromSql(
                      `select * from t_exam_committee where examdate = ${data.exam_date} and person_id = ${teacherdata.person_id}`
                    );

                    // กรณีที่คุมแค่เวลาเดียว
                    if (daylist.length == 1) {
                      let day = new Date(daylist[0].exam_date)
                      //check ว่าเจอวันตรงกันมั้ย
                      if (element[0].getTime() === day.getTime() && daylist[0].exam_time != element.exam_time) {
                        checkday = true
                        break
                      }
                    }
                  }
                } else { //ยังไม่เคยคุม
                  let subjectday = subject.exam_date
                  const mySQLDateString = subjectday
                    .toJSON()
                    .slice(0, 19)
                    .replace("T", " ");
                  await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
                  VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${subject.teacher_id}','${faculty_id}','${subject.subject_id}');
                  `);
                  await getdataFromSql(`
                  UPDATE t_condition
                  SET mark = ${count - teachercount},markcount= ${teachercount}
                  WHERE person_id = '${teacherdata.person_id}'`);

                  removeItemOnce(subjectList, subject);
                  removeItemOnce(Day, element);
                }
              }
            }
            if (checkday == true) {
              let subjectday = subject.exam_date
              const mySQLDateString = subjectday
                .toJSON()
                .slice(0, 19)
                .replace("T", " ");
              await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
              VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${subject.teacher_id}','${faculty_id}','${subject.subject_id}');
              `);
              await getdataFromSql(`
              UPDATE t_condition
              SET mark = ${count - teachercount},markcount= ${teachercount}
              WHERE person_id = '${teacherdata.person_id}'`);

              removeItemOnce(subjectList, subject);
              removeItemOnce(Day, element);
              break
            }
          }
          if (checkday == true) {
            break
          }
        }


        // let randomindex = Math.floor(Math.random() * subjectList.length);
        // let randomsubject = subjectList[randomindex]
      } else {
        shuffle(subjectList);
        for (let index = 0; index < subjectList.length; index++) {
          const subject = subjectList[index];

          if (teacherdata.condition_time != 2) {
            //case เวลาไรก็ได้
            let checkdata = false
            for (let dayindex = 0; dayindex < Day.length; dayindex++) {
              let daydata = Day[dayindex];
              if (daydata[0].getTime() === subject.exam_date.getTime() && subject.exam_time == daydata[1]) {
                await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
              VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${subject.teacher_id}','${faculty_id}','${subject.subject_id}');
              `);
                await getdataFromSql(`
              UPDATE t_condition
              SET mark = ${count - teachercount},markcount= ${teachercount}
              WHERE person_id = '${teacherdata.person_id}'`);
                // console.log(teachercount);
                removeItemOnce(subjectList, subject);
                removeItemOnce(Day, daydata);
                break
              }
            }
            if (checkdata == true) {
              break
            }
          } else {
              shuffle(subjectList);
              // list วิชามา
              for (let subjectindex = 0; subjectindex < subjectList.length; subjectindex++) {
                let subject = subjectList[subjectindex];
                var checkday = false
                //list day มา 
                for (let dayindex = 0; dayindex < Day.length; dayindex++) {
                  const element = Day[dayindex];
                  //เงื่อนไขเวลา case เช้าบ่ายในวันเดียวกัน ถ้าเจอวันสุดสัปดาห์
                  if (teacherdata.condition_time == 2) {
                    let exam_committeedata = await getdataFromSql(
                      `select distinct exam_date from t_exam_committee where persion_id = ${teacherdata.person_id}  and year = ${year} and semester = ${semester} and mid_or_final = ${mid_or_final}`
                    );
                    //เคยคุมแล้ว
                    if (exam_committeedata.length > 0) {
                      // list วันที่คุมมา
                      for (let index = 0; index < exam_committeedata.length; index++) {

                        const data = exam_committeedata[index];
                        let daylist = await getdataFromSql(
                          `select * from t_exam_committee where examdate = ${data.exam_date} and person_id = ${teacherdata.person_id}`
                        );

                        // กรณีที่คุมแค่เวลาเดียว
                        if (daylist.length == 1) {
                          let day = new Date(daylist[0].exam_date)
                          //check ว่าเจอวันตรงกันมั้ย
                          if (element[0].getTime() === day.getTime() && daylist[0].exam_time != element.exam_time) {
                            checkday = true
                            break
                          }
                        }
                      }
                    } else { //ยังไม่เคยคุม
                      let subjectday = subject.exam_date
                      const mySQLDateString = subjectday
                        .toJSON()
                        .slice(0, 19)
                        .replace("T", " ");
                      await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
                        VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${subject.teacher_id}','${faculty_id}','${subject.subject_id}');
                        `);
                      await getdataFromSql(`
                        UPDATE t_condition
                        SET mark = ${count - teachercount},markcount= ${teachercount}
                        WHERE person_id = '${teacherdata.person_id}'`);

                      removeItemOnce(subjectList, subject);
                      removeItemOnce(Day, element);
                    }
                  }
                  if (checkday == true) {
                    let subjectday = subject.exam_date
                    const mySQLDateString = subjectday
                      .toJSON()
                      .slice(0, 19)
                      .replace("T", " ");
                    await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
                    VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${subject.teacher_id}','${faculty_id}','${subject.subject_id}');
                    `);
                    await getdataFromSql(`
                    UPDATE t_condition
                    SET mark = ${count - teachercount},markcount= ${teachercount}
                    WHERE person_id = '${teacherdata.person_id}'`);

                    removeItemOnce(subjectList, subject);
                    removeItemOnce(Day, element);
                    break
                  }
                }
                if (checkday == true) {
                  break
                }
              }

          }



        }

      }

    }
  }

  callback(Examdaylist);
};
module.exports.read = function (callback) {
  // คำสั่ง sql
  let sql = "SELECT * FROM t_exam_committee";
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("exam committee");
    pool.query(sql, (err, rows) => {
      if (err) throw err;
      // console.log("The data from users table are: \n", rows);
      callback(rows);
      connection.release(); // return the connection to pool
    });
  });
};