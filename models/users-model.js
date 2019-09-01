const connection = require("../db/connection");

exports.selectUsers = () => {
  return connection("users")
    .select("*")
    .then(users => users);
};

exports.selectUserByUsername = username => {
  return connection("users")
    .select("*")
    .where("username", username)
    .then(user => {
      if (!user.length) {
        return Promise.reject({
          status: 404,
          errMsg: `Error 404: Username ${username} Not Found`
        });
      } else return user[0];
    });
};

exports.insertUser = newUser => {
  return connection("users")
    .insert(newUser)
    .returning("*")
    .then(user => user);
};
