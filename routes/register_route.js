const express = require("express");
const router = express.Router();

const validation = require("../middlewares/validations/validate_registration_fields");
const hashPassword = require("../middlewares/registration/hash_password");
const registrationController = require("../controllers/register_user");

router.post(
  "/",
  /// validate each fields
  validation,
  /// check if there is already a user with that phonenumber
  registrationController.checkUserExists,
  /// if no existing user
  /// hash the password
  hashPassword,
  /// register and save user to DB and get the user details from DB
  registrationController.registerUser
);

module.exports = router;
