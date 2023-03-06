const { validation } = require('../common/response');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.auth = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    if (!token && typeof token === 'unidentified') {
      res.status(500).json(validation({ message: error.message }));
    }

    decodeData = jwt.verify(token, config.secret);
    next();
  } catch (error) {
    res.status(500).json(validation({ message: error.message }));
  }
}