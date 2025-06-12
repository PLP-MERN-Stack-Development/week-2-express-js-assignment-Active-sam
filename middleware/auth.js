
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.headers.authentication;
  try {
    jwt.verify(token, 'secrat#');
    next();
  } catch (error) {
    res.json({success: false, message: 'Invalid token'});
  }
};

export default auth;