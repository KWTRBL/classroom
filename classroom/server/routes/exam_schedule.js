// const {
//   off
// } = require("./dbconfig");
const { pool } = require("./dbconfig");

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

module.exports.ownsubject = async function (req, callback) {
  var year = req.body.year;
  var semester = req.body.semester;
  var mid_or_final = req.body.mid_or_final;
  var faculty_id = req.body.faculty_id;
  console.log(req.body)
  // var year = 2563;
  // var semester = 2;
  // var mid_or_final = "M";
  // var faculty_id = "05";
  // var returndata = null;
  //คำนวนจำนวนครั้งที่แต่ละคนต้องคุม

  // var facultylist = []
  // for (let i = 1; i < 30; i++) {
  //   facultylist.push(i < 10 ? `0${i}` : i.toString())

  // }

  // for (let faculty_index = 0; faculty_index < facultylist.length; faculty_index++) {
  //   const faculty_id = facultylist[faculty_index];

  await getdataFromSql(`
      insert into t_exam_committee_check (year, semester, mid_or_final, status, office_id, person_type)
      values (${year},${semester},'${mid_or_final}',1,'${faculty_id}',1)
    `)


  var NumExam = await countNumExam(
    `SELECT ceiling (((select sum(sumstdnum.countstdnum) FROM (SELECT ceiling(IF(sum(std_num)/30 < 2,2, sum(std_num)/30))as countstdnum from t_exam_room where t_exam_room.year = ? and t_exam_room.semester = ? and t_exam_room.mid_or_final = ? GROUP BY exam_date,exam_time,room_no ) as sumstdnum) -(SELECT count(*) from t_condition where condition_status = 2) )/ ( (SELECT count(*) from t_condition) - (SELECT count(*) from t_condition where condition_status = 2) - (SELECT count(*) from t_condition where condition_status = 0)) )as result`,
    year,
    semester,
    mid_or_final
  );
  console.log(NumExam[0].result);
  count = Math.floor(NumExam[0].result);
  // console.log('facultyid' ,faculty_id)
  // console.log("numexam: ", count);

  // query ข้อมูลอาจารย์ตาม filter
  var condition_result = await getdataFromSql(
    `SELECT * FROM t_condition where condition_status != 0 and person_type = '1' and faculty_id = '${faculty_id}' and own_subject != 0`
  );


  // console.log("teacher num : ", condition_result.length);
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
  var Examdaylist = []; // [[],[],[],[]]
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
      //[date,examtime]
      // console.log('data ',day.getUTCDate())
      // console.log(new Intl.DateTimeFormat('en-US', options).format(day));
      // แปลงปีให้เป็น คศ แล้วค่อยแปลงกลับ
      day.setFullYear(day.getFullYear() - 543)
      daylist.push([daysInWeek[day.getDay()], element[1]]);
      day.setFullYear(day.getFullYear() + 543)

    }
    dayInweekExam.push(daylist);
  });
  // if (faculty_index == 0) {
  //   console.log(Examdaylist, dayInweekExam)
  // }
  //for แยกจารย์
  for (let index = 0; index < condition_result.length; index++) {
    const teacherdata = condition_result[index];

    //query วิชาที่สอน
    var subjectList = await getdataFromSql(
      `SELECT t_exam_room.year,t_exam_room.semester,t_exam_room.mid_or_final,t_exam_room.exam_date,t_exam_room.exam_time,t_exam_room.building_no,t_exam_room.room_no,t_exam_room.subject_id,t_exam_room.section ,teacher_teach.teacher_id,t_exam_room.faculty_id  ,teacher_teach.section as t_section FROM t_exam_room, teacher_teach 
      where t_exam_room.subject_id = teacher_teach.subject_id and t_exam_room.section = teacher_teach.section and t_exam_room.year = teacher_teach.year and t_exam_room.semester = teacher_teach.semester 
      and t_exam_room.mid_or_final = "${mid_or_final}" and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and teacher_teach.teacher_id = ${teacherdata.person_id} and teacher_teach.lect_or_prac = 'ท' `
    );
    // if(faculty_id == "05"){
    // console.log("teacher_id : ", teacherdata.person_id);
    // console.log(subjectList)
    // console.log(' ')
    // }
    // if (teacherdata.person_id == "10521") {
    //   console.log('length ', subjectList.length)
    // }
    if (!subjectList.length) {
      await getdataFromSql(`
        UPDATE t_condition
        SET mark = ${count},markcount= ${0}
        WHERE person_id = '${teacherdata.person_id}'`);
      continue;
    }

    //หาวันที่ไม่ว่าง
    var notfreedayinweek = [];
    //[]
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
            daysInWeek[notfreeday[0] - 1] == examday[0] && notfreeday[1] == examday[1]
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
      let subjectindex = 0; subjectindex < subjectList.length; subjectindex++
    ) {
      const subjectdata = subjectList[subjectindex]
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
          teacherdata.person_id == "10125" ||
          teacherdata.person_id == "11209"
        ) {
          console.log(
            "teacher id :",
            teacherdata.person_id,
            subjectList.length
          );
          console.log(subjectList);
          console.log(subjectdata)
        }
        removeItemOnce(subjectList, subjectdata);
        if (
          teacherdata.person_id == "10125" ||
          teacherdata.person_id == "11209"
        ) {
          console.log(
            "teacher id :",
            teacherdata.person_id,
            subjectList.length
          );
          console.log(subjectList);
        }
        subjectindex--
      }
    }


    var teachercount = 0;
    // console.log("condition_status ", teacherdata.condition_status);
    for (let index = 0; index < count; index++) {
      if (teacherdata.condition_status == 2 && teachercount == 1) {
        // console.log("break");
        await getdataFromSql(`
          UPDATE t_condition
          SET mark = 0
          WHERE person_id = '${teacherdata.person_id}'`);
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

        if (subjectday.getTime() == convertday.getTime() && exam_time == daydata[1]) {
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
    await getdataFromSql(`
      UPDATE t_condition
      SET mark = ${count}
      WHERE markcount = 0  and person_type = 1 and faculty_id = ${faculty_id}`);
    var Examdaylist = JSON.parse(JSON.stringify(backupExamdaylist));

    //เช็ควันว่าง จาก conditionresult
  }
  // }

  callback('ownsubject success');
};

module.exports.othersubject = async function (req, callback) {
  var year = req.body.year;
  var semester = req.body.semester;
  var mid_or_final = req.body.mid_or_final;
  var faculty_id = req.body.faculty_id;
  // var year = 2563;
  // var semester = 2;
  // var mid_or_final = "M";
  // var faculty_id = "05";


  // var facultylist = []
  // for (let i = 1; i < 30; i++) {
  //   facultylist.push(i < 10 ? `0${i}` : i.toString())

  // }

  // for (let faculty_index = 0; faculty_index < facultylist.length; faculty_index++) {
  // const faculty_id = facultylist[faculty_index];

  console.log('normal subject');
  await getdataFromSql(`
    insert into t_exam_committee_check (year, semester, mid_or_final, status, office_id, person_type)
    values (${year},${semester},'${mid_or_final}',2,'${faculty_id}',1)
  `)

  // query ข้อมูลอาจารย์ตาม filter
  var teacher_list = await getdataFromSql(
    `SELECT * FROM t_condition where condition_status != 0  and faculty_id = '${faculty_id}' and person_type = 1 `
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
      day.setFullYear(day.getFullYear() - 543)
      daylist.push([daysInWeek[day.getDay()], element[1]]);
      day.setFullYear(day.getFullYear() + 543)
    }
    // console.log(daylist);
    dayInweekExam.push(daylist);
  });


  // for ตามจารย์
  for (
    let teacherindex = 0; teacherindex < teacher_list.length; teacherindex++
  ) {
    // console.log('')


    // list ข้อมูล teacher ออกมา
    const teacherdata = teacher_list[teacherindex];

    //เอาชื่อวิชาทั้งหมดที่ยังไม่คุมมา

    var subjectList = await getdataFromSql(`
      SELECT t_exam_room.* FROM t_exam_room left JOIN t_exam_committee on t_exam_room.year = t_exam_committee.year and t_exam_room.semester = t_exam_committee.semester and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_room.building_no = t_exam_committee.building_no AND t_exam_room.room_no = t_exam_committee.room_no WHERE t_exam_committee.year is null and t_exam_committee.semester is null and t_exam_committee.mid_or_final is null and t_exam_committee.exam_date is null and t_exam_committee.exam_time is null and t_exam_committee.subject_id is null and t_exam_committee.building_no is null AND t_exam_committee.room_no is null and t_exam_room.room_no not in(select DISTINCT room_no FROM t_exam_committee) and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and t_exam_room.mid_or_final = '${mid_or_final}'
      `)

    if (!subjectList.length) {
      subjectList = await getdataFromSql(
        `SELECT t_exam_room.* FROM t_exam_room left JOIN t_exam_committee on t_exam_room.year = t_exam_committee.year and t_exam_room.semester = t_exam_committee.semester and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_room.building_no = t_exam_committee.building_no AND t_exam_room.room_no = t_exam_committee.room_no WHERE t_exam_committee.year is null and t_exam_committee.semester is null and t_exam_committee.mid_or_final is null and t_exam_committee.exam_date is null and t_exam_committee.exam_time is null and t_exam_committee.subject_id is null and t_exam_committee.building_no is null AND t_exam_committee.room_no is null and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and t_exam_room.mid_or_final = '${mid_or_final}' `
      )
      if (subjectList.length == 0) {
        subjectList = await getdataFromSql(`
        SELECT DISTINCT t_exam_room.*,if( ceiling(sum(DISTINCT std_num)/30) < 2,2,ceiling(sum(DISTINCT std_num)/30)) as checkdata,count(*),sum(DISTINCT std_num) FROM t_exam_room 
        INNER JOIN t_exam_committee
        on t_exam_room.year = t_exam_committee.year
        and t_exam_room.semester = t_exam_committee.semester
        and t_exam_room.mid_or_final = t_exam_committee.mid_or_final
        and t_exam_room.exam_date = t_exam_committee.exam_date
        and t_exam_room.exam_time = t_exam_committee.exam_time
        and t_exam_room.subject_id = t_exam_committee.subject_id
        and t_exam_room.building_no = t_exam_committee.building_no
        AND t_exam_room.room_no = t_exam_committee.room_no
        WHERE  t_exam_room.year = ${year} and
        t_exam_room.semester = ${semester} and
        t_exam_room.mid_or_final = '${mid_or_final}'
        GROUP by t_exam_room.year
        ,t_exam_room.semester
        , t_exam_room.mid_or_final
        , t_exam_room.exam_date
        , t_exam_room.exam_time
        , t_exam_room.room_no  
        having checkdata > count(*)   `)
        if (subjectList.length == 0) {
          break;
        }
      }
    }

    //เช็ค condition week
    var conditionweek = teacherdata.condition_week;
    // console.log(conditionweek)
    if (conditionweek != 0) {
      for (let index = 0; index < 4; index++) {
        if (conditionweek != index + 1) {
          Examdaylist[index] = [];
          dayInweekExam[index] = [];
        }
      }
    }


    //เช็คช่วงเวลา กรณี เช้า หรือ บ่าย
    if (teacherdata.condition_time == 1 || teacherdata.condition_time == 2) {
      for (let index = 0; index < 4; index++) {
        var examdayarray = Examdaylist[index];
        var dayInweekExamarray = dayInweekExam[index];
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
    if (teacherdata.condition_time == 3) {
      let exam_committeedata = await getdataFromSql(
        `select exam_date,exam_time from t_exam_committee where person_id = ${teacherdata.person_id}  and year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}'`
      );
      if (exam_committeedata.length > 0) {
        for (let index = 0; index < exam_committeedata.length; index++) {
          const element = exam_committeedata[index];
          let daydata = new Date(element.exam_date)
          const mySQLDateString = daydata
            .toJSON()
            .slice(0, 19)
            .replace("T", " ");
          let daylist = await getdataFromSql(
            `select * from t_exam_committee where exam_date = '${mySQLDateString}' and person_id = ${teacherdata.person_id}`
          );
          if (daylist.length > 1) {
            timelist.push(
              element.exam_time == 1 ? [element.exam_date, "2"] : [element.exam_date, "1"]
            );
          }
        }
      }
    }

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
        var daydata = examdayweek[dayindex]
        // for ตามวันที่ไม่ว่าง

        for (
          let notfreeindex = 0; notfreeindex < notfreedayinweekdata.length; notfreeindex++
        ) {
          const notfreeday = notfreedayinweekdata[notfreeindex].split("x"); //[2,1]
          if (
            daysInWeek[notfreeday[0] - 1] == examday[0] && notfreeday[1] == examday[1]
          ) {
            indexlist.push(daydata);
            // indexlist.push(examdayweek[dayindex]);
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

    // console.log('notfree in dex :', notfreedayindex)
    for (let index = 0; index < 4; index++) {
      const Examdaylistdata = Examdaylist[index];
      const notfreedayweek = notfreedayindex[index];
      for (let count = 0; count < notfreedayweek.length; count++) {
        let index = notfreedayweek[count];
        removeItemOnce(Examdaylistdata, index);
      }
    }

    // console.log(subjectList.length,teacherdata.person_id)
    // console.log(Examdaylist)

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

    if (conditionweekend == 1)
      var weekenddaylist = [
        ...weekenddayweekist[0],
        ...weekenddayweekist[1],
        ...weekenddayweekist[2],
        ...weekenddayweekist[3],
      ];

    //จัดผู้คุม
    var checkroomempty = false
    var reset = 0;
    for (let index = 0; index < teacherdata.mark; index++) {
      if (teacherdata.condition_status == 2) {
        // console.log('person_id: ',teacherdata.person_id,teacherdata.mark)
        var checkstatus = await getdataFromSql(`select * from t_exam_committee where year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}' and person_id = ${teacherdata.person_id}`)
        // console.log(checkstatus.length)
        if (checkstatus.length == 1) {
          break;
        }

      }

      var count = teacherdata.mark
      var teachercount = index + 1
      // console.log(teacherdata.person_id, 'mark :', count, 'index :', index)
      //เช็คห้องว่าง
      if (checkroomempty == false) {
        subjectList = await getdataFromSql(`
        SELECT t_exam_room.* FROM t_exam_room left JOIN t_exam_committee on t_exam_room.year = t_exam_committee.year and t_exam_room.semester = t_exam_committee.semester and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_room.building_no = t_exam_committee.building_no AND t_exam_room.room_no = t_exam_committee.room_no WHERE t_exam_committee.year is null and t_exam_committee.semester is null and t_exam_committee.mid_or_final is null and t_exam_committee.exam_date is null and t_exam_committee.exam_time is null and t_exam_committee.subject_id is null and t_exam_committee.building_no is null AND t_exam_committee.room_no is null and t_exam_room.room_no not in(select DISTINCT room_no FROM t_exam_committee) and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and t_exam_room.mid_or_final = '${mid_or_final}'
        `)
        if (subjectList.length == 0) {
          checkroomempty = true
          //ถ้าคุมทุกห้องแล้ว
          subjectList = await getdataFromSql(
            `SELECT t_exam_room.* FROM t_exam_room left JOIN t_exam_committee on t_exam_room.year = t_exam_committee.year and t_exam_room.semester = t_exam_committee.semester and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_room.building_no = t_exam_committee.building_no AND t_exam_room.room_no = t_exam_committee.room_no WHERE t_exam_committee.year is null and t_exam_committee.semester is null and t_exam_committee.mid_or_final is null and t_exam_committee.exam_date is null and t_exam_committee.exam_time is null and t_exam_committee.subject_id is null and t_exam_committee.building_no is null AND t_exam_committee.room_no is null and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and t_exam_room.mid_or_final = '${mid_or_final}' `
          )
        }

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

      }

      if (checkroomempty == true && subjectList.length == 0) {
        subjectList = await getdataFromSql(`
        SELECT DISTINCT t_exam_room.*,if( ceiling(sum(DISTINCT std_num)/30) < 2,2,ceiling(sum(DISTINCT std_num)/30)) as checkdata,count(*),sum(DISTINCT std_num) FROM t_exam_room 
        INNER JOIN t_exam_committee
        on t_exam_room.year = t_exam_committee.year
        and t_exam_room.semester = t_exam_committee.semester
        and t_exam_room.mid_or_final = t_exam_committee.mid_or_final
        and t_exam_room.exam_date = t_exam_committee.exam_date
        and t_exam_room.exam_time = t_exam_committee.exam_time
        and t_exam_room.subject_id = t_exam_committee.subject_id
        and t_exam_room.building_no = t_exam_committee.building_no
        AND t_exam_room.room_no = t_exam_committee.room_no
        WHERE  t_exam_room.year = ${year} and
        t_exam_room.semester = ${semester} and
        t_exam_room.mid_or_final = '${mid_or_final}'
        GROUP by t_exam_room.year
        ,t_exam_room.semester
        , t_exam_room.mid_or_final
        , t_exam_room.exam_date
        , t_exam_room.exam_time
        , t_exam_room.room_no  
        having checkdata > count(*)
        `)

        if (subjectList.length == 0) {
          break;
        }
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
      }


      // ถ้า weekend มี
      if (conditionweekend == 1) {
        console.log('weekend')
        shuffle(subjectList);
        shuffle(weekenddaylist);
        checkdata = false
        // list วิชามา
        for (let subjectindex = 0; subjectindex < subjectList.length; subjectindex++) {
          let subject = subjectList[subjectindex];
          
          var checkday = false
          //list day มา 
          for (let dayindex = 0; dayindex < Day.length; dayindex++) {
            const element = Day[dayindex];
            let dateday = new Date(element[0])
            //check ว่าวันสุดสัปดาห์มั้ย และเวลาสอบตรงกันหรือป่าว
            if ((dateday.getDay() == 0 || dateday.getDay() == 6) && dateday.getTime() === subject.exam_date.getTime() && element[1] == subject.exam_time) {
              //เงื่อนไขเวลา case เช้าบ่ายในวันเดียวกัน ถ้าเจอวันสุดสัปดาห์
              if (teacherdata.condition_time == 3) {
                let exam_committeedata = await getdataFromSql(
                  `select distinct exam_date from t_exam_committee where person_id = ${teacherdata.person_id}  and year = ${year} and semester = ${semester} and mid_or_final = ${mid_or_final}`
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
                      if (dateday.getTime() === day.getTime() && daylist[0].exam_time != element[1]) {
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
                  VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${teacherdata.person_id}','${faculty_id}','${subject.subject_id}');
                  `);
                  await getdataFromSql(`
                  UPDATE t_condition
                  SET mark = ${count - teachercount},markcount= ${teachercount}
                  WHERE person_id = '${teacherdata.person_id}'`);

                  removeItemOnce(subjectList, subject);
                  removeItemOnce(Day, element);
                  checkdata = true
                  break
                }
              } else {
                checkday = true
              }
            }
            if (checkday == true) {
              let subjectday = subject.exam_date
              const mySQLDateString = subjectday
                .toJSON()
                .slice(0, 19)
                .replace("T", " ");
              await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
              VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${teacherdata.person_id}','${faculty_id}','${subject.subject_id}');
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
          if (checkday == true || checkdata == true) {
            break
          }
        }

      } else {
        // console.log('not weekend', teacherdata.condition_time)
        shuffle(subjectList);
        for (let index = 0; index < subjectList.length; index++) {
          const subject = subjectList[index];
          var checkdata = false
          if (teacherdata.condition_time != 3) {
            //case เวลาไรก็ได้
            for (let dayindex = 0; dayindex < Day.length; dayindex++) {
              let daydata = Day[dayindex];
              // console.log(Day,index,subject)
              // console.log(daydata,subject.exam_date)
              if (new Date(daydata[0]).getTime() === subject.exam_date.getTime() && subject.exam_time == daydata[1]) {
                // console.log('condition_time != 2')
                checkdata = true
                const mySQLDateString = subject.exam_date
                  .toJSON()
                  .slice(0, 19)
                  .replace("T", " ");
                // console.log(mySQLDateString, subject.exam_time, subject.year)
                await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
              VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${teacherdata.person_id}','${faculty_id}','${subject.subject_id}');
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
              if (index == subjectList.length - 1 && checkroomempty == false && reset == 0) {
                subjectList = await getdataFromSql(
                  `SELECT t_exam_room.* FROM t_exam_room left JOIN t_exam_committee on t_exam_room.year = t_exam_committee.year and t_exam_room.semester = t_exam_committee.semester and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_room.building_no = t_exam_committee.building_no AND t_exam_room.room_no = t_exam_committee.room_no WHERE t_exam_committee.year is null and t_exam_committee.semester is null and t_exam_committee.mid_or_final is null and t_exam_committee.exam_date is null and t_exam_committee.exam_time is null and t_exam_committee.subject_id is null and t_exam_committee.building_no is null AND t_exam_committee.room_no is null and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and t_exam_room.mid_or_final = '${mid_or_final}' `
                )
                index = -1
                reset = 1
                continue
              }
              if (index == subjectList.length - 1 && checkroomempty == true && reset == 0 || index == subjectList.length - 1 && checkroomempty == false && reset == 1) {
                subjectList = await getdataFromSql(`
                SELECT DISTINCT t_exam_room.*,if( ceiling(sum(DISTINCT std_num)/30) < 2,2,ceiling(sum(DISTINCT std_num)/30)) as checkdata,count(*),sum(DISTINCT std_num) FROM t_exam_room 
                INNER JOIN t_exam_committee
                on t_exam_room.year = t_exam_committee.year
                and t_exam_room.semester = t_exam_committee.semester
                and t_exam_room.mid_or_final = t_exam_committee.mid_or_final
                and t_exam_room.exam_date = t_exam_committee.exam_date
                and t_exam_room.exam_time = t_exam_committee.exam_time
                and t_exam_room.subject_id = t_exam_committee.subject_id
                and t_exam_room.building_no = t_exam_committee.building_no
                AND t_exam_room.room_no = t_exam_committee.room_no
                WHERE  t_exam_room.year = ${year} and
                t_exam_room.semester = ${semester} and
                t_exam_room.mid_or_final = '${mid_or_final}'
                GROUP by t_exam_room.year
                ,t_exam_room.semester
                , t_exam_room.mid_or_final
                , t_exam_room.exam_date
                , t_exam_room.exam_time
                , t_exam_room.room_no  
                having checkdata > count(*)
                `)
                console.log('test')
                index = -1
                reset = 2
                continue

              }

            }

          } else {
            shuffle(subjectList);
            // list วิชามา
            for (let subjectindex = 0; subjectindex < subjectList.length; subjectindex++) {
              let subject = subjectList[subjectindex];
              //ไว้เช็ควัน
              var checkday = false
              //list day มา 
              for (let dayindex = 0; dayindex < Day.length; dayindex++) {
                const element = Day[dayindex];
                //เงื่อนไขเวลา case เช้าบ่ายในวันเดียวกัน ถ้าเจอวันสุดสัปดาห์
                if (teacherdata.condition_time == 3) {
                  let exam_committeedata = await getdataFromSql(
                    `select distinct exam_date from t_exam_committee where person_id = ${teacherdata.person_id}  and year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}'`
                  );
                  //เคยคุมแล้ว
                  if (exam_committeedata.length > 0) {
                    // list วันที่คุมมา
                    for (let index = 0; index < exam_committeedata.length; index++) {

                      const data = exam_committeedata[index];
                      let daydata = new Date(data.exam_date)
                      const mySQLDateString = daydata
                        .toJSON()
                        .slice(0, 19)
                        .replace("T", " ");

                      let daylist = await getdataFromSql(
                        `select * from t_exam_committee where exam_date = '${mySQLDateString}' and person_id = ${teacherdata.person_id}`
                      );

                      // กรณีที่คุมแค่เวลาเดียว
                      if (daylist.length == 1) {
                        let day = new Date(daylist[0].exam_date)
                        let datadate = new Date(element[0])
                        //check ว่าเจอวันตรงกันมั้ย
                        if (day.getTime() === datadate.getTime() && daylist[0].exam_time != element[1] && subject.exam_time != daylist[0].exam_time && datadate.getTime() === subject.exam_date.getTime()) {
                          console.log(element, daylist[0])
                          console.log(subject)
                          checkday = true
                          break
                        }
                      }
                    }
                  } else { //ยังไม่เคยคุม
                    let dataday = new Date(element[0])
                    let subjectday = subject.exam_date
                    if (dataday.getTime() === subjectday.getTime() && element[1] == subject.exam_time) {
                      var datebefore = new Date(Day[dayindex - 1][0])
                      var dateafter = new Date('1/1/1999')
                      if (dayindex + 1 != Day.length) {
                        dateafter = new Date(Day[dayindex + 1][0])
                        console.log('daydatab: ', dateafter, Day[dayindex + 1][1], Day[dayindex - 1][1], datebefore, dateafter.getTime() === subjectday.getTime(), datebefore.getTime() === subjectday.getTime());
                      }

                      if (dateafter.getTime() === subjectday.getTime() || datebefore.getTime() === subjectday.getTime()) {

                        const mySQLDateString = subjectday
                          .toJSON()
                          .slice(0, 19)
                          .replace("T", " ");
                        await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
                        VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${teacherdata.person_id}','${faculty_id}','${subject.subject_id}');
                        `);
                        await getdataFromSql(`
                        UPDATE t_condition
                        SET mark = ${count - teachercount},markcount= ${teachercount}
                        WHERE person_id = '${teacherdata.person_id}'`);

                        removeItemOnce(subjectList, subject);
                        removeItemOnce(Day, element);
                        checkday = false
                        checkdata = true
                      }


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
                    VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${teacherdata.person_id}','${faculty_id}','${subject.subject_id}');
                    `);
                  await getdataFromSql(`
                    UPDATE t_condition
                    SET mark = ${count - teachercount},markcount= ${teachercount}
                    WHERE person_id = '${teacherdata.person_id}'`);

                  teacherdata.condition_time = 0
                  removeItemOnce(subjectList, subject);
                  removeItemOnce(Day, element);
                  checkdata = true
                  break
                }
                if (checkdata == true) {
                  break
                }

              }
              if (checkday == true) {
                break
              }
              if (checkdata == true) {
                break
              }
            }
          }
          if (checkdata == true) {
            break
          }
        }
      }
    }
    // backup ที่เปลี่ยนข้อมูลไปกลับมา
    Examdaylist = JSON.parse(JSON.stringify(backupExamdaylist));

  }
  // }
  console.log("teacher normalsubject success")
  callback('teacher normalsubject success');
};




module.exports.officersubject = async function (req, callback) {
  console.log('officer subject')
  var year = req.body.year;
  var semester = req.body.semester;
  var mid_or_final = req.body.mid_or_final;
  // var faculty_id = req.body.faculty_id;
  // var year = 2563;
  // var semester = 2;
  // var mid_or_final = "M";
  // var faculty_id = "05";


  var NumExam = await countNumExam(
    `SELECT ceiling (((select sum(sumstdnum.countstdnum) FROM (SELECT ceiling(IF(sum(std_num)/30 < 2,2, sum(std_num)/30))as countstdnum from t_exam_room where t_exam_room.year = ? and t_exam_room.semester = ? and t_exam_room.mid_or_final = ? GROUP BY exam_date,exam_time,room_no ) as sumstdnum) -(SELECT count(*) from t_condition where condition_status = 2) )/ ( (SELECT count(*) from t_condition) - (SELECT count(*) from t_condition where condition_status = 2) - (SELECT count(*) from t_condition where condition_status = 0)) )as result`,
    year,
    semester,
    mid_or_final
  );
  var count = Math.floor(NumExam[0].result);
  await getdataFromSql(`
  insert into t_exam_committee_check (year, semester, mid_or_final, status, office_id, person_type)
  values (${year},${semester},'${mid_or_final}',2,'00',2)
`)

  // query ข้อมูลอาจารย์ตาม filter
  var teacher_list = await getdataFromSql(
    `SELECT * FROM t_condition where condition_status != 0  and person_type = 2  ORDER BY overexam `
  );

  getdataFromSql(
    `
      update t_condition
      set mark = 0,markcount = 0,overexam = 0
      where condition_status != 0  and person_type = 2
    `
  )

  getdataFromSql(
    `
      update t_condition
      set mark = 0,markcount = 0,overexam = 0
      where condition_status != 0  and person_type = 1
    `
  )
  // console.log(count)
  if (teacher_list.length > 0)
    console.log('teacherlist length :', teacher_list.length, count)

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
      day.setFullYear(day.getFullYear() - 543)
      daylist.push([daysInWeek[day.getDay()], element[1]]);
      day.setFullYear(day.getFullYear() + 543)
    }
    // console.log(daylist);
    dayInweekExam.push(daylist);
  });


  // for ตามจารย์
  for (let teacherindex = 0; teacherindex < teacher_list.length; teacherindex++) {


    // list ข้อมูล teacher ออกมา
    const teacherdata = teacher_list[teacherindex];

    //เอาชื่อวิชาทั้งหมดที่ยังไม่คุมมา


    var subjectList = await getdataFromSql(`
      SELECT t_exam_room.* FROM t_exam_room left JOIN t_exam_committee on t_exam_room.year = t_exam_committee.year and t_exam_room.semester = t_exam_committee.semester and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_room.building_no = t_exam_committee.building_no AND t_exam_room.room_no = t_exam_committee.room_no WHERE t_exam_committee.year is null and t_exam_committee.semester is null and t_exam_committee.mid_or_final is null and t_exam_committee.exam_date is null and t_exam_committee.exam_time is null and t_exam_committee.subject_id is null and t_exam_committee.building_no is null AND t_exam_committee.room_no is null and t_exam_room.room_no not in(select DISTINCT room_no FROM t_exam_committee) and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and t_exam_room.mid_or_final = '${mid_or_final}'
      `)

    if (!subjectList.length) {
      subjectList = await getdataFromSql(
        `SELECT DISTINCT t_exam_room.*,if( ceiling(sum(DISTINCT std_num)/30) < 2,2,ceiling(sum(DISTINCT std_num)/30)) as checkdata,count(*),sum(DISTINCT std_num) FROM t_exam_room 
        INNER JOIN t_exam_committee
        on t_exam_room.year = t_exam_committee.year
        and t_exam_room.semester = t_exam_committee.semester
        and t_exam_room.mid_or_final = t_exam_committee.mid_or_final
        and t_exam_room.exam_date = t_exam_committee.exam_date
        and t_exam_room.exam_time = t_exam_committee.exam_time
        and t_exam_room.subject_id = t_exam_committee.subject_id
        and t_exam_room.building_no = t_exam_committee.building_no
        AND t_exam_room.room_no = t_exam_committee.room_no
        WHERE  t_exam_room.year = ${year} and
        t_exam_room.semester = ${semester} and
        t_exam_room.mid_or_final = '${mid_or_final}'
        GROUP by t_exam_room.year
        ,t_exam_room.semester
        , t_exam_room.mid_or_final
        , t_exam_room.exam_date
        , t_exam_room.exam_time
        , t_exam_room.room_no  
        having checkdata > count(*)
        `
      )
      // กรณีที่ไม่เหลือวิชาให้จัดเลย
      if (subjectList.length == 0) {
        await getdataFromSql(`
          UPDATE t_condition
          SET mark = ${count},markcount= ${0}
          WHERE person_type = 2 and markcount != 0`);
        break;
      }
    }

    //เช็ค condition week
    var conditionweek = teacherdata.condition_week;
    // console.log(conditionweek)
    if (conditionweek != 0) {
      for (let index = 0; index < 4; index++) {
        if (conditionweek != index + 1) {
          Examdaylist[index] = [];
          dayInweekExam[index] = [];
        }
      }
    }


    //เช็คช่วงเวลา กรณี เช้า หรือ บ่าย
    if (teacherdata.condition_time == 1 || teacherdata.condition_time == 2) {
      for (let index = 0; index < 4; index++) {
        var examdayarray = Examdaylist[index];
        var dayInweekExamarray = dayInweekExam[index];
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
    if (teacherdata.condition_time == 3) {
      let exam_committeedata = await getdataFromSql(
        `select exam_date,exam_time from t_exam_committee where person_id = ${teacherdata.person_id}  and year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}'`
      );
      if (exam_committeedata.length > 0) {
        for (let index = 0; index < exam_committeedata.length; index++) {
          const element = exam_committeedata[index];
          let daydata = new Date(element.exam_date)
          const mySQLDateString = daydata
            .toJSON()
            .slice(0, 19)
            .replace("T", " ");
          let daylist = await getdataFromSql(
            `select * from t_exam_committee where exam_date = '${mySQLDateString}' and person_id = ${teacherdata.person_id}`
          );
          if (daylist.length > 1) {
            timelist.push(
              element.exam_time == 1 ? [element.exam_date, "2"] : [element.exam_date, "1"]
            );
          }
        }
      }
    }

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
        var daydata = examdayweek[dayindex]
        // for ตามวันที่ไม่ว่าง

        for (
          let notfreeindex = 0; notfreeindex < notfreedayinweekdata.length; notfreeindex++
        ) {
          const notfreeday = notfreedayinweekdata[notfreeindex].split("x"); //[2,1]
          if (
            daysInWeek[notfreeday[0] - 1] == examday[0] && notfreeday[1] == examday[1]
          ) {
            indexlist.push(daydata);
            // indexlist.push(examdayweek[dayindex]);
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

    // console.log('notfree in dex :', notfreedayindex)
    for (let index = 0; index < 4; index++) {
      const Examdaylistdata = Examdaylist[index];
      const notfreedayweek = notfreedayindex[index];
      for (let count = 0; count < notfreedayweek.length; count++) {
        let index = notfreedayweek[count];
        removeItemOnce(Examdaylistdata, index);
      }
    }
    // console.log(subjectList.length,teacherdata.person_id)
    // console.log(Examdaylist)

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
      `SELECT * FROM t_exam_committee where year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}' and faculty_id = '${teacherdata.faculty_id}' and person_id = '${teacherdata.person_id}' `
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

    if (conditionweekend == 1)
      var weekenddaylist = [
        ...weekenddayweekist[0],
        ...weekenddayweekist[1],
        ...weekenddayweekist[2],
        ...weekenddayweekist[3],
      ];

    //จัดผู้คุม
    var checkroomempty = false
    var reset = 0;
    var teachercount = 0
    // ทำสองครั้งก่อน
    for (let index = 0; index < count - 1; index++) {
      // console.log(index, count, teacherdata.person_id)
      if (teacherdata.condition_status == 2) {
        // console.log('person_id: ',teacherdata.person_id,teacherdata.mark)
        var checkstatus = await getdataFromSql(`select * from t_exam_committee where year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}' and person_id = ${teacherdata.person_id}`)
        // console.log(checkstatus.length)
        if (checkstatus.length == 1) {
          break;
        }

      }
      // var count = teacherdata.mark
      // console.log(teacherdata.person_id, 'mark :', count, 'index :', index)
      if (checkroomempty == false) {
        subjectList = await getdataFromSql(`
        SELECT t_exam_room.* FROM t_exam_room left JOIN t_exam_committee on t_exam_room.year = t_exam_committee.year and t_exam_room.semester = t_exam_committee.semester and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_room.building_no = t_exam_committee.building_no AND t_exam_room.room_no = t_exam_committee.room_no WHERE t_exam_committee.year is null and t_exam_committee.semester is null and t_exam_committee.mid_or_final is null and t_exam_committee.exam_date is null and t_exam_committee.exam_time is null and t_exam_committee.subject_id is null and t_exam_committee.building_no is null AND t_exam_committee.room_no is null and t_exam_room.room_no not in(select DISTINCT room_no FROM t_exam_committee) and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and t_exam_room.mid_or_final = '${mid_or_final}'
        `)
        if (subjectList.length == 0) {
          checkroomempty = true
          subjectList = await getdataFromSql(
            `SELECT DISTINCT t_exam_room.*,if( ceiling(sum(DISTINCT std_num)/30) < 2,2,ceiling(sum(DISTINCT std_num)/30)) as checkdata,count(*),sum(DISTINCT std_num) FROM t_exam_room 
            INNER JOIN t_exam_committee
            on t_exam_room.year = t_exam_committee.year
            and t_exam_room.semester = t_exam_committee.semester
            and t_exam_room.mid_or_final = t_exam_committee.mid_or_final
            and t_exam_room.exam_date = t_exam_committee.exam_date
            and t_exam_room.exam_time = t_exam_committee.exam_time
            and t_exam_room.subject_id = t_exam_committee.subject_id
            and t_exam_room.building_no = t_exam_committee.building_no
            AND t_exam_room.room_no = t_exam_committee.room_no
            WHERE  t_exam_room.year = ${year} and
            t_exam_room.semester = ${semester} and
            t_exam_room.mid_or_final = '${mid_or_final}'
            GROUP by t_exam_room.year
            ,t_exam_room.semester
            , t_exam_room.mid_or_final
            , t_exam_room.exam_date
            , t_exam_room.exam_time
            , t_exam_room.room_no  
            having checkdata > count(*)
            `            )
        }
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
      }

      // console.log(index,count,teacherdata.person_id,subjectList.length)



      // ถ้า weekend มี
      if (conditionweekend == 1) {
        console.log('weekend')
        shuffle(subjectList);
        shuffle(weekenddaylist);
        checkdata = false
        // list วิชามา
        for (let subjectindex = 0; subjectindex < subjectList.length; subjectindex++) {
          let subject = subjectList[subjectindex];
          var checkday = false
          //list day มา 
          for (let dayindex = 0; dayindex < Day.length; dayindex++) {
            const element = Day[dayindex];
            let dateday = new Date(element[0])
            //check ว่าวันสุดสัปดาห์มั้ย และเวลาสอบตรงกันหรือป่าว
            if ((dateday.getDay() == 0 || dateday.getDay() == 6) && dateday.getTime() === subject.exam_date.getTime() && element[1] == subject.exam_time) {
              //เงื่อนไขเวลา case เช้าบ่ายในวันเดียวกัน ถ้าเจอวันสุดสัปดาห์
              if (teacherdata.condition_time == 3) {
                let exam_committeedata = await getdataFromSql(
                  `select distinct exam_date from t_exam_committee where person_id = ${teacherdata.person_id}  and year = ${year} and semester = ${semester} and mid_or_final = ${mid_or_final}`
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
                      if (dateday.getTime() === day.getTime() && daylist[0].exam_time != element[1]) {
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
                  VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${teacherdata.person_id}','${faculty_id}','${subject.subject_id}');
                  `);
                  await getdataFromSql(`
                  UPDATE t_condition
                  SET mark = ${count - teachercount},markcount= ${teachercount}
                  WHERE person_id = '${teacherdata.person_id}'`);

                  removeItemOnce(subjectList, subject);
                  removeItemOnce(Day, element);
                  checkdata = true
                  break
                }
              } else {
                checkday = true
              }
            }
            if (checkday == true) {
              let subjectday = subject.exam_date
              const mySQLDateString = subjectday
                .toJSON()
                .slice(0, 19)
                .replace("T", " ");
              await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
              VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${teacherdata.person_id}','${faculty_id}','${subject.subject_id}');
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
          if (checkday == true || checkdata == true) {
            break
          }
        }

      } else {
        console.log('not weekend', teacherdata.condition_time)
        shuffle(subjectList);
        for (let index = 0; index < subjectList.length; index++) {
          const subject = subjectList[index];
          var checkdata = false
          if (teacherdata.condition_time != 3) {
            //case เวลาไรก็ได้
            for (let dayindex = 0; dayindex < Day.length; dayindex++) {
              let daydata = Day[dayindex];
              // console.log(daydata,subject.exam_date)
              if (new Date(daydata[0]).getTime() === subject.exam_date.getTime() && subject.exam_time == daydata[1]) {
                // console.log('condition_time != 2')
                checkdata = true
                const mySQLDateString = subject.exam_date
                  .toJSON()
                  .slice(0, 19)
                  .replace("T", " ");
                // console.log(mySQLDateString, subject.exam_time, subject.year)
                await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
              VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','2','${teacherdata.person_id}','${teacherdata.faculty_id}','${subject.subject_id}');
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
              if (index == subjectList.length - 1 && checkroomempty == false && reset == 0) {
                subjectList = await getdataFromSql(
                  `
                  SELECT DISTINCT t_exam_room.*,if( ceiling(sum(DISTINCT std_num)/30) < 2,2,ceiling(sum(DISTINCT std_num)/30)) as checkdata,count(*),sum(DISTINCT std_num) FROM t_exam_room 
INNER JOIN t_exam_committee
on t_exam_room.year = t_exam_committee.year
and t_exam_room.semester = t_exam_committee.semester
and t_exam_room.mid_or_final = t_exam_committee.mid_or_final
and t_exam_room.exam_date = t_exam_committee.exam_date
and t_exam_room.exam_time = t_exam_committee.exam_time
and t_exam_room.subject_id = t_exam_committee.subject_id
and t_exam_room.building_no = t_exam_committee.building_no
AND t_exam_room.room_no = t_exam_committee.room_no
WHERE  t_exam_room.year = ${year} and
t_exam_room.semester = ${semester} and
t_exam_room.mid_or_final = '${mid_or_final}'
GROUP by t_exam_room.year
,t_exam_room.semester
, t_exam_room.mid_or_final
, t_exam_room.exam_date
, t_exam_room.exam_time
, t_exam_room.room_no  
having checkdata > count(*)
                  `
                )
                index = -1
                reset = 1
                continue
              }
            }
          } else {
            shuffle(subjectList);
            console.log(teacherdata.condition_time)
            // list วิชามา
            for (let subjectindex = 0; subjectindex < subjectList.length; subjectindex++) {
              let subject = subjectList[subjectindex];
              var checkday = false
              //list day มา 
              for (let dayindex = 0; dayindex < Day.length; dayindex++) {
                const element = Day[dayindex];
                //เงื่อนไขเวลา case เช้าบ่ายในวันเดียวกัน ถ้าเจอวันสุดสัปดาห์
                if (teacherdata.condition_time == 3) {
                  console.log('วันเดียวกัน')
                  let exam_committeedata = await getdataFromSql(
                    `select distinct exam_date from t_exam_committee where person_id = ${teacherdata.person_id}  and year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}'`
                  );
                  //เคยคุมแล้ว
                  if (exam_committeedata.length > 0) {
                    // list วันที่คุมมา
                    for (let index = 0; index < exam_committeedata.length; index++) {

                      const data = exam_committeedata[index];
                      let daydata = new Date(data.exam_date)
                      const mySQLDateString = daydata
                        .toJSON()
                        .slice(0, 19)
                        .replace("T", " ");
                      let daylist = await getdataFromSql(
                        `select * from t_exam_committee where exam_date = '${mySQLDateString}' and person_id = ${teacherdata.person_id}`
                      );

                      // กรณีที่คุมแค่เวลาเดียว
                      if (daylist.length == 1) {
                        let day = new Date(daylist[0].exam_date)
                        let datadate = new Date(element[0])
                        //check ว่าเจอวันตรงกันมั้ย
                        if (day.getTime() === datadate.getTime() && daylist[0].exam_time != element[1] && subject.exam_time != daylist[0].exam_time && datadate.getTime() === subject.exam_date.getTime()) {
                          console.log(element, daylist[0])
                          console.log(subject)
                          checkday = true
                          break
                        }
                      }
                    }
                  } else { //ยังไม่เคยคุม
                    let dataday = new Date(element[0])
                    let subjectday = subject.exam_date
                    // console.log(dataday, element)
                    if (dataday.getTime() === subjectday.getTime() && element[1] == subject.exam_time) {

                      var datebefore = new Date(Day[dayindex - 1][0])
                      var dateafter = null
                      if (dayindex + 1 != Day.length) {
                        dateafter = new Date(Day[dayindex + 1][0])
                        console.log('daydatab: ', dateafter, Day[dayindex + 1][1], Day[dayindex - 1][1], datebefore, dateafter.getTime() === subjectday.getTime(), datebefore.getTime() === subjectday.getTime());
                      }

                      if (dateafter.getTime === subjectday.getTime() || datebefore.getTime() === subjectday.getTime()) {

                        const mySQLDateString = subjectday
                          .toJSON()
                          .slice(0, 19)
                          .replace("T", " ");
                        await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
                        VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${teacherdata.person_id}','${teacherdata.faculty_id}','${subject.subject_id}');
                        `);
                        await getdataFromSql(`
                        UPDATE t_condition
                        SET mark = ${count - teachercount},markcount= ${teachercount}
                        WHERE person_id = '${teacherdata.person_id}'`);

                        removeItemOnce(subjectList, subject);
                        removeItemOnce(Day, element);
                        checkday = false
                        checkdata = true


                      }
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
                    VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','2','${teacherdata.person_id}','${teacherdata.faculty_id}','${subject.subject_id}');
                    `);
                  await getdataFromSql(`
                    UPDATE t_condition
                    SET mark = ${count - teachercount},markcount= ${teachercount}
                    WHERE person_id = '${teacherdata.person_id}'`);
                  removeItemOnce(subjectList, subject);
                  removeItemOnce(Day, element);
                  break
                }
                if (checkdata == true) {
                  break
                }

              }
              if (checkday == true) {
                break
              }
              if (checkdata == true) {
                break
              }
            }
          }

          if (checkdata == true) {
            break
          }
        }
      }
      // สุ่มจนหมดทุกวิชาแล้ว
      if (subjectList.length == 0) {
        await getdataFromSql(`
          UPDATE t_condition
          SET mark = ${count}
          WHERE markcount = 0  and person_type = 2`);
        break;
      }
    }


    // backup ที่เปลี่ยนข้อมูลไปกลับมา
    Examdaylist = JSON.parse(JSON.stringify(backupExamdaylist));

  }


  // shuffle(teacher_list)
  for (let teacherindex = 0; teacherindex < teacher_list.length; teacherindex++) {


    // list ข้อมูล teacher ออกมา
    const teacherdata = teacher_list[teacherindex];

    //เอาชื่อวิชาทั้งหมดที่ยังไม่คุมมา


    var subjectList = await getdataFromSql(`
      SELECT t_exam_room.* FROM t_exam_room left JOIN t_exam_committee on t_exam_room.year = t_exam_committee.year and t_exam_room.semester = t_exam_committee.semester and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_room.building_no = t_exam_committee.building_no AND t_exam_room.room_no = t_exam_committee.room_no WHERE t_exam_committee.year is null and t_exam_committee.semester is null and t_exam_committee.mid_or_final is null and t_exam_committee.exam_date is null and t_exam_committee.exam_time is null and t_exam_committee.subject_id is null and t_exam_committee.building_no is null AND t_exam_committee.room_no is null and t_exam_room.room_no not in(select DISTINCT room_no FROM t_exam_committee) and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and t_exam_room.mid_or_final = '${mid_or_final}'
      `)

    if (!subjectList.length) {
      subjectList = await getdataFromSql(
        `                SELECT DISTINCT t_exam_room.*,if( ceiling(sum(DISTINCT std_num)/30) < 2,2,ceiling(sum(DISTINCT std_num)/30)) as checkdata,count(*),sum(DISTINCT std_num) FROM t_exam_room 
        INNER JOIN t_exam_committee
        on t_exam_room.year = t_exam_committee.year
        and t_exam_room.semester = t_exam_committee.semester
        and t_exam_room.mid_or_final = t_exam_committee.mid_or_final
        and t_exam_room.exam_date = t_exam_committee.exam_date
        and t_exam_room.exam_time = t_exam_committee.exam_time
        and t_exam_room.subject_id = t_exam_committee.subject_id
        and t_exam_room.building_no = t_exam_committee.building_no
        AND t_exam_room.room_no = t_exam_committee.room_no
        WHERE  t_exam_room.year = ${year} and
        t_exam_room.semester = ${semester} and
        t_exam_room.mid_or_final = '${mid_or_final}'
        GROUP by t_exam_room.year
        ,t_exam_room.semester
        , t_exam_room.mid_or_final
        , t_exam_room.exam_date
        , t_exam_room.exam_time
        , t_exam_room.room_no  
        having checkdata > count(*)
        `
      )
      // กรณีที่ไม่เหลือวิชาให้จัดเลย
      if (subjectList.length == 0) {
        await getdataFromSql(`
          UPDATE t_condition
          SET mark = ${count},markcount= ${0}
          WHERE person_type = 2 and markcount != 0`);
        break;
      }
    }

    //เช็ค condition week
    var conditionweek = teacherdata.condition_week;
    // console.log(conditionweek)
    if (conditionweek != 0) {
      for (let index = 0; index < 4; index++) {
        if (conditionweek != index + 1) {
          Examdaylist[index] = [];
          dayInweekExam[index] = [];
        }
      }
    }


    //เช็คช่วงเวลา กรณี เช้า หรือ บ่าย
    if (teacherdata.condition_time == 1 || teacherdata.condition_time == 2) {
      for (let index = 0; index < 4; index++) {
        var examdayarray = Examdaylist[index];
        var dayInweekExamarray = dayInweekExam[index];
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
    if (teacherdata.condition_time == 3) {
      let exam_committeedata = await getdataFromSql(
        `select exam_date,exam_time from t_exam_committee where person_id = ${teacherdata.person_id}  and year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}'`
      );
      if (exam_committeedata.length > 0) {
        for (let index = 0; index < exam_committeedata.length; index++) {
          const element = exam_committeedata[index];
          let daydata = new Date(element.exam_date)
          const mySQLDateString = daydata
            .toJSON()
            .slice(0, 19)
            .replace("T", " ");
          let daylist = await getdataFromSql(
            `select * from t_exam_committee where exam_date = '${mySQLDateString}' and person_id = ${teacherdata.person_id}`
          );
          if (daylist.length > 1) {
            timelist.push(
              element.exam_time == 1 ? [element.exam_date, "2"] : [element.exam_date, "1"]
            );
          }
        }
      }
    }

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
        var daydata = examdayweek[dayindex]
        // for ตามวันที่ไม่ว่าง

        for (
          let notfreeindex = 0; notfreeindex < notfreedayinweekdata.length; notfreeindex++
        ) {
          const notfreeday = notfreedayinweekdata[notfreeindex].split("x"); //[2,1]
          if (
            daysInWeek[notfreeday[0] - 1] == examday[0] && notfreeday[1] == examday[1]
          ) {
            indexlist.push(daydata);
            // indexlist.push(examdayweek[dayindex]);
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

    // console.log('notfree in dex :', notfreedayindex)
    for (let index = 0; index < 4; index++) {
      const Examdaylistdata = Examdaylist[index];
      const notfreedayweek = notfreedayindex[index];
      for (let count = 0; count < notfreedayweek.length; count++) {
        let index = notfreedayweek[count];
        removeItemOnce(Examdaylistdata, index);
      }
    }
    // console.log(subjectList.length,teacherdata.person_id)
    // console.log(Examdaylist)

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
      `SELECT * FROM t_exam_committee where year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}' and faculty_id = '${teacherdata.faculty_id}' and person_id = '${teacherdata.person_id}' `
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

    if (conditionweekend == 1)
      var weekenddaylist = [
        ...weekenddayweekist[0],
        ...weekenddayweekist[1],
        ...weekenddayweekist[2],
        ...weekenddayweekist[3],
      ];

    //จัดผู้คุม
    var checkroomempty = false
    var reset = 0;
    var teachercount = count
    // ทำสองครั้งก่อน
    for (let index = 0; index < 1; index++) {

      // console.log(index, count, teacherdata.person_id, count - teachercount, teachercount)
      if (teacherdata.condition_status == 2) {
        // console.log('person_id: ',teacherdata.person_id,teacherdata.mark)
        var checkstatus = await getdataFromSql(`select * from t_exam_committee where year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}' and person_id = ${teacherdata.person_id}`)
        // console.log(checkstatus.length)
        if (checkstatus.length == 1) {
          break;
        }

      }
      // var count = teacherdata.mark
      // console.log(teacherdata.person_id, 'mark :', count, 'index :', index)
      if (checkroomempty == false) {
        subjectList = await getdataFromSql(`
        SELECT t_exam_room.* FROM t_exam_room left JOIN t_exam_committee on t_exam_room.year = t_exam_committee.year and t_exam_room.semester = t_exam_committee.semester and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_room.building_no = t_exam_committee.building_no AND t_exam_room.room_no = t_exam_committee.room_no WHERE t_exam_committee.year is null and t_exam_committee.semester is null and t_exam_committee.mid_or_final is null and t_exam_committee.exam_date is null and t_exam_committee.exam_time is null and t_exam_committee.subject_id is null and t_exam_committee.building_no is null AND t_exam_committee.room_no is null and t_exam_room.room_no not in(select DISTINCT room_no FROM t_exam_committee) and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and t_exam_room.mid_or_final = '${mid_or_final}'
        `)
        if (subjectList.length == 0) {
          checkroomempty = true
          subjectList = await getdataFromSql(
            `               
            SELECT DISTINCT t_exam_room.*,if( ceiling(sum(DISTINCT std_num)/30) < 2,2,ceiling(sum(DISTINCT std_num)/30)) as checkdata,count(*),sum(DISTINCT std_num) FROM t_exam_room 
            INNER JOIN t_exam_committee
            on t_exam_room.year = t_exam_committee.year
            and t_exam_room.semester = t_exam_committee.semester
            and t_exam_room.mid_or_final = t_exam_committee.mid_or_final
            and t_exam_room.exam_date = t_exam_committee.exam_date
            and t_exam_room.exam_time = t_exam_committee.exam_time
            and t_exam_room.subject_id = t_exam_committee.subject_id
            and t_exam_room.building_no = t_exam_committee.building_no
            AND t_exam_room.room_no = t_exam_committee.room_no
            WHERE  t_exam_room.year = ${year} and
            t_exam_room.semester = ${semester} and
            t_exam_room.mid_or_final = '${mid_or_final}'
            GROUP by t_exam_room.year
            ,t_exam_room.semester
            , t_exam_room.mid_or_final
            , t_exam_room.exam_date
            , t_exam_room.exam_time
            , t_exam_room.room_no  
            having checkdata > count(*)
            `            )
        }
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
      }

      // console.log(index,count,teacherdata.person_id,subjectList.length)



      // ถ้า weekend มี
      if (conditionweekend == 1) {
        console.log('weekend')
        shuffle(subjectList);
        shuffle(weekenddaylist);
        checkdata = false
        // list วิชามา
        for (let subjectindex = 0; subjectindex < subjectList.length; subjectindex++) {
          let subject = subjectList[subjectindex];
          var checkday = false
          //list day มา 
          for (let dayindex = 0; dayindex < Day.length; dayindex++) {
            const element = Day[dayindex];
            let dateday = new Date(element[0])
            //check ว่าวันสุดสัปดาห์มั้ย และเวลาสอบตรงกันหรือป่าว
            if ((dateday.getDay() == 0 || dateday.getDay() == 6) && dateday.getTime() === subject.exam_date.getTime() && element[1] == subject.exam_time) {
              //เงื่อนไขเวลา case เช้าบ่ายในวันเดียวกัน ถ้าเจอวันสุดสัปดาห์
              if (teacherdata.condition_time == 3) {
                let exam_committeedata = await getdataFromSql(
                  `select distinct exam_date from t_exam_committee where person_id = ${teacherdata.person_id}  and year = ${year} and semester = ${semester} and mid_or_final = ${mid_or_final}`
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
                      if (dateday.getTime() === day.getTime() && daylist[0].exam_time != element[1]) {
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
                  VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${teacherdata.person_id}','${faculty_id}','${subject.subject_id}');
                  `);
                  await getdataFromSql(`
                  UPDATE t_condition
                  SET mark = ${count - teachercount},markcount= ${teachercount}
                  WHERE person_id = '${teacherdata.person_id}'`);

                  removeItemOnce(subjectList, subject);
                  removeItemOnce(Day, element);
                  checkdata = true
                  break
                }
              } else {
                checkday = true
              }
            }
            if (checkday == true) {
              let subjectday = subject.exam_date
              const mySQLDateString = subjectday
                .toJSON()
                .slice(0, 19)
                .replace("T", " ");
              await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
              VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${teacherdata.person_id}','${faculty_id}','${subject.subject_id}');
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
          if (checkday == true || checkdata == true) {
            break
          }
        }

      } else {
        // console.log('not weekend', teacherdata.condition_time)
        shuffle(subjectList);
        for (let index = 0; index < subjectList.length; index++) {
          const subject = subjectList[index];
          var checkdata = false
          if (teacherdata.condition_time != 3) {
            //case เวลาไรก็ได้
            for (let dayindex = 0; dayindex < Day.length; dayindex++) {
              let daydata = Day[dayindex];
              // console.log(daydata,subject.exam_date)
              if (new Date(daydata[0]).getTime() === subject.exam_date.getTime() && subject.exam_time == daydata[1]) {
                // console.log('condition_time != 2')
                checkdata = true
                const mySQLDateString = subject.exam_date
                  .toJSON()
                  .slice(0, 19)
                  .replace("T", " ");
                // console.log(mySQLDateString, subject.exam_time, subject.year)
                await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
              VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','2','${teacherdata.person_id}','${teacherdata.faculty_id}','${subject.subject_id}');
              `);
                await getdataFromSql(`
              UPDATE t_condition
              SET mark = ${count - teachercount},markcount= ${teachercount}
              WHERE person_id = '${teacherdata.person_id}'`);
                await getdataFromSql(`
              UPDATE t_condition
              SET overexam = 1
              WHERE person_id = '${teacherdata.person_id}'`);
                // console.log(teachercount);
                removeItemOnce(subjectList, subject);
                removeItemOnce(Day, daydata);
                break
              }
              if (index == subjectList.length - 1 && checkroomempty == false && reset == 0) {
                subjectList = await getdataFromSql(
                  `              SELECT DISTINCT t_exam_room.*,if( ceiling(sum(DISTINCT std_num)/30) < 2,2,ceiling(sum(DISTINCT std_num)/30)) as checkdata,count(*),sum(DISTINCT std_num) FROM t_exam_room 
                  INNER JOIN t_exam_committee
                  on t_exam_room.year = t_exam_committee.year
                  and t_exam_room.semester = t_exam_committee.semester
                  and t_exam_room.mid_or_final = t_exam_committee.mid_or_final
                  and t_exam_room.exam_date = t_exam_committee.exam_date
                  and t_exam_room.exam_time = t_exam_committee.exam_time
                  and t_exam_room.subject_id = t_exam_committee.subject_id
                  and t_exam_room.building_no = t_exam_committee.building_no
                  AND t_exam_room.room_no = t_exam_committee.room_no
                  WHERE  t_exam_room.year = ${year} and
                  t_exam_room.semester = ${semester} and
                  t_exam_room.mid_or_final = '${mid_or_final}'
                  GROUP by t_exam_room.year
                  ,t_exam_room.semester
                  , t_exam_room.mid_or_final
                  , t_exam_room.exam_date
                  , t_exam_room.exam_time
                  , t_exam_room.room_no  
                  having checkdata > count(*)
                  `
                )
                index = -1
                reset = 1
                continue
              }
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
                if (teacherdata.condition_time == 3) {
                  let exam_committeedata = await getdataFromSql(
                    `select distinct exam_date from t_exam_committee where person_id = ${teacherdata.person_id}  and year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}'`
                  );
                  //เคยคุมแล้ว
                  if (exam_committeedata.length > 0) {
                    // list วันที่คุมมา
                    for (let index = 0; index < exam_committeedata.length; index++) {

                      const data = exam_committeedata[index];
                      let daydata = new Date(data.exam_date)
                      const mySQLDateString = daydata
                        .toJSON()
                        .slice(0, 19)
                        .replace("T", " ");
                      let daylist = await getdataFromSql(
                        `select * from t_exam_committee where exam_date = '${mySQLDateString}' and person_id = ${teacherdata.person_id}`
                      );

                      // กรณีที่คุมแค่เวลาเดียว
                      if (daylist.length == 1) {
                        let day = new Date(daylist[0].exam_date)
                        let datadate = new Date(element[0])
                        //check ว่าเจอวันตรงกันมั้ย
                        if (day.getTime() === datadate.getTime() && daylist[0].exam_time != element[1] && subject.exam_time != daylist[0].exam_time && datadate.getTime() === subject.exam_date.getTime()) {
                          console.log(element, daylist[0])
                          console.log(subject)
                          checkday = true
                          break
                        }
                      }
                    }
                  } else { //ยังไม่เคยคุม
                    let dataday = new Date(element[0])
                    let subjectday = subject.exam_date
                    console.log(dataday, element)
                    if (dataday.getTime() === subjectday.getTime() && element[1] == subject.exam_time) {

                      var datebefore = new Date(Day[dayindex - 1][0])
                      var dateafter = null
                      if (dayindex + 1 != Day.length) {
                        dateafter = new Date(Day[dayindex + 1][0])
                        console.log('daydatab: ', dateafter, Day[dayindex + 1][1], Day[dayindex - 1][1], datebefore, dateafter.getTime() === subjectday.getTime(), datebefore.getTime() === subjectday.getTime());
                      }

                      if (dateafter.getTime === subjectday.getTime() || datebefore.getTime() === subjectday.getTime()) {

                        const mySQLDateString = subjectday
                          .toJSON()
                          .slice(0, 19)
                          .replace("T", " ");
                        await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
                        VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${teacherdata.person_id}','${teacherdata.faculty_id}','${subject.subject_id}');
                        `);
                        await getdataFromSql(`
                        UPDATE t_condition
                        SET mark = ${count - teachercount},markcount= ${teachercount}
                        WHERE person_id = '${teacherdata.person_id}'`);
                        await getdataFromSql(`
                        UPDATE t_condition
                        SET overexam = 1
                        WHERE person_id = '${teacherdata.person_id}'`);

                        removeItemOnce(subjectList, subject);
                        removeItemOnce(Day, element);
                        checkday = false


                      }
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
                    VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','2','${teacherdata.person_id}','${teacherdata.faculty_id}','${subject.subject_id}');
                    `);
                  await getdataFromSql(`
                    UPDATE t_condition
                    SET mark = ${count - teachercount},markcount= ${teachercount}
                    WHERE person_id = '${teacherdata.person_id}'`);
                  await getdataFromSql(`
                    UPDATE t_condition
                    SET overexam = 1
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
          if (checkdata == true) {
            break
          }
        }
      }
      // สุ่มจนหมดทุกวิชาแล้ว
      if (subjectList.length == 0) {
        await getdataFromSql(`
          UPDATE t_condition
          SET mark = ${count}
          WHERE markcount = 0  and person_type = 2`);
        break;
      }
    }


    // backup ที่เปลี่ยนข้อมูลไปกลับมา
    Examdaylist = JSON.parse(JSON.stringify(backupExamdaylist));

  }


  console.log('officer exam_committee success')
  callback('officer exam_committee success');
};

module.exports.teacher_exam = async function (req, callback) {

  console.log('teacher exam')
  // var year = 2563;
  // var semester = 2;
  // var mid_or_final = "M";
  var year = req.body.year
  var semester = req.body.semester
  var mid_or_final = req.body.mid_or_final
  var person_id = req.body.person_id
  var faculty_id = req.body.faculty_id
  // query ข้อมูลอาจารย์ตาม filter

  console.log(req.body)
  // return 0
  // callback(1)
  var teacher_list = await getdataFromSql(
    `SELECT * FROM t_condition where condition_status != 0  and person_id = ${person_id}`
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

  // var backupExamdaylist = JSON.parse(JSON.stringify(Examdaylist));

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
      day.setFullYear(day.getFullYear() - 543)
      daylist.push([daysInWeek[day.getDay()], element[1]]);
      day.setFullYear(day.getFullYear() + 543)
    }
    // console.log(daylist);
    dayInweekExam.push(daylist);
  });


  // list ข้อมูล teacher ออกมา
  const teacherdata = teacher_list[0];

  //เอาชื่อวิชาทั้งหมดที่ยังไม่คุมมา


  var subjectList = await getdataFromSql(`
    SELECT t_exam_room.* FROM t_exam_room left JOIN t_exam_committee on t_exam_room.year = t_exam_committee.year and t_exam_room.semester = t_exam_committee.semester and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_room.building_no = t_exam_committee.building_no AND t_exam_room.room_no = t_exam_committee.room_no WHERE t_exam_committee.year is null and t_exam_committee.semester is null and t_exam_committee.mid_or_final is null and t_exam_committee.exam_date is null and t_exam_committee.exam_time is null and t_exam_committee.subject_id is null and t_exam_committee.building_no is null AND t_exam_committee.room_no is null and t_exam_room.room_no not in(select DISTINCT room_no FROM t_exam_committee) and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and t_exam_room.mid_or_final = '${mid_or_final}'
    `)

  if (!subjectList.length) {
    subjectList = await getdataFromSql(
      `SELECT t_exam_room.* FROM t_exam_room left JOIN t_exam_committee on t_exam_room.year = t_exam_committee.year and t_exam_room.semester = t_exam_committee.semester and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_room.building_no = t_exam_committee.building_no AND t_exam_room.room_no = t_exam_committee.room_no WHERE t_exam_committee.year is null and t_exam_committee.semester is null and t_exam_committee.mid_or_final is null and t_exam_committee.exam_date is null and t_exam_committee.exam_time is null and t_exam_committee.subject_id is null and t_exam_committee.building_no is null AND t_exam_committee.room_no is null and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and t_exam_room.mid_or_final = '${mid_or_final}' `
    )
    if (subjectList.length == 0) {
      subjectList = await getdataFromSql(`
      SELECT DISTINCT t_exam_room.*,if( ceiling(sum(DISTINCT std_num)/30) < 2,2,ceiling(sum(DISTINCT std_num)/30)) as checkdata,count(*),sum(DISTINCT std_num) FROM t_exam_room 
      INNER JOIN t_exam_committee
      on t_exam_room.year = t_exam_committee.year
      and t_exam_room.semester = t_exam_committee.semester
      and t_exam_room.mid_or_final = t_exam_committee.mid_or_final
      and t_exam_room.exam_date = t_exam_committee.exam_date
      and t_exam_room.exam_time = t_exam_committee.exam_time
      and t_exam_room.subject_id = t_exam_committee.subject_id
      and t_exam_room.building_no = t_exam_committee.building_no
      AND t_exam_room.room_no = t_exam_committee.room_no
      WHERE  t_exam_room.year = ${year} and
      t_exam_room.semester = ${semester} and
      t_exam_room.mid_or_final = '${mid_or_final}'
      GROUP by t_exam_room.year
      ,t_exam_room.semester
      , t_exam_room.mid_or_final
      , t_exam_room.exam_date
      , t_exam_room.exam_time
      , t_exam_room.room_no  
      having checkdata > count(*)    `)

      if (subjectList.length == 0) {
        // break;
      }
    }
  }

  //เช็ค condition week
  var conditionweek = teacherdata.condition_week;
  // console.log(conditionweek)
  if (conditionweek != 0) {
    for (let index = 0; index < 4; index++) {
      if (conditionweek != index + 1) {
        Examdaylist[index] = [];
        dayInweekExam[index] = [];
      }
    }
  }


  //เช็คช่วงเวลา กรณี เช้า หรือ บ่าย
  if (teacherdata.condition_time == 1 || teacherdata.condition_time == 2) {
    for (let index = 0; index < 4; index++) {
      var examdayarray = Examdaylist[index];
      var dayInweekExamarray = dayInweekExam[index];
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

  if (teacherdata.condition_time == 3) {
    let exam_committeedata = await getdataFromSql(
      `select exam_date,exam_time from t_exam_committee where person_id = ${teacherdata.person_id}  and year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}'`
    );
    if (exam_committeedata.length > 0) {
      for (let index = 0; index < exam_committeedata.length; index++) {
        const element = exam_committeedata[index];
        let daydata = new Date(element.exam_date)
        const mySQLDateString = daydata
          .toJSON()
          .slice(0, 19)
          .replace("T", " ");
        let daylist = await getdataFromSql(
          `select * from t_exam_committee where exam_date = '${mySQLDateString}' and person_id = ${teacherdata.person_id}`
        );
        if (daylist.length > 1) {
          timelist.push(
            element.exam_time == 1 ? [element.exam_date, "2"] : [element.exam_date, "1"]
          );
        }
      }
    }
  }

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
      var daydata = examdayweek[dayindex]
      // for ตามวันที่ไม่ว่าง

      for (
        let notfreeindex = 0; notfreeindex < notfreedayinweekdata.length; notfreeindex++
      ) {
        const notfreeday = notfreedayinweekdata[notfreeindex].split("x"); //[2,1]
        if (
          daysInWeek[notfreeday[0] - 1] == examday[0] && notfreeday[1] == examday[1]
        ) {
          indexlist.push(daydata);
          // indexlist.push(examdayweek[dayindex]);
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

  // console.log('notfree in dex :', notfreedayindex)
  for (let index = 0; index < 4; index++) {
    const Examdaylistdata = Examdaylist[index];
    const notfreedayweek = notfreedayindex[index];
    for (let count = 0; count < notfreedayweek.length; count++) {
      let index = notfreedayweek[count];
      removeItemOnce(Examdaylistdata, index);
    }
  }
  // console.log(subjectList.length,teacherdata.person_id)
  // console.log(Examdaylist)

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

  if (conditionweekend == 1)
    var weekenddaylist = [
      ...weekenddayweekist[0],
      ...weekenddayweekist[1],
      ...weekenddayweekist[2],
      ...weekenddayweekist[3],
    ];

  //จัดผู้คุม
  var checkroomempty = false
  var reset = 0;
  for (let index = 0; index < 1; index++) {
    if (teacherdata.condition_status == 2) {
      // console.log('person_id: ',teacherdata.person_id,teacherdata.mark)
      var checkstatus = await getdataFromSql(`select * from t_exam_committee where year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}' and person_id = ${teacherdata.person_id}`)
      // console.log(checkstatus.length)
      if (checkstatus.length == 1) {
        break;
      }

    }
    var count = teacherdata.mark
    var teachercount = index + 1
    // console.log(teacherdata.person_id, 'mark :', count, 'index :', index)
    if (checkroomempty == false) {
      subjectList = await getdataFromSql(`
      SELECT t_exam_room.* FROM t_exam_room left JOIN t_exam_committee on t_exam_room.year = t_exam_committee.year and t_exam_room.semester = t_exam_committee.semester and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_room.building_no = t_exam_committee.building_no AND t_exam_room.room_no = t_exam_committee.room_no WHERE t_exam_committee.year is null and t_exam_committee.semester is null and t_exam_committee.mid_or_final is null and t_exam_committee.exam_date is null and t_exam_committee.exam_time is null and t_exam_committee.subject_id is null and t_exam_committee.building_no is null AND t_exam_committee.room_no is null and t_exam_room.room_no not in(select DISTINCT room_no FROM t_exam_committee) and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and t_exam_room.mid_or_final = '${mid_or_final}'
      `)
      if (subjectList.length == 0) {
        checkroomempty = true
        subjectList = await getdataFromSql(
          `SELECT t_exam_room.* FROM t_exam_room left JOIN t_exam_committee on t_exam_room.year = t_exam_committee.year and t_exam_room.semester = t_exam_committee.semester and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_room.building_no = t_exam_committee.building_no AND t_exam_room.room_no = t_exam_committee.room_no WHERE t_exam_committee.year is null and t_exam_committee.semester is null and t_exam_committee.mid_or_final is null and t_exam_committee.exam_date is null and t_exam_committee.exam_time is null and t_exam_committee.subject_id is null and t_exam_committee.building_no is null AND t_exam_committee.room_no is null and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and t_exam_room.mid_or_final = '${mid_or_final}' `
        )
      }

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

    }

    if (checkroomempty == true && subjectList.length == 0) {
      subjectList = await getdataFromSql(`
      SELECT DISTINCT t_exam_room.*,if( ceiling(sum(DISTINCT std_num)/30) < 2,2,ceiling(sum(DISTINCT std_num)/30)) as checkdata,count(*),sum(DISTINCT std_num) FROM t_exam_room 
      INNER JOIN t_exam_committee
      on t_exam_room.year = t_exam_committee.year
      and t_exam_room.semester = t_exam_committee.semester
      and t_exam_room.mid_or_final = t_exam_committee.mid_or_final
      and t_exam_room.exam_date = t_exam_committee.exam_date
      and t_exam_room.exam_time = t_exam_committee.exam_time
      and t_exam_room.subject_id = t_exam_committee.subject_id
      and t_exam_room.building_no = t_exam_committee.building_no
      AND t_exam_room.room_no = t_exam_committee.room_no
      WHERE  t_exam_room.year = ${year} and
      t_exam_room.semester = ${semester} and
      t_exam_room.mid_or_final = '${mid_or_final}'
      GROUP by t_exam_room.year
      ,t_exam_room.semester
      , t_exam_room.mid_or_final
      , t_exam_room.exam_date
      , t_exam_room.exam_time
      , t_exam_room.room_no  
      having checkdata > count(*)       `)

      if (subjectList.length == 0) {
        break;
      }
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
    }


    // ถ้า weekend มี
    if (conditionweekend == 1) {
      console.log('weekend')
      shuffle(subjectList);
      shuffle(weekenddaylist);
      // list วิชามา
      for (let subjectindex = 0; subjectindex < subjectList.length; subjectindex++) {
        let subject = subjectList[subjectindex];
        var checkday = false
        //list day มา 
        for (let dayindex = 0; dayindex < Day.length; dayindex++) {
          const element = Day[dayindex];
          let dateday = new Date(element[0])
          //check ว่าวันสุดสัปดาห์มั้ย และเวลาสอบตรงกันหรือป่าว
          if ((dateday.getDay() == 0 || dateday.getDay() == 6) && dateday.getTime() === subject.exam_date.getTime() && element[1] == subject.exam_time) {
            //เงื่อนไขเวลา case เช้าบ่ายในวันเดียวกัน ถ้าเจอวันสุดสัปดาห์
            if (teacherdata.condition_time == 3) {
              let exam_committeedata = await getdataFromSql(
                `select distinct exam_date from t_exam_committee where person_id = ${teacherdata.person_id}  and year = ${year} and semester = ${semester} and mid_or_final = ${mid_or_final}`
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
                    if (dateday.getTime() === day.getTime() && daylist[0].exam_time != element[1]) {
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
                VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${teacherdata.person_id}','${faculty_id}','${subject.subject_id}');
                `);
                await getdataFromSql(`
                UPDATE t_condition
                SET mark = ${teacherdata.mark - 1},markcount= ${teacherdata.markcount + 1}
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
            VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${teacherdata.person_id}','${faculty_id}','${subject.subject_id}');
            `);
            await getdataFromSql(`
            UPDATE t_condition
            SET mark = ${teacherdata.mark - 1},markcount= ${teacherdata.markcount + 1}
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
      // console.log('not weekend', teacherdata.condition_time)
      shuffle(subjectList);
      for (let index = 0; index < subjectList.length; index++) {
        const subject = subjectList[index];
        var checkdata = false
        if (teacherdata.condition_time != 3) {


          //case เวลาไรก็ได้
          for (let dayindex = 0; dayindex < Day.length; dayindex++) {
            let daydata = Day[dayindex];
            // console.log(daydata,subject.exam_date)
            if (new Date(daydata[0]).getTime() === subject.exam_date.getTime() && subject.exam_time == daydata[1]) {
              // console.log('condition_time != 2')
              checkdata = true
              const mySQLDateString = subject.exam_date
                .toJSON()
                .slice(0, 19)
                .replace("T", " ");
              // console.log(mySQLDateString, subject.exam_time, subject.year)
              await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
            VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${teacherdata.person_id}','${faculty_id}','${subject.subject_id}');
            `);
              await getdataFromSql(`
            UPDATE t_condition
            SET mark = ${teacherdata.mark - 1},markcount= ${teacherdata.markcount + 1}
            WHERE person_id = '${teacherdata.person_id}'`);
              // console.log(teachercount);
              removeItemOnce(subjectList, subject);
              removeItemOnce(Day, daydata);
              break
            }
            if (index == subjectList.length - 1 && checkroomempty == false && reset == 0) {
              subjectList = await getdataFromSql(
                `SELECT t_exam_room.* FROM t_exam_room left JOIN t_exam_committee on t_exam_room.year = t_exam_committee.year and t_exam_room.semester = t_exam_committee.semester and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_room.building_no = t_exam_committee.building_no AND t_exam_room.room_no = t_exam_committee.room_no WHERE t_exam_committee.year is null and t_exam_committee.semester is null and t_exam_committee.mid_or_final is null and t_exam_committee.exam_date is null and t_exam_committee.exam_time is null and t_exam_committee.subject_id is null and t_exam_committee.building_no is null AND t_exam_committee.room_no is null and t_exam_room.year = ${year} and t_exam_room.semester = ${semester} and t_exam_room.mid_or_final = '${mid_or_final}' `
              )
              index = -1
              reset = 1
              continue
            }
            if (index == subjectList.length - 1 && checkroomempty == true && reset == 0 || index == subjectList.length - 1 && checkroomempty == false && reset == 1) {
              subjectList = await getdataFromSql(`
              SELECT DISTINCT t_exam_room.*,if( ceiling(sum(DISTINCT std_num)/30) < 2,2,ceiling(sum(DISTINCT std_num)/30)) as checkdata,count(*),sum(DISTINCT std_num) FROM t_exam_room 
              INNER JOIN t_exam_committee
              on t_exam_room.year = t_exam_committee.year
              and t_exam_room.semester = t_exam_committee.semester
              and t_exam_room.mid_or_final = t_exam_committee.mid_or_final
              and t_exam_room.exam_date = t_exam_committee.exam_date
              and t_exam_room.exam_time = t_exam_committee.exam_time
              and t_exam_room.subject_id = t_exam_committee.subject_id
              and t_exam_room.building_no = t_exam_committee.building_no
              AND t_exam_room.room_no = t_exam_committee.room_no
              WHERE  t_exam_room.year = ${year} and
              t_exam_room.semester = ${semester} and
              t_exam_room.mid_or_final = '${mid_or_final}'
              GROUP by t_exam_room.year
              ,t_exam_room.semester
              , t_exam_room.mid_or_final
              , t_exam_room.exam_date
              , t_exam_room.exam_time
              , t_exam_room.room_no  
              having checkdata > count(*) `)
              index = -1
              reset = 2
              continue

            }

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
              if (teacherdata.condition_time == 3) {
                let exam_committeedata = await getdataFromSql(
                  `select distinct exam_date from t_exam_committee where person_id = ${teacherdata.person_id}  and year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}'`
                );
                //เคยคุมแล้ว
                if (exam_committeedata.length > 0) {
                  // list วันที่คุมมา
                  for (let index = 0; index < exam_committeedata.length; index++) {

                    const data = exam_committeedata[index];
                    let daydata = new Date(data.exam_date)
                    const mySQLDateString = daydata
                      .toJSON()
                      .slice(0, 19)
                      .replace("T", " ");
                    let daylist = await getdataFromSql(
                      `select * from t_exam_committee where exam_date = '${mySQLDateString}' and person_id = ${teacherdata.person_id}`
                    );

                    // กรณีที่คุมแค่เวลาเดียว
                    if (daylist.length == 1) {
                      let day = new Date(daylist[0].exam_date)
                      let datadate = new Date(element[0])
                      //check ว่าเจอวันตรงกันมั้ย
                      if (day.getTime() === datadate.getTime() && daylist[0].exam_time != element[1] && subject.exam_time != daylist[0].exam_time && datadate.getTime() === subject.exam_date.getTime()) {
                        console.log(element, daylist[0])
                        console.log(subject)
                        checkday = true
                        break
                      }
                    }
                  }
                } else { //ยังไม่เคยคุม
                  let dataday = new Date(element[0])
                  let subjectday = subject.exam_date
                  // console.log(dataday,element)
                  if (dataday.getTime() === subjectday.getTime() && element[1] == subject.exam_time) {

                    var datebefore = new Date(Day[dayindex - 1][0])
                    var dateafter = new Date('1/1/1999')
                    if (dayindex + 1 != Day.length) {
                      dateafter = new Date(Day[dayindex + 1][0])
                      console.log('daydatab: ', dateafter, Day[dayindex + 1][1], Day[dayindex - 1][1], datebefore, dateafter.getTime() === subjectday.getTime(), datebefore.getTime() === subjectday.getTime());
                    }

                    if (dateafter.getTime() === subjectday.getTime() || datebefore.getTime() === subjectday.getTime()) {

                      const mySQLDateString = subjectday
                        .toJSON()
                        .slice(0, 19)
                        .replace("T", " ");
                      await getdataFromSql(`INSERT INTO t_exam_committee (exam_date, exam_time, year, semester, mid_or_final, building_no,room_no,person_type,person_id,faculty_id,subject_id)
                      VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${teacherdata.person_id}','${faculty_id}','${subject.subject_id}');
                      `);
                      await getdataFromSql(`
                      UPDATE t_condition
                      SET mark = ${teacherdata.mark - 1},markcount= ${teacherdata.markcount + 1}
                      WHERE person_id = '${teacherdata.person_id}'`);

                      removeItemOnce(subjectList, subject);
                      removeItemOnce(Day, element);
                      checkday = false


                    }


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
                  VALUES ('${mySQLDateString}', '${subject.exam_time}', ${subject.year}, '${subject.semester}', '${subject.mid_or_final}', '${subject.building_no}','${subject.room_no}','1','${teacherdata.person_id}','${faculty_id}','${subject.subject_id}');
                  `);
                await getdataFromSql(`
                UPDATE t_condition
                SET mark = ${teacherdata.mark - 1},markcount= ${teacherdata.markcount + 1}
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
        if (checkdata == true) {
          break
        }
      }
    }
  }
  // backup ที่เปลี่ยนข้อมูลไปกลับมา
  console.log('success teacher exam')
  callback('success')
}

module.exports.removedata = function (req, callback) {
  var year = req.body.year
  var semester = req.body.semester
  var mid_or_final = req.body.mid_or_final
  var person_id = req.body.person_id
  var exam_date = req.body.exam_date
  var exam_time = req.body.exam_time
  console.log(person_id, req.body, exam_date)
  var sql = `
    delete from t_exam_committee
  where year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}' 
  and exam_date = '${exam_date}' and exam_time = ${exam_time} and person_id = ${person_id} 
   `
  // var sql = `
  //   select * from t_exam_committee 
  //   where year = ${year} and semester = ${semester} and mid_or_final = '${mid_or_final}' 
  //   and exam_date = '${exam_date}' and exam_time = ${exam_time} and person_id = ${person_id}
  // `

  console.log(sql)
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("exam committee");
    pool.query(sql, (err, rows) => {
      if (err){
        callback(0)
      };
      console.log("The data from users table are: \n", rows);
      // callback(rows);
      connection.release(); // return the connection to pool
    });
  });
  callback(1)

}

module.exports.examdata = async function (req, callback) {
  console.log(req.body)
  var name1 = req.body.name1
  var surname1 = req.body.surname1
  var name2 = req.body.name2
  var surname2 = req.body.surname2
  // name = name.split(' ')

  var datayear = await getdataFromSql(`
  select person.Firstname,person.Lastname,t_exam_committee.year,t_exam_committee.semester,t_exam_committee.mid_or_final from t_exam_committee,person where person.Person_id = t_exam_committee.person_id and person.Firstname = '${name1}' and person.Lastname = '${surname1}' order by t_exam_committee.year desc,t_exam_committee.semester desc ,t_exam_committee.mid_or_final asc limit 1 
  `)
  var data1year = await getdataFromSql(`
  select person.Firstname,person.Lastname,t_exam_committee.year,t_exam_committee.semester,t_exam_committee.mid_or_final from t_exam_committee,person where person.Person_id = t_exam_committee.person_id and person.Firstname = '${name2}' and person.Lastname = '${surname2}' order by t_exam_committee.year desc,t_exam_committee.semester desc ,t_exam_committee.mid_or_final asc limit 1 
  `)

  console.log(datayear[0].year,data1year[0].year,datayear[0].semester,data1year[0].semester)
  if (datayear[0].year != data1year[0].year || datayear[0].semester != data1year[0].semester || datayear[0].mid_or_final != data1year[0].mid_or_final) {
    callback('ไม่สามารถแลกวันคุมสอบได้')
    return
  }
  var data = null
  var data1 = null
  if (datayear[0].mid_or_final = 'm') {
    data = await getdataFromSql(`
    select DISTINCT t_exam_committee.* , DATE_FORMAT(teach_table.mexam_time, '%H:%i')  as start, DATE_FORMAT(teach_table.mexam_time2, '%H:%i')  as end ,person.Firstname,person.Lastname from t_exam_committee,person,teach_table where person.Person_id = t_exam_committee.person_id and t_exam_committee.year = teach_table.year and t_exam_committee.semester = teach_table.semester and t_exam_committee.subject_id = teach_table.subject_id and 
     person.Firstname = '${name1}' and person.Lastname = '${surname1}' and t_exam_committee.year = ${datayear[0].year} and t_exam_committee.semester = ${datayear[0].semester} and t_exam_committee.mid_or_final = '${datayear[0].mid_or_final}' and teach_table.mexam_time != '00:00:00'
    
    `)
    data1 = await getdataFromSql(`
    select DISTINCT t_exam_committee.* ,DATE_FORMAT(teach_table.mexam_time, '%H:%i')  as start, DATE_FORMAT(teach_table.mexam_time2, '%H:%i')  as end ,person.Firstname,person.Lastname from t_exam_committee,person,teach_table where person.Person_id = t_exam_committee.person_id and t_exam_committee.year = teach_table.year and t_exam_committee.semester = teach_table.semester and t_exam_committee.subject_id = teach_table.subject_id and 
     person.Firstname = '${name2}' and person.Lastname = '${surname2}' and t_exam_committee.year = ${datayear[0].year} and t_exam_committee.semester = ${datayear[0].semester} and t_exam_committee.mid_or_final = '${datayear[0].mid_or_final}' and teach_table.mexam_time != '00:00:00'
    `)

  }
  else {
    data = await getdataFromSql(`
    select DISTINCT t_exam_committee.* ,DATE_FORMAT(teach_table.exam_time, '%H:%i')  as start, DATE_FORMAT(teach_table.exam_time2, '%H:%i')  as end ,person.Firstname,person.Lastname from t_exam_committee,person,teach_table where person.Person_id = t_exam_committee.person_id and t_exam_committee.year = teach_table.year and t_exam_committee.semester = teach_table.semester and t_exam_committee.subject_id = teach_table.subject_id and 
     person.Firstname = '${name1}' and person.Lastname = '${surname1}' and t_exam_committee.year = ${datayear[0].year} and t_exam_committee.semester = ${datayear[0].semester} and t_exam_committee.mid_or_final = '${datayear[0].mid_or_final}' and teach_table.exam_time != '00:00:00'
    
    `)
    data1 = await getdataFromSql(`
    select DISTINCT t_exam_committee.* ,DATE_FORMAT(teach_table.exam_time, '%H:%i')  as start, DATE_FORMAT(teach_table.exam_time2, '%H:%i')  as end ,person.Firstname,person.Lastname from t_exam_committee,person,teach_table where person.Person_id = t_exam_committee.person_id and t_exam_committee.year = teach_table.year and t_exam_committee.semester = teach_table.semester and t_exam_committee.subject_id = teach_table.subject_id and 
     person.Firstname = '${name2}' and person.Lastname = '${surname2}' and t_exam_committee.year = ${datayear[0].year} and t_exam_committee.semester = ${datayear[0].semester} and t_exam_committee.mid_or_final = '${datayear[0].mid_or_final}' and teach_table.exam_time != '00:00:00'
    `)

  }

  // console.log(data.length,data1.length)

  if (!data.length || !data1.length) {
    console.log('object')
    callback('ไม่มีข้อมูลที่ต้องการ')
    return
  }

  var returndata = [...data, ...data1]
  // console.log(returndata)
  callback(returndata)


}

module.exports.swapdata = async function (req, callback) {

  var teachswap1 = req.body.teachswap1
  var teachswap2 = req.body.teachswap2

  console.log('swap data')
  console.log(teachswap1)
  console.log(teachswap2)

  //เช็คเงือนไขว่าแลกไปแล้วเวลามันทับ
  var teach1date = new Date(teachswap1.exam_date)
  var teach2date = new Date(teachswap2.exam_date)
  console.log(teach1date.getTime() === teach2date.getTime())
  //เคสสลับวันเวลาเดียวกัน
  if (teach1date.getTime() === teach2date.getTime() && teachswap1.exam_time == teachswap2.exam_time) {
    //สลับข้อมุล
    await getdataFromSql(`
    update t_exam_committee
    set person_id = (case when person_id =  ${teachswap1.person_id} then ${teachswap2.person_id} when person_id = ${teachswap2.person_id} then ${teachswap1.person_id} END)
    where person_id in (${teachswap1.person_id},${teachswap2.person_id}) and subject_id in (${teachswap1.subject_id},${teachswap2.subject_id}) 
    and exam_date in ('${teachswap1.exam_date}','${teachswap2.exam_date}') and exam_time in (${teachswap1.exam_time},${teachswap2.exam_time})
    `)
    callback('swap success')
    return
  }

  //คนละวัน
  var teacher1data = await getdataFromSql(`
  select * from t_exam_committee where person_id = ${teachswap1.person_id} and exam_date = '${teachswap2.exam_date}' and exam_time = ${teachswap2.exam_time}
  `)

  var teacher2data = await getdataFromSql(`
  select * from t_exam_committee where person_id = ${teachswap2.person_id} and exam_date = '${teachswap1.exam_date}' and exam_time = ${teachswap1.exam_time}
  `)

  //
  // console.log(teacher1data, teacher2data)

  if (!teacher1data.length && !teacher2data.length) {
    console.log(true)
    await getdataFromSql(`
    update t_exam_committee
    set person_id = (case when person_id =  ${teachswap1.person_id} then ${teachswap2.person_id} when person_id = ${teachswap2.person_id} then ${teachswap1.person_id} END)
    where person_id in (${teachswap1.person_id},${teachswap2.person_id}) and subject_id in (${teachswap1.subject_id},${teachswap2.subject_id}) 
    and exam_date in ('${teachswap1.exam_date}','${teachswap2.exam_date}') and exam_time in (${teachswap1.exam_time},${teachswap2.exam_time})
    `)
    callback('swap success')
    return
  }
  callback('swapp failed')


}

module.exports.examdatainstead = async function (req, callback) {
  console.log(req.body)
  var name1 = req.body.name1
  var surname1 = req.body.surname1
  var datayear = await getdataFromSql(`
  select person.Firstname,person.Lastname,t_exam_committee.* from t_exam_committee,person where person.Person_id = t_exam_committee.person_id and person.Firstname = '${name1}' and person.Lastname = '${surname1}' order by t_exam_committee.year desc,t_exam_committee.semester desc ,t_exam_committee.mid_or_final asc limit 1 
  `)
  var data = await getdataFromSql(`
  select person.Firstname,person.Lastname,t_exam_committee.* from t_exam_committee,person where person.Person_id = t_exam_committee.person_id and person.Firstname = '${name1}' and person.Lastname = '${surname1}'
  and t_exam_committee.year = ${datayear[0].year} and t_exam_committee.semester = ${datayear[0].semester} and t_exam_committee.mid_or_final = '${datayear[0].mid_or_final}'
  `)

  if (datayear[0].mid_or_final = 'm') {
    data = await getdataFromSql(`
    select DISTINCT t_exam_committee.* ,DATE_FORMAT(teach_table.mexam_time, '%H:%i') as start, DATE_FORMAT(teach_table.mexam_time2, '%H:%i') as end ,person.Firstname,person.Lastname from t_exam_committee,person,teach_table where person.Person_id = t_exam_committee.person_id and t_exam_committee.year = teach_table.year and t_exam_committee.semester = teach_table.semester and t_exam_committee.subject_id = teach_table.subject_id and 
     person.Firstname = '${name1}' and person.Lastname = '${surname1}' and t_exam_committee.year = ${datayear[0].year} and t_exam_committee.semester = ${datayear[0].semester} and t_exam_committee.mid_or_final = '${datayear[0].mid_or_final}' and teach_table.mexam_time != '00:00:00'
    
    `)
  }
  else {
    data = await getdataFromSql(`
    select DISTINCT t_exam_committee.* ,DATE_FORMAT(teach_table.exam_time, '%H:%i') as start, DATE_FORMAT(teach_table.exam_time2, '%H:%i')  as end ,person.Firstname,person.Lastname from t_exam_committee,person,teach_table where person.Person_id = t_exam_committee.person_id and t_exam_committee.year = teach_table.year and t_exam_committee.semester = teach_table.semester and t_exam_committee.subject_id = teach_table.subject_id and 
     person.Firstname = '${name1}' and person.Lastname = '${surname1}' and t_exam_committee.year = ${datayear[0].year} and t_exam_committee.semester = ${datayear[0].semester} and t_exam_committee.mid_or_final = '${datayear[0].mid_or_final}' and teach_table.exam_time != '00:00:00'
    
    `)

  }

  if (!data.length) {
    callback('ไม่มีข้อมูลที่ต้องการ')
  }

  var returndata = [...data]
  console.log(returndata)
  callback(returndata)


}


module.exports.committeecheck = async function (callback) {

  var sql = `
  select * from t_exam_committee_check
`
  pool.getConnection((err, connection) => {
    if (err) throw err;
    // console.log("exam committee filter");
    pool.query(sql, (err, rows) => {
      if (err) throw err;
      // console.log("The data from users table are: \n", rows);
      callback(rows);
      connection.release(); // return the connection to pool
    });
  });
  // console.log(data)
  // callback(data)

}

module.exports.examinstead = async function (req, callback) {
  var examdata = req.body.examdata
  var name = req.body.name
  var surname = req.body.surname
  console.log(req.body)

  var examdate = new Date(examdata.exam_date)
  var namecheck = await getdataFromSql(`
  select * from person where person.Firstname = '${name}' and person.Lastname = '${surname}'
  `)

  if (!namecheck.length) {
    // console.log('not data')
    callback('ไม่พบรายชื่อในฐานข้อมูล')
  }

  var data = await getdataFromSql(`
  select person.Firstname,person.Lastname,t_exam_committee.* from t_exam_committee,person where person.Person_id = t_exam_committee.person_id and person.Firstname = '${name}' and person.Lastname = '${surname}'
  `)
  var checkdate = false
  data.map((data, index) => {
    //ถ้ามีข้อมูลให้ไม่คุม && data.exam_time == examdata.exam_time
    if (examdate.getTime() === data.exam_date.getTime() && data.exam_time == examdata.exam_time) {
      console.log('true')
      callback('ไม่สามารถคุมสอบวิชานี้แทนได้ เนื่องจากได้มีการคุมสอบในช่วงเวลานี้แล้ว')
      checkdate = true
    }
  })
  //ถ้าตรงเงื่อนไข
  if (checkdate == false) {
    console.log('success')
    await getdataFromSql(`
    update t_exam_committee
    set person_id = ${data[0].person_id}
    where exam_date = '${examdata.exam_date}' and exam_time = ${examdata.exam_time} and person_id = ${examdata.person_id} and subject_id = ${examdata.subject_id}
    `)
    callback('success')

  }
}

module.exports.read = function (callback) {
  // คำสั่ง sql
  let sql = `
  SELECT person.person_id,person.Person_type,person.Office_id,concat(person.Position,' ',person.Firstname,' ',person.Lastname) as name , concat('[',GROUP_CONCAT( JSON_OBJECT( 'year',year,'semester',semester,'mid_or_final',mid_or_final,'exam_date', exam_date, 'exam_time', exam_time, 'building_no',t_exam_committee.building_no, 'room_no',t_exam_committee.room_no ) order by year,semester,mid_or_final,exam_date,exam_time ),']') AS list FROM person LEFT JOIN t_exam_committee on t_exam_committee.person_id = person.Person_id group by person.Person_id ORDER BY person.Firstname ASC ,t_exam_committee.exam_date asc,t_exam_committee.exam_time asc
  `;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    // console.log("exam committee");
    pool.query(sql, (err, rows) => {
      if (err) throw err;
      // console.log("The data from users table are: \n", rows);
      callback(rows);
      connection.release(); // return the connection to pool
    });
  });
};


module.exports.exportfile = async function (req, callback) {
  console.log('export')
  console.log(req.body)
  // console.log(req)
  let year = req.body.year
  let semester = req.body.semester
  let mid_or_final = req.body.mid_or_final
  let state = req.body.state

  if (state == '0') {

    //     let sql = `SELECT t_exam_room.exam_date as 'ว/ด/ป',IF(t_exam_room.exam_time = 1,"09:30-12:30","13:30-16:30") as เวลา,t_exam_committee.subject_id as รหัสวิชา,subject.subject_ename as ชื่อวิชา,t_exam_room.section as กลุ่ม,t_exam_room.std_num as 'นศ.รวม',t_exam_room.room_no as ห้องสอบ,CONCAT(person.Firstname, ' ', person.Lastname) as ชื่อกรรมการ
    //   ,'' as หมายเหตุ FROM t_exam_committee ,subject,t_exam_room,person WHERE t_exam_committee.subject_id = subject.subject_id and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.room_no = t_exam_committee.room_no and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_committee.person_id = person.Person_id  and t_exam_committee.year = ${year} and t_exam_committee.semester = ${semester} and t_exam_committee.mid_or_final = '${mid_or_final}'
    //  ORDER BY t_exam_room.exam_date ASC, t_exam_room.exam_time ASC, t_exam_room.room_no ASC` // คำสั่ง sql
    let sql = null

    if (mid_or_final == 'M') {

      sql = `SELECT DISTINCT t_exam_room.exam_date as 'ว/ด/ป',concat(DATE_FORMAT(teach_table.mexam_time, '%H:%i'),'-',DATE_FORMAT(teach_table.mexam_time2, '%H:%i')
    ) as เวลา,t_exam_committee.subject_id as รหัสวิชา,subject.subject_ename as ชื่อวิชา,t_exam_room.section as กลุ่ม,t_exam_room.std_num as 'นศ.รวม',t_exam_room.room_no as ห้องสอบ,CONCAT(person.Firstname, ' ', person.Lastname) as ชื่อกรรมการ
      ,'' as หมายเหตุ FROM t_exam_committee ,subject,t_exam_room,person,teach_table WHERE t_exam_committee.subject_id = subject.subject_id and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.room_no = t_exam_committee.room_no and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_committee.person_id = person.Person_id and teach_table.subject_id = t_exam_room.subject_id and teach_table.subject_id = subject.subject_id and t_exam_committee.subject_id = teach_table.subject_id and teach_table.semester = t_exam_committee.semester and teach_table.year = t_exam_committee.year  and
      t_exam_committee.year = ${year} and t_exam_committee.semester = ${semester} and t_exam_committee.mid_or_final = '${mid_or_final}' and teach_table.exam_time != '00:00:00' ORDER BY t_exam_room.exam_date,t_exam_room.exam_time,t_exam_room.room_no,t_exam_room.subject_id` // คำสั่ง sql


    }
    else{
      sql = `SELECT DISTINCT t_exam_room.exam_date as 'ว/ด/ป',concat(DATE_FORMAT(teach_table.exam_time, '%H:%i'),'-',DATE_FORMAT(teach_table.exam_time2, '%H:%i')
      ) as เวลา,t_exam_committee.subject_id as รหัสวิชา,subject.subject_ename as ชื่อวิชา,t_exam_room.section as กลุ่ม,t_exam_room.std_num as 'นศ.รวม',t_exam_room.room_no as ห้องสอบ,CONCAT(person.Firstname, ' ', person.Lastname) as ชื่อกรรมการ
        ,'' as หมายเหตุ FROM t_exam_committee ,subject,t_exam_room,person,teach_table WHERE t_exam_committee.subject_id = subject.subject_id and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.room_no = t_exam_committee.room_no and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_committee.person_id = person.Person_id and teach_table.subject_id = t_exam_room.subject_id and teach_table.subject_id = subject.subject_id and t_exam_committee.subject_id = teach_table.subject_id and teach_table.semester = t_exam_committee.semester and teach_table.year = t_exam_committee.year  and
        t_exam_committee.year = ${year} and t_exam_committee.semester = ${semester} and t_exam_committee.mid_or_final = '${mid_or_final}' and teach_table.exam_time != '00:00:00' ORDER BY t_exam_room.exam_date,t_exam_room.exam_time,t_exam_room.room_no,t_exam_room.subject_id` // คำสั่ง sql
  
  

    }

    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as id ' + connection.threadId);
      pool.query(sql, [semester, year], async (err, rows) => {
        if (err) throw err;
        // console.log('The data from users table are: \n', rows);

        const xl = require('excel4node');
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('sheet');

        const data = rows
        const headingColumnNames = ["สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง",
          `รายละเอียดการจัดห้องสอบ  คณะวิศวกรรมศาสตร์ การสอบ${mid_or_final == 'M' ? 'กลาง' : 'ปลาย'}ภาค ภาคการศึกษาที่ ${semester}/${year}`
        ]

        //Write Column Title in Excel file
        ws.cell(1, 2).string(headingColumnNames[0])
        ws.cell(2, 2).string(headingColumnNames[1])
        // ws.cell(2, 1, 2, 6, true).string('One big merged cell');


        var heading = ["ลำดับ", "เวลา", "รหัสวิชา", "ชื่อวิชา", "กลุ่ม", "นศ.รวม", "ห้องสอบ", "ชื่อกรรมการ", "หมายเหตุ"]
        var dayinweek = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
        var month = ['ม.ค', 'ก.พ', 'มี.ค', 'เม.ย', 'พ.ค', 'มิ.ย', 'ก.ค', 'ส.ค', 'ก.ย', 'ต.ค', 'พ.ย', 'ธ.ค']
        //Write Column Title in Excel file
        let headingColumnIndex = 1;
        heading.forEach(headingdata => {
          ws.cell(3, headingColumnIndex++).string(headingdata)
        });
        // //Write Data in Excel file
        let rowIndex = 4;
        
        data.forEach(record => {
          let columnIndex = 1;
          Object.keys(record).forEach(columnName => {
            
            if (Object.prototype.toString.call(record[columnName]) === "[object Date]") {
              // console.log('isdate')
              let daydata = record[columnName]
              
              daydata.setFullYear(daydata.getFullYear() - 543)
              let dateinweek = dayinweek[daydata.getDay()]
              let daystr = daydata.getDate()

              daydata.setFullYear(daydata.getFullYear() + 543)
              let monthstr = month[daydata.getMonth()]

              ws.cell(rowIndex, columnIndex++)
                .string(dateinweek + ' ' + daystr + ' ' + monthstr + ' ' + daydata.getFullYear().toString())
            } else {
              ws.cell(rowIndex, columnIndex++)
                .string(record[columnName].toString())
            }
          });
          rowIndex++;
        });
        wb.write('report1.xlsx', function (err, stats) {
          if (err) {
            console.error(err);
          } else {
            callback('report1.xlsx')
          }
        });
        // callback('data.xlsx')

        connection.release(); // return the connection to pool
      });
    });
  }
  if (state == '1') {
    var faculty_id = req.body.faculty_id
    // let sql = `SELECT CONCAT(person.Firstname, ' ', person.Lastname) as 'ชื่อ-นามสกุล' ,t_exam_room.exam_date as 'วันที่สอบ',IF(t_exam_room.exam_time = 1,"09:30-12:30","13:30-16:30") as เวลาสอบ,t_exam_committee.subject_id as รหัสวิชา,t_exam_room.room_no as ห้องสอบ,t_exam_committee.subject_id as รหัสวิชา,subject.subject_ename ชื่อวิชา,t_exam_committee.faculty_id FROM t_exam_committee ,subject,t_exam_room,person WHERE t_exam_committee.subject_id = subject.subject_id and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.room_no = t_exam_committee.room_no and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_committee.person_id = person.Person_id and t_exam_committee.year = ${year} and t_exam_committee.semester = ${semester} and t_exam_committee.mid_or_final = '${mid_or_final}' and t_exam_committee.faculty_id = '${faculty_id}' ORDER BY faculty_id,person.Firstname ASC` // คำสั่ง sql
    let sql = null

    if (mid_or_final == 'M') {

      sql = `SELECT distinct CONCAT(person.Firstname, ' ', person.Lastname) as 'ชื่อ-นามสกุล' ,t_exam_room.exam_date as 'วันที่สอบ',concat(DATE_FORMAT(teach_table.mexam_time, '%H:%i'),'-',DATE_FORMAT(teach_table.mexam_time2, '%H:%i')) as เวลาสอบ,t_exam_committee.subject_id as รหัสวิชา,t_exam_room.room_no as ห้องสอบ,t_exam_committee.subject_id as รหัสวิชา,subject.subject_ename ชื่อวิชา,t_exam_committee.faculty_id FROM t_exam_committee ,subject,t_exam_room,person,teach_table 
      WHERE t_exam_committee.subject_id = subject.subject_id and 
      t_exam_room.exam_date = t_exam_committee.exam_date and 
      t_exam_room.exam_time = t_exam_committee.exam_time and 
      t_exam_room.mid_or_final = t_exam_committee.mid_or_final and 
      t_exam_room.room_no = t_exam_committee.room_no and 
      t_exam_room.subject_id = t_exam_committee.subject_id and 
      t_exam_committee.person_id = person.Person_id and 
      teach_table.subject_id = t_exam_room.subject_id and 
      teach_table.subject_id = subject.subject_id and 
      t_exam_committee.subject_id = teach_table.subject_id and 
      teach_table.semester = t_exam_committee.semester and 
      teach_table.year = t_exam_committee.year  and 
      t_exam_committee.year = ${year} and 
      t_exam_committee.semester = ${semester} and 
      t_exam_committee.mid_or_final = '${mid_or_final}' and 
      t_exam_committee.faculty_id = '${faculty_id}' and 
      teach_table.exam_time != '00:00:00' 
      ORDER BY faculty_id,person.Firstname ASC,t_exam_room.exam_date asc,t_exam_room.exam_time asc` // คำสั่ง sql


    }
    else{
      sql = `SELECT distinct CONCAT(person.Firstname, ' ', person.Lastname) as 'ชื่อ-นามสกุล' ,t_exam_room.exam_date as 'วันที่สอบ',concat(DATE_FORMAT(teach_table.exam_time, '%H:%i'),'-',DATE_FORMAT(teach_table.exam_time2, '%H:%i')) as เวลาสอบ,t_exam_committee.subject_id as รหัสวิชา,t_exam_room.room_no as ห้องสอบ,t_exam_committee.subject_id as รหัสวิชา,subject.subject_ename ชื่อวิชา,t_exam_committee.faculty_id FROM t_exam_committee ,subject,t_exam_room,person,teach_table WHERE 
      t_exam_committee.subject_id = subject.subject_id and 
      t_exam_room.exam_date = t_exam_committee.exam_date and 
      t_exam_room.exam_time = t_exam_committee.exam_time and 
      t_exam_room.mid_or_final = t_exam_committee.mid_or_final and 
      t_exam_room.room_no = t_exam_committee.room_no and 
      t_exam_room.subject_id = t_exam_committee.subject_id and 
      t_exam_committee.person_id = person.Person_id and 
      teach_table.subject_id = t_exam_room.subject_id and 
      teach_table.subject_id = subject.subject_id and   teach_table.exam_time != '00:00:00' and
      t_exam_committee.subject_id = teach_table.subject_id and teach_table.semester = t_exam_committee.semester and teach_table.year = t_exam_committee.year  and t_exam_committee.year = ${year} and t_exam_committee.semester = ${semester} and t_exam_committee.mid_or_final = '${mid_or_final}' and t_exam_committee.faculty_id = '${faculty_id}' ORDER BY faculty_id,person.Firstname ASC,t_exam_room.exam_date asc,t_exam_room.exam_time asc` // คำสั่ง sql

    }
    
    var office = await getdataFromSql(`SELECT Office_id,Office_name FROM t_office where office_id = ${faculty_id}`)
    var officelist = []
    office.map((data) => {
      officelist.push([data.Office_id, data.Office_name])
    })
    // console.log(officelist)
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as id ' + connection.threadId);
      pool.query(sql, async (err, rows) => {
        if (err) throw err;
        // console.log('The data from users table are: \n', rows);

        const xl = require('excel4node');
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('sheet');

        const data = rows
        const headingColumnNames = [`ตารางคุมสอบประจำภาคเรียนที่   ${semester}/${year}     (${mid_or_final == 'M' ? 'กลาง' : 'ปลาย'}ภาค)`, `${officelist[0][1]}`, "หมายเหตุ    ตึก 12 (12 ชั้น) รับข้อสอบที่งานสนับสนุนการเรียนการสอน ชั้น 1", "ตึก ME  (เครื่องกล) รับข้อสอบที่หน้าลิฟท์ ชั้น 1", "ตีก HM (เฉลิมพระเกียรติ) รับข้อสอบที่บริเวณโถง ชั้น 1"]
        console.log(mid_or_final);
        //Write Column Title in Excel file
        // ws.cell(1, 2).string(headingColumnNames[0])
        // ws.cell(2, 2).string(headingColumnNames[1])
        headingColumnNames.map((data, index) => {
          ws.cell(index + 1, 2).string(data)

        })
        var heading = ["ชื่อ-นามสกุล", "วันที่สอบ", "เวลาสอบ", "รหัสวิชา", "ห้องสอบ", "ชื่อวิชา"]
        var dayinweek = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
        var month = ['ม.ค', 'ก.พ', 'มี.ค', 'เม.ย', 'พ.ค', 'มิ.ย', 'ก.ค', 'ส.ค', 'ก.ย', 'ต.ค', 'พ.ย', 'ธ.ค']
        //Write Column Title in Excel file
        // ws.cell(6, 1).string(officelist[0][1])
        let headingColumnIndex = 1;
        heading.forEach(headingdata => {
          ws.cell(6, headingColumnIndex++)
            .string(headingdata)
        });

        // //Write Data in Excel file
        let rowIndex = 7;
        let officedata = faculty_id
        var check = false
        data.map((data, index) => {
          var columnIndex = 1
          if (officedata != data.faculty_id) {
            rowIndex++
            rowIndex++
            officelist.map(datain => {
              if (datain[0] == data.faculty_id) {
                ws.cell(rowIndex, 1).string(datain[1])
                rowIndex++
              }
            })
            Object.keys(data).forEach(columnName => {
              if (columnName != 'faculty_id' && columnName != 'วันที่สอบ') {
                ws.cell(rowIndex, columnIndex++).string(data[columnName].toString())
              }
              if (columnName == 'วันที่สอบ') {
                let daydata = data[columnName]
                daydata.setFullYear(daydata.getFullYear() - 543)
                let dateinweek = dayinweek[daydata.getDay()]
                let daystr = daydata.getDate()
                daydata.setFullYear(daydata.getFullYear() + 543)
                let monthstr = month[daydata.getMonth()]

                ws.cell(rowIndex, columnIndex++)
                  .string(dateinweek + ' ' + daystr + ' ' + monthstr + ' ' + daydata.getFullYear().toString())
              }
            })
            officedata = data.faculty_id
          } else {
            Object.keys(data).forEach(columnName => {
              if (columnName != 'faculty_id' && columnName != 'วันที่สอบ') {
                ws.cell(rowIndex, columnIndex++).string(data[columnName].toString())
              }
              if (columnName == 'วันที่สอบ') {
                let daydata = data[columnName]
                daydata.setFullYear(daydata.getFullYear() - 543)
                let dateinweek = dayinweek[daydata.getDay()]
                let daystr = daydata.getDate()

                daydata.setFullYear(daydata.getFullYear() + 543)
                let monthstr = month[daydata.getMonth()]

                ws.cell(rowIndex, columnIndex++)
                  .string(dateinweek + ' ' + daystr + ' ' + monthstr + ' ' + daydata.getFullYear().toString())
              }
            })
          }
          rowIndex++;
        })

        wb.write('report2.xlsx', function (err, stats) {
          if (err) {
            console.error(err);
          } else {
            callback('report2.xlsx')
          }
        });
        // callback('data.xlsx')

        connection.release(); // return the connection to pool
      });
    });




  }
  if (state == '2') {
    var exam_date = req.body.exam_date
    var exam_time = req.body.exam_time

    var sql = `
    SELECT person.Prename,person.Firstname,person.Lastname,t_exam_room.room_no as ห้องสอบ, '' as ลายมือชื่อ,'' as หมายเหตุ ,t_exam_committee.building_no 
    FROM t_exam_committee ,subject,t_exam_room,person
     WHERE t_exam_committee.subject_id = subject.subject_id 
     and t_exam_room.exam_date = t_exam_committee.exam_date 
     and t_exam_room.exam_time = t_exam_committee.exam_time 
     and t_exam_room.mid_or_final = t_exam_committee.mid_or_final 
     and t_exam_room.room_no = t_exam_committee.room_no 
     and t_exam_room.subject_id = t_exam_committee.subject_id 
     and t_exam_committee.person_id = person.Person_id 
     and t_exam_committee.year = ${year} 
     and t_exam_committee.semester = ${semester}
     and t_exam_committee.mid_or_final = '${mid_or_final}' 
     and t_exam_committee.exam_date = '${exam_date}' 
     and t_exam_committee.exam_time = ${exam_time} 
     ORDER BY t_exam_room.exam_date ASC, t_exam_room.exam_time ASC, t_exam_room.room_no ASC
    `


    var building = await getdataFromSql(`SELECT * from t_building`)
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log('connected as id ' + connection.threadId);
      pool.query(sql, async (err, rows) => {
        if (err) throw err;
        // console.log('The data from users table are: \n', rows);

        const xl = require('excel4node');
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('รายชื่อ');



        //Write Column Title in Excel file
        // ws.cell(1, 2).string(headingColumnNames[0])
        // ws.cell(2, 2).string(headingColumnNames[1])
        // ws.cell(2, 1, 2, 6, true).string('One big merged cell');


        var heading = ["ลำดับ", "ชื่อกรรมการคุมสอบ", "ห้องสอบ", "ลายมือชื่อ", "หมายเหตุ"]
        var dayinweek = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
        var month = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤษจิกายน", "ธันวาคม"]

        var timestr = ['', 'เช้า', 'บ่าย']
        var numtimestr = ['', '09.30 น. - 12.30 น.', '13.30 น. - 16.30 น.']

        let date = new Date(exam_date)
        var yeardata = date.getFullYear()
        date.setFullYear(date.getFullYear() - 543)
        const data = rows
        const headingColumnNames = [`วัน${dayinweek[date.getDay()]}ที่  ${date.getDate()}   ${month[date.getMonth()]}  ${yeardata}  คาบ${timestr[exam_time]}  เวลา  ${numtimestr[exam_time]}`
        ]
        // console.log(headingColumnNames)
        // //Write Column Title in Excel file
        ws.cell(1, 1).string(headingColumnNames[0])

        // ws.cell(2, 2).string(headingColumnNames[1])
        // ws.cell(2, 1, 2, 6, true).string('One big merged cell');
        let headingColumnIndex = 1;

        heading.forEach((headingdata, index) => {
          if (index == 1) {
            ws.cell(2, headingColumnIndex++, 2, 4, true)
              .string(headingdata).style({
                alignment: { // §18.8.1
                  horizontal: 'center'
                },
              });

            headingColumnIndex = 5
          } else {
            ws.cell(2, headingColumnIndex++)
              .string(headingdata).style({
                alignment: { // §18.8.1
                  horizontal: 'center'
                },
              });
          }
        });

        // // //Write Data in Excel file
        // console.log(building)
        let rowIndex = 3;
        var building_no = data[0].building_no
        // console.log(building_no)
        building.map(datain => {
          if (datain.building_no == building_no) {
            ws.cell(rowIndex, 2, 3, 4, true).string(datain.building_name).style({
              alignment: { // §18.8.1
                horizontal: 'center'
              }, fill: {
                type: 'pattern',
                patternType: 'solid',
                bgcolor: '#C0C0C0',
                fgColor: '#C0C0C0',

              }
            });
            rowIndex++
          }
        })
        data.forEach((record, index) => {

          if (building_no != record.building_no) {
            building.map(datain => {
              if (datain.building_no == record.building_no) {
                ws.cell(rowIndex, 2, rowIndex, 4, true).string(datain.building_name).style({
                  alignment: { // §18.8.1
                    horizontal: 'center'
                  }, fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    bgcolor: '#C0C0C0',
                    fgColor: '#C0C0C0',

                  }
                });
                rowIndex++
              }
            })
            console.log(record.building_no)
            building_no = record.building_no
          }
          let num = index + 1
          ws.cell(rowIndex, 1)
            .string(num.toString()).style({
              alignment: {
                horizontal: 'center'
              },
            });
          // console.log(record)
          let columnIndex = 2;
          Object.keys(record).forEach(columnName => {
            if (columnName == 'building_no') {
              return
            }
            if (columnName == 'ห้องสอบ') {
              ws.cell(rowIndex, columnIndex++)
                .string(record[columnName].toString()).style({
                  alignment: {
                    horizontal: 'center'
                  },
                });
            } else {
              ws.cell(rowIndex, columnIndex++)
                .string(record[columnName].toString())
            }


          });
          rowIndex++;
        });
        wb.write('report3.xlsx', function (err, stats) {
          if (err) {
            console.error(err);
          } else {
            callback('report3.xlsx')
          }
        });
        // callback('report.xlsx')

        connection.release(); // return the connection to pool
      });
    });
  }


}


module.exports.exportnamefile = async function (req, callback) {
  console.log('exportname')
  console.log(req.body)
  // console.log(req)
  let year = req.body.year
  let semester = req.body.semester
  let sql = `SELECT t_exam_room.exam_date as 'วันที่สอบ',IF(t_exam_room.exam_time = 1,"09:30-12:30","13:30-16:30") as เวลาสอบ,t_exam_committee.subject_id as รหัสวิชา,t_exam_room.room_no as ห้องสอบ,CONCAT(person.Firstname, ' ', person.Lastname) as 'ชื่อ-นามสกุล' ,t_exam_committee.subject_id as รหัสวิชา,subject.subject_ename ชื่อวิชา,t_exam_committee.faculty_id FROM t_exam_committee ,subject,t_exam_room,person WHERE t_exam_committee.subject_id = subject.subject_id and t_exam_room.exam_date = t_exam_committee.exam_date and t_exam_room.exam_time = t_exam_committee.exam_time and t_exam_room.mid_or_final = t_exam_committee.mid_or_final and t_exam_room.room_no = t_exam_committee.room_no and t_exam_room.subject_id = t_exam_committee.subject_id and t_exam_committee.person_id = person.Person_id and t_exam_committee.year = 2563 and t_exam_committee.semester = 2 and t_exam_committee.mid_or_final = 'M' ORDER BY faculty_id,person.Firstname ASC` // คำสั่ง sql
  var office = await getdataFromSql(`SELECT Office_id,Office_name FROM t_office WHERE Office_type != 2
  `)
  var officelist = []
  office.map((data) => {
    officelist.push([data.Office_id, data.Office_name])
  })
  // console.log(officelist)
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    pool.query(sql, [semester, year], async (err, rows) => {
      if (err) throw err;
      // console.log('The data from users table are: \n', rows);

      const xl = require('excel4node');
      const wb = new xl.Workbook();
      const ws = wb.addWorksheet('sheet');

      const data = rows
      const headingColumnNames = ["ตารางคุมสอบประจำภาคเรียนที่   2/2562     (กลางภาค)", "สำนักงานคณบดี (นานาชาติ)", "หมายเหตุ    ตึก 12 (12 ชั้น) รับข้อสอบที่งานสนับสนุนการเรียนการสอน ชั้น 1", "ตึก ME  (เครื่องกล) รับข้อสอบที่หน้าลิฟท์ ชั้น 1", "ตีก HM (เฉลิมพระเกียรติ) รับข้อสอบที่บริเวณโถง ชั้น 1"]

      //Write Column Title in Excel file
      // ws.cell(1, 2).string(headingColumnNames[0])
      // ws.cell(2, 2).string(headingColumnNames[1])
      headingColumnNames.map((data, index) => {
        ws.cell(index + 1, 2).string(data)

      })
      var heading = ["วันที่สอบ", "เวลาสอบ", "รหัสวิชา", "ห้องสอบ", "ชื่อ-นามสกุล", "ชื่อวิชา"]
      var dayinweek = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
      var month = ['ม.ค', 'ก.พ', 'มี.ค', 'เม.ย', 'พ.ค', 'มิ.ย', 'ก.ค', 'ส.ค', 'ก.ย', 'ต.ค', 'พ.ย', 'ธ.ค']
      //Write Column Title in Excel file
      ws.cell(6, 1).string(officelist[0][1])
      let headingColumnIndex = 1;
      heading.forEach(headingdata => {
        ws.cell(7, headingColumnIndex++)
          .string(headingdata)
      });

      // //Write Data in Excel file

      let rowIndex = 8;
      let officedata = '01'
      var check = false
      data.map((data, index) => {
        var columnIndex = 1
        if (officedata != data.faculty_id) {
          rowIndex++
          rowIndex++
          officelist.map(datain => {
            if (datain[0] == data.faculty_id) {
              ws.cell(rowIndex, 1).string(datain[1])
              rowIndex++
            }
          })
          Object.keys(data).forEach(columnName => {
            if (columnName != 'faculty_id' && columnName != 'วันที่สอบ') {
              ws.cell(rowIndex, columnIndex++).string(data[columnName].toString())
            }
            if (columnName == 'วันที่สอบ') {
              let daydata = data[columnName]
              daydata.setFullYear(daydata.getFullYear() - 543)
              let dateinweek = dayinweek[daydata.getDay()]
              let daystr = daydata.getDate()
              daydata.setFullYear(daydata.getFullYear() + 543)
              let monthstr = month[daydata.getMonth()]

              ws.cell(rowIndex, columnIndex++)
                .string(dateinweek + ' ' + daystr + ' ' + monthstr + ' ' + daydata.getFullYear().toString())
            }
          })
          officedata = data.faculty_id
        } else {
          Object.keys(data).forEach(columnName => {
            if (columnName != 'faculty_id' && columnName != 'วันที่สอบ') {
              ws.cell(rowIndex, columnIndex++).string(data[columnName].toString())
            }
            if (columnName == 'วันที่สอบ') {
              let daydata = data[columnName]
              daydata.setFullYear(daydata.getFullYear() - 543)
              let dateinweek = dayinweek[daydata.getDay()]
              let daystr = daydata.getDate()

              daydata.setFullYear(daydata.getFullYear() + 543)
              let monthstr = month[daydata.getMonth()]

              ws.cell(rowIndex, columnIndex++)
                .string(dateinweek + ' ' + daystr + ' ' + monthstr + ' ' + daydata.getFullYear().toString())
            }
          })
        }
        rowIndex++;
      })

      wb.write('report.xlsx', function (err, stats) {
        if (err) {
          console.error(err);
        } else {
          callback('report.xlsx')
        }
      });
      // callback('data.xlsx')

      connection.release(); // return the connection to pool
    });
  });


}

module.exports.report_filter = async function (callback) {
  // var year = req.body.year
  // var semester = req.body.semester
  // var mid_or_final = req.body.mid_or_final
  // var faculty_id = req.body.faculty_id
  // var state = req.body.state
  // var exam_date = req.body.exam_date
  // var exam_time = req.body.exam_time
  // คำสั่ง sql
  let sql = `
  SELECT year,concat('[',GROUP_CONCAT(DISTINCT json_object('semester',semester,'mid_or_final',mid_or_final,'exam_date',exam_date,'exam_time',exam_time,'faculty_id',faculty_id) ORDER BY semester,mid_or_final DESC),']' ) as filter FROM t_exam_committee GROUP by year  `;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    // console.log("exam committee filter");
    pool.query(sql, (err, rows) => {
      if (err) throw err;
      // console.log("The data from users table are: \n", rows);
      callback(rows);
      connection.release(); // return the connection to pool
    });
  });
}


module.exports.getfilter = function (callback) {
  // คำสั่ง sql
  let sql = `
  SELECT year,concat('[',GROUP_CONCAT(DISTINCT json_object('semester',semester,'mid_or_final',mid_or_final) ORDER BY semester,mid_or_final DESC),']' ) as filter FROM t_exam_room GROUP by year
  `;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("exam committee filter");
    pool.query(sql, (err, rows) => {
      if (err) throw err;
      // console.log("The data from users table are: \n", rows);
      callback(rows);
      connection.release(); // return the connection to pool
    });
  });
};