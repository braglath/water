const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "water",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("sql database connected!");
});

module.exports = con;
