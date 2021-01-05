const mysql = require('mysql') // เรียกใช้ mysql
const pool = mysql.createPool({   // config ค่าการเชื่อมต่อฐานข้อมูล
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'classroom_management',
    timezone:'Z'

})

module.exports = pool