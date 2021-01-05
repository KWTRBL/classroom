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

  //คำนวนจำนวนครั้งที่แต่ละคนต้องคุม
  var NumExam = await countNumExam(
    `SELECT ( ceiling( (SELECT sum(std_num) from t_exam_room WHERE t_exam_room.year = ? and t_exam_room.semester = ? and t_exam_room.mid_or_final = ?) / 30 ) -(SELECT count(*) from t_condition where condition_status = 2) )/ ( (SELECT count(*) from t_condition) - (SELECT count(*) from t_condition where condition_status = 2) - (SELECT count(*) from t_condition where condition_status = 0) )as result`,
    year,
    semester,
    mid_or_final
  );
  console.log(NumExam[0].result);
  count = Math.floor(NumExam[0].result);
  console.log(count);

  // query ข้อมูลอาจารย์ตาม filter
  var condition_result = await getdataFromSql(
    `SELECT * FROM t_condition where condition_status != 0 and person_type = '1' and faculty_id = '${faculty_id}'`
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

  console.log(examweek);

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
      // console.log(element)
      var day = new Date(element[0]);
      daylist.push([daysInWeek[day.getDay()], element[1]]);
    }
    // console.log(daylist)

    dayInweekExam.push(daylist);
    // var day = new Date(data);
    // dayInweekExam.push(daysInWeek[day.getDay()]);
  });

  // console.log(dayInweekExam);
  // week1start = examweekdata.week1_start;
  // week1end = examweekdata.week1_end;
  // week2start = examweekdata.week2_start;
  // week2end = examweekdata.week2_end;
  // week3start = examweekdata.week3_start;
  // week3end = examweekdata.week3_end;
  // week4start = examweekdata.week4_start;
  // week4end = examweekdata.week4_end;

  //for แยกจารย์
  for (let index = 0; index < condition_result.length; index++) {
    const teacherdata = condition_result[index];

    //query วิชาที่สอน
    var subjectList = await getdataFromSql(
      `SELECT t_exam_room.year,t_exam_room.semester,t_exam_room.mid_or_final,t_exam_room.exam_date,t_exam_room.exam_time,t_exam_room.building_no,t_exam_room.room_no,t_exam_room.subject_id,t_exam_room.section ,teacher_teach.teacher_id,t_exam_room.faculty_id  ,teacher_teach.section as t_section FROM t_exam_room, teacher_teach 
      where t_exam_room.subject_id = teacher_teach.subject_id and t_exam_room.section = teacher_teach.section and t_exam_room.year = teacher_teach.year and t_exam_room.semester = teacher_teach.semester 
      and t_exam_room.mid_or_final = "${mid_or_final}" and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and teacher_teach.teacher_id = ${teacherdata.person_id}`
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
      // console.log(dayInweekExamdata)
      //check ว่าถ้าไม่มีค่า notfreeday ให้ skip
      if (notfreedayinweekdata == null || dayInweekExamdata == []) {
        // if(teacherdata.person_id == '10521')
        //   console.log(index,notfreedayinweek,dayInweekExamdata,dayInweekExamdata == [])
        notfreedayindex.push([]);
        continue;
      }
      var indexlist = [];
      //for ตามวันในสัปดาห์สอบ
      for (let dayindex = 0; dayindex < dayInweekExamdata.length; dayindex++) {
        const examday = dayInweekExamdata[dayindex];

        // for ตามวันที่ไม่ว่าง

        for (
          let notfreeindex = 0;
          notfreeindex < notfreedayinweekdata.length;
          notfreeindex++
        ) {
          const notfreeday = notfreedayinweekdata[notfreeindex].split("x");

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

    // if(teacherdata.person_id == '10521')
    //   console.log(notfreedayindex)

    for (let index = 0; index < 4; index++) {
      const Examdaylistdata = Examdaylist[index];
      const notfreedayweek = notfreedayindex[index];
      // if (teacherdata.person_id == "10521") console.log(notfreedayweek);
      for (let count = 0; count < notfreedayweek.length; count++) {
        let index = notfreedayweek[count];
        // console.log(index);
        removeItemOnce(Examdaylistdata, index);
      }
    }

    // if (teacherdata.person_id == "10521") console.log(Examdaylist);

    //รวมวันที่ว่างคุม
    var Day = [];
    Day.push(
      ...Examdaylist[0],
      ...Examdaylist[1],
      ...Examdaylist[2],
      ...Examdaylist[3]
    );
    // if (teacherdata.person_id == "10521") console.log(Day)

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
          // if (teacherdata.person_id == "10521")
          //   console.log(
          //     newday,
          //     element.exam_date,
          //     newday.getTime() === element.exam_date.getTime()
          //   );
        }
      }
    }

    // if (teacherdata.person_id == "10521") {
    //   console.log(t_exam_committee.length);
    //   console.log(examlist, examlist.length);
    // }

    // เอาวันที่คุมไปแล้วออก
    for (let index = 0; index < examlist.length; index++) {
      const element = examlist[index];
      removeItemOnce(Day, element);
    }

    if (teacherdata.person_id == "10521") console.log(Day);

    for (
      let subjectindex = 0;
      subjectindex < subjectList.length;
      subjectindex++
    ) {
      const subjectdata = subjectList[subjectindex];
      var subjectdate = subjectdata.exam_date.setFullYear(
        subjectdata.exam_date.getFullYear() - 543
      );

      const isoDate = new Date(new Date(subjectdata.exam_date).toISOString());
      isoDate.setFullYear(isoDate.getFullYear() + 543);
      const mySQLDateString = isoDate
        .toJSON()
        .slice(0, 19)
        .replace("T", " ");

      var examdata = await getdataFromSql(
        `SELECT * FROM t_exam_room WHERE year = ${subjectdata.year} and semester = ${subjectdata.semester} and mid_or_final = '${subjectdata.mid_or_final}' and exam_date = '${mySQLDateString}' and room_no = '${subjectdata.room_no}' and exam_time = '${subjectdata.exam_time}'`
      );
      if (teacherdata.person_id == "10521") {
        console.log(examdata);
        // console.log(subjectList.length);
        // console.log(Examdaylist[0], teacherdata.person_id);
      }
    }

    var Examdaylist = JSON.parse(JSON.stringify(backupExamdaylist));

    //เช็ควันว่าง จาก conditionresult
  }

  /*
  condition_result.map(async (teacherdata, teacherindex) => {
    


    var notfreesubject = [];
    examdateinWeek = [];
    subjectList.map((subjectdata, index) => {
      var correct = 0;
      var subjectdate = subjectdata.exam_date.setFullYear(
        subjectdata.exam_date.getFullYear() - 543
      );
      if ((mid_or_final = "M")) {
        // console.log(teacherdata.freetime_week1,teacherdata.freetime_week1 == '')
        if (teacherdata.freetime_week1 != "") {
          notfreetimes = teacherdata.freetime_week1.split(",");
          for (i = 0; i < notfreetimes.length; i++) {
            dayandtime = notfreetimes[i].split("x"); // [day,time]
            examday = new Date(subjectdata.exam_date);
            for (j = 0; j < dateArray.length; j++) {
              dateinexamweek = new Date(dateArray[j]);
              notfreeday = daysInWeek[dayandtime[0]];
              notfreetime = dayandtime[1];
              // console.log(notfreeday,dayandtime)
              //check ว่าวันสอบมันตรงกับวันในสัปดาห์สอบมั้ย
              if (dateinexamweek.getTime() === examday.getTime()) {
                if (notfreeday == daysInWeek[examday.getDay()]) {
                  if (notfreetime == subjectdata.exam_time) {
s
                    notfreesubject.push(subjectdata);
                  }
                }
                examdateinWeek.push(subjectdata);
              }
            }
          }
        }
      }
    });

    //ลบวิชาที่ไม่ว่างออกไป
    notfreesubject.map((data) => {
      removeItemOnce(subjectList, data);
    });

    // console.log(subjectList.length, teacherdata.person_id);

    if (subjectList.length > 0) {
      spacialsubject = [];
      normalsubject = [];
      await Promise.all(
        subjectList.map(async (data, index) => {
          //แปลงวันให้อยู่ในรูป mysql
          const isoDate = new Date(new Date(data.exam_date).toISOString());
          isoDate.setFullYear(isoDate.getFullYear() + 543);
          const mySQLDateString = isoDate
            .toJSON()
            .slice(0, 19)
            .replace("T", " ");

          var roomcheck = await getdataFromSql(
            `SELECT * FROM t_exam_room WHERE year = ${data.year} and semester = ${data.semester} and mid_or_final = '${data.mid_or_final}' and exam_date = '${mySQLDateString}' and room_no = '${data.room_no}' and exam_time = '${data.exam_time}'`
          );
          // console.log(roomcheck.length,teacherdata.person_id,'roomcheck');

          if (roomcheck.length == 1) {
            spacialsubject.push(data);
          }
          if (roomcheck.length > 1) {
            normalsubject.push(data);
          }
        })
      );

      //ตัวนับว่าใช้ไปกี่ครั้งแล้ว
      let countSubjectExam = 0;
      if (spacialsubject.length > 0) {
        for (let i = 0; i < count; i++) {
          if (i == spacialsubject.length) {
            countSubjectExam = i;
            break;
          }
          var randomindex = Math.floor(Math.random() * spacialsubject.length);
          const isoDate = new Date(
            new Date(spacialsubject[randomindex].exam_date).toISOString()
          );
          const mySQLDateString = isoDate
            .toJSON()
            .slice(0, 19)
            .replace("T", " ");

          data = await getdataFromSql(`INSERT INTO t_exam_committee (exam_date,	exam_time	,year	,semester,	mid_or_final,	building_no	,room_no	,person_type	,person_id,faculty_id	)
          VALUES ('${mySQLDateString}','${spacialsubject[randomindex].exam_time}',${spacialsubject[randomindex].year},${spacialsubject[randomindex].semester}, '${spacialsubject[randomindex].mid_or_final}', '${spacialsubject[randomindex].building_no}', '${spacialsubject[randomindex].room_no}','${teacherdata.person_type}','${teacherdata.person_id}','${teacherdata.faculty_id}');
           `);
          data = spacialsubject[randomindex];
          removeItemOnce(spacialsubject, data);
          countSubjectExam = i+1;

        }
      }

      count = count - countSubjectExam;
      console.log(count,countSubjectExam,teacherdata.person_id)

      //จัดคุมสอบวิชาที่มีสอบ 2 วิชาใน 1 ห้อง
      if (spacialsubject.length == 0 && normalsubject.length != 0) {
        // console.log(
        //   normalsubject.length,
        //   "normal length",
        //   teacherdata.person_id,
        //   condition_result.length,
        //   teacherindex
        // );
        for (let i = 0; i < count; i++) {
          var randomindex = Math.floor(Math.random() * normalsubject.length);

          const isoDate = new Date(
            new Date(normalsubject[randomindex].exam_date).toISOString()
          );
          const mySQLDateString = isoDate
            .toJSON()
            .slice(0, 19)
            .replace("T", " ");

          data = await getdataFromSql(`INSERT INTO t_exam_committee (exam_date,	exam_time	,year	,semester,	mid_or_final,	building_no	,room_no	,person_type	,person_id,faculty_id	)
          VALUES ('${mySQLDateString}','${normalsubject[randomindex].exam_time}',${normalsubject[randomindex].year},${normalsubject[randomindex].semester}, '${normalsubject[randomindex].mid_or_final}', '${normalsubject[randomindex].building_no}', '${normalsubject[randomindex].room_no}','${teacherdata.person_type}','${teacherdata.person_id}','${teacherdata.faculty_id}');
           `);
          data = normalsubject[randomindex];
          removeItemOnce(normalsubject, data);
        }
      }
    }

    // console.log(spacialsubject.length, "special");
    // console.log(normalsubject.length, "normal");
    // console.log(normalsubject.length, "data");
  });
  */
  callback(condition_result);
};

module.exports.othersubject = async function (callback) {};
