const express = require('express') // เรียกใช้ Express
const mysql = require('mysql') // เรียกใช้ mysql
var cors = require('cors');
var bodyParser = require('body-parser');
const fs = require('fs');
var port = process.env.PORT || 7777;
const csv = require('fast-csv');
const multer = require('multer');


global.__basedir = __dirname;


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});

const upload = multer({ storage: storage });

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



function importCsvData2MySQL(filePath) {
    let stream = fs.createReadStream(filePath);
    let csvData = [];
    let csvStream = csv
        .parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            // Remove Header ROW
            csvData.shift();



            // Open the MySQL connection


            let query = 'INSERT INTO customer (id, address, name, age) VALUES ?';
            db.query(query, [csvData], (error, response) => {
                console.log(error || response);
            });



            // delete file after saving to MySQL database
            // -> you can comment the statement to see the uploaded CSV file.
            fs.unlinkSync(filePath)
        });

    stream.pipe(csvStream);
}

app.post('/uploadfile', upload.single("uploadfile"), (req, res) => {
    importCsvData2MySQL(__basedir + '/uploads/' + req.file.filename);
    res.json({
        'msg': 'File uploaded/import successfully!', 'file': req.file
    });
});

app.listen(port, () => {     // 
    console.log('start port ' + port)
})



