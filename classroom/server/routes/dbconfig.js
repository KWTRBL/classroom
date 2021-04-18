const mysql = require('mysql') // เรียกใช้ mysql
const pool = mysql.createPool({   // config ค่าการเชื่อมต่อฐานข้อมูล
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'classroom_management',
    timezone:'Z'

})


const regpool = mysql.createPool({   // config ค่าการเชื่อมต่อฐานข้อมูล
    connectionLimit: 100,
    host: 'localhost', //ipaddress
    user: 'root',
    password: '',
    database: 'view_ecms',
    timezone:'Z'

})



module.exports = {pool ,regpool}