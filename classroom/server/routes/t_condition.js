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
    console.log(req.body)

    let sql = "UPDATE t_condition SET condition_status = ? ,building_no = ? ,own_subject = ?,condition_week = ?,condition_time = ?,condition_weekend = ?,freetime_week1 =?,freetime_week2 =?,freetime_week3 = ? ,freetime_week4 = ? WHERE person_id = ?"  // คำสั่ง sql
    pool.getConnection((err, connection) => {
        if(err) throw err;
        pool.query(sql,[condition_status,building_no,own_subject,condition_week,condition_time,condition_weekend,freetime_week1,freetime_week2,freetime_week3,freetime_week4,person_id],(err, rows) => {
            if(err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}