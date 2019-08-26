const { selectUserByUsername } = require("../models/users-model");

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  // console.log(username);
  selectUserByUsername(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};
