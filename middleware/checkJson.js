export default (err, req, res, next) => {
  if (err) {
    res.status(400).json({ erro: 'Invalid Request data' });
  } else {
    next();
  }
};
