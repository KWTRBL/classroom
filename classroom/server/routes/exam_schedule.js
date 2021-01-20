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
  var mid_or_final = "M";
  var faculty_id = "05";
  var returndata = null;
  //คำนวนจำนวนครั้งที่แต่ละคนต้องคุม
  var NumExam = await countNumExam(
    `SELECT ceiling (((select sum(sumstdnum.countstdnum) FROM (SELECT ceiling (sum(std_num)/30) as countstdnum from t_exam_room where t_exam_room.year = ? and t_exam_room.semester = ? and t_exam_room.mid_or_final = ? GROUP BY exam_date,exam_time,room_no ) as sumstdnum) -(SELECT count(*) from t_condition where condition_status = 2) )/ ( (SELECT count(*) from t_condition) - (SELECT count(*) from t_condition where condition_status = 2) - (SELECT count(*) from t_condition where condition_status = 0)) )as result`,
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

  //for แยกจารย์
  for (let index = 0; index < condition_result.length; index++) {
    const teacherdata = condition_result[index];
    console.log("teacher_id : ", teacherdata.person_id);
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
      // console.log(element)
      removeItemOnce(Day, element);
    }

    // if (teacherdata.person_id == "10521") console.log(Day);

    //เก็บข้อมูลวิชาที่มีคนคุมไปแล้ว
    var subjectExam = [];
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
      // isoDate.setFullYear(isoDate.getFullYear() + 543);
      const mySQLDateString = isoDate.toJSON().slice(0, 19).replace("T", " ");

      var t_exam_committee = await getdataFromSql(
        `SELECT * FROM t_exam_committee WHERE year = ${subjectdata.year} and semester = ${subjectdata.semester} and mid_or_final = '${subjectdata.mid_or_final}' and person_type = '1' and building_no = '${subjectdata.building_no}' and room_no = '${subjectdata.room_no}' and exam_date = '${mySQLDateString}' and exam_time = '${subjectdata.exam_time}' and subject_id = '${subjectdata.subject_id}' `
      );
      if (t_exam_committee.length) {
        for (let index = 0; index < Day.length; index++) {
          const element = Day[index];
          var datestring = subjectdata.exam_date.toISOString().toString();
          if (element[0] == datestring && element[1] == subjectdata.exam_time) {
            subjectExam.push(element);
          }
        }
      }
    }

    // if (teacherdata.person_id == "10521") console.log(subjectExam);

    for (let index = 0; index < subjectExam.length; index++) {
      const element = subjectExam[index];
      removeItemOnce(Day, element);
    }

    if (teacherdata.person_id == "10521") {
      console.log(Day);
    }

    //

    var SpecialSubject = [];
    var NormalSubject = [];
    for (let index = 0; index < subjectList.length; index++) {
      const element = subjectList[index];

      const subjectday = new Date(new Date(element.exam_date).toISOString());
      //subjectday.setFullYear(subjectday.getFullYear() + 543);
      const mySQLDateString = subjectday
        .toJSON()
        .slice(0, 19)
        .replace("T", " ");

      var exam_time = element.exam_time;

      for (let dayindex = 0; dayindex < Day.length; dayindex++) {
        const Daydata = Day[dayindex];
        var convertday = new Date(Daydata[0]);
        if (
          subjectday.getTime() == convertday.getTime() &&
          exam_time == Daydata[1]
        ) {
          subjectday.setFullYear(subjectday.getFullYear() + 543);
          const mySQLDateString = subjectday
            .toJSON()
            .slice(0, 19)
            .replace("T", " ");

          var roomcount = await getdataFromSql(
            `select * from t_exam_room where year = ${element.year} and semester = ${element.semester} and mid_or_final = '${element.mid_or_final}' and exam_time = '${element.exam_time}' and room_no = '${element.room_no}' and exam_date = '${mySQLDateString}'`
          );
          if (roomcount.length == 1) {
            SpecialSubject.push(element);
          }
          if (roomcount.length == 2) {
            NormalSubject.push(element);
          }
        }
        // if(teacherdata.person_id == '10521'){
        //   console.log(subjectday,convertday,subjectday.getTime() == convertday.getTime())
        //   console.log(roomcount.length)
        // }
      }
    }

    console.log("Special subject : ", SpecialSubject.length);
    console.log("Normal subject : ", NormalSubject.length);

    var specialcount = 0;
    var sum = 0;
    // console.log(count);

    //•	ถ้ามีข้อมูลใน special ให้
    if (SpecialSubject.length > 0) {
      console.log("special");
      for (let index = 0; index < count; index++) {
        const random = Math.floor(Math.random() * SpecialSubject.length);
        console.log("random special : ", random);
        var subject = SpecialSubject[random];

        var daydata = new Date(subject.exam_date);
        var mySQLDateString = daydata.toJSON().slice(0, 19).replace("T", " ");

        //•	เช็คว่าจารย์คนนั้นคุมวันไหน เวลาไหน ไปแล้วบ้าง (เวลาจะได้ไม่ทับกัน)
        var same = 0;
        while (same == 0) {
          var t_exam_committee = await getdataFromSql(
            `SELECT * FROM t_exam_committee where year = ${subject.year} and semester = ${subject.semester} and mid_or_final = '${subject.mid_or_final}' and faculty_id = '${faculty_id}' and person_type = '1' and person_id = '${teacherdata.person_id}' and exam_date = '${mySQLDateString}' `
          );

          if (t_exam_committee.length > 0) {
            //ไม่เหมือนให้เอาข้อมูลออก
            removeItemOnce(SpecialSubject, subject);
            //ลบข้อมูลจนหมด
            if (SpecialSubject.length == 0) {
              break;
            }
            const random = Math.floor(Math.random() * SpecialSubject.length);
            subject = SpecialSubject[random];
          }

          if (t_exam_committee.length == 0) {
            same = 1;
          }
        }
        //case ลบ data หลังจาก checkหมดแล้ว
        if (SpecialSubject.length == 0) {
          console.log("break bec not same");
          break;
        }

        await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
        VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${subject.teacher_id}','${faculty_id}','${subject.subject_id}');
        `);
        specialcount = index + 1;

        //ลบหลังจาก insert data
        removeItemOnce(SpecialSubject, subject);
        if (SpecialSubject.length == 0) {
          break;
        }
      }
    }

    var countnormal = count - specialcount;
    if (countnormal < 0) countnormal = 0;
    NormalCount = 0;
    console.log(specialcount);

    if (NormalSubject.length > 0) {
      console.log("normal", count, countnormal);

      for (let index = 0; index < countnormal; index++) {
        const random = Math.floor(Math.random() * NormalSubject.length);
        var subject = NormalSubject[random];

        var daydata = new Date(subject.exam_date);
        var mySQLDateString = daydata.toJSON().slice(0, 19).replace("T", " ");

        //•	เช็คว่าจารย์คนนั้นคุมวันไหน เวลาไหน ไปแล้วบ้าง (เวลาจะได้ไม่ทับกัน)
        if (teacherdata.person_id == "10521") {
          console.log(subject);
          returndata = subjectList;
        }

        var same = 0;
        while (same == 0) {
          var t_exam_committee = await getdataFromSql(
            `SELECT * FROM t_exam_committee where year = ${subject.year} and semester = ${subject.semester} and mid_or_final = '${subject.mid_or_final}' and faculty_id = '${faculty_id}' and person_type = '1' and person_id = '${teacherdata.person_id}' and exam_date = '${mySQLDateString}' `
          );

          if (t_exam_committee.length > 0) {
            removeItemOnce(NormalSubject, subject);
            //ลบข้อมูลจนหมด
            if (NormalSubject.length == 0) {
              break;
            }
            const random = Math.floor(Math.random() * NormalSubject.length);
            subject = NormalSubject[random];
          }
          if (t_exam_committee.length == 0) {
            same = 1;
          }
        }
        if (NormalSubject.length == 0) {
          break;
        }

        await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
        VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${subject.teacher_id}','${faculty_id}','${subject.subject_id}');
        `);
        NormalCount = index + 1;
     
        //ลบหลังจาก insert data
        removeItemOnce(NormalSubject, subject);
        if (NormalSubject.length == 0) {
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

module.exports.othersubject = async function (callback) {};
