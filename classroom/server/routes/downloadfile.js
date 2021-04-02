const { pool } = require('./dbconfig')


module.exports.read = async function (req, callback) {
    console.log(req.body)
    // console.log(req)
    let year = req.body.year
    let semester = req.body.semester
    let curr2_id = req.body.curr2_id
    let curr2_tname = req.body.curr2_tname
    let sql = `SELECT teach_table.subject_id as รหัสวิชา,subject.subject_ename as ชื่อวิชา,teach_table.class as ชั้นปี,teach_table.section as กลุ่ม,
    CONCAT(teacher.t_prename,teacher.teacher_tname) as ชื่อผู้สอน,
        teach_table.studentnum as จำนวนนศ,teach_table.room_no as ห้องเรียน,teach_table.building_no as อาคารเรียน,
        CONCAT(IF(teach_table.teach_day=1,'อา.',IF(teach_table.teach_day=2,'จ.',
                                                IF(teach_table.teach_day=3,'อ.',
                                                   IF(teach_table.teach_day=4,'พ.',
                                                      IF(teach_table.teach_day=5,'พฤ.', 
                                                         IF(teach_table.teach_day=6,'ศ.', 
                                                            IF(teach_table.teach_day=7,'ส.',teach_table.teach_day))))))) ,teach_table.teach_time,"-",teach_table.teach_time2) 
        AS วันที่เรียน,teach_table.lect_or_prac as ประเภท
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
                "รหัสวิชา",
                "ชื่อวิชา",
                "ชั้นปี",
                "กลุ่ม",
                "ชื่อผู้สอน",
                "จำนวนนศ",
                "ห้องเรียน",
                "อาคารเรียน",
                "วันที่เรียน",
                "ประเภท",
            ]

            ws.cell(1, 2).string(`ประกาศ คณะวิศวกรรมศาสตร์`)
            ws.cell(2, 2).string(`เรื่อง ตารางเรียน - ตารางสอบ ประจำภาคเรียนที่ ${semester} ปีการศึกษา ${year}`)
            ws.cell(3, 2).string(`ภาควิชา ${curr2_tname}`)

            //Write Column Title in Excel file
            let headingColumnIndex = 1;
            headingColumnNames.forEach(heading => {
                ws.cell(4, headingColumnIndex++)
                    .string(heading)
            });

            //Write Data in Excel file
            let rowIndex = 5;
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
