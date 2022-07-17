module.exports = function errorHandler(err, req, res, next) {
  if (typeof err === "String") return res.status(400).json({ message: err });
  if (err.message === "Bad Request")
    return res.status(400).json({
      status: 400,
      success: false,
      message: err.message,
    });
  if (err.message === "ValidationError")
    return res.status(400).json({
      status: 400,
      success: false,
      message: err.message,
    });
  if (err.message === "UnauthorizedError")
    return res.status(401).json({
      status: 401,
      success: false,
      message: err.message,
    });
  if (err.message === "Unauthorized")
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Valid Access Token is required",
    });
  if (err.message === "Forbidden")
    return res.status(403).json({
      status: 403,
      success: false,
      message: err.message,
    });
  if (err.message === "NotFound")
    return res.status(404).json({
      status: 404,
      success: false,
      message: err.message,
    });
  if (err.message === "InternalServerError")
    return res.status(500).json({
      status: 500,
      success: false,
      message: err.message,
    });

  return res.status(400).json({
    status: 400,
    success: false,
    message: err.message,
  });
};
