const connection = require("../db/connection");

exports.selectUserByUsername = username => {
  return connection("users")
    .select("*")
    .where("username", username)
    .then(user => {
      if (!user.length)
        next({ status: 404, errMsg: "Error 404: Resource Not Found" });
      else return user;
    });
};
