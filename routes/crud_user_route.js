const express = require("express");
const router = express.Router();

const getUserFromSql = require("../middlewares/crud/get_user_details_sql");
const controller = require("../controllers/user_crud_controller");

router.get("/", (req, res) => {
  res.json({
    message: "add user id to url",
  });
});

// router.delete("/:id", controller.deleteUser);

router
  .route("/:id")
  .get(getUserFromSql, controller.sendUser)
  .put((req, res, next) => {
    res.json({
      message: "updating profile",
    });
  });

module.exports = router;
