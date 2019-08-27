exports.psqlErrorHandler = (err, req, res, next) => {
  const errorCodes = ["22P02"];

  if (errorCodes.includes(err.code)) {
    res.status(400).send({ errMsg: "Error 400: Bad Request" });
  } else {
    next(err);
  }
};
