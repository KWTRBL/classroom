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
      teacherdata.freetime_week1 != ""
        ? teacherdata.freetime_week1.split(",")
        : null;
    notfreedayinweek[1] =
      teacherdata.freetime_week2 != ""
        ? teacherdata.freetime_week2.split(",")
        : null;
    notfreedayinweek[2] =
      teacherdata.freetime_week3 != ""
        ? teacherdata.freetime_week3.split(",")
        : null;
    notfreedayinweek[3] =
      teacherdata.freetime_week4 != ""
        ? teacherdata.freetime_week4.split(",")
        : null;

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
          let notfreeindex = 0;
          notfreeindex < notfreedayinweekdata.length;
          notfreeindex++
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
      let subjectindex = 0;
      subjectindex < subjectList.length;
      subjectindex++
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

  for (
    let teacherindex = 0;
    teacherindex < teacher_list.length;
    teacherindex++
  ) {
    const teacherdata = teacher_list[teacherindex];

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

    //เช็ค condition weekend ยังทำไม่เสร็จ
    var conditionweekend = teacherdata.condition_weekend;
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

    var subjectList = await getdataFromSql(
      `SELECT t_exam_room.* FROM t_exam_room left JOIN t_exam_committee on t_exam_room.year = t_exam_committee.year and t_exam_room.semester = t_exam_committee.semester and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_room.building_no = t_exam_committee.building_no AND t_exam_room.room_no = t_exam_committee.room_no WHERE t_exam_committee.year is null and t_exam_committee.semester is null and t_exam_committee.mid_or_final is null and t_exam_committee.exam_date is null and t_exam_committee.exam_time is null and t_exam_committee.subject_id is null and t_exam_committee.building_no is null AND t_exam_committee.room_no is null`
    );

    if (!subjectList.length) {
      break;
    }

    //เช็ค building
    if (teacherdata.building_no != "ไม่มีเงื่อนไข") {
      for (
        let subjectindex = 0;
        subjectindex < subjectList.length;
        subjectindex++
      ) {
        const subject = subjectindex[subjectindex];
        if (subject.building_no != teacherdata.building_no) {
          removeItemOnce(subjectList, subject);
        }
      }
    }

    //เช็คช่วงเวลายังทำไม่เสร็จ
    if (teacherdata.condition_time != 3) {
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

    /*

    //หาวันที่ไม่ว่าง
    var notfreedayinweek = [];
    notfreedayinweek[0] =
      teacherdata.freetime_week1 != ""
        ? teacherdata.freetime_week1.split(",")
        : null;
    notfreedayinweek[1] =
      teacherdata.freetime_week2 != ""
        ? teacherdata.freetime_week2.split(",")
        : null;
    notfreedayinweek[2] =
      teacherdata.freetime_week3 != ""
        ? teacherdata.freetime_week3.split(",")
        : null;
    notfreedayinweek[3] =
      teacherdata.freetime_week4 != ""
        ? teacherdata.freetime_week4.split(",")
        : null;

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
          let notfreeindex = 0;
          notfreeindex < notfreedayinweekdata.length;
          notfreeindex++
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

    // if (teacherdata.person_id == "11222" || teacherdata.person_id == "11209") {
    //   console.log("teacher id :", teacherdata.person_id);
    //   console.log(subjectList);
    // }

    //เก็บข้อมูลวิชาที่มีคนคุมไปแล้ว
    var subjectExam = [];
    for (
      let subjectindex = 0;
      subjectindex < subjectList.length;
      subjectindex++
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
        removeItemOnce(subjectList, subjectdata);
      }
    }

    */
    //เอาข้อมูลวันที่มีสอบมาใส่ใหม่
    // var Examdaylist = JSON.parse(JSON.stringify(backupExamdaylist));
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
