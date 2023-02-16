const ApiError = require( '../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Profile, Post} = require('../models/models');

const generateJwt = (id, email, role, login) => {
   return jwt.sign(
      {id, email, role, login},
      process.env.SECRET_KEY,
      {expiresIn: '24h'},
   )
}

class UserController {
  async registration(req, res, next) {
     const {email, password, role, login} = req.body;
     if (!email || !password || !login) return next(ApiError.badRequest('Incorrect email or password'));
     const checkEmail = await User.findOne({ where: {email} });
     if (checkEmail) return next(ApiError.badRequest('This email already exist'));

     const hashPassword = await bcrypt.hash(password, 3);
     const user = await User.create({email, role, password: hashPassword});
     const profile = await Profile.create({userId: user.id, login: login});
     const token = generateJwt(user.id, user.email, user.role);
     return res.json({ token });
  }
  async login(req, res, next) {
     const { email, password } = req.body;
     const user = await User.findOne({ where: { email } });
     if (!user) return next(ApiError.badRequest('User not found'));

     const comparePassword = bcrypt.compareSync(password, user.password);
     if (!comparePassword) return next(ApiError.internal('Wrong password'));

     const token = generateJwt(user.id, user.email, user.role);
     return res.json({ token });
  }
  async check(req, res, next) {
     const token = generateJwt(req.user.id, req.user.email, req.user.role);
     return res.json({ token });
  }
}

module.exports = new UserController();
