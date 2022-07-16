require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || process.env.port;

const customerRegisterRoute = require("./routes/customer_register_route");
const providerRegisterRoute = require("./routes/provider_register_route");
const errorHandler = require("./middlewares/error_handler");
const userCRUDRoute = require("./routes/crud_user_route");
const loginRoute = require("./routes/login_route");
const deleteUser = require("./routes/delete_user_route");
const loginWPwdRoute = require("./routes/login_w_password_route");
const jwtAuth = require("./middlewares/jwt_verify_middleware");
const verifyJWT = require("./middlewares/auth/verify_jwt");

require("./config/mysql_config"); //? this will automatically connect to the database

app.use("/api/register/customer", customerRegisterRoute);
app.use("/api/login", loginRoute);
app.use("/api/login-password", loginWPwdRoute);
app.use("/api/user", deleteUser);
//? need token for below routes
app.use(jwtAuth);
app.use(verifyJWT);
app.use("/api/register/provider", providerRegisterRoute);
app.use("/api/user", userCRUDRoute);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`sever listening on http://localhost:${port}`)
);
