const isAdmin = (req, res, next) => {
  if (req.user.isAdmin) return next();

  return res.status(403).send({ message: "permission denied" });
};

module.exports = isAdmin;
