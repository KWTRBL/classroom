const express = require('express') // เรียกใช้ Express
var cors = require('cors');
var bodyParser = require('body-parser');

const cookieParser = require('cookie-parser') // ใช้งาน cookie-parser module

const redis = require('redis')
const client = redis.createClient()

//new
var session = require('express-session')
const bcrypt = require('bcrypt')
var MySQLStore = require('express-mysql-session')(session);

var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'classroom_management',
    clearExpired: true,
    //expiration: 2000,
    checkExpirationInterval: 2000,

};

var sessionStore = new MySQLStore(options);





var port = process.env.PORT || 7777;
const building = require('./routes/building')
const classroom = require('./routes/classroom')
const upload = require('./routes/upload')
const zonedata = require('./routes/zonedata')
const groupdata = require('./routes/groupdata')
const teachdata = require('./routes/teachdata')
const semesterdata = require('./routes/semesterdata')
const yeardata = require('./routes/yeardata')
const availableroom = require('./routes/availableroom')
const auth = require('./routes/auth')
const manageroom = require('./routes/manageroom')
const curriculum = require('./routes/curriculum')

global.__basedir = __dirname;
const app = express() // สร้าง Object เก็บไว้ในตัวแปร app เพื่อนำไปใช้งาน
app.use(cookieParser())
/*
const corsOptions = {
    origin: /\.your.domain\.com$/,    // reqexp will match all prefixes
    methods: "GET,HEAD,POST,PATCH,DELETE,OPTIONS",
    credentials: true,                // required to pass
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
}
*/

app.use(session({
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
}));

app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));






//testlogin
app.post('/login', (req, res) => {   // Router เวลาเรียกใช้งาน

    auth.login(req, function (callback) {
        if(callback.message == "login success"){
            const timeout = 60 * 60 * 1000
            req.session.cookie.maxAge = timeout
            req.session.token = callback.token
            res.cookie('token', callback.token, { maxAge: timeout,httpOnly: true })
            res.cookie('session_id', req.sessionID, { maxAge: timeout,httpOnly: true })
            req.session.save()   
        }
        res.send({
            message:callback.message,
            isLogin:callback.isLogin
        })
        
    })
})
app.get('/auth', (req, res) => {
    auth.auth(req, function (callback) {
        res.status(200).send({
            login: callback
        })
    })

})

app.get('/logout', (req, res) => {
    res.cookie('token', '', {expires: new Date(1), path: '/' });
    res.cookie('session_id', '', {expires: new Date(1), path: '/' });
    res.cookie('connect.sid', '', {expires: new Date(1), path: '/' });
    auth.logout(req, function (callback) {
        res.status(200).send({
            logout: callback
        })
    })


})


app.post('/register', (req, res) => {   // Router เวลาเรียกใช้งาน
    auth.register(req, function (callback) {
        res.send(callback)
    })

})


//Building Data
app.get('/building', (req, res) => {   // Router เวลาเรียกใช้งาน
    building.read(function (callback) {
        res.json(callback)
    })
})

app.delete('/building/delete', (req, res) => {   // Router เวลาเรียกใช้งาน
    building.delete(req.body.building_no, function (callback) {
        console.log(callback)
        if (callback) {
            res.send('Success')
        }
        else {
            res.send('Error')
        }
    })
})

app.post('/building/insert', (req, res) => {   // Router เวลาเรียกใช้งาน
    building.add(req, function (callback) {
        res.send(callback)
    })

})

app.put('/building/update', (req, res) => {   // Router เวลาเรียกใช้งาน
    building.update(req, function (callback) {
        res.send(callback)
    })

})

//Classroom Data
app.get('/classroom', (req, res) => {   // Router เวลาเรียกใช้งาน
    classroom.read(function (callback) {
        res.json(callback)
    })
})

app.delete('/classroom/delete', (req, res) => {   // Router เวลาเรียกใช้งาน
    classroom.delete(req.body.room_no, function (callback) {
        console.log(callback)
        if (callback) {
            res.send('Success')
        }
        else {
            res.send('Error')
        }
    })
})

app.post('/classroom/insert', (req, res) => {   // Router เวลาเรียกใช้งาน
    classroom.add(req, function (callback) {
        res.send(callback)
    })

})

app.put('/classroom/update', (req, res) => {   // Router เวลาเรียกใช้งาน
    classroom.update(req, function (callback) {
        res.send(callback)
    })

})

//CurriculumZone Data
app.get('/zonedata', (req, res) => {   // Router เวลาเรียกใช้งาน
    zonedata.read(function (callback) {
        res.json(callback)
    })
})

//Curriculum Data From teachtable
app.get('/curriculum', (req, res) => {   // Router เวลาเรียกใช้งาน
    curriculum.read(function (callback) {
        res.json(callback)
    })
})


//CurriculumGroup Data
app.get('/groupdata', (req, res) => {   // Router เวลาเรียกใช้งาน
    groupdata.read(function (callback) {
        res.json(callback)
    })
})

app.put('/groupdata/update', (req, res) => {   // Router เวลาเรียกใช้งาน
    groupdata.update(req, function (callback) {
        res.send(callback)
    })

})


  



//Teach Data
app.get('/teachdata', (req, res) => {   // Router เวลาเรียกใช้งาน
    
    client.get('teachtable', async (error, data) => {
        /*
        if (error) {
          return res.json({
            message: 'Something went wrong!',
            error
          })
        }*/
        if (data) {
          return res.json(JSON.parse(data))
        }else{
            teachdata.read(function (callback) {
                client.setex('teachtable', 60, JSON.stringify(callback))
                res.json(callback)
            })
        }
    })
    
})

app.post('/teachdata/update', (req, res) => {   // Router เวลาเรียกใช้งาน
    teachdata.update(req,function (callback) {
        res.json(callback)
    })
})
//Semester Data
app.get('/semesterdata', (req, res) => {   // Router เวลาเรียกใช้งาน
    semesterdata.read(function (callback) {
        res.json(callback)
    })
})

//Year Data
app.get('/yeardata', (req, res) => {   // Router เวลาเรียกใช้งาน
    yeardata.read(function (callback) {
        res.json(callback)
    })
})

app.post('/uploadfile', upload.upload.single("uploadfile"), (req, res) => {
    upload.importCsvData2MySQL(__basedir + '/uploads/' + req.file.filename);
    res.json({
        'msg': 'File uploaded/import successfully!', 'file': req.file
    });
});

app.post('/insert', (req, res) => {   // Router เวลาเรียกใช้งาน
    upload.insert(req,function (callback) {
        console.log(callback.status)
        res.status(callback.status)
        res.end()
       // res.json(callback)
    })
})

//Availableroom Data
app.get('/availableroom', (req, res) => {   // Router เวลาเรียกใช้งาน
    availableroom.read(function (callback) {
        res.json(callback)
    })
})

//Manage room
app.post('/manageroom', (req, res) => {   // Router เวลาเรียกใช้งาน
    //console.log(req.body.data.year)
    manageroom.read(req,function (callback) {
        res.json(callback)
    })
})

app.listen(port, () => {     // 
    console.log('start port ' + port)
})