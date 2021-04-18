const { pool, regpool } = require('./dbconfig')

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    // console.log(index)
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
function getdataFromClassroomSql(query) {
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


function getdataFromRegSql(query) {
    return new Promise(function (resolve, reject) {
        regpool.query(query, async (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}
module.exports.read = async function (callback) {



    let subjectclassroomdata = await getdataFromClassroomSql(`select * from subject`)
    var subjectlist = subjectclassroomdata.map((data) => {
        return "'" + data.subject_id + "'"
    })
    let subjectregdata = await getdataFromRegSql(`select * from subject where subject_id not in ( ${[...subjectlist]})`)
    console.log('subjectregdata : ', subjectregdata.length)
    for (let index = 0; index < subjectregdata.length; index++) {
        let element = subjectregdata[index];
        var insertdata = await getdataFromClassroomSql(`
            INSERT INTO subject (subject_id , subject_tname, subject_ename, credit,lect_hr,prac_hr)
            VALUES ('${element.subject_id}','${element.subject_tname}','${element.subject_ename}','${element.credit}','${element.lect_hr}','${element.prac_hr}')
        `)
    }



    let teacherclassroomdata = await getdataFromClassroomSql(`select * from teacher`)
    var teacherlist = teacherclassroomdata.map((data) => {
        return "'" + data.teacher_id + "'"
    })
    let teacherregdata = await getdataFromRegSql(`select * from teacher where teacher_id   not in ( ${[...teacherlist]})`)
    console.log('teacherregdata : ', teacherregdata.length)
    for (let index = 0; index < teacherregdata.length; index++) {
        let element = teacherregdata[index];
        await getdataFromClassroomSql(`
            INSERT INTO teacher (teacher_id,user_id,faculty_id,dept_id,prename,t_prename,teacher_tname,e_prename,teacher_ename,degree,position,type,person_id,level,exam_use,exam_day,exam_time_cond,exam_build_cond1,exam_build_cond2,citizen_id,advise_status,edit_user,edit_stamp,alive,create_user,create_time,faculty2_id,dept2_id,curr2_id,UID,FIRSTNAME_TH,LASTNAME_TH,FIRSTNAME_EN,LASTNAME_EN,DEP_CODE,Rank)
            VALUES ('${element.teacher_id}','${element.user_id}','${element.faculty_id}','${element.dept_id}','${element.prename}','${element.t_prename}','${element.teacher_tname}','${element.e_prename}','${element.teacher_ename}','${element.degree}','${element.position}','${element.type}','${element.person_id}','${element.level}','${element.exam_use}','${element.exam_day}','${element.exam_time_cond}','${element.exam_build_cond1}','${element.exam_build_cond2}','${element.citizen_id}','${element.advise_status}','${element.edit_user}','${element.edit_stamp}','${element.alive}','${element.create_user}','${element.create_time}','${element.faculty2_id}','${element.dept2_id}','${element.curr2_id}','${element.UID}','${element.FIRSTNAME_TH}','${element.LASTNAME_TH}','${element.FIRSTNAME_EN}','${element.LASTNAME_EN}','${element.DEP_CODE}','')
        `)
        await getdataFromClassroomSql(`
            INSERT IGNORE  INTO person (Reg_id,Person_id,Person_type,Prename,Firstname,Lastname,Position,Office_type,Office_id)
            VALUES ('${element.teacher_id}','${element.teacher_id}','1','${element.t_prename}','${element.FIRSTNAME_TH}','${element.LASTNAME_TH}','','1','${element.dept_id}')
        `)
        await getdataFromClassroomSql(`
            INSERT IGNORE INTO t_condition (faculty_id,person_id,person_type,building_no,condition_status,own_subject,condition_week,condition_time,condition_weekend,freetime_week1,freetime_week2,freetime_week3,freetime_week4,mark,markcount,overexam)
            VALUES ('${element.dept_id}','${element.teacher_id}','1','ไม่มีเงื่อนไข','1','1','0','0','3','','','','','0','0','0')
        `)

    }


    datalist = []
    let teacher_teachclassroomdata = await getdataFromClassroomSql(`select * from teacher_teach order by subject_id asc`)
    let teacher_teachregdata = await getdataFromRegSql(`select * from teacher_teach order by subject_id asc `)
    teacher_teachregdata.map((data) => {
        for (let index = 0; index < teacher_teachclassroomdata.length; index++) {
            const element = teacher_teachclassroomdata[index];
            if (data.faculty_id == element.faculty_id && data.dept_id == element.dept_id && data.curr_id == element.curr_id && data.curr2_id == element.curr2_id && data.subject_id == element.subject_id && data.semester == element.semester && data.year == element.year && data.class == element.class && data.program == element.program && data.section == element.section && data.teacher_id == element.teacher_id && data.lect_or_prac == element.lect_or_prac) {
                datalist.push(data)
                break
            }
        }
    })

    // console.log(teacher_teachclassroomdata.length,teacher_teachregdata.length,datalist.length)

    for (let index = 0; index < datalist.length; index++) {
        const element = datalist[index];
        let len = teacher_teachregdata.length
        removeItemOnce(teacher_teachregdata, element)
        if (teacher_teachregdata.length == len - 1) {
            index--
        }
    }
    console.log('teacher_teachregdata : ', teacher_teachclassroomdata.length, teacher_teachregdata.length, datalist.length)
    for (let index = 0; index < teacher_teachregdata.length; index++) {
        let element = teacher_teachregdata[index];

        console.log(element)
        element.time_stamp = typeof element.time_stamp == 'string' ? element.time_stamp : element.time_stamp
            .toJSON()
            .slice(0, 19)
            .replace("T", " ");
        //     console.log(`
        //     INSERT INTO teacher_teach (faculty_id,dept_id,curr_id,subject_id,semester,year,class,program,section,teacher_id,lect_or_prac,priority,time_stamp,curr2_id)
        //     VALUES ('${element.faculty_id}','${element.dept_id}','${element.curr_id}','${element.subject_id}','${element.semester}','${element.year}','${element.class}','${element.program}','${element.section}','${element.teacher_id}','${element.lect_or_prac}','${element.priority}','${element.time_stamp}','${element.curr2_id}')
        // `)
        var insertdata = await getdataFromClassroomSql(`
                INSERT INTO teacher_teach (faculty_id,dept_id,curr_id,subject_id,semester,year,class,program,section,teacher_id,lect_or_prac,priority,time_stamp,curr2_id)
                VALUES ('${element.faculty_id}','${element.dept_id}','${element.curr_id}','${element.subject_id}','${element.semester}','${element.year}','${element.class}','${element.program}','${element.section}','${element.teacher_id}','${element.lect_or_prac}','${element.priority}','${element.time_stamp}','${element.curr2_id}')
            `)
    }




    datalist = []
    let teach_tableclassroomdata = await getdataFromClassroomSql(`select * from teach_table order by subject_id asc`)
    let teach_tableregdata = await getdataFromRegSql(`select * from teach_table order by subject_id asc `)

    teach_tableregdata.map((data) => {
        for (let index = 0; index < teach_tableclassroomdata.length; index++) {
            const element = teach_tableclassroomdata[index];
            element.exam_date = typeof element.exam_date == 'string' ? element.exam_date : element.exam_date
                .toJSON()
                .slice(0, 19)
                .replace("T", " ");
            element.mexam_date = typeof element.mexam_date == 'string' ? element.mexam_date : element.mexam_date
                .toJSON()
                .slice(0, 19)
                .replace("T", " ");
            data.exam_date = typeof data.exam_date == 'string' ? data.exam_date : data.exam_date
                .toJSON()
                .slice(0, 19)
                .replace("T", " ");
            data.mexam_date = typeof data.mexam_date == 'string' ? data.mexam_date : data.mexam_date
                .toJSON()
                .slice(0, 19)
                .replace("T", " ");
            // console.log(element)
            if (data.curr2_id == element.curr2_id && data.subject_id == element.subject_id && data.semester == element.semester && data.year == element.year && data.class == element.class && data.section == element.section && data.limit == element.studentnum && data.teach_day == element.teach_day && data.teach_time == element.teach_time && data.teach_time2 == element.teach_time2 && data.subj_type == element.subj_type) {
                datalist.push(data)
                break
            }
        }
    })

    // console.log(teach_tableclassroomdata.length, teach_tableregdata.length, datalist.length)
    // console.log(datalist[0])

    for (let index = 0; index < datalist.length; index++) {
        const element = datalist[index];
        let len = teach_tableregdata.length
        removeItemOnce(teach_tableregdata, element)
        if (teach_tableregdata.length == len - 1) {
            index--
        }
    }
    console.log("teach_tableregdata :", teach_tableclassroomdata.length, teach_tableregdata.length, datalist.length)

    if (teach_tableclassroomdata.length != teach_tableregdata.length) {
        for (let index = 0; index < teach_tableregdata.length; index++) {
            let element = teach_tableregdata[index];

            // console.log(element)
            element.exam_date = typeof element.exam_date == 'string' ? element.exam_date : element.exam_date
                .toJSON()
                .slice(0, 19)
                .replace("T", " ");
            element.mexam_date = typeof element.mexam_date == 'string' ? element.mexam_date : element.mexam_date
                .toJSON()
                .slice(0, 19)
                .replace("T", " ");
            // console.log(element)
            var insertdata = await getdataFromClassroomSql(`
                INSERT INTO teach_table (building_no,class,closed,curr2_id,dept_id,exam_date,exam_day,exam_time,exam_time2,lect_or_prac,mexam_date,mexam_day,mexam_time,mexam_time2,room_no,section,semester,studentnum,subject_id,subj_type,teachtime_str,teach_day,teach_status,teach_time,teach_time2,year)
                VALUES ('${element.building_no}','${element.class}','${element.closed}','${element.curr2_id}','','${element.exam_date}','${element.exam_day}','${element.exam_time}','${element.exam_time2}','${element.lect_or_prac}','${element.mexam_date}','${element.mexam_day}','${element.mexam_time}','${element.mexam_time2}','${element.room_no}','${element.section}','${element.semester}','${element.limit}','${element.subject_id}','${element.subj_type}','${element.teachtime_str}','${element.teach_day}','','${element.teach_time}','${element.teach_time2}','${element.year}')
            `)
        }
    }



    let t_exam_roomclassroomdata = await getdataFromClassroomSql(`select * from t_exam_room `)
    let t_exam_roomregdata = await getdataFromRegSql(`select * from t_exam_room  `)
    var datalist = []
    t_exam_roomregdata.map((data) => {
        for (let index = 0; index < t_exam_roomclassroomdata.length; index++) {
            const element = t_exam_roomclassroomdata[index];
            if (data.faculty_id == element.faculty_id && data.year == element.year && data.semester == element.semester && data.mid_or_final == element.mid_or_final && data.exam_date.getTime() === element.exam_date.getTime() && data.exam_time == element.exam_time && data.building_no == element.building_no && data.room_no == element.room_no && data.row_type == element.row_type && data.subject_id == element.subject_id && data.section == element.section && data.lect_or_prac == element.lect_or_prac && data.std_num == element.std_num && data.sec_std_sum == element.sec_std_sum) {
                datalist.push(data)
                break
            }
        }
    })

    for (let index = 0; index < datalist.length; index++) {
        const element = datalist[index];
        let len = t_exam_roomregdata.length
        removeItemOnce(t_exam_roomregdata, element)
        if (t_exam_roomregdata.length == len - 1) {
            index--
        }
    }
    console.log('t_exam_roomregdata : ', t_exam_roomregdata.length)
    if (t_exam_roomclassroomdata.length != t_exam_roomregdata.length) {
        for (let index = 0; index < t_exam_roomregdata.length; index++) {
            let element = t_exam_roomregdata[index];
            element.exam_date = typeof element.exam_date == 'string' ? element.exam_date : element.exam_date
                .toJSON()
                .slice(0, 19)
                .replace("T", " ");
            element.save_time = typeof element.save_time == 'string' ? element.save_time : element.save_time
                .toJSON()
                .slice(0, 19)
                .replace("T", " ");
            var insertdata = await getdataFromClassroomSql(`
                    INSERT INTO t_exam_room (faculty_id,year,semester,mid_or_final,exam_date,exam_time,building_no,room_no,row_type,subject_id,section,lect_or_prac,std_num,sec_std_sum,save_time)
                    VALUES ('${element.faculty_id}','${element.year}','${element.semester}','${element.mid_or_final}','${element.exam_date}','${element.exam_time}','${element.building_no}','${element.room_no}','${element.row_type}','${element.subject_id}','${element.section}','${element.lect_or_prac}','${element.std_num}','${element.sec_std_sum}','${element.save_time}')
                `)
        }
    }


    let available_room = await getdataFromClassroomSql(`select year,semester from t_availableroom group by year,semester`)
    let teach_table_year = await getdataFromClassroomSql(`select year,semester from teach_table group by year,semester`)
    datalist = []
    teach_table_year.map(data => {
        for (let index = 0; index < available_room.length; index++) {
            const element = available_room[index];
            if (element.year == data.year && element.semester == data.semester) {
                datalist.push(data)
                break
            }

        }
    })
    for (let index = 0; index < datalist.length; index++) {
        const element = datalist[index];
        let len = teach_table_year.length
        removeItemOnce(teach_table_year, element)
        if (teach_table_year.length == len - 1) {
            index--
        }
    }

    // var roomdata = await getdataFromClassroomSql(`
    //         select distinct * from t_availableroom where year = ${available_room[0].year} and semester = ${available_room[0].semester} 
    //     `)
    var roomdata = await getdataFromClassroomSql(`
            select distinct * from t_room
        `)
    console.log('teach_table_year : ', teach_table_year.length)
    for (let index = 0; index < teach_table_year.length; index++) {
        const element = teach_table_year[index];
        for (let roomindex = 0; roomindex < roomdata.length; roomindex++) {
            const roomelement = roomdata[roomindex];
            for (let index = 1; index < 8; index++) {
                var insertdata = await getdataFromClassroomSql(`
                    INSERT INTO t_availableroom (room_no,teach_day,year,semester,morning,noon,evening)
                    VALUES ('${roomelement.room_no}','${i}','${element.year}','${element.semester}','0','0','0')
                `)
            }
        }
    }

    callback(['success'])



}

