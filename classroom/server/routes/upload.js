const fs = require('fs');
const csv = require('fast-csv');
const multer = require('multer');
const pool = require('./dbconfig')

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
                if(err) throw err;
                console.log('connected as id ' + connection.threadId);
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
