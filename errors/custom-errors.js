exports.customErrorHandler = (err, req, res, next) => {
  // console.log(err);
  const statusCodes = [400, 404, 422];
  if (statusCodes.includes(err.status)) {
    res.status(err.status).send({ errMsg: err.errMsg });
  } else {
    next(err);
  }
};

exports.invalidMethodHandler = (req, res, next) => {
  res.status(405).send({ errMsg: "Error 405: Method Not Allowed" });
};
