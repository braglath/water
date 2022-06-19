module.exports = function errorHandler(err, req, res, next) {
  if (typeof err === "String") return res.status(400).json({ message: err });
  if (typeof err === "Bad Request")
    return res.status(400).json({ message: err.message });
  if (typeof err === "ValidationError")
    return res.status(400).json({ message: err.message });
  if (typeof err === "UnauthorizedError")
    return res.status(401).json({ message: err.message });
  if (typeof err === "NotFound")
    return res.status(404).json({ message: err.message });
  if (typeof err === "InternalServerError")
    return res.status(500).json({ message: err.message });

  return res.status(400).json({ message: err.message });
};
