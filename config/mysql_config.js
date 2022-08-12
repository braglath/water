const mysql = require("mysql");

const con = mysql.createConnection({
  host: "13.126.10.179",
  user: "root",
  password: "root",
  database: "water",
});

module.exports = con;
// con.connect(function (err) {
//   if (err) throw err;
//   console.log("sql database connected!");
// });

module.exports = con;
