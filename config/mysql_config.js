const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
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
