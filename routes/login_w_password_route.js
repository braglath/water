const express = require("express");
const router = express.Router();

const validation = require("../middlewares/validations/validate_login_w_password");
const loginMiddleware = require("../middlewares/login/login_w_password_middleware");

//? first validate fields
//? then get hashed password from db using phonenumber
//? compare hashed password with password from req.body
//? if match, create token, add tokens to table and then send user details
//? if not matched, give response user not found or wrong password

router.post(
  "/",
  validation,
  loginMiddleware.comparePasswords,
  loginMiddleware.generateToken,
  loginMiddleware.updateDeviceToken,
  loginMiddleware.getUserDetails
);

module.exports = router;
