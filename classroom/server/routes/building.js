const pool = require('./dbconfig')


module.exports.read = function (callback) {

    let sql = 'SELECT * FROM t_building ORDER BY building_no'  // คำสั่ง sql

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql, (err, rows) => {

            if (err) throw err;
           // console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
        });
    });
}


module.exports.delete = function (building_no,callback) {
    let sql = "DELETE FROM t_building WHERE t_building.building_no = ?"  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,building_no, async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows.affectedRows)
            connection.release(); // return the connection to pool
            
        });
    });
}

module.exports.update = function(req,callback){
    let building_no = req.body.building_no
    let building_name = req.body.building_name
    let floor_num = req.body.floor_num
    let building_no_select = req.body.building_no_select
    

    let sql = "UPDATE t_building SET building_no = ? ,building_name = ?,floor_num = ? WHERE building_no = ?"  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,[building_no,building_name,floor_num,building_no_select], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            
        });
    });


}
module.exports.add = function (req,callback) {
    let building_no = req.body.data.building_no
    let building_name = req.body.data.building_name
    let floor_num = req.body.data.floor_num
    let sql = "INSERT INTO t_building (building_no, building_name, floor_num) VALUES (?, ?, ?); "  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,[building_no,building_name,floor_num], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            
        });
    });
}