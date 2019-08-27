exports.customErrorHandler = (err, req, res, next) => {
  // console.log(err);
  if (err.status === 404) {
    res.status(404).send({ errMsg: err.errMsg });
  } else {
    next(err);
  }
};
