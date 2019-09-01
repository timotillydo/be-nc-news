const usersRouter = require("express").Router();
const { invalidMethodHandler } = require("../errors/index");
const {
  getUsers,
  getUserByUsername,
  postUser
} = require("../controllers/users-controller");

usersRouter
  .route("/")
  .get(getUsers)
  .post(postUser)
  .all(invalidMethodHandler);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(invalidMethodHandler);

module.exports = { usersRouter };
