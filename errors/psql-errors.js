exports.psqlErrorHandler = (err, req, res, next) => {
  const badReqCodes = ["22P02", "23502"];
  const badPathCodes = ["23503"];
  if (badReqCodes.includes(err.code)) {
    res.status(400).send({ errMsg: "Error 400: Bad Request" });
  } else if (badPathCodes.includes(err.code)) {
    res.status(404).send({ errMsg: "Error 404: Resource Not Found" });
  } else {
    next(err);
  }
};
