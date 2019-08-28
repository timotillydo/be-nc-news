exports.customErrorHandler = (err, req, res, next) => {
  // console.log(err);
  const statusCodes = [400, 404];
  if (err.status === 400) {
    res.status(400).send({ errMsg: err.errMsg });
  } else if (err.status === 404) {
    res.status(404).send({ errMsg: err.errMsg });
  } else {
    next(err);
  }
};
