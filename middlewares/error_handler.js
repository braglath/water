module.exports = function errorHandler(err, req, res, next) {
  if (typeof err === "String") return res.status(400).json({ message: err });
  if (err.message === "Bad Request")
    return res.status(400).json({ message: err.message });
  if (err.message === "ValidationError")
    return res.status(400).json({ message: err.message });
  if (err.message === "UnauthorizedError")
    return res.status(401).json({ message: err.message });
  if (err.message === "Unauthorized")
    return res.status(401).json({ message: err.message });
  if (err.message === "Forbidden")
    return res.status(403).json({ message: err.message });
  if (err.message === "NotFound")
    return res.status(404).json({ message: err.message });
  if (err.message === "InternalServerError")
    return res.status(500).json({ message: err.message });

  return res.status(400).json({ message: err.message });
};
