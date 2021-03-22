const pool = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT A.*,B.Prename,B.Firstname,B.Lastname,B.position,C.Office_name,C.Office_type FROM t_condition as A,person as B ,t_office as C where A.Person_id = B.person_id and C.Office_id = A.faculty_id'  // คำสั่ง sql

    pool.getConnection((err, connection) => {
        if(err) throw err;
        // console.log('connected as id ' + connection.threadId);
        //console.log("t_condition")
        pool.query(sql, (err, rows) => {
            
            if(err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}

module.exports.updatecondition = function (req,callback){
    console.log('update condition in t_condition')
    let Prename = req.body.Prename
    let Firstname = req.body.Firstname
    let Lastname = req.body.Lastname
    let Position = req.body.Position
    let condition_status = req.body.condition_status
    let person_id = req.body.person_id
    let building_no = req.body.building_no
    let own_subject = req.body.own_subject
    let condition_week = req.body.condition_week
    let condition_time = req.body.condition_time
    let condition_weekend = req.body.condition_weekend
    var freetime_week1 = req.body.freetime_week1
    var freetime_week2 = req.body.freetime_week2
    var freetime_week3 = req.body.freetime_week3
    var freetime_week4 = req.body.freetime_week4
    var Office_id = req.body.Office_id
    console.log(req.body,Office_id)

    let sql = "UPDATE t_condition,person SET t_condition.condition_status = ? ,t_condition.building_no = ? ,t_condition.own_subject = ?,t_condition.condition_week = ?,t_condition.condition_time = ?,t_condition.condition_weekend = ?,t_condition.freetime_week1 =?,t_condition.freetime_week2 =?,t_condition.freetime_week3 = ? ,t_condition.freetime_week4 =?,person.Prename=?,person.Firstname=?,person.Lastname=?,person.Position=?,person.Office_id=?,t_condition.faculty_id=? WHERE t_condition.person_id =? AND person.Person_id=?"  // คำสั่ง sql
    pool.getConnection((err, connection) => {
        if(err) throw err;
        pool.query(sql,[condition_status,building_no,own_subject,condition_week,condition_time,condition_weekend,freetime_week1,freetime_week2,freetime_week3,freetime_week4,Prename,Firstname,Lastname,Position,Office_id,Office_id,person_id,person_id],(err, rows) => {
            if(err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}
module.exports.add = function (req,callback) {
    let Prename = req.body.data.Prename
    let Firstname = req.body.data.Firstname
    let Lastname = req.body.data.Lastname
    let Position = req.body.data.Position
    let Office_id = req.body.data.Office_id
    //let Office_id = "01"    //รับค่า office_id ไม่ได้
    //let person_type = 1
    let person_type = req.body.data.person_type
    //let office_type = 1
    //let condition_status = 1 
    let condition_status = req.body.data.condition_status
    let office_type = req.body.data.office_type
    let person_id = req.body.data.person_id
    console.log(req.body.data)
    let sql = "INSERT INTO person (Person_id, Person_type,Prename,Firstname,Lastname,Position,Office_type,Office_id) VALUES (?,?,?,?,?,?,?,?) "  // คำสั่ง sql
    let sql2 = "INSERT INTO t_condition (faculty_id,person_id,person_type,building_no,condition_status,own_subject,condition_week,condition_time,condition_weekend) VALUES (?, ?, ?,'ไม่มีเงื่อนไข',?,1,0,0,0)"
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,[person_id,person_type,Prename,Firstname,Lastname,Position,office_type,Office_id], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql2,[Office_id,person_id,person_type,condition_status], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}