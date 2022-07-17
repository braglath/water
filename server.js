require("dotenv").config();
const sql = require("./config/mysql_config");
const app = require("./app");

const port = process.env.PORT || process.env.port;

sql.connect(function (err) {
  if (err) {
    console.log(`sql database connection error ~ ${err}`);
    return;
    // throw err;
  }
  console.log(`---------------WATER SERVER---------------`);
  console.log(`|`);
  console.log(`- Database connected`);
  console.log(`|`);
  console.log(`- Starting Server`);
  console.log(`|`);
  app.listen(port, () => {
    console.log(`- Sever listening on http://localhost:${port}`);
    console.log(`|`);
    console.log(`------------------------------------------`);
  });
});

// module.exports = app;
