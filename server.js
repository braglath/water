require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || process.env.port;

const registerRoute = require("./routes/register_route");
const errorHandler = require("./middlewares/error_handler");
const userCRUDRoute = require("./routes/crud_user_route");
const loginRoute = require("./routes/login_route");

require("./config/mysql_config"); //? this will automatically connect to the database

app.use("/api/user", userCRUDRoute);
app.use("/api/user/register", registerRoute);
app.use("/api/user/login", loginRoute);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`sever listening on http://localhost:${port}`)
);
