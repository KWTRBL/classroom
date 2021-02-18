const pool = require('./dbconfig')


module.exports.read = async function (req, callback) {
    console.log(req.body)
    // console.log(req)
    let year = req.body.year
    let semester = req.body.semester
    let curr2_id = req.body.curr2_id
    let sql = `SELECT teach_table.year as ปี,teach_table.semester as เทอม, curriculum2.curr2_tname as สาขาวิชา,teach_table.subject_id as รหัสวิชา,subject.subject_ename as ชื่อวิชา,teach_table.class as ชั้นปี,teach_table.section as กลุ่ม,teacher.t_prename as คำนำหน้าชื่อ,teacher.teacher_tname as ชื่อผู้สอน,
    teach_table.studentnum as จำนวนนศ,teach_table.room_no as ห้องเรียน,teach_table.building_no as อาคารเรียน,
    IF(teach_table.teach_day=1,'อาทิตย์',IF(teach_table.teach_day=2,'จันทร์',
                                            IF(teach_table.teach_day=3,'อังคาร',
                                               IF(teach_table.teach_day=4,'พุธ',
                                                  IF(teach_table.teach_day=5,'พฤหัสบดี', 
                                                     IF(teach_table.teach_day=6,'ศุกร์', 
                                                        IF(teach_table.teach_day=7,'เสาร์',teach_table.teach_day))))))) 
    AS วันที่เรียน
    ,teach_table.teach_time as เวลาเริ่มเรียน,teach_table.teach_time2 as เวลาเลิกเรียน,teach_table.lect_or_prac as ประเภท,teach_status as การจัดห้อง
    FROM teach_table ,curriculum2,subject,teacher,teacher_teach
    WHERE teach_table.semester=? AND teach_table.year=? AND teach_table.curr2_id=? AND teach_table.subject_id=subject.subject_id AND teach_table.curr2_id=curriculum2.curr2_id AND teach_table.subject_id=teacher_teach.subject_id AND teach_table.section=teacher_teach.section AND teacher_teach.teacher_id=teacher.teacher_id 
    ORDER BY teach_table.curr2_id,teach_table.class,teach_table.subject_id,teach_table.section ASC`  // คำสั่ง sql

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql, [semester, year, curr2_id], async (err, rows) => {
            if (err) throw err;
            // console.log('The data from users table are: \n', rows);

            const xl = require('excel4node');
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('sheet');

            const data = rows
            const headingColumnNames = [
                "ปีการศึกษา",
                "ภาคการศึกษา",
                "สาขาวิชา",
                "รหัสวิชา",
                "ชื่อวิชา",
                "ชั้นปี",
                "กลุ่ม",
                "คำนำหน้าชื่อ",
                "ชื่อผู้สอน",
                "จำนวนนศ",
                "ห้องเรียน",
                "อาคารเรียน",
                "วันที่เรียน",
                "เวลาเริ่มเรียน",
                "เวลาเลิกเรียน",
                "ประเภท",
                "การจัดห้อง",
            ]

            //Write Column Title in Excel file
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(1, headingColumnIndex++)
                    .string(heading)
            });

            //Write Data in Excel file
            let rowIndex = 2;
            data.forEach(record => {
                let columnIndex = 1;
                Object.keys(record).forEach(columnName => {
                        ws.cell(rowIndex, columnIndex++)
                        .string(record[columnName].toString())
                });
                rowIndex++;
            });
            wb.write('report.xlsx', function (err, stats) {
                if (err) {
                    console.error(err);
                } else {
                    callback('report.xlsx')
                }
            });

            connection.release(); // return the connection to pool
        });
    });


}
