const express = require("express");
const router = express.Router();

const controller = require("../controllers/user_crud_controller");

router.delete("/:id", controller.deleteUser);

module.exports = router;
