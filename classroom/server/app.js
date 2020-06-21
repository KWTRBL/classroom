const express = require('express') // เรียกใช้ Express
var cors = require('cors');
var bodyParser = require('body-parser');
var port = process.env.PORT || 7777;
const building = require('./routes/building')
const classroom = require('./routes/classroom')
const upload = require('./routes/upload')
const zonedata = require('./routes/zonedata')


global.__basedir = __dirname;
const app = express() // สร้าง Object เก็บไว้ในตัวแปร app เพื่อนำไปใช้งาน
app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Building Data
app.get('/building', (req, res) => {   // Router เวลาเรียกใช้งาน
    building.read(function (callback) {
        res.json(callback)
    })
})

//Classroom Data
app.get('/classroom', (req, res) => {   // Router เวลาเรียกใช้งาน
    classroom.read(function (callback) {
        res.json(callback)
    })
})

//CurriculumZone Data
app.get('/zonedata', (req, res) => {   // Router เวลาเรียกใช้งาน
    zonedata.read(function (callback) {
        res.json(callback)
    })
})

app.post('/uploadfile', upload.upload.single("uploadfile"), (req, res) => {
    upload.importCsvData2MySQL(__basedir + '/uploads/' + req.file.filename);
    res.json({
        'msg': 'File uploaded/import successfully!', 'file': req.file
    });
});


app.listen(port, () => {     // 
    console.log('start port ' + port)
})



