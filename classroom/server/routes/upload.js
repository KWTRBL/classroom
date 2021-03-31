const fs = require('fs');
const csv = require('fast-csv');
const multer = require('multer');
const {pool} = require('./dbconfig')

global.__basedir = __dirname;


var upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __basedir + '/uploads/')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
        }
    })
});
module.exports.upload = upload

module.exports.importCsvData2MySQL = function importCsvData2MySQL(filePath) {
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
            pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log('connected as id ' + connection.threadId);
                console.log(csvData, typeof (csvData))
                pool.query(query, [csvData], (err, rows) => {
                    //if(err) throw err;
                    if (err) {
                        console.error('error connecting: ' + err.stack);
                        connection.release(); // return the connection to pool
                        return;
                    }
                    connection.release(); // return the connection to pool

                });
            });

            // delete file after saving to MySQL database
            // -> you can comment the statement to see the uploaded CSV file.
            fs.unlinkSync(filePath)
        });
    stream.pipe(csvStream);
}



module.exports.insert = function (req, callback) {
    data = req.body.data

    //for get same column index
    let sameindex = []

    /*
            get index data colunm
            ex. 
               if ['dept_id','curr2_id'] dataindex = [0,1]
    */
    let dataindex = []

    //column in teach_table
    let columname = [
        'dept_id',
        'curr2_id',
        'subject_id',
        'semester',
        'year',
        'class',
        'section',
        'limit',
        'room_no',
        'building_no',
        'teach_day',
        'teach_time',
        'teach_time2',
        'lect_or_prac',
        'subj_type',
        'teach_status' ]


    //find same column index in csv
    for(var i =0;i<columname.length;i++ ){
        for(var j =0;j<data[0].length;j++ ){
            if(columname[i] == data[0][j]){
                sameindex.push(j)
            }
            if(i == columname.length -1){
                dataindex.push(j)
            }
        }
    }

    // find notsame column index csv
    sameindex.map(data =>{
        var index = dataindex.indexOf(data)
        dataindex.splice(index,1)
    })

    //sort max index for delete element
    dataindex.sort(function(a, b){
        return b-a;
    })
    

    //delete not same column index
    dataindex.map(element => {
        for(var i=0;i<data.length;i++){
            data[i].splice(element,1)
        }
    });
    
    //del column name row
    data.shift();

    //del last row because row is null
    data.pop();

    let sql = `INSERT INTO customer (id, address, name, age) VALUES ?
    ON DUPLICATE KEY UPDATE
    address = VALUES(address),
    age = VALUES(age)`;
    let query = `INSERT INTO 
    teach_table (
        dept_id,
        curr2_id,
        subject_id,
        semester,
        year,
        class,
        section,
        studentnum,
        room_no,
        building_no,
        teach_day,
        teach_time,
        teach_time2,
        lect_or_prac,
        subj_type
    )
    VALUES ? ON DUPLICATE KEY UPDATE 
    dept_id = VALUES(dept_id),
    curr2_id = VALUES(curr2_id),
    subject_id = VALUES(subject_id),
    semester = VALUES(semester),
    year = VALUES(year),
    class = VALUES(class),
    section = VALUES(section),
    studentnum = VALUES(studentnum),
    room_no = VALUES(room_no),
    building_no = VALUES(building_no),
    teach_day = VALUES(teach_day),
    teach_time = VALUES(teach_time),
    teach_time2 = VALUES(teach_time2),
    lect_or_prac = VALUES(lect_or_prac),
    subj_type = VALUES(subj_type)`;
    
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        pool.query(query, [data], (err, rows) => {
            //if(err) throw err;
            if (err) {
                callback({status:404})
                //console.error('error connecting: ' + err.stack);
                connection.release(); // return the connection to pool
                return;
            }
            callback({status:200})
            connection.release(); // return the connection to pools
        });
    });

}