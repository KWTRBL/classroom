var mysql = require('mysql');

var con = mysql.createConnection({
  host: "db2.reg.kmitl.ac.th",
  user: "ecms",
  password: "5RfAZxte07fNQx5J",
  database: 'View_ECMS',

});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
