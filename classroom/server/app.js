//include lib
const express = require("express"); // เรียกใช้ Express
var cors = require("cors");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); // ใช้งาน cookie-parser module
var session = require("express-session");
const bcrypt = require("bcrypt");
var MySQLStore = require("express-mysql-session")(session);
var cron = require("node-cron");

//import file
const building = require("./routes/building");
const classroom = require("./routes/classroom");
const upload = require("./routes/upload");
const zonedata = require("./routes/zonedata");
const groupdata = require("./routes/groupdata");
const teachdata = require("./routes/teachdata");
const semesterdata = require("./routes/semesterdata");
const yeardata = require("./routes/yeardata");
const availableroom = require("./routes/availableroom");
const auth = require("./routes/auth");
const manageroom = require("./routes/manageroom");
const curriculum = require("./routes/curriculum");
const department = require("./routes/department");
const teacher = require("./routes/teacher");
const officer = require("./routes/officer");
const teacherteach = require("./routes/teacherteach");
const facultycondition = require("./routes/faculty_condition");
const examweek = require("./routes/examweek");
const t_condition = require("./routes/t_condition");
const person = require("./routes/person");
const t_exam_room = require("./routes/t_examroom");
const t_office = require("./routes/t_office");
const exam_schedule = require("./routes/exam_schedule");

//insert examweekdata every semester
cron.schedule("0 0 1 1,6,8 *", () => {
  console.log("detect new semester");
  examweek.update();
});

var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "classroom_management",
  clearExpired: true,
  //expiration: 2000,
  checkExpirationInterval: 2000,
};
var sessionStore = new MySQLStore(options);

var port = process.env.PORT || 7777;
global.__basedir = __dirname;

//express
const app = express(); // สร้าง Object เก็บไว้ในตัวแปร app เพื่อนำไปใช้งาน
app.use(
  session({
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//login
app.post("/login", (req, res) => {
  // Router เวลาเรียกใช้งาน

  auth.login(req, function (callback) {
    if (callback.message == "login success") {
      const timeout = 60 * 60 * 1000;
      req.session.cookie.maxAge = timeout;
      req.session.token = callback.token;
      res.cookie("token", callback.token, { maxAge: timeout, httpOnly: true });
      res.cookie("session_id", req.sessionID, {
        maxAge: timeout,
        httpOnly: true,
      });
      req.session.save();
    }
    res.send({
      message: callback.message,
      isLogin: callback.isLogin,
    });
  });
});

//authen ของการ login
app.get("/auth", (req, res) => {
  auth.auth(req, function (callback) {
    res.status(200).send({
      login: callback,
    });
  });
});


//ลบ session ออกจาก db
app.get("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(1), path: "/" });
  res.cookie("session_id", "", { expires: new Date(1), path: "/" });
  res.cookie("connect.sid", "", { expires: new Date(1), path: "/" });
  auth.logout(req, function (callback) {
    res.status(200).send({
      logout: callback,
    });
  });
});


//register account api
app.post("/register", (req, res) => {
  // Router เวลาเรียกใช้งาน
  auth.register(req, function (callback) {
    res.send(callback);
  });
});

//Building Data
app.get("/building", (req, res) => {
  // Router เวลาเรียกใช้งาน
  building.read(function (callback) {
    res.json(callback);
  });
});

//building data delete
app.delete("/building/delete", (req, res) => {
  // Router เวลาเรียกใช้งาน
  building.delete(req.body.building_no, function (callback) {
    console.log(callback);
    if (callback) {
      res.send("Success");
    } else {
      res.send("Error");
    }
  });
});


//insert ข้อมูลลง t_building
app.post("/building/insert", (req, res) => {
  // Router เวลาเรียกใช้งาน
  building.add(req, function (callback) {
    res.send(callback);
  });
});

//update ข้อมูล
app.put("/building/update", (req, res) => {
  // Router เวลาเรียกใช้งาน
  building.update(req, function (callback) {
    res.send(callback);
  });
});

//get Classroom Data
app.get("/classroom", (req, res) => {
  // Router เวลาเรียกใช้งาน
  classroom.read(function (callback) {
    res.json(callback);
  });
});

//delete classroom data
app.delete("/classroom/delete", (req, res) => {
  // Router เวลาเรียกใช้งาน
  classroom.delete(req.body.room_no, function (callback) {
    console.log(callback);
    if (callback) {
      res.send("Success");
    } else {
      res.send("Error");
    }
  });
});

app.post("/classroom/insert", (req, res) => {
  // Router เวลาเรียกใช้งาน
  classroom.add(req, function (callback) {
    res.send(callback);
  });
});

app.put("/classroom/update", (req, res) => {
  // Router เวลาเรียกใช้งาน
  classroom.update(req, function (callback) {
    res.send(callback);
  });
});

//CurriculumZone Data
app.get("/zonedata", (req, res) => {
  // Router เวลาเรียกใช้งาน
  zonedata.read(function (callback) {
    res.json(callback);
  });
});

//Curriculum Data From teachtable
app.get("/curriculum", (req, res) => {
  // Router เวลาเรียกใช้งาน
  curriculum.read(function (callback) {
    res.json(callback);
  });
});

//Curriculum teacherteach Data From teachtable
app.get("/teacherteachcurriculum", (req, res) => {
  // Router เวลาเรียกใช้งาน
  curriculum.readforteacherteach(function (callback) {
    res.json(callback);
  });
});

//Department data
app.get("/department", (req, res) => {
  // Router เวลาเรียกใช้งาน
  department.read(function (callback) {
    res.json(callback);
  });
});

//teacher data
app.get("/teacher", (req, res) => {
  // Router เวลาเรียกใช้งาน
  teacher.read(function (callback) {
    res.json(callback);
  });
});

//officer data
app.get("/officer", (req, res) => {
  // Router เวลาเรียกใช้งาน
  officer.read(function (callback) {
    res.json(callback);
  });
});

//CurriculumGroup Data
app.get("/groupdata", (req, res) => {
  // Router เวลาเรียกใช้งาน
  groupdata.read(function (callback) {
    res.json(callback);
  });
});

app.put("/groupdata/update", (req, res) => {
  // Router เวลาเรียกใช้งาน
  groupdata.update(req, function (callback) {
    res.send(callback);
  });
});

//Teach Data
app.get("/teachdata", (req, res) => {
  // Router เวลาเรียกใช้งาน
  teachdata.read(function (callback) {
    res.json(callback);
  });
});

app.post("/teachdata/update", (req, res) => {
  // Router เวลาเรียกใช้งาน
  teachdata.update(req, function (callback) {
    res.json(callback);
  });
});
//Semester Data
app.get("/semesterdata", (req, res) => {
  // Router เวลาเรียกใช้งาน
  semesterdata.read(function (callback) {
    res.json(callback);
  });
});

//Year Data
app.get("/yeardata", (req, res) => {
  // Router เวลาเรียกใช้งาน
  yeardata.read(function (callback) {
    res.json(callback);
  });
});

app.post("/uploadfile", upload.upload.single("uploadfile"), (req, res) => {
  upload.importCsvData2MySQL(__basedir + "/uploads/" + req.file.filename);
  res.json({
    msg: "File uploaded/import successfully!",
    file: req.file,
  });
});

app.post("/insert", (req, res) => {
  // Router เวลาเรียกใช้งาน
  upload.insert(req, function (callback) {
    console.log(callback.status);
    res.status(callback.status);
    res.end();
    // res.json(callback)
  });
});

//Availableroom Data
app.get("/availableroom", (req, res) => {
  // Router เวลาเรียกใช้งาน
  availableroom.read(function (callback) {
    res.json(callback);
  });
});

//update available room
app.post("/availableroom/update", (req, res) => {
  // Router เวลาเรียกใช้งาน
  availableroom.update(req, function (callback) {
    res.json(callback);
  });
});

//delete available room
app.post("/availableroom/delete", (req, res) => {
  // Router เวลาเรียกใช้งาน
  availableroom.delete(req, function (callback) {
    if (callback) {
      res.send("Success");
    } else {
      res.send("Error");
    }
  });
});

//Manage room
app.post("/manageroom", (req, res) => {
  // Router เวลาเรียกใช้งาน
  manageroom.read(req, function (callback) {
    res.json(callback);
  });
});

//teacherteach data
app.get("/teacherteach", (req, res) => {
  // Router เวลาเรียกใช้งาน

  teacherteach.read(function (callback) {
    res.json(callback);
  });
});

//facultycondition Data
app.get("/facultycondition", (req, res) => {
  // Router เวลาเรียกใช้งาน
  facultycondition.read(function (callback) {
    res.json(callback);
  });
});

//update facultycondition
app.post("/facultycondition/update", (req, res) => {
  // Router เวลาเรียกใช้งาน
  facultycondition.update(req, function (callback) {
    res.json(callback);
  });
});

//examweek Data
app.get("/examweek", (req, res) => {
  // Router เวลาเรียกใช้งาน
  examweek.read(function (callback) {
    res.json(callback);
  });
});


//t_condition
app.get("/t_condition", (req, res) => {
  // Router เวลาเรียกใช้งาน
  t_condition.read(function (callback) {
    res.json(callback);
  });
});

//update t_condition
app.post("/t_condition/update", (req, res) => {
  // Router เวลาเรียกใช้งาน
  t_condition.updatecondition(req, function (callback) {
    res.json(callback);
  });
});

//person
app.get("/person", (req, res) => {
  // Router เวลาเรียกใช้งาน
  person.read(function (callback) {
    res.json(callback);
  });
});

//t_examroom
app.get("/t_examroombuilding", (req, res) => {
  // Router เวลาเรียกใช้งาน
  t_exam_room.building(function (callback) {
    res.json(callback);
  });
});

//t_office
app.get("/t_office", (req, res) => {
  // Router เวลาเรียกใช้งาน
  t_office.read(function (callback) {
    res.json(callback);
  });
});

//exam_schedule
app.get("/exam_schedule", (req, res) => {
  // Router เวลาเรียกใช้งาน
  exam_schedule.ownsubject(function (callback) {
    res.json(callback);
  });
});

app.get("/exam_committee", (req, res) => {
    // Router เวลาเรียกใช้งาน
    exam_schedule.read(function (callback) {
      res.json(callback);
    });
  });

app.listen(port, () => {
  console.log("start port " + port);
});
