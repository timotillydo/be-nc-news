const usersRouter = require("express").Router();
const { invalidMethodHandler } = require("../errors/index");
const { getUserByUsername } = require("../controllers/users-controller");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(invalidMethodHandler);

module.exports = { usersRouter };
