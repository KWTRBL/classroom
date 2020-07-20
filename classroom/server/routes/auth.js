
const pool = require('./dbconfig')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

module.exports.register = function (req, callback) {
    let username = req.body.username
    let password = req.body.password
    let role = req.body.role
    const passwordHash = bcrypt.hashSync(password, 10)
    let sql = 'SELECT * FROM t_user where username = ?'
    pool.getConnection((err, connection) => {
        if (err) throw err;
        pool.query(sql, username, (err, rows) => {
            if (err) throw err;
            if (!rows.length) {
                sql = "INSERT INTO t_user (username,password,role) VALUES (?,?,?)"
                pool.query(sql, [username, passwordHash, role], (err, rows) => {
                    if (err) throw err;
                    callback("success")
                })
            } else {
                callback("ชื่อนี้ได้ถูกใช้ไปแล้้ว")
            }
            connection.release(); // return the connection to pool
        });
    });

}


module.exports.login = function (req, callback) {

    let SECRET = "flIkDlSKhujl4vBT41ofPZsYu2zvfqWy" //most important

    let username = req.body.username
    let password = req.body.password
    
    let sql = 'SELECT * FROM t_user where username = ?'
    pool.getConnection((err, connection) => {
        if (err) throw err;
        pool.query(sql, username, (err, rows) => {
            if (err) throw err;
            if (rows.length) {
                const result = bcrypt.compareSync(password, rows[0].password)
                if (result) {
                    console.log("pass")
                    var token = jwt.sign({
                        user_id: rows[0].username,
                        role: rows[0].role
                    }, SECRET)
                    callback({
                        message: "login success",
                        token:token,
                        isLogin:1
                    })
                } else {
                    callback({
                        message: "wrong password",
                        isLogin:0
                    })
                }
            }
            else {
                callback({
                    message: "ไม่มีชื่อผู้ใช้นี้",
                    isLogin:0
                })
            }
            connection.release(); // return the connection to pool
        });
    });

}

module.exports.auth = function (req, callback) {
    let isLogin = null
    req.sessionStore.get(req.cookies.session_id,(err,cb) =>{
        if(cb == null){
            isLogin = 0
        }
        else{
            isLogin = 1
        }            
        callback(isLogin)       
    })

}

module.exports.logout = function (req, callback) {
    //console.log("before: " ,req.session)
    req.session.destroy()
    //console.log("after: " ,req.session)
    callback("destroy")       
    

}


