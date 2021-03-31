const {pool} = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT * FROM t_exam_week'   // คำสั่ง sql
    //Date.prototype.toJSON = function(){ return this.toLocaleString(); }

    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql, (err, rows) => {
            
            if(err) throw err;
            console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}

module.exports.readrecent = function (callback){
    var sql = `SELECT * FROM t_exam_week  where week1_start != 0
    ORDER BY t_exam_week.year DESC, t_exam_week.semester DESC, t_exam_week.mid_or_final ASC LIMIT 1`

    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql, (err, rows) => {
            if(err) throw err;
            // console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });

}

module.exports.update = function (callback){
    let date = new Date()
    let year = date.getFullYear() + 543
    let month = date.getMonth() + 1
    

    let semester = null
    if(month == 1){
        year = year-1
        semester = 2
    }
    if(month == 6){
        year = year-1
        semester = 3
    }
    if(month == 11){
        semester = 1
    }
    let sql1 = `INSERT INTO t_exam_week (year, semester , mid_or_final)
    VALUES ('${year}', '${semester}','M')`   // คำสั่ง sql Mid term
    let sql2 = `INSERT INTO t_exam_week (year, semester , mid_or_final)
    VALUES ('${year}', '${semester}','F')`   // คำสั่ง sql Final
    //console.log(sql2)
    
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql1, (err, rows) => {
            
            if(err) throw err;
            console.log('The data from users table are: \n', rows);
            
            //connection.release(); // return the connection to pool
        });
        pool.query(sql2, (err, rows) => {
            
            if(err) throw err;
            console.log('The data from users table are: \n', rows);
            //connection.release(); // return the connection to pool
        });
    });
    
}