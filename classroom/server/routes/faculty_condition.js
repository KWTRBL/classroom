const {pool} = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT * FROM t_faculty_condition where faculty_id = "01"'  // คำสั่ง sql

    pool.getConnection((err, connection) => {
        if(err) throw err;
        //console.log('connected as id ' + connection.threadId);
        pool.query(sql, (err, rows) => {
            
            if(err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}

module.exports.update = function(req,callback){
    let committee_per_student = req.body.committee_per_student
   

    let sql = 'UPDATE t_faculty_condition SET committee_per_student = ? where faculty_id = "01"'  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        //console.log('connected as id ' + connection.threadId);
        pool.query(sql,[committee_per_student], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            
        });
    });
}
module.exports.updateweek1 = function(req,callback){
    let week1_start = req.body.week1_start
    //let week1_start="2562-09-25
    let year = req.body.year
    let semester = req.body.semester
    let mid_or_final = req.body.mid_or_final
    console.log("pppppp")
    console.log(req.body)
    let sql = 'UPDATE t_exam_week SET week1_start=? WHERE year=? AND semester=? AND mid_or_final=?'  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        //console.log('connected as id ' + connection.threadId);
        pool.query(sql,[week1_start,year,semester,mid_or_final], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            
        });
    });
}
module.exports.updateweek1_end = function(req,callback){
    let week1_end = req.body.week1_end
    let year = req.body.year
    let semester = req.body.semester
    let mid_or_final = req.body.mid_or_final
    console.log("eeeeee")
    console.log(req.body)
    let sql = 'UPDATE t_exam_week SET week1_end=? WHERE year=? AND semester=? AND mid_or_final=?'  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        //console.log('connected as id ' + connection.threadId);
        pool.query(sql,[week1_end,year,semester,mid_or_final], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            
        });
    });
}
module.exports.updateweek2 = function(req,callback){
    let week2_start = req.body.week2_start
    let year = req.body.year
    let semester = req.body.semester
    let mid_or_final = req.body.mid_or_final
    console.log("2s")
    console.log(req.body)
    let sql = 'UPDATE t_exam_week SET week2_start=? WHERE year=? AND semester=? AND mid_or_final=?'  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        //console.log('connected as id ' + connection.threadId);
        pool.query(sql,[week2_start,year,semester,mid_or_final], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            
        });
    });
}
module.exports.updateweek2_end = function(req,callback){
    let week2_end = req.body.week2_end
    let year = req.body.year
    let semester = req.body.semester
    let mid_or_final = req.body.mid_or_final
    console.log("2e")
    console.log(req.body)
    let sql = 'UPDATE t_exam_week SET week2_end=? WHERE year=? AND semester=? AND mid_or_final=?'  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        //console.log('connected as id ' + connection.threadId);
        pool.query(sql,[week2_end,year,semester,mid_or_final], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            
        });
    });
}
module.exports.updateweek3 = function(req,callback){
    let week3_start = req.body.week3_start
    let year = req.body.year
    let semester = req.body.semester
    let mid_or_final = req.body.mid_or_final
    console.log("3s")
    console.log(req.body)
    let sql = 'UPDATE t_exam_week SET week3_start=? WHERE year=? AND semester=? AND mid_or_final=?'  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        //console.log('connected as id ' + connection.threadId);
        pool.query(sql,[week3_start,year,semester,mid_or_final], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            
        });
    });
}
module.exports.updateweek3_end = function(req,callback){
    let week3_end = req.body.week3_end
    let year = req.body.year
    let semester = req.body.semester
    let mid_or_final = req.body.mid_or_final
    console.log("3e")
    console.log(req.body)
    let sql = 'UPDATE t_exam_week SET week3_end=? WHERE year=? AND semester=? AND mid_or_final=?'  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        //console.log('connected as id ' + connection.threadId);
        pool.query(sql,[week3_end,year,semester,mid_or_final], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            
        });
    });
}
module.exports.updateweek4 = function(req,callback){
    let week4_start = req.body.week4_start
    let year = req.body.year
    let semester = req.body.semester
    let mid_or_final = req.body.mid_or_final
    console.log("4s")
    console.log(req.body)
    let sql = 'UPDATE t_exam_week SET week4_start=? WHERE year=? AND semester=? AND mid_or_final=?'  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        //console.log('connected as id ' + connection.threadId);
        pool.query(sql,[week4_start,year,semester,mid_or_final], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            
        });
    });
}
module.exports.updateweek4_end = function(req,callback){
    let week4_end = req.body.week4_end
    let year = req.body.year
    let semester = req.body.semester
    let mid_or_final = req.body.mid_or_final
    console.log("4e")
    console.log(req.body)
    let sql = 'UPDATE t_exam_week SET week4_end=? WHERE year=? AND semester=? AND mid_or_final=?'  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        //console.log('connected as id ' + connection.threadId);
        pool.query(sql,[week4_end,year,semester,mid_or_final], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            
        });
    });
}