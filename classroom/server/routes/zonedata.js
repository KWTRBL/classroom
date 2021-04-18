const {pool} = require('./dbconfig')

module.exports.read = function (callback){

    let sql = 'SELECT * FROM curriculum2'  // คำสั่ง sql

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
module.exports.update = function(req,callback){
    let curr2_id = req.body.curr2_id
    let floor_zone = req.body.floor_zone
    let building_zone = req.body.building_zone

    let sql = "UPDATE curriculum2 SET building_zone = ? ,floor_zone = ? WHERE curr2_id = ?"  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,[building_zone,floor_zone,curr2_id], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows)
            connection.release(); // return the connection to pool
            
        });
    });


}

module.exports.delete = function (req,callback) {
    let curr2_id = req.body.data.curr2_id
    let sql = "UPDATE curriculum2 SET floor_zone = 0, building_zone='' WHERE curr2_id = ?"  // คำสั่ง sql
    pool.getConnection( (err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(sql,[curr2_id], async (err, rows) => {
            if (err) throw err;
            //console.log('The data from users table are: \n', rows);
            callback(rows.affectedRows)
            connection.release(); // return the connection to pool
            
        });
    });
}