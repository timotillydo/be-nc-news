exports.psqlErrorHandler = (err, req, res, next) => {
  const badReqCodes = ["22P02", "23502"];
  const unproccessableCodes = ["23503"];
  // console.log(err);
  if (badReqCodes.includes(err.code)) {
    res.status(400).send({ errMsg: "Error 400: Bad Request" });
  } else if (unproccessableCodes.includes(err.code)) {
    res.status(422).send({
      errMsg: "Error 422: Unprocessable Entity"
    });
  } else {
    next(err);
  }
};
