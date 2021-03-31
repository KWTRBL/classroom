const  {pool} = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT * FROM curriculum2 WHERE EXISTS(SELECT curr2_id FROM teach_table where teach_table.curr2_id = curriculum2.curr2_id)'  // คำสั่ง sql

    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql, (err, rows) => {
            
            if(err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}

module.exports.readforteacherteach = function (callback){

    let sql = 'SELECT * FROM department WHERE EXISTS(SELECT dept_id FROM teacher_teach where teacher_teach.dept_id = department.dept_id)'  // คำสั่ง sql

    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql, (err, rows) => {
            
            if(err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}