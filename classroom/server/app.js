const express = require('express') // เรียกใช้ Express
const mysql = require('mysql') // เรียกใช้ mysql
var cors = require('cors');
var bodyParser = require('body-parser');

var port = process.env.PORT || 7777;

const db = mysql.createConnection({   // config ค่าการเชื่อมต่อฐานข้อมูล
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'classroom_management'
})

db.connect() // เชื่อมต่อฐานข้อมูล
const app = express() // สร้าง Object เก็บไว้ในตัวแปร app เพื่อนำไปใช้งาน
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
// Select Data
app.get('/users', (req, res) => {   // Router เวลาเรียกใช้งาน

    let sql = 'SELECT * FROM t_building'  // คำสั่ง sql
    let query = db.query(sql, (err, results) => { // สั่ง Query คำสั่ง sql
        if (err) throw err  // ดัก error
        console.log(results) // แสดงผล บน Console 
        res.json(results)   // สร้างผลลัพธ์เป็น JSON ส่งออกไปบน Browser
    })
})

app.listen(port, () => {     // 
    console.log('start port '+port)
})



